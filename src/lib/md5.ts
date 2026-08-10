import { createHash } from "crypto";

export function md5(input: string): string {
  return createHash("md5").update(input, "utf8").digest("hex");
}
