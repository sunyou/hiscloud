/**
 * DHCC Login Component V1.3.4
 * (c) 2014 by YuHong
 */
var Login = Login || (function (Math, undefined) {

    var L = {};
    /**
     * Authen namespace.
     */
	var Authen=L.Authen={
		getTicket:function(userName,password,loginType,userType){
			L.Authen.getTicket(userName,password,userType);
		},
		getTicket:function(userName,password,userType){
			password=CryptoJS.MD5(password).toString();
			// 1、获取身份认证信息
			$.ajax({
				type : "post",
				url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!getTicket.htm",
				async : false,
				dataType:'json',
				data :{
			        'loginDto.loginVo.userType': userType,
					'loginDto.loginVo.userName': userName
				},
				success : function(data){
					var idTicket=data.idTicket;
					var serviceTicket=data.serviceTicket;
					var authenMsg=data.authenMsg;
					var jsonStr = data.jsonStr;
					if ((idTicket!="")&&(authenMsg!="")){
						try{
							var decryptAuthenMsg=Security.enc.AES.cbcDecrypt(authenMsg,password);
							var authenJson=JSON.parse(decryptAuthenMsg);
							var sessionKey=authenJson.sessionKey;
							var timestamp=authenJson.timestamp;
		
							// 有无服务票据
							if(serviceTicket!=""){
								var cAuthenMsgEn=Security.enc.AES.cbcEncrypt(timestamp,sessionKey);
								$.ajax({
									type : "post",
									url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!authenUser.htm",
									async : false,
									dataType:'json',
									data :{
										'loginDto.loginVo.userName': userName,
										'loginDto.loginVo.authenMsg': cAuthenMsgEn,
										'loginDto.loginVo.serviceTicket': serviceTicket,
										'loginDto.loginVo.idTicket': idTicket,
										'loginDto.loginVo.jsonStr': jsonStr
									},
									success : function(result){
										var sAuthenMsgEn=result.authenMsg;
										if(sAuthenMsgEn!=""){
											var sAuthenMsg=Security.enc.AES.cbcDecrypt(sAuthenMsgEn,sessionKey);
											var sAuthenJson=JSON.parse(sAuthenMsg);
											Authen.state=sAuthenJson.state;
											if(Authen.state=="1"){
												L.Authen.setCookie("lg", "1");
												Authen.msg="验证成功";
												loginUrl=L.Authen.getCookie("dn");
												if(loginUrl!=null){
													location.assign(loginUrl+"/cookie.jsp?op=1&t="+new Date().getTime()
															+"&tgt="+encodeURIComponent(encodeURIComponent(idTicket))
															+"&un="+encodeURIComponent(encodeURIComponent(userName))
															+"&sk="+encodeURIComponent(encodeURIComponent(sessionKey)));
//													window.open(loginUrl+"/cookie.jsp?op=1"
//														+"&tgt="+encodeURIComponent(encodeURIComponent(idTicket))
//														+"&un="+encodeURIComponent(encodeURIComponent(userName))
//														+"&sk="+encodeURIComponent(encodeURIComponent(sessionKey)));
												}else{
													location.reload();
												}
											}else if(Authen.state=="2"){
												Authen.msg="票据过期";
											}else if(Authen.state=="3"){
												Authen.msg="验证失败";
											}
										}else{
											Authen.msg="认证服务器失败";
										}
									}
								});
							}else{
								Authen.msg="请从要访问的应用系统登录";
							}
						}catch (e){
							Authen.msg="账户名/密码错误";
						}
					}else{
						Authen.msg="账户不存在";
					}
				}
			});
			return L.Authen;
		},
		getServiceTicket:function(userName,sessionKey,idTicket){
			if(userName==null||sessionKey==null||idTicket==null){
				return L.Authen;
			}
			$.ajax({
				type : "post",
				url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!getServiceTicket.htm",
				async : false,
				dataType:'json',
				data :{
					'loginDto.loginVo.idTicket': idTicket
				},
				success : function(data){
					var serviceTicket=data.serviceTicket;
					var authenMsg=data.authenMsg;
					var jsonStr = data.jsonStr;
					if (authenMsg!=""){
						try{
							var decryptAuthenMsg=Security.enc.AES.cbcDecrypt(authenMsg,sessionKey);
							var authenJson=JSON.parse(decryptAuthenMsg);
							sessionKey=authenJson.sessionKey;
							var timestamp=authenJson.timestamp;
		
							// 有无服务票据
							if(serviceTicket!=""){
								var cAuthenMsgEn=Security.enc.AES.cbcEncrypt(timestamp,sessionKey);
								$.ajax({
									type : "post",
									url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!authenUser.htm",
									async : false,
									dataType:'json',
									data :{
										'loginDto.loginVo.userName': userName,
										'loginDto.loginVo.authenMsg': cAuthenMsgEn,
										'loginDto.loginVo.serviceTicket': serviceTicket,
										'loginDto.loginVo.idTicket': idTicket,
										'loginDto.loginVo.jsonStr': jsonStr
									},
									success : function(result){
										var sAuthenMsgEn=result.authenMsg;
										if(sAuthenMsgEn!=""){
											var sAuthenMsg=Security.enc.AES.cbcDecrypt(sAuthenMsgEn,sessionKey);
											var sAuthenJson=JSON.parse(sAuthenMsg);
											Authen.state=sAuthenJson.state;
											if(Authen.state=="1"){
												Authen.msg="验证成功";
											}else if(Authen.state=="2"){
												Authen.msg="票据过期";
											}else if(Authen.state=="3"){
												Authen.msg="验证失败";
											}
										}else{
											Authen.msg="认证服务器失败";
										}
									}
								});
							}else{
								Authen.msg="请从要访问的应用系统登录";
							}
						}catch (e){
							Authen.msg="身份票据认证失败，请重新登录";
						}
					}else{
						Authen.msg="账户认证失败，请重新登录";
					}
				}
			});
			return L.Authen;
		},
		// type:[   默认为1;
		//			1:重定向url指明的地址,(url为验证成功后跳转的地址，例如："index.htm");
		//			2:执行url字符串，(url为可执行的字符串，例如："window.open($WEB_ROOT_PATH+'/login/loginCtrl!login.htm','','top=0,left=0,width='+screen.availWidth+',height='+screen.availHeight+',toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=no,maximized=no');")
		//		]
		sso:function(url,type){
			login=L.Authen.getCookie("lg");
			dn=L.Authen.getCookie("dn");
			if(dn==null||dn==""){
				$.ajax({
					type : "post",
					url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!getProperty.htm",
					async : false,
					dataType:'text',
					data:{
						"proName":"conf.login.address"
					},
					success : function(strUrls){
						if(strUrls!=""){
							L.Domain.getDomain(strUrls);
						}
					}
				});
			}
			if(login==1){
				L.Authen.delCookie("lg");
				if(type=="2"){
	    			eval(url);
	    		}else{
	    			location.assign(url);
	    		}
			}else{
				userName=L.Authen.getCookie("un");
				sessionKey=L.Authen.getCookie("sk");
				idTicket=L.Authen.getCookie("tgt");
				if(userName==null||sessionKey==null||idTicket==null){
					var loginUrl=L.Authen.getCookie("dn");
					if(loginUrl!=null&&loginUrl!=""){
						$.ajax({
						    url:loginUrl+"/login/loginCtrl!getCookie.htm",
						    type : "post",
						    async:false,
						    dataType:"jsonp",
							jsonpCallback:"cookie",
						    success:function(data){
						    	if(data.tgt!=null&&data.un!=null&&data.sk!=null){
							    	authen=L.Authen.getServiceTicket(decodeURIComponent(data.un),decodeURIComponent(data.sk),decodeURIComponent(data.tgt));
							    	if (authen.state=="1"){
							    		if(type=="2"){
							    			eval(url);
							    		}else{
							    			location.assign(url);
							    		}
							    	}
						    	}
						    }
						});
					}
				}else{
					authen=L.Authen.getServiceTicket(userName,sessionKey,idTicket);
			    	if (authen.state=="1"){
			    		if(type=="2"){
			    			eval(url);
			    		}else{
			    			location.assign(url);
			    		}
			    	}
				}
			}
			return L.Authen;
		},
		logout:function(){
			L.Authen.delCookie("lg");
			$.ajax({
				type : "post",
				url : ContextPath_UseForAes+"/authenTicket/authenTicketCtrl!logout.htm",
				async : false,
				success : function(data){
					loginUrl=L.Authen.getCookie("dn");
					if(loginUrl!=null&&loginUrl!=""){
						L.Authen.delCookie("dn");
//						window.open(loginUrl+"/cookie.jsp");
						location.assign(loginUrl+"/cookie.jsp");
					}else{
						location.reload();
					}
				}
			});
		},
		// 解析cookie过期时间，返回s
		getsec:function(str){
		   var str1=str.substring(1,str.length)*1;
		   var str2=str.substring(0,1);
		   if (str2=="s"){
		        return str1*1000;
		   }else if (str2=="h"){
		       return str1*60*60*1000;
		   }else if (str2=="d"){
		       return str1*24*60*60*1000;
		   }
		},
		// 设置cookie
		setCookie:function(name,value,time){
			var cookieStr=name+"="+encodeURIComponent(encodeURIComponent(value));
			cookieStr=cookieStr+"; path=/";
			//判断是否设置过期时间
			if(time!=null){
				if(time.length>1){
					var strsec = this.getsec(time);
					var exp = new Date();
					exp.setTime(exp.getTime() + strsec*1);
					cookieStr=cookieStr+"; expires="+exp.toGMTString();
				}
			}
			document.cookie=cookieStr;
		},
		// 获取cookie
		getCookie:function(name){
		    var arr,reg=new RegExp("(^|)"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg)){
		    	return decodeURIComponent(decodeURIComponent(arr[2]));
		    }else{
		    	return null;
		    }
		},
		// 删除cookies 
		delCookie:function(name){
		    var exp = new Date();
		    exp.setTime(exp.getTime() - 1);
		    var cval=L.Authen.getCookie(name);
		    if(cval!=null)
		    	document.cookie= name + "="+cval+"; expires="+exp.toGMTString()+"; path=/";
		}
	};
	var Domain= L.Domain ||(function(Math, undefined){
		var urls= new Array();
		var bolIsTimeout=null;
		var bolIsRunning=true;
		var intSent = 0;
		var intTimeout=1000;
		var intTimerID=null;
		var objIMG = new Image();
		objIMG.onload = objIMG.onerror =function(){
			if(!bolIsRunning || bolIsTimeout)
				return;
			L.Authen.setCookie("dn", urls[intSent]);
			intSent++;
			bolIsRunning=false;
		};

		var Domain=L.Domain={
			// 获取存放cookie的域
			getDomain:function(strUrls){
				urls=strUrls.replace(/\s+/g,"").split(";");
				L.Domain.ping();
			},
			timeout:function() {
				if(!bolIsRunning)
					return;
				bolIsTimeout = true;
				objIMG.src = "";
				intSent++;
				if(intSent<urls.length){
					L.Domain.ping();
				}
			},
			ping:function() {
				// 取消超时计时 
				clearTimeout(intTimerID);
				// 发送请求
				intStartTime = +new Date();
				bolIsTimeout = false;
				objIMG.src = urls[intSent]+"/login.htm?_=" + intStartTime;
				// 超时计时
				intTimerID = setTimeout(L.Domain.timeout, intTimeout);
			}
		};
	}(Math));
	var state=Authen.state="0";
    var msg=Authen.msg="连接服务器失败";
    var version=L.Version="登录组件信息：\nDHCC Login Component [ V1.3.4 ] \n (c) 2014 by YuHong";
	return L;
}(Math));
//<<<<<<<<<<<<< add by haohh
$(function(){
	if (top != window){
		top.location.href = window.location.href;
	} 
	
	$("#focusFlag").val("0");
	$("#idNumber").focus(function(){
		$("#focusFlag").val("1");
	});
	$("#idNumber").blur(function(){
		$("#focusFlag").val("0");
	});
	$("#password").focus(function(){
		$("#focusFlag").val("1");
	});
	$("#password").blur(function(){
		$("#focusFlag").val("0");
	});
	$(document).keydown(function(event){
		if(event.keyCode==13){
			if($("#focusFlag").val() == 1){
				checkuser();
			}
		} 
	});
	$.extend({
	    setMarginT:function(){
		    var wh=$(window).height(),box=$('.dhcclog'),bh=box.height(),mt=Math.floor((wh-bh)/2);
			box.css('margin-top',mt);
		}	
	});
	$.setMarginT();
	$(window).bind('resize',$.setMarginT);
//	$('.log_user').focus(function(){
//		if($(this).val()=="用户名"){
//			 $(this).val("");	
//		}
//	});
//	$('.log_user').blur(function(){
//		if($(this).val()=="" || $(this).val()==null){
//			$(this).val("用户名");	
//		}
//	});
//	$('.log_pswd').focus(function(){
//	    $('.pswd_placeholder').css("visibility","hidden");
//	});
//	$('.log_pswd').blur(function(){
//		if($(this).val()=="" || $(this).val()==null){
//			$('.pswd_placeholder').css("visibility","visible");
//		}    
//	});
//	$('.cloud_check_ok').toggle(
//	    function(){$(this).addClass('cloud_check_ok');},
//		function(){$(this).removeClass('cloud_check_no');}
//	);
	setTimeout('$("#password").focus()',5);
	setTimeout('$("#idNumber").focus()',100);
	
	//从cookie中取值回填
	if(Login.Authen.getCookie("aihisUser") != null && Login.Authen.getCookie("aihisPassword") != null){
		$("#log_check").addClass('cloud_check_ok');
		$("#log_check").removeClass('cloud_check_no')
		$("#idNumber").val(Login.Authen.getCookie("aihisUser"));
	    $("#password").val(Login.Authen.getCookie("aihisPassword")); 
	}else{
		$("#log_check").removeClass('cloud_check_ok');
		$("#log_check").addClass('cloud_check_no')
	}	
			 
	 
	 
});
function checkuser(){
	var idCard=$("#idNumber").val();
	var password=$("#password").val();
	//验证
	if(idCard==null||""==$.trim(idCard)||"null"==$.trim(idCard)){
		$CommonUI.alert("用户名不能为空！");
		return false;
	}
	if(password==null||""==$.trim(password)||"null"==$.trim(password)){
		$CommonUI.alert("密码不能为空！");
		return false;
	}	
	//记住帐号密码
    if($("#log_check").attr("class")=='cloud_check_ok'){ 
     	//存取cookie    	
    	Login.Authen.setCookie("aihisUser",idCard,"d100");
    	Login.Authen.setCookie("aihisPassword",password,"d100");
    	 
    }else{
    	Login.Authen.setCookie("aihisUser","","d100");
    	Login.Authen.setCookie("aihisPassword","","d100");
    } 
    
	$.ajax({
		 type: "post",
	        //url: $WEB_ROOT_PATH + "/js/index/index-test.json"
			url: $WEB_ROOT_PATH+"/frame/login.ajax",
			data:{
				"loginUser":idCard,
				"loginPwd":password
				},

	        dataType: "json",
	        success: function(data){
	        	var errorCode=data.rows[0].errorCode;
	        	if (errorCode==0){
	        		location.assign($WEB_ROOT_PATH+"/frame/mainFrame.html");	        		
	        	} else {
	        		$CommonUI.alert(data.rows[0].errorMessage);
	        	} 
	        }
	});
}
	function chectPwd(){
		if($("#log_check").attr("class")=='cloud_check_ok'){
			$("#log_check").removeClass('cloud_check_ok');
			$("#log_check").addClass('cloud_check_no')
		}else{
			$("#log_check").addClass('cloud_check_ok');
			$("#log_check").removeClass('cloud_check_no')
		}	
	}

 
