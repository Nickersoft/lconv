import fs from "fs";
import path from "path";
import _ from "lodash";

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));

const resolveType = input => {
  switch (input.length) {
    case 2:
      return 1;
    case 3:
      return 3;
    default:
      return "label";
  }
};

const resolveField = type => {
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

const findField = (input, from, to, resolve) => {
  const found = _.find(data, x => x[from] === input);

  if (!found) return null;

  const result = found[to];

  if (_.isNil(result) && _.has(found, "parent") && resolve)
    return findField(found["parent"], "id", to, true);

  return result;
};

const convert = (input, { from, to, resolve }) => {
  const isoFrom = from || resolveType(input);
  const isoTo = to || (from === "label" ? 1 : "label");

  const fromField = resolveField(isoFrom);
  const toField = resolveField(isoTo);

  return findField(input, fromField, toField, resolve || false);
};

module.exports = convert;