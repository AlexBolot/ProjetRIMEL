import { readFileSync, existsSync, mkdirSync } from "fs-extra";
import { EOL } from "os";
import { cloneSync } from "./Git";
import { filterFile } from "./metrics/filterFiles";
import { AstExplorer } from "./metrics/DockerFileAstExplorer";
import { writeFileSync } from "fs";
import { join } from "path";

const workspace = "./workspace/"
const langdir = "./lang/"

export function parseList(file: string): { lang: string, urls: Array<string>} {
    let parts : string[] = readFileSync(file).toString().split(EOL);
    parts.reverse();
    const lang = parts.pop();
    return { 'lang': lang, 'urls': parts.reverse() };
}

export function crawlLang(lang: string, urls: Array<string>) {
    // if directory lang don't exists create it
    if (! existsSync(langdir)) {
        mkdirSync(langdir);
    }

    if (! existsSync(langdir+lang)) {
        mkdirSync(langdir+lang);
    }

    // for each repo if file exists delete, else crawl
    console.log(urls);
    urls.forEach(r => {
        if (existsSync(r)) {
            //removeSync("lang/"+);
        }
        crawlRepo(r, langdir+lang);
    });
}

export function crawlRepo(url: string, baseDir: string) {
    console.log("processing "+url);
    const parts  = url.split("/");
    const name = parts[parts.length -1];

    if (! existsSync(workspace)) {
        mkdirSync(workspace);
    }

    // clone repo or pull last version
    if (! existsSync(workspace+name)) {
        cloneSync(url, workspace+name);
    }

    // get all metrics (dockerfile, docker-compose, Readme) -> agregate
    // DockerFile
    const dockerfileExplorer = new AstExplorer(filterFile(workspace+name, "DOCKERFILE")[0]);
    const docker_metrics = dockerfileExplorer.explore();

    //TODO agregate

    // store agregate
    writeFileSync(join(baseDir,name), JSON.stringify(docker_metrics.toPrintableJson()));
}