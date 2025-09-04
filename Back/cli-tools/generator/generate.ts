import fs from "fs";
import path from "path";

function generateEntity(data: {
  entityRawName: string;
  pluralOverride?: string;
  database?: string;
}) {
  const { entityRawName, pluralOverride, database = "mysql" } = data;
  const entity = toCamelCase(entityRawName);
  const entityCapitalized = toPascalCase(entityRawName);
  const entityKebab = toKebabCase(entityRawName);
  const entityPlural = pluralOverride || pluralize(entity);
  const entityPluralCapitalized = toPascalCase(entityPlural);

  const replacements = {
    ENTITY: entity,
    ENTITYCAPITALIZE: entityCapitalized,
    ENTITIES: entityPlural,
    ENTITIESCAPITALIZE: entityPluralCapitalized,
    ENTITYKEBAB: entityKebab,
  };

  const contextBasePath = path.join(
    process.cwd(),
    "src",
    "contexts",
    entityKebab
  );
  const apiControllersPath = path.join(
    process.cwd(),
    "src",
    "api",
    "controllers"
  );
  const apiRoutesPath = path.join(process.cwd(), "src", "api", "routes");

  const foldersToCreate = [
    path.join(contextBasePath, "application/use-cases"),
    path.join(contextBasePath, "application"),
    path.join(contextBasePath, "domain/interfaces"),
    path.join(contextBasePath, "domain/model"),
    path.join(contextBasePath, "domain/value-objects"),
    path.join(contextBasePath, "domain"),
    path.join(contextBasePath, "infrastructure/repository"),
    apiControllersPath,
    apiRoutesPath,
  ];

  foldersToCreate.forEach((folder) =>
    fs.mkdirSync(folder, { recursive: true })
  );

  const templatesPath = path.join(__dirname, "templates");
  processTemplates(
    templatesPath,
    {
      contextBasePath,
      apiControllersPath,
      apiRoutesPath,
    },
    replacements,
    entityKebab,
    database
  );

  console.log(
    `✅ Entity "${entityRawName}" generated correctly in src/api and src/contexts/${entityKebab}`
  );
}

function processTemplates(
  templateDir: string,
  outputPaths: {
    contextBasePath: string;
    apiControllersPath: string;
    apiRoutesPath: string;
  },
  replacements: Record<string, string>,
  entityKebab: string,
  database: string
) {
  const entries = fs.readdirSync(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(templateDir, entry.name);
    if (entry.isDirectory()) {
      const isRepositoryFolder = entry.name.endsWith("-repository");

      if (isRepositoryFolder && entry.name !== `${database}-repository`) {
        continue;
      }

      processTemplates(
        entryPath,
        outputPaths,
        replacements,
        entityKebab,
        database
      );
    } else {
      const relativePath = path.relative(
        path.join(__dirname, "templates"),
        entryPath
      );
      let outputBase: string;

      const isDbSpecificRepo = relativePath.startsWith(
        `${database}-repository`
      );

      if (isDbSpecificRepo) {
        outputBase = path.join(
          outputPaths.contextBasePath,
          "infrastructure/repository"
        );
      } else if (relativePath.startsWith("api/controllers")) {
        outputBase = outputPaths.apiControllersPath;
      } else if (relativePath.startsWith("api/routes")) {
        outputBase = outputPaths.apiRoutesPath;
      } else {
        outputBase = outputPaths.contextBasePath;
      }

      const subPath = path
        .dirname(relativePath)
        .replace(/^api\/controllers/, "")
        .replace(/^api\/routes/, "")
        .replace(new RegExp(`^${database}-repository`), "");

      const baseName = path.basename(entry.name, ".tpl");
      const fileName = baseName.replace(/entity/g, entityKebab) + ".ts";
      const finalOutputPath = path.join(outputBase, subPath, fileName);

      let content = fs.readFileSync(entryPath, "utf-8");
      content = replaceAll(content, replacements);

      fs.mkdirSync(path.dirname(finalOutputPath), { recursive: true });
      fs.writeFileSync(finalOutputPath, content);
    }
  }
}

function replaceAll(
  template: string,
  replacements: Record<string, string>
): string {
  const keys = [
    "ENTITYKEBAB",
    "ENTITIESCAPITALIZE",
    "ENTITYCAPITALIZE",
    "ENTITIES",
    "ENTITY",
  ];
  for (const key of keys) {
    const regex = new RegExp(key, "g");
    template = template.replace(regex, replacements[key]);
  }
  return template;
}

function normalizeName(name: string): string[] {
  return name
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

function toCamelCase(name: string): string {
  const parts = normalizeName(name);
  return parts[0] + parts.slice(1).map(capitalize).join("");
}

function toPascalCase(name: string): string {
  return normalizeName(name).map(capitalize).join("");
}

function toKebabCase(name: string): string {
  return normalizeName(name).join("-");
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function pluralize(word: string): string {
  return word.endsWith("s") ? word + "es" : word + "s";
}

function parseArgs(args: string[]): Record<string, string> {
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split("=");
    if (value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}

// CLI
const args = process.argv.slice(2);
const [name] = args.filter((arg) => !arg.includes("="));
if (!name) {
  console.error("❌ Please provide an entity name");
  process.exit(1);
}
const options = parseArgs(args.filter((arg) => arg.includes("=")));
const database = options.db?.toLowerCase() || "mysql";
const pluralName = options.pluralName?.toLowerCase() || undefined;

generateEntity({
  entityRawName: name,
  pluralOverride: pluralName,
  database,
});
