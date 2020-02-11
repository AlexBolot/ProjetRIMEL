import { throws } from "assert";
import { stats } from "./stats";
import { dictionary } from "./dictionary";

const plotly = require('plotly')("elenamv18", "twceWlU4Je0nvMkkqV3O");
//https://plot.ly/nodejs/line-and-scatter/
const fs = require('fs');

function appareancesToData(list: dictionary[]) : number[] {
  var listAppareances = [];
  list.forEach(variable => {
    listAppareances.push(variable.getAppareances());
  });
  return listAppareances;
}

function nameToLabel(list: dictionary[]) : string[] {
  var listNames = [];
  list.forEach(variable => {
    listNames.push(variable.getName());
  });
  return listNames;
}

function generatePiePlot(inValues : number[], inLabels: string[]) {
  var data = [{
    values: inValues,
    labels: inLabels,
    type: 'pie'
  }];
  var layout = {
    height: 400,
    width: 500
  };
  var graphPieOptions = {layout: layout, filename: "pie-chart", fileopt: "overwrite"};
  plotly.plot(data, graphPieOptions, function (err, msg) {
    console.log(msg);
  });
}

/**
 * Reading LANG folder, where we'll find different json files
 */
const langFolder = '../../lang'
fs.readdir(langFolder, (err, languages) => {
  //Read lang folder
  var buildStats = new stats();
  var runStats = new stats();
  var execStats = new stats(); 
  var i = 1; 
  languages.forEach(lang => {
    //Read lang/LANGUAGE folder
    if (err) {
      throw err;
    }
    var langPath = langFolder + "/" + lang;
    console.log("Current lang: " + lang);
    
    fs.readdir(langPath, (err, files) => {
      //Parse each file in lang/LANGUAGE
      if (err) {
        throw err;
      }
      files.forEach(file => {
        //Read the file and add stats in order to create a plot
        var filePath = langPath + "/" + file;
        var jsonText = fs.readFileSync(filePath);
        var contentJSON = JSON.parse(jsonText);
        var build = contentJSON.buildMetrics;         
        var run = contentJSON.runMetrics;
        var exec = contentJSON.execMetrics;
        buildStats.add(Number(build.expose), Number(build.args), Number(build.volumes),
                 build.EnvVariable, build.unknown, build.SecurityVariable)
        runStats.add(Number(run.expose), Number(run.args), Number(run.volumes), 
                  run.EnvVariable, run.unknown, run.SecurityVariable);
        execStats.add(Number(exec.expose), Number(exec.args), Number(exec.volumes),
                  exec.EnvVariable, exec.unknown, exec.SecurityVariable);
      });// End loop read files
      //Generating plot
      generatePiePlot(appareancesToData(buildStats.getEnvTuple()), nameToLabel(buildStats.getEnvTuple()));
    }); //End read directories
  });// End loop read folders
});// End read lang folder


/*var trace1 = {
    x: [52698, 43117],
    y: [53, 31],
    mode: "markers",
    name: "Average",
    text: ["United States", "Canada"],
    marker: {
      color: "rgb(164, 194, 244)",
      size: 12,
      line: {
        color: "white",
        width: 0.5
      }
    },
    type: "scatter"
  };  

var graphLineOptions = {
  layout: layout,
  filename: "line-chart",
  fileopt: "overwrite"
};

plotly.plot(trace1, graphLineOptions, function (err, msg) {
  console.log(msg);
});*/

