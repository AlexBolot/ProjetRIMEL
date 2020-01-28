import * as filter from './filterFiles';
import * as astExp from './astExplorer';

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

const files = { paths : [] };

// START ----
filter.filterFile(folderPath,nameFilter,files);

for(var file in files.paths){
  console.log(files.paths[file]);
  let explorer = new astExp.AstExplorer(file);
  explorer.explore();
}

