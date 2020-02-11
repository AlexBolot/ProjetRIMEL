import * as filter from './metrics/filterFiles';
import * as yamlExplorer from './metrics/yamlExplorer';

const folderPath = process.argv[2];
const fileNameWanted = process.argv[3];

//Check Argument ----
if(folderPath == undefined && fileNameWanted == undefined){
  console.log("Missing parameter\n");
  console.log("node findJS.js {path} {fileNameWanted}\n");
  process.exit();
}

// START ----
let files = filter.filterFile(folderPath,fileNameWanted);

for(const file in files){
  let path = files[file];
  console.log(yamlExplorer.parseYaml(path));
}
