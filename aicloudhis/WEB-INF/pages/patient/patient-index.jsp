<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>患者登记</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/patCon/patRe.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/PYjm.js"></script>
 <style type="text/css"> 
	font{
	font-family: '宋体', Simsun;font-size:12px;
	 }
	.validatebox-text, textarea{ 
	   height:20px;
	   line-height:20px;
	   border:1px solid #dddddd;
	}
	.histab{
	 font-size:12px;
	  border:1px solid #dddddd;
	}
	.histab #tb2{
	 font-size:12px;
	  border:1px solid #FFFFFF;
	}
</style> 

</head>

<body style="overflow: hidden;">
    <!-- 患者信息列表start -->
	<table id="dg"></table>
	<!-- 患者信息列表end -->
	
	<!-- 查询条件栏start -->
	<div id="tb" style="height: auto;">
	        姓名<input class="validatebox" id="patName" placeholder="姓名/拼音/简码" type="text" style="height: 25px; width: 100px">
	        移动电话<input class="validatebox" id="patPhone" placeholder="请输入手机号"  type="text" style="height: 25px; width: 100px">
	  <button class="btn btn-primary btn-sm" type="button" onclick="FindData()" style="width:70px;">查&nbsp;询</button>
	  <button type="button" class="btn btn-success btn-sm" onclick="createPatient();" style="width:70px;">新&nbsp;建</button>
	  <button class="btn btn-info btn-sm" type="button" onclick="updatePatient()" style="width:70px;">修&nbsp;改</button>
	  <button type="button" class="btn btn-danger btn-sm" onclick="deletePatient()" style="width:70px;">删&nbsp;除</button>	 
	</div>
	<!-- 查询条件栏end -->
	
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
						    <td align="center" style="width: 100px;">
						           <input	class="combobox" id="nationalityid" name="nationalityid"style="width: 90px;"
										data-options=" url:'${ctx}/dict/getDictContentList.ajax?dictName=nation',
										mode:'remote',editable:false,valueField:'value',textField:'description',pagination:false,panelHeight:'auto'">
							 </td>
							 <td align="right" style="width: 65px;"><font color="red">证件类型:</font></td>
							 <td align="center" style="width: 100px;">
							     <input	class="combobox" 	
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
						
							<td align="right" style="width: 65px;"><font color="red">证件号码:</font></td>
                    	    <td align="center"  colspan="1">
                    	         <input class="validatebox" type="text" id="icard" name="icard" data-options="required:true"
                    	                onblur="upperCase()" onkeydown="javascript:if (event.keyCode==13) upperCase();" 
                    	                style="width: 150px;"/>
                    	    </td>
						</tr>
						<tr>
						    	<td align="right" style="width: 50px;"><font>性别:</font></td>
						    	<td align="center" style="width: 100px;">
						    	     <input	class="combobox" id="patientSexId" name="patientSexid"
											style="width: 90px;"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=gender',
											mode:'remote',
											onSelect:changeImg,
											valueField:'value',
											editable:false,
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
								</td>
								<input type="hidden" id="patientSename" name="patientSename"/>
								<td align="right" style="width: 65px;"><font>年龄:</font></td>
								<td align="center" style="width: 100px;">
								    <input class="numberbox" type="text" id="age" name="age" style="width: 90px;" onchange="createBirthday();"/>
								</td>
							    <td align="right" style="width: 65px;"><font color="red"><font>出生日期:</font></font></td>
							    <td align="center" style="width: 100px;">
							    	<input class="datebox" type="text" id="birthDate" name="birthDate" 
							    	       style="width: 150px;" data-options="required:true,editable:false,onSelect:checkBirthDay"/>
							    </td>
					    </tr>
						<tr>
						    <td align="right" style="width: 50px;"><font>婚否:</font></td>
						    <td align="center" style="width: 100px;">
						         <input	class="combobox" 	
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
										panelHeight:'auto'">
							</td>
							<td align="right" style="width: 65px;"><font color="red"><font>患者类型:</font></font></td>
							<td align="center" style="width: 100px;">
							     <input	class="combobox" id="patientIdentityid"
										name="patientIdentityid" style="width: 90px;"
										data-options="valueField:'patientIdentityid',textField:'patientIdentityname',editable:false,required:true,onSelect:setIdentityname"/>
							</td>
							<input type="hidden" id="patientIdentityname" name="patientIdentityname">
							 <td align="right" style="width: 65px;"><font>职业:</font></td>
							 <td align="center" style="width: 100px;">
							     <input	class="combobox" 	
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
						  	<td align="center" style="width: 100px;">
						  	     <input	class="combobox" id="countryid" name="countryid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=0',
										onSelect:onSelectCountry,
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto'"></td>
					     	<td align="right" style="width: 80px;"><font>省/直辖市&nbsp;:</font></td>
					     	<td align="center" style="width: 100px;">
					     	     <input	class="combobox" 	id="provinCesid"
										name="provinCesid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=1',
										onSelect:onSelectProvice,
										editable:false,
										mode:'remote',
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
							<td align="right" style="width: 65px;"><font>市(地区):</font></td>
							<td align="center" style="width: 100px;"><input	class="combobox" 	id="cityid"
										name="cityid"
										style="width: 90px;"
										data-options="
									 	url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=2',
										onSelect:onSelectCity,
										mode:'remote',
										valueField:'value',
										editable:false,
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						
							<td align="right" style="width: 65px;"><font>县/区:</font></td>
							<td align="center" style="width: 100px;">
							     <input	class="combobox" 	id="cityaeraid"
										name="cityaeraid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=3',
										mode:'remote',
										valueField:'value',
										editable:false,
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						</tr>
						<tr>
						 	<td align="right" style="width: 65px;"><font>详细信息:</font></td>
							<td align="center" colspan="3">
							    <input type="text" class="validatebox" style="width: 280px;" 
							           id="streetinfo" name="streetinfo" onchange="illegalChar(this)">
							</td> 
							<td align="right" style="width: 65px;"><font>邮编:</font></td>
						    <td align="center" style="width: 100px;">
							    <input class="validatebox" type="text" 
							    id="flPostcode" name="flpostcode" style="width: 90px;" />
							</td>
						
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
	    
	  <div id="historyDLg" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true" style="width: 890px; height: 430px; padding: 1px;">    
      	 <table class="histab">
      	 		<td width="39%"><table id="historyDataGrid"></table></td>
      			 <td width="59%" valign="top">
      			 
      			 	<div style="margin-top: 5px;">
				<fieldset>
				<table style="font-size: 12px; height:150px;">
					<tr>
						<td colspan="1"><b>诊断:</b></td>				
						<td colspan="9" height="30px;" id="DetailsDiag" style="color: blue;"></td>
					</tr>					
<%--					<tr>--%>
<%--						<td width="40px;">姓名：</td>--%>
<%--						<td id="DetailsName" width="30" style="color: blue;"></td>--%>
<%--						<td>性别：</td>--%>
<%--						<td id="DetailsGender" width="30" style="color: blue;"></td>--%>
<%--						<td>年龄：</td>--%>
<%--						<td id="DetailsAge" width="30" style="color: blue;"></td>--%>
<%--						<td>联系电话:</td>--%>
<%--						<td id="DetailsPhone" width="30" style="color: blue;"></td>--%>
<%--						<td>就诊医生:</td>--%>
<%--						<td id="DetailsDoctor" width="60" style="color: blue;"></td>--%>
<%--						<td>就诊科室:</td>--%>
<%--						<td id="DetailsLoc" width="60" style="color: blue;"></td>--%>
<%--					</tr>--%>
					<tr>
					<tr>
						<td colspan="10"><b>主诉:</b></td>
					</tr>
					<tr>
						<td></td>
						<td colspan="9" height="30px;" id="DetailsComplaint" style="color: blue;"></td>
					</tr>
					<tr>
						<td colspan="10"><b>现病史:</b></td>
					</tr>
					<tr>
						<td></td>
						<td colspan="9" height="30px;" id="DetailsHistory" style="color: blue;"></td>
					</tr>
					<tr><td colspan="10"><b>体格检查：</b></td></tr>
					<tr>
						<td width="40px;">体温：</td>
						<td id="DetailsTemperature" width="30" style="color: blue;"></td>
						<td>心率：</td>
						<td id="DetailsHeartRate" width="30" style="color: blue;"></td>
						<td>收缩压：</td>
						<td id="DetailsSBP" width="30" style="color: blue;"></td>
						<td>舒张压:</td>
						<td id="DetailsDBP" width="30" style="color: blue;"></td>
						<td>心律:</td>
						<td id="DetailsRhythm" width="60" style="color: blue;"></td>
					</tr>
					<tr>
						<td>其他：</td>
						<td  colspan="9" width="90" id="DetailsOther" style="color: blue;"></td>
					</tr>
				</table>
				</fieldset>
				<div style="margin-top: 5px;overflow:auto;height: 160px;">
				<fieldset>
					<legend>医嘱</legend>
					
						<table id="html" style="font-size: 12px;"></table>
				</fieldset>
				</div>
      		</td>
        </table>
	</div> 
</body>
</html>
