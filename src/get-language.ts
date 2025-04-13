import * as v from "valibot";

import type {
  Language,
  LanguageCode,
  NormalizedLanguage,
} from "@/shared/types";

import { LanguageDataSchema } from "@/shared/schema";
import { normalize } from "./utils";
import { LanguageStatus } from "@/shared/enums";

const data = v.parse(LanguageDataSchema, await import("./data.json"));

const candidateMap: Record<LanguageCode, keyof Language> = {
  1: "Part1",
  2: "Part2t",
  "2T": "Part2t",
  "2B": "Part2b",
  3: "Id",
};

const candidates: (keyof Language)[] = [
  ...Object.values(candidateMap),
  "Ref_Name",
];

function createLanguage(raw: Language): NormalizedLanguage {
  const { status } = data;
  const { Id, Language_Type, Part1, Part2t, Scope, Part2b, Ref_Name } = raw;

  return {
    name: Ref_Name,
    scope: Scope,
    status: status[Id] ?? LanguageStatus.Active,
    type: Language_Type,
    codes: {
      "1": normalize(Part1),
      "2T": normalize(Part2t),
      "2B": normalize(Part2b),
      "3": normalize(Id),
    },
  };
}

function lookup(
  value: string,
  key?: keyof Language,
): NormalizedLanguage | null {
  const { languages, macro } = data;

  const target = Object.values(languages).find((x) =>
    key
      ? x[key].toLowerCase() === value.toLowerCase()
      : candidates.some(
          (k) => x[k].toLowerCase().trim() === value.toLowerCase().trim(),
        ),
  );

  if (!target) {
    return null;
  }

  const { Id } = target;

  return {
    ...createLanguage(target),
    family:
      Id in macro && macro[Id] in languages
        ? createLanguage(languages[macro[Id]])
        : null,
  };
}

export function getLanguage(code: string, format?: LanguageCode) {
  return lookup(code, format ? candidateMap[format] : undefined);
}
