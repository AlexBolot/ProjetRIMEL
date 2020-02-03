import * as fs from 'fs';
import { DockerfileParser, Dockerfile, Instruction, Arg } from 'dockerfile-ast';
import { isNull } from 'util';

export class AstExplorer {

    stages: Array<Array<Instruction>>;
    dockerfile: Dockerfile;
    currentStage: number;
    stageCount: number;

    metrics: DockerFileMetrics;

    securityparts: string[];

    constructor(file: string, securityparts: string[]) {
        this.stages = new Array();
        this.currentStage = 0;
        this.metrics = new DockerFileMetrics();
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

    explore(): DockerFileMetrics {
        let res = new DockerFileMetrics();
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

export class DockerFileMetrics {
    buildMetrics: metrics;
    runMetrics: metrics;

    constructor() {
        this.buildMetrics = new metrics();
        this.runMetrics = new metrics();
    }

    toSting(): string {
        return JSON.stringify(this);
    }

    toPrintableJson(): any {
        const build = this.buildMetrics.toPrintableJson();
        const run = this.runMetrics.toPrintableJson()
        const res = {
            buildMetrics: build,
            runMetrics: run
        };

        return res

    }

}

export class metrics {
    expose: number;
    Args: number;
    volumes: number;
    EnvVariables: Set<string>;
    SecurityVariable: Set<String>;
    unknown: Set<string>;

    constructor() {
        this.expose = 0;
        this.Args = 0;
        this.volumes = 0;
        this.EnvVariables = new Set();
        this.unknown = new Set();
        this.SecurityVariable = new Set();
    }

    toPrintableJson() {
        const res = {};
        res["expose"]=this.expose;
        res["args"]=this.Args;
        res["volumes"]=this.volumes;
        res["EnvVariable"]=Array.from(this.EnvVariables);
        res["unknown"]=Array.from(this.unknown);
        res["SecurityVariable"]=Array.from(this.SecurityVariable);

        return res;
    }
}




