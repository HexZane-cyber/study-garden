"""Independent calculations for the authored exercises, beyond grading implementation."""
import json
import math
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = json.loads((ROOT / 'docs/assets/exercises.json').read_text(encoding='utf-8'))['questions']
Q = {q['id']: q for q in QUESTIONS}


class ExerciseAnswers(unittest.TestCase):
    def test_numeric_physics_and_units(self):
        # Calculate SI quantities first, convert to the units requested in the question.
        answers = {
            'divider': 12 * 6000 / (3000 + 6000),
            'thevenin': (1 / (1 / 3000 + 1 / 6000)) / 1000,
            'rc-tau': 10000 * 100e-9 / 1e-3,
            'rc-step': 5 * (1 - math.exp(-1)),
            'opamp': -(47000 / 10000) * .2,
            'mos-square': .5 * 1e-3 * (1.2 - .4) ** 2 / 1e-3,
            'cmos-power': .2 * 20e-12 * 1.2 ** 2 * 100e6 / 1e-3,
            'setup-time': (.2e-9 + 3e-9 + .3e-9) / 1e-9,
            'lti-step': 1 / 2,  # integral exp(-2t), t >= 0
            'alias': abs(7000 - 10000) / 1000,
            'dft-grid': 8000 / 256,
            'shannon': 1e6 * math.log2(1 + 15) / 1e6,
            'binary-entropy': sum(-p * math.log2(p) for p in [.25, .75]),
            'snr-db': 10 ** (10 / 10),
            'hold-min-delay': max(0, .12e-9 - (.06e-9 + .02e-9)) / 1e-12,
            'elmore-two-section': (1000 * 10e-15 + (1000 + 2000) * 20e-15) / 1e-12,
            'sheet-resistor': 50 * (30e-6 / 3e-6),
            'adc-quantization-step': (2 / 2 ** 12) / 1e-3,
            'qpsk-rrc-bandwidth': ((4e6 / math.log2(4)) * (1 + .25)) / 1e6,
            'block-code-bitrate': (1e6 / (4 / 7)) / 1e6,
            'markov-two-state': .1 / (.1 + .2),
        }
        self.assertEqual(set(answers), {q['id'] for q in QUESTIONS if q['kind'] == 'number'})
        for id_, answer in answers.items():
            with self.subTest(question=id_):
                self.assertAlmostEqual(Q[id_]['expected'], answer, places=8)

    def test_logic_and_sampling(self):
        def chosen(id_):
            q = Q[id_]
            return q['options'][q['correct']]
        self.assertEqual(chosen('nonblocking'), 'a=1，b=0')
        self.assertEqual(chosen('nand'), 'NAND 与非门')
        x, h = [1, 2], [1, 1]
        y = [sum(x[k] * h[n-k] for k in range(len(x)) if 0 <= n-k < len(h)) for n in range(3)]
        self.assertEqual(json.loads(chosen('convolution')), y)
        viable = [o for o in Q['sampling']['options'] if float(o.split()[0]) > 2 * 3]
        self.assertEqual(viable, [chosen('sampling')])
        self.assertEqual(chosen('bpsk'), 'Q(sqrt(2Eb/N0))')
        sequence = [1, 1j, -1]
        matched = [complex(value).conjugate() for value in reversed(sequence)]
        self.assertEqual(matched, [-1, -1j, 1])
        self.assertEqual(chosen('complex-matched-filter'), '[−1, −j, 1]')

    def test_build_validator(self):
        import sys
        sys.path.insert(0, str(ROOT))
        import hooks
        self.assertEqual(len(hooks.load_exercises(ROOT / 'docs')['questions']), len(QUESTIONS))


if __name__ == '__main__':
    unittest.main()
