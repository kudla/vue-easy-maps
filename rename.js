'use strict';
/*eslint no-console:*/

var fs = require('fs');
var execSync = require('child_process').execSync;
var NAME_FORMAT = /^[a-z][a-z\d-]*$/;

var toName = process.argv[2];

if (!toName) {
    console.log('Usage: npm run rename new-package-name');
    process.exit();
}
if (!toName.match(NAME_FORMAT)) {
    console.log('Package name format should be', NAME_FORMAT);
    process.exit();
}
var packageSource = fs.readFileSync('package.json').toString();
var renamedSource = packageSource.replace(/npm-package-template/g, toName);
var packageOptions = JSON.parse(renamedSource);

delete packageOptions.scripts.rename;
packageOptions.keywords = [];
packageOptions.version = '0.0.0';

fs.writeFileSync('.package-bak.json', packageSource);
fs.writeFileSync('package.json', JSON.stringify(packageOptions, null, 2));

var readme = fs.readFileSync('README.md').toString();
fs.writeFileSync('.README-bak.md', readme);
fs.writeFileSync('README.md', readme.replace(/npm-package-template/g, toName));

fs.unlink('rename.js');

var commitCommands = [
    'git add -A :/',
    'git commit -m "template renamed to ' + toName + '"'
];

for(var commandIndex in commitCommands) {
    var command = commitCommands[commandIndex];
    execSync(command, {stdio:[0,1,2]});
}
