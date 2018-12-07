
function isSupportedBrowser(){
	console.log("Detecting Browser Agent");
	var supportedBrowser = ["Explorer","Chrome","Opera","Safari","Firefox","default"];
	var currentBrowser = BrowserDetect.browser;
	console.log("currentBrowser: ",currentBrowser);
	var isSupported = false;
	for(var index = 0; index < supportedBrowser.length; index++){
		if(currentBrowser == supportedBrowser[index]){
			isSupported = true;
		}
	}
	if(!isSupported){
		alert("The application is not supported on "+ currentBrowser);
	}
}
