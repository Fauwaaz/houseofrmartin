import crypto from "crypto";

const workingKey = process.env.CCAVENUE_WORKING_KEY; 
const iv = "0123456789abcdef"; 

export function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(workingKey, "utf-8"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(text) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(workingKey, "utf-8"), iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}