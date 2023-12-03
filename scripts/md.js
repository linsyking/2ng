var math = require('markdown-it-mathjax3');
var container = require('markdown-it-container');
var emoji = require('markdown-it-emoji');
var mdit = require('markdown-it'), md = new mdit({
    typographer: true,
    linkify: true,
    html: true,
}).use(math).use(container, 'details', {

    validate: function (params) {
        return params.trim().match(/^details\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^details\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Details";
            return '<details class="custom-block details"><summary>' + ins + '</summary>\n';

        } else {
            return '</details>\n';
        }
    }
}).use(container, 'center', {

    validate: function (params) {
        return params.trim().match(/^center.*$/);
    },

    render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
            return '<div class="center-container">\n';
        } else {
            return '</div>\n';
        }
    }
}).use(container, 'info', {

    validate: function (params) {
        return params.trim().match(/^info\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^info\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Info";
            return '<div class="custom-block info"><p class="title">' + ins + '</p>\n';

        } else {
            return '</div>\n';
        }
    }
}).use(container, 'success', {

    validate: function (params) {
        return params.trim().match(/^success\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^success\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Success";
            return '<div class="custom-block success"><p class="title">' + ins + '</p>\n';

        } else {
            return '</div>\n';
        }
    }
}).use(container, 'tip', {

    validate: function (params) {
        return params.trim().match(/^tip\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^tip\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Tip";
            return '<div class="custom-block tip"><p class="custom-block-title">' + ins + '</p>\n';

        } else {
            return '</div>\n';
        }
    }
}).use(container, 'warning', {

    validate: function (params) {
        return params.trim().match(/^warning\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^warning\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Warning";
            return '<div class="custom-block warning"><p class="custom-block-title">' + ins + '</p>\n';

        } else {
            return '</div>\n';
        }
    }
}).use(container, 'danger', {

    validate: function (params) {
        return params.trim().match(/^danger\s*(.*)$/);
    },

    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^danger\s*(.*)$/);

        if (tokens[idx].nesting === 1) {
            let ins = m[1]?md.utils.escapeHtml(m[1]):"Danger";
            return '<div class="custom-block danger"><p class="custom-block-title">' + ins + '</p>\n';

        } else {
            return '</div>\n';
        }
    }
}).use(emoji);

var fs = require("fs");

// Read file arg[2] to string
// const { argv } = require('process');
// var input = fs.readFileSync(argv[2]);
var input = fs.readFileSync(0);

var res = md.render(input.toString());

console.log(res)
