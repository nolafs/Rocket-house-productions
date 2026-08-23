const fs = require('fs');
const path = require('path');

const src = path.resolve('node_modules/@img/sharp-libvips-darwin-arm64');
const dest = path.resolve('node_modules/sharp/node_modules/@img/sharp-libvips-darwin-arm64');

if (fs.existsSync(src) && fs.existsSync(path.dirname(dest)) && !fs.existsSync(dest)) {
  fs.symlinkSync(src, dest);
  console.log('Linked sharp-libvips-darwin-arm64 into sharp/node_modules/@img/');
}
