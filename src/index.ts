import { Language } from "./importer/handle-standard";
import { resolveField } from "./resolve-field";
import { resolveType } from "./resolve-type";

import data from "./data.json";

interface ConvertOptions {
  from?: 1 | 2 | 3 | "label";
  to?: 1 | 2 | 3 | "label";
  resolve?: boolean;
}

type LanguageData = {
  macro: { [key: string]: string };
  languages: { [key: string]: Language };
};

function normalize(value: string|null) {
  if (value?.trim().length === 0) {
    return null;
  }

  return value;
}

function convert(input: string, { from, to, resolve }: ConvertOptions = {}) {
  const { languages, macro } = data as LanguageData;

  const isoFrom = from || resolveType(input);
  const isoTo = to || (from === "label" ? 1 : "label");
  const fromField = resolveField(isoFrom);
  const toField = resolveField(isoTo);
  const target = Object.values(languages).find((x) => x[fromField] === input);

  if (target) {
    if (resolve && target.Id in macro && macro[target.Id] in languages) {
      return normalize(languages[macro[target.Id]][toField]);
    }

    return normalize(target[toField]);
  }

  throw new Error(`Language not found from identifier: "${input}"`);
}

export default convert;
