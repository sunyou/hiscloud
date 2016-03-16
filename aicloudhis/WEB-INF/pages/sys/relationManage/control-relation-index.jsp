<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">


<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css"></style>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/controlrel/controlrel.js"></script>
<title>控制关系维护</title>
</head>
<body>
<div>
	<table id="condg"></table>
		<div  id="tb" style="height: auto;">
			<form id="selectForm" method="post">
			
			类型<input class="combobox" id="ctrTypeidA" name="ctrTypeid"
							data-options="
							url:'${ctx}/dict/getDictContentList.ajax?dictName=ctr_typeid&upid=0',
							mode:'remote', valueField:'value', textField:'description', pagination:false, panelHeight:'auto' ">
			<!-- <a href="javascript:querycon()"  type="button" class="btn btn-info btn-sm">查询</a>
		    <a href="javascript:addcon()" type="button" class="btn btn-warning btn-sm">新建</a> 
		    <a href="javascript:updatecon()" type="button" class="btn btn-success btn-sm">修改</a>
		 	<a href="javascript:DeleteCon()"  type="button" class="btn btn-danger btn-sm">删除</a> -->
			<button onclick="javascript:querycon()"  type="button" class="btn btn-primary btn-sm">查询</button>
		    <button onclick="javascript:addcon()" type="button" class="btn btn-success btn btn-sm">新建</button>
		    <button onclick="javascript:updatecon()" type="button" class="btn btn-info btn-sm">修改</button>
		 	<button onclick="javascript:DeleteCon()"  type="button" class="btn btn-danger btn-sm">删除</button>
		 	</form>
		</div>
	
	
		<div id="dlg" class="dialog" title="Modal Window"
				data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
				style="width: 310px; height:310px;">
		<form id="conForm" method="post">
			<div>
			<input type="hidden"  id="flg"/>
			<input type="hidden"  id="uuid" style="width: 100px;"name="uuid" value="唯一编码"/>
			<input type="hidden"  id="orgidHosp"  style="width: 118px;height:22px" name="orgidHosp" value="所属诊所">
			</div>
	  	<table border="0" cellspacing="15" cellpadding=5 style="margin: 10px;" >
	 		<tr>
				<td>类型:</td>
			    <td><input	class="combobox" 	
							id="ctrTypeid"
							name="ctrTypeid"
							data-options="
							url:'${ctx}/dict/getDictContentList.ajax?dictName=ctr_typeid&upid=0',
						 	onChange:parctrFilter, 
							mode:'remote',
							valueField:'value',
							textField:'description',
							pagination:false,
							required:true,
							panelHeight:'auto',
							editable:false,
							disabled:true
				"></td>
			</tr>
			<tr>
				<td>关系编码:</td>
				<td><input class="validatebox" id="ctrrElid" style="width: 151px;"name="ctrrElid"/>
				</td>
			</tr>
			<tr >
				<td>关系名称:</td>
				<td><input class="validatebox" id="ctrRelname" style="width: 151px;"name="ctrRelname" data-options="required:true"/></td>
			</tr>
			<tr>
				<td>控制范围:</td>
			    <td><input	class="combobox" 	
							id="ctrRange"
							name="ctrRange"
							data-options="
							url:'${ctx}/dict/getDictContentList.ajax?dictName=ctr_range',
							mode:'remote',
							editable:false,
							valueField:'value',
							textField:'description',
							pagination:false,
							required:true,
							editable:false,
							panelHeight:'auto'
				"></td>
			</tr>
			<tr >
				<td>参数串:</td>
				<td>
				<select class="combogrid" onfocus="parctrFilter()" id="parastr" name="parastr" style="width: 155px;" 
					data-options="toolbar:'#tb3',
					editable:false,">
				</select>
					<div id="tb3" >
						<a href="javascript:ok()" class="linkbutton"  iconCls="icon-ok" plain="true">确定</a>
					</div>
				</td>
			</tr>
			<tr>
				<td>控制结果:</td>
			    <td><input	class="combobox" 	
							id="ctrResult"
							name="ctrResult"
							data-options="
							url:'${ctx}/dict/getDictContentList.ajax?dictName=ctr_result',
							mode:'remote',
							editable:false,
							valueField:'value',
							textField:'description',
							pagination:false,
							required:true,
							editable:false,
							panelHeight:'auto'
				"></td>
			</tr>
			<!-- 
			<tr hidden="true">
				<td>所属诊所：</td>
				<td><select id="orgidHosp" class="combobox" style="width: 118px;height:22px" name="dto.relCtr.orgidHosp">
				</select>
				</td>
			</tr>
			 -->
		</table>
		 	<div id="createDlg-buttons" style="text-align: center;">
	      		<!-- <a href="javascript:saveupdate()" type="button" class="btn btn-success btn-sm">保存</a>
	     		<a href="javascript:closeDlg()" type="button" class="btn btn-warning btn-sm">关闭</a> -->
	      		<button onclick="javascript:saveupdate()" type="button" class="btn btn-success btn-sm">保存</button>
	     		<button onclick="javascript:closeDlg()" type="button" class="btn btn-danger btn-sm">关闭</button>
		  	</div> 
	
		</form>
		</div>
</div>
</body></html>
