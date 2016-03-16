$(function(){
	//科室下拉框
	$CommonUI.getComboBox('#orgSelect').combobox({  
	    url: $WEB_ROOT_PATH + '/agencyManage/findOrg.ajax?page=1&rows=10',
	    valueField:'orgid',  
	    textField:'orgname',  
	    editable:false
	}); 
	
	//人员列表datagrid
	var options_emp = {toolbar: "#empDgToolbar", height: 340, width: '100%', border: true, singleSelect: true, pagination: true, rownumbers: true,
			fitColumns: true,
			rowStyler:function(index,row,css){
				if(row.stopflag==1){
					return 'color:#FF0000;';
				}
			},
			onClickRow: function(rowIndex, rowData) {
				if($('#clickFlag').val() == rowData.empid){//防止多次点击同一行数据，防止发送多次请求
					return;
				}
				$('#clickFlag').val(rowData.empid);
				/*$.getJSON($WEB_ROOT_PATH + "/comDictList/comDictListCtrl.htm?BLHMI=listDictContent",
						{"dto.type": "medicaltype","dto.value": rowData.typeid},
						function(data){
							for(var i=0; i<data['total']; i++){
								data['rows'][i].selected = false;
							}
							$("#empTitleidT").combobox("loadData",data);
					});*/
				$CommonUI.getForm("#empForm").form('clear');
				$.getJSON($WEB_ROOT_PATH + "/agencyManage/findEmpByEmpid.ajax",
						{"hospid": $('#hospSelect').combobox('getValue'), "empidStr": rowData.empid},
						function(json){
							$('#empidT').val(json["rows"][0].empid);//人员ID
							$('#loginAccountidT').val(json["rows"][0].accountId);
							$('#empnameT').val(json["rows"][0].empName);//人员姓名
							$('#loginNameT').val(json["rows"][0].loginName).attr("disabled","disabled");//登陆名
							$('#empPwdT').val(json["rows"][0].empPwd).attr("disabled","disabled");//登陆密码
							$('#inputstrT').val(json["rows"][0].inputstr);//姓名字符
							$('#empTypeidT').combobox("setValue",json["rows"][0].empTypeid);//人员类型
							$('#empTitleidT').combobox("setValue",json["rows"][0].empTitleid);//职称
							$('#orgidT').combobox("setValue",json["rows"][0].orgid);//所属科室
							$('#orgnameT').val(json["rows"][0].orgname);//所属科室名称
							$('#empTelenumT').val(json["rows"][0].empTelenum);//电话
							$('#userAddrT').val(json["rows"][0].empAddr);//地址
							$("#stopflagT").attr("value",json["rows"][0].stopflag);//停止标志
				});
			}
	};
	var sortOpts_emp  ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var pageOpts_emp = {pageNumber : 1,pageSize : 10};
	var queryParams_emp  = { page: 1, rows: 10 };
	var columns_emp  =[[
       {title: "编号",field: "empid",width: 80,hidden:false},
       {title: "登陆名",field: "loginName",width: 80},
//       {title: "登陆密码",field: "empPwd",width: 40},
       {title: "姓名",field: "empName",width: 40},
       {title: "姓名字符",field: "inputstr",width: 40},
       {title: "类型",field: "empTypeid",width: 30},
       {title: "职称",field: "empTitleid",width: 45},
       {title: "所属科室",field: "orgname",width: 30	},
       {title: "联系电话",field: "empTelenum",width: 45},
       {title: "详细地址",field: "empAddr",width: 115},
       {title: "是否停止",field: "stopflag",width: 25,formatter: function(value,row,index){
    	  // if(value){ return '是'; }  else {  return "否"; }
    	   return (value)?'是':'否';
       }}
       ]];
	var url_emp  = $WEB_ROOT_PATH + "/agencyManage/empListByLoginHos.ajax";
	$CommonUI.datagrid('#empDg', url_emp, queryParams_emp, columns_emp, pageOpts_emp, sortOpts_emp, options_emp);

	//人员类型
	$CommonUI.getComboBox('#empTypeidT').combobox({  
		url: $WEB_ROOT_PATH + '/dict/getDictContentList.ajax?dictName=empType',
		//onSelect:onSelectEmpTypeid,
		mode:'remote',
		valueField:'value',
		textField:'description',
		pagination:false,
		editable:false,
		panelWidth: '105px',
		panelHeight:'auto',
		required: true
	});
	//人员职称
	$CommonUI.getComboBox('#empTitleidT').combobox({  
		url:$WEB_ROOT_PATH + '/dict/getDictContentList.ajax?dictName=empTitle',
		mode:'remote',
		valueField:'value',
		textField:'description',
		pagination:false,
		editable:false,
		panelHeight:'auto',
		multiple:false,
		required: true
	});
	//所属科室
	$CommonUI.getComboBox('#orgidT').combobox({  
	    url: $WEB_ROOT_PATH + '/agencyManage/findOrg.ajax?page=1&rows=10',
	    valueField: 'orgid',  
	    textField: 'orgname', 
	    editable:false,
	    required: true,
	    onSelect: function(rec){
	    	$('#orgnameT').val($('#orgidT').combobox('getText'));
	    }
	}); 
	
	$("#empnameT").blur(function(){
		$('#inputstrT').val(getLettersUpper($("#empnameT").val()));
	});
});

function queryEmp(){
	var orgid = $('#orgSelect').combobox('getValue');
	$CommonUI.getDataGrid('#empDg').datagrid('load',{'orgid':orgid});
}

//增加人员
function addEmp(){
	var isValid = $CommonUI.getForm('empForm').form('validate');
	if($('#empidT').val() != ""){
		$CommonUI.alert("请点击修改按钮进行修改操作！");
		return;
	}else if(isValid){
		var loginname = $('#loginNameT').val();
		var empid = $('#empidT').val();
		$.getJSON($WEB_ROOT_PATH + '/agencyManage/reLoginNameChk.ajax',
				{"loginNameStr": loginname, "empidStr": empid},
				function(data){
					if(data["chkLoginNameFlag"] == true){
						$CommonUI.alert("此登陆名已存在，请重新输入！");
					}else{
						postReq($WEB_ROOT_PATH + '/agencyManage/saveEmp.ajax?emp.stopflag='+$('#stopflagT').val(),'#empForm',
								function(){ 
									clearEmpForm();
									$CommonUI.alert("增加成功！");
									$('#empDg').datagrid('load');
								},
								function(){	$CommonUI.alert("增加失败！");},
								{skipHidden : false});	
					}
				});
	}
}

//修改人员信息
function updateEmp(){
	if($('#empDg').datagrid('getSelected')==null){
		$CommonUI.alert("请选择一个人员来进行修改！");
		return;
	}else{
		var loginname = $('#loginNameT').val();
		var empid = $('#empidT').val();
		$.getJSON($WEB_ROOT_PATH + '/agencyManage/reLoginNameChk.ajax',
				{"loginNameStr": loginname, "empidStr": empid},
				function(data){
					if(data["chkLoginNameFlag"] == true){
						$CommonUI.alert("此登陆名已存在，请重新输入！");
					}else {
						$('#loginNameT').removeAttr("disabled");
						$('#empPwdT').removeAttr("disabled");
						postReq($WEB_ROOT_PATH + '/agencyManage/saveEmp.ajax?emp.stopflag='+$('#stopflagT').val(),'#empForm',
								function(){ 
									clearEmpForm();
									$CommonUI.alert("修改成功！");
									$('#empDg').datagrid('reload');
								},
								function(){	$CommonUI.alert("修改失败！");},
								{skipHidden : false});
					}
				});
	}
}
/*
function onSelectEmpTypeid(record){
    var value = $('#empTypeidT').combobox('getValue');
    $('#empTitleidT').combobox('setValue', '');
    var data ={"total":0,"rows":[]};
    $("#empTitleidT").combobox("loadData",data);
    $.ajax({
    	 type: "GET",
		 url: $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&type=medicaltype&value="+value,
		 data: {},
         dataType: "json",
         success: function(data){
        	 $("#empTitleidT").combobox("loadData",data);
         }
    });
}
*/
//登录名称重复检测
function loginNameIsRepeat(){
	var loginname = $('#loginNameT').val();
	var empid = $('#empidT').val();
	$.getJSON($WEB_ROOT_PATH + '/agencyManage/reLoginNameChk.ajax',
			{"loginNameStr": loginname, "empidStr": empid},
			function(data){
				if(data["chkLoginNameFlag"] == true){
					$('#loginNameFlag').css("display","block");
				}else{
					$('#loginNameFlag').css("display","none");
				}
	});
}

function clearEmpForm(){
	if($('#empidT').val() != ''){
		$('#empDg').datagrid('load');
	}
	$('#loginNameT').removeAttr("disabled");
	$('#empPwdT').removeAttr("disabled");
	$CommonUI.getForm("#empForm").form('clear');
	$('#stopflagT').val("false");
}

//登陆密码是否显示明文
function changeType(){
	if($('#changCkb').prop("checked")){
		$('#empPwdT').prop("type","text");
	}else{
		$('#empPwdT').prop("type","password");
	}
}
