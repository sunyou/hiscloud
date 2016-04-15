<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>药房退药</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
/* a:link {
	color: #333333;
} */
</style>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/pharmacy/backMedicine.js">
</script>

</head>
<body style="overflow: hidden;">

<table style="width:100%;height:490px;" border=0 >
	<tr><td style="width:310px;padding: 0px; margin: 0px;">
			<div style="width:298px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">退药医嘱单列表</div></div>
			<div style="width:310px;margin-top: -100px;">
				
				<!-- 病人基本信息table -->
				<table id="patInfoDg"> </table>
				<!-- 病人基本信息table结束 -->				
			</div>  
	</td>
	<td style="width:889px; padding: 0px; margin: 0px;">
		<div style="width:878px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">退药明细</div>
		<fieldset>
			
			<div id="tbLeft">
					<label>检索：</label>
					<select id="patCbg" class="combogrid" style="width: 120px;"
						data-options="panelWidth: 300, panelHeight: 150, textField:'patientName',
						pagination: true,
						panelWidth: 310,
		       		    panelHeight: 340,
						hasDownArrow:false, mode: 'remote', method:'post', fitColumns: true,
						onSelect:function(rowIndex, rowData){findSelectedPatient(rowIndex, rowData)},
						url: '${ctx}/patientManage/getPatientList.ajax',
						columns: [[
						{field:'patientName',title:'姓名',width:70,align:'center'},
						{field:'patientSename',title:'性别',width:40,align:'center'},
						{field:'birthDate',title:'出生日期',width:90,align:'center'},
						{field:'icard',title:'证件号码',width:150,align:'center'}
					]],">
					</select>		
					<a href="javascript:void(0)" class="linkbutton" style="width:60px;" data-options="iconCls:'chis-query',plain:true" onclick="findPatient()">查询</a>
					<a href="javascript:void(0)" class="linkbutton" style="width:80px;" data-options="iconCls:'chis-add',plain:true" onclick="">下一位</a>
					<div style="float:right;">
						<a href="javascript:void(0)" class="linkbutton" style="width:120px;" data-options="iconCls:'chis-remove',plain:true" onclick="">退药历史查询</a>
					</div>
				</div>
		</fieldset>
			<div>
				<!-- 配药table -->
				<table id="OrderDg"></table>
				<!-- <table id="MedInfoDg"></table> -->
			</div> 
		</div>
	</td></tr>
</table>

<div id="infomsg">
	<table border=0 style="width: 100%; font-size: 14px;">
		<tr>
			<td style="width: 70%;">
				患者姓名：<span id="patName" style="font-weight: bold; color: blue;"> </span>&nbsp; 
				性别：<span id="patSex" style="font-weight: bold; color: blue;"> </span>&nbsp;
				出生日期：<span id="patBirthDate" style="font-weight: bold; color: blue;"></span>&nbsp; 
				移动电话：<span id="patidCard" style="font-weight: bold; color: blue;"> </span>&nbsp;&nbsp;&nbsp;
				<!-- <a href="javascript:void(0)" id="backMedBtn" class="linkbutton" data-options="iconCls:'chis-drug'" onclick="backMed()">退药</a> -->
				<button id="backMedBtn" type="button" class="btn btn-success btn-sm"  style="width:55px;" onclick="backMed();">退    药</button>
			</td>
			
		</tr>
	</table>
</div>
	
</body>
</html>
