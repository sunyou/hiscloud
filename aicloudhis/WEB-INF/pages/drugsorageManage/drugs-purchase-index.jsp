<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<title>采购管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc${ctx}/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
</style>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/drugstore/stockMgr.js">
</script>
</head>
<body style="overflow: hidden; height: 100%; width:1200px">
	<div style="margin-top: 5px; height: 40px; background-color: #FFFFFF;font-size: 12px;">
		药品检索:<input id="medicine" type="text" style="width: 150px;margin-top: 10px;" placeholder="输入药品名称/助记符" name="medicine" data-options="" onkeyup="medChoose()" /> 
		<button type="button" class="btn btn-primary btn-sm" id="selectItemsBtn" onclick="medpurChoose()" style="margin-top:-3px" >选择药品</button>
		<button type="button" class="btn btn-info btn-sm" onclick="planQuote()" style="margin-top:-3px;background-color:#20b2aa;border-color:#20b2aa;" >引用计划单</button>
		<button type="button" class="btn btn-danger btn-sm" onclick="clearpur()" style="margin-top:-3px" >清   空</button>
		<button type="button" class="btn btn-info btn-sm" onclick="medpurSave()" style="margin-top:-3px" >保   存</button>
		<button type="button" class="btn btn-success btn-sm" id="creatPurBtn" onclick="creatPur()" disabled="disabled" style="margin-top:-3px" >确认采购</button>	
		<button type="button" class="btn btn-warning btn-sm" onclick="historyPur()" style="margin-top:-3px" >采购记录</button>		
	</div>
	<form id="mePurForm">
		<fieldset style="background-color: #FFFFFF; margin-top: 5px; margin-bottom: 10px;">
			<legend></legend>
			<input id="total" type="hidden" name="amountTotal" ></input>
				<table style="font-size: 12px;width:1150px"> 
					<tr>
						<td style='width: 200px;'>采购单号:<input id="uuid" type="text" style="width: 145px;" name="" data-options="" disabled="disabled" /></td>
						<td align='right' style='width: 250px;padding-right:100px'><font style="font-family: '宋体', Simsun;">&nbsp;&nbsp;供应商</font>:
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
						<td align='left'  style='width: 250px;'>采购科室:
						<input id="purchasecheckOrgid" class="combobox" name="purchasecheckOrgid" style="width: 157px;"
							data-options="valueField:'orgid',textField:'orgname'"/></td>
						<td align='left'  style='width: 250px;'>制单人:
						
						 <input id="purchasemakeUserid" type="text"
							style="width: 150px;" name="purchasemakeUserid" value="${userId}" data-options="" disabled="disabled"/></td>
						 <!-- <select id="policymakeUserid" class="combobox" style="width: 150px;" name="mePlHdBean.policymakeUserid" data-options="editable:false,disabled:true,hasDownArrow:false" >
								<option value="demo001">demo</option>
						</select>
						 -->
					</tr>
					<tr>
						<td >制单日期:<input id="purchasemakeDate" class="datebox" style="width: 145px;" name="purchasemakeDate" disabled="disabled"/></td>
						<td align='right' style='padding-right:100px'>采购描述:<input id="purchaseDescribe" class="text" style="width: 145px;"name="purchasename" /></td>
					</tr>
				<input id="uuidPl" class="text" type="hidden" name="uuidPl">
			</table>
	</fieldset>
	</form>
	<table id="medDg"></table>
	<!--药品选择Dlg  -->
	<div id="medPurChooseDlg" class="dialog" title="药品选择" data-options="closed:true" style="width: 905px; height: 376px;">
			药品检索:<input id="inputStr" type="text" placeholder="输入药品名称/助记符"  style="width: 150px;" name="" data-options="" />
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
			<button type="button" class="btn btn-primary btn-xs" onclick="medetailpursearch()" style="width:50px">查  询</button>
			<button type="button" class="btn btn-danger btn-xs" onclick="medetailpurclose()" style="width:50px">关  闭</button>
		<table id="meddetailpurDatagrid"></table>
	</div>
	<!-- 引用计划单Dlg -->
	<div id="planQuoteDlg" class="dialog" title="引用计划单" data-options="closed:true" style="width: 900px; height: 400px; padding: 10px">
		计划单号:<input id="uuidpl" type="text" style="width: 100px;" name="uuidpl" data-options="" /> 
		订购科室:
		<input id="orgidApply" class="combobox" style="width: 100px;" name=""
							data-options="valueField:'orgid',textField:'orgname'"/></td>
	  	订购日期:<input id="policymakDate1" class="datebox" style="width: 100px;" name="" data-options="editable:false"/>至<input id="policymakDate2" class="datebox" style="width: 100px;" name="" data-options="editable:false"/>
   			  <button type="button" class="btn btn-primary btn-xs" onclick="planQuoteserch()" style="width:50px" >查  询</button>
  			  <button type="button" class="btn btn-success btn-xs"  onclick="planQuoteconfirm()" style="width:50px" >确  定</button>
			  <button type="button" class="btn btn-danger btn-xs" onclick="planQuoteclose()" style="width:50px">关  闭</button>
	<table id="planQuoteDatagrid"></table>   
	</div>
	<!-- 采购记录Dlg -->
	<div id="historyPurDlg" class="dialog" title="采购记录" style="width:850px; height:385px;" data-options="closed:true">
	<form id="historyPurForm">
		<span style="margin-left: 5px;">采购单号：&nbsp;</span><input id="purchaseid_s"/>
		<span>采购日期：&nbsp;</span><input id="purStartDate_s" class="datebox" data-options="editable:false"/>
		<span>至&nbsp;</span><input id="purEndDate_s" class="datebox" data-options="editable:false"/>
		<button type="button" class="btn btn-primary btn-xs" onclick="hisPursearch()" style="width:50px" >查  询</button>
	    <button type="button" class="btn btn-danger btn-xs " onclick="hisPurclose()" style="width:50px">关  闭</button>		
	</form>
	<div style="margin-top:5px;"></div>
	<table id="hisPurDatagrid"></table>
</div>
</body>
</html>
