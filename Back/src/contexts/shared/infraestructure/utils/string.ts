/* eslint-disable @typescript-eslint/no-explicit-any */
export class String {
  static isString(data: any): boolean {
    return typeof data === "string";
  }

  static convertToSnakeCase(data: string) {
    return data.replace(/ /g, "_").toUpperCase();
  }
}
