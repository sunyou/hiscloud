$(function(){
	
		$CommonUI.getDialog("#typedlg").dialog("move", {"top" : "50"});
		var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 15};
		var columns = [ [
		  	    	{field : "ck1",checkbox : true,width : 40,align : 'center'},
		  			{title : "机构编码",field : "orgid",width : 40,align : 'center'},
		  			{title : "机构名称",field : "orgname",width : 40,align : 'center'},
		  			{title : "级次",field : "grade",width : 40,align : 'center',hidden:true},
		  			{title : "是否子节点",field : "leaf",width : 40,align : 'center',
		  				formatter: function(value,row,index){
		  		    	   if(value == 1){
		  		    		   return "是";
		  		    	   }else {
		  		    		   return "否";
		  		    	   }
		  		       }
		  			},
		  			{title : "输入串",field : "inputstr",width : 40,align : 'center'},
		  			{title : "机构类型",field : "orgtypename",width : 40,align : 'center'},
		  			{title : "上级id",field : "upid",width : 40,align : 'center'},
		  			{title : "上级",field : "upname",width : 40,align : 'center'},
	     	        {title : "状态",field : "isstop",width:40,align : 'center',
		  				formatter: function(value,row,index){
			  		    	   if(value == 1){
			  		    		   return "使用";
			  		    	   }else {
			  		    		   return "停用";
			  		    	   }
			  		       }	
	     	        },

		  			/*{title : "机构地址",field : "orgaddress",width : 40,align : 'center'},
		  			{title : "所属诊所",field : "orgId_hosp",width : 40,align : 'center'},*/			    		
		  		] ];
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH+"/agencyManage/findOrg.ajax";
		$CommonUI.datagrid('#orgdg', url, queryParams, columns, pageOpts, sortOpts,options);
		//机构类型
		$CommonUI.getComboBox('#orgtypeId').combobox({  
			url: $WEB_ROOT_PATH + '/dict/getDictContentList.ajax?dictName=orgType',
			mode:'remote',
			valueField:'value',
			textField:'description',
			editable:true,
			panelWidth: '105px',
			panelHeight:'auto'
		});
});

//条件查询
function queryAgency(){
	var orgnameA = $("#orgnameB").val();//机构名称
	$CommonUI.getDataGrid('#orgdg').datagrid({
		url:$WEB_ROOT_PATH+"/agencyManage/findOrg.ajax",
		queryParams:{page : 1,rows : 10,
			"orgname":orgnameA,}
	});
}

/*打开增加页面*/
function addAgency(){
	$('#dlg').dialog('open').dialog('setTitle', '新增');
	$CommonUI.getForm('#orgForm').form('clear');
	//$('#orgid').removeAttr("readonly");
	$('#flg').val(1);//新增时为1
}

/*保存与更新*/
function saveupdate() {
	var upid = $('#upDesc').combogrid('getValue');
	$('#upid').val(upid);
	
	var isValid = $CommonUI.getForm('#orgForm').form('validate');
	var leaf = $("#leaf").val();
	if (isValid) {
		var upname = $('#upDesc').combogrid('getText');
		$('#upname').val(upname);

		if($('#flg').val()==1){
			postReq($WEB_ROOT_PATH
					+ '/agencyManage/saveOrg.ajax?org.leaf='+leaf, '#orgForm',
					successOrg, err, {
						skipHidden : false,
				});
		}else{

			postReq($WEB_ROOT_PATH
					+ '/agencyManage/saveOrg.ajax?org.leaf='+leaf, '#orgForm',
					successOrg, err, {
						skipHidden : false,
				});
		}
	} else {
		$CommonUI.alert("不能为空");
	}
	
}

/*打开修改页面*/
function updateAgency() {
	$('#flg').val(0);//修改时为0
	var selectedRow = $("#orgdg").datagrid('getSelected');
	if (selectedRow) {
		$('#dlg').dialog('open').dialog('setTitle', '修改');		
		var data="";
		$("#leaf").attr("checked",false);
		$.getJSON($WEB_ROOT_PATH+ "/agencyManage/findDictById.ajax?orgid="
			+ selectedRow.orgid, function(d) {
			data = d.rows;
			$("#orgid").val(data[0].orgid).attr("readonly","readonly");
			$("#orgname").val(data[0].orgname);
			if (data[0].grade!=null){
				$('#grade').combobox('setValue', data[0].grade);
			} else {
				$('#grade').combobox('setValue', '');
			}
			if (data[0].leaf==1){
				$("#leaf").attr("checked",true);
			}else {
				$("#leaf").attr("checked",false);
			}
			$("#upid").val(data[0].upid);
			$("#inputstr").val(data[0].inputstr);
			//$("#isstop").val(data[0].inputstr);
			
			if (data[0].orgtypeId!=null){
				$('#orgtypeId').combobox('setValue', data[0].orgtypeId);
			} else {
				$('#orgtypeId').combobox('setValue', '');
			}
			
			if (data[0].isstop!=null){
				$('#isstop').combobox('setValue', data[0].isstop);
			} else {
				$('#isstop').combobox('setValue', '');
			}
			
			$("#upDesc").combogrid('setText',data[0].upname);
			if (data[0].upid!=null){
				//combogrid必须value在前设置 text在后设置 否则页面id会被value覆盖
				$("#upDesc").combogrid('setValue',data[0].upid);
				$("#upDesc").combogrid('setText',data[0].upname);
			} else {
				$("#upDesc").combogrid('setValue','');
				$("#upDesc").combogrid('setText','');
			}
			
		});
			
	} else {
			$CommonUI.alert("请选择一行记录");
	}
}
/*新增提示并重加载*/
function successOrg(data) {
	$("#orgdg").datagrid('reload');
	$("#dlg").dialog('close');
	$CommonUI.alert("保存成功");
}

function err(){
	$CommonUI.alert("保存数据失败");
}

/*关闭按钮*/
function closeDictDlg(){
	 $('#dlg').dialog('close');
}
