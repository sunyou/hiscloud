<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>个人信息</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/sicker/sickerMgr.js"></script>	
</head>
<body style="overflow:hidden">
<fieldset style="height: 225px">
	<legend style="color:red">预约登记</legend>
		<div id="tb">
	       	 姓名<input class="validatebox" id="patientName" type="text" style="height: 25px; width: 100px">
			移动电话<input class="validatebox" id="patientTelephone"  type="text" style="height: 25px; width: 100px">
			<button class="btn btn-success btn-sm" type="button" onclick="RegisterQuery()" style="padding-bottom: 3px; padding-top: 3px; width: 70px">查&nbsp;询</button>
			<!-- <a href="javascript:RegisterQuery()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a> -->
			<span style="color: red">请查询患者信息进行预约登记;若无患者登记信息,请先进行</span> <a href="javascript:void(0)" onclick="redirect2PatientReg();">
							   <span style="color: blue">患者登记</span></a>
		</div>
	<table id="patientinfo"></table> 
</fieldset>
<fieldset style="height: 225px;">
	<legend style="color:red">已预约</legend>
		<div id="tb1">
	       	 姓名<input class="validatebox" id="patientName1" type="text" style="height: 25px; width: 100px">
			移动电话<input class="validatebox" id="patientTelephone1"  type="text" style="height: 25px; width: 100px">
			预约初始日期<input class="datebox" id="startDate" style="height: 25px; width: 90px" data-options="editable:false">
			预约结束日期<input class="datebox" id="endDate" style="height: 25px; width: 90px" value=2015-06-18 data-options="editable:false">
			<button class="btn btn-success btn-sm" type="button" onclick="BookedQuery()" style="width:70px;padding-bottom: 3px; padding-top: 3px;">查&nbsp;询</button>
		<!-- 	<a href="javascript:BookedQuery()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a> -->
		</div>
	<table id="bookedInfo"></table> 
</fieldset>

<div id="calendarDlg" class="dialog" title="Modal Window" data-options="cache:false,modal:true,closed:true" style="width:780px;height:390px;">
	<div style="width:360px;float:left;margin-top:5;font-size:16px;">
		<fieldset style="height:325px">
			<legend>患者信息</legend>
			<form id="createForm" method="post">
 				<input type="hidden" id="patientidL" name="dto.patientBook.patientid">
				<table border="0">
					<tr style="height: 35px;" align="left">
						<td>姓名:</td>						
						<td style="color: #0000FF;"><span id="patientNameL" ></span></td>						
					</tr>
					<tr style="height: 35px">
						<td >性别:</td>
						<td style="color: #0000FF;"><span id="patientSexIdL"></span></td>
					</tr>
					<tr style="height: 35px">
						<td >年龄:</td>
						<td style="color: #0000FF;"><span id="patientAgeL"></span></td>
					</tr>
					<tr style="height: 35px">
						<td >移动电话:</td>
						<td style="color: #0000FF;"><span id="patientTelephoneL"></span></td>
					</tr>
					<tr style="height: 35px">
						<td>身份证号:</td>
						<td style="color: #0000FF;"> <span id="icardL"></span></td>
					</tr>
					<tr style="height: 35px">
						<td >详细地址:</td>
						<td style="color: #0000FF;"><span id="streetinfoL"></span></td>
					</tr>
					<tr style=" height: 60px">
						<td><span>症状描述:</span></td>
						<td><textarea style="width: 250px;height: 95px" id="symptoms"></textarea></td>
					</tr>
				</table>
			</form>
		</fieldset>
	</div>
	<div id="calendar" style="width:400px;float:right;font-size:16px">
	</div>
</div>
<div id="bookInfo" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#bookInfo-buttons'" style="width:700px;height:226px;">
		<table id="doclist"></table>	
</div>	
</body>
</html>

