/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var globalizer = require("./globalizer");

globalizer.init();

var globalization = {
    /**
    * Returns the string identifier for the client's current language.
    * It returns the language identifier string to the successCB callback with a
    * properties object as a parameter. If there is an error getting the language,
    * then the errorCB callback is invoked.
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    *
    * @return Object.value {String}: The language identifier
    *
    * @error GlobalizationError.UNKNOWN_ERROR
    *
    * Example
    *    globalization.getPreferredLanguage(function (language) {alert('language:' + language.value + '\n');},
    *                                function () {});
    */
    getPreferredLanguage:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env);
        result.ok({
            value: navigator.language
        });
    },

    /**
    * Returns the string identifier for the client's current locale setting.
    * It returns the locale identifier string to the successCB callback with a
    * properties object as a parameter. If there is an error getting the locale,
    * then the errorCB callback is invoked.
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    *
    * @return Object.value {String}: The locale identifier
    *
    * @error GlobalizationError.UNKNOWN_ERROR
    *
    * Example
    *    globalization.getLocaleName(function (locale) {alert('locale:' + locale.value + '\n');},
    *                                function () {});
    */
    getLocaleName:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env);
        result.ok({
            value: navigator.language
        });
    },


    /**
    * Returns a date formatted as a string according to the client's user preferences and
    * calendar using the time zone of the client. It returns the formatted date string to the
    * successCB callback with a properties object as a parameter. If there is an error
    * formatting the date, then the errorCB callback is invoked.
    *
    * The defaults are: formatLenght="short" and selector="date and time"
    *
    * @param {Date} date
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            formatLength {String}: 'short', 'medium', 'long', or 'full'
    *            selector {String}: 'date', 'time', or 'date and time'
    *
    * @return Object.value {String}: The localized date string
    *
    * @error GlobalizationError.FORMATTING_ERROR
    *
    * Example
    *    globalization.dateToString(new Date(),
    *                function (date) {alert('date:' + date.value + '\n');},
    *                function (errorCode) {alert(errorCode);},
    *                {formatLength:'short'});
    */
    dateToString:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            params,
            dateObj,
            options,
            selector,
            returnObj;

        if (!args || args.length === 0) {
            result.error("Cannot format date string: Missing date argument");
        } else {
            try {
                params = JSON.parse(decodeURIComponent(args[0]));
            } catch (e) {
                result.error("Cannot format date string: Malformed arguments");
            }
        }

        params.options = params.options || {};
        selector = params.options.selector;

        dateObj = new Date(params.date);
        options = {
            formatLength: params.options.formatLength,
            date: selector === "date" || selector === "date and time" || undefined,
            time: selector === "time" || selector === "date and time" || undefined
        };

        returnObj = {
            value: globalizer.formatDate(dateObj, options)
        };

        result.ok(returnObj);

    },


    /**
    * Parses a date formatted as a string according to the client's user
    * preferences and calendar using the time zone of the client and returns
    * the corresponding date object. It returns the date to the successCB
    * callback with a properties object as a parameter. If there is an error
    * parsing the date string, then the errorCB callback is invoked.
    *
    * The defaults are: formatLength="short" and selector="date and time"
    *
    * @param {String} dateString
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            formatLength {String}: 'short', 'medium', 'long', or 'full'
    *            selector {String}: 'date', 'time', or 'date and time'
    *
    * @return    Object.year {Number}: The four digit year
    *            Object.month {Number}: The month from (0 - 11)
    *            Object.day {Number}: The day from (1 - 31)
    *            Object.hour {Number}: The hour from (0 - 23)
    *            Object.minute {Number}: The minute from (0 - 59)
    *            Object.second {Number}: The second from (0 - 59)
    *            Object.millisecond {Number}: The milliseconds (from 0 - 999),
    *                                        not available on all platforms
    *
    * @error GlobalizationError.PARSING_ERROR
    *
    * Example
    *    globalization.stringToDate('4/11/2011',
    *                function (date) { alert('Month:' + date.month + '\n' +
    *                    'Day:' + date.day + '\n' +
    *                    'Year:' + date.year + '\n');},
    *                function (errorCode) {alert(errorCode);},
    *                {selector:'date'});
    */
    stringToDate:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            params,
            dateObj,
            options,
            selector,
            returnObj;

        if (!args || args.length === 0) {
            result.error("Cannot parse date string: Missing string argument");
        } else {
            try {
                params = JSON.parse(decodeURIComponent(args[0]));
            } catch (e) {
                result.error("Cannot parse date string: Malformed arguments");
            }
        }

        options = params.options || {};

        // Make selector lowercase if it is provided
        selector = options.selector ? options.selector.toLowerCase().trim() : "";

        options = {
            formatLength: options.formatLength,
            date: selector === "date" || selector === "date and time" || undefined,
            time: selector === "time" || selector === "date and time" || undefined
        };

        returnObj = globalizer.stringToFormattedDate(params.dateString, options);
        result.ok(returnObj);
    },


    /**
    * Returns a pattern string for formatting and parsing dates according to the client's
    * user preferences. It returns the pattern to the successCB callback with a
    * properties object as a parameter. If there is an error obtaining the pattern,
    * then the errorCB callback is invoked.
    *
    * The defaults are: formatLength="short" and selector="date and time"
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            formatLength {String}: 'short', 'medium', 'long', or 'full'
    *            selector {String}: 'date', 'time', or 'date and time'
    *
    * @return    Object.pattern {String}: The date and time pattern for formatting and parsing dates.
    *                                    The patterns follow Unicode Technical Standard #35
    *                                    http://unicode.org/reports/tr35/tr35-4.html
    *            Object.timezone {String}: The abbreviated name of the time zone on the client
    *            Object.utc_offset {Number}: The current difference in seconds between the client's
    *                                        time zone and coordinated universal time.
    *            Object.dst_offset {Number}: The current daylight saving time offset in seconds
    *                                        between the client's non-daylight saving's time zone
    *                                        and the client's daylight saving's time zone.
    *
    * @error GlobalizationError.PATTERN_ERROR
    *
    * Example
    *    globalization.getDatePattern(
    *                function (date) {alert('pattern:' + date.pattern + '\n');},
    *                function () {},
    *                {formatLength:'short'});
    */
    getDatePattern:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            params,
            dateObj,
            options,
            selector,
            returnObj;

        if (!args || args.length === 0) {
            result.error("Cannot format date string: Missing date argument");
        } else {
            try {
                params = JSON.parse(decodeURIComponent(args[0]));
            } catch (e) {
                result.error("Cannot format date string: Malformed arguments");
            }
        }

        options = params.options || {};

        // Make selector lowercase if it is provided
        selector = options.selector ? options.selector.toLowerCase().trim() : "";

        options = {
            formatLength: options.formatLength,
            date: selector === "date" || selector === "date and time" || undefined,
            time: selector === "time" || selector === "date and time" || undefined
        };

        returnObj = globalizer.getDatePattern(options);

        result.ok(returnObj);
    },


    /**
    * Returns an array of either the names of the months or days of the week
    * according to the client's user preferences and calendar. It returns the array of names to the
    * successCB callback with a properties object as a parameter. If there is an error obtaining the
    * names, then the errorCB callback is invoked.
    *
    * The defaults are: type="wide" and item="months"
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            type {String}: 'narrow' or 'wide'
    *            item {String}: 'months', or 'days'
    *
    * @return Object.value {Array{String}}: The array of names starting from either
    *                                        the first month in the year or the
    *                                        first day of the week.
    * @error GlobalizationError.UNKNOWN_ERROR
    *
    * Example
    *    globalization.getDateNames(function (names) {
    *        for(var i = 0; i < names.value.length; i++) {
    *            alert('Month:' + names.value[i] + '\n');}},
    *        function () {});
    */
    getDateNames:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            params,
            options,
            returnObj;

        try {
            params = JSON.parse(decodeURIComponent(args[0]));
        } catch (e) {
            result.error("Cannot format date string: Malformed arguments");
        }

        options = params.options || {};

        returnObj = {
            value: globalizer.getDateNames(options)
        };

        result.ok(returnObj);
    },

    /**
    * Returns whether daylight savings time is in effect for a given date using the client's
    * time zone and calendar. It returns whether or not daylight savings time is in effect
    * to the successCB callback with a properties object as a parameter. If there is an error
    * reading the date, then the errorCB callback is invoked.
    *
    * @param {Date} date
    * @param {Function} successCB
    * @param {Function} errorCB
    *
    * @return Object.dst {Boolean}: The value "true" indicates that daylight savings time is
    *                                in effect for the given date and "false" indicate that it is not.
    *
    * @error GlobalizationError.UNKNOWN_ERROR
    *
    * Example
    *    globalization.isDayLightSavingsTime(new Date(),
    *                function (date) {alert('dst:' + date.dst + '\n');}
    *                function () {});
    */
    isDayLightSavingsTime:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            params,
            date,
            returnObj;

        try {
            params = JSON.parse(decodeURIComponent(args[0]));
        } catch (e) {
            result.error("Cannot format date string: Malformed arguments");
        }

        date = new Date(params.date);

        returnObj = {
            dst: globalizer.isDayLightSavingsTime(date)
        };

        result.ok(returnObj);

    },

    /**
    * Returns the first day of the week according to the client's user preferences and calendar.
    * The days of the week are numbered starting from 1 where 1 is considered to be Sunday.
    * It returns the day to the successCB callback with a properties object as a parameter.
    * If there is an error obtaining the pattern, then the errorCB callback is invoked.
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    *
    * @return Object.value {Number}: The number of the first day of the week.
    *
    * @error GlobalizationError.UNKNOWN_ERROR
    *
    * Example
    *    globalization.getFirstDayOfWeek(function (day)
    *                { alert('Day:' + day.value + '\n');},
    *                function () {});
    */
    getFirstDayOfWeek:function(successCB, failureCB, args, env) {
        var result = new PluginResult(args, env),
            returnObj,
            ISO_SUNDAY = 7,
            CORDOVA_SUNDAY = 1,
            CORDOVA_MONDAY = 2;

        returnObj = {
            value: globalizer.getFirstDayOfWeek() === ISO_SUNDAY ? CORDOVA_SUNDAY : CORDOVA_MONDAY
        };

        result.ok(returnObj);

    },


    /**
    * Returns a number formatted as a string according to the client's user preferences.
    * It returns the formatted number string to the successCB callback with a properties object as a
    * parameter. If there is an error formatting the number, then the errorCB callback is invoked.
    *
    * The defaults are: type="decimal"
    *
    * @param {Number} number
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            type {String}: 'decimal', "percent", or 'currency'
    *
    * @return Object.value {String}: The formatted number string.
    *
    * @error GlobalizationError.FORMATTING_ERROR
    *
    * Example
    *    globalization.numberToString(3.25,
    *                function (number) {alert('number:' + number.value + '\n');},
    *                function () {},
    *                {type:'decimal'});
    */
    numberToString:function(successCB, failureCB) {

        failureCB("not supported");
    },

    /**
    * Parses a number formatted as a string according to the client's user preferences and
    * returns the corresponding number. It returns the number to the successCB callback with a
    * properties object as a parameter. If there is an error parsing the number string, then
    * the errorCB callback is invoked.
    *
    * The defaults are: type="decimal"
    *
    * @param {String} numberString
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            type {String}: 'decimal', "percent", or 'currency'
    *
    * @return Object.value {Number}: The parsed number.
    *
    * @error GlobalizationError.PARSING_ERROR
    *
    * Example
    *    globalization.stringToNumber('1234.56',
    *                function (number) {alert('Number:' + number.value + '\n');},
    *                function () { alert('Error parsing number');});
    */
    stringToNumber:function(successCB, failureCB) {

        failureCB("not supported");
    },

    /**
    * Returns a pattern string for formatting and parsing numbers according to the client's user
    * preferences. It returns the pattern to the successCB callback with a properties object as a
    * parameter. If there is an error obtaining the pattern, then the errorCB callback is invoked.
    *
    * The defaults are: type="decimal"
    *
    * @param {Function} successCB
    * @param {Function} errorCB
    * @param {Object} options {optional}
    *            type {String}: 'decimal', "percent", or 'currency'
    *
    * @return    Object.pattern {String}: The number pattern for formatting and parsing numbers.
    *                                    The patterns follow Unicode Technical Standard #35.
    *                                    http://unicode.org/reports/tr35/tr35-4.html
    *            Object.symbol {String}: The symbol to be used when formatting and parsing
    *                                    e.g., percent or currency symbol.
    *            Object.fraction {Number}: The number of fractional digits to use when parsing and
    *                                    formatting numbers.
    *            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
    *            Object.positive {String}: The symbol to use for positive numbers when parsing and formatting.
    *            Object.negative: {String}: The symbol to use for negative numbers when parsing and formatting.
    *            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
    *            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
    *
    * @error GlobalizationError.PATTERN_ERROR
    *
    * Example
    *    globalization.getNumberPattern(
    *                function (pattern) {alert('Pattern:' + pattern.pattern + '\n');},
    *                function () {});
    */
    getNumberPattern:function(successCB, failureCB) {

        failureCB("not supported");
    },

    /**
    * Returns a pattern string for formatting and parsing currency values according to the client's
    * user preferences and ISO 4217 currency code. It returns the pattern to the successCB callback with a
    * properties object as a parameter. If there is an error obtaining the pattern, then the errorCB
    * callback is invoked.
    *
    * @param {String} currencyCode
    * @param {Function} successCB
    * @param {Function} errorCB
    *
    * @return    Object.pattern {String}: The currency pattern for formatting and parsing currency values.
    *                                    The patterns follow Unicode Technical Standard #35
    *                                    http://unicode.org/reports/tr35/tr35-4.html
    *            Object.code {String}: The ISO 4217 currency code for the pattern.
    *            Object.fraction {Number}: The number of fractional digits to use when parsing and
    *                                    formatting currency.
    *            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
    *            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
    *            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
    *
    * @error GlobalizationError.FORMATTING_ERROR
    *
    * Example
    *    globalization.getCurrencyPattern('EUR',
    *                function (currency) {alert('Pattern:' + currency.pattern + '\n');}
    *                function () {});
    */
    getCurrencyPattern:function(successCB, failureCB) {

        failureCB("not supported");
    }
};

module.exports = globalization;

