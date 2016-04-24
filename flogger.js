/*!
 * Felsher Logger
 *
 * Copyright 2016 Andrew Felsher
 * Released under the MIT license.
 * https://opensource.org/licenses/MIT
 *
 */

"use strict";

if (typeof flogger != "undefined") {
    console.log("WARN: flogger already defined");
} else {
    var flogger = {

        LogLevel : {
            NONE : 0,
            TRACE : 1,
            DEBUG : 2,
            INFO : 3,
            WARN : 4,
            ERROR : 5,
        },

        indent : "    ",

        getLogLevelLabel : function(logLevel) {
            switch (logLevel) {
                case flogger.LogLevel.TRACE:
                    return "TRACE";
                case flogger.LogLevel.DEBUG:
                    return "DEBUG";
                case flogger.LogLevel.INFO:
                    return "INFO";
                case flogger.LogLevel.WARN:
                    return "WARN";
                case flogger.LogLevel.ERROR:
                    return "ERROR";
                case flogger.LogLevel.NONE:
                default:
                    return "";
            }
        },

        logError : function(err) {
            flogger.logMessage(flogger.LogLevel.ERROR, "Caught " + err.name
                    + ": " + err.message + ":");
            flogger.logStack(err.stack);
        },

        logMessage : function(logLevel, msg) {
            var logLabel = "";
            var prefix = "";

            if (logLevel > flogger.maxLogLevel
                    || logLevel < flogger.minLogLevel) {
                return;
            }

            logLabel = flogger.getLogLevelLabel(logLevel);

            switch (logLevel) {
                case flogger.LogLevel.TRACE:
                case flogger.LogLevel.DEBUG:
                case flogger.LogLevel.INFO:
                case flogger.LogLevel.WARN:
                case flogger.LogLevel.ERROR:
                    prefix += logLabel + "(" + logLevel + ")";
                default:
                    break;
            }

            if (prefix.length >= 0) {
                prefix += ": ";
            }

            flogger.logPlain(prefix + msg)
        },

        logPlain : function(msg) {
            console.log(msg);
        },

        logStack : function(stack) {
            stack = flogger.prettyStack(stack);
            var lines = stack.split("\n");
            for (var li = 0; li < lines.length; li++) {
                flogger.logPlain("          " + lines[li]);
            }
        },

        logTraceEntry : function(func) {
            flogger.logMessage(flogger.LogLevel.TRACE, "ENTRY: " + func.name);
        },

        logTraceExit : function(func) {
            flogger.logMessage(flogger.LogLevel.TRACE, " EXIT: " + func.name);
        },

        prettyStack : function(stack) {
            var ret = "";
            var lines = stack.replace(/\r/g, "").split("\n");
            var type = 0;
            var li = 0;
            var delim = " ";
            var limaxd = 0;

            if (stack.indexOf("@") != -1) {

                delim = "@";
                type = 1;
                limaxd = 1;

            } else if (stack.indexOf("    at ") != -1) {

                delim = " ";
                li = 1;
                type = 2;

            } else {

                logMessage(flogger.LogLevel.WARN,
                        "Could not identify error stack type.");
                return stack;

            }

            for (; li < lines.length - limaxd; li++) {

                var lpieces = null;

                switch (type) {
                    case 1:
                        lpieces = lines[li].split(delim);

                        ret += lines[li].substring(lpieces[0].length
                                + delim.length);
                        
                        if (lpieces.length >= 2) {
                            if (lpieces[0].length > 0) {
                                ret += " " + lpieces[0] + "()";
                            }
                        }

                        break;
                    case 2:
                        lpieces = lines[li].replace(/\s+at\s+/g, "").split(
                                delim);

                        if (lpieces.length >= 2) {
                            ret += lpieces[1].substring(1,
                                    lpieces[1].length - 2);
                        } else {
                            ret += lpieces[0];
                        }

                        if (lpieces.length >= 2) {
                            if (lpieces[0].length >= 0) {
                                ret += " " + lpieces[0] + "()";
                            }
                        }

                        break;
                    default:
                        logMessage(flogger.LogLevel.WARN,
                                "Could not identify error stack type: " + type
                                        + ". Returning plain stack.");
                        return stack;
                }

                if (li < lines.length - limaxd - 1) {
                    ret += "\n";
                }
            }

            return ret;
        }
    };

    flogger.maxLogLevel = flogger.LogLevel.ERROR;
    flogger.minLogLevel = flogger.LogLevel.TRACE;
};