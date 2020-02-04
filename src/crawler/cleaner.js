const path = require('path');
const neek  = require('neek');
const beep = require('beepbeep');
// --------------------------------------------------------------------------- //

const readable = path.join(__dirname, 'java-output-tmp.txt');
const writable = path.join(__dirname, 'java-output.txt');

neek.unique(readable, writable, function(result){
    console.log(result);
    beep(2);
});

