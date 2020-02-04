const path = require('path');
const neek = require('neek');
const beep = require('beepbeep');
// --------------------------------------------------------------------------- //

// 'java', 'C#', 'go', 'python'
const language = 'python';

const readable = path.join(__dirname, '..', 'generated', `${language}-output-tmp.txt`);
const writable = path.join(__dirname, '..', 'generated', `${language}-output.txt`);

neek.unique(readable, writable, function (result) {
    console.log(result);
    beep(2);
});

