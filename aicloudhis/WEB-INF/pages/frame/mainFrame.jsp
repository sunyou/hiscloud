<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

 <html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head> 
<title>云诊所系统</title> 
<meta content="initial-scale=1.0, width=device-width" name="viewport" /> 
<link href="${ctx}/css/index/main.css" rel="stylesheet" type="text/css" /> 
<script type="text/javascript" src="${ctx}/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/bootstrap.min.css" />

<%@ include file="/common/meta.jsp" %>
<link href="${ctx}/css/index.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/moment.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/jquery-ui.custom.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lang-all.js"></script>
<script type="text/javascript" src="${ctx}/js/index/ckeditor/ckeditor.js"></script>

<script type="text/javascript" src="${ctx}/js/index/dateUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/index/jquery.calandar.js"></script>


<link rel="stylesheet" href="${ctx}/css/chart/css/style.css" type="text/css" media="all" />
<script src="${ctx}/js/security/aes.js"></script>
<script src="${ctx}/js/security/login.js"></script>

<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/passwordmanagement/password.js"></script>
<script type="text/javascript">
var patientId;
var patientFlag;
var treatmentURL;
var firstURL;
var firstTitle;
var pages;
$(function(){
	$("#pageFrame").on("load",function(){
		var src = document.getElementById("pageFrame").contentWindow.location.href.split("#")[0];
		var guide1="<ul class='breadcrumb'><li class='active only'>";
		var guide2="<span class='divider'>/</span></li> </ul> ";
		var div_space="<div style='height:10px'></div>";
		var title = pages[src] == undefined || pages[src] == null ? "" : pages[src];
		if(pages[src]=="首页"){
			$("#guide").html(guide1+title+guide2);
		}else{
			$("#guide").html(guide1+title+guide2+div_space);
		}
		
	});
});
function changeUrl(url,title){
	if(url == ""){
		return;
	}
	
	//var guide1="<ul class='breadcrumb'><li class='active only'>";
	//var guide2="<span class='divider'>/</span></li> </ul> ";
	//var div_space="<div style='height:10px'></div>";
	if (title=="首页"){
		$("#pageFrame").css("height",800);
	}else{
		$("#pageFrame").css("height",getIframeHeight());
	}
	document.getElementById("pageFrame").src=url;
	
}
//菜单初始化
function Getmenuinfo(id){
	var url = $WEB_ROOT_PATH+"/frame/getUserMenuInfo.ajax";
	$.ajax( {
			type : "POST",
			url : url,		 
			success:function(data){
				var mainul=$("#main-menu");
				pages =  new Array();
				var children=data.children.sort((function(a,b){return a.seq-b.seq;}));
			 	firstURL = children[0].securityUrl;
			 	firstTitle = children[0].funcName;
				changeUrl(firstURL,firstTitle);
				$.each(children, function(i, childrenBean) { 
					var src=childrenBean.securityUrl;
					src= src == null || src == "" ? "" : $WEB_ROOT_PATH+"/"+src;
					var name=childrenBean.funcName;
				 	if(firstURL == null || firstURL == ""){
				 		firstURL = childrenBean.securityUrl;
				 	    firstTitle = name;
				 	}
					var li = '<li id="menu-item-8" class="slef" style="margin:0;margin-top:5px;">';
					var a ;
					if(name=="诊疗管理"){
						treatmentURL = src;
					}
					if(childrenBean.children.length !== 0){
						pages[src]=name;
						a ='<a onclick=changeUrl("'+src+'","'+name+'") class="f001 has-submenu" href="javascript:void(0)"><span class="sub-arrow">+</span><span class="f1"></span><div style="font-family: \'微软雅黑\'; font-size: 15px;">'+ name +'</div></a>';
					}else{
						pages[src]=name;
						a ='<a href="javascript:void(0)" onclick=changeUrl("'+src+'","'+name+'") class="f001"><span class="f1"></span><div style="font-family: \'微软雅黑\'; font-size: 15px;">'+ name +'</div></a>';
					} 
					var firstmenu = $(li).append(a);
					$(mainul).append(firstmenu);
					if(childrenBean.children.length !== 0){
						var ulsub = '<ul class="sub-menu sm-nowrap" style="display: none; width: auto; top: auto; left: 0px; margin-left: 0px; margin-top: 0px; min-width: 10em; max-width: 20em;">';
						var secondul='';
						var tmp;
						$.each(childrenBean.children.sort((function(a,b){return a.seq-b.seq;})), function(i, funcChildrenBean) { 
							var secondsrc=funcChildrenBean.securityUrl;					
							secondsrc= secondsrc == null || secondsrc == "" ? "" : $WEB_ROOT_PATH+"/"+secondsrc;
							var secondname=funcChildrenBean.funcName;
						 	if(firstURL == null || firstURL == ""){
					 			firstURL = funcChildrenBean.securityUrl;
						 		firstTitle = secondname;
						 	}
							var lisub = '<li id="menu-item-113">';
							var asub ;
							
							if(funcChildrenBean.children.length !== 0){
								pages[secondsrc]=secondname;
								asub ='<a href="javascript:void(0)" onclick=changeUrl("'+secondsrc+'","'+secondname+'") class="cs-navi-tab" style="font-family: \'微软雅黑\'; font-size: 15px;"><span class="sub-arrow">+</span>'+ secondname +'</a>';
							}else{
								pages[secondsrc]=secondname;
								asub ='<a href="javascript:void(0)" onclick=changeUrl("'+secondsrc+'","'+secondname+'") class="cs-navi-tab" style="font-family: \'微软雅黑\'; font-size: 15px;">'+ secondname +'</a>';
							}
							if(funcChildrenBean.children.length !== 0){
								var thirdulsub = '<ul class="sub-menu sm-nowrap" style="display: none; width: auto; top: auto; left: 0px; margin-left: 129px; margin-top: -43px; min-width: 10em; max-width: 20em;">';
								var thirdul='';
								$.each(funcChildrenBean.children.sort((function(a,b){return a.seq-b.seq;})), function(i, lastChildrenBean) {
								
									var thirdsrc=lastChildrenBean.securityUrl;					
									thirdsrc= thirdsrc == null || thirdsrc == "" ? "" : $WEB_ROOT_PATH+"/"+thirdsrc;
									var thirdname=lastChildrenBean.funcName;
									var thirdli = '<li id="menu-item-113">';
									pages[thirdsrc]=thirdname;
									var thirda= '<a href="javascript:void(0)" onclick=changeUrl("'+thirdsrc+'","'+thirdname+'") class="cs-navi-tab" style="font-family: \'微软雅黑\'; font-size: 15px;"  href="#">'+ thirdname +'</a>';
									var thirdstr = thirdli + thirda + '</li>';
									thirdul +=thirdstr;
								});
								thirdul = thirdulsub + thirdul + '</ul>';
								tmp=thirdul;
							}
							var liend = '</li>';
							var str ;
							if(funcChildrenBean.children.length !== 0){
								str = lisub + asub +tmp+ liend;
							}else{
								str = lisub + asub + liend;
							}
							secondul += str;
						});
						secondul = ulsub + secondul + '</ul>';
						$(firstmenu).append(secondul);
					}
					var liend = '</li>';
					$(liend).appendTo(mainul);
				});
				changeUrl($WEB_ROOT_PATH+"/"+firstURL,firstTitle);
				
		$("#menu-item-8:has(ul)").live('mouseover mouseout', function(event) {
			  if (event.type == 'mouseover') {
				    $($(this).children("ul")).css('display','block');
				  } else {
					$($(this).children("ul")).css('display','none');
				  }
		});
		$("#menu-item-113:has(ul)").live('mouseover mouseout', function(event) {
			  if (event.type == 'mouseover') {
				    $($(this).children("ul")).css('display','block');
				  } else {
					$($(this).children("ul")).css('display','none');
				  }
		});
		}
	});	
	
};
//退出操作
function logout(){
	$CommonUI.confirm('是否确定退出登录','','',function(r){  
	    if(!r){
	    	window.location=$WEB_ROOT_PATH+"/frame/logout.html"
<%--	    	$.ajax({--%>
<%--	   		 type: "get",--%>
<%--	   			url: $WEB_ROOT_PATH+"/frame/logout.ajax",--%>
<%--	   	        dataType: "json",--%>
<%--	   	        success: function(data){--%>
<%--	   	        	location.assign("../");--%>
<%--	   	        }--%>
<%--	   		});--%>
	    }
	}); 
};
function passacouuid(){
	var id="";
	return id;
}
function getName(){
	var name="";
	return name;
}
//页面高度自适应
$(function(){
	var id=passacouuid();
	Getmenuinfo(id);
	function bodybg(){
	    var h = $(window).height();
	    $('.bb').css('height',h);
	}
	bodybg();
	$(window).bind('resize',bodybg);
	
	//首页布局
	if (screen.width == 1280){
		$('#content').css('margin-left','-35');
		$('#wrapper').css('width','1263');
	}else if(screen.width > 1330){
		var width = screen.width-17;
		$('#content').css('margin-left',(width-1330)/2);
		$('#wrapper').css('width',width);
	}else{
		$('#wrapper').css('width',1330);
	}
});
</script>


<style type="text/css">
menu_name{
font-family: '微软雅黑'; 
font-size: 15px;
}
.sub-menu a:Hover{ background:#07965e;}

</style>
</head>
<body class="bb"> 
     <div class="container-fluid" id="wrapper" >
      <header id="banner" role="banner"> 
     <div id="heading"> 
   <!--   <h1 class="site-title">  -->
   <h1>
     <a class="logo custom-logo" href="#" title="Go to 云诊所系统" style="margin-top:3px"> <img alt="云诊所系统" height="35" src="${ctx}/images/mainImages/index_logo.png" /> </a>
     <div id="myState" style="float:right;padding-right:50px;margin-top:0px;font-size:12px">
	      <div id="myState" style="float:right;padding-right:50px;margin-top:0px;font-size:12px"> 
	                   欢迎您！<font color="#f60">${userHolder.user.orgnameHosp}</font>&nbsp;&nbsp;
	      <font color="#028a5f">${userHolder.user.orgname}</font>&nbsp;&nbsp;
	      <font color="#028a5f">${userHolder.user.empName}</font>&nbsp;&nbsp;
	      <button class="btn btn-success btn-sm" type="button" onclick="showPasswordPop()">修改密码</button>&nbsp;&nbsp;
	      <button type="button" class="btn btn-danger btn-sm" onclick="logout()">退出</button>
	      </div>
      </div>   
    <!--  <div class="retrieve" style="float:right;padding-right:300px;margin-top:25px">&nbsp; </div>  -->
     </h1>
  <!--    </h1> -->
      <nav class="sort-pages modify-pages navbar site-navigation" id="navigation" role="navigation"> 
    <!-- <div class="navbar-inner"> 
      <div class="collapse nav-collapse">  -->             
      <div id="menu" class="sort-pages modify-pages navbar site-navigation" style="float:left;margin-top:-35px">
		<div class="hd">
			<div class="hd1"></div>
			<div class="hd2">
				<div id="nav2">
				<ul id="main-menu" class="sm sm-blue nav nav-collapse" style="margin:0;">
				</ul>
				</div>
			</div>
			<div class="hd3"></div>
			</div>
			</div>
     <!--  </div> 
     </div>   -->
     </nav> 
     </header> 
     
    <div id="content" style="margin-top:-38px;margin-left:-35px;">
     <div id="guide" style="width:1200px;">
     <ul class="breadcrumb"> 
	<li class="active only">首页<span class="divider">/</span>
	</li> 
	</ul> 
	</div>
		<div class="columns-1" id="main-content" role="main" style="width:1200px;" > 
			<iframe id="pageFrame" style="height:400px;width:1200px;" 
			frameborder=0 scrolling="no"
			src="">
			</iframe>
		 </div>
	<form action="#" id="hrefFm" method="post" name="hrefFm"> <span></span> </form> 
	</div> 
	</div>
    <div id="passwordDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#inportDlg-buttons'"
		style="width: 300px; height: 230px; padding: 10px;top:80px;">
		<table border="0" style="width: 100%;">
			<tr>
				<td align="right">旧密码</td>
				<td style="padding-left:5px;"><input id="oldPassword" type="password"  class="validatebox" style="width: 150px;" data-options="required:true" /></td> 
			</tr>
			<tr>
				<td align="right">新密码</td>
				<td style="padding-left:5px;"><input id="password1" type="password"  class="validatebox" style="width: 150px;" data-options="required:true" /></td> 
			</tr>
			<tr>
				<td align="right">确认密码</td>
				<td style="padding-left:5px;"><input id="password2" type="password"  class="validatebox" style="width: 150px;" data-options="required:true" /></td> 
			</tr>
			<tr>
				<td colspan="8" align="center">
					<button type="button" class="btn btn-info btn-sm" onclick="updatePassword();">修 改</button>
					<button type="button" class="btn btn-danger btn-sm" onclick="closePasswordDlg()">关闭</button>
				</td>
			</tr>
		</table>
	</div>
</body>
</html>

