<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>




<!DOCTYPE html PUBLIC "-//W3C//DTD H TML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<title>病人身份信息管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/patientPrivilege/patientPrivilege.js"></script>
</head>
<body>
<div style="width:100%">
  	<div id="tabletoolbar">
		<label style="height: auto;">身份名称:&nbsp;</label> 
	    <input class="validatebox" id="patientIdentityName" type="text" style="height: auto; width: 160px; font-size: 14px;"> 
		<!-- <a href="javascript:search()" id="search"  class="linkbutton">查询</a>
		<a href="javascript:creat()" id="creat" class="linkbutton">新建</a>
		<a href="javascript:updatePatientIdentity()" class="linkbutton">修改</a>
		<a href="javascript:deleteRecord()" id="delete" class="linkbutton">删除</a> -->
	    <button class="btn btn-warning btn-sm" type="button" onclick="search()" style="width:70px;">查 询</button>
	    <button type="button" class="btn btn-success btn-sm" onclick="creat();" style="width:70px;">新 建</button>
	    <button class="btn btn-info btn-sm" type="button" onclick="updatePatientIdentity()" style="width:70px;">修 改</button>
	    <button type="button" class="btn btn-danger btn-sm" onclick="deleteRecord()" style="width:70px;">删 除</button>
	</div>
	<table id="listTb"></table>
	<div id="creatOrUpdateDlg" class="dialog" data-options="modal:true,closed:true,buttons: '#dlgButtons'" style="width:300px; height:auto; padding: 20px 10px;">
		<form id="paIdentityForm">
		<div id="dlgButtons" style="text-align: center;">
		    <button id="dlgBtnSave" type="button" class="btn btn-success btn-sm" style="width:70px;">保 存</button>
		    <button id="dlgBtnCancle" type="button" class="btn btn-danger btn-sm" style="width:70px;">关 闭</button>
	    </div>
		<table cellpadding="5">
			<tr>
				<td nowrap="nowrap" align="right">
					<font style="font-family: '宋体', Simsun;">上级编码:</font>
				</td>
				<td align="left"><input class="combobox" id="upid" name="patientIdentity.upid"
					data-options="
					url:'${ctx}/agencyManage/getPatientIdentityList.ajax',
					mode:'remote',
					valueField:'patientIdentityid',
					textField:'patientIdentityname',
					editable:false,
					panelHeight:'auto'
				"/>
				</td>
			</tr>
			<tr style="display: none;">
			<td nowrap="nowrap">
				<font style="font-family: '宋体', Simsun;">患者身份编码:</font>
				</td>
			<td>
				<input id="idcode" name="patientIdentity.patientIdentityid"/>
			</td>
			</tr>
			<tr>
				<td nowrap="nowrap" align="right">患者身份名称:</td>
				<td align="left"><input id="idname" name="patientIdentity.patientIdentityname"/>
				</td>
			</tr>
			<tr id="identitynameFlag" style="display: none;">
				<td colspan="2">
					<span style="font-size: 12px; color: #FF0000;" >此患者身份已存在</span>
				</td>
			</tr>
		</table>
		</form>
	</div>
</div>
</body>
</html>
