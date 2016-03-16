<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<!-- 公共查询人员信息页面 -->
<title>库存调整</title>


<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/drugstore/inventoryAdjustment.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
</head>
<body style="overflow: hidden;font-size: 12px">
<input id="policymakDateHidden" type="text" hidden="true" value="${adjustDate}">
<input id="orgidSession" type="text" hidden="true" value="${orgName}">
<input id="useridSession" type="text" hidden="true" value="${userId}">
<div>	
	<div id="tb" style="margin-bottom:10px;background-color: #FFFFFF;">
	<!--  
	    <a href="javascript:checkAdjustment()"  id="history" class="linkbutton" data-options="iconCls:'chis-history'">调整历史记录</a>&nbsp&nbsp
	    <a href="javascript:checkDrug()" id="checkDrug" class="linkbutton" data-options="iconCls:'chis-add'">添加药品</a> &nbsp&nbsp
	    <a href="javascript:clean()" class="linkbutton" data-options="iconCls:'chis-subtract'">清空</a> &nbsp&nbsp
	  <!--  <a href="javascript:save()" class="linkbutton" >保存</a>  
	    <a href="javascript:save()" id="save" class="linkbutton" data-options="iconCls:'chis-right'">确认调整</a> 
	  -->
	    <button onclick="checkAdjustment()"  id="history" class="btn btn-warning btn-sm" type="button">调整记录</button>&nbsp;&nbsp;
	    <button onclick="checkDrug()" id="checkDrug" class="btn btn-primary btn-sm" type="button">添加药品</button>&nbsp;&nbsp;
	    <button onclick="clean()" class="btn btn-danger btn-sm" type="button">清&nbsp;空</button>&nbsp;&nbsp;
	    <button onclick="save()" id="save" class="btn btn-success btn-sm" type="button">确认调整</button>
	</div>
	<fieldset style="background-color: #FFFFFF;height:23px;">
			<form id="checkForm" name="checkForm" action="post">
				<table  id="adjust" style="width:800px;margin-top:5px"  border="0">				  
				        <input id="adjustcurid" type="text" style="display: none;">
				    <!--    
					 调整单号<input class="validatebox" id="sheetId" name="sheetId1" type="text" style="height: 25px; width: 100px"
					             data-options="required:true" disabled="disabled">&nbsp&nbsp&nbsp&nbsp
					--> 
				            调整人:<input class="validatebox" id="adjustcurUserid" name="adjustcurUserid" type="text" style="height: 25px; width: 100px"
					             data-options="required:true" disabled="disabled">&nbsp;&nbsp;&nbsp;&nbsp; 
			  		调整部门:<input class="combobox"   id="departmentId" type="text" style="height: 25px; width: 100px"
			  		             data-options="
										url:'${ctx}/purchaseManage/orgList.ajax?grade=1',
										mode:'remote',
										editable:false,
										valueField:'orgid',
										textField:'orgname',
										pagination:false,
										panelHeight:'auto',
										disabled:'true',
										required:true   ">&nbsp;&nbsp;&nbsp;&nbsp;
			 <!--   调整日期<input class="datebox" id="adjustTime" type="text" style="height: 25px; width: 100px">  -->
			        调整日期:<input id="adjustTime" type="text" style="height: 25px; width: 100px" 
			                                   class="datebox" data-options="required:true">&nbsp;&nbsp;&nbsp;&nbsp;
			       调整原因:<input class="validatebox" id="adjustReason" type="text" style="height: 25px; width: 100px">						 
			  	 </table>
			</form>
	</fieldset>
	<div style="padding-top: 10px">
		<table id="dg"></table>
	</div>
	
	<div id="dlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#dlg-buttons'"
		style="width: 780px; height: auto; padding: 10px;top:80px; ">
		<form id="searchForm" method="post"> 
	      		<!--   药品检索<input class="combogrid"  type="text" id="drugName" style="height: 25px; width: 100px"> 
	      		       药品分类     url:'/chis/medStand/medStandCtrl.htm?BLHMI=categoryList&dto.flag=1',-->
	      		 药品检索<input class="validatebox"  type="text" id="drugName" style="height: 25px; width: 100px">
			  	 药品分类<input class="combobox"   type="text" id="ordCateid" style="height: 25px; width: 100px"
			  	             data-options="
										url:'${ctx}/purchaseManage/cateList.ajax',
										mode:'remote',
										editable:false,
										valueField:'ordCateid',
										textField:'ordCatename',
										pagination:false,
										panelHeight:'auto'"/>&nbsp;&nbsp;
			<!-- 
	             <a href="javascript:findItem()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a>
	            <!-- <a href="javascript:determineItem()" class="linkbutton" >确定</a> 
	             <a href="javascript:myclose()" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a>
	         -->  
	             <button onclick="findItem()"  class="btn btn-primary btn-sm" type="button">查询</button>&nbsp;
	             <button onclick="myclose()" class="btn btn-danger btn-sm" type="button">关闭</button>   
	             <table id="searchdg"></table>
		</form> 
		
	</div>
 
  <!--
  	<div id="dlg" title="Modal Window"
		style="width: 780px; height: auto; padding: 10px;top:80px; ">
	      		  药品检索<input class="validatebox" type="text" style="height: 25px; width: 100px">
			  	 药品分类<input class="combobox"   type="text" style="height: 25px; width: 100px">
	             <a href="javascript:findItem()"  class="linkbutton" >查询</a>
	             <a href="javascript:inItem()" class="linkbutton" >确定</a>
	             <a href="javascript:myclose()" class="linkbutton" >关闭</a>	         		
	</div>
	 <table id="searchdg"></table> 
-->	 
	 
  	
	<div id="adjustmentDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#adjustmentDlg-buttons'"
		style="width: 800px; height: auto; padding: 10px;top:80px; ">
		<form id="adjustmentForm" method="post"> 
	      	<!-- 	 调整单号<input class="validatebox" id="rowno" type="text" style="height: 25px; width: 100px" disabled="disabled"> -->
			  	 调整部门<input class="combobox"   id="orgid" type="text" style="height: 25px; width: 100px"
			  	             data-options="
										url:'${ctx}/purchaseManage/orgList.ajax?grade=1',
										mode:'remote',
										editable:false,
										valueField:'orgid',
										textField:'orgname',
										pagination:false,
										panelHeight:'auto',
										disabled:'true'">
			  	 调整日期<input class="datebox"   id="adjustStartTime" data-options="editable:false" style="height: 25px; width: 90px">
			  	 至<input class="datebox"   id="adjustEndTime" data-options="editable:false" style="height: 25px; width: 90px">&nbsp;
	     <!-- 
	             <a href="javascript:findAdjustSheetItem()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a>
	             <a href="javascript:insertAdjustSheetItem()" class="linkbutton" data-options="iconCls:'chis-confirm'">确定</a>
	             <a href="javascript:myclose1()" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a>
	       -->
	             <button onclick="findAdjustSheetItem()"  class="btn btn-primary btn-sm" type="button">查询</button>&nbsp;
	             <button onclick="insertAdjustSheetItem()" class="btn btn-success btn-sm" type="button">确定</button>&nbsp;
	             <button onclick="myclose1()" class="btn btn-danger btn-sm" type="button">关闭</button>
	             <table id="adjustmentdg"></table> 
		</form> 
	</div>
</body>
</html>
