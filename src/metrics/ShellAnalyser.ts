import { GlobalMetrics } from "./model_metrics"
import { readSync, readFileSync } from "fs";
import { EOL } from "os";

export class ShellAnalyser {
    files: string[]
    globalMetrics: GlobalMetrics

    constructor (files: string[], globalMetrics: GlobalMetrics){
        this.files = files;
        this.globalMetrics = globalMetrics;
    }

    analyse() : boolean{
        for(let f in this.files) {
            if (this.analyseFile(f)) return true;
        }
        return false;
    }

    analyseFile(file: string): boolean {
        const lines = readFileSync(file).toString().split(EOL);
        for (let index = 0; index < lines.length; ++index) {
            if (lines[index].includes("docker run")) {
                if (analyseLine(lines, index, this.globalMetrics)) return true;
            }
        }
        return false;
    }

    
}


function parseVariable(v: string) : string{
    if (v.includes("=")) return v.split("=")[0];
    return v;
}

export function analyseLine(lines: string[], index: number, globalMetrics: GlobalMetrics): boolean {
    let line = lines[index];
    while (line.endsWith('\\')) {
        line.replace("\\", "");
        ++index;
        line = line + lines[index]
    }

    const parts = line.split(" ");
    const metrics = globalMetrics.execMetrics;
    globalMetrics.makeExecPresent();
    parts.forEach((v, i, a) => {
        switch (v) {
            case "-v":
                metrics.volumes += 1;
                break;
        
            case "-p":
                metrics.expose += 1;
                break;

            case "-e":
                metrics.EnvVariables.add(parseVariable(a[i+1]))
                break;
            default:
                break;
        }
    });

    return true;
}