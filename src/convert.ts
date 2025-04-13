import type { LanguageCode } from "../shared/types";
import { getLanguage } from "./get-language";
import { normalize } from "./utils";

interface ConvertOptions {
  from?: LanguageCode | "label";
  to?: LanguageCode | "label";
  resolve?: boolean;
}

export function convert(
  input: string,
  { from, to, resolve }: ConvertOptions = {},
) {
  let language = getLanguage(
    input.trim().toLowerCase(),
    from === "label" ? undefined : from,
  );

  const toField: ConvertOptions["to"] = to || (from === "label" ? 1 : "label");

  if (resolve && language?.family) {
    language = language.family;
  }

  const result =
    toField === "label"
      ? language?.name
      : language?.codes[toField === 2 ? "2T" : toField];

  return normalize(result ?? "");
}

export default convert;
