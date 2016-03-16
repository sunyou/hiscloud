var oldUpid="";
$(function() {
	var options = {toolbar : "#tabletoolbar",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : true,
	};
	var sortOpts = {remoteSort : false};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [[
	     			{title:"患者身份编码",field:"patientIdentityid",width:120,hidden: true,align : 'center'},
	     			{title : "患者身份名称",field : "patientIdentityname",width : 120,align : 'center'},
//	     			{title : "上级编码",field : "upid",width : 120,align : 'center'},
	     			{title : "上级编码",field : "upname",width : 120,align : 'center'},
	     			/*{title : "级次",field : "grade",width : 60,align : 'center',formatter: function(value,row,index){
	     				return "";
	     			}},*/
	     			{title : "叶子节点",field : "leaf",width : 40,align : 'center',formatter: function(value,row,index) {
	     				if(value) {
	     					return "否";
	     				} else {
	     					return "是";
	     				}
	     			}}
	     			]] ;
	var queryParams = {page : 1,rows : 15};
	var url = $WEB_ROOT_PATH + '/agencyManage/getPatientIdentityList.ajax';
	$CommonUI.datagrid('#listTb', url, queryParams, columns, pageOpts, sortOpts,options);

	//保存按钮
	$('#dlgBtnSave').click(function(){
		identitySaveOrUpdate();
	});
	//关闭弹窗
	$('#dlgBtnCancle').click(function(){
		$('#creatOrUpdateDlg').dialog('close');
	});
	
});
/*
//患者身份信息编码查重
function identityCodeCheck() {
	var identityCode = $('#idcode').val();
	var flag = $('#alertFlag').val();
	if(flag == 0 && identityCode != ""){
		$.getJSON($WEB_ROOT_PATH + '/patientIdentity/patientIdentityCtrl.htm?BLHMI=identityCodeCheck',
				{"patientIdentity.patientIdentityid":identityCode},
				function(d) {
					if(d["checkFlag"] == true){
						$('#identityCodeFlag').css("display","inline-block");
					}else{
						$('#identityCodeFlag').css("display","none");
					}
			});
	}else if(identityCode == ""){
		$CommonUI.alert("患者身份编码不能为空！");
	}
}
*/
//查询按钮
function search(){
	var patientIdentityName = $('#patientIdentityName').val();
	$CommonUI.getDataGrid('#listTb').datagrid({
		url:$WEB_ROOT_PATH + '/agencyManage/getPatientIdentityList.ajax',
		queryParams:{
			'patientIdentityname':patientIdentityName
		}
	});
}
//新建按钮
function creat(){
	$('#creatOrUpdateDlg').dialog('open').dialog('center').dialog('setTitle','新增患者身份');
	$CommonUI.getComboBox('#upid').combobox({  
		url: $WEB_ROOT_PATH + '/agencyManage/getPatientIdentityList.ajax',
		mode:'remote',
		valueField:'patientIdentityid',
		textField:'patientIdentityname',
		pagination:false,
		editable:false,
		panelWidth: '105px',
		panelHeight:'auto',
	});
	$CommonUI.getForm('#paIdentityForm').form('clear');
}
//修改按钮
function updatePatientIdentity(){
	var selected = $("#listTb").datagrid('getSelected');
	if(selected){
		$CommonUI.getComboBox('#upid').combobox({  
			url: $WEB_ROOT_PATH + '/agencyManage/getPatientIdentityList.ajax',
			mode:'remote',
			method:'post',
			valueField:'patientIdentityid',
			textField:'patientIdentityname',
			pagination:false,
			editable:false,
			panelWidth: '105px',
			panelHeight:'auto',
		});
		$('#creatOrUpdateDlg').dialog('open').dialog('center').dialog('setTitle','修改患者身份');
		$CommonUI.getForm('#paIdentityForm').form('clear');
		$.getJSON($WEB_ROOT_PATH+ "/agencyManage/getPatientIdentityList.ajax",
			{"patientIdentityid":selected.patientIdentityid},function(d) {
				if(d["rows"].length) {
					oldUpid=d["rows"][0].upid;
					$CommonUI.getComboBox('#upid').combobox('setValue', d["rows"][0].upid);
					$('#idcode').val(d["rows"][0].patientIdentityid);
					$('#idname').val(d["rows"][0].patientIdentityname);
				}
		});
	} else {
		$CommonUI.alert("请选择您想修改的数据！");
	}
}
//删除按钮
function deleteRecord() {
	var selected = $("#listTb").datagrid('getSelected');
	if (selected != null) {
		var patientIdentityid = selected.patientIdentityid;
		$.getJSON($WEB_ROOT_PATH+ "/agencyManage/getPatientIdentityList.ajax?leaf=1",
				{"patientIdentityid":patientIdentityid},function(d) {
			if(d["total"]){
				$CommonUI.alert("不是叶子节点，不可删除！");
			}else{
				$CommonUI.confirm("确定删除该条数据吗？", 'question', '是的', function(){
					postReq($WEB_ROOT_PATH + '/agencyManage/deletePatientIdentity.ajax','',
							function(){
						$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
						$('#listTb').datagrid('load');
					},'','',{'patientIdentityid':patientIdentityid,'upid':selected.upid});
				});
			}
		});
	} else {
		$CommonUI.alert("请选择一条需要删除的数据！");
	}
}
//弹窗保存按钮
function identitySaveOrUpdate(){
	var identityCode = $('#idcode').val();
	if($('#idname').val().replace(/\ /g,"")==''){
		$CommonUI.alert("请填写患者身份名称！");
		return;
	}
	postReq($WEB_ROOT_PATH + '/agencyManage/savePatientIdentityList.ajax',"#paIdentityForm",
			function(){
				$('#creatOrUpdateDlg').dialog('close');
				if(identityCode != null && identityCode != "" && identityCode != undefined){
					$CommonUI.autoCloseCenterMessage("修改成功！","info","",1000);
				}else{
					$CommonUI.autoCloseCenterMessage("保存成功！","info","",1000);
				}
				$('#listTb').datagrid('load');
				$CommonUI.getForm("#paIdentityForm").form('clear');
			},function() {
				$CommonUI.autoCloseCenterMessage("出错了！","info","",1000);
	},{skipHidden:false},{'filterStr': oldUpid});
}
