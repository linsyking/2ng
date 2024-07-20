var math = require("markdown-it-mathjax3");
var container = require("markdown-it-container");
var emoji = require("markdown-it-emoji");
var mdit = require("markdown-it"),
  md = new mdit({
    typographer: true,
    linkify: true,
    html: true,
  })
    .use(math)
    .use(container, "details", {
      validate: function (params) {
        return params.trim().match(/^details\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^details\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Details";
          return (
            '<details class="custom-block details"><summary>' +
            ins +
            "</summary>\n"
          );
        } else {
          return "</details>\n";
        }
      },
    })
    .use(container, "center", {
      validate: function (params) {
        return params.trim().match(/^center.*$/);
      },

      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          return '<div class="center-container">\n';
        } else {
          return "</div>\n";
        }
      },
    })
    .use(container, "info", {
      validate: function (params) {
        return params.trim().match(/^info\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^info\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Info";
          return (
            '<div class="custom-block info"><p class="title">' + ins + "</p>\n"
          );
        } else {
          return "</div>\n";
        }
      },
    })
    .use(container, "success", {
      validate: function (params) {
        return params.trim().match(/^success\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^success\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Success";
          return (
            '<div class="custom-block success"><p class="title">' +
            ins +
            "</p>\n"
          );
        } else {
          return "</div>\n";
        }
      },
    })
    .use(container, "tip", {
      validate: function (params) {
        return params.trim().match(/^tip\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Tip";
          return (
            '<div class="custom-block tip"><p class="custom-block-title">' +
            ins +
            "</p>\n"
          );
        } else {
          return "</div>\n";
        }
      },
    })
    .use(container, "warning", {
      validate: function (params) {
        return params.trim().match(/^warning\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^warning\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Warning";
          return (
            '<div class="custom-block warning"><p class="custom-block-title">' +
            ins +
            "</p>\n"
          );
        } else {
          return "</div>\n";
        }
      },
    })
    .use(container, "danger", {
      validate: function (params) {
        return params.trim().match(/^danger\s*(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^danger\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
          let ins = m[1] ? md.utils.escapeHtml(m[1]) : "Danger";
          return (
            '<div class="custom-block danger"><p class="custom-block-title">' +
            ins +
            "</p>\n"
          );
        } else {
          return "</div>\n";
        }
      },
    })
    .use(emoji);

var fs = require("fs");
var jyml = require("js-yaml");

// Read file arg[2] to string
const { argv } = require("process");
var input = fs.readFileSync(argv[2]).toString();

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
  let pp = `<post-metadata>
<post-title>${pp1.title}</post-title>
<post-date>${pp1.date}</post-date>
<post-tags>${uniq_tags.join(", ")}</post-tags>
</post-metadata>`;
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
  let dt = new Date();
  let ftdt = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
  let new_content = `---
title: XXX
date: ${ftdt}
tags:
  - 
---\n\n`;
  new_content += input;
  fs.writeFileSync(argv[2], new_content);
} else {
  var res = md.render(new_s);
  console.log(res);
}
