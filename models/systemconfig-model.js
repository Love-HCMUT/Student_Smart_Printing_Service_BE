import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readData(filename) {
  if (!filename) return undefined;
  try {
    const filepath = path.resolve(__dirname, `../data/${filename}`);
    const data = fs.readFileSync(filepath, "utf8");
    const result = data.split("\n");
    return result;
  } catch (err) {
    console.log("Error when reading file ", err);
    return undefined;
  }
}

function writeData(filename, data) {
  if (!filename) return false;
  try {
    const pathfile = path.resolve(__dirname, `../data/${filename}`);
    const content = data.join("\n");
    fs.writeFileSync(pathfile, content);
    return true;
  } catch (err) {
    console.log("Error when reading file ", err);
    return false;
  }
}

export default {
  readData,
  writeData,
};
