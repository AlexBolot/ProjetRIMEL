export { languageStats };

import { stats } from "./stats";

class languageStats {
    private name: string;
    private buildStats: stats;
    private runStats: stats;
    private execStats: stats;

    constructor (lang: string, nBuild: stats, nRun: stats, nExec: stats){
        this.name = lang;
        this.buildStats = nBuild;
        this.runStats = nRun;
        this.execStats = nExec;
        return this;
    };

    public getName() : string {
        return this.name;
    };

    public getBuildStats() : stats {
        return this.buildStats;
    };

    public getRunStats() : stats {
        return this.runStats;
    };

    public getExecStats() : stats {
        return this.execStats;
    };

    public getBuildAvg() : number[] {
        const build = this.buildStats;
        return [build.exposeAvg(), build.argsAvg(), build.volumesAvg(), build.envVariablesAvg(),build.secVariablesAvg()];
    };

    public getExecAvg() : number[] {
        const exec = this.execStats;
        return [exec.exposeAvg(), exec.argsAvg(), exec.volumesAvg(), exec.envVariablesAvg(), exec.secVariablesAvg()];
    };

    public getRunAvg() : number[] {
        const run = this.runStats;
        return [run.exposeAvg(), run.argsAvg(), run.volumesAvg(), run.envVariablesAvg(), run.secVariablesAvg()];
    };
};