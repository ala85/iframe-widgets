/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jslint: {
            files: ["src/main/javascript/**/*.js",
                    "src/test/javascript/**/*.js",
                    "Gruntfile.js",
                    "package.json"],
            exclude: ["src/main/javascript/lib/*.js",
                      "src/main/javascript/full-page-video/**/*.js"],
            directives: {
                plusplus: true,
                vars: true,
                nomen: true,
                todo: true,
                predef: ["define", "require"]
            }/*,
            options: {
                jslintXml: "target/jslint.xml",
                junit: "target/jslint-junit.xml",
                checkstyle: "target/jslint-checkstyle.xml"
            }*/
        },
        requirejs: {
            options: {
                baseUrl: "src/main/javascript",
                mainConfigFile: "src/main/javascript/require.config.js",
                logLevel: 1,
                optimize: "uglify2",
                preserveLicenseComments: false,
                generateSourceMaps: true
            },
            dist: {
                options: {
                    name: "main",
                    out: "target/widget.min.js",
                    deps: ["lib/require",
                           "require.config.js",
                           "widget/TextWidget",
                           "widget/ImageWidget"/*,
                           "widget/DebugWidget",
                           "widget/CardFlipWidget"*/]
                }
            }
        },
        cssmin: {
            options: {
                report: "min"
            },
            dist: {
                files: {
                    "target/widget.min.css": ["src/main/css/**/*.css"]
                }
            }
        },
        "string-replace": {
            dist: {
                options: {
                    replacements: [{
                        pattern: "../css/styling.css",
                        replacement: "widget.min.css"
                    }, {
                        pattern: /\s*<script src="lib\/require\.js"><\/script>\r\n/,
                        replacement: ""
                    }, {
                        pattern: /\s*<script src="require\.config\.js"><\/script>/,
                        replacement: ""
                    }, {
                        pattern: "src=\"main.js\"",
                        replacement: "src=\"widget.min.js\""
                    }]
                },
                files: [{
                    src: "src/main/javascript/dev.html",
                    dest: "target/widget.html"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-jslint");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-string-replace");

    grunt.registerTask("default", ["jslint", "requirejs:dist", "cssmin:dist", "string-replace:dist"]);
};