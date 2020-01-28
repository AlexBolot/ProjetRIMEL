
const fs = require('fs');
const path = require('path');

//filter ---- 
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}
const isFolder = fileName => {
    return fs.lstatSync(fileName).isDirectory();
}
  
export function filterFile(folder,nameFilter,files){
  
    //get interesting file
    var f = fs.readdirSync(folder)
      .filter(nameFilter)
      .map(fileName => { 
        return path.join(folder, fileName)
    }).filter(isFile);
    
    
    if(f.length>0){
      files.paths = files.paths.concat(f);
    }

    // recurce on folder  
    var foldersList = fs.readdirSync(folder).map(fileName => {
      return path.join(folder, fileName);
    }).filter(isFolder)
    
    for(var indice in foldersList){
      var f = foldersList[indice]
      filterFile(f,nameFilter,files);
    }
  
  }
