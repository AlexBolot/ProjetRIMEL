import * as filter from './filterFiles'

const folderPath = process.argv[2];
const fileNameWanted = process.argv[3];

//Check Argument ----
if(folderPath == undefined && fileNameWanted == undefined){
  console.log("Missing parameter\n");
  console.log("node findJS.js {path} {fileNameWanted}\n");
  process.exit();
}

//Filter file by name
let nameFilter = fileName => {
  return fileName === (fileNameWanted);
}

// START ----
filter.filterFile(folderPath,nameFilter);


