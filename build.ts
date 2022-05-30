import { build, BuildOptions } from "esbuild";

import pkg from "./package.json";

const shared: BuildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: Object.keys(pkg)
};

build({
  ...shared,
  outfile: "dist/index.js"
});

build({
  ...shared,
  outfile: "dist/index.esm.js",
  format: "esm"
});
