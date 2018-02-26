$(document).ready(function () {
    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function(){
        document.getElementById("loginform").style.display = "block";
    });
    //ContactCanvas.Channel.registerContextualControls(ContactCanvas.Commons.getSequenceID(), null);
    //var iconPath = {};
    //iconPath.pluginIconPath = window.location.origin + "/callcenter/AMC/img/twilio.png";
    //ContactCanvas.Channel.addPluginImage(ContactCanvas.Commons.getSequenceID(), iconPath, null);
    ContactCanvas.Channel.initializationComplete(ContactCanvas.Commons.getSequenceID(), {}, function(){});
});