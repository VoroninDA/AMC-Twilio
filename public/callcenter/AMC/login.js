$(document).ready(function () {
debugger;
    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function(){
        $("#loginform").show();
    });
    ContactCanvas.Channel.initializationComplete(ContactCanvas.Commons.getSequenceID(), {}, function (data) {
        debugger;
        //Config = data.response.data.config;

    });
});