
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/rightmanagement/accountRole.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<title>角色分配</title>
</head>
<body>
    <div id="assignRoles">
		<form id="aR">
			  登录名：<input class="validatebox" type="text" id="accountName" style="width:100px;height:20px">     
                                      姓名： <input class="validatebox" type="text" id="empName" style="width:100px;height:20px">
           <button type="button" class="btn btn-primary btn-sm" onclick="javascript:searchAccount()">查 询</button>  
<%--           <button type="button" class="btn btn-success btn-sm" onclick="javascript:searchAccount()">新增</button>  --%>
<%--           <button type="button" class="btn btn-info btn-sm" onclick="javascript:searchAccount()">修改</button> --%>
<%--           <button type="button" class="btn btn-danger btn-sm" onclick="javascript:searchAccount()">删除</button> --%>
            
	    		                    
		</form>
	</div>
	<div>
	   <table id="role"></table>
	</div>
		 
	<div id="roleDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#inportDlg-buttons'"
		style="width: 500px; height: 400px; padding: 10px;top:80px;">
		<div>
		   <table id="roledg"></table>
		</div>
		<!--<div id="roledgTools">
			<form id="roleForm" method="post"> 
	      		   角色描述 <input class="validatebox" type="text" id="roleDescribe" style="width:100px;height:20px">&nbsp;&nbsp;&nbsp;                         
                <a class="linkbutton" data-options="iconCls:'chis-query'" onclick="javascript:selectClick()">查询</a>&nbsp;   
                <a class="linkbutton" data-options="iconCls:'chis-confirm'" onclick="javascript:devide()">分配</a>&nbsp;
			</form>
		</div>-->
		<input type="hidden" id="accountId" />
		<div id="createDlg-buttons" style="text-align: center;">
      		<button type="button" class="btn btn-success btn-sm" onclick="saveRoles()">保 存</button>
      		<button type="button" class="btn btn-danger btn-sm" onclick="closeDlg()">关 闭</button>
      		<!-- <a href="javascript:saveRoles()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>
     		<a href="javascript:closeDlg()" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a> -->
	  	</div> 
	</div>
</body>
</html>
