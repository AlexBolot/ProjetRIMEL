import { execSync } from "child_process";
import { removeSync } from "fs-extra";

export const currentRepo = "./curRepo"

export function cloneSync(url: string) {
    const command = "git clone "+url+" "+currentRepo;
    execSync(command);
}

export function deleteCurRepo() {
    removeSync(currentRepo);
}