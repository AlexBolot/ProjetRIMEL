import * as fs from 'fs';
import { DockerfileParser, Dockerfile, Instruction, Arg } from 'dockerfile-ast';
import { isNull } from 'util';
import { GlobalMetrics, metrics } from './model_metrics';

export class AstExplorer {

    stages: Array<Array<Instruction>>;
    dockerfile: Dockerfile;
    currentStage: number;
    stageCount: number;
    metrics: GlobalMetrics;

    securityparts: string[];

    constructor(file: string, securityparts: string[],globalMetrics : GlobalMetrics) {
        this.stages = new Array();
        this.currentStage = 0;
        this.metrics = globalMetrics;
        
        this.dockerfile = DockerfileParser.parse(fs.readFileSync(file).toString());
        this.stageCount = this.check();
        this.securityparts = securityparts;
    }

    check(): number {
        let stageCounts: number = 0
        let instructions = this.dockerfile.getInstructions()
        let curInstructions: Instruction[] = [];
        instructions.forEach(element => {
            if (element.getKeyword() == "FROM") {
                ++stageCounts;
                if (curInstructions.length != 0) {
                    this.stages.push(curInstructions);
                    curInstructions = [];
                }
            }
            else {
                curInstructions.push(element);
            }
        });
        this.stages.push(curInstructions);
        if (stageCounts > 2) throw "too many stage";
        return stageCounts;
    }

    explore(): GlobalMetrics {
        let res = this.metrics;
        for (let curstage = 0; curstage < this.stageCount; ++curstage) {
            let stage = this.exploreStage(this.stages[curstage]);
            if (this.stageCount == 2){
                switch (curstage) {
                    case 0:
                        res.buildMetrics = stage;
                        break;
    
                    case 1:
                        res.runMetrics = stage;
                        break;
                }
            }else {
                res.runMetrics = stage;
                res.buildMetrics = null;
            }
            
        }
        return res;
    }



    exploreStage(stage: Instruction[]): metrics {
        let res = new metrics();
        if (stage == null || stage == undefined) return res;
        stage.forEach(i => {
            switch (i.getKeyword().toUpperCase()) {
                case "RUN":
                    this.exploreRUN(i.getArgumentsContent()).forEach(e => res.EnvVariables.add(e));
                    break;
                case "ENV":
                    this.exploreENV(i.getArgumentsContent()).forEach(e => res.EnvVariables.add(e));
                    break;
                case "ARG":
                    res.Args++;
                    break;

                case "EXPOSE":
                    res.expose++;
                    break;
                case "VOLUME":
                    res.volumes++
                    break;
                default:
                    res.unknown.add(i.getKeyword().toUpperCase());
                    break;
            }
        });

        //security variables
        Array.from(res.EnvVariables).filter(v => {
            let predicate = false;
            this.securityparts.forEach(p => {
                if (v.toUpperCase().includes(p.toUpperCase())) predicate = true;
            });
            return predicate;
        }).forEach(v => res.SecurityVariable.add(v));

        return res;
    }

    exploreENV(cmd: string): Array<string> {
        let res = new Array<string>();
        if (cmd.includes("=")) {
            cmd.split(" ").forEach(e => res.push(e.split("=")[0]));
        }else {
            res.push(cmd.split(" ")[0]);
        }
        return res.filter(e => e.length > 0);
    }

    exploreRUN(cmd: string): Array<string> {
        let res = cmd.match(/\$([A-Z_]+[A-Z0-9_]*)|\${([A-Z0-9_]*)}/ig);
        return res != null ? res : [];
    }
}





