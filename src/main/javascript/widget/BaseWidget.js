/*global window*/
define(["jquery", "util/QueryParameters", "lib/lucid", "iframeapi"],
    function ($, QueryParameters, LucidJS, Iframe) {
        "use strict";

        /**
         * Generic base functionality for widgets.
         *
         * @event activate When the widget is potentially visible to the user.
         * @event deactivate When the widget is no longer visible to the user.
         * @event resize When the window is resized.
         * @event unload When the window is about to be destroyed.
         *
         * @author Bo Gotthardt
         * @constructor
         *
         * @param {Object} options
         */
        function BaseWidget(options) {
            var scope = this;
            this.options = options;

            this.element = $("<div class='BaseWidget'></div>")
                .appendTo("body");

            /**
             * Whether the widget is currently active.
             * @type {Boolean}
             */
            this.active = false;

            /**
             * A promise for the widget having finished initializing.
             * Subclasses must resolve this when they are done initializing.
             * @type {$.Deferred}
             */
            this.initialized = new $.Deferred();

            Iframe.addEventListener(Iframe.IFRAME_WIDGET_ACTIVATE, function (event) {
                scope.activate(event);
            });

            Iframe.addEventListener(Iframe.IFRAME_WIDGET_DEACTIVATE, function (event) {
                scope.deactivate(event);
            });

            $(window).on("resize", function () {
                scope.trigger("resize");
            });

            $(window).on("beforeunload", function () {
                scope.trigger("unload");
            });
        }

        // Mix-in event handling functionality.
        LucidJS.emitter(BaseWidget.prototype);

        /**
         * Activate the widget. Is called automatically by the Iframe API.
         * @param event
         */
        BaseWidget.prototype.activate = function (event) {
            this.active = true;
            this.trigger("activate", event);
        };

        /**
         * Deactivate the widget. Is called automatically by the Iframe API.
         * @param event
         */
        BaseWidget.prototype.deactivate = function (event) {
            this.active = false;
            this.trigger("deactivate", event);
        };

        /**
         * Make the widget visible.
         */
        BaseWidget.prototype.show = function () {
            this.element.toggleClass("hidden", false);
        };

        /**
         * Hide the widget.
         */
        BaseWidget.prototype.hide = function () {
            this.element.toggleClass("hidden", true);
        };

        return BaseWidget;
    });