<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<!-- 公共查询人员信息页面 -->
<title>收费管理</title> 
<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
.leftSide {
	text-align: right;
	width: 100px;
}

/* a:link {
	color: #333333;
} */
</style>

<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/paadmFee/refundFee.js"></script>

</head>
<body style="overflow: hidden;">
	<table style="width: 100%;">
		<tr>
			<td style="width:310px;padding: 0px; margin: 0px;">
				<div style="width:298px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">患者退费医嘱单信息</div></div>
				<div id="leftside" >
					<div id="leftToolbar">
						<!-- <select id="queryConditionSelect"
							style="width: 65px; height: 22px; padding-bottom: 2px;"
							name="dto.accountfee.orgName">
							<option value="patient.patient_name">姓名</option>
							<option value="patient.icard">身份证</option>
							<option value="rek.rekid">结算单</option>
						</select> --> 
						<label>检索：</label><div id="nameValueDiv" style="width:120px; display:inline"><select id="patCbg" class="combogrid" style="width: 120px;"
							data-options="
								pagination: true,
								panelWidth: 310,
		       		    		panelHeight: 340,
								textField:'patientName',
								idField:'patientid',
								hasDownArrow:false,
								mode: 'remote',
								url: '${ctx}/patientManage/getPatientList.ajax',
								method:'post',
								onSelect: function(rowIndex, rowData){queryBillList2(rowIndex, rowData)},
								columns: [[
									{field:'patientName',title:'姓名',width:70,align:'center'},
									{field:'patientSename',title:'性别',width:40,align:'center'},
									{field:'birthDate',title:'出生日期',width:90,align:'center'},
									{field:'icard',title:'证件号码',width:150,align:'center'}
								]],
								fitColumns: true">
						</select></div>
						<!-- <input  id="queryValueText" style="width: 120px;display: none"> -->
						 <a href="javascript:void(0)" class="linkbutton"
							style="width: 60px;"
							data-options="iconCls:'chis-query',plain:true" onclick="queryBillList()">查询</a>
					</div>
					<!-- 结算记录table -->
					<table id="reks"></table>
					<!-- 结算记录table结束 -->
				</div>
			</td>
			<!-- 右边 -->
			<td style="width:889px; padding: 0px; margin: 0px;" >
				<div style="width:878px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">退费明细</div></div>
				<div id="rightside">
					<div id="rightToolbar">
						<table border=0 style="width: 100%; font-size: 14px;">
							<tr>
								<td style="width: 70%;">
								患者姓名：<span id="patName" style="font-weight: bold; color: blue;"></span>&nbsp; 
								性别：<span id="patSex" style="font-weight: bold; color: blue;"></span>&nbsp;
								出生日期：<span id="patBirthDate" style="font-weight: bold; color: blue;"></span>&nbsp; 
								移动电话：<span id="patidCard" style="font-weight: bold; color: blue;"></span>&nbsp; 
								<!-- <a href="javascript:void(0)" id="refundBtn" class="linkbutton" data-options="iconCls:'chis-cost'" onclick="refundFeeDlg()">退费</a> -->
								<button id="refundBtn" type="button" class="btn btn-primary btn-sm"  style="width:55px;" onclick="refundFeeDlg();">退    费</button>
								</td>
							</tr>
						</table>
					</div>
					<div id="detail">
						<!-- 结算详细table -->
						<table id="rekDetaildg"></table>
					</div>
				</div>
			</td>
		</tr>
	</table>

	<div id="refundFeeDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#refundFeeDlg-buttons'"
		style="width: 350px; height: 230px; padding: 0px;">
		<form id="refundFeeForm" method="post">
			<table width="100%" border=0 align="center"  style="font-size: 16px;">
				<tr style="height: 30px;">
					<td align="right" style="width: 40%">
						患者姓名：
					</td>
					<td>
						<label id="patNameLab" style="font-weight: bold;"></label>
					</td>
				</tr>
				<tr style="height: 30px;">
					<td align="right" style="width: 40%">
						退费账单：
					</td>
					<td>
						<label id="refundBillLab" style="font-weight: bold;"></label>
					</td>
				</tr>
				<tr style="height: 30px;">
					<td align="right" style="width: 40%">
						应退金额：
					</td>
					<td>
						<label id="refundFeeLab" style="font-weight: bold;"></label><b>元</b>
					</td>
				</tr>
				<tr style="height: 30px;">
					<td align="right" style="width: 40%">
						退费方式：
					</td>
					<td> 
						 <input style="width: 120px;" class="combobox" id="payModeLab" name="rekTypeid" 
					        data-options="url:'${ctx}/dict/getDictContentList.ajax?dictName=paymentMethods',
						mode:'remote', valueField:'value', textField:'description', pagination:false, singleSelect:true, panelHeight:'auto', editable:false  ">
			 
					</td>
				</tr>
				<tr style="height: 30px;">
					<td align="right" style="width: 40%">
						退费原因：
					</td>
					<td>
						<select id="refundReason" style="width: 120px;">
							<option value="normal" selected="selected">正常退费</option>
						</select> 
					</td>
				</tr>
			</table>
		</form>
	</div>

	<div id="refundFeeDlg-buttons" style="text-align: center;">
		<!-- <a href="javascript:void(0)" class="linkbutton" onclick="refundFee()" style="font-size: 16px;">退费</a> 
		<a href="javascript:void(0)" class="linkbutton" onclick="javascript:$('#refundFeeDlg').dialog('close');"
			style="font-size: 16px;">关闭</a> -->
		<button type="button" class="btn btn-success btn-sm"  style="width:55px;" onclick="refundFee();">退    费</button>
		<button type="button" class="btn btn-danger btn-sm"  style="width:55px;" onclick="javascript:$('#refundFeeDlg').dialog('close');">关    闭</button>
	</div>
	
	<div id="chooseRepeatPatDlg" class="dialog" title="存在同名患者，请选择一个患者。" data-options="modal:true,closed:true" style="width: 500px; height: auto;">
		<table id="repeatPatName"></table>
	</div>
</body>
</html>
