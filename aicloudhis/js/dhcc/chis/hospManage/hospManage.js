$(function(){
	var options = {toolbar : "#accountTb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : false};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     	    	{field : "ck1",checkbox : true,width : 60,align : 'center'},
//	     	    	{title : "tenantId",field : "tenantId",hidden:true},
	     	    	{title : "orgidHosp",field : "orgidHosp",hidden:true},
	     	    	{title : "诊所",field : "orgnameHosp",width: 260,align : 'center'},     	    	    	    		     	    	
	     			
	     			{title : "电话号码",field : "telephone",width : 200,align : 'center'},
	     			{title : "负责人",field : "artificialPerson",width : 120,align : 'center'},
	     			
	     			{title : "所属省份",field : "provincesname",width : 120,align : 'center'},
	     			{title : "所属市",field : "cityname",width : 120,align : 'center'},
	     			{title : "所在地区",field : "cityaeraname",width : 160,align : 'center'},
	     			{title : "状态",field : "state",width: 160,align : 'center'},
	     			{title : "状态",field : "useState",hidden:true}
	     			] ];
	var queryParams = {page : 1,rows : 15};
	var url = $WEB_ROOT_PATH+"/hosp/getHospList.ajax";
	$CommonUI.datagrid('#accountDg', url, queryParams, columns, pageOpts, sortOpts,options);
});

function findData(){
	var hospName = $("#hospName").val();
	$CommonUI.getDataGrid('#accountDg').datagrid({
		method:'post',
    	url:$WEB_ROOT_PATH+"/hosp/getHospList.ajax",
    	queryParams:{
			"hospName":hospName,
			"rows": 15,  
			"page": 1
    	}
    });	
	$CommonUI.getDataGrid('#accountDg').datagrid('load', {  
		method:'post',
		"hospName":hospName,
		"rows": 15,  
		"page": 1
	});     
}
function err(){
	$CommonUI.alert("失败");
}
function succUpdate(data) {
	if(data.result=="success"){
		$CommonUI.alert("状态更新成功!");	
		$("#accountDg").datagrid('reload');//重新加载
	}else{
		$CommonUI.alert("状态更新失败!");	
	}
	
}
function updateState(state){
	var selectedRow = $("#accountDg").datagrid('getSelected');
	if(selectedRow==null || selectedRow==""){
		$CommonUI.alert("请选择诊所");
		return;
	}
	var url = $WEB_ROOT_PATH + '/hosp/updateUseState.ajax';
	postReq(url, 'accountDg',succUpdate, err, {skipHidden : false},
			        {"orgidHosp": selectedRow.orgidHosp,
		             "state": state});
}
function sendMessage(){
	var selectedRow = $("#accountDg").datagrid('getSelected');
	if(selectedRow==null || selectedRow==""){
		$CommonUI.alert("请选择诊所");
		return;
	}
	$("#state").val(selectedRow.useState);
	$("#orgname").val(selectedRow.orgnameHosp);
	$("#telephone").val("");
	
	$('#sendDlg').dialog('open').dialog('setTitle', '短息发送窗口');
	$("#sendDlg").dialog('open');
	$CommonUI.getEdataGrid('#sendDg').datagrid({
		method:'get',
	    url:$WEB_ROOT_PATH+"/hosp/getEmpList.ajax",
	    fitColumns: true,
	    pagination: true,
	    height : 200,
		singleSelect: true,
		/*rownumbers: true,*/
	    columns:[[
	     	    	//{field : "ck1",checkbox : true,width : 50,align : 'center'},
	     			{title : "人员名称",field : "empName",width : 110,align : 'center'},
	     			{title : "登录名",field : "loginName",width : 70,align : 'center'},
	     			{title : "联系电话",field : "empTelenum",width:70,align : 'center'}
	     		   ]],
	    queryParams:{"rows": 10,  
			         "page": 1,
			         "orgidHosp": selectedRow.orgidHosp},
		onDblClickRow: function(rowIndex, rowData){
			var reg =/^(13|15|18)\d{9}$/;  
			if(rowData.empTelenum=="" || rowData.empTelenum==null){
				$CommonUI.alert("手机号码不存在!");
				return;
			}
			if(rowData.empTelenum.length!=11 || !reg.test(rowData.empTelenum)){
				$CommonUI.alert("手机号码不正确!");
				return;
			}
			var telephone = $("#telephone").val();
			if(telephone==""){
				$("#telephone").val(rowData.empTelenum);
			}else{
				$("#telephone").val(telephone+","+rowData.empTelenum);
			}
			
		}
	 });
	$CommonUI.getDataGrid('#sendDg').datagrid('load', {  
		"dto.pageModel.pageSize": 10,  
		"dto.pageModel.pageNo": 1,
		"dto.orgidHosp": selectedRow.orgidHosp
	});    
}
function succ(data) {
	if(data.result=="success"){
		$CommonUI.alert("发送成功!");
		$('#sendDlg').dialog('close');
	}else{
		$CommonUI.alert("发送失败，请稍后重试!");
	}
}
function send(){
	var url = $WEB_ROOT_PATH+"/hosp/sendMsg.ajax";
	var telephone = $("#telephone").val();
	var reg = /^((13|15|18)\d{9}\,)*(13|15|18)\d{9}$/;
	if(telephone==null||telephone==""){
		$CommonUI.alert("手机号码不可为空!");
		return;
	} 
	if(!reg.test(telephone)){
		$CommonUI.alert("输入不正确，请确认手机号码是否正确且手机号码之间用逗号相隔!");
		return;
	}
	postReq(url, '',succ, err, {skipHidden : false},{"telephone": telephone,"state":$("#state").val(),"orgnameHosp":$("#orgname").val()});
}





