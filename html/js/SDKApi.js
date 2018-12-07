(function ($) {

    var SDK_ERROR_CODES_MAP = {
        66: 'OPERATION TEMPORARILY UNAVAILABLE',
        69: 'APP ALREADY RUNNING',
        70: 'APP START FAILED',
        71: 'APP STOP FAILED',
        72: 'APP UPLOAD FAIL',
        73: 'NO ENOUGH SPACE LEFT ON DEVICE',
        74: 'INVALID APPLICATION PACKAGE',
        75: 'HIGHER OR SIMILAR VERSION IS ALREADY AVAILABLE',
        76: 'APP INSTALL FAIL',
        77: 'APP NOT FOUND',
        78: 'App Recording already Running',
        79: 'APP IS NOT RUNNING',
        80: 'Debug viewer is already running',
        81: 'LOWER VERSION IS ALREADY INSTALLED',
        82: 'Camera platform could not be recognised',
        83: 'Mismatch between package and camera platform',
        84: 'System recovered from an error! DB is reset to default.\nPlease try again.'
    };

    var reqUrl = window.location.protocol+"//" + window.location.hostname + "/cgi-bin/stw.cgi";
	if (BrowserDetect.browser == 'Explorer' || (BrowserDetect.browser == 'Safari' && reqUrl.search('.local') != -1)) {
		reqUrl = "../.."+reqUrl.substr(reqUrl.indexOf("/cgi"));
	}
    //pass a single JSON object
    $.fn.startApplication = function (params) {
        // function should define a set of default parameters then overwrite these with any user-defined values. 
        //The jQuery extend function can handle this for us:
        var defaults = {
            appname: "",
            datatype: "json"
        };

        params = $.extend(defaults, params);

        var appname = params.appname;
        var msg = "";
        msg += "<StartSDK>";
        msg += "<AppName>" + appname + "</AppName>";
        msg += "</StartSDK>";

        if (appname || appname != '') {
            //console.log("Value Passed::",appname);
            $.ajax({
                type: "POST",
                cache: false,
                url: reqUrl,
                dataType: "text",
                data: encodeURI(msg),
                success: function (response) {
                    var jsonResponse = $.xml2json(response);
                    //console.log(jsonResponse);
                    if (jsonResponse == "OK") {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.success && typeof params.success == 'function') {
                            if (params.datatype == 'json') {
                                params.success(jsonResponse);
                            } else {
                                params.success(response);
                            }
                        }
                    } else {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.error && typeof params.error == 'function') {
                            params.error(SDK_ERROR_CODES_MAP[jsonResponse]);
                        }
                    }
                }
            });
        }
        //return the jQuery object so other methods can be chained
        return this;
    };
    $.fn.stopApplication = function (params) {
        // function should define a set of default parameters then overwrite these with any user-defined values. 
        //The jQuery extend function can handle this for us:
        var defaults = {
            appname: "",
            datatype: "json"
        };

        params = $.extend(defaults, params);

        var appname = params.appname;
        var msg = "";
        msg += "<StopSDK>";
        msg += "<AppName>" + appname + "</AppName>";
        msg += "</StopSDK>";

        if (appname || appname != '') {
            //console.log("Value Passed::",appname);
            $.ajax({
                type: "POST",
                cache: false,
                url: reqUrl,
                dataType: "text",
                data: encodeURI(msg),
                success: function (response) {
                    var jsonResponse = $.xml2json(response);
                    //console.log(jsonResponse);
                    if (jsonResponse == "OK") {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.success && typeof params.success == 'function') {
                            if (params.datatype == 'json') {
                                params.success(jsonResponse);
                            } else {
                                params.success(response);
                            }
                        }
                    } else {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.error && typeof params.error == 'function') {
                            params.error(SDK_ERROR_CODES_MAP[jsonResponse]);
                        }
                    }
                }
            });
        }
        //return the jQuery object so other methods can be chained
        return this;
    };

    $.fn.getApplicationStatus = function (params) {
        // function should define a set of default parameters then overwrite these with any user-defined values. 
        //The jQuery extend function can handle this for us:
        var defaults = {
            appname: "",
            datatype: "json"
        };

        params = $.extend(defaults, params);

        var appname = params.appname;
        var msg = "";
        msg += "<GetSDK_APP_STATUS>";
        msg += "<AppName>" + appname + "</AppName>";
        msg += "</GetSDK_APP_STATUS>";

        if (appname || appname != '') {
            //console.log("Value Passed::",appname);
            $.ajax({
                type: "POST",
                cache: false,
                url: reqUrl,
                dataType: "text",
                data: encodeURI(msg),
                success: function (response) {
                    // Make Call Back Optional && Make Sure the Callback is a Function
                    if (params.success && typeof params.success == 'function') {
                        if (params.datatype == 'json') {
                            params.success($.xml2json(response));
                        } else {
                            params.success(response);
                        }
                    }
                }
            });
        }
        //return the jQuery object so other methods can be chained
        return this;
    };

    $.fn.getApplicationSettings = function (params) {
        // function should define a set of default parameters then overwrite these with any user-defined values. 
        //The jQuery extend function can handle this for us:
        var defaults = {
            appname: "",
            datatype: "json"
        };

        params = $.extend(defaults, params);

        var appname = params.appname;
        var msg = "";
        msg += "<GetSDK_APP>";
        msg += "<AppName>" + appname + "</AppName>";
        msg += "</GetSDK_APP>";

        if (appname || appname != '') {
            //console.log("Value Passed::",appname);
            $.ajax({
                type: "POST",
                cache: false,
                url: reqUrl,
                dataType: "text",
                data: encodeURI(msg),
                success: function (response) {
                    var jsonResponse = $.xml2json(response);
                    //console.log(jsonResponse);
                    if (params.success && typeof params.success == 'function') {
                        if (params.datatype == 'json') {
                            params.success(jsonResponse);
                        } else {
                            params.success(response);
                        }
                    }
                }
            });
        }
        //return the jQuery object so other methods can be chained
        return this;
    };

    $.fn.updateApplicationSettings = function (params) {
        // function should define a set of default parameters then overwrite these with any user-defined values. 
        //The jQuery extend function can handle this for us:
        var defaults = {
            appname: "",
            appconfig: null,
            datatype: "json"
        };

        params = $.extend(defaults, params);

        var appname = params.appname;
        var appconfig = params.appconfig
        var msg = "";
        msg += "<SetSDK_APP>";
        msg += "<AppName>" + appname + "</AppName>";

        if (appconfig) {
            msg += $.json2xml(appconfig);
        }
        msg += "</SetSDK_APP>";

        if (appname || appname != '') {
            //console.log("Value Passed::", msg);
            $.ajax({
                type: "POST",
                cache: false,
                url: reqUrl,
                dataType: "text",
                data: encodeURI(msg),
                success: function (response) {
                    var jsonResponse = $.xml2json(response);
                    //console.log(jsonResponse);
                    if (jsonResponse.Status == "OK") {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.success && typeof params.success == 'function') {
                            if (params.datatype == 'json') {
                                params.success(jsonResponse);
                            } else {
                                params.success(response);
                            }
                        }
                    } else {
                        // Make Call Back Optional && Make Sure the Callback is a Function
                        if (params.error && typeof params.error == 'function') {
                            params.error(SDK_ERROR_CODES_MAP[jsonResponse]);
                        }
                    }
                }
            });
        }
        //return the jQuery object so other methods can be chained
        return this;
    };
    $.fn.sendCommandToServer = function (params) {
        var defaults = {
            requestMessage: null,
            datatype: "json"
        };
        params = $.extend(defaults, params);
		var requestMessage = params.requestMessage;
		if(requestMessage){
			$.ajax({
				type: "POST",
				cache: false,
				url: reqUrl,
				dataType: "text",
				data: encodeURI(requestMessage),
				success: function (response) {
					var jsonResponse = $.xml2json(response);
					//console.log(jsonResponse);
					if (params.success && typeof params.success == 'function') {
						if(params.datatype == 'json') {
							params.success(jsonResponse);
						} else {
							params.success(response);
						}
					}
				}
			});
		}
        
    };
})(jQuery);
