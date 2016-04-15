<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/outPatientLog/outPatientLog.js"></script>
<title>门诊日志</title>
</head>
<body>
	<table id="dg"></table>
	<div id="tb" style="height: auto;">
		<form id="aa">
		起始时间：<input id="start" style="width:120px;" class="datebox" data-options="editable:false"/>
		终止时间：<input id="end" style="width:120px;" class="datebox" data-options="editable:false"/>
		<button class="btn btn-success btn-sm" type="button" onclick="findDate()" style="width:70px;padding-bottom: 3px; padding-top: 3px;">查&nbsp;询</button>
<%--	    <A TYPE="BUTTON" ID="PRINTBTN" HREF="#"  TARGET="_BLANK" CLASS="BTN BTN-SUCCESS BTN-SM" ONCLICK="PRINT();" STYLE="WIDTH:90PX;PADDING-BOTTOM: 3PX; PADDING-TOP: 3PX;"><FONT COLOR="WHITE">打印当前页</FONT></A>--%>
	                          
		</form>
	</div>
</body>
</html>
