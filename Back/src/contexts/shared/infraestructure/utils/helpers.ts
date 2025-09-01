// to-do, Uncomment when the entire project is finished
import * as https from "https";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const encode64 = (data: any) => {
  return btoa(JSON.stringify(data));
};

export function getDurationInMilliseconds(start?: [number, number]) {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

export function sortByAscending(a: number, b: number) {
  return a - b;
}

export function sortByDescending(a: number, b: number) {
  return b - a;
}

export function sortByInsDatetimeAscending(a: any, b: any) {
  return new Date(a.insDatetime).getTime() - new Date(b.insDatetime).getTime();
}

export function sortByInsDatetimeDescending(a: any, b: any) {
  return new Date(b.insDatetime).getTime() - new Date(a.insDatetime).getTime();
}

export function cloneData<T = unknown>(data: any) {
  return JSON.parse(JSON.stringify(data)) as T;
}

export const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response: any) => {
        let data = "";
        response.setEncoding("base64");
        response.on("data", (chunk: any) => {
          data += chunk;
        });
        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err: Error) => {
        reject(err);
      });
  });
};
