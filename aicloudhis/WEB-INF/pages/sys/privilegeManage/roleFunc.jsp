
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>角色权限管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
/* a:link {
	color: #333333;
}  */
</style>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/rightmanagement/roleFunc.js">
</script>
</head>
<body style="overflow: hidden;" >
<table style="width:100%;" border=0 >
	<tr><td style="width:300px; padding: 0px; margin: 0px;vertical-align:top;">
			<div style="width:288px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">角色列表</div></div>
			<div style="width:300px;">
				<div id="tbLeft">
					<label>检索：</label>
					<input class="validatebox" type="text" id="searchKey" style="width:100px;height:20px">
					<button type="button" class="btn btn-primary btn-sm" onclick="javascript:searchRole()">查 询</button>
				</div>
				<table id="roleDg"> </table>			
			</div>  
	</td>
	<td style="width:900px; padding: 0px; margin: 0px;vertical-align:top;">
		<div style="width:888px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">权限</div></div>
			<div id="infomsg">
				<table border=0 style="width: 100%; font-size: 14px;">
					<tr>
						<td style="width: 70%;">
<%--							   密码： <input class="validatebox" type="password" id="pwd" style="width:100px;height:20px">--%>
          						<button type="button" class="btn btn-success btn-sm" onclick="javascript:saveFuncs()">保 存</button>
						</td>
					</tr>
				</table>
			</div>
			<input type="hidden" id="roleId" />
			<div id="treeDiv" style="height:400px;overflow:scroll;visibility:visible;" class="panel-body">
				<ul id="funcTree"></ul>  
			</div> 
		</div>
	</td></tr>
</table>
</body>
</html>
