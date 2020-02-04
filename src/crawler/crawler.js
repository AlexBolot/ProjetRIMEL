const fs = require('fs');
const request = require('request');
const path = require('path');
const chalk = require('chalk');

const clientSecret = require('./clientSecret');

// --------------------------------------------------------------------------- //


let items;

// languages : java, C%23 (C#),

const languages = {
    'java': 'java',
    'C#': 'C%23',
    'go': 'go',
    'python': 'python'
};

const language = 'python';
const fileName = path.join(__dirname, '..', 'generated', `${language}-output-tmp.txt`);

main();

async function main() {

    fs.writeFileSync(fileName, `${language}\n`);

    let url = `https://api.github.com/search/repositories?q=docker+language:${languages[language]}&sort=stars&order=desc&per_page=100`;

    for (let i = 1; i < 10; i++) {
        await processPage(`${url}&page=${i}&client_id=AlexBolot&client_secret=${clientSecret.secret}`);
    }
}

async function processPage(url) {
    request(url, { json: true, headers: { 'User-Agent': 'AlexBolot' } }, async (err, res, body) => {

        if (body === undefined || body.items === undefined) {
            console.log(`body or items undefined for ${getFullName()}`);
            return;
        }

        items = body.items;

        for (let j = 0; j < items.length - 1; j++) {

            const smollURL = `https://raw.githubusercontent.com/${getFullName(j)}/master/Dockerfile`;
            const smollURL2 = `https://raw.githubusercontent.com/${getFullName(j)}/master/docker/Dockerfile`;

            request.get(smollURL, { headers: { 'User-Agent': 'AlexBolot' } }, (err, res, body) => {
                if (body === undefined) {
                    console.log("------");
                    return;
                }

                if (body.trim() === '404: Not Found') {
                    console.log(chalk.red(`${getFullName(j)} has no dockerfile`));
                } else {
                    save(`https://github.com/${getFullName(j)}\n`);
                    console.log(chalk.blue(`${getFullName(j)}`));
                }

            });

            request.get(smollURL2, { headers: { 'User-Agent': 'AlexBolot' } }, (err, res, body) => {
                if (body === undefined) {
                    console.log("------");
                    return;
                }

                if (body.trim() === '404: Not Found') {
                    console.log(chalk.yellow(`${getFullName(j)} has no dockerfile`));
                } else {
                    save(`https://github.com/${getFullName(j)}\n`);
                    console.log(chalk.blue(`${getFullName(j)}`));
                }
            });
        }
    });

}

function getFullName(index) {
    return items[index]['full_name'];
}

function save(data) {
    fs.appendFileSync(fileName, data);
}
