import { readFileSync, existsSync, mkdirSync } from "fs-extra";
import { EOL } from "os";
import { clone, deleteCurRepo } from "./Git";
import { filterFile } from "../metrics/filterFiles";
import { AstExplorer } from "../metrics/DockerFileAstExplorer";
import { writeFileSync, exists, readFile } from "fs";
import { join } from "path";
import { GlobalMetrics } from "../metrics/model_metrics";
import { MardownExplorer } from "../metrics/MardownExplorer";
import { ShellAnalyser } from "../metrics/ShellAnalyser";

const workspace = "./workspace/"
const langdir = "./lang/"

export function parseList(file: string): { lang: string, urls: Array<string> } {
    let parts: string[] = readFileSync(file).toString().split(EOL);
    parts.reverse();
    const lang = parts.pop();
    return { 'lang': lang, 'urls': parts.reverse() };
}

export function crawlLang(lang: string, urls: Array<string>, securityfile: String) {
    // if directory lang don't exists create it
    const securityParts = readFileSync(securityfile).toString().split(EOL)

    if (!existsSync(langdir)) {
        mkdirSync(langdir);
    }

    if (!existsSync(langdir + lang)) {
        mkdirSync(langdir + lang);
    }

    if (! existsSync(workspace)) {
        mkdirSync(workspace);
    }

    // for each repo if file exists delete, else crawl
    console.log(urls);
    urls.forEach(r => {
        if (existsSync(r)) {
            //removeSync("lang/"+);
        }
        crawlRepo(r, langdir + lang, securityParts);
    });
}

function existsAsync(path) {
    return new Promise((resolve, reject) => {
        exists(path, function (exists) {
            resolve(exists);
        })
    })
}

function readAsync(path) {
    return new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

export async function crawlRepo(url: string, baseDir: string, securityParts: string[]) {
    console.log("processing " + url);
    const parts = url.split("/");
    const name = parts[parts.length - 1];
    const owner = parts[parts.length - 2];

    //const repo: Node = await getRooOfRepo(owner, name);
    //console.log(JSON.stringify(repo));



    if (await existsAsync(join(baseDir, name))) { return; }

    // clone repo or pull last version
    if (!await existsAsync(workspace + name)) {
        await clone(url, workspace + name);
    } else {
        return;
    }
    
    const globalMetrics = new GlobalMetrics();
    // get all metrics (dockerfile, docker-compose, Readme) -> agregate
    // DockerFile -- Analyse build binaire and build image  
    const dockerfilePath = (await filterFile(workspace + name, "DOCKERFILE", true))[0];
    const dockerfileExplorer = new AstExplorer(dockerfilePath, securityParts, globalMetrics);
    try{
        dockerfileExplorer.explore();
    }catch (e) {
        globalMetrics.makeInvalid("invalid dockerfile");
    }

    //Analyse Exec part 
    //shellScript
    const shellPaths = await filterFile(workspace + name, ".sh", false);
    let findExecCommand = false;
    if (shellPaths != undefined) {
        const shellAnalyser = new ShellAnalyser(shellPaths, globalMetrics);
        findExecCommand = shellAnalyser.analyse();
        globalMetrics.execSource = "shell";
    }

    //readme
    if (!findExecCommand) {
        const readMePath = await filterFile(workspace + name, "README", false);
        if (readMePath != undefined) {
            const mardownExplorer = new MardownExplorer(readMePath, globalMetrics);
            mardownExplorer.explorer();
            globalMetrics.execSource = "readme";
        }
    }

    // store metrics
    console.log(globalMetrics);
    writeFileSync(join(baseDir, name), JSON.stringify(globalMetrics.toPrintableJson()));

    // remove clonned repo
    await deleteCurRepo(url);
}
