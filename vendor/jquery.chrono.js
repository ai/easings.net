/**
 * @fileOverview The jQuery Chrono plugin
 * Copyright (c) 2011 Arthur Klepchukov
 * Licensed under the BSD license (BSD_LICENSE.txt)
 *
 * @author <a href="mailto:first-name.last-name@gmail.com">Arthur Klepchukov</a>
 * @version 1.2
 */

/*global jQuery, $ */ 
var jQueryChrono;

/**
 * @namespace Main namespace
 */
jQueryChrono = (function() {
  /**
   * Syntactic sugar for setTimeout.
   * <pre>
   *    setTimeout(function() { ... }, 300000); // becomes:
   *    $.after(5, "minutes", function() { ... });
   *    
   *    // other valid calls:
   *    $.after(100, function() { ... }); // 100 milliseconds
   *    $.after("9.7", function() { ... }); // 9.7 milliseconds
   *    $.after("50sec", function() { ... }); // 50 seconds
   *    $.after("33", "hours", function() { ... }); // 33 hours
   *    $.after("minute", function() { ... }); // 1 minute
   *    $.after("1 hour, 2 minutes, 15 seconds", function() { ... }); // 1:02:15 hours
   *    $.after("1min, 15 s", function() { ... }); // 1:15 minutes
   * </pre>
   * Valid time units include: 
   * <strong>millisecond, second, minute, hour, & day</strong><br />
   * along with all their common abbreviations and pluralizations.<br />
   * (See full list of valid time units: {@link jQueryChrono-valid_units})
   * @name jQuery.after
   */
  function after() {
    var timer = jQueryChrono.create_timer.apply(this, arguments);
    return setTimeout(timer.callback, timer.when);
  }
  
  /**
   * Syntactic sugar for setTimeout.
   * <pre>
   *    setInterval(function() { ... }, 300000); // becomes:
   *    $.every(5, "minutes", function() { ... });
   * </pre>
   * Supports the same syntax and arguments as {@link jQuery.after}
   * @name jQuery.every
   */
  function every() {
    var timer = jQueryChrono.create_timer.apply(this, arguments);
    return setInterval(timer.callback, timer.when);
  }
  
  /**
   * Reasonable defaults (delay: 4, units: ms), based on how Mozilla works with timers:
   * https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
   * @constant
   */
  var defaults = {
        delay: 4,
        units: "milliseconds"
      },
      // each supported unit, in milliseconds
      ms  = 1,
      sec = ms  * 1000,
      min = sec * 60,
      hr  = min * 60,
      day = hr  * 24;
      
  /**
   * The supported units of time:<br />
   *  millisecond, milliseconds, ms,<br />
   *  second, seconds, sec, secs, s,<br />
   *  minute, minutes, min, mins, m,<br />
   *  hour, hours, hr, hrs, h,<br />
   *  day, days, d
   * @constant
   */
  var valid_units = {
        "millisecond" : ms,
        "milliseconds": ms,
        "ms"          : ms,
        
        "second"      : sec,
        "seconds"     : sec,
        "sec"         : sec,
        "secs"        : sec,
        "s"           : sec,
        
        "minute"      : min,
        "minutes"     : min,
        "min"         : min,
        "mins"        : min,
        "m"           : min,
        
        "hour"        : hr,
        "hours"       : hr,
        "hr"          : hr,
        "hrs"         : hr,
        "h"           : hr,
        
        "day"         : day,
        "days"        : day,
        "d"           : day
      };
  
  /**
   * Trim string. Copied from jQuery.
   * @param {String} text to be trimmed
   * @returns {String} string without leading or trailing spaces
   */
  var trim;
  if (typeof(jQuery) !== 'undefined') {
    trim = jQuery.trim;
  } else {
    trim = String.prototype.trim2 ?
        function(text) {
                return text == null ? "" :
                String.prototype.trim.call( text );
        } : function(text) {
            return text == null ? "" :
                text.toString().replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
        }
  }
  
  /**
   * Parses a numerical delay from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the delay is not a number
   * @returns {Object} The parsed parameter updated with the parsed delay
   */
  function parse_delay(parsed, args) {
    if (typeof args[0] === "string") {
      parsed.delay = parseFloat(args[0], 10);
      if (isNaN(parsed.delay)) {
        parsed.delay = (valid_units[args[0]] > ms) ? 1 : defaults.delay;
      }
    } else {
      parsed.delay = args[0];
    }
    
    if (typeof parsed.delay !== "number" || isNaN(parsed.delay)) {
      throw "$.after and $.every - Require a numerical delay as the 1st argument";
    }
    
    return parsed;
  }
  
  /**
   * Parses a units string from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the units are not a key of {@link jQueryChrono-valid_units}
   * @returns {Object} The parsed parameter updated with the parsed units
   */
  function parse_units(parsed, args) {
    if (typeof args[0] === "string" && parsed.delay !== null) {
      parsed.units = trim(args[0].replace(parsed.delay, "")) || null; // "9.7sec" || "9.7"
    }
    if (typeof args[1] === "string") {
      parsed.units = args[1];
    }
    if (parsed.units === null && args.length === 2) { // no units specified
      parsed.units = defaults.units;
    }
    
    if (typeof valid_units[parsed.units] !== "number") {
      throw "$.after and $.every - Require a valid unit of time as the 2nd argument";
    }
    
    return parsed;
  }
  
  /**
   * Parses a callback function from the given arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the callback is not a function
   * @returns {Object} The parsed parameter updated with the parsed callback
   */
  function parse_callback(parsed, args) {
    parsed.callback = args[args.length - 1];
    
    if (typeof(parsed.callback) != 'function') {
      throw "$.after and $.every - Require a callback as the last argument";
    }
    
    return parsed;
  }
  
  /**
   * Parses a string sequence of delay with unit arguments.
   * 
   * @param {Object} parsed The arguments parsed so far
   * @param {arguments} args The original arguments from the caller
   *  (e.g. {@link jQueryChrono.create_timer})
   * @throws Exception if the sequence contains blanks, invalid delays, or invalid units
   * @returns {Object} The parsed parameter updated with the parsed delay 
   *  and units, each set to the minimum unit in the sequence
   * @example "1 minute, 15 seconds" // parsed = { delay: 75, units: "seconds" }
   */
  function parse_sequence(parsed, args) {
    var commaArgs, name, minInterval = '', timer, timers = [];
    
    // if the first arg is a string, try splitting it on commas
    commaArgs = (typeof args[0] === 'string') ? args[0].split(',') : [];
    
    // create a timer for each sequence element
    for (name in commaArgs) {
      if (! /\d\s?\w+/.test(commaArgs[name])) {
        throw "$.after and $.every - Invalid delays with units sequence: " + 
          commaArgs.join(',');
      }
      timer = create_timer.call(this, commaArgs[name], parsed.callback);
      
      // keep track of the minimum interval so we can convert the whole set to this in the next loop
      if (minInterval === '' || valid_units[timer.units] <= valid_units[minInterval]) {
        minInterval = timer.units;
      }
      timers[name] = timer;
    }
    parsed.units = minInterval;
    
    // convert each timer to the lowest interval, then add those units to parsed.delay
    for (name in timers) {
      parsed.delay += timers[name].delay * (valid_units[timers[name].units] / valid_units[minInterval]);
    }
    return parsed;
  }
  
  /**
   * Accepts more human-readable arguments for creating JavaScript timers and 
   * converts them to values that can be inspected and passed along to 
   * setTimeout or setInterval.<br />
   * If the time when the timer should run is negative or faster than 
   * the default ({@link jQueryChrono-defaults}), 
   * it uses the default delay and default units.
   *
   * @param {Number|String} delay|delay+units 
   *  Combined with units, represents when a timer should run.<br />
   *  Units can be specified as part of this argument as a suffix of the string and 
   *  must represent a valid unit of time ({@link jQueryChrono-valid_units}).
   * @param {String} [units] 
   *  Combined with the delay, represents when a timer should run.
   *  If present, must be a valid unit of time ({@link jQueryChrono-valid_units}).
   * @param {Function} callback 
   *  Represents the code to be executed when the timer is ready.
   * 
   * @returns {Object} An object with a valid "delay", a valid "units" string, 
   *  a time, in milliseconds, of "when" the timer should run, and 
   *  a "callback" that the timer should execute when it's ready.
   * @static
   */
  function create_timer() {
    var parsed = {
      delay : null,
      units : null,
      when : null,
      callback : null
    };
    
    if (arguments.length < 2 || arguments.length > 3) {
      throw "$.after and $.every - Accept only 2 or 3 arguments";
    }
    
    parsed = parse_callback(parsed, arguments);
    if (typeof arguments[0] === 'string' && arguments[0].search(',') > -1) {
      parsed = parse_sequence(parsed, arguments);
    } else {
      parsed = parse_delay(parsed, arguments);
      parsed = parse_units(parsed, arguments);
    }
    
    // Reset to defaults, if necessary
    if (parsed.delay < defaults.delay && parsed.units === defaults.units) {
      parsed.delay = defaults.delay;
    }
    if (parsed.delay < 0) {
      parsed.delay = defaults.delay;
      parsed.units = defaults.units;
    }
    
    parsed.when = parsed.delay * valid_units[parsed.units];
    
    return parsed;
  }
  
  /** @scope jQueryChrono */
  return {
    every : every,
    after : after,
    defaults : defaults,
    valid_units : valid_units,
    create_timer : function() {
      return create_timer.apply(this, arguments);
    }
  };
}());

/**
 * The extended jQuery library
 * @name jQuery
 * @class the extended jQuery library
 * @exports $ as jQuery
 */
if (typeof(jQuery) !== 'undefined') {
  jQuery.extend({
    after : jQueryChrono.after,
    every : jQueryChrono.every
  });
}
