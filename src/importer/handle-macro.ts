import { parse } from "csv";

enum LanguageStatus {
  Active = "A",
  Deprecated = "R"
}

interface MacroLanguage {
  M_Id: string;
  I_Id: string;
  I_Status: LanguageStatus;
}

async function handleMacroLanguages(entry: string): Promise<MacroLanguage[]> {
  return new Promise((resolve, reject) => {
    parse(entry, { delimiter: "\t", columns: true }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export { MacroLanguage, LanguageStatus, handleMacroLanguages };
