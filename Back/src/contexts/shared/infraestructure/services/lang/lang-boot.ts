import {
  LANG,
  LangService,
  setLangProvider,
} from "../../../domain/services/lang.service";
import { env } from "../../config/environments";
import { FsLangLoader } from "./lang-loader.service";

const DEFAULT_LANG = env.app.defaultLang;

const langProvider = (
  key: string,
  args?: Record<string, any>,
  lang?: LANG
): string => {
  const selectedLang = lang ?? DEFAULT_LANG;

  const langLoader = new FsLangLoader();
  const service = new LangService(langLoader, selectedLang);
  return service.__(key, args);
};

export const initLang = () => {
  setLangProvider(langProvider);
};
