import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import fetch from "node-fetch";
import AdmZip from "adm-zip";

import { handleMacroLanguages } from "./handle-macro";
import { handleStandardLanguages } from "./handle-standard";

const date = "20220311";
const url = `https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3_Code_Tables_${date}.zip`;

function getEntryContents(entry: AdmZip.IZipEntry) {
  return entry.getData().toString("utf-8");
}

async function importData() {
  const data = await fetch(url, { method: "GET" }).then((r) => r.arrayBuffer());
  const zip = new AdmZip(Buffer.from(data));
  const entries = zip.getEntries();

  const macroLanguageEntry = entries.find(({ entryName }) =>
    entryName.includes(`iso-639-3-macrolanguages_${date}.tab`)
  );

  const standardLanguageEntry = entries.find(({ entryName }) =>
    entryName.includes(`iso-639-3_${date}.tab`)
  );

  if (macroLanguageEntry && standardLanguageEntry) {
    const macroLanguages = await handleMacroLanguages(
      getEntryContents(macroLanguageEntry)
    );

    const standardLanguages = await handleStandardLanguages(
      getEntryContents(standardLanguageEntry)
    );

    const macroLanguageLookup = macroLanguages.reduce(
      (acc, { I_Id, M_Id }) => ({ ...acc, [I_Id]: M_Id }),
      {}
    );

    const languageLookup = standardLanguages.reduce(
      (acc, v) => ({ ...acc, [v.Id]: v }),
      {}
    );

    writeFileSync(
      resolve("..", "data.json"),
      JSON.stringify({
        macro: macroLanguageLookup,
        languages: languageLookup
      }),
      "utf-8"
    );
  } else {
    console.error(
      "Couldn't find either the standard or macro language entries"
    );
  }
}

importData();
