
export class GlobalMetrics {
    buildMetrics: metrics;
    runMetrics: metrics;
    execMetrics: metrics;

    isValid: boolean;
    whyInvalid: string;

    buildPresent: boolean;
    execPresent: boolean;


    constructor() {
        this.buildMetrics = new metrics();
        this.runMetrics = new metrics();
        this.execMetrics= new metrics();
        this.isValid = true;
        this.buildPresent = false;
        this.execPresent = false;
    }

    toSting(): string {
        return JSON.stringify(this);
    }

    toPrintableJson(): any {
        const build = this.buildMetrics.toPrintableJson();
        const run = this.runMetrics.toPrintableJson();
        const exe = this.execMetrics.toPrintableJson();
        const res = {
            buildMetrics: build,
            runMetrics: run,
            execMetrics:exe
        };

        return res

    }

    makeInvalid(why: string) {
        this.isValid = false;
        this.whyInvalid = why;
    }

    makeBuildPresent() {
        this.buildPresent = true;
    }

    makeExecPresent() {
        this.execPresent = true;
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
