const _ = require("lodash");
const fs = require("fs");
const through = require("through2");
const request = require("request");
const unzip = require("unzip");

const date = "20180123";
const macro_map = {};

let languages = [];

function handleMacroLanguages(entry) {
  let contents = "";
  entry.pipe(
    through
      .obj(function(chunk, enc, callback) {
        contents += chunk.toString("utf-8");
        callback();
      })
      .on("finish", () => {
        const lines = contents.split("\n");
        lines.forEach((line, index) => {
          if (index > 0) {
            const divided = line.split("\t");
            const code = divided[0];
            const child = divided[1];
            macro_map[child] = code;
          }
        });
      })
  );
}

function handleStandardTable(entry) {
  let contents = "";
  entry.pipe(
    through
      .obj(function(chunk, enc, callback) {
        contents += chunk.toString("utf-8");
        callback();
      })
      .on("finish", () => {
        const lines = contents.toString("utf-8").split("\n");
        lines.forEach((line, index) => {
          if (index > 0) {
            const divided = line.split("\t");
            const fields = [
              "id",
              "part2b",
              "part2t",
              "part1",
              "scope",
              "type",
              "name"
            ];
            const obj = {};
            for (let i = 0; i < fields.length; i++) {
              const val = divided[i];
              obj[fields[i]] = val && val.length > 0 ? val : null;
            }
            languages.push(obj);
          }
        });
      })
  );
}

request(`http://www-01.sil.org/iso639-3/iso-639-3_Code_Tables_${date}.zip`)
  .pipe(unzip.Parse())
  .on("entry", function(entry) {
    var fileName = entry.path;
    if (fileName.includes(`iso-639-3-macrolanguages_${date}.tab`)) {
      handleMacroLanguages(entry);
    } else if (fileName.includes(`iso-639-3_${date}.tab`)) {
      handleStandardTable(entry);
    } else {
      entry.autodrain();
    }
  })
  .on("close", function() {
    languages = languages.map(
      x =>
        _.has(macro_map, x.id)
          ? {
              ...x,
              parent: macro_map[x.id]
            }
          : x
    );
    fs.writeFileSync("data.json", JSON.stringify(languages));
  });
