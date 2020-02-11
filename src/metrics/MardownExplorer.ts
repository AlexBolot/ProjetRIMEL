import * as fs from 'fs';
import { analyseLine } from './ShellAnalyser';
import { GlobalMetrics } from './model_metrics';

export class MardownExplorer{
    pathToMd:string;
    globalMetrics:GlobalMetrics;

    constructor(path:string, globalMetrics:GlobalMetrics){
        this.pathToMd=path;
        this.globalMetrics=globalMetrics;
    }

    explorer(){
        console.log(this.pathToMd);
        const contentFile = fs.readFileSync(this.pathToMd,'utf8');
        const array = contentFile.split("```");        

        array.forEach((element, index, arr) => {
            element = element.trim()
            if(element.includes("docker run")){
                analyseLine(arr,index,this.globalMetrics);
            }
            
        });
        
    }
}