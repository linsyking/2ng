import { md } from "./md-it.mjs";
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { argv } from "process";
import jyml from "js-yaml";

function format_dt(dt) {
  return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}

// Read file arg[2] to string
const fpath = argv[2];
let input = readFileSync(fpath).toString();

// Change URL
input = input.replaceAll(/\$url\((.*?)\)/g, function (_, p) {
  if (p.startsWith("/")) {
    return p;
  } else {
    return "../" + p;
  }
});

let opts = {
  schema: jyml.JSON_SCHEMA,
};
let has_changed = false;
const new_s = input.replace(/^---\n([\s\S]*?)---\n/, function (_, p1) {
  if (has_changed) {
    return p1;
  }
  has_changed = true;
  let pp1 = jyml.load(p1, opts);
  if (!pp1.categories) {
    pp1.categories = [];
  }
  if (!pp1.tags) {
    pp1.tags = [];
  }
  let tags = pp1.categories.concat(pp1.tags);
  let uniq_tags = [...new Set(tags)];

  if (uniq_tags.length == 0) {
    console.error("Warning: empty tag list");
  }
  if (!pp1.title || !pp1.date) {
    console.error("Error: no title or date");
    process.exit(1);
  }
  let date_num = Number(
    execSync(`git log -1 --format=%ct ${fpath}`).toString(),
  );
  let date_str = "";
  if (date_num != 0) {
    let lmd_date = new Date(date_num * 1000);
    date_str = `<post-date>${format_dt(lmd_date)}</post-date>`;
  }
  let pp = `<post-metadata>
<post-title>${pp1.title}</post-title>${date_str}<post-initdate>${pp1.date}</post-initdate><post-tags>${uniq_tags.join(", ")}</post-tags>
</post-metadata>
`;
  let toc = false;
  if (pp1.toc) {
    toc = pp1.toc;
  }
  if (toc) {
    pp += '<div id="generated-toc"></div>';
  } else {
    pp += '<div id="generated-toc" style="display: none"></div>';
  }
  // console.log(pp);
  if (pp1.custombg) {
    let arr = pp1.custombg;
    if (Array.isArray(arr)) {
      let newString = arr.length === 0 ? "" : '"' + arr.join('","') + '"';
      pp += `<script> document.bgimgs = [${newString}]</script>`;
    } else {
      console.error("Warning: custombg not list");
    }
  }
  pp += "\n";
  return pp;
});

if (input.length == 0) {
  console.error("Warning: empty input, initialising new post");
  let new_content = `---
title: XXX
date: ${format_dt(new Date())}
tags:
  - 
---\n\n`;
  new_content += input;
  fs.writeFileSync(fpath, new_content);
} else {
  var res = md.render(new_s);
  console.log(res);
}
