const assert=require('node:assert/strict'),M=require('../docs/assets/practice-model.js'),questions=require('../docs/assets/exercises.json').questions,byId=new Map(questions.map(q=>[q.id,q]));
const close=(a,b,eps=1e-10)=>assert(Math.abs(a-b)<eps,`${a} versus ${b}`),numeric={
 'hold-min-delay':Math.max(0,0.12e-9-(0.06e-9+0.02e-9))/1e-12,
 'elmore-two-section':(1000*10e-15+(1000+2000)*20e-15)/1e-12,
 'sheet-resistor':50*(30e-6/3e-6),
 'adc-quantization-step':(2/(2**12))*1000,
 'qpsk-rrc-bandwidth':(4e6/Math.log2(4))*(1+0.25)/1e6,
 'block-code-bitrate':1e6/(4/7)/1e6,
 'markov-two-state':0.1/(0.1+0.2)
};
for(const [id,value]of Object.entries(numeric)){const q=byId.get(id);assert(q,id);close(q.expected,value);assert(M.evaluate(q,String(value)).correct,id);assert(!M.evaluate(q,String(value*1000)).correct,id+' unit-scale error');assert(q.hints.length&&q.solution.length&&q.minutes>0);}
assert(M.evaluate(byId.get('adc-quantization-step'),'0.488').correct);assert(M.evaluate(byId.get('markov-two-state'),'0.333').correct);assert(!M.evaluate(byId.get('markov-two-state'),'33.333').correct);close(numeric['markov-two-state'],(1-numeric['markov-two-state'])*0.1+numeric['markov-two-state']*0.8);
const complex=[[1,0],[0,1],[-1,0]],h=[...complex].reverse().map(([re,im])=>[re,im===0?0:-im]);assert.deepEqual(h,[[-1,0],[0,-1],[1,0]]);const q=byId.get('complex-matched-filter');assert.equal(q.options[q.correct],'[−1, −j, 1]');assert(M.evaluate(q,String(q.correct)).correct);assert(!M.evaluate(q,String((q.correct+1)%q.options.length)).correct);
const old={divider:{...M.blank(),answer:'8',checked:true}},backup=M.backup(old,questions),restored=M.restore(backup,questions);assert.deepEqual(restored,old);assert.equal(M.state(byId.get('hold-min-delay'),restored['hold-min-delay']),'unanswered');console.log('New exercise answers passed: independent SI-unit calculations, rounding tolerances, Markov balance, complex conjugate reversal, wrong-unit rejection and existing-record compatibility.');
