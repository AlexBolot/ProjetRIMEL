const fs = require('fs');
const path = require('path');

const folderPath = process.argv[2];

if(folderPath == undefined){
  console.log("Missing parameter");
  return;
}

const isFile = fileName => {
  return fs.lstatSync(fileName).isFile() && fileName.includes("Dockerfile");
}

const isFolder = fileName => {
  return fs.lstatSync(fileName).isDirectory();
}
display(folderPath);

function display(folder){
  var files = fs.readdirSync(folder).map(fileName => { 
    return path.join(folder, fileName)
  }).filter(isFile);

  if(files.length>0)
    console.log(files);

  var foldersList = fs.readdirSync(folder).map(fileName => {
    return path.join(folder, fileName);
  }).filter(isFolder)
  
  for(var indice in foldersList){
    var f = foldersList[indice]
    //console.log("## "+ f);
    display(f);
  }
}

