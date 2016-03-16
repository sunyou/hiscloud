$(function(){
	//字典类型
	$CommonUI.getDialog("#typedlg").dialog("move", {"top" : "50"});
	dictList();
	
	//字典内容描述失去焦点时生成助记符
	$('#description').blur(function(){
		if($('#description') !=  undefined && $('#description') != null && $('#description').val().length > 0){
		   $('#inputstr').val(makePy($('#description').val()));
		 }
	});
});

function dictList(){
	
	var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [[
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     			{title : "类型",field : "dicType",width : 80,align : 'center'},
	     			{title : "代码",field : "value",width : 80,align : 'center'},
	     			{title:"描述",field:"description",width:80,align : 'center'},
	     			{title : "上级id",field : "upid",width : 200,align : 'center'},
	     			{title : "上级",field : "upDescription",width : 200,align : 'center'}
	     			]] ;
	var queryParams = {page : 1,rows : 15};
	var url = $WEB_ROOT_PATH + '/dict/getDictList.ajax';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	
}



function searchDict(){
	var type = $("#s_type").val();
	var value = $("#s_value").val();
	var description = $("#s_description").val();
	var itemDesc = $("#s_item_desc").val();
	var options = {toolbar : "#tb",height : 460,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15,page : 1,rows : 15};
	var columns = [[
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     			{title : "类型",field : "dicType",width : 80,align : 'center'},
	     			{title : "代码",field : "value",width : 80,align : 'center'},
	     			{title:"描述",field:"description",width:80,align : 'center'},
	     			{title : "上级id",field : "upid",width : 200,align : 'center'},
	     			{title : "上级",field : "upDescription",width : 200,align : 'center'}
	     			]] ;
	var queryParams = {page : 1,rows : 10,
			"dictType":type,
			"dictCode":value,
			"dictName":description,
			"dictDesc":itemDesc};
	var url = $WEB_ROOT_PATH + '/dict/getDictList.ajax';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	
	
	
	/*$CommonUI.getDataGrid('#dg').datagrid({
		url:$WEB_ROOT_PATH+"/dictionaryManage/dictionaryManageCtrl.htm?BLHMI=dictList",
		queryParams:{
			page : 1,rows : 10,
			"dto.dictionaryManageVo.type":type,
			"dto.dictionaryManageVo.value":value,
			"dto.dictionaryManageVo.description":description
		}
	});*/
}

/*打开新增字典页面*/
function newDictDlg(){	
	$('#dlg').dialog('open').dialog('setTitle', '新增字典');
	$CommonUI.getForm('#dictForm').form('clear');
	//$('#tpcodetypeid').removeAttr("readonly");
	//$('#dataTypeMy').val(1);
}

//选择上级字典 
var upDescClick  = function (rowIndex,rowData){
	$('#type').val(rowData.dicType); 
};

/*打开字典修改页面*/
function updateDictDlg() {
	//$('#dataTypeMy').val(0);
	var selectedRow = $("#dg").datagrid('getSelected');
	if (selectedRow) {
		$('#dlg').dialog('open').dialog('setTitle', '修改字典内容');
		var data="";
		$("#leaflag").attr("checked",false);
		$("#stopflag").attr("checked",false);
		$.getJSON($WEB_ROOT_PATH+ "/dict/updateDict.ajax?id="
			+ selectedRow.id, function(d) {
			data = d.rows;
			$("#id").val(data[0].id);
			$("#type").val(data[0].dicType);
			$("#description").val(data[0].description);
			$("#value").val(data[0].value);
			$("#upid").val(data[0].upid);
			$("#inputstr").val(data[0].inputstr);
			$("#itemDesc").val(data[0].itemDesc);
			if (data[0].grade!=null){
				$('#grade').combobox('setValue', data[0].grade);
			} else {
				$('#grade').combobox('setValue', '');
			}
			if (data[0].leaflag==1){
				$("#leaflag").attr("checked",true);
			} else {
				$("#leaflag").attr("checked",false);
			}
			if (data[0].stopflag==1){
				$("#stopflag").attr("checked",true);
			} else {
				$("#stopflag").attr("checked",false);
			}
			if (data[0].upid!=null){
				//combogrid必须value在前设置 text在后设置 否则页面id会被value覆盖
				$("#upDesc").combogrid('setValue',data[0].upid);
				$("#upDesc").combogrid('setText',data[0].upDescription);
			} else {
				$("#upDesc").combogrid('setValue','');
				$("#upDesc").combogrid('setText','');
			}
			
		});
			
	} else {
			$CommonUI.alert("请选择一行记录");
	}
}

function deleteDictDlg(){
	 if ($CommonUI.getDataGrid("#dg").datagrid('getSelections').length != 1) {
			$CommonUI.alert('请选择一条数据删除!');return;}
     	var row = $("#dg").datagrid('getSelected');
     	$CommonUI.confirm('删除不可恢复，确定删除吗？', 'question', 0, function(){
   		//先判断是否存在就诊记录
   		$.post($WEB_ROOT_PATH+"/dict/deleteDict.ajax",{
   		     'id':row.id},
   		function(d){
   			if(d!=null&&d!=""){
				   if(d['result']=='success'){//不存在就诊记录
					   	$CommonUI.alert("删除成功!");
						$("#dg").datagrid('reload');
						FindData();
				   }else{
					   $CommonUI.alert("删除失败，失败原因："+d['result']);
				   }
   			}
   		},'json');
   	});
}

/*字典的保存与更新*/
function saveDict() {
	 
	var isValid = $CommonUI.getForm('#dictForm').form('validate');
	if (isValid) { 
		var id = $('#id').val();
		var dicType = $('#type').val();
		var value = $('#value').val();
		var description = $('#description').val();
		var itemDesc = $('#itemDesc').val();
		var inputstr = $('#inputstr').val(); 
		var leaflag = $('#leaflag').val();
		var stopflag = $('#stopflag').val();
		var grade = $('#grade').val();
		var upid = $('#upDesc').combogrid('getValue');
		
		postReq($WEB_ROOT_PATH+ '/dict/saveDictionary.ajax',null, 
				succSaveDict, 
				errSaveDict,  
				{skipHidden:false},
				{
				'id':id,
				'dicType':dicType,
				'value':value,
				'description':description,
				'itemDesc':itemDesc,
				'inputstr':inputstr,
				'leaflag':leaflag,
				'stopflag':stopflag,
				'grade':grade,
				'upid':upid
				}
		);
 	} else {
		$CommonUI.alert("不能为空");
	}
}

/*保存或更新失败提示信息*/
function errSaveDict(){
	$CommonUI.alert("保存数据失败");
}

/*新增字典类型成功提示并重加载*/
function succSaveDict(data) {
	if(data.result='success'){
		$("#dg").datagrid('reload');
		$("#dlg").dialog('close');
	 	$CommonUI.alert("保存字典成功！");
	}else{
		$CommonUI.alert("保存字典失败！");
	}
	
}

/*字典类型关闭按钮*/
function closeDictDlg(){
	 $('#dlg').dialog('close');
}
