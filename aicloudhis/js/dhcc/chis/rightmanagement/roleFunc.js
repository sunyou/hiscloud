$(function() {
	var h = getIframeHeight() - 47;
	$("#treeDiv").height(h);
	$("#tbLeft").on('mouseover', function() {
		$CommonUI.poshytip($("#tbLeft"),'请输入角色编号/名称');
	});
	$("#tbLeft").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#tbLeft"));
	});
	showList("");
});
function searchRole(){
	showList($("#searchKey").val());
}
function showList(searchKey){
	var h = getIframeHeight() - 30;
	//角色datagrid
	$CommonUI.getDataGrid('#roleDg').datagrid({
		height: h, 
		width: '100%', 
		toolbar: "#tbLeft",
		singleSelect: true,
		pagination: false,
		fitColumns: true,
		url : $WEB_ROOT_PATH + '/privilege/qryRoleListByEmpId.ajax',
		queryParams:{ "searchKey": searchKey },
		columns : [[
		      {title: "角色ID",field: "roleId",width: 50},
//		      {title: "角色编号",field: "roleCode",width: 50},
		      {title: "角色名称",field: "roleName",width: 70},
		      {title: "角色描述",field: "roleDes",width:130}
		]],
		onClickRow: function(rowIndex, rowData) {
			$("#roleId").val($('#roleDg').datagrid('getSelected').roleId);
			$("#treeDiv").addClass("body-mask");
			$("#funcTree").hide();
			$CommonUI.getTree('#funcTree').tree({  
			    url:$WEB_ROOT_PATH + '/privilege/getSysMenusByRoleId.ajax?roleId='+$('#roleDg').datagrid('getSelected').roleId,
			    checkbox:true,
			    onLoadSuccess:function(){
			    	$("#funcTree").show();
			    	$("#treeDiv").removeClass("body-mask");
			    }
			});  
		}
	});
}
function saveFuncs(){
	if($("#roleId").val() == ""){
		$CommonUI.alert("请选择需要修改的角色", 'error');
		return;
	}
//	if($("#pwd").val() == ""){
//		$CommonUI.alert("请输入密码", 'error');
//		return;
//	}
	var funcId = "";
	var checkedNodes = $CommonUI.getTree('#funcTree').tree('getChecked');
	var indeterminateNodes = $CommonUI.getTree('#funcTree').tree('getChecked', 'indeterminate');
	for(var k in indeterminateNodes){
		if(funcId != ""){
			funcId += ",";
		}
		funcId += indeterminateNodes[k]["attributes"].funcId;
	}
	for(var k in checkedNodes){
		if(funcId != ""){
			funcId += ",";
		}
		funcId += checkedNodes[k]["attributes"].funcId;
	}
	$.ajax({
		 type: "post",
			url: $WEB_ROOT_PATH+"/privilege/saveFuncs.ajax",
			data:{
				"roleId":$("#roleId").val(),
				"funcIds":funcId,
//				"pwd":$("#pwd").val()
				},

	        dataType: "json",
	        success: function(data){
//	        	if(data == "pwdError"){
//	        		$CommonUI.alert("签名不正确", 'error');
//	        	}
//	        	else 
	        	if (data.result=="success"){
	        		$CommonUI.alert("修改成功", 'info');
	        	} else {
	        		 $CommonUI.alert("保存失败！", 'error');
	        	}
	        }
	});
}
