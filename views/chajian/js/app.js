//牛逼的lazyload
(function(ng) {
	'use strict';

	var app = ng.module('ngLoadScript', []);

	app.directive('script', function() {
		return {
			restrict: 'E',
			scope: false,
			link: function(scope, elem, attr) {
				if (attr.type === 'text/javascript-lazy') {
					var s = document.createElement("script");
					s.type = "text/javascript";
					var src = elem.attr('src');
					if (src !== undefined) {
						s.src = src;
					} else {
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
app.controller('appController', ['$scope', '$http', function($scope, $http) {
	//app的url管理
	$scope.pageurl = "b1p1";
	//make a  post 点击左下发帖
	$scope.makepost = function() {
		UIChangeObj.viewFull();
		$("#tieziModal").modal("show");

	}
	//app 的变量
	$scope.user = {};
	//modal 上的变量 
	$scope.makePost = {};
	$scope.makeApiece = {};

	//load a post
	$scope.loadPost = function(post) {
		$scope.$broadcast("postdetailShow", post);
		$scope.currentPost = post;
	}

	$scope.posts = {};
	//piece
	$scope.makepiece = function() {
			UIChangeObj.viewFull();
			$("#postPieceModal").modal("show");
		}
		//modal的事件  发布post
	$scope.makeAPost = function() {
		var obj = {
			url: $scope.pageurl,
			title: $scope.makePost.title,
			content: $scope.makePost.content,
			name: userController.name
		}
		httpGetter.addPost(obj, function(error) {
			if (error) {
				alert("fuck,提交失败了");
			} else {
				$scope.refreshPosts();
			}
		});
		$("#tieziModal").modal("hide");
		$scope.makePost = {};
	}
	$scope.makeAPiece = function() {
		var post = $scope.currentPost;
		var fullLink = post.Pid;
		var arr = fullLink.split("/");
		var obj = {
			pageUrl: $scope.pageurl,
			content: $scope.makeApiece.content,
			name: userController.name,
			postUrl: post.Pid
		}
		httpGetter.addPiece(obj, function(error) {
			if (error) {
				alert("fuck,提交失败了");
			} else {
				$scope.$broadcast("refreshPieces",$scope.currentPost);
			}
		});
		$("#postPieceModal").modal("hide");
		$scope.makeApiece = {};
	}
	$scope.bindModal = function() {
		$('#tieziModal').on('hidden.bs.modal', function(e) {
			UIChangeObj.viewGoback();
			$scope.makePost = {};
		})
		$('#postPieceModal').on('hidden.bs.modal', function(e) {
			UIChangeObj.viewGoback();
			$scope.makeApiece = {};
		})
	}
	$scope.refreshPosts = function() {
		httpGetter.getPost({
			url: $scope.pageurl
		}, function(data) {

			$scope.$apply(function() {
				$scope.posts = data;
			})

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
	nowWidth: "300px",
	father: parent.window,
	$fatherbody: $(parent.document.body),
	indexChange: function(num) {
		this.$fatherbody.find("#chajianiframe").css("z-index", num);
	},
	viewGoback: function() {
		this.$fatherbody.find("#chajianiframe").css("width", "300px");
	},
	viewFull: function() {
		this.$fatherbody.find("#chajianiframe").css("width", "100%");
	},
	iframChange: function(width) {
		nowWidth = width;
		this.$fatherbody.find("#chajianiframe").css("width", width);
	},
	divChange: function(width) {
		this.$fatherbody.find("#chajianDiv").css("width", width);
	},
	init: function() {
		this.index = this.$fatherbody.find("#chajianiframe").css("z-index");
		this.iframe = this.$fatherbody.find("#chajianiframe").css("width");
		this.divWidth = this.$fatherbody.find("#chajianDiv").css("width");
	}
}
UIChangeObj.init();
//处理与服务器数据交互

var httpGetter = {
	postFireBase: (function() {
		var myDataRef = new Firebase('https://yangyu-linktalk.firebaseio.com/posts');
		return myDataRef;
	})(),
	pieceFireBase: (function() {
		var myDataRef = new Firebase('https://yangyu-linktalk.firebaseio.com/postpiece');
		return myDataRef;
	})(),
	getPost: function(objIn, callBack) {
		var pageurl = objIn.url;
		var url = "https://yangyu-linktalk.firebaseio.com/posts/" + pageurl + ".json";
		$.ajax({
			type: "get",
			url: url,
			success: function(data) {
				callBack(data);
			}
		})
	},
	addPost: function(objIn, callBack) {
		var pageurl = objIn.url;
		var nowPageRef = this.postFireBase.child(pageurl);
		var name = objIn.name;
		var title = objIn.title;
		var content = objIn.content;
		var pageUrl = pageurl;

		var zanNum = 0;


		var mydate = new Date();
		var pinglunDate = mydate.toLocaleString();
		var timerInter = mydate.getTime()
		var postId = timerInter + name;

		var objupdate = {

		}
		objupdate[postId] = {
			userName: name,
			title: title,
			content: content,
			urlID: pageUrl,
			Datein: pinglunDate,
			Pid: pageUrl + "/" + postId,
			zanNum: zanNum
		}

		nowPageRef.update(objupdate, callBack);
	},
	//piece
	getPiece: function(objIn, callBack) {
		var pieceUrl = objIn.url;
		var url = "https://yangyu-linktalk.firebaseio.com/postpiece/" + pieceUrl + ".json";
		$.ajax({
			type: "get",
			url: url,
			success: function(data) {
				callBack(data);
			}
		})
	},
	addPiece: function(objIn, callBack) {
		
		var postUrl = objIn.postUrl;
		var postRef = this.pieceFireBase.child(postUrl);
		// var postRef = pageRef.child(postUrl);
		var name = objIn.name;
		var content = objIn.content;
	

		var zanNum = 0;


		var mydate = new Date();
		var pinglunDate = mydate.toLocaleString();
		var timerInter = mydate.getTime()
		var postId = timerInter + name;

		var objupdate = {

		}
		objupdate[postId] = {
			userName: name || "user",
			content: content,
			urlID: postUrl,
			Datein: pinglunDate,
			zanNum: zanNum
		}

		postRef.update(objupdate, callBack);
	},
	userFirebase:(function(){
		var myDataRef = new Firebase('https://yangyu-linktalk.firebaseio.com/myuser');
		return myDataRef;
	})(),
	signUp:function(objIn, callBack){
		var email = objIn.email;
		var name = objIn.name;
		var password = objIn.password;
		var objupdate = {
			
		}
		objupdate[name] = {
			email:email,
			name:name,
			password:password
		}
		this.userFirebase.update(objupdate, callBack);
	},
	login:function(objIn,callBack){
		var name = objIn.name;
		callBack({name:name});
	},
	getUserAction:function(objIn,callBack){
		var name = objIn.name||userController.name;
		var url = "https://yangyu-linktalk.firebaseio.com/myuser/" + name + "/actions.json";
		$.ajax({
			type: "get",
			url: url,
			success: function(data) {
				console.log(data)
				if (callBack) {
					callBack(data);
				};
				
			}
		})
	},
	_userAddPost:function(objIn){
		var userPostRef = this.userFirebase.child("yangyu/actions/posts");
		var obj = {

		};
		obj["post1"]={
			title:"你妹de",
			id:"123"
		}
		userPostRef.update(obj);
	},
	_userAddPiece:function(objIn){
		var userPieceRef = this.userFirebase.child("yangyu/actions/pieces");
		var obj = {

		};
		obj["piece1"]={
			title:"你妹depiece",
			id:"123"
		}
		userPieceRef.update(obj);
	}
}

var userController = {
	name: "yangyu"
}