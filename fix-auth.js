const fs = require("fs");

let content = fs.readFileSync("server.ts", "utf8");

const endpointsToProtect = [
  "/api/v1/categories",
  "/api/v1/categories/:id",
  "/api/v1/comments/:id",
  "/api/v1/newsletter/send",
  "/api/v1/newsletter/campaigns",
  "/api/v1/media/upload"
];

for (const ep of endpointsToProtect) {
  content = content.replace(
    new RegExp(`app\\.(post|put|patch|delete)\\(\\"${ep}\\", \\(req, res\\) =>`, "g"),
    `app.$1("${ep}", requireAdmin, (req, res) =>`
  );
}

fs.writeFileSync("server.ts", content);
console.log("Replaced endpoints.");
