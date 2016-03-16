
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>角色管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/funcManagement/roleManagement.js"></script>
</head>
<body>
   <div id="roleManagement">
		<form id="aa">
			    角色名称<input class="validatebox" id="name" type="text" style="height: 20px; width: 100px">&nbsp;&nbsp;  
			  <!--  角色代码<input class="validatebox" id="code" type="text" style="height: 20px; width: 100px">&nbsp;&nbsp;  --> 
			    状态<select class="combobox" type="text" style="width: 100px;height:25px;" editable="false"
				             id="state">
				             <option value='2'>全部</option>  
				             <option value='1'>使用</option>
				             <option value='0'>停用</option>	             
		      </select>                        
           <button class="btn btn-primary btn-sm" type="button" onclick="javascript:query()">查&nbsp;询</button>&nbsp;   
           <button onclick="addRole()" class="btn btn-success btn-sm" type="button">新&nbsp;增</button>&nbsp;   
           <button onclick="updateRole()" class="btn btn-info btn-sm" type="button">修&nbsp;改</button>&nbsp;
           <button onclick="deleteRole()" class="btn btn-danger btn-sm" type="button">删&nbsp;除</button>                                                                          
		</form>
	</div>
	<table id="role"></table>
	<div id="roleDlg" class="dialog" data-options="closed:true"
	     style="height:auto;width:300px;padding:10px;top:50px;">
	     <form id="roleForm" method="post">
	         <input id="roleId" name="roleId" style="display: none;"/>
	         <input id="tenantId" name="tenantId" style="display: none;"/>
	         <input id="createDate" name="createTime" style="display: none;"/>
	         <table cellpadding="2" border="1" cellspacing="0"  bordercolor="#0099FF" style="width:260;font-size:12px;">
	            <tr>
	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">角色名称：</td>
	                <td align="center" style="width: 160px;">
				            <input class="validatebox" type="text" id="roleName" name="roleName" style="width: 160px;height:20px;"
				                    data-options="required:true"/>
				    </td>
	            </tr>	            
<%--	            <tr>--%>
<%--	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">角色代码：</td>--%>
<%--	                <td align="center" style="width: 160px;">--%>
<%--				            <input class="validatebox" type="text" id="roleCode" name="roleCode" style="width: 160px;height:20px;"--%>
<%--				                    data-options="required:true"/>--%>
<%--				    </td>--%>
<%--	            </tr>--%>
	            <tr>
	                 <td bgcolor="#D7D7D7" align="right" style="width: 100px;">角色描述：</td>
				     <td align="center" style="width: 160px;">
				            <input class="validatebox" type="text" id="roleDes" name="roleDes" style="width: 160px;height:20px;"
				                    data-options="required:false"/>
				     </td>
	            </tr>
	            <tr>
	                 <td bgcolor="#D7D7D7" align="right" style="width: 100px;">使用状态：</td>
				     <td align="center" style="width: 160px;">
				          <select class="combobox" type="text" id="roleState" name="roleState" data-options="required:true" 
				                                   style="width: 160px;height:20px;">
				                   <option value='1'>使用</option>
				                   <option value='0'>停用</option>
				          </select>
				     </td>
	            </tr>
	         </table>
	     </form>
	     <div id="roleDlg-buttons" style="text-align: center;">
	             <button onclick="javascript:clearRole()"  id="clear" class="btn btn-warning btn-sm" type="button">清空</button>
			     <button onclick="javascript:save()"  id="save" class="btn btn-success btn-sm" type="button">保存</button>
	             <button onclick="javascript:update()" id="update" class="btn btn-success btn-sm"  type="button">修改</button>
	             <button onclick="javascript:myclose()" id="close" class="btn btn-danger btn-sm" type="button">关闭</button>
	     </div>
	</div>
</body>
</html>
