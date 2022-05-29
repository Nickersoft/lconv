// const _ = require("lodash");
// const fs = require("fs");
// const through = require("through2");
// const request = require("request");
// const unzip = require("unzip");

import fetch from "node-fetch";
import AdmZip from "adm-zip";
import { parse } from "csv";
import { handleMacroLanguages } from "./handle-macro";
import { handleStandardLanguages } from "./handle-standard";

const date = "20220311";
const macro_map = {};
const url = `https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3_Code_Tables_${date}.zip`;

let languages = [];

// let contents = "";
// entry.pipe(
//   through
//     .obj(function(chunk, enc, callback) {
//       contents += chunk.toString("utf-8");
//       callback();
//     })
//     .on("finish", () => {
//       const lines = contents.split("\n");
//       lines.forEach((line, index) => {
//         if (index > 0) {
//           const divided = line.split("\t");
//           const code = divided[0];
//           const child = divided[1];
//           macro_map[child] = code;
//         }
//       });
//     })
// );

// function handleStandardTable(entry) {
//   let contents = "";
//   entry.pipe(
//     through
//       .obj(function(chunk, enc, callback) {
//         contents += chunk.toString("utf-8");
//         callback();
//       })
//       .on("finish", () => {
//         const lines = contents.toString("utf-8").split("\n");
//         lines.forEach((line, index) => {
//           if (index > 0) {
//             const divided = line.split("\t");
//             const fields = [
//               "id",
//               "part2b",
//               "part2t",
//               "part1",
//               "scope",
//               "type",
//               "name"
//             ];
//             const obj = {};
//             for (let i = 0; i < fields.length; i++) {
//               const val = divided[i];
//               obj[fields[i]] = val && val.length > 0 ? val : null;
//             }
//             languages.push(obj);
//           }
//         });
//       })
//   );
// }

async function importData() {
  const data = await fetch(url, { method: "GET" }).then((r) => r.arrayBuffer());
  const zip = new AdmZip(Buffer.from(data));
  const entries = zip.getEntries();

  const promises = entries.map((entry) => {
    const fileName = entry.entryName;
    const data = entry.getData().toString("utf-8");

    if (fileName.includes(`iso-639-3-macrolanguages_${date}.tab`)) {
      return handleMacroLanguages(data);
    }

    if (fileName.includes(`iso-639-3_${date}.tab`)) {
      return handleStandardLanguages(data);
    }
  });

  const results = await Promise.all(promises);

  console.log(results);
}

importData();

// request()
//   .pipe(unzip.Parse())
//   .on("entry", function(entry) {})
//   .on("close", function() {
//     languages = languages.map((x) =>
//       _.has(macro_map, x.id)
//         ? {
//             ...x,
//             parent: macro_map[x.id]
//           }
//         : x
//     );
//     fs.writeFileSync("data.json", JSON.stringify(languages));
//   });
