import fs from "fs";
import ExcelJS from "exceljs";

export class FileGenerator {
  body: any;
  filename: string;
  path: string;

  constructor(filename: string, body: unknown) {
    this.body = body;
    this.filename = filename;
    this.path = "temp";

    this.ensurePathDirectoryExistence();
  }

  ensurePathDirectoryExistence() {
    if (fs.existsSync(this.path)) return;
    fs.mkdirSync(this.path, { recursive: true });
  }

  async create() {
    const content = JSON.stringify(this.body);
    fs.writeFileSync(`${this.path}/${this.filename}`, content, "utf8");

    return this;
  }

  deleteTempFile() {
    fs.unlinkSync(`${this.path}/${this.filename}`);
  }
}

export class ExcelGenerator extends FileGenerator {
  async create() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    if (
      Array.isArray(this.body) &&
      this.body.length > 0 &&
      typeof this.body[0] === "object"
    ) {
      worksheet.columns = Object.keys(this.body[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
      worksheet.addRows(this.body);
    } else {
      worksheet.addRow(["No data"]);
    }

    await workbook.xlsx.writeFile(`${this.path}/${this.filename}`);

    return this;
  }
}
