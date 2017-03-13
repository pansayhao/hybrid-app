angular.module('starter.controllers', ["ngCordova"])

//新闻界面的控制器

	.controller('DashCtrl', function($scope, $http, $state, $ionicSlideBoxDelegate) {
		$scope.fubiaotiarr = ["看点", "月数据", "消费", "家店铺", "圈内人"];
		$scope.xiabiao = 0;
		//副标题点击事件
		$scope.clickFn = function(index) {
				$scope.xiabiao = index;
				//上拉加载的时候isLoadMore就会变true.这里在切换另一个界面的时候,下面的if($scope.isLoadMore){}还会执行,就会错乱。
				$scope.isLoadMore = false;
				$scope.newsData = [];
				switch(true) {
					case index == 0:
						$scope.catid = 0;
						break;
					case index == 1:
						$scope.catid = 17;
						break;
					case index == 2:
						$scope.catid = 4;
						break;
					case index == 3:
						$scope.catid = 5;
						break;
					case index == 4:
						$scope.catid = 11;
						break;
					default:
						console.log("我是其他下标");
				}
				yemianqingqiu("list");
				yemianqingqiu("lunbo");
			}
			//数据请求
		function yemianqingqiu(type) {
			if(type == "list") {
				$scope.kandianurl = encodeURIComponent("http://api.cheaa.com/mobile/index.php?app=mobile&controller=content&action=index&catid=" + $scope.catid + "&page=" + $scope.page + "&time=&keyword=&version=6.0.0&type=mobile&phonetype=android&thumbsize=1080");
				$http({
						url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.kandianurl,
						method: "GET"
					})
					//成功的回调函数 成功的话会返回地址里的数据
					.then(function(kandianres) {
						console.log(kandianres);
						// if (!kandianres.more) {
						//
						// }
						if($scope.isLoadMore) {
							$scope.newsData = $scope.newsData.concat(kandianres.data.data);
							$scope.$broadcast('scroll.infiniteScrollComplete');
						} else {
							$scope.newsData = kandianres.data.data;
						}

					})
					.then(function(error) {
						if(error) {
							console.log(error);
						}
					});
			} else if(type == "lunbo") {
				//轮播图
				$scope.lunbotuurl = encodeURIComponent("http://api.cheaa.com/mobile/index.php?app=mobile&controller=content&action=slide&catid=" + $scope.catid + "&time=&version=6.0.0&type=mobile&phonetype=android&thumbsize=1080");
				$http({
						url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.lunbotuurl,
						method: "GET"
					})
					//成功的回调函数 成功的话会返回地址里的数据
					.then(function(lunbotures) {
						console.log(lunbotures.data.data);
						$scope.lunbotuData = lunbotures.data.data;
					})
					.then(function(error) {
						if(error) {
							console.log(error);
						}
					});
			}

		}
		yemianqingqiu("list");
		yemianqingqiu("lunbo");
		//列表跳转
		$scope.newsC = function(index) {
				//跳转到另一个界面,并且传过去一个数据
				$state.go("tab.dash-detail", {
					kandiancontentId: $scope.newsData[index].contentid
				});
			}
			//轮播图跳转
		$scope.lunbotuC = function(index) {
				//跳转到另一个界面,并且传过去一个数据
				$state.go("tab.dash-detail", {
					kandiancontentId: $scope.lunbotuData[index].contentid
				});
			}
			//轮播图事件监听
		$scope.$watch("lunbotuData", function(newValue, oldValue) {
				if(newValue && newValue.length > 1) {
					$ionicSlideBoxDelegate.update();
					$ionicSlideBoxDelegate.loop(true);
				}
			})
			//上拉加载 下拉刷新变量
		$scope.istrue = true;
		$scope.isLoadMore = false;
		$scope.page = 2;
		//下拉刷新
		$scope.doRefresh = function() {
				$scope.isLoadMore = true;
				// $scope.page =Math.floor(Math.random()*5+1);
				$scope.page = 10;
				yemianqingqiu("list");
				yemianqingqiu("lunbo");
				$scope.$broadcast('scroll.refreshComplete');
			}
			//上拉加载
		$scope.loadMore = function() {
			$scope.page++;
			$scope.isLoadMore = true;
			yemianqingqiu("list");
		}
	})

//新闻详细界面的控制器

.controller('DashdetailCtrl', function($scope, $http, $stateParams, $ionicActionSheet) {
	//看点界面
	//取到kandiancontentId
	$scope.kandiancontentId = $stateParams.kandiancontentId;
	$scope.kandiandetailHtml = "";
	//拼接地址
	$scope.kandianurl = encodeURIComponent("http://api.cheaa.com/mobile/index.php?app=mobile&controller=article&action=content&contentid=" + $scope.kandiancontentId + "&version=6.0.0&type=mobile&phonetype=android&thumbsize=1080")
	$http({
			url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.kandianurl,
			method: "GET"
		})
		.then(function(kandianres) {
			//打印看点数据
			console.log(kandianres.data.data);
			$scope.newsDetailData = kandianres.data.data;
			$scope.kandiandetailHtml = kandianres.data.data.content.replace(/none/g, "block");
		})
		.then(function(error) {
			if(error) {
				console.log(error);
			}
		});

	//返回上一级界面
	$scope.onSwipeRight = function() {
		//根据历史记录返回上一界面
		window.history.go(-1);
	}

	//分享本条新闻
	//分享本条视频
	$scope.share = function() {
		fenxiang();
	}

	function fenxiang() {
		// 点击分享按钮显示操作表
		$ionicActionSheet.show({
			buttons: [{
				text: '分享给QQ好友'
			}, {
				text: '分享到空间'
			}],
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				console.log(index);
				//分享到扣扣好友
				if(index == 0) {
					var args = {};
					args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
					args.url = $scope.newsDetailData.shareurl;
					args.title = $scope.newsDetailData.title;
					args.description = $scope.newsDetailData.description;
					args.image = $scope.newsDetailData.thumb;
					QQSDK.shareNews(function() {
						alert('分享成功');
					}, function(failReason) {
						alert(failReason);
					}, args);
				}
				//分享到扣扣空间
				if(index == 1) {
					var args = {};
					args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
					args.url = $scope.newsDetailData.shareurl;
					args.title = $scope.newsDetailData.title;
					args.description = $scope.newsDetailData.description;
					args.image = $scope.newsDetailData.thumb;
					QQSDK.shareNews(function() {
						alert('分享成功');
					}, function(failReason) {
						alert(failReason);
					}, args);
				}
				return true;
			}
		});
	}
})

//视频界面的控制器

.controller('ChatsCtrl', function($scope, $http, $state) {
	//上拉加载 下拉刷新的变量
	$scope.istrue = true;
	$scope.pageSize = 10;
	$scope.pageSize2 = 10;
	// $scope.pageSize = parseInt(Math.random()*10+6);
	// $scope.pageSize2 = parseInt(Math.random()*10+4);
	$scope.isLoadMore = false;

	function video() {
		//把地址转码,防止在地址拼接时出现错误(?的问题)
		// $scope.url = encodeURIComponent("http://vcis.ifeng.com/api/homePageList?platformType=androidPhone&channelId=20&pageSize="+$scope.pageSize+"&requireTime=&isNotModified=0&adapterNo=7.2.3&protocol=1.0.1&operation=default&userId=&deviceId=bde5ee81c11b735e396e4e3892a4aad4");
		$scope.url = encodeURIComponent("http://c.3g.163.com/nc/video/home/" + $scope.pageSize2 + "-" + $scope.pageSize + ".html");
		//console.log($scope.url);
		$http({
				url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.url,
				method: "GET"
			})
			//成功的回调函数 成功的话会返回地址里的数据
			.then(function(res) {
				// $scope.bookData = [];
				if($scope.isLoadMore) {
					$scope.bookData = $scope.bookData.concat(res.data.videoList);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.bookData = res.data.videoList;
				}
			})
	}
	video();
	//点击视频列表跳转到视频详细界面的点击事件
	$scope.bookC = function(index) {
			//跳转到另一个界面,并且传过去一个数据
			$state.go("tab.chat-detail", {
				bookDataChuan: $scope.bookData[index]
			});
		}
		//下拉刷新
	$scope.doRefresh = function() {
			$scope.isLoadMore = false;
			$scope.istrue = true;
			$scope.pageSize = parseInt(Math.random() * 10 + 7);
			$scope.pageSize2 = parseInt(Math.random() * 10 + 5);
			video();
			$scope.$broadcast('scroll.refreshComplete');
		}
		//上拉加载
	$scope.loadMore = function() {
		$scope.isLoadMore = true;
		if($scope.pageSize == 3 || $scope.pageSize2 == 3) {
			$scope.istrue = false;
		} else {
			$scope.pageSize--;
			$scope.pageSize2--;
		}
		video();
	}
})

//视频界面的详细界面的控制器

.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicActionSheet) {
	// 从路由中拿到由读书界面传进来的单条数据 展示到界面上
	$scope.bookDataDetail = $stateParams.bookDataChuan;
	//console.log($scope.bookDataDetail);
	document.getElementById("iframe").src = $scope.bookDataDetail.mp4_url;
	$scope.height = (window.innerHeight) / 3;
	console.log($scope.bookDataDetail);

	//返回上一级界面
	$scope.onSwipeRight = function() {
		// //根据历史记录返回上一界面
		window.history.go(-1);
	}

	//分享本条视频
	$scope.share = function() {
		fenxiang();
	}

	function fenxiang() {
		// 点击分享按钮显示操作表
		$ionicActionSheet.show({
			buttons: [{
				text: '分享给QQ好友'
			}, {
				text: '分享到空间'
			}],
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				console.log(index);
				//分享到扣扣好友
				if(index == 0) {
					var args = {};
					args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
					args.url = $scope.bookDataDetail.mp4_url;
					args.title = $scope.bookDataDetail.title;
					args.description = $scope.bookDataDetail.topicDesc;
					args.image = $scope.bookDataDetail.cover;
					QQSDK.shareNews(function() {
						alert('分享成功');
					}, function(failReason) {
						alert(failReason);
					}, args);
				}
				//分享到扣扣空间
				if(index == 1) {
					var args = {};
					args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
					args.url = $scope.bookDataDetail.mp4_url;
					args.title = $scope.bookDataDetail.title;
					args.description = $scope.bookDataDetail.topicDesc;
					args.image = $scope.bookDataDetail.cover;
					QQSDK.shareNews(function() {
						alert('分享成功');
					}, function(failReason) {
						alert(failReason);
					}, args);
				}
				return true;
			}
		});
	}
})

//喜欢的界面的控制器

.controller("loveCtrl", function($scope, $http, $state,mainData) {
	$scope.pagenum = 1;
	$scope.istrue = true;
	$scope.isLoadMore = false;

	function love() {
		$scope.url = encodeURIComponent("http://app.ellemen.com/?app=rss&controller=elleplus&action=elleplus_channellist&catid=53&pagenum=" + $scope.pagenum + "&num=10");
		$http({
				url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.url,
				method: "GET"
			})
			.then(function(res) {
				console.log(res.data.data);
				if($scope.isLoadMore) {
					$scope.loveData = $scope.loveData.concat(res.data.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					$scope.loveData = res.data.data;
				}
			})
	}
	love();
	//下拉刷新
	$scope.doRefresh = function() {
			$scope.isLoadMore = false;
			$scope.istrue = true;
			$scope.pagenum = parseInt(Math.random() * 10 + 7);
			love();
			$scope.$broadcast('scroll.refreshComplete');
		}
		//上拉加载
	$scope.loadMore = function() {
			$scope.isLoadMore = true;
			if($scope.pagenum == 10) {
				$scope.istrue = false;
			} else {
				$scope.pagenum++;
			}
			love();
		}
		//点击画报列表跳转到画报详细界面的点击事件
	$scope.loveClick = function(index) {
		//跳转到另一个界面,并且传过去一个数据
		$state.go("tab.love-detail");
		mainData.xihuandata = $scope.loveData[index];
	}
})

//喜欢界面的详情界面的控制器

.controller("loveDetailCtrl", function($scope, $http, $stateParams, mainData) {
	$scope.loveDetaildata = mainData.xihuandata;
	console.log($scope.loveDetaildata);
	document.getElementById("love").src = $scope.loveDetaildata.url;
	$scope.height = window.innerHeight;
	//返回上一级界面
	$scope.onSwipeRight = function() {
			// //根据历史记录返回上一界面
			window.history.go(-1);
		}
	//收藏的点击事件
	$scope.shoucang = function() {
		document.getElementById("shoucang").style.display = "none";
		document.getElementById("shoucang2").style.display = "block";
		mainData.scdata.push($scope.loveDetaildata);
		console.log(mainData.scdata);
	}
	//取消收藏的点击事件
	$scope.quxiaoshoucang = function() {
		document.getElementById("shoucang").style.display = "block";
		document.getElementById("shoucang2").style.display = "none";
		mainData.scdata.splice($scope.loveDetaildata);
		console.log(mainData.scdata);
	}
})

//我的界面的控制器

.controller('AccountCtrl', function($scope, $http, $state) {
	//默认退出登录按钮不显示
	$scope.Show = false;
	$scope.touxiang = "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3610704133,3947436040&fm=21&gp=0.jpg";
	$scope.name = "立即登录"
		//登录事件
	$scope.denglu = function() {
			QQSDK.ssoLogin(function(res) {
				// alert("token is " + res.access_token);
				// alert("userid is " +res.userid);
				// alert("expires_time is "+ new Date(parseInt(res.expires_time)) + " TimeStamp is " +res.expires_time);
				$scope.url = encodeURIComponent("https://graph.qq.com/user/get_user_info?access_token=" + res.access_token + "&oauth_consumer_key=1105995394&openid=" + res.userid)
				$http({
						url: "http://59.110.139.104:3000/wy?myUrl=" + $scope.url,
						method: "GET"
					})
					.then(function(res) {
						//退出登录按钮显示
						$scope.Show = true;
						$scope.name = res.data.nickname;
						$scope.touxiang = res.data.figureurl_qq_2;
						// alert($scope.name);
						// alert($scope.touxiang);
					})
					.then(function(error) {
						if(error) {
							alert(error);
						}
					})
			}, function(failReason) {
				// alert(failReason);
			});
		}
		//我的收藏
	$scope.shoucangC = function() {
			$state.go("tab.shoucangdetail");
		}
		//我的意见反馈
	$scope.yijianC = function() {
			$state.go("tab.yijiandetail");
		}
		//我的意见反馈
	$scope.guanyuC = function() {
			$state.go("tab.guanyudetail");
		}
		//退出登录
	$scope.tuichuC = function() {
		QQSDK.logout(function() {
			$scope.Show = false;
			$scope.touxiang = "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3610704133,3947436040&fm=21&gp=0.jpg";
			$scope.name = "立即登录"
				//    alert('logout success');
		}, function(failReason) {
			alert(failReason);
		});
	}
})

//我的收藏的详细界面的控制器

.controller("shoucangCtrl", function($scope, $http, mainData) {
	$scope.shoucangdata = mainData.scdata;
	//返回上一级界面
	$scope.onSwipeRight = function() {
		// //根据历史记录返回上一界面
		window.history.go(-1);
	}
})

//我的意见反馈的详细界面

.controller("yijiandetailCtrl", function($scope) {
	document.getElementById("aaa").style.display = "none";
	//发送
	$scope.send = function() {
			document.getElementById("aaa").style.display = "block";
			setTimeout(function() {
				document.getElementById("input").value = "";
				document.getElementById("aaa").style.display = "none";
			}, 1000)
		}
		//返回上一级界面
	$scope.onSwipeRight = function() {
		// //根据历史记录返回上一界面
		window.history.go(-1);
		document.getElementById("input").value = "";
	}
})

//关于我们的详细界面

.controller("guanyudetailCtrl", function($scope) {

	//返回上一级界面
	$scope.onSwipeRight = function() {
		// //根据历史记录返回上一界面
		window.history.go(-1);
	}
})