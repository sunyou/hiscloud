//页面初始化
$(function(){
		var options = {toolbar : "#roleManagement",height : 460,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 10};
		var columns = [ [
		                {field : 'ck', checkbox : true,width:40,align : 'center'},
		                {field : "roleId",title : "funcId",hidden:true},
		                {field : "roleName",title : "角色名称",width:160,align : 'center'},
//		                {field : "roleCode",title : "角色代码",width:140,align : 'center'},
		     	        {field : "roleDes",title : "角色描述",width:140,align : 'center'},
		     	        //{field : "useState1",title : "状态1",width:140,align : 'center'},
		     	        {field : "roleState",title : "状态",width:140,align : 'center'}
		  		] ];
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH+"/privilege/qryRoleList.ajax";
		$CommonUI.datagrid('#role', url, queryParams, columns, pageOpts, sortOpts,options);
});
/**
 * 查询功能
 * **/
function query(){
	var roleName = $("#name").val();
	var useState = $("#state").combobox('getValue');
	$CommonUI.getDataGrid('#role').datagrid({
    	url:$WEB_ROOT_PATH + "/privilege/qryRoleList.ajax",
    	queryParams:{
			"roleName":roleName,
			"roleState":useState,
			"rows": 10,  
			"page": 1
    	}
    });	
	$CommonUI.getDataGrid('#role').datagrid('load', {  
		"roleName":roleName,
		"useState":useState,
		"rows": 10,  
		"page": 1
	});     
}
/***
 * 新增菜单
 * 
 */
function addRole(){
	$CommonUI.getForm('#roleForm').form('clear');
	$("#update").hide();
	$("#save").show();
	$("#close").show();
	
	$('#roleDlg').dialog('open').dialog('setTitle', '角色信息');
	$("#roleDlg").dialog('open');
}
/**
 * 保存 
 */
function save(){
	var roleName = $("#roleName").val();
	if(roleName==""){
		$CommonUI.alert("角色名称不可为空!");
		return;
	}
//	var roleCode = $("#roleCode").val();
//	if(roleCode==""){
//		$CommonUI.alert("角色代码不可为空!");
//		return;
//	}
	var roleState = $("#roleState").combobox('getValue');	
	if(roleState==""||roleState==null){
		$CommonUI.alert("使用状态不可为空!");
		return;
	}
	var roleDes = $("#roleDes").val();
	var url = $WEB_ROOT_PATH + '/privilege/saveRole.ajax';
	
	postReq(url, 'roleForm',succAdd, err, {skipHidden : false},{
		'roleName':roleName,
		'roleState':roleState,
		'roleDes':roleDes
	});
}

function err(){
	$CommonUI.alert("失败");
}
function succAdd(data) {
	if(data.result="success"){
		$CommonUI.alert("添加角色成功!");	
		$("#role").datagrid('reload');
		$('#roleDlg').dialog('close');	
	}else{
		$CommonUI.alert("添加角色失败!",'error');	
	}
	
}
function succUpdate(data) {
	if(data.result="success"){
		$CommonUI.alert("修改角色成功!");	
		$("#role").datagrid('reload');
		$('#roleDlg').dialog('close');	
	}else{
		$CommonUI.alert("修改角色失败!",'error');	
	}  ;
}
function updateRole(){
	var selectedRow = $("#role").datagrid('getSelected');
	$("#update").show();
	$("#save").hide();
	$("#close").show();
	if (selectedRow!=null && selectedRow!="") {
		$CommonUI.getForm('#roleForm').form('clear');
		$('#roleDlg').dialog('open').dialog('setTitle', '角色信息');
		$("#roleDlg").dialog('open');
		var roleId = selectedRow.roleId;
		$.getJSON($WEB_ROOT_PATH+ "/privilege/qryUpdateRole.ajax?roleid="
				+ roleId, function(data) {
			if(data != null){
				//var json = eval("("+data.toString()+")");   				
				$("#roleId").val(data.rows[0].roleId); 
				$("#createDate").val(data.rows[0].createDate); 
				
				$("#roleName").val(data.rows[0].roleName);				
//				$("#roleCode").val(data.rows[0].roleCode);
				$('#roleDes').val(data.rows[0].roleDes);
				$('#roleState').combobox('setValue',data.rows[0].roleState);
			}			
		});
	}else{
		$CommonUI.alert("请选择一行记录");
	}
}
function update(){
	var roleid = $("#roleId").val();
	var roleName = $("#roleName").val();
	if(roleName==""){
		$CommonUI.alert("角色名称不可为空!");
		return;
	} 
	var roleState = $("#roleState").combobox('getValue');	
	if(roleState==""||roleState==null){
		$CommonUI.alert("使用状态不可为空!");
		return;
	}
	var roleDes = $("#roleDes").val();
	var url = $WEB_ROOT_PATH + '/privilege/updateRole.ajax';
 	postReq(url, 'roleForm',succUpdate, err, {skipHidden : false},{
 		'roleid':roleid,
 		'roleName':roleName,
		'roleState':roleState,
		'roleDes':roleDes
 	});
}
function deleteRole(){
	if ($CommonUI.getDataGrid("#role").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}
	var row = $("#role").datagrid('getSelected');
  	$CommonUI.confirm('删除不可恢复，确定删除吗？', 'question', 0, function(){
		$.post($WEB_ROOT_PATH+"/privilege/deleteRole.ajax",{
		     'roleid':row.roleId},
		function(data){
			if(data.result='success'){
			     $CommonUI.alert("删除成功!");
				 $("#role").datagrid('reload');
			}else{
				$CommonUI.alert("删除失败!",'error');
			}
		},'json');
	});
}
function myclose(){
	 $('#roleDlg').dialog('close');
	 $("#role").datagrid('reload');
}
function clearRole(){
	$CommonUI.getForm('#roleForm').form('clear');
}
