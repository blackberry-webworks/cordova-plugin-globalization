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

debugger;
var globalizer,
    moment = require("./moment-with-langs.min"),
    //cldr = require("./cldr"),
    //globalize = require("./globalize"),
    MOMENT_DATE_FORMAT = {
        DATE_TIME: {
            SHORT: "L LT",
            MEDIUM: "lll",
            LONG: "LLL",
            FULL: "LLLL"
        }
    };

function loadCldrResource(path, done) {
    var xhr = new XMLHttpRequest(),
        async = done || false;

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            globalize.load(JSON.parse(xhr.responseText));
            if (done) {
                done(JSON.parse(xhr.responseText));
            }
        }
    };

    xhr.open("GET", "local:///plugins/org.apache.cordova.globalization/cldr/" + path, async);
    xhr.send();
}


function init() {
    // Load cldr data
    /*
    loadCldrResource("main/en/ca-gregorian.json"); // calendar
    loadCldrResource("main/en/numbers.json");
    loadCldrResource("supplemental/likelySubtags.json");
    loadCldrResource("supplemental/timeData.json");
    loadCldrResource("supplemental/weekData.json");
    */

    // Set context to current language
    moment.lang(navigator.language);
}

function _getCurrentTimezoneName() {
    // Parse current date to get timezone
    var expr = /\((.+)\)$/,
        matches = expr.exec(new Date().toString()),
        result,
        TIMEZONE_NUMBER_FORMAT = "ZZ";

    // Use +0000 format if timezone name cannot be found
    result = matches.length > 1 ? matches[1] : moment(new Date()).format(TIMEZONE_NUMBER_FORMAT);

    return result;
}

/* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*/
function getDatePattern(options) {
    var langData = moment.langData(),
        formatPattern = "",
        formatLength,
        formatComponents,
        displayDate,
        displayTime,
        timezoneOffset,
        timzone,
        returnObj = {};

    options = options || {};

    // Default to using date and time if no options provided
    displayDate = (options.date !== undefined) || (options.time !== undefined) ? options.date : true;
    displayTime = (options.date !== undefined) || (options.time !== undefined) ? options.time : true;

    // Default format length is SHORT
    formatLength = options.formatLength ? options.formatLength.toUpperCase() : "SHORT";

    if (displayDate) {
        // Some formats are special and require multiple parts
        formatComponents = MOMENT_DATE_FORMAT.DATE_TIME[formatLength].split(" ");

        // Transform values with map(), rebuild string with join() afterwards
        formatComponents = formatComponents.map(function (component) {
            return langData.longDateFormat(component);
        });

        // Moment.js quirk: LT at the end is not expanded
        // Expand it if time was requested, omit otherwise
        formatPattern = formatComponents.join(" ");
        formatPattern = formatPattern.replace(/LT/g, displayTime ? langData.longDateFormat("LT") : "");

    } else if (displayTime) {
        // Only display time
        formatPattern = langData.longDateFormat("LT");
    }

    // Timezone Handling
    timezoneOffset = moment().zone() * 60; // convert minutes to seconds
    timezone = _getCurrentTimezoneName();

    // Form return object
    returnObj = {
        pattern: formatPattern.trim(),
        timezone: timezone,
        utc_offset: timezoneOffset,
        dst_offset: 0 // not supported
    };

    return returnObj;
}

function getDateNames(options) {
    var langData = moment.langData(),
        itemStr,
        typeStr,
        result;

    options = options || {};
    // Default options: type = wide, item = months
    options.item = options.item ? options.item.toLowerCase() : "months";
    options.type = options.type ? options.type.toLowerCase() : "wide";

    itemStr = (options.item === "days") ? "_weekdays" : "_months";
    typeStr = (options.type === "narrow") ? "Short" : "";

    result = langData[itemStr + typeStr];

    return result;

}

function isDayLightSavingsTime(date) {
    return moment(date).isDST();
}

function formatDate(dateObj, options) {
    var momentDate = moment(dateObj),
        formatPattern;

    options = options || {};

    formatPattern = getDatePattern(options).pattern;

    return momentDate.format(formatPattern);
}

function getFirstDayOfWeek() {
    var firstDay = moment().weekday(0);
    return firstDay.isoWeekday();
}

function stringToFormattedDate(dateString, options) {
    // String can be parsed by Moment without having to specify a format
    var dateObj = moment(dateString),
        displayDate,
        displayTime,
        returnObj = {};

    options = options || {};

    // Default to using both date and time if no options provided
    displayDate = options.date || options.time ? options.date : true;
    displayTime = options.date || options.time ? options.time : true;

    if (displayDate) {
        returnObj.year = dateObj.year();
        returnObj.month = dateObj.month();
        returnObj.day = dateObj.date();
    }

    if (displayTime) {
        returnObj.hour = dateObj.hour();
        returnObj.minute = dateObj.minute();
        returnObj.second = dateObj.second();
        returnObj.millisecond = dateObj.millisecond();
    }

    return returnObj;

}

globalizer = {
    init: init,
    loadCldrResource: loadCldrResource,
    getDatePattern: getDatePattern,
    getDateNames: getDateNames,
    formatDate: formatDate,
    isDayLightSavingsTime: isDayLightSavingsTime,
    getFirstDayOfWeek: getFirstDayOfWeek,
    stringToFormattedDate: stringToFormattedDate
};

module.exports = globalizer;
