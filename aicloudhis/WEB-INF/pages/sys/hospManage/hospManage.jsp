<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>诊所管理</title>

<script type="text/javascript" src="${ctx }/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx }/js/common.js"></script>
<script type="text/javascript" src="${ctx }/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx }/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx }/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx }/css/style.css" />
<script type="text/javascript"
	src="${ctx }/js/dhcc/chis/hospManage/hospManage.js"></script>
<script type="text/javascript" 
    src="${ctx }/js/dhcc/chis/common/comUtil.js"></script>
</head>
<body>
    <input type="hidden" id="state" />
    <input type="hidden" id="orgname" />
	<div id="accountTb">          
	            诊所名称<input class="validatebox" id="hospName" type="text" style="height: 25px; width: 100px">&nbsp;&nbsp;&nbsp;
		<button onclick="javascript:findData()"  class="btn btn-primary btn-xs" type="button" style="height: 26px">&nbsp;查&nbsp;询&nbsp;</button>&nbsp;
	    <button onclick="javascript:updateState(1)" class="btn btn-success btn-xs" type="button" style="height: 26px">&nbsp;启&nbsp;用&nbsp;</button>&nbsp; 
	    <button onclick="javascript:updateState(0)" class="btn btn-danger btn-xs" type="button" style="height: 26px">&nbsp;禁&nbsp;用&nbsp;</button>&nbsp;  
	    <button onclick="javascript:sendMessage()" class="btn btn-info btn-xs" type="button" style="height: 26px">&nbsp;发送消息&nbsp;</button>
	</div>
	    <table id="accountDg"></table>
	    
    <div id="sendDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
		style="width: 675px; height: auto; padding: 15px;top:50px;">
		<table id="sendDg" ></table>
		<br/>
		<tr>
		   <td>
		              发送号码：<input class="validatebox" id="telephone" type="text" style="height: 25px; width: 500px" 
		              placeholder="手机号码之间请用逗号（,）隔开" />
		     <button onclick="javascript:send()" class="btn btn-info btn-xs" type="button" style="height: 25px;width: 60px">&nbsp;发&nbsp;送&nbsp;</button>      
		   </td>
		</tr>
    </div>
    
</body>
</html>
