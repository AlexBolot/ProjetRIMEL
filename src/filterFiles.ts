
const fs = require('fs');
const path = require('path');
import * as astExp from './astExplorer';

//filter ---- 
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}
const isFolder = fileName => {
    return fs.lstatSync(fileName).isDirectory();
}
  
export function filterFile(folder,nameFilter){
  
    //get interesting file
    var files = fs.readdirSync(folder)
      .filter(nameFilter)
      .map(fileName => { 
        return path.join(folder, fileName)
    }).filter(isFile);
  
    if(files.length>0){
      let explorer = new astExp.AstExplorer(files);
      explorer.explore()
    }
    
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
