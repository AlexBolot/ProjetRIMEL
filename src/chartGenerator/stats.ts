export {stats};

import { dictionary } from "./dictionary";

class stats {
    private total: number;
    private expose: number;
    private args: number;
    private volumes: number;
    private EnvVariable: string[];
    private EnvTuple: dictionary[];
    private unknown: string[];
    private unknownTuple: dictionary[];
    private SecurityVariable: string[];
    private securityTuple: dictionary[];
  
    //Constructor
    public constructor() {
      this.total = 0;
      this.expose = 0;
      this.args = 0;
      this.volumes = 0;
      this.EnvVariable = [];
      this.unknown = [];
      this.SecurityVariable = [];
      this.EnvTuple = [];
      this.unknownTuple = [];
      this.securityTuple = [];
      return this;
    };
    
    //Geters 
    public getTotal() : number{
      return this.total;
    };

    public getExpose(): number {
      return this.expose;
    }

    public getArgs(): number {
      return this.args;
    };

    public getVolumes(): number {
      return this.volumes;
    };

    public getEnvVariable() : string[] {
      return this.EnvVariable;
    };

    public getEnvTuple(): dictionary[] {
      return this.EnvTuple;
    };

    public getUnknown(): string[]{
      return this.unknown;
    };
  
    public getUnknownTuple(): dictionary[]{
      return this.unknownTuple;
    };

    public getSecurityVariable(): string[]{
      return this.SecurityVariable;
    };

    public getSecurityTuple(): dictionary[]{
      return this.securityTuple;
    };

    private envToTuple(env: string[]){
      var found = false;
      env.forEach(name => {
        this.EnvTuple.forEach(candidate => {
          if(candidate.getName() == name) {
            //varName already appeared
            found = true;
            candidate.addAppareance();
          };
        });
        if (!found) {
          //Add name to tuple
          this.EnvTuple.push(new dictionary(name));
        };
        found = false; //Restart
      });
    };
  
    private unkToTuple(unk: string[]){
      var found = false;
      unk.forEach(name => {
        this.unknownTuple.forEach(candidate => {
          if(candidate.getName() == name) {
            //varName already appeared
            found = true;
            candidate.addAppareance();
          };
        });
        if (!found) {
          //Add name to tuple
          this.unknownTuple.push(new dictionary(name));
        };
        found = false; //Restart
      });
    };
  
    private secToTuple(sec: string[]){
      var found = false;
      sec.forEach(name => {
        this.securityTuple.forEach(candidate => {
          if(candidate.getName() == name) {
            //varName already appeared
            found = true;
            candidate.addAppareance();
          };
        });
        if (!found) {
          //Add name to tuple
          this.securityTuple.push(new dictionary(name));
        };
        found = false; //Restart
      });
    };
    
    //Add new stat
    public add(nExp: number, nArgs: number, nVolumes: number, 
          nEnvVariable: string[], nUnknown: string[], nSecurityVariable: string[]) {
      this.total++;
      this.expose+=nExp;
      this.args+=nArgs;
      this.volumes+=nVolumes;
      this.EnvVariable = this.EnvVariable.concat(nEnvVariable);
      this.envToTuple(nEnvVariable);
      this.unknown = this.unknown.concat(nUnknown);
      this.unkToTuple(nUnknown);
      this.SecurityVariable = this.SecurityVariable.concat(nSecurityVariable);
      this.secToTuple(nSecurityVariable);
    };
    
    //Calculated stats
    public exposeAvg() : number{
      if (this.total > 0) {
        return this.expose/this.total;
      }
      else {
        console.error("No stats found");
      }
    };
    
    public argsAvg() : number{
      if (this.total > 0) {
        return this.args/this.total;
      }
      else {
        console.error("No stats found");
      }
    };
  
    public volumesAvg() : number{
      if (this.total > 0) {
        return this.volumes/this.total;
      }
      else {
        console.error("No stats found");
      }
    };

    //nb expose/nb variables securite
    //moyenne par stage (exec, build, run)
    //moyenne tout par langage
  }
  