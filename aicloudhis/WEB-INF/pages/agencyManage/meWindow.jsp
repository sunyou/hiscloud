<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>







<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<title>窗口管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/meWindow/meWindow.js"></script>
</head>
<body>
	<div id="button">
		<form id="selectForm" method="post">
		               窗口名称：<input class="validatebox" style="width:100px;height:20px;" type="text" name="windonsname" data-options="
		            required:false"/>&nbsp;&nbsp;
		              所属科室：<input class="combobox" id="orgCombox"
		               style="height: 23px;" 
		               name="orgid"
		               data-options="url:'${ctx}/agencyManage/findOrg.ajax?page=1&rows=10',
		               mode:'remote',
		               editable:false,
		               valueField:'orgid',
					   textField:'orgname',
		               pagination:false,
		               panelHeight:'auto'"/>
		    &nbsp;&nbsp; 启用标志：<select class="combobox" style="width:120px;height:24px;" name="isstop">  
					    <option value="1" selected="selected">启用</option>
		           		<option value="0">不启用</option>
		           		<option value="">全部查询</option>
					</select>
				&nbsp;
				
				<button class="btn btn-primary btn-sm" type="button" onclick="selectClick()" >查&nbsp;询</button>
			    <button type="button" class="btn btn-success btn-sm" onclick="addClick();" >新&nbsp;建</button>
	    		<button class="btn btn-info btn-sm" type="button" onclick="editRow()" >修&nbsp;改</button>
	    		<button class="btn btn-danger btn-sm" type="button" onclick="delRow()" >删&nbsp;除</button>    
			</td>  
	    </form>
	</div>
 	<table id="show" data-options="
	 	toolbar:'#button',
	    rownumbers:false,
	    fitColumn:false,
	    singleSelect:true,
	    pagination:true">
    </table>
    

	<div id="detailWin" class="dialog" title="Modal Window" data-options="modal:true,closed:true" style="width: 400px; height: 480px;">
	  <form id="detail" method="post">
	  	<input type="hidden" name="meWindow.uuid" value=""/> <!-- 主键 -->
	    <br>
	    <table cellspacing="15" cellpadding=5 border="0" style="margin: 10px;">
	      <tr align="right" hidden="true">
	        <td colspan="2"><input type="hidden" id="flg" name="BLHMI"/></td>
	      </tr>
	      <tr align="right">
	        <td width="100">诊&nbsp;&nbsp;&nbsp;&nbsp;所：</td>
	        <td align="left">云诊所</td>
	      </tr>
	      <tr align="right">
	        <td width="100">科&nbsp;&nbsp;&nbsp;&nbsp;室：</td>
	        <td align="left">
				<input class="combobox" id="orgComboxPop"
	               style="width: 203px; height: 23px;" 
	               name="meWindow.orgid"
	               data-options="url:'${ctx}/agencyManage/findOrg.ajax?page=1&rows=10',
	               mode:'remote',
	               editable:false,
	               valueField:'orgid',
				   textField:'orgname',
	               pagination:false,
	               panelHeight:'200px',
	               onSelect:orgSelect,
	               required:true"/>
	            <input type="hidden" id="orgname" name="meWindow.orgname" value="">
	      </tr>
	      <tr align="right">
	        <td width="100">窗口名称：</td>
	        <td align="left">
	        	<input class="validatebox" type="text" id="inputstr" name="meWindow.windonsname" data-options="required:true" style="width:200px;"/>
	        </td>
	      </tr>
	      <tr align="right">
	       	<td width="100">是否启用：</td>
	        <td align="left">
	        	<input type="radio" id="enableFlag" name="meWindow.isstop" value="1"/>&nbsp;<label for="enableFlag">启用</label>
	        	<input type="radio" id="disableFlag" name="meWindow.isstop" value="0"/>&nbsp;<label for="disableFlag">不启用</label>
	        </td>
	      </tr>
	    </table>
	    <div align="center" style="margin-top: 30px;"> 
	    	<button type="button" class="btn btn-success btn-sm" onclick="saveClick()">保存</button>
      		<button type="button" class="btn btn-danger btn-sm" onclick="cancelClick()">关闭</button>
	    </div>
	    <br/>
	  </form>
	</div>
</body>
</html>
