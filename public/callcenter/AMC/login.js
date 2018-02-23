$(document).ready(function () {
    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function(){
        document.getElementById("loginform").style.display = "block";
    });
    ContactCanvas.Channel.initializationComplete(ContactCanvas.Commons.getSequenceID(), {}, function(){});
});