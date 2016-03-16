<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<title>采购计划</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
</style>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/drugstore/planStock.js">
</script>
</head>
<body style="overflow: hidden; height: 100%;width:1200px">
		<div style="margin-top: 5px; background-color: #FFFFFF; width: 100%; height: 40px;font-size:12px">
			药品检索:<input id="medicine" type="text" style="width: 150px;margin-top: 10px" placeholder="输入药品名称/助记符" name="medicine" data-options="" onkeyup="medchoose()" /> 
			<button type="button" id="selectItemsBtn" class="btn btn-primary btn-sm" onclick="medplanChoose()" style="margin-top:-3px" >选择药品</button>
			<button type="button" class="btn btn-danger btn-sm" onclick="clearPlan()" style="margin-top:-3px" >清   空</button>
			<button type="button" class="btn btn-info btn-sm" onclick="savePlan()" style="margin-top:-3px" >保   存</button>
			<button type="button" class="btn btn-success btn-sm" id="creatPlanBtn"  onclick="creatPlan()" disabled="disabled" style="margin-top:-3px" >确认生成计划单</button>	
			<button type="button" class="btn btn-warning btn-sm" onclick="historyPlan()" style="margin-top:-3px" >历史计划</button>
		</div> 
		<form id='planForm' style="width:1200px">
			<fieldset style="margin-top: 5px; margin-bottom: 10px; background-color: #FFFFFF;">
				<legend></legend>
				<table style="font-size:12px;width:1150px">
					<tr>
						<td style="width:250px">订购单号:<input id="uuidplan" type="text"
							style="width: 145px;" name="uuid" data-options="" disabled="disabled"/></td>
						<td style="width:250px" align='right'><font style="font-family: '宋体', Simsun;">&nbsp;&nbsp;订购科室</font>:
						<input
							id="orgidApply" class="combobox" style="width: 150px;"
							name="orgidApply" 
							data-options="valueField:'orgid',textField:'orgname'"/></td>
						<td style="width:250px"  align="right"><font style="font-family: '宋体', Simsun;">&nbsp;&nbsp;供应商</font>:
						
						<input	class="combobox" style="width: 150px" 	
										id="entid"
										name="orgidService"
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
					    <td  style="padding-left:50px" align='left'>订购总价(元):<input id="total" name="amountTotal" style="width:150px" disabled="disabled"></input></td>
					</tr>
					<tr>
						<td>订购日期:<input id="policymakDate" class="datebox" style="width: 145px;"
							name="policymakDate" disabled="disabled"/></td>
						 <td align='right' >计划订购人:
						 <input id="policymakeUserid" type="text"
							style="width: 150px;" name="policymakeUserid" value="${userId}" data-options="" disabled="disabled"/></td>
						 <!-- <select id="policymakeUserid" class="combobox" style="width: 150px;" name="mePlHdBean.policymakeUserid" data-options="editable:false,disabled:true,hasDownArrow:false" >
								<option value="demo001">demo</option>
						</select>
						 -->
						</td>
						<td align="right" >计划描述:<input id="description" name="description" class="text" style="width:150px"/></td>
					    <td align='left'></td>
					</tr>
				</table>
			</fieldset>
		</form>
		<table id="plandatagrid"></table>
		<div id="medChooseplanDlg" class="dialog" title="药品选择" data-options="closed:true" style="width: 915px; height: 376px;">
				药品检索:<input id="inputStr" type="text" name="" placeholder="输入药品名称/助记符" style="width:150px">
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
   			  <button type="button" class="btn btn-primary btn-xs" onclick="medeplansearch()" style="margin-top:-3px;width:50px" >查  询</button>
			  <button type="button" class="btn btn-danger btn-xs" onclick="medeplanclose()" style="margin-top:-3px;width:50px">关  闭</button>
			<table id="meddetailplanDatagrid"></table>
		</div>
		<!-- 历史计划Dlg -->
		<div id="historyplanDlg" class="dialog" title="历史计划" data-options="closed:true" style="width: 900px; height: 400px; padding: 5px">
			计划单号:<input id="uuid" type="text" style="width: 100px;" name="" data-options="" /> 
			订购科室:
			<input id="orgidApply1" class="combobox" style="width: 100px;" name=""
							data-options="valueField:'orgid',textField:'orgname'"/></td>
		  	订购日期:<input id="policymakDate1" class="datebox" style="width: 100px;" name="" data-options="editable:false"/>至<input id="policymakDate2" class="datebox" style="width: 100px;" name="" data-options="editable:false"/>
                  <button type="button" class="btn btn-primary btn-xs" onclick="histroyplansearch()" style="width:50px" >查  询</button>
  			  	  <button type="button" class="btn btn-danger btn-xs" onclick="histroyplanclose()" style="width:50px">关  闭</button>
		<table id="historyplanDatagrid"></table>   
		</div>
</body>
</html>
