import { countWords } from "alfaaz";
import { readFileSync } from "fs";
import { stripHtml } from "string-strip-html";
import { JSDOM } from "jsdom";

var stdinBuffer = readFileSync(0);
const text = stdinBuffer.toString();
const parsed = new JSDOM(text);

let time = parsed.window.document.querySelector("#reading-time");
const stripedText = stripHtml(text).result;
const totalWords = countWords(stripedText);
const minutes = totalWords / 200;
if (time) {
  // Add the time to the text
  if (minutes <= 1) {
    time.textContent = "less than a minute";
  } else {
    time.textContent = `${Math.round(minutes)} minutes`;
  }
  console.log(parsed.serialize());
} else {
  console.log(text);
}
