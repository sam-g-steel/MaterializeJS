// 



// =========
// = humps =
// =========
// version 0.5.1
// Underscore-to-camelCase converter (and vice versa)
// for strings and object keys

// humps is copyright © 2014 Dom Christie
// Released under the MIT license.


(function (global) {

    var _processKeys = function (convert, obj, separator) {
        if (!_isObject(obj) || _isDate(obj) || _isvoidElementsp(obj)) {
            return obj;
        }

        var output,
            i = 0,
            l = 0;

        if (_isArray(obj)) {
            output = [];
            for (l = obj.length; i < l; i++) {
                output.push(_processKeys(convert, obj[i], separator));
            }
        }
        else {
            output = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    output[convert(key, separator)] = _processKeys(convert, obj[key], separator);
                }
            }
        }
        return output;
    };

    // String conversion methods

    var separateWords = function (string, separator) {
        if (separator === undefined) {
            separator = '_';
        }
        return string.replace(/([a-z])([A-Z0-9])/g, '$1' + separator + '$2');
    };

    var camelize = function (string) {
        string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function (match, chr) {
            return chr ? chr.toLowerCase() : '';
        });
    };

    var pascalize = function (string) {
        return camelize(string).replace(/^([a-z])/, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    };

    var decamelize = function (string, separator) {
        return separateWords(string, separator).toLowerCase();
    };

    // Utilities
    // Taken from Underscore.js

    var toString = Object.prototype.toString;

    var _isObject = function (obj) {
        return obj === Object(obj);
    };
    var _isArray = function (obj) {
        return toString.call(obj) == '[object Array]';
    };
    var _isDate = function (obj) {
        return toString.call(obj) == '[object Date]';
    };
    var _isvoidElementsp = function (obj) {
        return toString.call(obj) == '[object voidElementsp]';
    };

    var humps = {
        camelize: camelize,
        decamelize: decamelize,
        pascalize: pascalize,
        depascalize: decamelize,
        camelizeKeys: function (object) {
            return _processKeys(camelize, object);
        },
        decamelizeKeys: function (object, separator) {
            return _processKeys(decamelize, object, separator);
        },
        pascalizeKeys: function (object) {
            return _processKeys(pascalize, object);
        },
        depascalizeKeys: function () {
            return this.decamelizeKeys.apply(this, arguments);
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(humps);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = humps;
    } else {
        global.humps = humps;
    }

})(this);

// 
$.support.cors = true; // IE Fix

DQM = {
    Data: {
        __service: "http://localhost:50148/ViewerDataService.svc/",
        __accesskey: "afa5e7af-f4ca-401f-add6-fbb77c83c6cc",
        __inited: false,
        __ready: null
    }
};


DQM.Data.ready = function (callback) {
    this.__ready = callback;
    if (this.__inited) callback();
};

DQM.Data.genGetDataFuncs = function (callback) {
    $.get(this.__service + "?$format=json&accesskey=", function (data) {
        $.each(data.value, function (i, o) {
            DQM.Data.genGetFunc(o.url);
        });

        DQM.Data.__inited = true;

        if (DQM.Data.__ready) DQM.Data.__ready();
    });
};

DQM.Data.genFilterString = function (filterObject) {
    var filter = "";

    // Build Filter
    if (filterObject) {
        //var keys = Object.keys(filterObject);
        filter += "&$filter=";

        for (var key in filterObject) {
            if (key) filter += key + " eq " + JSON.stringify(filterObject[key]);
        }
    }

    return filter;
};

DQM.Data.getDataFromTable = function (tableName, callingFuncName, callback, options) {
    var filter = "";
    var top = 1000;

    if (options) {
        filter = DQM.Data.genFilterString(options.filter);
        if (options.top) {
            if (typeof options.top == "number") top = options.top;
        }
    }

    $.get(this.__service + tableName + "?$format=json&accesskey=" + this.__accesskey + "$top=" + top + filter, function (data) {
        // Todo: make sure... typeof data == "object"
        // var result = JSON.parse(data);
        console.log(data);

        if (typeof callback != "function") {
            console.warn("a callback function must be passed into \"DQM.Data." + callingFuncName + "\"");
        } else if (data.value) {
            callback(data.value);
        }
    });
};

DQM.Data.genGetFunc = function (tableName) {
    var funcName = humps.camelize("get_" + tableName.toLowerCase()).split("Lookup")[0];

    funcSrc =
    "DQM.Data." + funcName + " = function (callback, options) { \n" +
    "    DQM.Data.getDataFromTable(\"" + tableName + "\", \"" + funcName + "\", callback, options) \n" +
    "}";

    eval(funcSrc);
};


DQM.Data.genGetDataFuncs();
