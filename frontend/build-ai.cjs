const esbuild=require('esbuild'),path=require('node:path'),fs=require('node:fs');
const vendor=path.join(__dirname,'../docs/assets/vendor');
const options={bundle:true,minify:true,format:'iife',target:'es2022',legalComments:'eof'};
esbuild.buildSync({...options,entryPoints:[path.join(__dirname,'local-ai-runtime.js')],outfile:path.join(vendor,'local-ai-runtime.bundle.js'),globalName:'ZhixinWebLLM'});
esbuild.buildSync({...options,entryPoints:[path.join(__dirname,'local-ai-worker.js')],outfile:path.join(vendor,'local-ai-worker.bundle.js')});
fs.copyFileSync(path.join(__dirname,'node_modules/@mlc-ai/web-llm/LICENSE'),path.join(vendor,'webllm-LICENSE.txt'));
fs.copyFileSync(path.join(__dirname,'node_modules/loglevel/LICENSE-MIT'),path.join(vendor,'loglevel-LICENSE.txt'));
console.log('Built WebLLM runtime and worker. Model weights are not included or downloaded.');
