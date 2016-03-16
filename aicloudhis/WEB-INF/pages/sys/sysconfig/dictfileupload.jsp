<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>字典管理</title>

<script type="text/javascript" src="/chis_test/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="/chis_test/js/common.js"></script>
<script type="text/javascript" src="/chis_test/js/commonUI.js"></script>
<script type="text/javascript" src="/chis_test/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="/chis_test/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="/chis_test/css/style.css" />

<script type="text/javascript">
	$(function(){
		
	});
	

	function getFullPath() {
		
		//判断浏览器
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		var file_url="";
		if(Sys.ie<="6.0"){
			//ie5.5,ie6.0
			file_url = document.getElementById("filePath").value;
			return 1;
		}else if(Sys.ie>="7.0"){
		//ie7,ie8
			var file = document.getElementById("filePath");
			file.select();
			file_url = document.selection.createRange().text;
			return 2;
		}else if(Sys.firefox){
			//alert("不支持此浏览器");
			return 3;
			//fx
			//file_url = document.getElementById("file").files[0].getAsDataURL();//获取的路径为FF识别的加密字符串
			//file_url = readFileFirefox(document.getElementById("file"));
		} else {
			return 4;
			//alert("不支持此浏览器");
		}
		//alert(file_url);
		return file_url;
	}

	
	function uploadView(){
		var sys=getFullPath();
		if (sys==3){
			alert("请确认将数据导入文件放置在C盘根目录下，否则不能正常导入。");
		} else {
			alert("不支持此浏览器，请选择火狐浏览器上传。");
			return;
		}
		var filePath = $('#filePath').val();
		if (filePath==''){
			alert("请选择导入文件");
			return;
		}
		var filePath = $('#filePath').val();
		var options = {toolbar : "#tb",height : 460,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 10};
		var columns = [[
		     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
		     			{title : "类型",field : "type",width : 80,align : 'center'},
		     			{title : "代码",field : "value",width : 80,align : 'center'},
		     			{title:"描述",field:"description",width:80,align : 'center'},
		     			{title : "对应上级代码",field : "upid",width : 200,align : 'center'},
		     			{title : "输入码",field : "inputstr",width : 200,align : 'center'},
		     			{title : "级次",field : "grade",width : 200,align : 'center'},
		     			{title : "是否叶子节点",field : "leaflag",width : 200,align : 'center'},
		     			{title : "是否停止",field : "stopflag",width : 200,align : 'center'}
		     			]] ;
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH + '/fileUpload/fileUploadCtrl.htm?BLHMI=dictFileList&dto.filePath='+filePath;
		$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	}
	
	function uploaddataToDb(){
		var sys=getFullPath();
		if (sys==3){
			alert("请确认将数据导入文件放置在C盘根目录下，否则不能正常导入。");
		} else {
			alert("不支持此浏览器，请选择火狐浏览器上传。");
			return;
		}
		var filePath = $('#filePath').val();
		if (filePath==''){
			alert("请选择导入文件");
			return;
		}
		//uploadNewFiletoDb
		//uploadFiletoDb
		//uploadFileAlltoDb
		 postReq($WEB_ROOT_PATH+'/fileUpload/fileUploadCtrl.htm?BLHMI=uploadFiletoDb', "#upForm", succ, err, {skipHidden:false});
	}
	function succ(){
		alert("上传成功");
	}
	function err(){
		alert("上传失败");
	}
</script>
 <script type="text/javascript">
</script>
</head>
<body>

<div id="tabsResize" class="tabs" style="position:relative;height:auto;border-top:0" data-options="fit:true">
	<div title="字典类型" style="width: 100%; padding: 0; margin: 0" data-options="fit:true">	
	<form id="upForm">
		<table id="dg"></table>
			<div id="tb" style="height: auto; margin-left: 10px;">
				<input type="file" id="filePath" name="dto.filePath">
				<a href="javascript:uploadView()"  class="linkbutton">预览导入数据</a>
			    <a href="javascript:uploaddataToDb()" class="linkbutton" >导入 数据</a>
			    
			</div>
	</form>
	</div>
</div>

</body>
</html>
