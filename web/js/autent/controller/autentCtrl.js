Onveraplustard.controller('autentCtrl', ['$scope','autent', function($scope, autent){
	$scope.userInformation = autent.info;

	$scope.autentification = function(user, mdp) {
		autent.autentification(user, mdp);
	}
}]);