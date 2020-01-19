import * as fs from 'fs';
import { DockerfileParser, Dockerfile, Instruction, Arg } from 'dockerfile-ast';

export class AstExplorer {

    stages: Array<Array<Instruction>>;
    dockerfile: Dockerfile;
    currentStage: number;
    stageCount: number;

    metrics: DockerFileMetrics;

    constructor(file: string) {
        this.stages = new Array();
        let rcontent: string = ""
        fs.readFile(file, 'utf8', (err: any, content: string) => {
            if (err != null) {
                // handle error
            }
            rcontent = content;
        });
        this.dockerfile = DockerfileParser.parse(rcontent);
        this.currentStage = 0;
        this.stageCount = this.check();
        this.metrics = new DockerFileMetrics();
    }

    check(): number {
        let stageCounts: number = 0
        let instructions = this.dockerfile.getInstructions()
        let curInstructions: Instruction[] = [];
        instructions.forEach(element => {
            if (element.getKeyword() == "FROM") {
                ++stageCounts;
                if (curInstructions.length != 0) 
            }
        });
        if (stageCounts > 2) throw "too many stage";
        return stageCounts;
    }

    explore() {
        let BuildInstructions: Instruction[] = [];
        let RunInstructions : Instruction[] = [];

        let curstage = 0;
        this.dockerfile.getInstructions().forEach(e => {
            if(e.getKeyword() == "FROM") ++curstage;
            else if (curstage == 1) BuildInstructions.push(e);
            else if(curstage == 2) RunInstructions.push(e);
        });

    }
    
    exploreBuildStage(stage: Instruction[]) {
        stage.forEach(i => {
            switch (i.getKeyword()) {
                case "RUN":
                    this.exploreRUN(i.getTextContent())
                    break;
                case "ENV":
                    this.metrics.buildMetrics.EnvVariables.push(i.getArguments()[0].getValue());
            
                default:
                    break;
            }
        });
    }
    
    exploreFinalStage() {
    
    }
    
    exploreRUN(cmd: string) {
    
    }
}

export class DockerFileMetrics {
    buildMetrics: metrics;
    runMetrics: metrics;

    constructor() {
        this.buildMetrics = new metrics();
        this.runMetrics = new metrics();
    }

    toSting() {

    }

}

export class metrics{
    expose: number;
    Args: number;
    volumes: number;
    EnvVariables: Array<string>;

    constructor() {
        this.expose = 0;
        this.Args = 0;
        this.volumes = 0;
        this.EnvVariables = new Array();
    }

    toSting() {

    }
}




