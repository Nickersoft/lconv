export function resolveType(input: string) {
  switch (input.length) {
    case 2:
      return 1;
    case 3:
      return 3;
    default:
      return "label";
  }
}
