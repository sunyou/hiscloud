<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<!-- 公共查询人员信息页面 -->
<title>药品信息维护</title>


<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/easyui/plugins/jquery.form.js"></script>
<script type="text/javascript" src="${ctx}/js/easyui/jquery.validate.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="/chis/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/inventory/medStand.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>

 <style type="text/css"> 
.validatebox-text, textarea{ 
   height:20px;
   line-height:20px;
   border:1px solid #DDDDDD;
}
</style> 
</head>
<body style="overflow: hidden;">
<input type="hidden" id="itemid" name="itemid"/>

	<table id="dg"></table>
	<div id="tb" style="height: auto;">
	<!-- 
	        药品检索<input class="validatebox" id="patientName" type="text" style="height: 25px; width: 100px"> 
	            药品检索<input class="combogrid" id="patientName" style="height: 25px; width: 100px">
	       医嘱分类<input class="combogrid" id="drugClassification" style="height: 25px; width: 100px">         
	-->            
	            药品检索<input class="validatebox" id="patientName" type="text" style="height: 25px; width: 100px">
		医嘱分类<input class="combobox" id="drugClassification" style="height: 25px; width: 100px"
		             data-options="
							url:'${ctx}/purchaseManage/cateList.ajax',
							mode:'remote',
							editable:false,
							valueField:'ordCateid',
							textField:'ordCatename',
							pagination:false,
							panelHeight:'auto'">
		启用<input   type="radio" style="width: 30px;height:15px;" name="radio" value="1">
		禁用<input   type="radio" style=" width: 30px;height:15px;" name="radio" value="0">&nbsp;&nbsp;
		<button onclick="javascript:findData()"  class="btn btn-primary btn-xs" type="button" style="height: 26px">&nbsp;查&nbsp;询&nbsp;</button>&nbsp;
	    <button onclick="javascript:createItem()" class="btn btn-success btn-xs" type="button" style="height: 26px">&nbsp;新&nbsp;增&nbsp;</button>&nbsp; 
	    <button onclick="javascript:updateItem()" class="btn btn-info btn-xs" type="button" style="height: 26px">&nbsp;修&nbsp;改&nbsp;</button> 
		<!--  
	    <a onclick="javascript:findData()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a>
	    <a href="javascript:createItem()" class="linkbutton" data-options="iconCls:'chis-add'">新增药品</a> 
	    <a href="javascript:updateItem()" class="linkbutton" data-options="iconCls:'chis-edit'">修改药品</a> 
	    -->
	  <!--    <a href="javascript:importItem()" class="linkbutton" >导入药品目录</a> 
	    <a href="javascript:importItemInfo()" class="linkbutton" >导入药品信息</a>   -->
	</div>
	<div id="dlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
		style="width: 675px; height: auto; padding: 15px;top:50px;">
			<form id="createForm" method="post" action="${ctx}/infoManage/medStandCtrl.ajax?BLHMI=saveItemMedStand">
			 <input id="itemid1" name="itemid" style="display: none;"/> 
			 <input id="ordItemid" name="ordItemid" type="hidden"/>
			 <table cellpadding="4" border="1" cellspacing="0"  bordercolor="#0099FF" style="width:630;font-size:12px;">
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">药品名称：</td>
				<td align="center" style="width: 120px;">
				    <input class="validatebox" type="text" id="itemName" name="itemname" style="width: 115px;height:20px;"
				           data-options="required:true"/>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">化学名称：</td>
				<td align="center" style="width: 120px;">
				    <input  class="validatebox" type="text" id="itemChemistryName" name="itemChemistryName" style="width: 115px;height:20px;" />
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">通用名称：</td>
				<td align="center" style="width: 120px;">
				    <input  class="validatebox" type="text" id="itemCommonName" name="itemCommonName" style="width: 115px;height:20px;" />
				</td>
				</tr>
				<tr style="height:20px;">
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">助&nbsp;记&nbsp;码：</td>
				<td align="center" style="width: 120px;">
				     <input class="validatebox" type="text" id="inputstr" name="inputstr" style="width:115px;height:20px;" />
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">医嘱分类：</td>
				<td align="center" style="width: 120px;">
				      <input class="combobox" type="text" id="ordCateid" name="ordCateid" style="width: 115px;height:20px;"
				              data-options="
						                url:'${ctx}/purchaseManage/cateList.ajax',
										mode:'remote',
									    editable:false,
									    valueField:'ordCateid',
										textField:'ordCatename',
										
										pagination:false,
										panelHeight:'auto',
										required:true"/>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">药品剂型：</td>
			    <td align="center" style="width: 120px;">
				      <input class="combobox" style="width: 115px;height:20px;"
				              id="itemDoseid"
				              name="itemDoseid"
				              data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=item_dose',
										mode:'remote',
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"/>
				</td>
				</tr>
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">基本单位：</td>
				<td align="center" style="width: 120px;">
				      <select class="combobox" type="text" id="basicUnit" name="basicUnit" style="width: 115px;height:20px;" editable="true"/>
				            <option value="片">片</option>
				            <option value="瓶">粒</option>
				            <option value="瓶">瓶</option>
				            <option value="盒">盒</option>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">剂量单位：</td>
				<td align="center" style="width: 120px;">
				      <select class="combobox" type="text" id="medUnit" name="medunit" style="width: 115px;height:20px;" editable="true"/>				       
				            <option value="g">g</option>
				            <option value="条">条</option>
				            <option value="次">次</option>
				            <option value="ml">ml</option>
				            <option value="万单位">万单位</option>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">剂量系数：</td>
				<td align="center" style="width: 120px;">
				     <input class="validatebox" type="text" id="medFactor"  style="width: 115px;height:20px;"/>
				</td>
				</tr>
				<tr>
				<!-- <td bgcolor="#D7D7D7" align="right" style="width: 65px;">药品用法：</td>
				url:'/chis/medStand/medStandCtrl.htm?BLHMI=dictionaryList&dto.type=expenseCategory', -->
				<!-- <td align="center" style="width: 120px;">
				       <input class="combobox" type="text" id="itemUsageid" name="dto.itemMedStand.itemUsageid" style="width: 115px;height:20px;"				              
				              data-options="
										url:'/chis/medStand/medStandCtrl.htm?BLHMI=dictionaryList&dto.type=usagename',
										mode:'remote',
										editable:false,
										valueField:'id',
										textField:'text',
										pagination:false,
										panelHeight:'auto'"/>
				</td>	 -->			
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">发票分类：</td>	
				<td align="center" style="width: 120px;">
				       <input class="combobox" type="text" name="chargeCateid" style="width: 115px;height:20px;"
				              id="chargeCateid"
				              data-options="
										url:'${ctx}/infoManage/chargeList.ajax',
										mode:'remote',
										editable:false,
										valueField:'chargeCateid',
										textField:'chargeCatename',
										pagination:false,
										panelHeight:'auto'"/>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">药理类别：</td>
				<td align="center" style="width: 120px;">
				       <input class="combobox" type="text" name="pharmacyCateTwosubid" style="width: 115px;height:20px;"
				              id="pharmacycate"
				              data-options="
										url:'${ctx}/infoManage/pharmacyList.ajax',
										mode:'remote',
										editable:false,
										valueField:'pharmacyCateid',
										textField:'pharmacyCatename',
										pagination:false,
										panelHeight:'auto',
										required:true"/>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">药品规格：</td>
				<td align="center" style="width: 120px;">
				      <input class="validatebox" type="text" id="itemSpec" name="itemSpec" style="width: 115px;height:20px;"/>
				</td>
				</tr>
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">批发价：</td>
				<td align="center" style="width: 120px;">
				      <input class="validatebox" type="text" style="width: 115px;height:20px;"
				             id="wholesalesPrice"  />
				</td>
				
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">零售价：</td>
				<td align="center" style="width: 120px;">
				      <input class="validatebox" type="text" style="width: 115px;height:20px;"
				             id="salesPrice"  />
				</td>
				
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">零售单位：</td>
				<td align="center" style="width: 120px;">
				      <select class="combobox" type="text" style="width: 115px;height:20px;" editable="true"
				             id="dispensUnit" name="dispensUnit" />
				             <option value="瓶">瓶</option>
				             <option value="盒">盒</option>
				             <option value="箱">箱</option>
				</td>
				</tr>
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">零售系数：</td>
				<td align="center" style="width: 120px;"><input class="validatebox" type="text" id="dispensFacotr" style="width: 115px;height:20px;" /></td>
				
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">入库单位：</td>
				<td align="center" style="width: 120px;">
				<select class="combobox" type="text" id="warehousUnit" name="warehousUnit" style="width: 115px;height:20px;" editable="true"/>
				             <option value="瓶">瓶</option>
				             <option value="盒">盒</option>
				             <option value="箱">箱</option>
				</td>
				
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">入库系数：</td>
				<td align="center" style="width: 120px;"><input class="validatebox" type="text" id="warehousFacotr"  type="text" style="width: 115px;height:20px;"/></td>
				</tr>
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">创建时间：</td>
				<td><div align="center" style="width: 120px;">
				        <input class="datebox" type="text" style="width: 115px;height:20px;" 
				               id="createTime"
				               />
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">修改时间：</td>
				<td><div align="center" style="width: 120px;">
				     <input class="datebox" type="text" 
				             id="updateTime" name="updateTime" style="width: 115px;height:20px;" />
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">供应商：</td>
				<td><div align="center" style="width: 120px;">
				     <input class="combobox" type="text" 
				     id="entIdSupplier" name="entidSupplier" style="width: 115px;height:20px;" 
				         data-options="										
								url:'${ctx}/purchaseManage/businessmanCtrl.ajax?issupplier=1',
								mode:'remote',
								editable:false,
								valueField:'entid',
								textField:'entname',
								pagination:false,
								panelHeight:'auto'"/>
				</td>
				</tr>
				<tr>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">生产厂家：</td>
				<!--  url:'/chis/medStand/medStandCtrl.htm?BLHMI=entList',-->
				<td  align="center">
				      <input class="combobox" type="text" style="width: 115px;height:20px;"
				             id="entidProducer"
				             name="entidProducer"
				             data-options="										
										url:'${ctx}/purchaseManage/businessmanCtrl.ajax?isproducer=1',
										mode:'remote',
										editable:false,
										valueField:'entid',
										textField:'entname',
										pagination:false,
										panelHeight:'auto'" />
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 85px;">国家基本药物：</td>
				<td align="center">
				       <select class="combobox" type="text" id="nationaldrugs" 
				                        name="nationaldrugs" style="width: 115px;height:20px;" editable="false"/>
				           <option value="1">是</option>
				           <option value="0">否</option>
				</td>
				<td bgcolor="#D7D7D7" align="right" style="width: 65px;">药品状态：</td>
				<td><input  type="radio" style="width: 30px;height:15px;" id="radio1" name="drugRadio" value="1"/>启用
				    <input  type="radio" style="width: 30px;height:15px;" id="radio2" name="drugRadio" value="0"/>禁用
				</td>
			</tr>
			</table>
			</form>
			 <div id="createDlg-buttons" style="text-align: center;">
			     <button onclick="javascript:clearItem()"  id="clear" class="btn btn-warning btn-sm" type="button">清空</button>
			     <button onclick="javascript:saveItem()"  id="save" class="btn btn-success btn-sm" type="button">保存</button>
	             <button onclick="javascript:update()" id="update" class="btn btn-success btn-sm"  type="button">保存</button>
	             <button onclick="javascript:myclose()" id="close" class="btn btn-danger btn-sm" type="button">关闭</button>
			 <!-- 
			     <a href="javascript:clearItem()"  id="clear" class="linkbutton" data-options="iconCls:'chis-subtract'">清空</a>
			     <a href="javascript:saveItem()"  id="save" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>
	             <a href="javascript:update()" id="update" class="linkbutton"  data-options="iconCls:'chis-save'">保存</a>
	             <a href="javascript:myclose()" id="close" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a>
	           -->
	        </div> 
	</div>
	
<!-- <div id="updateDg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#updateDg-buttons'"
		style="width: 675px; height: auto; padding: 15px;top:50px;">
			<form id="updateForm" method="post">
			  
			 <table cellpadding="4" border="1" cellspacing="0"  bordercolor="#0099FF" style="width:630;font-size:12px;">
			 
			 </table>
			 </form>
			 <div id="updateDg-buttons" style="text-align: center;">
	         	<a href="javascript:saveModify()" class="linkbutton">保存</a>
	        	<a href="javascript:closeModify()" class="linkbutton">关闭</a>
	        </div> 
	</div>
	 -->	
	<div id="inportDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#inportDlg-buttons'"
		style="width: 780px; height: auto; padding: 10px;top:80px; ">
		<form id="inportForm" method="post"> 
	      		  药品检索<input class="validatebox" type="text" style="height: 25px; width: 100px">
				 药品分类<input class="combobox"   type="text" style="height: 25px; width: 100px">
	             <a href="javascript:findItem()"  class="linkbutton" data-options="iconCls:'chis-query'">查询</a>
	             <a href="javascript:inItem()" class="linkbutton" data-options="iconCls:'chis-import'">确定导入</a>
	             <table id="inportdg"></table> 
		</form> 
	</div> 
</body>
</html>
