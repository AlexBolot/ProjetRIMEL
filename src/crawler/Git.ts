import { exec } from "child_process";
import { remove } from "fs-extra";

export const currentRepo = "./curRepo"

export function clone(url: string, output: string) {
    const command = "git clone " + url + ".git " + output;
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

export async function deleteCurRepo(url: string) {
    const parts = url.split("/");
    await remove("workspace/"+parts[parts.length - 1], (err) => { 
        console.log(err);
    });
}