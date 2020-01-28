const fs = require('fs');
const request = require('request');
const path = require('path');


// --------------------------------------------------------------------------- //

let items;
const filtered = [];

main().then(() => console.log('... Done'));

async function main() {

    let url = 'https://api.github.com/search/repositories?q=docker+language:java&sort=stars&order=desc&per_page=100';

    const result = { text: '' };

    for (let i = 1; i < 11; i++) {
        await processPage(url + `&page=${i}`, result);
    }

    await save('java', result.text);
}

async function processPage(url, out) {
    request(url, { json: true, headers: { 'User-Agent': 'AlexBolot' } }, async (err, res, body) => {

        items = body.items;

        out.text += 'Java\n';

        for (let j = 0; j < items.length - 1; j++) {

            const smollURL = `https://raw.githubusercontent.com/${getFullName(j)}/master/Dockerfile`;
            request.get(smollURL, { headers: { 'User-Agent': 'AlexBolot' } }, (err, res, body) => {
                if (body.trim() !== '404: Not Found') {
                    console.log(getFullName(j));
                    filtered.push(getFullName(j));
                }
            });

            out.text += `${getStars(j)},${getFullName(j)}\n`;
        }

    });

}


function getStars(index) {
    return items[index]['stargazers_count'];
}

function getFullName(index) {
    return items[index]['full_name'];
}

async function save(language, data) {
    await fs.writeFileSync(path.join('.', `${language}-output.txt`), data, "UTF-8", { 'flags': 'a+' });
}
