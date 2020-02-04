import { execSync } from "child_process";
import { removeSync } from "fs-extra";
import { existsSync } from "fs";

export const currentRepo = "./curRepo"

export function cloneSync(url: string, output: string) {
    const command = "git clone "+url+".git "+output;
    execSync(command);
}

//export 
function pullSync(url: string) {
    const parts = url.split("/");
    const command = "cd "+parts[parts.length - 1]+" && git pull ";
    execSync(command);
}

//export
function tryCloneOrPull(url: string) {
    const parts = url.split("/");
    if (existsSync("./"+parts[parts.length - 1])) {
        pullSync(url);
    } else {
        //cloneSync(url);
    }
}

//export 
function deleteCurRepo(url: string) {
    const parts = url.split("/");
    removeSync(parts[parts.length - 1]);
}