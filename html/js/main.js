$(document).ready(function() {
  $('body').addClass('unselectable').attr('unselectable', 'on').attr('draggable', 'false').on('dragstart', function() {
    return false;
  });

  var appName = 'ServerPushMJPEG';
  var appStatus = 0;
  var appSettings;
  var portNo;
  var liveStreamURI;

  var stepNo = 0;
  // debug message
  function dMsg(mText) {
    stepNo++;
    console.log('Step ' + stepNo + ': ', mText);
  }

  getApplicationSettings();
  setInterval(function() {
    getApplicationStatus();
  }, 1000);

  function getApplicationSettings() {
    $(document).getApplicationSettings({
      appname : appName,
      success : function(response) {
        dMsg('Inside getApplicationSettings')
        if (!response['ErrorString']) {
          appSettings = JSON.parse(JSON.stringify(response)); // :)
          console.log(appSettings);
          portNo = appSettings.appConfigData.portNo;
          liveStreamURI = 'http://' + window.location.hostname + ':' + portNo + '/livemjpeg';
          $('#lbl_model').text(appSettings.appConfigData.model);
        } else {
          alert('Unable to Fetch Settings from Server');
        }
      }
    });
  };

  function getApplicationStatus() {
    $(document).getApplicationStatus({
    appname : appName,
    success : function(param) {
      dMsg('Inside getApplicationStatus')
      appStatus = param.AppStatus;
      console.log('App status:', appStatus);
      if (appStatus == 0 || appStatus == -1) {
        // $('#appButton').attr('disabled', 'true');
        // $('#updateButton').attr('disabled', 'true');
      } else if (appStatus == 2 || appStatus == 6) {
        $('#div_streaming_uri').css('visibility', 'hidden');
      } else if (appStatus == 4 || appStatus == 5) {
        if (!!portNo) {
          var uri = liveStreamURI + '?d=' + Date.now();
          $('#streaming_uri').attr('src', uri);
          $('#div_streaming_uri').css('visibility', 'visible');
        }
      }
    },
    error : function(errorMsg) {
      console.log('Can\'t get application status');
    }
    });
  };
  
  // end of main
});