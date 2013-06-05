/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                ignores: ["src/main/javascript/lib/**/*.js",
                          "src/main/javascript/full-page-video/**/*.js"]
            },
            all: {
                src: ["src/main/javascript/**/*.js",
                      "src/test/javascript/**/*.js",
                      "Gruntfile.js",
                      "package.json"]
            }
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
            widget: {
                options: {
                    name: "widget",
                    out: "target/widget/widget.js",
                    deps: ["lib/require",
                           "require.config.js",
                           "widget/TextWidget",
                           "widget/ImageWidget"]
                }
            },
            configure: {
                options: {
                    name: "configure",
                    out: "target/configure/configure.js",
                    deps: ["lib/require",
                           "require.config.js"]
                }
            }
        },
        "string-replace": {
            options: {
                replacements: [{
                    pattern: /\s*<script src="lib\/require\.js"><\/script>/,
                    replacement: ""
                }, {
                    pattern: /\s*<script src="require\.config\.js"><\/script>/,
                    replacement: ""
                }]
            },
            widget: {
                files: [{
                    src: "src/main/javascript/widget.html",
                    dest: "target/widget/widget.html"
                }]
            },
            configure: {
                files: [{
                    src: "src/main/javascript/configure.html",
                    dest: "target/configure/configure.html"
                }]
            }
        },
        copy: {
            configure: {
                files: [{
                    expand: true,
                    cwd: "src/main/javascript/styling",
                    src: ["img/**", "font/**"],
                    dest: "target/configure/styling"
                }]
            }
        },
        clean: {
            // Trying to delete the target folder itself makes the requirejs task randomly fail.
            widget: ["target/widget/**/*"],
            configure: ["target/configure/**/*"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-string-replace");

    grunt.registerTask("default", ["widget"]);
    grunt.registerTask("widget", ["jshint:all", "clean:widget", "requirejs:widget", "string-replace:widget"]);
    grunt.registerTask("configure", ["jshint:all", "clean:configure", "requirejs:configure", "string-replace:configure", "copy:configure"]);
};