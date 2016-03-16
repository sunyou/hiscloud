<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD H TML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>排班页面</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/scheduling/scheduling.js">
</script>
<style>
  body{
 font:font-family: '宋体', Simsun;" mce_style="font-family: '宋体', Simsun;
 
 }
</style>

</head>
<body style="width: 100%; height: 570px">
	<div>
		<fieldset style="margin:2px;float:left; width: 23%; height: 420px; border: 1px solid #C0C0C0;">
			<legend>排班维护</legend>
			<div style="margin:4px;float:left; width: 96%;height: 400px;background-color: #FFFFFF"> 
			<input id="orgidHosp" type="hidden" class="validatebox" value="demo" style="width: 90px;"/> 
		    <input id="orgnameHosp" type="hidden"	class="validatebox" style="width: 90px;" value="云诊所"/>
	 	 	 <input type="hidden" id="inputstr" name="dto.registernumber.inputstr">
	 	  <form id="addItemForm",method="post">
	 	   <input id="registid" type="hidden" name="registernumber.registid">
				<table width="236" height="390" id="addItemTable" style="margin:auto;font-size:12px;"  border="0" cellpadding="1" cellspacing="15">
					<tr style="height: 10px;"></tr>
					<tr>
						<td align="right"  style="width: 90px;">科室:</td>
						<td align="center"><input	class="combobox" 	
										id="orgid" style="width: 90px;"
										name="dto.registernumber.orgid" data-options="valueField:'orgid',textField:'orgname',onSelect:categoryReset,editable:false,required:true"/></td>
						</tr>
					<tr>
						<td align="right"  style="width: 90px;">诊别类型:</td>
						<td align="center"><input	class="combobox" 	
										id="registTypeid" style="width: 90px;"
										name="dto.registernumber.registTypeid"
										data-options="   
										url:'${ctx}/dict/getDictContentList.ajax?dictName=docType',
										mode:'remote',
										onSelect:onSelectemp,
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto',
										required:true"/></td>
					</tr>
				  	<tr id="emp" style="display:none" value="0" style="height: 30px;">
						<td align="right"  style="width: 90px;">专家名称:</td>
						<td align="center"><input	class="combobox" 	
										id="empid" style="width: 90px;"
										name="dto.registernumber.empid" data-options="valueField:'empid',editable:false,
										textField:'empname'"/></td>
					</tr>
					<tr>	
						  <td align="right"  style="width: 90px;">出诊时段:</td>
						  <td align="center"><input	class="combobox" style="width: 90px;"
										id="dateTypeid"
										name="dto.registerplan.dateTypeid"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=docTime',
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto',
										required:true"></td>
					</tr>
					<tr>
							<td align="right"  style="width: 90px;">星期:</td>
							 <td align="center"><input	class="combobox" style="width: 90px;" 	
										id="weekTypeid"
										name="dto.registerplan.weekTypeid"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=weekday',
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto',
										required:true"></td>
					</tr>
					<tr>
							<td align="right"  style="width: 90px;">正号限额:</td>
							<td align="center"><input class="numberbox" id="limitAmount" style="width: 90px;" 
								name="dto.registerplan.limitAmount" data-options="min:0,precision:0"/></td>
					</tr>
					<tr>
							<td align="right"  style="width: 90px;">预约限额:</td>
							<td align="center"><input class="numberbox" id="limitbookAmount" style="width: 90px;"
								class="validatebox"
								name="dto.registerplan.limitbookAmount" data-options="min:0,precision:0"/></td>
					</tr>
					<tr>
							<td align="right"  style="width: 90px;">预约起始号:</td>
							<td align="center"><input class="numberbox" id="bookqueueStartno" style="width: 90px;"
								name="dto.registerplan.bookqueueStartno" data-options="min:0,precision:0"/></td>
					</tr>
					<tr>
							<td align="right"  style="width: 90px;">加号限额:</td>
							<td align="center"><input class="numberbox" id="limitbookAddamount" style="width: 90px;"
								name="dto.registerplan.limitbookAddamount" data-options="min:0,precision:0"/></td>
					</tr>
					<tr>
						<!-- <td align="center"><a href="javascript:clearClick()"  class="linkbutton" data-options="iconCls:'chis-clear'">清空</a></td>
						<td align="center"><a href="javascript:addItemClick()" class="linkbutton" data-options="iconCls:'chis-add'">新增</a></td> -->
						<td align="center"><button class="btn btn-warning btn-sm" type="button" onclick="clearClick()" style="width:90px;padding-bottom: 3px; padding-top: 3px;">清&nbsp;空</button></td>
						<td align="center"><button type="button" class="btn btn-success btn-sm" onclick="addItemClick()" style="width:90px;padding-bottom: 3px; padding-top: 3px;">新&nbsp;增</button></td>
	 				</tr>	
	 				<tr>
	 				    <td align="center"> <button class="btn btn-info btn-sm" type="button" onclick="editRow()" style="width:90px;padding-bottom: 3px; padding-top: 3px;">修&nbsp;改</button></td>
	   					<td align="center"><button type="button" class="btn btn-danger btn-sm" onclick="delRow()" style="width:90px;padding-bottom: 3px; padding-top: 3px;">删&nbsp;除</button></td>
	 					<!-- <td align="center"><a href="javascript:editRow()" class="linkbutton" data-options="iconCls:'chis-edit'">修改</a></td>
						<td align="center"><a href="javascript:delRow()"  class="linkbutton" data-options="iconCls:'chis-wrong'">删除</a></td> -->
					</tr>
				</table>
			</form>
			</div>
		</fieldset>
		
		
		<fieldset style="margin:2px;float: left; width: 72%; height: 420px; border-right: 1px solid #C0C0C0; border-top: 1px solid #C0C0C0; border-bottom: 1px solid #C0C0C0;">
			<legend>排班情况</legend>
				<table id="dtlFeeDg"></table>
				<div id="tb" style="height: auto;">
				开始时间：<input class="datebox" id="startDate" data-options="editable:false">
				结束时间：<input class="datebox" id="endDate" data-options="editable:false">
				<button id="createScheduleBtn" type="button" class="btn btn-primary btn-sm" onclick="schedulingSave()" style="width:100px;padding-bottom: 3px; padding-top: 3px;">生成班次</button></td>
		   	 	<!-- <a href="javascript:schedulingSave()" class="linkbutton" data-options="iconCls:'chis-schedule'">生成班次</a> -->
				</div>
		</fieldset>
		
	</div>

 	
</body>
</html>