import * as filter from './metrics/filterFiles';
import * as yamlExplorer from './metrics/yamlExplorer';
import * as astExp from './metrics/DockerFileAstExplorer';

/*
take file list of repo
ex:

GO
https://github.com/minio/minio
https://github.com/gittea/gittea
....

*/


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
  let path = files.paths[file];
  console.log(path);
  //console.log(yamlExplorer.parseYaml(files.paths[file]));
  let explorer = new astExp.AstExplorer(path);
  console.log(explorer.explore());

  //TODO store into file
}

