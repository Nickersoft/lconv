import * as v from "valibot";

import { LanguageScope, LanguageStatus, LanguageType } from "./enums";

export const LanguageStatusSchema = v.enum(LanguageStatus);

export const LanguageTypeSchema = v.enum(LanguageType);

export const LanguageScopeSchema = v.enum(LanguageScope);

export const LanguageSchema = v.object({
  Id: v.string(),
  Part2b: v.string(),
  Part2t: v.string(),
  Part1: v.string(),
  Scope: LanguageScopeSchema,
  Language_Type: LanguageTypeSchema,
  Ref_Name: v.string(),
  Comment: v.string(),
});

export const LanguageDataSchema = v.object({
  macro: v.record(v.string(), v.string()),
  status: v.record(v.string(), LanguageStatusSchema),
  languages: v.record(v.string(), LanguageSchema),
});

export const MacroLanguageSchema = v.object({
  M_Id: v.string(),
  I_Id: v.string(),
  I_Status: v.enum(LanguageStatus),
});
