import * as yaml from 'js-yaml';
import * as fs   from 'fs';
 
export function parseYaml(path){
    try {
        var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
        return doc;
    } catch (e) {
    console.log(e);
    }
    
}
