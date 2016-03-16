$(function(){
	//01：药品毒麻分类控制；02：患者付款类型与费用控制；03：医生职称与项目控制。
	
		$CommonUI.getDialog("#typedlg").dialog("move", {"top" : "50"});
		var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 15};
		var columns = [ [
		  	    	{field : "ck1",checkbox : true,width : 40,align : 'center'},
		  			{title : "唯一编码",field : "uuid",width : 40,align : 'center',hidden:true},
		  			{title : "类型",field : "ctrTypeid",width : 60,align : 'center',
		  				formatter: function(value,row,index){
		  		    	   if(value == 01){
		  		    		   return "药品毒麻分类控制";
		  		    	   }else if(value == 02){
		  		    		   return "患者付款类型与费用控制";
		  		    	   }else {
		  		    		   return "医生职称与项目控制";
		  		    	   }
		  		       }},
		  			{title : "关系编码",field : "ctrrElid",width : 20,align : 'center'},
		  			{title : "关系名称",field : "ctrRelname",width : 60,align : 'center'},
		  			{title : "序号",field : "rowno",width : 20,align : 'center'},
		  			{title : "控制范围",field : "ctrRange",width : 30,align : 'center',
		  				formatter: function(value,row,index){
			  		    	   if(value == 01){
			  		    		   return "门诊";
			  		    	   }else if(value == 02){
			  		    		   return "住院";
			  		    	   }else {
			  		    		   return "全院";
			  		    	   }
			  		       }
		  			},
		  			{title : "参数串",field : "parastr",width : 100,align : 'center'},
		  			{title : "控制结果",field : "ctrResult",width : 30,align : 'center',
		  				formatter: function(value,row,index){
			  		    	   if(value == 01){
			  		    		   return "允许";
			  		    	   }else if(value == 02){
			  		    		   return "提示";
			  		    	   }else {
			  		    		   return "禁止";
			  		    	   }
			  		       }
		  			},
		  			{title : "所属诊所",field : "orgidHosp",width : 40,align : 'center',hidden:true}
		  		] ];
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH+"/relation/queryRelationList.ajax?BLHMI=list";
		$CommonUI.datagrid('#condg', url, queryParams, columns, pageOpts, sortOpts,options);
		
});
/*删除*/
function DeleteCon(){
	if ($CommonUI.getDataGrid("#condg").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}
	$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
		var row = $CommonUI.getDataGrid("#condg").datagrid('getSelected');
		$.post($WEB_ROOT_PATH+"/relation/controlrelCtrl.ajax?BLHMI=delete",{'uuid': row.uuid},
			function(){
					   	$CommonUI.alert("删除成功!");
					   	$CommonUI.getDataGrid("#condg").datagrid('reload');
		},'json');
	});
}

/*条件查询*/
function querycon(){
	//var orgidHospA= $CommonUI.getComboBox('#hospSelect').combobox('getValue');
	var ctrTypeidA= $CommonUI.getComboBox('#ctrTypeidA').combobox('getValue');
	$CommonUI.getDataGrid('#condg').datagrid({
		url:$WEB_ROOT_PATH+"/relation/queryRelationList.ajax?BLHMI=findCon",
		queryParams:{page : 1,rows : 10,
			//"dto.relCtr.orgidHosp":orgidHospA,
			"ctrTypeid":ctrTypeidA
			}
	});
}

/*打开增加页面*/
function addcon(){
	$('#dlg').dialog('open').dialog('setTitle', '新增');
	$CommonUI.getForm('#conForm').form('clear');
	$('#ctrTypeid').combobox({disabled:false});
	$('#ctrRelname').removeAttr("readonly");
	$('#flg').val(1);//新增时为1
}
/*类型判断*/
var parctrFilter =function(){
	var ctrTypeidB = $('#ctrTypeid').combobox('getValue');
	//console.log(ctrTypeidB+" "+newValue+" "+oldValue);
	//if(ctrTypeidB=='01'){
	    $CommonUI.getComboGrid('#parastr').combogrid({  
	        panelWidth:450,  
	        multiple: true,
	        idField:'id',  
	        textField:'parameter', 
			toolbar:'#tb3',
	        url:$WEB_ROOT_PATH + '/relation/queryParctrList.ajax?page=1&rows=15&ctrTypeid='+ctrTypeidB, 
	        columns:[[  
                {field:'ck',checkbox:true},       
	            {field:'ctrTypeid',title:'类型编码',width:60},  
	            {field:'ctrTypeName',title:'类型名称',width:140},  
	            {field:'id',title:'参数编码',width:60},
	            {field:'parameter',title:'参数串',width:140}
	        ]]  
	    });  
//	}else if(ctrTypeidB=='02'){
//	    $CommonUI.getComboGrid('#parastr').combogrid({  
//	        panelWidth:450,  
//	        multiple: true,
//	        idField:'id',  
//	        textField:'parameter',
//			toolbar:'#tb3',
//	        url:$WEB_ROOT_PATH + '/relation/queryParctrList.ajax?ctrTypeid='+ctrTypeidB, 
//	        columns:[[  
//                {field:'ck',checkbox:true},       
//	            {field:'ctrTypeid',title:'类型编码',width:60},  
//	            {field:'ctrTypeName',title:'类型名称',width:140},  
//	            {field:'id',title:'参数编码',width:60},
//	            {field:'parameter',title:'参数串',width:140}
//	        ]]  
//	    });  
//	}else if(ctrTypeidB=='03'){
//	    $CommonUI.getComboGrid('#parastr').combogrid({  
//	        panelWidth:450,  
//	        multiple: true,
//	        idField:'id',  
//	        textField:'parameter',
//	        toolbar:'#tb3',
//	        url:$WEB_ROOT_PATH + '/relation/queryParctrList.ajax?ctrTypeid='+ctrTypeidB, 
//	        columns:[[  
//                {field:'ck',checkbox:true},       
//	            {field:'ctrTypeid',title:'类型编码',width:60},  
//	            {field:'ctrTypeName',title:'类型名称',width:140},  
//	            {field:'id',title:'参数编码',width:60},
//	            {field:'parameter',title:'参数串',width:140}
//	        ]]  
//	    });  
//	}
};
/*保存与更新*/
function saveupdate() {
	var isValid = $CommonUI.getForm('#conForm').form('validate');
	if (isValid) {
		if($('#flg').val()==1){
			postReq($WEB_ROOT_PATH
					+ '/relation/controlrelCtrl.ajax?BLHMI=save', '#conForm',
					success, err, {
						skipHidden : false,
				});
		}else{
			postReq($WEB_ROOT_PATH
					+ '/relation/controlrelCtrl.ajax?BLHMI=save', '#conForm',
					success, err, {
						skipHidden : false,
				});
		}
	} else {
		$CommonUI.alert("不能为空");
	}
}
/*打开修改页面*/
function updatecon() {
	$CommonUI.getForm('#conForm').form('clear');
	$('#flg').val(0);
	var selectedRow = $("#condg").datagrid('getSelected');
	if (selectedRow) {
		$("#uuid").val(selectedRow.uuid);
		$('#dlg').dialog('open').dialog('setTitle', '修改');
		//$('#ctrTypeid').combobox({disabled:true});
		$('#ctrTypeid').combobox('setValue', selectedRow.ctrTypeid,{disabled:true});//类型
		$("#ctrRelname").val(selectedRow.ctrRelname).attr("readonly","readonly");		
		$("#ctrrElid").val(selectedRow.ctrrElid);		
		$("#rowno").val(selectedRow.rowno);		
		$('#ctrRange').combobox('setValue', selectedRow.ctrRange);
		if(selectedRow.parastr!=undefined){
			$('#parastr').combogrid('setValues', selectedRow.parastr.split(","));//参数串
		}
		
		$('#ctrResult').combobox('setValue', selectedRow.ctrResult);
		} else {
			$CommonUI.alert("请选择一行记录");
		}
}

/*新增提示并重加载*/
function success(data) {
	$("#condg").datagrid('reload');
	$("#dlg").dialog('close');
	$CommonUI.alert("保存成功");
}

function err(){
	$CommonUI.alert("保存数据失败");
}
/*关闭按钮*/
function closeDlg(){
	 $('#dlg').dialog('close');
}
function ok(){
	$('#parastr').combogrid('hidePanel');
}
