angular.module('pavelkang.wx-share', [])
	.directive('wxShareMoments', function(){
		var link = function(scope, element, attrs) {
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
				WeixinJSBridge.on('menu:share:timeline', function(argv){
					WeixinJSBridge.invoke('shareTimeline', {
						"img_url" :  scope.img ? scope.img : 'http://t12.baidu.com/it/u=2348010170,4054977331&fm=58',
						"img_width" : "120",
						"img_height" : "120",
						"link" : scope.link ? scope.link : 'http://weixin.qq.com',
						"desc" : scope.desc ? scope.desc : "No description",
						"title" : scope.title ? scope.title : "Title"
					}, function(res) {
						_report('timeline', res.err_msg);
					});
				});
			}, false);
		};
		return {
			restrict : "AE",
			link : link,
			scope : {
				img : "=",
				link : "=",
				desc : "=",
				title : "="
			}
		}
	})
	.directive('wxShareFriends', function(){
		var link = function(scope, element, attrs) {
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
				WeixinJSBridge.on('menu:share:appmessage', function(argv){
					WeixinJSBridge.invoke('sendAppMessage', {
						"appid" : scope.appid ? scope.appid : "",
						"img_url" :  scope.img ? scope.img : 'http://t12.baidu.com/it/u=2348010170,4054977331&fm=58',
						"img_width" : "120",
						"img_height" : "120",
						"link" : scope.link ? scope.link : 'http://weixin.qq.com',
						"desc" : scope.desc ? scope.desc : "No description",
						"title" : scope.title ? scope.title : "Title"
					}, function(res) {
						_report('send_msg', res.err_msg);
					});
				});
			}, false);
		};
		return {
			restrict : "AE",
			link : link,
			scope : {
				appid : "=",
				img : "=",
				link : "=",
				desc : "=",
				title : "="
			}
		}
	});	