const fs = require('fs');
const path = require('path');
const DockerfileParser = require('dockerfile-ast');

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
  return fs.lstatSync(fileName).isFile();
}
const nameFilter = fileName => {
  return fileName === (fileNameWanted);
}
const isFolder = fileName => {
  return fs.lstatSync(fileName).isDirectory();
}
// START ----
display(folderPath);


function display(folder){

  //get interesting file
  var files = fs.readdirSync(folder)
    .filter(nameFilter)
    .map(fileName => { 
      return path.join(folder, fileName)
  }).filter(isFile);

  if(files.length>0)
    ParsingDockerfile(files);
  

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
function ParsingDockerfile(files){
  console.log(files);
  let content="";
  for(var file in files){
    content = fs.readFileSync(files[file],'utf8');
    //console.log("content : ");
    //console.log(content);
    let dockerfile = DockerfileParser.DockerfileParser.parse(content);
    let instructions = dockerfile.getInstructions();
    for (let instruction of instructions) {
      console.log(instruction.getKeyword() +"\t"+ instruction.getArgumentsContent());
      
    }
  }

}

