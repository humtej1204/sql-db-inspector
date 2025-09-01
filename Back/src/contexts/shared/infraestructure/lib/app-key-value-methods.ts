export function convertToKeyValueDTO<T = unknown>(data: T) {
  const configDataToCreate = [];

  for (const key in data) {
    const keyValue = key as keyof T;

    if (!data[keyValue] && data[keyValue] !== 0) continue;

    const type = typeof data[keyValue];
    let value;
    if (type === "object") value = JSON.stringify(data[keyValue]);
    else value = String(data[keyValue]);

    configDataToCreate.push({
      key: keyValue,
      value,
      type,
    });
  }

  return configDataToCreate;
}
