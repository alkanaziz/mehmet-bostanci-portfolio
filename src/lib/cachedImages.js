import fs from 'fs';
import path from 'path';

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    const filePath = path.join(process.cwd(), 'data', 'imageMeta.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    cachedResults = JSON.parse(jsonData);
  }
  
  return cachedResults;
}
