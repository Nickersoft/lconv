import { parse } from "csv";

enum LanguageScope {
  Individual = "I",
  Macro = "M",
  Special = "S"
}

enum LanguageType {
  Living = "L",
  Constructed = "C",
  Extinct = "E",
  Ancient = "A",
  Historical = "H",
  Special = "S"
}

interface Language {
  Id: string;
  Part2B: string | null;
  Part2T: string | null;
  Part1: string | null;
  Scope: LanguageScope;
  Language_Type: LanguageType;
  Ref_Name: string;
  Comment: string | null;
}

async function handleStandardLanguages(entry: string): Promise<Language[]> {
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

export { handleStandardLanguages, LanguageType, Language, LanguageScope };
