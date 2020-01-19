const DockerfileParser = require('dockerfile-ast');
const fs = require('fs');


function parsingDockerfile(files){
  console.log(files);
  let content="";
  for(var file in files){
    content = fs.readFileSync(files[file],'utf8');
    let dockerfile = DockerfileParser.DockerfileParser.parse(content);
    let instructions = dockerfile.getInstructions();
    for (let instruction of instructions) {
      console.log(instruction.getKeyword() +"\t"+ instruction.getArgumentsContent());
      
    }
  }

}
module.exports.parsingDockerfile = parsingDockerfile;