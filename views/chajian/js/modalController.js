app.registerCtrl('modalController', ['$scope','$http','$sce', function($scope,$http,$sce) {
	// $scope.name = "post";
	$scope.showMarked = true;
	$scope.changeHtmlMarked = function(){
		$scope.showMarked = !$scope.showMarked;
		if(!$scope.showMarked){
			var content = $scope.makePost.content;
			$("#tieziHtmlAreaID").html(marked(content))
		}

	}
	$scope.ispieceMarked = true;
	$scope.pieceMarkedHtml = function(){
		$scope.ispieceMarked = !$scope.ispieceMarked;
		if(!$scope.ispieceMarked){
			var content = $scope.makepiece.content;
			$("#postPieceHtmlAreaID").html(marked(content))
		}
	}

}]);
