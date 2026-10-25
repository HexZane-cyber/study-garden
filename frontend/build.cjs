const esbuild=require('esbuild');
const path=require('node:path');
esbuild.buildSync({entryPoints:[path.join(__dirname,'graph3d.js')],outfile:path.join(__dirname,'../docs/assets/vendor/graph3d.bundle.js'),bundle:true,minify:true,format:'iife',globalName:'Graph3D',target:'es2020',legalComments:'eof'});

esbuild.buildSync({entryPoints:[path.join(__dirname,'chip3d.js')],outfile:path.join(__dirname,'../docs/assets/vendor/chip3d.bundle.js'),bundle:true,minify:true,format:'iife',globalName:'Chip3D',target:'es2020',legalComments:'eof'});
