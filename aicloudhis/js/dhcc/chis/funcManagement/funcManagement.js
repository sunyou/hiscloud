//页面初始化
$(function(){
		var options = {toolbar : "#funcManagement",height : 460,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 10};
		var columns = [ [
		                {field : 'ck', checkbox : true,width:40,align : 'center'},
		                {field : "funcId",title : "funcId",hidden:true},
		                {field : "funcName",title : "菜单名称",width:160,align : 'center'},		                
		     	        //{field : "isLeaf",title : "是否叶子节点",width:140,align : 'center'},
		     	        {field : "parentName",title : "上级菜单",width:140,align : 'center'},
		     	        {field : "securityUrl",title : "访问地址",width:180,align : 'center'},
		     	        {field : "isLeaf",title : "是否叶子节点",width:120,align : 'center',
		     	        	formatter:function(value,row,index){
		    		        	if (value=='0'){
		    		        		return "否";
		    		        	}else if(value=='1'){
		    		        		return "是";
		    		        	}else{
		    		        		return "";
		    		        	}
		    		        }
		     	        },
		     	        {field : "isstop",title : "状态",width:120,align : 'center',
		     	        	formatter:function(value,row,index){
		     	        		if (value=='1'){
		    		        		return "停用";
		    		        	}else if(value=='0'){
		    		        		return "公用菜单";
		    		        	}else  if(value=='2'){
		    		        		return "管理菜单";
		    		        	}else{
		    		        		return "";
		    		        	}
		    		        }	
		     	        }
		  		] ];
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH+"/privilege/funcManagementCtrl.ajax?BLHMI=funcList";
		$CommonUI.datagrid('#func', url, queryParams, columns, pageOpts, sortOpts,options);
		
		$("#leafY").click(function(){
			$("#leafN").attr('checked',false);
			$(this).attr('checked',true);
		});
		$("#leafN").click(function(){
			$("#leafY").attr('checked',false);
			$(this).attr('checked',true);
		});
});
/**
 * 查询功能
 * **/
function query(){
	var funcName = $("#funcName").val();
	var parentSeq  = $("#parentSeq").combobox('getValue');
	$CommonUI.getDataGrid('#func').datagrid({
    	url:$WEB_ROOT_PATH + "/privilege/funcManagementCtrl.ajax?BLHMI=funcList",
    	queryParams:{
			"funcName":funcName,
			"parentSeq":parentSeq,
			"pageSize": 10,  
			"pageNo": 1
    	}
    });	
	$CommonUI.getDataGrid('#func').datagrid('load', {  
		"funcName":funcName,
		"parentSeq":parentSeq,
		"pageSize": 10,  
		"pageNo": 1
	});     
}
/***
 * 新增菜单
 * 
 */
function addFunc(){
	$CommonUI.getForm('#funcForm').form('clear');
	$("#update").hide();
	$("#save").show();
	$("#close").show();
	
	$('#funcDlg').dialog('open').dialog('setTitle', '菜单信息');
	$("#funcDlg").dialog('open');
}
/**
 * 保存 
 */
function save(){
	var funcName = $("#funcNameT").val();
	if(funcName==""){
		$CommonUI.alert("菜单名称不可为空!");
		return;
	}
	var menuSeq = $("#menuSeq").val();
	if(menuSeq==""){
		$CommonUI.alert("排序不可为空!");
		return;
	}
	var parentSeq = $("#parentSeqT").combobox('getValue');
	if(parentSeq==""){
		$CommonUI.alert("上级菜单不可为空!");
		return;
	}
	var securityUrl = $("#securityUrl").val();
	if(securityUrl==""){
		$CommonUI.alert("访问地址不可为空!");
		return;
	}
	var useState = $("#useState").combobox('getValue');
	if(useState==""||useState==null){
		$CommonUI.alert("使用状态不可为空!");
		return;
	}
	var url = $WEB_ROOT_PATH + '/privilege/saveMenu.ajax?BLHMI=save';
	var allIsLeaf=document.getElementsByName("isLeaf");
	var isLeaf = '';
	if(allIsLeaf[0].checked){
		isLeaf='1';
	}else if(allIsLeaf[1].checked){
		isLeaf='0';
	}
	postReq(url, 'funcForm',succAdd, err, {skipHidden : false},{"isLeaf": isLeaf});
}
function err(){
	$CommonUI.alert("失败");
}
function succAdd(data) {
	$CommonUI.alert("添加菜单成功!");	
	$("#func").datagrid('reload');
	$('#funcDlg').dialog('close');
}
function succUpdate(data) {
	$CommonUI.alert("修改菜单成功!");	
	$("#func").datagrid('reload');
	$('#funcDlg').dialog('close');
}
function updateFunc(){
	var selectedRow = $("#func").datagrid('getSelected');
	$("#update").show();
	$("#save").hide();
	$("#close").show();
	if (selectedRow!=null && selectedRow!="") {
		$CommonUI.getForm('#funcForm').form('clear');
		$('#funcDlg').dialog('open').dialog('setTitle', '菜单信息');
		$("#funcDlg").dialog('open');
		var funcId = selectedRow.funcId;
		$.getJSON($WEB_ROOT_PATH+ "/privilege/getMenuInfo.ajax?seq="
				+ selectedRow.seq, function(data) {
			if(data != null){
				//var json = eval("("+data.toString()+")");   
				//alert(data.rows[0].parentSeq);
				$("#funcId").val(data.rows[0].funcId);
				$("#seq").val(data.rows[0].seq);
				$("#menuSeq").val(data.rows[0].funcOrder);
				
				$("#funcNameT").val(data.rows[0].funcName);
				$('#grade').val(data.rows[0].grade);
				var allIsLeaf=document.getElementsByName("isLeaf");
				if(data.rows[0].isLeaf == '1'){
					allIsLeaf[0].checked=true;
				}else if(data.rows[0].isLeaf == '0'){
					allIsLeaf[1].checked=true;
				}
				$('#parentSeqT').combobox('setValue',data.rows[0].parentSeq);
				$("#securityUrl").val(data.rows[0].securityUrl);
				$('#useState').combobox('setValue',data.rows[0].isstop);
			}			
		});
	}else{
		$CommonUI.alert("请选择一行记录");
	}
}
function update(){
	var seq = parseInt($("#seq").val());
	var funcName = $("#funcNameT").val();
	if(funcName==""){
		$CommonUI.alert("菜单名称不可为空!");
		return;
	}
	var menuSeq = $("#menuSeq").val();
	if(menuSeq==""){
		$CommonUI.alert("排序不可为空!");
		return;
	}
	var parentSeq = $("#parentSeqT").combobox('getValue');
	if(parentSeq==""){
		$CommonUI.alert("上级菜单不可为空!");
		return;
	}
	var securityUrl = $("#securityUrl").val();
	if(securityUrl==""){
		$CommonUI.alert("访问地址不可为空!");
		return;
	}
	var useState = $("#useState").combobox('getValue');
	if(useState==""||useState==null){
		$CommonUI.alert("使用状态不可为空!");
		return;
	}
	var url = $WEB_ROOT_PATH + '/privilege/saveMenu.ajax?BLHMI=update';
	var allIsLeaf=document.getElementsByName("isLeaf");
	var isLeaf = '';
	if(allIsLeaf[0].checked){
		isLeaf='1';
	}else if(allIsLeaf[1].checked){
		isLeaf='0';
	}
	postReq(url, 'funcForm',succUpdate, err, {skipHidden : false},{"isLeaf": isLeaf,"seq": seq});
}
function deleteFunc(){
	if ($CommonUI.getDataGrid("#func").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}
	var row = $("#func").datagrid('getSelected');
  	$CommonUI.confirm('删除不可恢复，确定删除吗？', 'question', 0, function(){
		$.post($WEB_ROOT_PATH+"/funcManagement/funcManagementCtrl.htm?BLHMI=delete",{
		     'dto.func.funcId':row.funcId},
		function(data){
			if(data!=null&&data!=""){
					   	$CommonUI.alert("删除成功!");
						$("#func").datagrid('reload');
			}
		},'json');
	});
}
function myclose(){
	 $('#funcDlg').dialog('close');
	 $("#func").datagrid('reload');
}
function clearFunc(){
	$CommonUI.getForm('#funcForm').form('clear');
}
