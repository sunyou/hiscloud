/**
 * 初始化
 */
$(function(){
	showList("","");
});
/**
 * 检索用户
 * 
 */
function searchAccount(){
	showList($("#accountName").val(),$("#empName").val());
}
/**
 * 根据登录名和姓名刷新列表
 * @param accountName 登录名
 * @param empName 姓名
 */
function showList(accountName,empName){
	var h = getIframeHeight();
	var options = {toolbar : "#assignRoles",height : h,width : '100%',singleSelect : false,pagination : true,
			rownumbers : true,fitColumns : true,singleSelect:true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 10};
	var columns = [ [
                    {field : "ck1",checkbox : true,width : 80,align : 'center'},
	                {field : 'empid', checkbox : true,width:40,hidden:true},
	                {field : "loginName",title : "登录名",width:160,align : 'center'},
	                {field : "empName",title : "姓名",width:140,align : 'center'},
	     	        {field : "empTelenum",title : "手机",width:140,align : 'center'},
	     	        {field : "orgname",title : "科室",width:140,align : 'center'},
	     	        {field : "empItleid",title : "职称",width:140,align : 'center'},
	     	        {field : "name6",title : "操作",width:160,align : 'center', formatter: function(value,row,index){			     	    	 
	     	    		   return a='<a  id="deviding" class="linkbutton" style="height:50px;margin: 0 18px 0 4px" href="#" onclick="javascript:devidingRoles(\''+row.empid+'\')">分配角色</a>';
     	            }}
	  		] ];
	var queryParams = {page : 1,rows : 10, "loginName":accountName, "empName":empName};
	var url = $WEB_ROOT_PATH+"/privilege/getAccountList.ajax";
	$CommonUI.datagrid('#role', url, queryParams, columns, pageOpts, sortOpts,options);
	$('#role').datagrid('resize',{heigth:30}); 
}
/**
 * 显示分配角色pop界面
 * @param accountId 用户ID
 */
function devidingRoles(accountId){
	var options = {toolbar : "#roledgTools",height : 320,width : '100%',singleSelect : false,pagination : false,
			rownumbers : true,fitColumns : true,singleSelect:false};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 50,pagination:false};
	var columns = [[
	     	    	{field : 'roleId', checkbox : true,width:80},
	    			{field : "accountId",title : "",width:100,align : 'center',hidden:true},
	                {field : "roleName",title : "角色名称",width:100,align : 'center'},
	                {field : "roleDes",title : "角色描述",width:100,align : 'center'}
	     		   ]];
	var queryParams = {};
	var url = $WEB_ROOT_PATH+"/privilege/qryRoleListByEmpid.ajax?empid="+accountId;
	$CommonUI.datagrid('#roledg', url, queryParams, columns, pageOpts, sortOpts,options);
	$CommonUI.getDataGrid('#roledg').datagrid({
		onLoadSuccess: function(data){
			var rows = $CommonUI.getDataGrid('#roledg').datagrid("getRows");
			for(var k in rows){
				if(rows[k].accountId != null && rows[k].accountId != ""){
					$CommonUI.getDataGrid('#roledg').datagrid("checkRow",k);
				}
			}
		}
	});
	$("#accountId").val(accountId);
	$('#roleDlg').dialog('open').dialog('setTitle', '分配角色');
	$("#roleDlg").dialog('open');
}
/**
 * 保存用户角色配置
 */
function saveRoles(){
	var roleId = "";
	var rows = $CommonUI.getDataGrid('#roledg').datagrid("getChecked");
	for(var k in rows){
		if(roleId != ""){
			roleId += ",";
		}
		roleId += rows[k].roleId;
	}
	$.ajax({
		 type: "post",
			url: $WEB_ROOT_PATH+"/privilege/saveEmpRoles.ajax",
			data:{
				"empId":$("#accountId").val(),
				"roleIds":roleId
				},

	        dataType: "json",
	        success: function(data){
	        	if (data.result=="success"){
	        	    $CommonUI.alert("保存成功！");
	        		closeDlg();
	        	} else {
	        		 $CommonUI.alert("保存失败！", 'error');
	        	}
	        }
	});
}
/**
 * 管理pop界面
 */
function closeDlg(){
	$("#roleDlg").dialog('close');
}
