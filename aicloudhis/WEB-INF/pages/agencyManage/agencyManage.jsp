<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css"></style>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/agencyManage/agencyManage.js"></script>
</head>
<body style="width: 100%; height: 500px;" >
<div id="tabsResize"  style="position:relative;height:auto;border-top:0" data-options="fit:true">
		<div title="机构维护" style="width: 100%; padding: 0; margin: 0" data-options="fit:true">	
			<table id="orgdg"></table>
			<div id="tb" style="height: auto;">
			          机构名称&nbsp;<input id="orgnameB" style="width: 100px;"name="dto.org.orgname">
	      <!--  所属诊所&nbsp;<input id="orgId_hospA" style="width: 100px;"name="dto.org.orgId_hosp"> -->
				<!-- <a href="javascript:queryAgency()"  type="button" class="btn btn-info btn-sm">查询</a>
			    <a href="javascript:addAgency()"  type="button" class="btn btn-warning btn-sm">新建</a> 
			    <a href="javascript:updateAgency()" type="button" class="btn btn-success btn-sm">修改</a> -->
				<button onclick="javascript:queryAgency()"  type="button" class="btn btn-primary btn-sm">查询</button>
			    <button onclick="javascript:addAgency()"  type="button" class="btn btn-success btn-sm">新建</button>
			    <button onclick="javascript:updateAgency()" type="button" class="btn btn-info btn-sm">修改</button>
			</div>
			
		<div id="dlg" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
			style="width: 270px; height: 300px;">
			<form id="orgForm" method="post">
				  <table border="0" cellspacing="15" cellpadding=5 style="margin: 10px;" >
				  	<tr align="right" hidden="true">
						<td><input type="hidden" id="flg"/></td>							
					</tr>
					 <tr hidden="true">
						<td>机构编码:</td>
						<td><input class="validatebox" id="orgid" style="width: 100px;"name="org.orgid" /></td>
					</tr>
					<tr >
						<td>机构名称:</td>
						<td><input class="validatebox" id="orgname" style="width: 100px;"name="org.orgname" data-options="required:true" /></td>
					</tr>
					
					<tr >
				  		 <td>是否子节点:</td>
				  		 <td><input class="" type="checkbox" id="leaf" name="leaf1" value=1 data-options="required:true" />
				  		 </td>
					</tr>
					<tr>
						<td>输入串:</td>
						<td><input class="validatebox" id="inputstr" style="width: 100px;"name="org.inputstr" data-options="required:true"/></td>
					</tr>
					<tr>	
						<td>机构类型：</td>
						<td><input class="combobox" id="orgtypeId" style="width: 105px;" name="org.orgtypeid" data-options="required:true"/>
						
					</tr>
					<tr>
						<td>上级:</td>
							<td><select id="upDesc" name="org.upid"
								class="combogrid" style="width: 105px;"
								data-options="
								panelWidth: 400,
								panelHeight: 150,
								idField:'orgid',
								textField:'orgname',
								hasDownArrow:false,
								mode: 'remote',
								banOverflow:true,
								url: '${ctx}/agencyManage/findOrg.ajax?page=1&rows=10',
								method:'post',
								columns: [[
									{field:'orgid',title:'机构编码',width:100,align:'center'},
									{field:'orgname',title:'机构名称',width:100,align:'center'},
									{field:'inputstr',title:'输入串',width:100,align:'center'},
									{field:'orgtypeId',title:'机构类型',width:100,align:'center'},
									{field:'upname',title:'上级',width:100,align:'center'}
								]],
								fitColumns: true
							"></select>	
						 <input id="upname"  name="org.upname" type="hidden"/>
						</td>
						
					</tr>
		            <tr>
		                 <td>状态：</td>
					     <td align="center" style="width: 105px;">
					          <select class="combobox" type="text" id="isstop" name="org.isstop" data-options="required:true" 
					                                   style="width: 105px;height:25px;">
					                   <option value='1'>使用</option>
					                   <option value='0'>停用</option>
					          </select>
					     </td>
		            </tr>
					<tr hidden="true">
						<td>上级id:</td>
						<td><input class="validatebox" id="upid" style="width: 100px;"name="org.upid" /></td>
					</tr>
					<tr hidden="true">
						<td>机构地址:</td>
						<td><input class="validatebox" id="orgaddress" style="width: 100px;"name="org.orgaddress" /></td>
					</tr>
					<tr hidden="true">
						<td>所属诊所:</td>
						<td>
						<input class="validatebox" id="orgId_hosp" style="width: 100px;"name="org.orgidHosp" /> 
						</td>
					</tr>  
					</table>  
				</form>
				 <div id="createDlg-buttons" style="text-align: center;">
	         		<!-- <a href="javascript:saveupdate()" type="button" class="btn btn-success btn-sm">保存</a>
	        		<a href="javascript:closeDictDlg()" type="button" class="btn btn-warning btn-sm">关闭</a> -->
	         		<button onclick="javascript:saveupdate()" type="button" class="btn btn-success btn-sm">保存</button>
	        		<button onclick="javascript:closeDictDlg()" type="button" class="btn btn-danger btn-sm">关闭</button>
	      		  </div> 
	      	</div>	      		 
			
		</div>
</div>		
</body>
</html>