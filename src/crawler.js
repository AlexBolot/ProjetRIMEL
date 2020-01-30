const fs = require('fs');
const request = require('request');
const path = require('path');


// --------------------------------------------------------------------------- //

let items;

main();

async function main() {

    let url = 'https://api.github.com/search/repositories?q=language:java&sort=stars&order=desc&per_page=2';

    const result = { text: 'Java\n' };

    for (let i = 1; i < 3; i++) {
        await processPage(url + `&page=${i}`, result);
    }

    await save('java', result.text);
    console.log('... Done');
}

async function processPage(url, out) {
    request(url, { json: true, headers: { 'User-Agent': 'AlexBolot' } }, async (err, res, body) => {

        if (body === undefined || body.items === undefined)
            return;

        items = body.items;
        console.log(`${items.length} - for - ${url}`);

        for (let j = 0; j < items.length - 1; j++) {

            const smollURL = `https://raw.githubusercontent.com/${getFullName(j)}/master/Dockerfile`;
            request.get(smollURL, { headers: { 'User-Agent': 'AlexBolot' } }, (err, res, body) => {

                if (body === undefined)
                    return;

                if (body.trim() !== '404: Not Found') {
                    out.text += `https://github.com/${getFullName(j)}\n`;
                }
            });
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
