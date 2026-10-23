const assert=require('node:assert/strict'),F=require('../docs/assets/vault-formats.js');
for(const [kind,extensions] of Object.entries(F.groups))for(const ext of extensions){assert(F.supported('notes/a.'+ext.toUpperCase()));assert.equal(F.kind('notes/a.'+ext),kind);assert(F.accept.includes('.'+ext));}
assert(!F.supported('a.exe'));assert(!F.supported('noextension'));assert(!F.supported('a.pdf.exe'));
assert(F.text('data.csv'));assert(F.text('notebook.ipynb'));assert(F.text('page.html'));assert(!F.markdown('page.html'));assert(!F.text('slides.pptx'));assert(!F.text('notes.zip'));
assert.equal(F.mime('wrong-type.MP4'),'video/mp4');assert.equal(F.mime('a.pdf'),'application/pdf');
console.log('Vault formats passed: all supported extensions, mixed types, MIME fallback, plain-text preview and unsupported files.');

const existing=[{id:'old',path:'note.md',size:10},{id:'copy',path:'note (2).md',size:10}];
const incoming=[{name:'note.md',size:20},{name:'note.md',size:30}];
let plan=F.planImport(incoming,existing);assert.deepEqual(plan.accepted.map(f=>f.path),['note (3).md','note (4).md']);assert.equal(plan.renamed,2);
plan=F.planImport(incoming,existing,'replace');assert.equal(plan.accepted.length,1);assert.equal(plan.accepted[0].replace.id,'old');assert.equal(plan.accepted[0].file.size,30);
assert.equal(F.planImport(incoming,existing,'skip').skipped,2);
assert.equal(F.planImport([{name:'a.md',webkitRelativePath:'Vault/.obsidian/a.md'}],[],'keep',true).accepted.length,0);
assert.equal(F.planImport([{name:'a.md',webkitRelativePath:'Vault/../a.md'}],[],'keep',true).accepted.length,0);
