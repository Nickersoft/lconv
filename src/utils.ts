export function normalize(value: string | null) {
  const normal = value?.trim();
  return !normal || normal?.length === 0 ? null : normal;
}
