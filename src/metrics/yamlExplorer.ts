import * as yaml from 'js-yaml';
import * as fs from 'fs';

export function parseYaml(path){
    try {
        return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        console.log(e);
    }

}
