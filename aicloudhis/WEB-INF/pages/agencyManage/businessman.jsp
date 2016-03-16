<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>





<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<title>合作厂商</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" 
	src="${ctx}/js/dhcc/chis/businessman/businessman.js"></script>
</head>
<body>
	
	<div id="button">
		<form id="selectForm" method="post">
		               企业信息名称：<input class="validatebox" style="width:100px;height:20px;" type="text" name="entname" data-options="
		            required:false"/>&nbsp;&nbsp;
		               输入码：<input class="validatebox" style="width:100px;height:20px;" type="text" name="inputstr" data-options="
		            required:false"/>
		        <button class="btn btn-primary btn-sm" type="button" onclick="selectClick()" >查&nbsp;询</button>
			    <button type="button" class="btn btn-success btn-sm" onclick="addClick();" >新&nbsp;建</button>
	    		<button class="btn btn-info btn-sm" type="button" onclick="editRow()" >修&nbsp;改</button>
	    		<button class="btn btn-danger btn-sm" type="button" onclick="delRow()" >删&nbsp;除</button>   
	    </form>
	</div>	
	 	<table id="show" data-options="
	 	toolbar:'#button',
	    rownumbers:false,
	    fitColumn:false,
	    singleSelect:true,
	    pagination:true">
	    </table> 
	    
	<div id="detailWin" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true"
			style="width: 400px; height: 480px;">
	<form id="detail" method="post"><br>
	  <table cellspacing="15" cellpadding=5 style="margin: 10px;">
	  	<tr align="right" hidden="true">
			<td colspan="2"><input id="flg"/></td>							
		</tr>
		<tr align="right" hidden="true">
			      <td width="100">企业信息编码：</td>
			      <td><input class="validatebox" style="width:200px;" type="text" name="businessman.entid" data-options="
		            required:false"/>
			      </td>
			    </tr>
	    <tr align="right">
	      <td width="100">企业信息名称：</td>
	      <td><input class="validatebox" type="text" id="entname" name="businessman.entname" data-options="
	        required:true" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">输入码：</td>
	      <td><input class="validatebox" type="text" id="inputstr" name="businessman.inputstr" data-options="
	        required:true" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">企业地址：</td>
	      <td><input class="validatebox" type="text" id="ent_addr" name="businessman.entAddr" data-options="
	        required:true" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">企业电话：</td>
	      <td  style="text-align:left">
	        <input id="phone" class="validatebox" name="businessman.phone" style="width:200px;"/> 
         </td>       
	   </tr>
	   <tr align="right">
	      <td width="100">联系人：</td>
	      <td><input class="validatebox" type="text" id="contactor" name="businessman.contactor" data-options="
	        required:false" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">企业邮编：</td>
	      <td><input class="validatebox" type="text" id="ent_zip" name="businessman.entZip" data-options="
	        required:false" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">企业传真：</td>
	      <td><input class="validatebox" type="text" id="ent_fax" name="businessman.entFax" data-options="
	        required:false" style="width:200px;"/>
	      </td>
	    </tr>
	    <tr align="right">
	      <td width="100">备注：</td>
	      <td><!-- <input class="validatebox" type="text" id="note" name="businessman.note" data-options="
	        required:false" style="width:200px;"/> -->
	        <textarea id="note" name="businessman.note" data-options="
	        required:false" style="width:200px;height:70px;resize:none"></textarea>
	      </td>
	    </tr>
	    <tr align="right">
	      <td align="center" colspan="2">
	      		<input type="checkbox" id="isproducer" name="businessman.isproducer1" value="1"/>生产厂商&nbsp;&nbsp;&nbsp;
	      		<input type="checkbox" id="issupplier" name="businessman.issupplier1" value="1"/>供应厂商&nbsp;&nbsp;&nbsp;
	      		<input type="checkbox" id="isstop" name="businessman.isstop1" value="1" data-options="required:true" />停用
	       		<!-- <select id="isproducer" name="businessman.isproducer" autocomplete="off">
	       			<option id="isproducer_option" value="1">是</option>
	       			<option value="0">否</option>
	       		</select> -->
	      </td>
	    </tr>
	  </table><br>
	  <div align="center">
	 	<button type="button" class="btn btn-success btn-sm" onclick="saveupdate()">保存</button>
      	<button type="button" class="btn btn-danger btn-sm" onclick="cancelClick()">关闭</button>
	  </div><br>
	</form>
  </div>
</body>
</html>