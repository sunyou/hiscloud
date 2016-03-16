<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>调价建单</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css"></style>
<script type="text/javascript" 
  src="${ctx}/js/dhcc/chis/drugstore/adjustPricebill.js">
</script>
</head>
<body>
<div id="tabsResize"  style="position:relative;height:auto;border-top:0" data-options="fit:true">
 	<input id="adjustid1" type="hidden"/> 
	<form action="" id="mainKey">
		<div title="调价建单" style="width: 100%; padding: 0; margin: 0" data-options="fit:true">	
		<!-- 	<div id="tb" style="height: auto;"> -->
			<div id="tb" style="margin-bottom:10px;background-color: #FFFFFF">
		    <button class="btn btn-warning btn-sm" type="button" onclick="queryOverBill()" style="width:100px;padding-bottom: 3px; padding-top: 3px;">调价记录</button>
			<button class="btn btn-primary btn-sm" type="button" onclick="chooseDrug()" style="width:100px;padding-bottom: 3px; padding-top: 3px;">选择药品</button>
			<button class="btn btn-info btn-sm" type="button" onclick="saveBill()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">保&nbsp;存</button>
			<button class="btn btn-danger btn-sm" type="button" onclick="clearning()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">清&nbsp;空</button>
			<button class="btn btn-success btn-sm" id="sureBtn" type="button" disabled="disabled" onclick="sureApproval()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">审&nbsp;批</button>
			
			<!-- <a href="javascript:queryOverBill()"  class="linkbutton" data-options="iconCls:'chis-history'">调价记录</a>&nbsp;
		    <a href="javascript:chooseDrug()" class="linkbutton"  data-options="iconCls:'chis-select'">选择药品</a> &nbsp;
		    <a href="javascript:saveBill()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>&nbsp;
			<a href="javascript:clearning()" class="linkbutton" data-options="iconCls:'chis-clear'">清空</a>&nbsp;
			<a href="javascript:sureApproval()" id="sureBtn" class="linkbutton" data-options="disabled: 'true',iconCls:'chis-check'">审批</a>&nbsp; -->
		</div>
		<table id="bill"></table>
	</form>
		
		<div id="medChooseDlg" class="dialog" title="药品选择" 
			data-options="closed:true,icon:'icon-cancel',"style="width:800px;height:400px;padding:10px">
			<form action="" id="itemsForm">
				<div id="tb" style="height: auto;">
					药品检索:<input id="inputStr" type="text" placeholder="药品名称/助记符" style="width: 100px;" name="" data-options="" />
					 药品分类:<input  class="combobox" 	
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
					
					 <button class="btn btn-primary btn-sm" id="medepursearchBtn" type="button" onclick="medetailpursearch()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">查&nbsp;询</button>
					<button class="btn btn-danger btn-sm" id="billcloseBtn" type="button" onclick="billclose()" style="width:80px;padding-bottom: 3px; padding-top: 3px;">关&nbsp;闭</button>
			       <!--  <a href="javascript:void(0)" id="medepursearchBtn" class="linkbutton" data-options="iconCls:'chis-query'" onclick="medetailpursearch()">查询</a>
				    <a href="javascript:void(0)" id="billcloseBtn" class="linkbutton" data-options="iconCls:'chis-close'" onclick="billclose()">关闭</a> -->
				</div>
			</form>
			<table  id="queryDrugBillWindow"></table>
		</div>
		<div id="queryOverAdjustPriceBillDLg" class="dialog" title="调价单历史记录" 
			data-options="closed:true,icon:'icon-cancel'," style="width:800px;height:420px;padding:10px">
			<div id="billtb" style="height: auto;">
				<form id="form1">
					调价单号:<input class="validatebox" type="text" id="adjustid" name="adjustid" style="width: 90px;"/>&nbsp;
					建单日期:<input class="datebox" type="text" id="startDate" name="startDate" style="width: 90px;" data-options="editable:false"/>
					至:<input class="datebox" type="text" id="endDate" name="endDate" style="width: 90px;" data-options="editable:false"/>&nbsp;
					审核状态:
					<input class="combobox" type="text" id="isfinished" name="isfinished" style="width: 94px;" data-options="
						valueField: 'label',textField: 'value',data: [{
						label: '',value: ''},{label: '0',value: '未审核'},{label: '1',value: '已审核'}]" />
			   <!--  <a href="javascript:void(0)" id="queryBillBtn" class="linkbutton" data-options="iconCls:'chis-query'" onclick="queryBill()">查询</a>&nbsp;
			    <a href="javascript:void(0)" id="queryBillBtn" class="linkbutton" data-options="iconCls:'chis-close'" onclick="closesonOverAdjust()">关闭</a> -->
					 <button class="btn btn-primary btn-sm" id="queryBillBtn" type="button" onclick="queryBill()" style="width:70px;padding-bottom: 3px; padding-top: 3px;">查&nbsp;询</button>
					<button class="btn btn-danger btn-sm" id="queryBillBtn" type="button" onclick="closesonOverAdjust()" style="width:70px;padding-bottom: 3px; padding-top: 3px;">关&nbsp;闭</button>
			</form>
			</div>
			<table  id="queryOverBillWindow"></table>
		</div>
	</div>
</div>
</body>
</html>