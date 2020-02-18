export { languageStats };

import { stats } from "./stats";
import { dictionary } from "./dictionary";

class languageStats {
    private name: string;
    private total: Number;
    private valid: Number;
    private buildStats: stats;
    private runStats: stats;
    private execStats: stats;
    private execSourceList : dictionary[];
    private globalEnvVar : dictionary[];
    private globalSecurityVar : dictionary[];

    private globalEnvTuple(envTuple: dictionary[]) {
        var found = false;
        var globalT = [];
        envTuple.forEach(candidate => {
            this.globalEnvVar.forEach(globalVal => {
                if(candidate.getName() == globalVal.getName()) {
                    //candidate already appeared
                    found = true;
                    globalVal.addNAppareances(candidate.getAppareances());         
                }
            })
            if (!found) {
                //Add name to tuple
                this.globalEnvVar.push(new dictionary(candidate.getName()));
            };
            found = false;    
        });
    };

    private globalSecTuple(secTuple: dictionary[]) {
        var found = false;
        secTuple.forEach(candidate => {
            this.globalSecurityVar.forEach(globalVal => {
                if(candidate.getName() == globalVal.getName()) {
                    //candidate already appeared
                    found = true;
                    globalVal.addNAppareances(candidate.getAppareances());         
                }
            })
            if (!found) {
                //Add name to tuple
                this.globalSecurityVar.push(new dictionary(candidate.getName()));
            };
            found = false;    
        });
    };

    constructor (lang: string, nBuild: stats, nRun: stats, nExec: stats,
                    nTotal: Number, nValid: Number, nSourceList: dictionary[]){
        this.name = lang;
        this.buildStats = nBuild;
        this.runStats = nRun;
        this.execStats = nExec;
        this.total = nTotal;
        this.valid = nValid;
        this.execSourceList = nSourceList;
        this.globalEnvVar = [];
        this.globalSecurityVar = [];
        
        if (nBuild) this.globalEnvTuple(nBuild.getEnvTuple());
        if (nRun) this.globalEnvTuple(nRun.getEnvTuple());
        if (nExec) this.globalEnvTuple(nExec.getEnvTuple());
        
        if (nBuild) this.globalSecTuple(nBuild.getSecurityTuple());
        if (nRun) this.globalSecTuple(nRun.getSecurityTuple());
        if (nExec) this.globalSecTuple(nExec.getSecurityTuple());
        return this;
    };

    public getName() : string {
        return this.name;
    };

    public getTotal() : Number {
        return this.total;
    };
    
    public getValid() : Number {
        return this.valid;
    };

    public getExecSourceList() : dictionary[] {
        return this.execSourceList;
    }
    
    public getBuildStats() : stats {
        return this.buildStats;
    };

    public getRunStats() : stats {
        return this.runStats;
    };

    public getExecStats() : stats {
        return this.execStats;
    };

    public getGlobalEnvVar() : dictionary[] {
        return this.globalEnvVar;
    };

    public getGlobalSecurityVar() : dictionary[] {
        return this.globalSecurityVar;
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

    public getAbsoluteValExpose() : number {
        return this.buildStats.getExpose() +
        this.execStats.getExpose() +
        this.runStats.getExpose();
    };

    public getAbsoluteValArgs() : number {
        return this.buildStats.getArgs() +
        this.execStats.getArgs() +
        this.runStats.getArgs();
    };

    public getAbsoluteValVolumes() : number {
        return this.buildStats.getVolumes() +
        this.execStats.getVolumes() +
        this.runStats.getVolumes();
    };

    public getAbsoluteValEnvVariables() : number {
        return this.buildStats.getEnvVariable().length + 
        this.execStats.getEnvVariable().length +
        this.runStats.getEnvVariable().length;
    };

    public getAbsoluteValSecVariables() : number {
        return this.buildStats.getSecurityVariable().length + 
        this.execStats.getSecurityVariable().length +
        this.runStats.getSecurityVariable().length;
    };

    public getExposesPerSecVariableAbsolute() : number {
        if (this.getAbsoluteValSecVariables() > 0) {
            return this.getAbsoluteValExpose()/this.getAbsoluteValSecVariables();
        }
        else {
            console.error("No security variables found: " + this.getAbsoluteValSecVariables());
        }
        
    };

    public getExposesPerSecVariableBuild() : number {
        var numExposes =  this.buildStats.getExpose();
        var numSecVar = this.buildStats.getSecurityVariable().length;
        if (numSecVar > 0) {
            return numExposes/numSecVar;
        }
        else {
            console.error("No security variables found for " + this.name + " in build stage");
        }
    };

    public getExposesPerSecVariableExec() : number {
        var numExposes =  this.execStats.getExpose();
        var numSecVar = this.execStats.getSecurityVariable().length;
        if (numSecVar > 0) {
            return numExposes/numSecVar;
        }
        else {
            console.error("No security variables found for " + this.name + " in execution stage");
        }
    };

    public getExposesPerSecVariableRun() : number {
        var numExposes =  this.runStats.getExpose();
        var numSecVar = this.runStats.getSecurityVariable().length;
        if (numSecVar > 0) {
            return numExposes/numSecVar;
        }
        else {
            console.error("No security variables found for " + this.name + " in run stage");
        }
    };
};