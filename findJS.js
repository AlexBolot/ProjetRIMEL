const fs = require('fs');
const path = require('path');

const folderPath = process.argv[2];
const fileNameWanted = process.argv[3];

//Check Argument ----
if(folderPath == undefined && fileNameWanted == undefined){
  console.log("Missing parameter\n");
  console.log("node findJS.js {path} {fileNameWanted}\n");
  return;
}

//filter ---- 
const isFile = fileName => {
  return fs.lstatSync(fileName).isFile() && fileName.includes(fileNameWanted);
}
const isFolder = fileName => {
  return fs.lstatSync(fileName).isDirectory();
}
// START ----
display(folderPath);


function display(folder){

  //get interesting file
  var files = fs.readdirSync(folder).map(fileName => { 
    return path.join(folder, fileName)
  }).filter(isFile);
  if(files.length>0)
    console.log(files);

  // recurce on folder  
  var foldersList = fs.readdirSync(folder).map(fileName => {
    return path.join(folder, fileName);
  }).filter(isFolder)
  
  for(var indice in foldersList){
    var f = foldersList[indice]
    //console.log("## "+ f);
    display(f);
  }
}

