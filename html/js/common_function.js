var NOT_REFRESH = 0;
var REFPRESH = 1;
var PAGE_CLOSE = 2;
var REFPRESH_TIMEOUT = 3;

var gAlertMsg = "";
var gPageState = REFPRESH;
//Bring back the browser object 

jQuery.browser={};(function(){jQuery.browser.msie=false;
jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();

//jQuery.browser = {}; 
//Rest all is self explanatory. 
jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase())&& !/webkit/.test(navigator.userAgent.toLowerCase()); 
jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase()); 
jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase()); 
//jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase()); 
//jQuery.browser.version = /version/.test(navigator.userAgent.toLowerCase()); 


function ChangeApplyState(command)
{
	switch(command)
	{
		case 'Reset':	case 'Reboot':	case 'Restore': case 'Port':
			gPageState = PAGE_CLOSE;
			break;
		case 'FTP':	case 'SMTP': case 'HTTPSMode': case 'RelayOutput': case 'OSD': case 'PTZLimit': case 'Event':
		case 'StartPreset':	case 'PresetSetup': case 'ZoomSetup': case 'DayNightSetup': case 'VideoOutput': case 'DirectOSD':
		case 'AutoFocus': case 'AUX': case 'videoSource': case 'VideoSource': case 'HomePosition': case 'NASTest': case 'ContinuousRecord': case 'NAS':
			gPageState = NOT_REFRESH;
			break;
		case 'Storage':
			gPageState = REFPRESH_TIMEOUT;
			break;
		default:
			gPageState= REFPRESH;
			break;
	}
}

function RequestAjaxMsg(msg, alertMsg, reqUrl, command, asyncVal)
{
	if (typeof command == "undefined")	command = "";
	if (typeof asyncVal == "undefined")	asyncVal = false;
	gAlertMsg = alertMsg;
	ChangeApplyState(command);
	if (BrowserDetect.browser == 'Explorer') {// || BrowserDetect.browser == 'Firefox' || (BrowserDetect.browser == 'Safari' && reqUrl.search('.local') != -1)) {
		reqUrl = "../.."+reqUrl.substr(reqUrl.indexOf("/cgi"));
	}

	$.ajax({
		type: "POST",
		async: asyncVal,
		cache: false,
		url: reqUrl,
		dataType: "text",
		data: encodeURI(msg),
		success: OnSuccessApply
	});
}

function OnSuccessApply(req)
{
	if (gAlertMsg != "")
	{
		alert(gAlertMsg);
	}

	switch(gPageState)
	{
		case NOT_REFRESH:	break;
		case REFPRESH:		window.location.reload(true);	break;
		case PAGE_CLOSE:	window.open('about:blank', '_self').close();	break;
		case REFPRESH_TIMEOUT: window.setTimeout('window.location.reload(true)', 3000);	break;
	}
}

function PrintObjectTag(objName, onloadName, width, height, sourceName, bgType, lanStr, snapUUID, jpegUUID, model, userLevel, userCtrl)
{
	if 		(typeof snapUUID 	== "undefined")	snapUUID = "";
	else if	(typeof jpegUUID 	== "undefined")	jpegUUID = "";
	else if	(typeof model 		== "undefined")	model = "";
	else if	(typeof userLevel 	== "undefined")	userLevel = "";
	else if	(typeof userCtrl 	== "undefined")	userCtrl = "";

	var str = '';
	str += '<object id='+objName+' data="data:application/x-silverlight-2," type="application/x-silverlight-2" width='+width+' height='+height+'>';
	if (onloadName != '')
	{
		str += '<param name="onload" value='+onloadName+' />';
	}
	str += '<param name="source" value='+sourceName+' />';
	str += '<param name="onError" value="onSilverlightError" />';
	str += '<param name="background" value='+bgType+' />';
	str += '<param name="minRuntimeVersion" value="4.0.50917.0" />';
	str += '<param name="initParams" value="culture='+lanStr+', snapUUID='+snapUUID+', jpegUUID='+jpegUUID+', model='+model+', currentUserLevel='+userLevel+', userRightCtrl='+userCtrl+'" />';
	str += '<param name="autoUpgrade" value="false" />'
	str += '<a href="./SilverlightInstall.cgi " style="text-decoration:none">Get Microsoft Silverlight</a>';
	str += '</object>';
 	str += '<iframe id="_sl_historyFrame" style="visibility:hidden;height:0px;width:0px;border:0px"></iframe>';
	document.write(str);
}

function onSilverlightError(sender, args)
{
   var appSource = "";
   if (sender != null && sender != 0) {
       appSource = sender.getHost().Source;
   }

   var errorType = args.ErrorType;
   var iErrorCode = args.ErrorCode;

   if (errorType == "ImageError" || errorType == "MediaError") {
       return;
   }

   var errMsg = "Unhandled Error in Silverlight Application " + appSource + "\n";

   errMsg += "Code: " + iErrorCode + "    \n";
   errMsg += "Category: " + errorType + "       \n";
   errMsg += "Message: " + args.ErrorMessage + "     \n";

   if (errorType == "ParserError") {
       errMsg += "File: " + args.xamlFile + "     \n";
       errMsg += "Line: " + args.lineNumber + "     \n";
       errMsg += "Position: " + args.charPosition + "     \n";
   } else if (errorType == "RuntimeError") {
   	if (args.lineNumber != 0) {
      	     errMsg += "Line: " + args.lineNumber + "     \n";
      	     errMsg += "Position: " + args.charPosition + "     \n";
      	 }
      	 errMsg += "MethodName: " + args.methodName + "     \n";
   }
   throw new Error(errMsg);
}

function ChangeImage(id,imgpath) {
	document.getElementById(id).src = imgpath;
}
function DoDZOn() {
	var control = mid_menu.document.getElementById("viewer");
    control.content.ViewerControl.SetMouseControlMode("DigiZoom"); //1: On , 2: Off
}

function DoDZOff() {
    var control = mid_menu.document.getElementById("viewer");
    control.content.ViewerControl.SetMouseControlMode("Overlay");
}

function DoStratch() {
    var control = mid_menu.document.getElementById("viewer");
    control.content.ViewerControl.ChangeToStretchImage();
}

function DoOriginal() {
    var control = mid_menu.document.getElementById("viewer");
    control.content.ViewerControl.ChangeToOriginalImage();
}

function RequestCGI(request) {
	var req = new XMLHttpRequest();
	req.open('POST', request, false );
	req.send(null);
	if ( req.readyState == 4 ) {
		if ( req.status == 200 ) {
			return req.responseText;
		}
	}
	return '';
}

function GetProfileMonitoring() {
	var temp = "Profile_temp";
	left_menu.document.getElementById("MoProfile").innerHTML = '<select id="profile.moni.display"><option>'+temp+'</option></select>';
}

function OnLoadMonitoring() {
	GetProfileMonitoring();
	left_menu.document.getElementById("Moni_Profile").value = "Profile_TTTTEST";
}


var intTab = 0;
var intJump = 0;

function IsTab(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}

	if (keyCode == 9) {
		intTab = 1;
	}
}
function IsNum(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ((keyCode > 47 && keyCode < 58) || keyCode == 8 ) {
		//0,1,2,3,4,5,6,7,8,9
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

	if (keyCode == 46) {
		intJump = 1;
	}
	intTab = 0;//tab key cannot generate onkeypress event

	/*
	if (event.keyCode < 48 || event.keyCode > 57)
		event.returnValue = false;
	if (event.keyCode == 46) {
		intJump = 1;
	}
	intTab = 0;//tab key cannot generate onkeypress event
	*/
}

function OnlyNUm(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;

	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	//delete 46
	if ((keyCode > 47 && keyCode < 58) || keyCode == 8 || keyCode == 9 || keyCode == 37 || keyCode == 39 || keyCode == 46 ||(keyCode > 95 && keyCode < 106)) {
		//0,1,2,3,4,5,6,7,8,9
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

	if (keyCode == 46) {
		intJump = 1;
	}
	intTab = 0;//tab key cannot generate onkeypress event

	/*
	if (event.keyCode < 48 || event.keyCode > 57)
		event.returnValue = false;
	if (event.keyCode == 46) {
		intJump = 1;
	}
	intTab = 0;//tab key cannot generate onkeypress event
	*/
}
function CheckKorean(event)
{
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;

	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	var check =  /^[a-zA-Z0-9]+$/;

	keychar = String.fromCharCode(keyCode);

	if(event.shiftKey && keyCode == 37)
	{
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

	if(check.test(keychar) || keyCode == 8 || keyCode == 9 || keyCode == 37 || keyCode == 39 || keyCode == 46 || keyCode ==96) {}
	else {

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

}

function NoKorean(event)
{
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;

	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	if(BrowserDetect.browser=='Firefox' && keyCode == 9) {
		event.preventDefault();
	}
	if (keyCode == 229){

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}
function CheckIPv4(event)
{	var keyCode;

	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;

	}

	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	var check =  /^[0-9]+$/;

	keychar = String.fromCharCode(keyCode);

	if(event.shiftKey && keyCode == 37){

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
	if(check.test(keychar) || keyCode == 8 || keyCode == 9|| keyCode == 46 || keyCode == 37 || keyCode == 39 ||(keyCode > 95 && keyCode < 106) || keyCode == 110 ||  keyCode == 190 ) {}
	//backspace, tab, delete, <-, ->, keypadNumber, . , keypad.
	else {

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

}
function CheckIPv6(event, type)
{	var keyCode;

	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;

	}

	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	var check =  /^[a-fA-F0-9]+$/;
	keychar = String.fromCharCode(keyCode);
	if((event.shiftKey && keyCode == 37) || (type== 'down' && keyCode == 110) || (type== 'press' && keyCode == 59)){

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
	if(check.test(keychar) || keyCode == 8|| keyCode == 9 || keyCode == 46 || keyCode == 37 || keyCode == 39 ||(keyCode > 95 && keyCode < 106) || keyCode == 186 ||  keyCode == 58 ||  keyCode == 59) {}
	//backspace, delete, <-, ->, keypadNumber, :
	else {

		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}

}
function IsIPv6Char(event) {
	//0~9, : ,a~f, A~F
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if (   (keyCode >= 48 && keyCode <= 57)
	  ||  (keyCode == 58)
	  ||  (keyCode >= 65 && keyCode <= 70)
	  ||  (keyCode >= 97 && keyCode <= 102)
	  ||keyCode == 8
	  || keyCode == 190) {
		//0~9, : ,a~f, A~F
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}
function IsIPv4Char(event) {
	//0~9, .
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if (  (keyCode > 47 && keyCode < 58)
	||keyCode ==46
       ||keyCode == 8
	   || keyCode == 190) {
		//0~9, .
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsIdChar(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 126 ||keyCode == 96 || keyCode == 33 ||keyCode == 64|| keyCode == 36 ||keyCode==94
		|| keyCode == 40 || keyCode == 41 || keyCode == 95 ||keyCode == 45 || keyCode == 124 || keyCode ==123
		|| keyCode == 125 || keyCode == 91 ||keyCode == 93 || keyCode == 59 || keyCode == 46 ||keyCode ==63
		|| keyCode == 47 ||keyCode == 8) {
		// a~z, A~Z, 0~9, ~,`,!,@,$,^,(),_,-,|,{,},[,],;,.,?,/
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsPathname(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 58)
		|| keyCode == 45 || keyCode == 46 || keyCode == 47 || keyCode == 95 ||keyCode == 8
		|| keyCode == 126 || keyCode==96 || keyCode == 33 || keyCode == 64 ||keyCode == 36
		|| keyCode == 94 || keyCode == 40 || keyCode == 41 || keyCode == 123 ||keyCode == 125
		|| keyCode == 91 || keyCode ==93 || keyCode == 59 || keyCode == 44 || keyCode ==92
		|| keyCode ==32){
		// a~z, A~Z, 0~9, -, ., /, _,:,~,`,!,@,$,^,(),{,},[,],;,,\

	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsMailChar(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 45 || keyCode == 46 || keyCode == 47 || keyCode == 95 || keyCode == 64 ||keyCode == 8) {
		// a~z, A~Z, 0~9, -, ., /, _, @
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsUrlChar(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 45 || keyCode == 46 || keyCode == 47||keyCode == 8 ||keyCode == 95) {
		// a~z, A~Z, 0~9, -, ., /, _

	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsBackSlash(event)
{ // cannot input '\'
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	}else	{  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	if(keyCode == 92){
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsSpecialChar(event) { // & + \  " <>
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 126 ||keyCode == 96  || keyCode == 33 || keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 39
		|| keyCode == 40  || keyCode == 41 || keyCode == 42 || keyCode == 44 || keyCode == 45 || keyCode == 46 || keyCode == 47
		|| keyCode == 58  || keyCode == 59  || keyCode ==61  || keyCode ==63  ||keyCode == 64  || keyCode == 91 ||keyCode == 93  ||keyCode==94
		|| keyCode == 95  || keyCode ==123 || keyCode == 124 || keyCode == 125
	    ||keyCode == 8) {
		// a~z, A~Z, 0~9, ~,`,!,@,$,^,(),_,-,|,{,},[,],;,.,?,/
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsSIM(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;
	}

	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 126 || keyCode == 96  || keyCode == 32 || keyCode == 33 || keyCode == 36
		|| keyCode == 40  || keyCode == 41 || keyCode == 44 || keyCode == 45 || keyCode == 46 || keyCode == 47
		|| keyCode == 59  || keyCode ==63  ||keyCode == 64  || keyCode == 91 ||keyCode == 93  ||keyCode==94
		|| keyCode == 95  || keyCode ==123 || keyCode == 124 || keyCode == 125
	    ||keyCode == 8) {
		// ~`!@$^()_-|{}[];,./?
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsFriendlyName(event) {
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;

	} else {  //firefox
		keyCode = event.which;
	}

	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 97 && keyCode <= 122)
		|| (keyCode >= 65 && keyCode <= 90)
		|| (keyCode >= 48 && keyCode <= 57)
		|| keyCode == 32 || keyCode == 126 	|| keyCode == 33 || keyCode == 64 || keyCode == 36 || keyCode == 95 || keyCode == 45 || keyCode == 124
		|| keyCode == 123|| keyCode == 125	|| keyCode == 91 || keyCode == 93 || keyCode == 44 || keyCode == 46 || keyCode == 47 || keyCode == 63   
	    || keyCode == 8) {
		// SPACE~!@$_-|{}[],./?
	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function MoveToNext(now_text, next_text)
{
	if ((now_text.value.length == 3 || intJump == "1") && intTab == 0)
	{
		intJump = 0;
		next_text.blur()
		next_text.focus()
		next_text.select()
	}
}

function IsChar(event){
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}

	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ( (keyCode >= 32 && keyCode <= 126) ||keyCode == 8 ) {

	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}

function IsSMTPChar(event){
	//0~9 a~z A~Z
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if ((keyCode >= 32 && keyCode <= 33)
	 ||(keyCode >= 35 && keyCode <= 38)
	 ||(keyCode >= 40 && keyCode <= 91)
	 ||(keyCode >= 93 && keyCode <= 126)
	 ||keyCode == 8 ||keyCode == 13){

	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}
function IsNumChar(event) {
	//0~9 a~z A~Z
	var keyCode;
	if(window.event){  //ie,crome, safari
		keyCode = event.keyCode;
	} else {  //firefox
		keyCode = event.which;
	}
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}

	if (( keyCode >= 48 && keyCode <= 57 )
	  ||(keyCode >= 65 && keyCode <= 90 )
	  ||( keyCode >= 97 && keyCode <= 122)
	  ||(keyCode == 8)){

	} else {
		if(window.event){ //ie
			if(rv < 9)
				event.returnValue = false;
			else
				event.preventDefault();
		} else { //firefox
			event.preventDefault();
		}
	}
}


function OnRelay() {

}
function goSetupPage(url)
{
	var msg = "./"+url+".cgi";
	document.location = msg;
}

function SetCookie(name, value) {
	DeleteCookie(name);
	document.cookie = name + '=' + escape( value ) + '; path=/; ';
}

function EraseCookies() {
	var i;
	var cookieName;
	var alResult = new Array();
	var alCookie = document.cookie.split(";") ;

	for (i=0; i < alCookie.length; i++) {
		if (null == alCookie[i] || "" == alCookie[i]) {
			continue;
		}
		cookieName = alCookie[i].split("=")[0];
		DeleteCookie(cookieName);
	}

	return "";
}
function GetCookie(name) {
	var endOfCookie;
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length ) {
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 ) {
				endOfCookie = document.cookie.length;
			}
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

function DeleteCookie(name) {
	var temp;
	temp = GetCookie(name);
	document.cookie = name+ '=' + ';path=/'+';expires=Thu, 01-Jan-1970	00:00:01 GMT';
}

function CalAudioCodecType(AudioCodecType) {
	// 0: G711_ALAW  1: G711_MLAW	2: AAC
	/*
	if (AudioCodecType == 0)
		return 0x10;
	else if (AudioCodecType == 1)
		return 0x11;
	else
	*/
		return 0x11;
}
var H264 = 2;
var MPEG4 = 1;
var MJPEG = 0;

function CalVideoCodecType(CodecType) {
	// 2: H.264   1: MPEG-4   0: MJPEG
	if (CodecType == H264)
		return 7;
	else if (CodecType == MPEG4)
		return 3;
	else if (CodecType == MJPEG)
		return 2;
	else
		return 2;

}

function isBrowserSupportPlugin() {
	var supported = null;
   	var errorName = null;
   	
	try {
		new ActiveXObject("");
	}
	catch (e) {
		// FF has ReferenceError here
		errorName = e.name; 
	}     
	try {
		supported = !!new ActiveXObject("htmlfile");
	} catch (e) {
		supported = false;
	}
	if(errorName != 'ReferenceError' && supported==false){
		supported = false;
	}else{
		supported =true;
	}
	return supported;
}

function ChkSilverInstalled() {
	if(Silverlight.isInstalled("4.0") == false || Silverlight.isInstalled("4.0.50917.0") == false)
		document.location = "./SilverlightInstall.cgi ";
}

var FRIENDLY_NAME = '~!@$_-|{}[],./?';
var SIM = '~`!@$^*()_-|{}[];,./?';
var NUM = '0123456789';
var ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var PATH_SIM = '~`!@$^()_-{}[];,./\\';
var FILE_SIM = '~`!@$^()_-{}[];,.';
var SPACE = ' ';
//var TAB = '\t';
var CR = '\r';
var LF = '\n';
var IPv6 = '0123456789abcdefABCDEF:';
var SIM2 = '#"%&';
var QUOTATION = "'";
var Directory ="`~!@#$%^&()-_=+[]{};',./";
var Folder = "'-!#$%&(),;@[]^_`{}~+=";
function CheckSpace(str)
{
	if(str.search(/\s/) != -1) {
		return true;
	}
	else {
		return false;
	}
}


function TypeCheck(s, spc)
{
	var i;
	var check = 0;
	var ls = 0;

	for(i=0; i<s.length; i++) {
		if (ls = spc.indexOf(s.substring(i, i+1)) >= 0){

			check = 1;
		}
		else {
			check = 0;
			break;
		}
	}

	if(check == 1) return true;
	else return false;
}

function TypeCheckEx(s, spc)
{
	var i;
	var ch;

	for(i=0; i< s.length; i++) {
		if (spc.indexOf(s.substring(i, i+1)) < 0){
			ch = s.charAt(i);
			if(escape(ch).length <= 4)
				return false;
		}
	}

	return true;
}

function pausemillis(millis)
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); }
while(curDate-date < millis);
}


var BrowserDetect = {
	initialize: function () {
		this.OS = this.StringSearch(this.OSInfo) || "unknownOS";
		this.browser = this.StringSearch(this.BrowserInfo) || "unknownbrowser";
		this.version = this.VersionSearch(navigator.appVersion) || this.VersionSearch(navigator.userAgent) || "unknownversion";
	},
	VersionSearch: function (datastr) {
		var index = datastr.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(datastr.substring(index+this.versionSearchString.length+1));
	},
	StringSearch: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataprop = data[i].prop;
			var datastr = data[i].string;
			this.versionSearchString = data[i].identity || data[i].versionSearch;
			if (datastr) {
				if (datastr.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataprop)
				return data[i].identity;
		}
	},
	OSInfo : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		}
	],
	BrowserInfo: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{
			prop: window.opera,
			identity: "Opera"
		}
	]

};
BrowserDetect.initialize();

String.prototype.replaceAll = function( searchStr, replaceStr )
{
	var temp = this;
	while( temp.indexOf( searchStr ) != -1 )
	{
	temp = temp.replace( searchStr, replaceStr );
	}
	return temp;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////
/////////// 	NETWORK			////////////////
////////////////////////////////////////////////
function CalSubnetMask(prefix)
{
	var dataVal = new Array("255", "254", "252", "248", "240", "224", "192", "128", "0");
	var prefixVal = "";

	if (prefix >= 24) {
		prefixVal = "255.255.255.";
		prefixVal += dataVal[32-prefix];
	}
	else if (prefix >= 16) {
		prefixVal = "255.255.";
		prefixVal += dataVal[24-prefix]+".0";
	}
	else if (prefix >= 8) {
		prefixVal = "255.";
		prefixVal += dataVal[16-prefix]+".0.0";
	}
	else {
		prefixVal += dataVal[8-prefix]+".0.0.0";
	}

	return prefixVal;
}

function CheckValidIPv6Address(ip)
{
	var digits = "0123456789abcdef";
	var check_digit = false;
	var val = 0;
	var colonp = -1;
	var i = 0;
	var j = 0;
	var len;
	var letter1;
	var curtok;
	var ch;
	var V6_INADDRSZ = 16;

	if ((letter1 = ip.charAt(i)) == ':') {
		if ((letter1 = ip.charAt(i++)) != ':')	return false;
	}

	curtok = i;

	while (i < ip.length) {
		ch = ip.charAt(i).toLowerCase();
		i++;
		if ((len = digits.indexOf(ch)) != -1) {
			val <<= 4;
			val |= len;
			if (val > 0xffff)	return false;
			check_digit = true;
			continue;
	 	}

		if (ch == '%') break;

		if (ch == ':') {
			curtok = i;
			if (!check_digit) {
				if (colonp != -1) return false;
				colonp = j;
				continue;
			}
			else if (i == ip.length)	return false;

			if ((j + 2) > V6_INADDRSZ)	return false;
			j += 2;
			val = 0;
			check_digit = false;
			continue;
		}

		if (ch == '.'  && ((j + 4) <= V6_INADDRSZ)) {
			// TODO: IPv4 mapped IPv6 address is not supported
			if (!CheckValidIPv4Address(ip.substring(curtok)))	return false;
			j += 4;
			check_digit = false;
			break;
		}
		return false;
	}

	if (check_digit) {
		if ((j + 2) > V6_INADDRSZ)	return false;
		j += 2;
	}

	if (colonp != -1) {
		if (j == V6_INADDRSZ)	return false;
		j = V6_INADDRSZ;
	}

	if (j != V6_INADDRSZ) return false;

	return true;
}


function CheckValidIPv4Address(addr)
{
	if(addr == '') return false;

	var ipPattern 	= /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	var ipArray 	= addr.match(ipPattern);

	if(ipArray == null) return false;

	var ip_num 	= ((ipArray[1]&0xFF)<<24) + ((ipArray[2]&0xFF)<<16) + ((ipArray[3]&0xFF)<<8) + ((ipArray[4]&0xFF)<<0);
	thisSegment 	= ipArray[1];

	if(thisSegment < 1 || thisSegment > 223) return false;
	for(var i=2; i<5; i++) {
		thisSegment = ipArray[i];
		if(thisSegment>255) return false;
	}

	for (var i=1; i<5; i++){
		 if (ipArray[i].length > 1) {
			if (ipArray[i].charAt(0)  == '0')
				return false;
		}
	}
	return true;
}

function CheckIPv6Address(addr)
{
	if(addr == '')		return false;
	if(CheckValidIPv6Address(addr) == false)		return false;

	var ipv6Addr = addr.split(":");
	if (ipv6Addr.length < 3) return false;

	var spaceCnt = 0;
	for (var ix=0; ix<ipv6Addr.length; ++ix) {
		if (ipv6Addr[ix].length < 0 || ipv6Addr[ix].length > 4) return false;
		if (ipv6Addr[ix].length == 0) 	spaceCnt++;
	}

	if ((spaceCnt > 1 && ipv6Addr[0].length != 0 && ipv6Addr[ipv6Addr.length - 1].length != 0) || (spaceCnt == 0 && ipv6Addr.length != 8)) return false;
	return true;
}

function CheckIPv4Prefix(prefix)
{
	prefix = parseInt(prefix);
	if((prefix < 1) || (prefix > 32)) return false;
	return true;
}

function CheckIPv6Prefix(prefix)
{
	prefix = parseInt(prefix);
	if (prefix < 1 || prefix > 128) return false;
	return true;
}

function CheckPrefix(prefix, protocol)
{
	prefix = parseInt(prefix);
	if (protocol == 'IPv4' && (prefix < 1 || prefix > 32)) return false;
	if (protocol == 'IPv6' && (prefix < 1 || prefix > 128)) return false;
	return true;
}

function CheckDuplicatedAddress(obj, cnt)
{
	for (var index=0; index<(cnt-1); ++index) {
		for (var index2=(index+1); index2<cnt; ++index2) {
			if($('tr').hasClass(obj+'_list_'+index) && $('tr').hasClass(obj+'_list_'+index2)) {
				if ($('#'+obj+'_addr_'+index).val().toLowerCase() == $('#'+obj+'_addr_'+index2).val().toLowerCase()) {
					return false;
				}
			}
		}
	}
	return true;
}

function CheckDeletedTarget(obj)
{
	var selNo = $("input[name='"+obj+"_select']:checked").val();
	if (typeof selNo == "undefined") return false;
	$('tr').detach('.'+obj+'_list_'+selNo);

	for(var index=selNo; index<10; ++index) {
		if($('tr').hasClass(obj+'_list_'+index)) {
			selNo = index;
			break;
		}
	}
	if ($('tr').hasClass(obj+'_list_'+selNo) == false) {
		for(var index=selNo; index>=0; --index) {
			if($('tr').hasClass(obj+'_list_'+index)) {
				selNo = index;
				break;
			}
		}
	}
	if ($('tr').hasClass(obj+'_list_'+selNo))	$('#'+obj+'_select_'+selNo).attr('checked', 'checked');
	eval(obj+"_cnt--;");
	return true;
}

jQuery.fn.styledSelect = function(options) {
	var prefs = {
		coverClass : 'select-replace-cover',
		innerClass : 'select-replace',
		adjustPosition : { top:0, left:0 },
		selectOpacity : 0
		}
	if (options) jQuery.extend(prefs,options);
	return this.each( function() {
		var selElm = jQuery(this);
		selElm.wrap('<span><'+'/span>');
		selElm.after('<span><'+'/span>');
		var selReplace = selElm.next();
		var selCover = selElm.parent();
		selElm.css({
			'opacity':prefs.selectOpacity,
			'visibility':'visible',
			'position':'absolute',
			'top':0,
			'left':0,
			'display':'inline',
			'z-index':1
			});
		selCover.addClass(prefs.coverClass).css({
			'display':'inline-block',
			'position':'relative',
			'top':prefs.adjustPosition.top,
			'left':prefs.adjustPosition.left,
			'z-index':0,
			'vertical-align':'middle',
			'text-align':'left'
			});
		selReplace.addClass(prefs.innerClass).css({
			'display':'block',
			'white-space':'nowrap'
			});

		selElm.bind('change',function() {
			jQuery(this).next().text(this.options[this.selectedIndex].text);
			}).bind('resize',function() {
			jQuery(this).parent().width( jQuery(this).width()+'px' );
			});
		selElm.trigger('change').trigger('resize');
		});
	}

function Time_t(year, month, day, hour, minute, second, isdst, wday, mday, yday)
{ // move to common_function.js!
    this.tm_year = year;
    this.tm_month = month;
    this.tm_day = day;
    this.tm_hour = hour;
    this.tm_min = minute;
    this.tm_sec = second;
    this.tm_isdst = isdst;
    this.tm_wday = wday;
    this.tm_mday = mday;
    this.tm_yday = yday;
}

function stm_to_timet( stm )
{
	var tDay = 0;
	tDay += (stm.tm_year-70)*365;
	tDay += (stm.tm_year+1899)/4 - (stm.tm_year+1899)/100 + (stm.tm_year+1899)/400;
	tDay -= 477/* (1969/4) - (1969/100) + (1969/400) */;
	if( ( stm.tm_year%4 == 0 && stm.tm_year%100 != 0 ) || stm.tm_year%400 == 0 )
	{
		switch( stm.tm_mon )
		{
		case 1: tDay += 31; break;
		case 2: tDay += 60; break;
		case 3: tDay += 91; break;
		case 4: tDay += 121; break;
		case 5: tDay += 152; break;
		case 6: tDay += 182; break;
		case 7: tDay += 213; break;
		case 8: tDay += 244; break;
		case 9: tDay += 274; break;
		case 10: tDay += 305; break;
		case 11: tDay += 335; break;
		}
	}
	else
	{
		switch( stm.tm_mon )
		{
		case 1: tDay += 31; break;
		case 2: tDay += 59; break;
		case 3: tDay += 90; break;
		case 4: tDay += 120; break;
		case 5: tDay += 151; break;
		case 6: tDay += 181; break;
		case 7: tDay += 212; break;
		case 8: tDay += 243; break;
		case 9: tDay += 273; break;
		case 10: tDay += 304; break;
		case 11: tDay += 334; break;
		}
	}
	tDay += stm.tm_mday-1;
	return tDay*86400/* 24*60*60 */ + stm.tm_hour*3600/* 60*60 */ + stm.tm_min*60 + stm.tm_sec;
}

function timet_to_stm( timet )// move to common_function.js!
{
  	var tmptm = new Time_t(0,0,0,0,0,0,0,0,0,0);
  	tmptm.tm_sec = timet%60;
  	tmptm.tm_min = timet/60%60;
  	tmptm.tm_hour = timet/60/60%24;
  	var tDay = timet/60/60/24 + 719162/* 1969*365 + (1969/4) - (1969/100) + (1969/400) */;
  	var year400 = tDay/146097/* (400*365+100-4+1) */;
  	var day_year400r = tDay%(146097/* (400*365+100-4+1) */);
  	var year100 = day_year400r/(36524/* 100*365+25-1 */);
  	var day_year100r = day_year400r%(36524/* 100*365+25-1 */);
  	var year4 = day_year100r/(1461/* 4*365+1 */);
  	var day_year4r = day_year100r%(1461/* 4*365+1 */);
  	var year1 = day_year4r/365;
  	var day_year1r = day_year4r % 365;
  	tmptm.tm_isdst = 0;
  	tmptm.tm_wday = (tDay + 1) % 7;
  	if( year1 == 4 )
  	{
  		tmptm.tm_year = year400 * 400 + year100 * 100 + year4 * 4 + year1 - 1900;
  		tmptm.tm_yday = 365;
  		tmptm.tm_mon = 11;
  		tmptm.tm_mday = 31;
  	}
  	else
  	{
  		tmptm.tm_year = year400 * 400 + year100 * 100 + year4 * 4 + year1 - 1899;
  		tmptm.tm_yday = day_year1r;
  		if( year1 == 3 )
  		{
  			if (tmptm.tm_yday < 31) { tmptm.tm_mon = 0; tmptm.tm_mday = tmptm.tm_yday + 1; }
  			else if (tmptm.tm_yday < 60) { tmptm.tm_mon = 1; tmptm.tm_mday = tmptm.tm_yday - 30; }
  			else if (tmptm.tm_yday < 91) { tmptm.tm_mon = 2; tmptm.tm_mday = tmptm.tm_yday - 59; }
  			else if (tmptm.tm_yday < 121) { tmptm.tm_mon = 3; tmptm.tm_mday = tmptm.tm_yday - 90; }
  			else if (tmptm.tm_yday < 152) { tmptm.tm_mon = 4; tmptm.tm_mday = tmptm.tm_yday - 120; }
  			else if (tmptm.tm_yday < 182) { tmptm.tm_mon = 5; tmptm.tm_mday = tmptm.tm_yday - 151; }
  			else if (tmptm.tm_yday < 213) { tmptm.tm_mon = 6; tmptm.tm_mday = tmptm.tm_yday - 181; }
  			else if (tmptm.tm_yday < 244) { tmptm.tm_mon = 7; tmptm.tm_mday = tmptm.tm_yday - 212; }
  			else if (tmptm.tm_yday < 274) { tmptm.tm_mon = 8; tmptm.tm_mday = tmptm.tm_yday - 243; }
  			else if (tmptm.tm_yday < 305) { tmptm.tm_mon = 9; tmptm.tm_mday = tmptm.tm_yday - 273; }
  			else if (tmptm.tm_yday < 335) { tmptm.tm_mon = 10; tmptm.tm_mday = tmptm.tm_yday - 304; }
  			else { tmptm.tm_mon = 11; tmptm.tm_mday = tmptm.tm_yday - 334; }
  		}
  		else
  		{
  			if (tmptm.tm_yday < 31) { tmptm.tm_mon = 0; tmptm.tm_mday = tmptm.tm_yday + 1; }
  			else if (tmptm.tm_yday < 59) { tmptm.tm_mon = 1; tmptm.tm_mday = tmptm.tm_yday - 30; }
  			else if (tmptm.tm_yday < 90) { tmptm.tm_mon = 2; tmptm.tm_mday = tmptm.tm_yday - 58; }
  			else if (tmptm.tm_yday < 120) { tmptm.tm_mon = 3; tmptm.tm_mday = tmptm.tm_yday - 89; }
  			else if (tmptm.tm_yday < 151) { tmptm.tm_mon = 4; tmptm.tm_mday = tmptm.tm_yday - 119; }
  			else if (tmptm.tm_yday < 181) { tmptm.tm_mon = 5; tmptm.tm_mday = tmptm.tm_yday - 150; }
  			else if (tmptm.tm_yday < 212) { tmptm.tm_mon = 6; tmptm.tm_mday = tmptm.tm_yday - 180; }
  			else if (tmptm.tm_yday < 243) { tmptm.tm_mon = 7; tmptm.tm_mday = tmptm.tm_yday - 211; }
  			else if (tmptm.tm_yday < 273) { tmptm.tm_mon = 8; tmptm.tm_mday = tmptm.tm_yday - 242; }
  			else if (tmptm.tm_yday < 304) { tmptm.tm_mon = 9; tmptm.tm_mday = tmptm.tm_yday - 272; }
  			else if (tmptm.tm_yday < 334) { tmptm.tm_mon = 10; tmptm.tm_mday = tmptm.tm_yday - 303; }
  			else { tmptm.tm_mon = 11; tmptm.tm_mday = tmptm.tm_yday - 333; }
  		}
  	}
  	//alert(parseInt(tmptm.tm_hour));
  	//alert(parseInt(tmptm.tm_min));
  	//alert(parseInt(tmptm.tm_sec));
  	return tmptm;
}

function isLeapYear(year)
{
	if(year%4==0 && ( year%100!=0 || year%400==0))
		return 1;
	else
		return 0;
}
