
const fs = require('fs');
const path = require('path');
const parser = require('./dockerfileParser');

//filter ---- 
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}
const isFolder = fileName => {
    return fs.lstatSync(fileName).isDirectory();
}
  
function filterFile(folder,nameFilter){
  
    //get interesting file
    var files = fs.readdirSync(folder)
      .filter(nameFilter)
      .map(fileName => { 
        return path.join(folder, fileName)
    }).filter(isFile);
  
    if(files.length>0)
      parser.parsingDockerfile(files);
    
    // recurce on folder  
    var foldersList = fs.readdirSync(folder).map(fileName => {
      return path.join(folder, fileName);
    }).filter(isFolder)
    
    for(var indice in foldersList){
      var f = foldersList[indice]
      //console.log("## "+ f);
      filterFile(f,nameFilter);
    }
  }
  module.exports.filterFile = filterFile;