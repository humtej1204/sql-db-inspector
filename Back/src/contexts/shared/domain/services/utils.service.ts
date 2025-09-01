export class UtilService {
  static assertEnumValue<T extends object>(
    enumObj: T,
    value: unknown
  ): asserts value is T[keyof T] {
    const rawValues = Object.values(enumObj);

    const filteredValues = rawValues.filter((v) => {
      return !(
        typeof v === "string" && typeof enumObj[v as keyof T] === "number"
      );
    });

    if (!filteredValues.includes(value as T[keyof T])) {
      throw new Error(
        `Valor inválido "${value}". Valores permitidos: ${filteredValues.join(
          ", "
        )}`
      );
    }
  }
}
