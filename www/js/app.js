angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider , $ionicConfigProvider) {

  //配置安卓状态栏 把他调到下面
  $ionicConfigProvider.platform.ios.tabs.style('standard');   $ionicConfigProvider.platform.ios.tabs.position('bottom');        $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');
  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');


  $stateProvider

  // setup an abstract state for the tabs directive

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    //新闻看点界面的路由

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })


    //新闻详细界面的路由

    .state('tab.dash-detail', {
      url: '/dash-detail',
      views: {
        'tab-dash': {
          templateUrl: 'templates/dash-detail.html',
          controller: 'DashdetailCtrl'
        }
      },
      params:{
        kandiancontentId:""
      }
    })

    //视频界面的路由

    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

    //视频界面的详细界面路由

    .state('tab.chat-detail', {
      url: '/chats-detail',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      },
      params:{
        bookDataChuan:""
      }
    })

    //喜欢界面的路由

    .state('tab.love', {
      url: '/love',
      views: {
        'tab-love': {
          templateUrl: 'templates/tab-love.html',
          controller: 'loveCtrl'
        }
      }
    })

    //喜欢界面的详细界面路由

    .state('tab.love-detail', {
      url: '/love-detail',
      views: {
        'tab-love': {
          templateUrl: 'templates/love-detail.html',
          controller: 'loveDetailCtrl'
        }
      },
      params:{
        loveDataChuan:""
      }
    })

    //我的界面的路由

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  //我的收藏界面的路由

  .state('tab.shoucangdetail', {
    url: '/shoucangdetail',
    views: {
      'tab-account': {
        templateUrl: 'templates/shoucang-detail.html',
        controller: 'shoucangCtrl'
      }
    }
  })

  //我的意见反馈界面的路由

  .state('tab.yijiandetail', {
    url: '/yijiandetail',
    views: {
      'tab-account': {
        templateUrl: 'templates/yijian-detail.html',
        controller: 'yijiandetailCtrl'
      }
    }
  })

  //关于我们界面的路由

    .state('tab.guanyudetail', {
      url: '/guanyudetail',
      views: {
        'tab-account': {
          templateUrl: 'templates/guanyu-detail.html',
          controller: 'guanyudetailCtrl'
        }
      }
    })
  
  //其他情况下的路由配置

  $urlRouterProvider.otherwise('/tab/dash');

})
  
  
.value("mainData",{
    scdata:[],
    xihuandata:[]
  });
