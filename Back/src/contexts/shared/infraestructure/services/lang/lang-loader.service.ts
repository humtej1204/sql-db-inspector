import { readFileSync } from "fs";
import { ILangLoader, LANG } from "../../../domain/services/lang.service";

export class FsLangLoader implements ILangLoader {
  load(lang: LANG): Record<string, any> {
    const path = `src/contexts/shared/infraestructure/services/lang/lang_${lang}.json`;
    return JSON.parse(readFileSync(path, "utf8"));
  }
}
