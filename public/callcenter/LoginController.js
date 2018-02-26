function LoginController ($scope, $http) {

	$scope.reset = function () {
		$scope.loginForm.$setValidity('notFound', true);
		$scope.loginForm.$setValidity('serverError', true);
	};

	$scope.login = function () {
		var endpoint = navigator.userAgent.toLowerCase() + Math.floor((Math.random() * 1000) + 1);

		$http.post('/api/agents/login', { worker: $scope.worker, endpoint: endpoint })

			.then(function onSuccess (response) {
				var docUrl = '/callcenter/workplace.html?integrationId=be60efcf-f094-2d4f-0f3e-c90a9b38708f&PluginId=be60efcf-f094-2d4f-0f3e-c90a9b38708f&hostUrl=contactcanvascloudframework.azurewebsites.net&PluginUrl=https://amc-twilio-demo.herokuapp.com/callcenter/workplace.html&PluginName=Twilio';
				debugger;
				window.location.replace(docUrl);
			}, function onError (response) {

				if (response.status === 404) {
					$scope.loginForm.$setValidity('notFound', false);
				} else {
					$scope.loginForm.$setValidity('serverError', false);
				}

			});

	};

}

angular
	.module('callcenterApplication', ['ngMessages'])
	.controller('LoginController', LoginController);