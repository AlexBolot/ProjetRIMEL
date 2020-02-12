export { analyzeFolder };

import { languageStats } from "./languageStats";
import { stats } from "./stats";

const fs = require('fs');

var allStats = []; //Language stats list in order to print chart at the end

//We use synchrone directories and file reading in order to guarantee a sequential execution
//in the main programm
function analyzeFolder(path: string) : languageStats[] {
  //Read path folder  
  //Assuming path/LANGUAGE/resultAnalysisFile
  var languages = fs.readdirSync(path);
  languages.forEach(lang => {
    var buildStats = new stats();
    var runStats = new stats();
    var execStats = new stats(); 
    var langPath = path + "/" + lang; //Path to all language analysis
    
    //Read lang/LANGUAGE folder
    var files = fs.readdirSync(langPath);
    //Parse each file in lang/LANGUAGE
    files.forEach(file => {
      //Read the file and add stats in order to create a plot
      var filePath = langPath + "/" + file;
      var jsonText = fs.readFileSync(filePath);
      var contentJSON = JSON.parse(jsonText);
      var build = contentJSON.buildMetrics;         
      var run = contentJSON.runMetrics;
      var exec = contentJSON.execMetrics;
      
      //Put new objects into stats
      buildStats.add(Number(build.expose), Number(build.args), Number(build.volumes),
                build.EnvVariable, build.unknown, build.SecurityVariable)
      runStats.add(Number(run.expose), Number(run.args), Number(run.volumes), 
                run.EnvVariable, run.unknown, run.SecurityVariable);
      execStats.add(Number(exec.expose), Number(exec.args), Number(exec.volumes),
                exec.EnvVariable, exec.unknown, exec.SecurityVariable);
    });
    // All files from LANGUAGE read
    //Before exiting we add the new language analyzed to allStats
    allStats.push(new languageStats(lang, buildStats, runStats, execStats));
  });
  //All LANGUAGE read
  return allStats;
};