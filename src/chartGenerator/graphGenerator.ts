import { stats } from "./stats";
import { dictionary } from "./dictionary";
import { languageStats } from "./languageStats";
import { analyzeFolder } from "./parseDirectory";
import { stat } from "fs";
import { metrics } from "../metrics/model_metrics";

const plotly = require('plotly')("elenamv18", "twceWlU4Je0nvMkkqV3O");
//https://plot.ly/nodejs/line-and-scatter/

function getColor(language : string) : string {
  switch (language.toLowerCase()) {
    case 'go':
      //blue
      return "rgba(41, 190, 176, 1)";
    
    case 'java':
      //orange
      return "rgba(255, 106, 0, 1)";

    case 'python':
      //Yellow
      return "rgba(245, 237, 0, 1)";
  }
};
/*function generatePiePlot(inValues : number[], inLabels: string[]) {
  const data = [{
    values: inValues,
    labels: inLabels,
    type: 'pie'
  }];
  const layout = {
    height: 400,
    width: 500
  };
  const graphPieOptions = {layout: layout, filename: "pie-chart", fileopt: "overwrite"};
  plotly.plot(data, graphPieOptions, function (err, msg) {
    console.log("Pie chart generated");
  });
}*/
function exposesPerSecVariablesBarPlot(bruteData : languageStats[]) {
  const xValue = ["all stages", "build", "execution", "run"];
  var data = [];
  bruteData.forEach(lang => {
    var trace = {
      x: xValue,
      y: [lang.getExposesPerSecVariableAbsolute(), 
          lang.getExposesPerSecVariableBuild(),
          lang.getExposesPerSecVariableExec(),
          lang.getExposesPerSecVariableRun()],
      name: lang.getName(),
      type: 'bar',
      marker: {
        color: getColor(lang.getName()),
      }
    };   
    data.push(trace);
  });

  const name = "ExposesPerSecVarRate-bar-chart";
  const layout = {
    title: {
      text: name,
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    barmode: 'group'
  };
  const graphBarOptions = { 
      title: name,
      layout: layout, 
      filename: name, 
      fileopt: "overwrite"};
  
  plotly.plot(data, graphBarOptions, function (err, msg) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(msg);
      console.log("Rate plot generated");
    }
  });
};

function languageGroupedByStagesBarPlot(bruteData : languageStats[], stage : string) : void {
  const xValue = ["expose", "args", "volumes", "envVariables","securityVariables"];
  var data = [];
  switch (stage) {
    case "build":
      bruteData.forEach(lang => {
        var trace = {
          x: xValue,
          y: lang.getBuildAvg(),
          name: lang.getName(),
          type: 'bar',
          marker: {
            color: getColor(lang.getName()),
          }
        };   
        data.push(trace);
      });
      break;
    case "run":
      bruteData.forEach(lang => {
        var trace = {
          x: xValue,
          y: lang.getRunAvg(),
          name: lang.getName(),
          type: 'bar',
          marker: {
            color: getColor(lang.getName()),
          }
        };   
        data.push(trace);
      });
      break;
    case "exec":
      bruteData.forEach(lang => {
        var trace = {
          x: xValue,
          y: lang.getExecAvg(),
          name: lang.getName(),
          type: 'bar',
          marker: {
            color: getColor(lang.getName()),
          }
        };   
        data.push(trace);
      });
      break;
    default:
      console.error("NOT VALID STAGE");
      break;
  }

  
  const name = stage + "_bar-chart";
  const layout = {
    title: {
      text: name,
      font: {
        family: 'Courier New, monospace',
        size: 24
      },
      xref: 'paper',
      x: 0.05,
    },
    barmode: 'group'};
  const graphBarOptions = { 
      layout: layout, 
      filename: name, 
      fileopt: "overwrite"};
  
  plotly.plot(data, graphBarOptions, function (err, msg) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(msg);
      console.log(stage+ " plot generated");
    }
  });
}

function nuagePoint(bruteData : languageStats[],){
  let listeTrace = [];
  let i = 0;
  bruteData.forEach(lang => {
    let build = lang.getBuildStats();
    createMarcker(build,listeTrace,i);
    let run = lang.getRunStats();
    createMarcker(run,listeTrace,i);
    let exec = lang.getExecStats();
    createMarcker(exec,listeTrace,i);   
  });
  var layout = {
    title: 'Nuage de points', 
    xaxis: {title: 'security'}, 
    yaxis: {title: 'expose'}
  };
  plotly.plot(listeTrace, {layout: layout}, function(err, msg) {
    console.log(msg.url);
  });
}
function createMarcker(phase :stats,listeTrace : Array<{}>, index : number){
  phase.metricsList.forEach(project =>{
   console.log(project.SecurityVariable);
   if(project.SecurityVariable.length>0){
      listeTrace[index] = {
        mode: 'markers', 
        type: 'scatter', 
        x: [project.SecurityVariable.length], 
        y: [project.expose], 
        marker: {color: 'rgba(0,330,0,0.8)'}
      };
      index++;
    }
    
  });
}


/**
 * Reading LANG folder, where we'll find different json files
 */
const langFolder = './lang'
var allStats = analyzeFolder(langFolder);

/*//---------------------------- MOCKUP JAVA -----------------------------
var mockupBuild = new stats();
mockupBuild.add(3,2,0,["TRY"],[],["KEYSEC,SKEY,HASHKEY"]);
var mockupRun = new stats();
mockupRun.add(0,8,3,['ENV1',"PATH"],[],["KEYHASH"]);
var mockupExec = new stats();
mockupExec.add(4,2,4,["ENV1", "ENV2"], [], ["SECURITY","SECURE","HASH"]);
var fullStats = new languageStats('java', mockupBuild, mockupRun, mockupExec);
allStats.push(fullStats);

//---------------------------- MOCKUP PYTHON -----------------------------
mockupBuild = new stats();
mockupBuild.add(5,7,3,["TRY","ENV1", "ENV2","PATH"],[],["KEYHASH"]);
mockupRun = new stats();
mockupRun.add(1.2,0.3,3,['ENV1',"PATH"],[],["KEYSEC,SKEY,HASHKEY"]);
mockupExec = new stats();
mockupExec.add(0,0.2,3.75,["ENV1", "ENV2"], [], ["SECURITY","SECURE","HASH","KEYSEC,SKEY,HASHKEY"]);
fullStats = new languageStats('python', mockupBuild, mockupRun, mockupExec);
allStats.push(fullStats);*/

languageGroupedByStagesBarPlot(allStats, 'build');
languageGroupedByStagesBarPlot(allStats, 'run');
languageGroupedByStagesBarPlot(allStats, 'exec');
nuagePoint(allStats);

//exposesPerSecVariablesBarPlot(allStats);
//console.log(allStats);

