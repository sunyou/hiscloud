<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>字典管理</title>

<script type="text/javascript"
		src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/common.js"></script>
	<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
	<script type="text/javascript"
		src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
	<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
	<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />

<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript"
		src="${ctx}/js/dhcc/chis/common/makePy.js">

</script>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/wordbook/dictionary.js"></script>
</head>
<body>
<!-- <div id="tabsResize" class="tabs" style="position:relative;height:auto;border-top:0" data-options="fit:true"> -->
	<!-- <div title="字典类型" style="width: 100%; padding: 0; margin: 0" data-options="fit:true">	 -->
		<table id="dg"></table>
			<div id="tb" style="height: auto">
			            类型&nbsp;<input class="validatebox" id="s_type" type="text" style="height: 25px; width: 100px">
			           代码&nbsp;<input class="validatebox" id="s_value" type="text" style="height: 25px; width: 100px">
				描述&nbsp;<input class="validatebox" id="s_description"  type="text" style="height: 25px; width: 100px">
				类型名称&nbsp;<input class="validatebox" id="s_item_desc"  type="text" style="height: 25px; width: 100px">
				<button class="btn btn-primary btn-sm" type="button" onclick="searchDict()" >查&nbsp;询</button>
			    <button type="button" class="btn btn-success btn-sm" onclick="newDictDlg();" >新&nbsp;建</button>
	    		<button class="btn btn-info btn-sm" type="button" onclick="updateDictDlg()" >修&nbsp;改</button>
	    		<button class="btn btn-danger btn-sm" type="button" onclick="deleteDictDlg()" >删&nbsp;除</button>
			</div>
		<div id="dlg" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
			style="width: 450px; height: 350px;">
			<form id="dictForm" method="post">
			 <input type="hidden" id="id" name="id">
			 <input type="hidden" id="upid" name="upid">
				  <table border="0" cellspacing="15" cellpadding=5 style="margin: 10px;">
						<tr align="right">
						    <td>字典类型代码:</td>
						    <td><input class="validatebox" type="text" id="type" name="dicType" style="width: 180px;height:20px" data-options="required:true"  /></td>
						</tr>
						<tr align="right">	
							<td>字典内容代码:</td>
							<td><input class="validatebox" type="text" id="value" name="value"  style="width: 180px;height:20px" data-options="required:true"/></td>
						</tr>
						<tr align="right">	
							<td>字典内容描述:</td>
							<td><input class="validatebox" type="text" id="description" name="description"  style="width: 180px;height:20px" data-options="required:true"/></td>
						</tr>
						<tr align="right">	
							<td>字典类型描述:</td>
							<td><input class="validatebox" type="text" id="itemDesc" name="itemDesc"  style="width: 180px;height:20px"   /></td>
						</tr>
						<tr align="right">	
							<td>输入码:</td>
							<td><input class="" type="text" id="inputstr" name="inputstr"  style="width: 180px;height:20px" data-options="required:true"/></td>
						</tr>
						<tr align="right">	
							<td>级次:</td>
							<td><input class="" type="text" id="grade" name="grade"  style="width: 180px;height:20px" data-options="required:true" onkeyup="value=value.replace(/[^\d\.]/g,'')"    onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d\.]/g,''))"/></td>
						</tr>					 
						<tr >
						    <td align="right">是否叶子节点:<input class="" type="checkbox" id="leaflag" name="leaflag" value=1 style="width: 10px;" data-options="required:true"  /></td>
						    <td align="center">是否停止:<input class="" type="checkbox" id="stopflag" name="stopflag" value=1 style="width: 10px;" data-options="required:true"  /></td>
						</tr>
						<tr align="right">
							<td>上级描述:</td>
							
					 		<td>
					 	 
					 		<select id="upDesc" class="combogrid"  style="width:180px;"  
					       data-options="    
					           panelWidth:420, 
					           panelHeight:340,   
					           idField:'value',    
					           textField:'description',   
					           mode:'remote',
					           method:'post', 
					           pagination:true, 
					           onClickRow:upDescClick, 
					           url: '${ctx }/dict/getDictList.ajax',
					           columns:[[    
					               {field:'dicType',title:'类型',width:70,align:'center'},
									{field:'value',title:'代码',width:70,align:'center'},
									{field:'description',title:'描述',width:100,align:'center'},
									{field:'inputstr',title:'输入码',width:70,align:'center'},
									{field:'updescription',title:'上级',width:100,align:'center'} 
					           ]]    
					       "></select>					 		
					 		
							</td>							
						</tr>
						
					</table>  
				</form>
				 <div id="createDlg-buttons" style="text-align: center;">
				 	<button type="button" class="btn btn-success btn-sm" onclick="saveDict()">保存</button>
      				<button type="button" class="btn btn-danger btn-sm" onclick="closeDictDlg()">关闭</button>
	      		  </div> 
	      	</div>	      		 
	<!-- </div> -->
<!-- </div> -->

</body>
</html>
