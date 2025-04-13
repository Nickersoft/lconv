import * as v from "valibot";

import AdmZip from "adm-zip";

import { writeFileSync } from "node:fs";
import { parse } from "csv";

import { LanguageSchema, MacroLanguageSchema } from "@/shared/schema";

const date = "20250115";
const url = `https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3_Code_Tables_${date}.zip`;

async function parseEntry<
  T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(entry: AdmZip.IZipEntry, schema: T): Promise<v.InferOutput<T>> {
  return new Promise((resolve, reject) => {
    parse(
      entry.getData().toString("utf-8"),
      { delimiter: "\t", columns: true },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(v.parse(schema, res));
        }
      },
    );
  });
}

async function importData() {
  const data = await fetch(url, { method: "GET" }).then((r) => r.arrayBuffer());
  const zip = new AdmZip(Buffer.from(data));
  const entries = zip.getEntries();

  const macroLanguageEntry = entries.find(({ entryName }) =>
    entryName.includes("iso-639-3-macrolanguages.tab"),
  );

  const standardLanguageEntry = entries.find(({ entryName }) =>
    entryName.includes("iso-639-3.tab"),
  );

  if (macroLanguageEntry && standardLanguageEntry) {
    const macroLanguages = await parseEntry(
      macroLanguageEntry,
      v.array(MacroLanguageSchema),
    );

    const standardLanguages = await parseEntry(
      standardLanguageEntry,
      v.array(LanguageSchema),
    );

    const macroLanguageLookup = macroLanguages.reduce(
      (acc, { I_Id, M_Id }) => ({ ...acc, [I_Id]: M_Id }),
      {},
    );

    const languageStatusLookup = macroLanguages.reduce(
      (acc, { I_Id, I_Status }) => ({ ...acc, [I_Id]: I_Status }),
      {},
    );

    const languageLookup = standardLanguages.reduce(
      (acc, v) => ({ ...acc, [v.Id]: v }),
      {},
    );

    const data = {
      macro: macroLanguageLookup,
      status: languageStatusLookup,
      languages: languageLookup,
    };

    writeFileSync(
      new URL("../src/data.json", import.meta.url),
      JSON.stringify(data),
      "utf-8",
    );
  } else {
    console.error(
      "Couldn't find either the standard or macro language entries",
    );
  }
}

importData();
