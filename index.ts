import fs from "fs";
import path from "path";
import _ from "lodash";

interface ConvertOptions {
  from: number;
  to: number;
  resolve: boolean;
}

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data.json"), "utf-8")
);

const resolveType = (input: string[]) => {
  switch (input.length) {
    case 2:
      return 1;
    case 3:
      return 3;
    default:
      return "label";
  }
};

const resolveField = (type: number | string) => {
  switch (type) {
    case 1:
      return "part1";
    case 2:
      return "part2t";
    case 3:
      return "id";
    case "label":
      return "name";
    default:
      return null;
  }
};

function findField(
  input: string,
  from: number | string,
  to: string | number,
  resolve: boolean
) {
  const found = data.find(x => x[from] === input);

  if (!found) {
    return null;
  }

  const result = found[to];

  if (result && "parent" in found && resolve) {
    return findField(found["parent"], "id", to, true);
  }

  return result;
}

const convert = (input: string, { from, to, resolve }: ConvertOptions) => {
  const isoFrom = from || resolveType(input);
  const isoTo = to || (from === "label" ? 1 : "label");

  const fromField = resolveField(isoFrom);
  const toField = resolveField(isoTo);

  return findField(input, fromField, toField, resolve || false);
};

module.exports = convert;
