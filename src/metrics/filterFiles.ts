import { readdirSync, lstatSync } from "fs";
import { join } from "path";


//filter ----
const isFile = fileName => {
    return lstatSync(fileName).isFile();
};
const isFolder = fileName => {
    return lstatSync(fileName).isDirectory();
};

export function filterFile(folder: string,nameFilter: string,files?: {}|undefined): string[]{

    if (files == undefined) {
      files = { paths : [] };
    }

    let nodes = readdirSync(folder).filter(f => !f.startsWith("."));

    //get interesting file
    let f_nodes = nodes
      .filter(f => f.toUpperCase() == nameFilter.toUpperCase())
      .map(fileName => {
        return join(folder, fileName)
    }).filter(isFile);

    if(f_nodes.length>0){
      files["paths"] = files["paths"].concat(f_nodes);
    }

    // recurce on folder
    nodes.map(fileName => {
      return join(folder, fileName);
    }).filter(isFolder).forEach(d => filterFile(join(d), nameFilter, files));

    return files["paths"];

  }
