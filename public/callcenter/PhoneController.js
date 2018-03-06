var phoneControllerScope;
app.controller('PhoneController', function ($scope, $rootScope, $http, $timeout, $log) {
	$scope.status = null;
	$scope.isActive = false;
	$scope.phoneNumber = '';

	$scope.connection;

	//AMC CODE
	phoneControllerScope = $scope;
	//END AMC CODE

	$scope.$on('InitializePhone', function (event, data) {
		$log.log('InitializePhone event received');

		Twilio.Device.setup(data.token, { debug: true });

		Twilio.Device.ready(function (device) {
			$scope.status = 'Ready';
		});

		Twilio.Device.error(function (error) {
			$scope.status = 'error: ' + error.code + ' - ' + error.message;
			$scope.isActive = false;

			$timeout(function () {
				$scope.$apply();
			});

		});

		Twilio.Device.connect(function (conn) {
			//debugger;
			$scope.connection = conn;
			$scope.status = 'successfully established call';
			$scope.isActive = true;

			$timeout(function () {
				$scope.$apply();
				$('#PhoneNumber').html(conn.message.phone);
				$('#hangupandDTMFcontainer').show();
				//debugger;
				//var phoneCall = new CustomEvent('phoneCall');
				//window.dispatchEvent(phoneCall);
			});

		});

		Twilio.Device.disconnect(function (conn) {
			$scope.status = 'call disconnected';
			$scope.isActive = false;
			$scope.connection = null;

			$timeout(function () {
				$scope.$apply();
			});

		});

		Twilio.Device.offline(function (device) {
			$scope.status = 'offline';
			$scope.isActive = false;

			$timeout(function () {
				$scope.$apply();
			});

		});

		Twilio.Device.incoming(function (conn) {
			$scope.status = 'incoming connection from ' + conn.parameters.From;
			$scope.isActive = true;
			//debugger;
			/*AMC CODE HERE*/
			//$scope.$apply();
			//var phoneCall = new CustomEvent('phoneCall');
			//window.dispatchEvent(phoneCall);
			//END AMC CODE
			conn.accept();
			conn.disconnect(function (conn) {
				$scope.status = 'call has ended';
				$scope.isActive = false;
				$scope.$apply();
			});

			$scope.connection = conn;
			$scope.phoneNumber = conn.parameters.From;
		});

	});

	$scope.hangup = function (reservation) {
		if (outBoundCall) {
			outBoundCall = false;
			AMCdisconnect();
		}
		$('#hangupandDTMFcontainer').hide();
		$timeout(function () {
			Twilio.Device.disconnectAll();
		});

	};
	$scope.dtmf = function () {
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
				$scope.addDigit(msg.response.data.contextualItem.channels[0].Data);
			});
		}};

	$scope.call = function (phoneNumber) {
		$scope.$broadcast('CallPhoneNumber', { phoneNumber: phoneNumber });
	};

	$scope.addDigit = function (digit) {
		$log.log('send digit: ' + digit);
		$scope.phoneNumber = $scope.phoneNumber + digit;

		if ($scope.connection) {
			$scope.connection.sendDigits(digit);
		}

	};

	$scope.$on('CallPhoneNumber', function (event, data) {
		$log.log('call: ' + data.phoneNumber);
		$scope.phoneNumber = data.phoneNumber;

		Twilio.Device.connect({ 'phone': data.phoneNumber });

		$scope.state = 'isActive';
	});

});