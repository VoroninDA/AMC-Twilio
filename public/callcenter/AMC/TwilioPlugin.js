import { disconnect } from "cluster";

$(document).ready(function () {

    var Config = {};
    var localStorage = window.localStorage;
    var inpHost = window.location.origin;
    var myIntercationID = 0;
    var myInteractionID = 0;
    var scenarioId = 0;

    ContactCanvas.Channel.enableClickToDial(ContactCanvas.Commons.getSequenceID(), function () { console.log("Click to Dial Enabled"); });
    //ContactCanvas.Channel.registerClickToDialEvent(ContactCanvas.Commons.getSequenceID(), clickToDialCallback);


    var iconPath = {};
    iconPath.pluginIconPath = inpHost + "/callcenter/AMC/img/twilio.png";
    ContactCanvas.Channel.addPluginImage(ContactCanvas.Commons.getSequenceID(), iconPath, null);

    //ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function);
    //ContactCanvas.Channel.registerForLogoutEvents(ContactCanvas.Commons.getSequenceID(), function);
    ContactCanvas.Channel.registerContextualControls(ContactCanvas.Commons.getSequenceID(), null);

    ContactCanvas.Channel.initializationComplete(ContactCanvas.Commons.getSequenceID(), {}, function (data) {
        Config = data.response.data.config;
        ContactCanvas.Channel.addContextualAccessList(ContactCanvas.Commons.getSequenceID(), { contactsList: [] });
    });

    /*if (AMCworkerJS != undefined && AMCworkerJS != null){
    AMCworkerJS.on('reservation.created',
                 function(res){
                        console.log('AMC LOG');
                        console.log(res);
                        console.log('AMC LOG');
                    }, false);
                }
*/
    window.addEventListener('newWorker', function (newWorker) {

        var AMCWorkerJS = newWorker.detail;

        AMCWorkerJS.on('reservation.created', function (reservation) {
            myInteractionID = ContactCanvas.Commons.getSequenceID();
            scenarioId = ContactCanvas.Commons.getSequenceID();
            var interactionState = ContactCanvas.Commons.interactionStates.Alerting;
            var details = new ContactCanvasChannelAPI.RecordItem("", "", "");
            var interactionType = '';
            var interactionDirection = '';
            if (reservation.task.attributes.channel == "phone") {
                var phonenumber = reservation.task.attributes.caller;
                details.setPhone("ANI", "", phoneNumber);
                interactionType = ContactCanvasChannelAPI.ChannelTypes.Telephony;
            }
            else if (reservation.task.attributes.channel == "chat" || reservation.task.attributes.channel == "video") {
                details = new ContactCanvasChannelAPI.RecordItem("", "Contact", "");
                var emailAddress = reservation.task.attributes.name;
                details.setEmail("Email", "", emailAddress);
                interactionType = ContactCanvasChannelAPI.ChannelTypes.Chat;
            }

            interactionDirection = ContactCanvasChannelAPI.InteractionDirectionTypes.Outbound;

            ContactCanvasChannelAPI.setInteraction({
                interactionType: interactionType,
                state: interactionState,
                details: details,
                interactionId: myInteractionID,
                scenarioId: myInteractionID,
                interactionDirection: interactionDirection
            });
            myInteractionID++;
/*
           
        $scope.workerJS.on('reservation.accepted', function (reservation) {
    
            $log.log('TaskRouter Worker: reservation.accepted');
            $log.log(reservation);
    
            $scope.task = reservation.task;
    
            /* check if the customer name is a phone number *//*
        var pattern = /(.*)(\+[0-9]{8,20})(.*)$/;

        if (pattern.test($scope.task.attributes.name) === true) {
            $scope.task.attributes.nameIsPhoneNumber = true;
        }

        $scope.task.completed = false;
        $scope.reservation = null;
        $scope.stopReservationCounter();

        $scope.$apply();

    });
*/
    $scope.workerJS.on('reservation.timeout', function (reservation) {

        $log.log('TaskRouter Worker: reservation.timeout');
        $log.log(reservation);

        /* reset all data */
        $scope.reservation = null;
        $scope.task = null;
        $scope.$apply();

    });

    $scope.workerJS.on('reservation.rescinded', function (reservation) {

        $log.log('TaskRouter Worker: reservation.rescinded');
        $log.log(reservation);

        /* reset all data */
        $scope.reservation = null;
        $scope.task = null;
        $scope.$apply();

    });

    $scope.workerJS.on('reservation.canceled', function (reservation) {

        $log.log('TaskRouter Worker: reservation.cancelled');
        $log.log(reservation);

        $scope.reservation = null;
        $scope.task = null;
        $scope.$apply();

    });
/*
    $scope.workerJS.on('activity.update', function (worker) {

        $log.log('TaskRouter Worker: activity.update');
        $log.log(worker);

        $scope.worker = worker;
        $scope.$apply();

    });

    $scope.workerJS.on('token.expired', function () {

        $log.log('TaskRouter Worker: token.expired');

        $scope.reservation = null;
        $scope.task = null;
        $scope.$apply();

        /* the worker token expired, the agent shoud log in again, token is generated upon log in *//*
        window.location.replace('/callcenter/');

    });

    /* the agent's browser lost the connection to Twilio *//*
        $scope.workerJS.on('connected', function () {
            $log.log('TaskRouter Worker: WebSocket has connected');
            $scope.UI.warning.worker = null;
            $scope.$apply();
        });
    
        $scope.workerJS.on('disconnected', function () {
            $log.error('TaskRouter Worker: WebSocket has disconnected');
            $scope.UI.warning.worker = 'TaskRouter Worker: WebSocket has disconnected';
            $scope.$apply();
        });
    
        $scope.workerJS.on('error', function (error) {
            $log.error('TaskRouter Worker: an error occurred: ' + error.response + ' with message: ' + error.message);
            $scope.UI.warning.worker = 'TaskRouter Worker: an error occured: ' + error.response + ' with message: ' + error.message;
            $scope.$apply();
        });
    
    };*/

    });
    //for interaction state changes, please see the workflow and phone controller.

    setHeightOfSoftphone();

});
function AMCdisconnect(){

    //var details = new ContactCanvas.Commons.RecordItem("", "", "");
    //details.setPhone("", "", 6464023580);
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Outbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;
    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: null,
        interactionId: "3",
        interactionDirection: direction,
        scenarioId: "3"
    }, function (msg) {
    });

}