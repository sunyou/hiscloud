<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>采购入库</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/drugstore/purWarehousing.js"></script>
</head>
<body style="width: 1200px;">
<div style="background: white; height: 40px; margin-top: 15px;">
	<!-- 引用采购单或者药品选择添加时的判断 -->
	<input id="selectOrQuote" hidden="true" value="">
	<span style="font-size: 12px;" title="药品编码/名称">药品检索&nbsp;</span>
	<input id="matchitem" placeholder="名称/助记符" onkeyup="matchItemIntable(this.value)">	
	<button id="selectItemsBtn" type="button" class="btn btn-primary btn-sm" onclick="itemsSelect()" style="margin: 8px 0">选择药品</button>
	<button type="button" class="btn btn-sm" onclick="quoteOrder()" style="margin: 8px 0; background-color:#20b2aa;border-color:#20b2aa;">调取采购单</button>
	<button type="button" class="btn btn-danger btn-sm" onclick="clearFormAndTable()" style="margin: 8px 0">清 空</button>
	<button id="saveBtn" type="button" class="btn btn-info btn-sm" onclick="saveItems()" style="margin: 8px 0">保 存</button>
	<button id="sureBtn" type="button" class="btn btn-success btn-sm" onclick="sureSave()" style="margin: 8px 0" disabled="disabled">确认入库</button>	
	<button id="historyBtn" type="button" class="btn btn-warning btn-sm" onclick="history()" style="margin: 8px 0">入库记录</button>		
	<br style="margin-top: 15px;">
</div>
<div style="margin-top:10px;"></div>
<div style="background-color: white;">
 <form id="inoutMTbForm">
 	<input id="actionFlag" hidden="true">
 	<input id="userId" value="${userId}" type="hidden">
 	<input id="purId" hidden="true" name="documentno">
 <fieldset>
	<table style="font-size: 12px; margin: 0 10px;">
		<tr style="height: 35px;">
			<td align="right">&nbsp;&nbsp;采购科室：</td>
			<td><input id="org" class="combobox" style="width: 150px;"
							data-options="valueField:'orgid',textField:'orgname'"/></td>
			<td align="right" style="width: 100px;">&nbsp;&nbsp;制单人：</td>
			<td ><input id="purMaker" value="${userId}" disabled="disabled"></td>
			<td align="right" style="width: 150px;">&nbsp;&nbsp;批发价总金额：</td>
			<td ><input id="wholeSaleTotalPrice" disabled="disabled"></td>
			<td align="right" style="width: 100px;">&nbsp;&nbsp;供应商：</td>
			<td >
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
			
		</tr>
		<tr style="height: 21px;">
			<td align="right">&nbsp;&nbsp;入库单号：</td>
			<td ><input id="inoutid" disabled="disabled"></td>
			<td align="right">&nbsp;&nbsp;制单日期：</td>
			<td ><input id="makeDate" class="datebox" disabled="disabled"></td>
			<td align="right">&nbsp;&nbsp;采购价总金额：</td>
			<td ><input id="purTotal" disabled="disabled"></td>
			<td align="right">&nbsp;&nbsp;备注：</td>
			<td ><input id="inoutNote" name="inoutNote"></td>
		</tr>
	</table>
	</fieldset>
	</form>
</div>
<div style="margin-top: 10px;"></div>
<div>
	<table id="itemsTable"></table>
</div>
<div id="quotePurDlg" class="dialog" title="采购单" style="width:850px; height:385px;" data-options="closed:true">
	<form id="quotePurSearchForm">
		<span style="margin-left: 5px;">采购单号：&nbsp;</span><input id="purchaseid_s"/>
		<span>采购日期：&nbsp;</span><input id="purStartDate_s" class="datebox" data-options="editable:false"/>
		<span>至&nbsp;</span><input id="purEndDate_s" class="datebox" data-options="editable:false"/>
		<button type="button" class="btn btn-primary btn-sm" onclick="searchPurchase()" style="" >查 询</button>
	 	<button type="button" class="btn btn-success btn-sm"  onclick="quoteThisPurchase()" style="" >确 定</button>
	  	<button type="button" class="btn btn-danger btn-sm" onclick="closePurDlg()" style="">关 闭</button>
	</form>
	<div style="margin-top:5px;"></div>
	<table id="purList"></table>
</div>
<div id="itemsSelectDlg" class="dialog" title="药品选择" data-options="closed: true" style="height: 385px; width: 772px;">
	<form action="" id="itemsForm">
	<div id="drugToolbar">
	<span style="font-size: 12px;" title="药品编码/名字">药品检索&nbsp;</span>
		<input id="items_s" placeholder="名称/助记符" >
		<span style="margin-left: 15px;">药品分类&nbsp;
		<input  class="combobox" 	
					id="cateid"
					style="width: 90px;"
					name=""
					data-options="
					url:'${ctx}/purchaseManage/cateList.ajax',
							mode:'remote',
							editable:false,
							valueField:'ordCateid',
							textField:'ordCatename',
							pagination:false,
							panelHeight:'auto'">
		</span>
		<button class="btn btn-primary btn-sm" id="medepursearchBtn" type="button" onclick="medetailpursearch()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">查&nbsp;询</button>
	    <button type="button" class="btn btn-danger btn-sm" onclick="closedgSlDlg()" style="">关 闭</button>	
	</div>
	</form>
	<table id="itemsTb"></table>
</div>
<div id="historyDlg" class="dialog" title="入库记录" data-options="closed: true,modal:true" style="height: 385px; width: 920px;">
 <form id="historySearchForm">
 		<span style="margin-left: 5px;">科室：&nbsp;</span>
 			<input id="org_s" class="combobox" style="width: 130px;"
							data-options="valueField:'orgid',textField:'orgname'"/>
		<input type="hidden" id="inoutid_s" />
		<span>入库日期：&nbsp;</span><input id="inoutStartDate_s" class="datebox" style="width: 100px;" data-options="editable:false"/>
		<span>至&nbsp;</span><input id="inoutEndDate_s" class="datebox" style="width: 100px;" data-options="editable:false">
		<span style="margin-left: 5px;">审核状态：&nbsp;</span>
			<select id="checkSelect">
				<option value="0">未审核 </option>
				<option value="1">已审核 </option>
			</select>
		<button type="button" class="btn btn-primary btn-sm" onclick="searchinout()" style="" >查 询</button>
	    <button type="button" class="btn btn-danger btn-sm" onclick="closeHistoryDlg()" style="">关 闭</button>	
	</form>
 <table id="historyTable"></table>
</div>
</body>
</html>
