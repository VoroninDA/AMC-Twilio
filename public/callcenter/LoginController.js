function LoginController ($scope, $http) {

	$scope.reset = function () {
		$scope.loginForm.$setValidity('notFound', true);
		$scope.loginForm.$setValidity('serverError', true);
	};

	$scope.login = function () {
		var endpoint = navigator.userAgent.toLowerCase() + Math.floor((Math.random() * 1000) + 1);

		$http.post('/api/agents/login', { worker: $scope.worker, endpoint: endpoint })

			.then(function onSuccess (response) {
				var docUrl = '/callcenter/workplace.html?';
				docUrl = docUrl + window.location.href.split('?')[1];
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