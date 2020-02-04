import * as filter from './metrics/filterFiles';
import * as yamlExplorer from './metrics/yamlExplorer';
import * as astExp from './metrics/DockerFileAstExplorer';

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

for(var file in files){
  let path = files[file];
  console.log(path);
  console.log(yamlExplorer.parseYaml(files[file]));
  process.exit();
}