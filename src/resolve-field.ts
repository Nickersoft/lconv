import { Language } from "./importer/handle-standard";

export function resolveField(type: number | string): keyof Language {
  switch (type) {
    case 1:
      return "Part1";
    case 2:
      return "Part2T";
    case 3:
      return "Id";
    default:
      return "Ref_Name";
  }
}
