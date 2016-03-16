$(function(){
	var rows = $("#orgRelTypeDatagrid").datagrid('getRows');
	postReq($WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=list", '',
			function(msg){
				$('#orgRelDatagrid').datagrid('loadData',msg);
				postReq($WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=orgRelSublist", '',
						function(msg){
							$('#orgRelSubDatagrid').datagrid('loadData',msg);
				}, function(){}, {skipHidden : false},{"orgRelid":msg['rows'][0].orgRelid,page : 1,rows : 10});	
	}, function(){}, {skipHidden : false},{"orgreltypeid":rows[0].orgreltypeid,page : 1,rows : 10});
});

function query(){
	var orgRelatename = $("#orgRelatename").val();
	$CommonUI.getDataGrid('#orgRel').datagrid({
		url:$WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=list",
		queryParams:{
			"orgRelatename":orgRelatename,
			page : 1,rows : 10
		}
	});
}

function newOrgRel(){
	var row = $CommonUI.getDataGrid("#orgRelTypeDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择机构关系类型","info","",1000);
	}else{
		$CommonUI.getDialog("#newOrgRelDlg").dialog("move", {"top" : "0","left":"500"});
		$('#newOrgRelDlg').dialog('open').dialog('setTitle', '机构关系');
		$CommonUI.getForm('#orgRelForm').form('clear');
		$('#orgreltypeid').val(row.orgreltypeid);
		$('#orgreltypename').val(row.orgreltypename);
	}	
}

function newOrgRelSub(){
	var row = $CommonUI.getDataGrid("#orgRelDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择机构关系","info","",1000);
	}else{
		$CommonUI.getDialog("#newOrgRelSubDlg").dialog("move", {"top" : "0","left":"500"});
		$('#newOrgRelSubDlg').dialog('open').dialog('setTitle', '机构关系子表');
		$CommonUI.getForm('#orgRelSubForm').form('clear');
		$('#orgRelid2').val(row.orgRelid);
		$('#orgRelatename2').val(row.orgRelatename);
		$('#orgidHosp2').val($('#orgidHospHidden').val());
	}
	
}

function updateOrgRel(){
	var row = $CommonUI.getDataGrid("#orgRelDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择一种机构关系","info","",1000);
	}else{
		$CommonUI.getDialog("#newOrgRelDlg").dialog("move", {"top" : "0"});
		$('#newOrgRelDlg').dialog('open').dialog('setTitle', '机构关系定义');
		$CommonUI.getForm('#orgRelForm').form('clear');
		$('#orgRelid').val(row.orgRelid);
		$('#orgreltypeid').val(row.orgreltypeid);
		$('#orgreltypename').val(row.orgreltypename);
		$('#orgRelatename').val(row.orgRelatename);
		$('#inputstr').val(row.inputstr);
		$('#notedes').val(row.notedes);
		$("#controlElement").combogrid('setValues',row.controlElement.split(","));
	}
}

function updateOrgRelSub(){
	var row = $CommonUI.getDataGrid("#orgRelSubDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择一种机构关系子类","info","",1000);
	}else{
		$CommonUI.getDialog("#newOrgRelSubDlg").dialog("move", {"top" : "0"});
		$('#newOrgRelSubDlg').dialog('open').dialog('setTitle', '机构关系子类定义');
		$CommonUI.getForm('#orgRelSubForm').form('clear');
		
		$('#uuid').val(row.uuid);
		$('#orgRelid2').val(row.orgRelid);
		$('#orgRelatename2').val(row.orgRelatename);
		$('#orgid').combogrid('setValue',row.orgid);
		$('#orgRelRoleid').combobox('setValue',row.orgRelRoleid);
	}
}

function save(){
	var isValid = $CommonUI.getForm('#orgRelForm').form('validate');
	if (isValid) {
		postReq($WEB_ROOT_PATH + "/relation/orgRelCtrl.ajax?BLHMI=saveOrUpdateOrgRel", '#orgRelForm',
				function(){
			$CommonUI.autoCloseCenterMessage("保存成功","info","",1000);
			$('#newOrgRelDlg').dialog('close');
			$("#orgRelDatagrid").datagrid('reload');	
		}, function(){}, {skipHidden : false});
	} else {
		$CommonUI.autoCloseCenterMessage("不能为空","info","",1000);
	}
}

function saveOrgRelSub(){
	var isValid = $CommonUI.getForm('#orgRelSubForm').form('validate');
	if (isValid) {
		postReq($WEB_ROOT_PATH + "/relation/orgRelCtrl.ajax?BLHMI=saveOrUpdateOrgRelSub", '#orgRelSubForm',
				function(){
			$CommonUI.autoCloseCenterMessage("保存成功","info","",1000);
			$('#newOrgRelSubDlg').dialog('close');
			$("#orgRelSubDatagrid").datagrid('reload');	
		}, function(){}, {skipHidden : false});
	} else {
		$CommonUI.autoCloseCenterMessage("不能为空","info","",1000);
	}
}
function deleteOrgRel(){
	var row = $CommonUI.getDataGrid("#orgRelDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择一种机构关系","info","",1000);
	}else{
		$CommonUI.confirm("确定要删除吗?", 'question', '', function(){
			postReq($WEB_ROOT_PATH + '/relation/orgRelCtrl.ajax?BLHMI=deleteOrgRelAndSub', '',
					function(){
				$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
				$("#orgRelDatagrid").datagrid('reload');	
			}, function(){}, {skipHidden : false},{'orgRelid':row.orgRelid});
		});
	}
}

function deleteOrgRelSub(){
	var row = $CommonUI.getDataGrid("#orgRelSubDatagrid").datagrid('getSelected');
	if(row == null || row == undefined){
		$CommonUI.autoCloseCenterMessage("请选择一种机构关系子类","info","",1000);
	}else{
		$CommonUI.confirm("确定要删除吗?", 'question', '', function(){
			postReq($WEB_ROOT_PATH + '/relation/orgRelCtrl.ajax?BLHMI=deleteOrgRelSub', '',
					function(){
				$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
				$("#orgRelSubDatagrid").datagrid('reload');	
			}, function(){}, {skipHidden : false},{"uuid":row.uuid});
		});
	}
}

function orgRelTypeClickRow(rowIndex, rowData){
	$CommonUI.getDataGrid('#orgRelDatagrid').datagrid({
		url:$WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=list",
		queryParams:{
			"orgreltypeid":rowData.orgreltypeid,
			page : 1,rows : 10
		},
		onLoadSuccess:function(){
			var orgRelRows = $("#orgRelDatagrid").datagrid('getRows');
			if(orgRelRows[0] != undefined || orgRelRows[0] != null){
				$CommonUI.getDataGrid('#orgRelSubDatagrid').datagrid({
					url:$WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=orgRelSublist",
					queryParams:{
						"orgRelid":orgRelRows[0].orgRelid,
						page : 1,rows : 10
					}
				});
			}
		}
	});
}

function orgRelClickRow(rowIndex, rowData){
	$CommonUI.getDataGrid('#orgRelSubDatagrid').datagrid({
		url:$WEB_ROOT_PATH + "/relation/queryOrgRelationList.ajax?BLHMI=orgRelSublist",
		queryParams:{
			"orgRelid":rowData.orgRelid,
			 page : 1,rows : 10
		}
	});
}

function ok(){
	$('#controlElement').combogrid('hidePanel');
}
