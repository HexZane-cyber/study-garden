const assert=require('node:assert/strict'),F=require('../docs/assets/vault-formats.js');
for(const [kind,extensions] of Object.entries(F.groups))for(const ext of extensions){assert(F.supported('notes/a.'+ext.toUpperCase()));assert.equal(F.kind('notes/a.'+ext),kind);assert(F.accept.includes('.'+ext));}
assert(!F.supported('a.exe'));assert(!F.supported('noextension'));assert(!F.supported('a.pdf.exe'));
assert(F.text('data.csv'));assert(F.text('notebook.ipynb'));assert(F.text('page.html'));assert(!F.markdown('page.html'));assert(!F.text('slides.pptx'));assert(!F.text('notes.zip'));
assert.equal(F.mime('wrong-type.MP4'),'video/mp4');assert.equal(F.mime('a.pdf'),'application/pdf');
console.log('Vault formats passed: all supported extensions, mixed types, MIME fallback, plain-text preview and unsupported files.');
