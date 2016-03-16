<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<title>采购结算</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/drugstore/purSettle.js"></script>
</head>
<body>
<div style="background: white; height: 40px;">
	<!-- <a href="javascript:searchInoutList()" class="linkbutton" data-options="iconCls:'chis-cite'">调取入库单</a>
	<a href="javascript:clearFormAndTable()" class="linkbutton" data-options="iconCls:'chis-subtract'">清空</a>
	<a href="javascript:financialAndStCur()" class="linkbutton" data-options="iconCls:'chis-save'">付款</a>
	<a href="javascript:paymentList()" class="linkbutton" data-options="iconCls:'chis-history'">结算历史</a> -->
	<button type="button" class="btn btn-sm" onclick="searchInoutList()" style="margin: 8px 0; background-color:#20b2aa;border-color:#20b2aa;">调取入库单</button>
	<button type="button" class="btn btn-danger btn-sm" onclick="clearFormAndTable()" style="margin: 8px 0;" >清 空</button>
	<button type="button" class="btn btn-success btn-sm" onclick="financialAndStCur()" style="margin: 8px 0;" >付 款</button>
	<button type="button" class="btn btn-warning btn-sm" onclick="paymentList()" style="margin: 8px 0;" >结算历史</button>	
</div>
<div style="margin-top:10px;"></div>
<div style="background-color: white;">
<fieldset>
 <form id="inoutMTbForm">
 <input id="direct" hidden="true">
 <input id="userId" value="${userId}" type="hidden">
	<table style="font-size: 12px; margin: 0 10px;">
		<tr style="height: 35px;">
			<td align="right">&nbsp;&nbsp;采购科室：</td>
			
			<td><input id="org" disabled="true" class="combobox" name="payorgid" style="width: 150px;"
							data-options="valueField:'orgid',textField:'orgname'"/></td>
			<td align="right" style="width: 100px;">&nbsp;&nbsp;制单人：</td>
			<td ><input id="inoutMaker" disabled="disabled"></td>
			<td align="right" style="width: 150px;">&nbsp;&nbsp;总金额：</td>
			<td ><input id="wholeCurrency" disabled="disabled"></td>
			<td align="right" style="width: 100px;">&nbsp;&nbsp;供应商：</td>
			<td>
				<input	class="combobox" style="width: 150px" 	
										id="entid"
										name="entid"
										data-options="
										url:'${ctx}/purchaseManage/businessmanCtrl.ajax?issupplier=1',
										mode:'remote',
										valueField:'entid',
										textField:'entname',
										pagination:false,
										panelHeight:'auto',
										panelWidth: 240
							">
							</td>
		</tr>
		<tr style="height: 21px;">
			<td align="right">&nbsp;&nbsp;入库单号：</td>
			<td ><input id="inoutid" disabled="disabled"></td>
			<td align="right">&nbsp;&nbsp;制单日期：</td>
			<td ><input id="makeDate" class="datebox" disabled="disabled"></td>
			<td align="right">&nbsp;&nbsp;付款方式：</td>
			<td ><input class="combobox" id="payWay"
					data-options="url:'${ctx}/dict/getDictContentList.ajax?dictName=payway',
						mode:'remote', valueField:'value', textField:'description', pagination:false, singleSelect:true, panelHeight:'auto', editable:false  ">
				</td>
			<td align="right">&nbsp;&nbsp;备注：</td>
			<td ><input id="note"></td>
		</tr>
	</table>
	</form>
</fieldset>
</div>
<div style="margin-top: 10px;"></div>
<div>
	<table id="inoutDetail"></table>
</div>
<div id="quoteInoutListDlg" class="dialog" title="入库单" style="width:870px; height:385px;" data-options="closed:true,modal:true">
	<form id="quoteInoutSearchForm">
		<span style="margin-left: 5px;">科室：&nbsp;</span>
 			<input id="org_s" class="combobox" style="width: 100px;"
							data-options="valueField:'orgid',textField:'orgname'"/>
		<span style="margin-left: 5px;">入库单号：&nbsp;</span><input id="inoutid_s"  style="width:90px;"/>
		<!-- <span style="margin-left: 5px;">采购科室：&nbsp;</span><select><option>药库 </option></select> -->
		<span>入库日期：&nbsp;</span><input id="inoutStartDate_s" class="datebox" style="width: 100px;" data-options="editable:false"/>
		<span>至&nbsp;</span><input id="inoutEndDate_s" class="datebox" style="width: 100px;" data-options="editable:false"/>
		<!-- <span style="margin-left: 5px;">审核状态：&nbsp;</span>
			<select id="checkSelect">
				<option value="0">未审批 </option>
				<option value="1">已审批 </option>
			</select> -->
		<!-- <a href="javascript:searchinout()" class="linkbutton" data-options="iconCls:'chis-query', plain:true">查 询</a>
		<a href="javascript:quoteThisinout()" class="linkbutton" data-options="iconCls:'chis-right', plain:true">确定</a>
		<a href="javascript:closeQuoteDlg()" class="linkbutton" data-options="iconCls:'chis-close', plain:true">关闭</a> -->
		<button type="button" class="btn btn-primary btn-sm" onclick="searchinout()" style="" >查 询</button>
	 	<button type="button" class="btn btn-success btn-sm"  onclick="quoteThisinout()" style="" >确 定</button>
	  	<button type="button" class="btn btn-danger btn-sm" onclick="closeQuoteDlg()" style="">关 闭</button>
	</form>
	<div style="margin-top:5px;"></div>
	<table id="inoutList"></table>
</div>
<div id="payListDlg" class="dialog" title="付款记录" style="width:870px; height:385px;" data-options="closed:true,modal:true">
	<form id="paySearchForm">
		<!-- <span style="margin-left: 5px;">科室：&nbsp;</span>
 			<input id="org_s2" class="combobox" style="width: 130px;"
							data-options="valueField:'orgid',textField:'orgname'"/> -->
		<span style="margin-left: 5px;">入库单号：&nbsp;</span><input id="inoutidForPay" />
		<span>付款日期：&nbsp;</span><input id="payDate" class="datebox" style="width: 100px;" data-options="editable:false" />
		<!-- <a href="javascript:searchinoutForPay()" class="linkbutton" data-options="iconCls:'chis-query', plain:true">查 询</a>
		<a href="javascript:closePayListDlg()" class="linkbutton" data-options="iconCls:'chis-close', plain:true">关闭</a> -->
		<button type="button" class="btn btn-primary btn-sm" onclick="searchinoutForPay()" style="" >查 询</button>
	  	<button type="button" class="btn btn-danger btn-sm" onclick="closePayListDlg()" style="">关 闭</button>
	</form>
	<div style="margin-top:5px;"></div>
	<table id="payList"></table>
</div>
</body>
</html>
