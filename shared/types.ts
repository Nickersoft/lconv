import type * as v from "valibot";

import {
  LanguageTypeSchema,
  LanguageScopeSchema,
  LanguageSchema,
  LanguageDataSchema,
  MacroLanguageSchema,
} from "./schema";
import { LanguageStatus } from "./enums";

export type LanguageType = v.InferOutput<typeof LanguageTypeSchema>;
export type LanguageScope = v.InferOutput<typeof LanguageScopeSchema>;
export type Language = v.InferOutput<typeof LanguageSchema>;
export type LanguageData = v.InferOutput<typeof LanguageDataSchema>;
export type MacroLanguage = v.InferOutput<typeof MacroLanguageSchema>;
export type LanguageCode = 1 | 2 | "2T" | "2B" | 3;

export interface NormalizedLanguage {
  name: string;
  scope: LanguageScope;
  type: LanguageType;
  status: LanguageStatus;
  family?: NormalizedLanguage | null;
  codes: Record<Exclude<LanguageCode, 2>, string | null>;
}
