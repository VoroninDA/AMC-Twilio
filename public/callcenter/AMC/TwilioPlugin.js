var myInteractionID = 0;
var myScenarioId = 0;
var dtmfAlreadyClicked = false;
var outBoundCall = false;
$(document).ready(function () {

    var phoneController = phoneControllerScope;
    var workflowController = workflowControllerScope;
    var Config = {};
    var localStorage = window.localStorage;
    var inpHost = window.location.origin;
    ContactCanvas.Channel.enableClickToDial(ContactCanvas.Commons.getSequenceID(), function () { console.log("Click to Dial Enabled"); });
    ContactCanvas.Channel.registerClickToDialEvent(ContactCanvas.Commons.getSequenceID(), clickToDialCallback);
    var iconPath = {};
    iconPath.pluginIconPath = inpHost + "/callcenter/AMC/img/twilio.png";

    ContactCanvas.Channel.registerForLoginEvents(ContactCanvas.Commons.getSequenceID(), function () {
        ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
            presence: "Ready"
        }, null);
    });
    ContactCanvas.Channel.registerForLogoutEvents(ContactCanvas.Commons.getSequenceID(), function () { workflowController.logout(); });
    ContactCanvas.Channel.registerContextualControls(ContactCanvas.Commons.getSequenceID(), function (msg) {
        debugger;
      });
    ContactCanvas.Channel.addPluginImage(ContactCanvas.Commons.getSequenceID(), iconPath, null);
    //ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 0 }, null);
    ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 420 }, null);
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

    /*window.addEventListener('phoneCall', function () {

        $('#DTMFButton').unbind("click");
        $('#HangUpButton').unbind("click");

        $('#DTMFButton').click(function () {
            if (dtmfAlreadyClicked) {
                var data = {};
                data.operationType = ContactCanvas.Commons.ContextualOperationType.Cancel;
                ContactCanvas.Channel.contextualOperation(ContactCanvas.Commons.getSequenceID(), data, function (msg) { });
                dtmfAlreadyClicked = false;
            }
            else {
                dtmfAlreadyClicked = true;
                var data = {};
                data.operationType = ContactCanvas.Commons.ContextualOperationType.DTMF;
                ContactCanvas.Channel.contextualOperation(ContactCanvas.Commons.getSequenceID(), data, function (msg) {
                    phoneController.addDigit(msg.response.data.contextualItem.channels[0].Data);
                });
            }
        });
        $('#HangUpButton').click(function () {
            phoneController.hangup();
            if (outBoundCall) {
                outBoundCall = false;
                AMCdisconnect();
            }
            $('#hangupandDTMFcontainer').hide();
        });
    });*/

    window.addEventListener('completedTask', function () {
        $('#hangupandDTMFcontainer').hide();
        AMCdisconnect();
    });

    window.addEventListener('newWorker', function (newWorker) {

        //Creater worker/agent object for event subscribtions
        var AMCWorkerJS = newWorker.detail;

        AMCWorkerJS.on('reservation.created', function (reservation) {
            
            var interactionState = ContactCanvas.Commons.interactionStates.Alerting;
            var details = new ContactCanvas.Commons.RecordItem("", "", "");
            //var interactionType = '';
            var interactionDirection = '';
            $('#mainContainer').show();
            $('#mainContainerWorkFlow').show();
            //IS THIS A PHONE RESERVATION?
            //YES, Phone
            if (reservation.task.attributes.channel == "phone") {
                var phoneNumber = reservation.task.attributes.caller;
                phoneNumber = phoneNumber.replace("+1","");
                details.setPhone("", "", phoneNumber);
                ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 425 }, null);
                //interactionType = ContactCanvasChannelAPI.ChannelTypes.Telephony;
            }
            //THIS IS CHAT
            else if (reservation.task.attributes.channel == "chat" || reservation.task.attributes.channel == "video") {
                details = new ContactCanvas.Commons.RecordItem("", "Contact", "");
                var emailAddress = reservation.task.attributes.name;
                details.setEmail("Email", "", emailAddress);
                //if(reservation.task.attributes.channel == "chat")
                    //ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 800 }, null);
                //else
                    //ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 450 }, null);
                //interactionType = ContactCanvasChannelAPI.ChannelTypes.Chat;
            }
            //Not Handled Interaction
            else {
                console.log("This type of reservation " + reservation.task.attributes.channel + " was not handled as an interaction");
                return;
            }

            myInteractionID = ContactCanvas.Commons.getSequenceID();
            myScenarioId = ContactCanvas.Commons.getSequenceID();
            interactionDirection = ContactCanvas.Commons.InteractionDirectionTypes.Inbound;

            ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(),
                {
                    //interactionType: interactionType,
                    state: interactionState,
                    details: details,
                    interactionId: myInteractionID,
                    scenarioId: myScenarioId,
                    interactionDirection: interactionDirection
                }, function (msg) {
                    ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
                        presence: "Not Ready"
                    }, null);
                });
        });

        AMCWorkerJS.on('reservation.accepted', function (reservation) {

            var interactionState = ContactCanvas.Commons.interactionStates.Connected;
            var interactionDirection = ContactCanvas.Commons.InteractionDirectionTypes.Inbound;
            ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(),
                {
                    //interactionType: interactionType,
                    state: interactionState,
                    //details: details,
                    interactionId: myInteractionID,
                    scenarioId: myScenarioId,
                    interactionDirection: interactionDirection
                }, function (msg) {
                });

        });

        AMCWorkerJS.on('reservation.timeout', function (reservation) { AMCdisconnect(); });

        AMCWorkerJS.on('reservation.rescinded', function (reservation) { AMCdisconnect(); });

        AMCWorkerJS.on('reservation.canceled', function (reservation) { AMCdisconnect(); });


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
});*/

    });
    //for interaction state changes, please see the workflow and phone controller.

    function clickToDialCallback(event) {
        outBoundCall = true;
        //ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 300 }, null);
        ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 425 }, null);
        $('#mainContainerWorkFlow').hide();
        $('#mainContainer').show();
        var interactionState = ContactCanvas.Commons.interactionStates.Alerting;
        var details = new ContactCanvas.Commons.RecordItem("", "", "");
        var interactionDirection = '';
        var phoneNumber;
        if(event.number)
            phoneNumber = event.number;
        else
            phoneNumber = event.response.data.number;
        details.setPhone("", "", phoneNumber);
        myInteractionID = ContactCanvas.Commons.getSequenceID();
        myScenarioId = ContactCanvas.Commons.getSequenceID();
        interactionDirection = ContactCanvas.Commons.InteractionDirectionTypes.Outbound;

        ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(),
            {
                //interactionType: interactionType,
                state: interactionState,
                details: details,
                interactionId: myInteractionID,
                scenarioId: myScenarioId,
                interactionDirection: interactionDirection
            }, function (msg) {
                ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
                    presence: "Not Ready"
                }, null);
            });

        phoneController.call(phoneNumber);
    }
    /*
    function setHeightOfSoftphone()
{
    var heightObj = getHeight();
    
    ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(),heightObj, null);
}*/

    /*function getHeight()
    {
        //var profile = getLocalStorageProfile();
        height = 300;
    
        /*if(profile.phoneNumber)
        {
            var phoneData = getPhoneNumberData(profile.phoneNumber);
           
            height += 130;
            height +=  getCadHeight(phoneData);
        }
        if(profile.outPhoneNumber)
        {
            height+= 130;
        }
    
        if(profile.warmTransferCallID)
        {
            height+= 130;
        }
        if(profile.conferenceCallID && !profile.conferenceCallCompleted)
        {
            height+= 130;
        }
        else if(profile.conferenceCallID && profile.conferenceCallCompleted)
        {
            height += 210;
        }
        
        currentHeight = height;
        return { height : height};
    }*/
});

function AMCdisconnect() {

    //console.log("called setDisconnectedInboundState");
    $('#mainContainer').hide();
    $('#mainContainerWorkFlow').hide();
    //ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 300 }, null);
    ContactCanvas.Channel.setSoftphoneHeight(ContactCanvas.Commons.getSequenceID(), { height: 420 }, null);
    var details = new ContactCanvas.Commons.RecordItem("", "", "");
    var direction = ContactCanvas.Commons.InteractionDirectionTypes.Inbound; //changed to inbound as Screenpop not happening for outbound.Ben to check Code.
    var state = ContactCanvas.Commons.interactionStates.Disconnected;

    ContactCanvas.Channel.setInteraction(ContactCanvas.Commons.getSequenceID(), {
        state: state,
        details: details,
        interactionId: myInteractionID,
        interactionDirection: direction,
        scenarioId: myScenarioId
    }, function (msg) {
        ContactCanvas.Channel.setPresence(ContactCanvas.Commons.getSequenceID(), {
            presence: "Ready"
        }, null);
    });
    if (dtmfAlreadyClicked) {
        var data = {};
        data.operationType = ContactCanvas.Commons.ContextualOperationType.Cancel;
        ContactCanvas.Channel.contextualOperation(ContactCanvas.Commons.getSequenceID(), data, function (msg) { });
        dtmfAlreadyClicked = false;
    }
    $('#hangupandDTMFcontainer').hide();

}