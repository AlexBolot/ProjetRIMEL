import * as filter from './metrics/filterFiles';
import * as yamlExplorer from './metrics/yamlExplorer';
import * as astExp from './metrics/DockerFileAstExplorer';
import { crawlLang, parseList } from './CrawlRepo';

/*
take file list of repo
ex:

GO
https://github.com/minio/minio
https://github.com/gittea/gittea
....

*/

const listfile = process.argv[2];
if (! listfile) {
    console.error("file needed")
    process.exit(2);
}
const lang = parseList(listfile);
crawlLang(lang.lang, lang.urls);

