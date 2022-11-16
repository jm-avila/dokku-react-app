const fs = require("fs");

const fileName = "/usr/share/nginx/html/index.html";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

async function getEnVariables() {
  const envVars = ["REACT_APP_NAME"];
  return envVars.map((name) => {
    return { name, value: process.env[name] };
  });
}

function envVarDictionary(variables) {
  return variables.reduce((dictionary, variable) => {
    const varName = variable.name;
    const varValue = variable.value;
    dictionary[varName] = varValue;
    return dictionary;
  }, {});
}

async function envVars() {
  const variables = await getEnVariables();
  return envVarDictionary(variables);
}

const newFile = (envVarDictionary) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) return reject();
      const strData = data.toString();
      const headElement = "<head>";
      const envVarDictionaryStr = replaceAll(
        JSON.stringify(envVarDictionary),
        '"',
        "'"
      );
      const newMeta = `<meta name="app-name" id="app-name" content="${envVarDictionaryStr}" />`;
      const [start, end] = strData.split(headElement);
      const newEnd = newMeta + end;
      const newStr = [start, newEnd].join(headElement);
      resolve(newStr);
    });
  });

function writeFile(content) {
  fs.writeFile(fileName, content, (err) => {
    if (err) console.error(err);
    else console.log(`${fileName} written successfully`);
  });
}
async function main() {
  const envVarDictionary = await envVars();
  console.log({ envVarDictionary });
  const fileContent = await newFile(envVarDictionary);
  console.log({ fileContent });
  writeFile(fileContent);
}

main();
