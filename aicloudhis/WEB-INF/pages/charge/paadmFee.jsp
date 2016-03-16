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
/* a:link {
	color: #333333;
} */
</style>

<script type="text/javascript"	src="${ctx}/js/dhcc/chis/paadmFee/paadmFee.js">
</script>

</head>
<body style="overflow: hidden;">
<table style="width: 1200px;">
	<tr><td style="width: 300px;padding: 0px;">
			<div style="width:288px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">未收费患者列表</div></div>
			<div id="leftside" style="margin-right: 0px;">
			<div id="tbLeft">
				<label>检索：</label><select id="patCbg"
						class="combogrid" style="width: 120px;"
						data-options="
						pagination: true,
						panelWidth: 310,
       		    		panelHeight: 340,
						textField:'patientName',
						hasDownArrow:false,
						mode: 'remote', 
                        url: '${ctx}/patientManage/getPatientList.ajax',
						method:'post',
						columns: [[
							{field:'patientName',title:'姓名',width:70,align:'center'},
							{field:'patientSename',title:'性别',width:40,align:'center'},
							{field:'birthDate',title:'出生日期',width:90,align:'center'},
							{field:'icard',title:'证件号码',width:150,align:'center'}
						]],
						fitColumns: true
					">
				</select>							
				<a href="javascript:void(0)" class="linkbutton" style="width:60px;" data-options="iconCls:'chis-query',plain:true" onclick="findPatient(); return false;">查询</a>
			</div>
			<!-- 病人基本信息table -->
			<table id="patInfoDg"> </table>
			<!-- 病人基本信息table结束 -->	
			</div>
		</td>
		<!-- 右边 -->
		<td style="width: 900px;padding: 0px;">
			<div style="width:888px;" class="panel-header"><div class="panel-title" style="font-size: 12px;">费用明细</div></div>
			<div id="infomsg" style="display: block;">
				<table border=0 style="width: 100%; font-size: 14px;">
					<tr>
						<td style="width: 70%;">
						患者姓名：<span id="patName" style="font-weight: bold; color: blue;"> </span>&nbsp; 
						性别：<span id="patSex" style="font-weight: bold; color: blue;"> </span>&nbsp;
						出生日期：<span id="patBirthDate" style="font-weight: bold; color: blue;"> </span>&nbsp; 
						<!-- <a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'chis-cost'" onclick="getTotalPrice(); return false;">结算</a>
						 -->
						 <button type="button" class="btn btn-primary btn-sm"  style="width:55px;" onclick="getTotalPrice();">结    算</button>
						 </td>
						<td align="center"><span style="font-weight: bold;">云诊所   demo</span></td>
					</tr>
				</table>
			</div>

			<div id="detail">
				<!-- 收费明细table -->
				<form id="batForm">
					<table id="dtlFeeDg"></table>
				</form>
			</div>
			
		<div id="totalFee" style="border: solid 2px #DDDDDD;">
			<table border=0 style="width: 100%; height: auto;font-weight: bold;">
				<tr>
					<td>西药费：<span id="amountTotalWM">0.00</span>￥ 中药费：<span id="amountTotalCM">0.00</span>￥ 检验费：<span id="amountTotalJY">0.00</span>￥ 检查费：<span id="amountTotalJC">0.00</span>￥ 其他费用：<span id="amountTotalElse">0.00</span>￥</td>
					<td style="width: 20%;" align="right">费用总额： <span id="amountTotalT"
						style=" color: red;">0.00</span><B style="color: red;" >￥</B>
					</td>
				</tr>
			</table>
		</div>
				
				
		</td>
	</tr>
	
	
</table>

<div id="jsDlg-buttons" style="text-align: center;">
	<!-- <a href="javascript:void(0)" class="linkbutton" onclick="jsBtn();"
		style="font-size: 14px;">付款</a> 
	<a href="javascript:void(0)" class="linkbutton" onclick="javascript:$('#jsDlg').dialog('close')"
		style="font-size: 14px;">关闭</a>	 -->
	<button type="button" class="btn btn-success btn-sm"  style="width:55px;" onclick="jsBtn();">付    款</button>
	<button type="button" class="btn btn-danger btn-sm"  style="width:55px;" onclick="javascript:$('#jsDlg').dialog('close');">关    闭</button>
</div>	

<div id="jsDlg" class="dialog" title="结算" data-options="modal:true,closed:true,buttons:'#jsDlg-buttons'"
	style="width: 400px; height: auto; overflow: hidden; padding: 5px; font-size: 20px;">
	<form id="jsForm" method="post" >
		<table width="100%" border=0 align="center"  cellpadding=5 cellspacing=5 style="font-size: 16px;" >
			<tr>
				<td width="35%" align="right" >费用总额：</td>
				<td><input class="numberbox" id="totalMoney" style="height: 25px;width: 73%;" 
						data-options="min:0,precision:2,disabled:true" /></td>
			</tr>
			<tr>
				<td width="35%" align="right">应付金额：</td>
				<td><input class="numberbox" id="shouldPay"  style="height: 25px;width: 73%;" 
						data-options="min:0,precision:2,disabled:true" /></td>
			</tr>
			<tr>
				<td width="35%" align="right">实付金额：</td>
				<td><input class="numberbox" id="payMoney" style="height: 25px;width: 73%;" 
					 onkeyup="backFee()" data-options="min:0,max:999999.99,precision:2"/></td>
			</tr>
			<tr>
				<td width="35%" align="right">应找金额：</td>
				<td><input class="numberbox" id="backMoney" style="height: 25px;width: 73%;" 
					data-options="min:0,precision:2,disabled:true"/></td>
			</tr>
			<tr>
				<td width="35%" align="right">支付方式：</td>
				<td><input style="width: 171px;" class="combobox" id="payForWay" name="rekTypeid" 
					data-options="url:'${ctx}/dict/getDictContentList.ajax?dictName=paymentMethods',
						mode:'remote', valueField:'value', textField:'description', pagination:false, singleSelect:true, panelHeight:'auto', editable:false  ">
				</td>
			</tr>	
		</table>	
	</form>
</div>	
		
</body>
</html>
