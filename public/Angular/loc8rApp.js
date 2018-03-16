angular.module('loc8rApp', []);

var locationListCtrl = function($scope, loc8rData) {
	loc8rData
		.then(function (response) {
			$scope.data = {
				locations: response.data
			};
		}, function errorCallback(response) {
	       console.log(response);
		});	
};

var ratingStars = function() {
	return {
		scope: {
			thisRating: '=rating'
		},
		//template: "{{ thisRating }}"
		templateUrl: './angular/rating-stars.html'
	};
};

var loc8rData = function($http) {
	return $http.get('/api/locations?lng=-0.7992599&lat=51.378091');
};

angular.module('loc8rApp')
	.controller('locationListCtrl', locationListCtrl)
	.directive('ratingStars', ratingStars)
	.service('loc8rData', loc8rData);