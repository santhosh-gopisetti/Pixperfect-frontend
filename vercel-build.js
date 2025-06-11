const { execSync } = require("child_process");

execSync("./node_modules/vite/bin/vite.js build", {
  stdio: "inherit",
});
