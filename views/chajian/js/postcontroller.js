app.registerCtrl('postDetailController', ['$scope','$http','$sce', function($scope,$http,$sce) {
	// $scope.name = "post";
	$scope.age = 32;
	//从父controller 传来post的信息.
	$scope.$on("postdetailShow",
     function (event, msg) {
         $scope.post = msg;
         $scope.pieces = {};
         // $scope.post.markedContent = marked(msg.content);
         $scope.markedContent =  $sce.trustAsHtml(marked(msg.content));
         httpGetter.getPiece({url:msg.Pid},function(data){
         	$scope.$apply(function(){
         		$scope.pieces = data;
         	})
         })
     });
	$scope.$on("refreshPieces",
     function (event, msg) {
         $scope.post = msg;
         $scope.pieces = {};
         // $scope.post.markedContent = marked(msg.content);
         $scope.markedContent =  $sce.trustAsHtml(marked(msg.content));
         httpGetter.getPiece({url:msg.Pid},function(data){
         	$scope.$apply(function(){
         		$scope.pieces = data;
         	})
         })
     });

}]);
