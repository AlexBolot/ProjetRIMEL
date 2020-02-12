import { readFileSync, existsSync, mkdirSync } from "fs-extra";
import * as yamlExplorer from '../metrics/yamlExplorer';
import { EOL } from "os";
import { cloneSync } from "./Git";
import { filterFile } from "../metrics/filterFiles";
import { AstExplorer } from "../metrics/DockerFileAstExplorer";
import { writeFileSync } from "fs";
import { join } from "path";
import { GlobalMetrics } from "../metrics/model_metrics";
import { MardownExplorer } from "../metrics/MardownExplorer";
import { ShellAnalyser } from "../metrics/ShellAnalyser";

const workspace = "./workspace/"
const langdir = "./lang/"

export function parseList(file: string): { lang: string, urls: Array<string>} {
    let parts : string[] = readFileSync(file).toString().split(EOL);
    parts.reverse();
    const lang = parts.pop();
    return { 'lang': lang, 'urls': parts.reverse() };
}

export function crawlLang(lang: string, urls: Array<string>, securityfile: String) {
    // if directory lang don't exists create it
    const securityParts = readFileSync(securityfile).toString().split(EOL)

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
        crawlRepo(r, langdir+lang, securityParts);
    });
}

export function crawlRepo(url: string, baseDir: string, securityParts: string[]) {
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
    const globalMetrics = new GlobalMetrics();
    // get all metrics (dockerfile, docker-compose, Readme) -> agregate
    // DockerFile -- Analyse build binaire and build image  
    const dockerfilePath = filterFile(workspace+name, "DOCKERFILE",true)[0];
    const dockerfileExplorer = new AstExplorer(dockerfilePath, securityParts, globalMetrics);
    dockerfileExplorer.explore();  

    //Analyse Exec part 
    //shellScript
    const shellPaths = filterFile(workspace+name,".sh",false);
    let findExecCommand = false;
    if(shellPaths!= undefined){
        const shellAnalyser = new ShellAnalyser(shellPaths,globalMetrics);
        findExecCommand = shellAnalyser.analyse();
    }

    //readme
    if(!findExecCommand){
        const readMePath = filterFile(workspace+name, "README",false);  
        if(readMePath!=undefined){
            const mardownExplorer = new MardownExplorer(readMePath,globalMetrics);
            mardownExplorer.explorer();
        }        
    }

    //TODO agregate

    // store agregate
    console.log(globalMetrics);
    writeFileSync(join(baseDir,name), JSON.stringify(globalMetrics.toPrintableJson()));
}


// docker-compose 
//todo
/*const dockerComposeList = filterFile(workspace+name, "docker-compose");
if(dockerComposeList.length>0){
    const pathsDockerCompose = filterFile(workspace+name, "docker-compose")[0];
    yamlExplorer.parseYaml(pathsDockerCompose, globalMetrics);        
}else{
    console.log("Docker-compose is missing ! Because everyone don't care about docker-compose lol");
}*/