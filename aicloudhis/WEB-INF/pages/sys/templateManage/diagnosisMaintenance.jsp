<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>个人信息</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>

<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css"></link>
</head>
<body>	
	<div>
		<fieldset style="margin: 0px; padding: 0px 10px 3px 10px;">
			<legend>诊断列表</legend>
			<div style="height: 335px;">
				<table id="diagDatagrid"></table>
			</div>
		</filedset>
	</div>
	<div>
		<fieldset style="margin: 0px; padding: 0px 10px 3px 10px;height: 105px">
			<legend>诊断维护</legend>
			<div style="height: 75px; background-color: #FFFFFF; border: 1px solid #D4D4D4;">
				<form id="diagForm" method="post">
 					<table border=0 style="width: 100%;">
						<tr>
						<td colspan="5" align="center">
							<!-- <a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'icon-add'" onclick="addDiag()">新增</a> 
							<a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'icon-edit'" onclick="updateDiag()" >修改</a> 
							<a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'icon-remove'" onclick="deleteDiagForm()">删除</a>
							<a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'icon-remove'" onclick="clearDiagForm()">清空</a> -->
							<button type="button" class="btn btn-primary btn-sm" onclick="addDiag()">新  增</button>
							<button type="button" class="btn btn-info btn-sm" onclick="updateDiag()">修  改</button>
							<button type="button" class="btn btn-warning btn-sm" onclick="deleteDiagForm()">删  除</button>
							<button type="button" class="btn btn-danger btn-sm" onclick="clearDiagForm()">清  空</button>
						</td>
						</tr>
						<tr>
						<td>诊断名称：<select id="diagnameGrid" class="combogrid"  style="width:140px;" name="diagname"  
					       data-options="    
					           panelWidth:320, 
					           panelHeight:340,   
					           idField:'diagName',    
					           textField:'diagName',   
					           mode:'remote',
					           method:'post',
					           required:true,
					           pagination:true,
					           onClickRow:diagTempClick, 
					           url:'${ctx}/template/getDiagDictList.ajax',    
					           columns:[[    
					               {field:'diagName',title:'诊断名称',width:160},    
					               {field:'diagTypeid',title:'诊断编码',width:130},
				                   {field:'inputstr',title:'助记符',width:130,hidden:true}    
					           ]]    
					       "></select></td> 
					         <input id="diagid" type="hidden" style="width: 105px;" name="diagTypeid"  data-options="required:true" readonly /> 
					        <td>诊断编码：<input id="diagTypeid" type="text" style="width: 105px;" name="diagid" data-options="required:true" readonly /></td>
							<td>助记符：<input id="inputstr" type="text"  class="validatebox" style="width: 105px;" name="inputstr" /></td> 
							<td>诊断常用名：<input id="diagaliases" type="text" style="width: 105px;" name="diagaliases" /></td>
							<!-- <td>排序号<input id="sortno" type="text" class="validatebox" name="dto.orgDiag.sortno" style="width: 105px;" data-options="min:0,precision:0"></input></td> -->
							<!-- <td>排序号<input id="sortno" type="text" class="validatebox"  data-options="validType:'digits',missingMessage:'请输入整数'"></td> -->
							<td>排序号：<input id="sortno" type="text" name="sortno" style="width: 105px;" value='1' onkeyup="value=value.replace(/[^1-9]\D*$/,'')" ></td>
							</tr>
                        <input type="hidden" id="loginLocId" value="demo001" >
                        <input type="hidden" id="orgidHosp" value="demo" > 
                        <input type="hidden" id="uuid" > 
                        </table>
				</form>
			</div>
		</filedset>
	</div>
</body>

<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/diagnosisMaintenance.js"></script>
</html>
