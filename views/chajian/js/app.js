//牛逼的lazyload
(function (ng) {
  'use strict';
 
  var app = ng.module('ngLoadScript', []);
 
  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) 
      {
        if (attr.type==='text/javascript-lazy') 
        {
          var s = document.createElement("script");
          s.type = "text/javascript";                
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
        }
      }
    };
  });
 
}(angular));
var app = angular.module('linktalk', ['ngLoadScript']);
app.config(['$controllerProvider',
    function($controllerProvider) {
        // remember mentioned function for later use
        app.registerCtrl = $controllerProvider.register;
        //your routes
     
    }
]);
app.controller('appController', ['$scope','$http', function($scope,$http) {
	$scope.hehe = "yangyu";
	//make a  post
	$scope.makepost = function(){
		UIChangeObj.viewFull();
		$("#tieziModal").modal("show");	
			
	}
	$scope.makePost = {};
	//load a post
	$scope.loadPost = function(post){
		$scope.$broadcast("postdetailShow", post);
	}
	$scope.button2 = function(){
		console.log(UIChangeObj);
		UIChangeObj.viewGoback();
	}
	$scope.button3 = function(){
		console.log(UIChangeObj);
		UIChangeObj.iframChange(nowWidth);
	}
	$scope.posts ={};
	//modal的事件
	$scope.makeAPost = function(){
		alert($scope.makePost.title);
		$scope.makePost = {};
		$scope.template = 'html/postdetail.html';
	}
	$scope.bindModal  =function(){
		$('#tieziModal').on('hidden.bs.modal', function(e) {
			UIChangeObj.viewGoback();
			$scope.makePost = {};
		})	
	}
	$scope.refreshPosts = function(){
		httpGetter.getPost(null,function(data){
			$scope.posts = data;
		})
	}

	$scope.refreshPosts();
	$scope.template = 'html/postdetail.html';
	

}]);
// app.controller('postDetailController', ['$scope','$http', function($scope,$http) {
// 	// $scope.name = "post";
// 	$scope.age = 32;
// }]);
//UI显示器，3种变量
var UIChangeObj = {
	nowWidth:"300px",
	father:parent.window,
	$fatherbody:$(parent.document.body),
	indexChange:function(num){
		this.$fatherbody.find("#chajianiframe").css("z-index",num);
	},
	viewGoback:function(){
		this.$fatherbody.find("#chajianiframe").css("width","300px");
	},
	viewFull:function(){
		this.$fatherbody.find("#chajianiframe").css("width","100%");
	},
	iframChange:function(width){
		nowWidth= width;
		this.$fatherbody.find("#chajianiframe").css("width",width);
	},
	divChange:function(width){
		this.$fatherbody.find("#chajianDiv").css("width",width);
	},
	init:function(){
		this.index = this.$fatherbody.find("#chajianiframe").css("z-index");
		this.iframe = this.$fatherbody.find("#chajianiframe").css("width");
		this.divWidth = this.$fatherbody.find("#chajianDiv").css("width");
	}
}
UIChangeObj.init();

var httpGetter = {
	getPost:function(objIn,callBack){
		$.ajax({
		type: "get",
		url: "data/fakePosts.json",
		success: function(data) {
			callBack(data);
			

		}
		})
	}
}