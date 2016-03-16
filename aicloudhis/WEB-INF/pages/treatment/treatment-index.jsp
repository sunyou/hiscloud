<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>诊疗管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/doctorworkstation/treatmentMgr.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/doctorworkstation/doctorTemplate.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/PYjm.js"></script>
<style type="text/css">
.pagination span {
    font-size: 11px;
}
</style>    
</head>
<body style="background: white;">
	<div id="doctorTemplateDiv" class="div" style="background:white;position: absolute; left: 0px; top: 0px; width: 310px; height: 100%; display: none">
		 <div style="width: 310px; height: 35%;overflow:auto;">
		 	<ul id="doctorTemplateTree" class="tree"></ul>
		 </div>
		 <div id="doctorTemplate" style="width: 310px;height: 65%;overflow:auto;">
		 	
		 </div>
	</div>
	<div id="dlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
		style="width: 750px; height: auto; padding: 3px;">
			<form id="createForm" method="post">
			 <input type="hidden" id="patientid" name="patientid">
			 <input type="hidden" id="inputstr" name="inputstr">
			 <input type="hidden" id="createDatetime" name="createDatetime">
				  <fieldset style="width: 710px;">
				    <legend>基本信息</legend>
					  <table cellpadding="2" border="0" cellspacing="3" style="font-size:12px;width: 700px;">
					  	<tr>
					  	
						    <td align="right" style="width: 50px;"><font color="red">姓名:</font></td>
						 	<td align="center" style="width: 100px;"><input class="validatebox" type="text" id="patientName" name="patientName" style="width: 90px;" data-options="required:true" onblur="replace(this);ename();" onchange="illegalChar(this)"/></td>
						    <td align="right" style="width: 65px;"><font>姓名拼音:</font></td>
						    <td align="center" style="width: 100px;"><input class="validatebox" type="text" id="patientEname" name="patientEname" style="width: 90px;" readonly="readonly"/></td>
							<td align="center" style=" width: 65px;"><font color="red">移动电话:</font></td>
							<td align="center" style=" width: 100px;"><input class="numberbox" type="text" id="patientTelephone" name="patientTelephone" style="width: 150px;" data-options="required:true"/></td>
							<td rowspan="5" colspan="2" align="center" >
								<img src="${ctx}/images/wz.jpg" id="tp" style="width: 106px; height: 100px; border: 1px solid #dddddd;" />
							</td>
						</tr>
						<tr>
							<td align="right" style="width: 50px;"><font>民族:</font></td>
						    <td align="center" style="width: 100px;"><input	class="combobox" id="nationalityid" name="nationalityid"style="width: 90px;"
										data-options=" url:'${ctx}/dict/getDictContentList.ajax?dictName=nation',
										mode:'remote',editable:false,valueField:'value',textField:'description',pagination:false,panelHeight:'auto'"></td>
							 <td align="right" style="width: 65px;"><font>证件类型:</font></td>
							 <td align="center" style="width: 100px;"><input	class="combobox" 	
										id="idcardTypeid"
										style="width: 90px;"
										name="idcardTypeid"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=certificates',
										mode:'remote',
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						
							<td align="right" style="width: 65px;"><font>证件号码:</font></td>
                    	    <td align="center"  colspan="1"><input class="validatebox" type="text" id="icard" name="icard" onblur="upperCase()" onkeydown="javascript:if (event.keyCode==13) upperCase();" style="width: 150px;"/></td>
						</tr>
						<tr>
						    	<td align="right" style="width: 50px;"><font>性别:</font></td>
						    	<td align="center" style="width: 100px;"><input	class="combobox" id="patientSexId"name="patientSexId"
											style="width: 90px;"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=gender',
											mode:'remote',
											onSelect:changeImg,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'"></td>
								<input type="hidden" id="patientSename" name="patientSename"/>
								<td align="right" style="width: 65px;"><font>年龄:</font></td>
								<td align="center" style="width: 100px;"><input class="numberbox" type="text" id="age"  style="width: 90px;" onchange="createBirthday();"/></td>
							    <td align="right" style="width: 65px;"><font color="red"><font>出生日期:</font></font></td>
							    <td align="center" style="width: 100px;"><input class="datebox" type="text" id="birthDate" name="birthDate" style="width: 150px;" data-options="required:true,editable:false,onSelect:checkBirthDay"/></td>
					    </tr>
						<tr>
						    <td align="right" style="width: 50px;"><font>婚否:</font></td>
						    <td align="center" style="width: 100px;"><input	class="combobox" 	
										id="marriedid"
										name="marriedid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=marriage',
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto'"></td>
							<td align="right" style="width: 65px;"><font color="red"><font>患者类型:</font></font></td>
							<td align="center" style="width: 100px;"><input	class="combobox" id="patientIdentityid"
										name="patientIdentityid" style="width: 90px;"name="dto.registernumber.patientIdentityid" data-options="valueField:'patientIdentityid',textField:'patientIdentityname',editable:false,required:true,onSelect:setIdentityname"/></td></td>
							<input type="hidden" id="patientIdentityname" name="patientIdentityname">
							 <td align="right" style="width: 65px;"><font>职业:</font></td>
							 <td align="center" style="width: 100px;"><input	class="combobox" 	
										id="occupationid"
										name="occupationid"
										style="width: 150px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=job',
										mode:'remote',
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						</tr>
					</table>
				</fieldset>
					<table  style="width:700px;font-size:12px;">
						<tr>
						    <td style="width: 233px;"></td>
							<td align="left"><font>家庭信息</font><input class="accordion-collapse accordion-expand" id="familyCheck" type="checkbox"  style="width: 20px;" value="0" ></td> 
							<td align="right"><font>联系信息</font><input  class="accordion-collapse accordion-expand"  id="contactCheck" type="checkbox"  style="width: 20px;" value="0"></td>    
						    <td style="width: 220px;"></td>
						</tr>	
					</table>
			<div id="family" style="display:none" value="0">
				 <fieldset style="width: 710px;">
				    <legend>家庭信息</legend>
					  <table cellpadding="2" border="0" cellspacing="3" style="width:700;font-size:12px;">	
						<tr>
						   	<td align="right" style="width: 65px;"><font>国家:</font></td>
						  	<td align="center" style="width: 100px;"><input	class="combobox" id="countryid" name="countryid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=country',
										onSelect:onSelectCountry,
										mode:'remote',
										valueField:'id',
										textField:'text',
										editable:false,
										pagination:false,
										panelHeight:'auto'"></td>
					     	<td align="right" style="width: 80px;"><font>省/直辖市&nbsp;:</font></td>
					     	<td align="center" style="width: 100px;"><input	class="combobox" 	id="provinCesid"
										name="provinCesid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=province', 
										onSelect:onSelectProvice,
										editable:false,
										mode:'remote',
										valueField:'id',
										textField:'text',
										pagination:false,
										panelHeight:'auto'"></td>
							<td align="right" style="width: 65px;"><font>市(地区):</font></td>
							<td align="center" style="width: 100px;"><input	class="combobox" 	id="cityid"
										name="cityid"
										style="width: 90px;"
										data-options="
									 	url:'${ctx}/dict/getDictContentList.ajax?dictName=city',
										onSelect:onSelectCity,
										mode:'remote',
										valueField:'id',
										editable:false,
										textField:'text',
										pagination:false,
										panelHeight:'auto'"></td>
						
							<td align="right" style="width: 65px;"><font>县/区:</font></td>
							<td align="center" style="width: 100px;"><input	class="combobox" 	id="cityaeraid"
										name="cityaeraid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=county',
										mode:'remote',
										valueField:'id',
										editable:false,
										textField:'text',
										pagination:false,
										panelHeight:'auto'"></td>
						</tr>
						<tr>
						 	<td align="right" style="width: 65px;"><font>详细信息:</font></td>
							<td align="center" colspan="3"><input type="text" class="validatebox" style="width: 280px;" id="streetinfo" name="streetinfo" onchange="illegalChar(this)"></td> 
							<td align="right" style="width: 65px;"><font>邮编:</font></td>
						    <td align="center" style="width: 100px;"><input class="validatebox" type="text" id="flPostcode" name="flPostcode" style="width: 90px;" /></td>
						
						</tr>
					</table>
				</fieldset>  
			</div>
			<div id="contact" style="display:none" value="0">
			 	<fieldset style="width: 710px;">
			      <legend>联系信息</legend>
				  <table cellpadding="1" border="0" cellspacing="1" style="width:700;font-size:12px;">
					  <!-- 	<tr>
					  	    <td align="right">工作单位:</td>
							<td colspan="2"><input type="text" class="validatebox" style="width: 180px;" id="entName" name="entName"></td>
							<td align="right">单位联系人:</td>
							<td><input class="validatebox" type="text" id="entContactor" name="entContactor" style="width: 90px;" /></td>
							<td align="right">单位联系人电话:</td>
							<td><input class="validatebox" type="text" id="entTelenum" name="entTelenum" style="width: 90px;" /></td>
						</tr>
						<tr>	
							<td align="right">单位地址:</td>
							<td colspan="2"><input class="validatebox" type="text" id="entAddr" name="entAddr" style="width: 180px;" /></td>
							<td align="right">单位邮编:</td>
				     		<td><input class="validatebox" type="text" id="entPostcode" name="entPostcode" style="width: 90px;" /></td>
							<td align="right">联系人名称:</td>
							<td><input class="validatebox" type="text"  id="ctName" name="ctName" style="width: 90px;" /></td>
						</tr> -->
						<tr style="height: 20px;">
							<td align="right" style="width: 90px;"><font>与联系人关系：</font></td>
							<td><input class="validatebox" type="text"  id="ctRoleid" name="ctRoleid" style="width: 90px;"  onchange="illegalChar(this)"/></td>
					 		<td align="right" style="width: 80px;"><font>联系人电话：</font></td>
						    <td><input class="validatebox" type="text"  id="ctElenum" name="ctElenum" style="width: 90px;" /></td>
					 		<td align="right" style="width: 80px;"><font>联系人地址：</font></td>
							<td align="left" colspan="2"><input class="validatebox" type="text"  id="ctAddr" name="ctAddr" style="width: 230px;" onchange="illegalChar(this)"/></td>
					 	</tr>
					</table>  
				</fieldset>  
				 
			</div>
			<div>
			   <fieldset style="width: 710px;">
				    <legend>备注信息</legend>
				    <font><lable style="margin-left:10px;height: 20px;"  >备注：</lable></font>
				   <!--  <input class="validatebox" type="text"  id="note" name="note" style="width: 650px;height: 20px;" /> -->
				   <textarea id="note" name="note" style="width:635px;height:35px;max-width: 635px;max-height: 35px; min-width: 635px;min-height: 35px;font-size: 12px;"></textarea>
				 </fieldset> 
			</div>
			</form>
			 <div id="createDlg-buttons" style="text-align: center;">
			    <button type="button" class="btn btn-success btn-sm" onclick="saveCreate();" style="width:70px;padding-bottom: 3px; padding-top: 3px;">保存</button>
			     <button type="button" class="btn btn-danger btn-sm" onclick="myclose();" style="width:70px;padding-bottom: 3px; padding-top: 3px;">关闭</button>
	         	<!-- <a href="javascript:saveCreate()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a> -->
	        	<!-- <a href="javascript:myclose()" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a> -->
	        </div> 
	    </div>
	<input id="hiddenLoginId" type="hidden" value="demo001"/>
	<input id="hiddenLoginName" type="hidden" value="demo"/>
	<input id="hiddenLoginHosId" type="hidden" value="demo"/>
	<input id="hiddenLoginHosName" type="hidden" value="云诊所"/>
	<input id="hiddenLoginLocId" type="hidden" value="demo001"/>
	<input id="hiddenLoginLocName" type="hidden" value="全科"/>
	<!-- <div id="registerInfo" class="dialog" title="预约" data-options="modal:true,closed:true,buttons:'#registerInfo-buttons'" style="width:700px;height:auto;">
		<table id="doclist"></table>
	</div> -->
	<div id="leftSide" style="width: 25%;height:100%;float:left" align="left">
		<div style="height: auto;margin-top: 10px;" id="poshytip">
			<a href="javascript:createPatient()" class="linkbutton" style="float: right; margin-left:3px;" data-options="iconCls:'chis-user',plain:true">登记</a>
			<!-- <a href="javascript:patRegister()" class="linkbutton" style="float: right; margin-left:3px;" data-options="iconCls:'icon-ok',plain:true">挂号</a> -->
			<a href="javascript:directTreatment()" class="linkbutton" style="float: right; margin-left:3px;" data-options="iconCls:'chis-right',plain:true">接诊</a> 
			<label style="font-size:15px; margin-left: 5px;">患者检索:</label>
	   		<select id="patientComboGrid" class="combogrid" style="width:100px" data-options="
		        panelWidth: 310,
		        panelHeight: 340,
		        hasDownArrow:false,
				idField: 'patientid',
				pagination: true,
				mode: 'remote',
				textField:'patientName',
				method:'post',
				 url: '${ctx}/patientManage/getPatientList.ajax',
				columns: [[
					{field:'patientid',title:'id',hidden:true},
					{field:'patientName',title:'姓名',width:94,align:'center'},
					{field:'patientTelephone',title:'移动电话',width:100,align:'center'},
					{field:'patientSename',title:'性别',width:50,align:'center'},
					{field:'age',title:'年龄',width:50,align:'center'}	
				]]
			">
			</select>
		</div> 
		<div style="margin-top:10px; margin-bottom: 5px">
<!-- 			<a href="javascript:void(0)" id="refresh" class="linkbutton" data-options="iconCls:'chis-refresh',plain:true" style="float: right">刷新</a>
-->			<label style="font-size:16px;margin-left: 0px;"><input id="wait" name="selectPatientType" type="radio" value="1" checked="checked"/>待接诊</label> 
			<label style="font-size:16px;margin-left: 0px;"><input id="treating" name="selectPatientType" type="radio" value="2" />已接诊</label> 
			<input id="begindate" type="text" style="width: 95px;" class="datebox" data-options=""></input>
			<a href="javascript:void(0)" id="treatsearchBtn" class="linkbutton" data-options="iconCls:'chis-query',plain:true" style="" onclick="treatsearch()" >查询</a>
		</div>
		<!-- <div style="margin-top:3px;">
			<label  style="height: 24px;font-size:13px;" ></label>
		</div> -->
		<!-- <div style="margin-top:5px;">
			<a href="javascript:nameQuery()" class="linkbutton" style="float: right; margin-left:3px;"  data-options="iconCls:'icon-search',plain:true">查询</a>
			<label style="font-size:15px; margin-left: 10px;" title="诊疗病人">接诊查询:</label>
			<input class="validatebox" id="patientName2" type="text" style="width: 150px;"onkeydown="entersearch()" />
		</div> -->
	    <table id="patientList" style="height: 441px;width:310px;"></table>
	</div>
	<div id="rightSide" style="width: 73%; height: 100%;float:left;margin-left:10px">
		<iframe id="TreatFrame" style="border:0;width: 100%;height:100%" src="${ctx}/treatment/showTreamentPerson.html"></iframe>
	</div>
</body>
</html>

