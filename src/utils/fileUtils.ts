import fs from "fs/promises";

export async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    if (!content.trim()) return defaultValue;
    return JSON.parse(content) as T;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
      return defaultValue;
    }
    throw err;
  }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
