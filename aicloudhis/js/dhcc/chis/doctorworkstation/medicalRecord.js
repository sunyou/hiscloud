//门诊病历模板
$(function() {
	var pageheight =getIframeHeight()-60;
	$("#tabsResize").css("height",pageheight);
	$("#complainedAndcurrentDiseasesDiv").css("height",pageheight*0.3-20);
	$("#physicalDiv").css("height",pageheight*0.2-10);
	$("#diagnosisDiv").css("height",pageheight*0.5-30);
	$("#historyOrderDiv").css("height",(pageheight-30)*0.4);
	$("#historyOrder").datagrid({height:(pageheight-30)*0.4});
	$("#tabsOrderDiv").css("height",(pageheight-30)*0.6);
	$("#tabsOrder").css("height",(pageheight-30)*0.6);
	$("#doctorOrdersGrid1").datagrid({height:(pageheight-30)*0.6-60});
	$("#chinaMedicineGrid").datagrid({height:(pageheight-30)*0.6-80});
	$("#inspectionGrid").datagrid({height:(pageheight-30)*0.6-35});
	//$CommonUI.getDialog("#importTemplatedlg").dialog("move", {"top" : "20"});
	$CommonUI.placeholder();
	var options = {toolbar : "#tb",height :350,width : '100%',singleSelect : true,
	pagination : false,rownumbers : false,fitColumns : true,	onSelect:function(rowIndex, rowData){
		clear1();
		$.post($WEB_ROOT_PATH+ "/tregisterplan/templateByIdandName.ajax",
				{'templatename':rowData.templatename,
				'privtypeid':rowData.privtypeid},function(d){
					if(d!=null&&d!=""){	
						for (var i=0; i< d["total"]; i++) {
							var html="";
							if(d["rows"][0].appendTypeid != null) {
								if (d["rows"][i].appendTypeid=="01") {
									$('#patientComplaint1').val(d['rows'][i].appendContent);//主诉
									$('#uuid1').val(d['rows'][i].uuid);
								} else if(d["rows"][i].appendTypeid=="02") {
									$('#patientHistory1').val(d["rows"][i].appendContent);//现病史
									$('#uuid2').val(d['rows'][i].uuid);
								} else if(d["rows"][i].appendTypeid=="03") {
									$('#patientHistoryPast1').val(d["rows"][i].appendContent);//既往史
									$('#uuid3').val(d['rows'][i].uuid);
								}
							}
							$('#templatename').val(d['rows'][0].templatename);
							if(d['rows'][0].privtypeid=="个人"){
								$CommonUI.getComboBox('#privtypeid').combobox('setValue',"02");
							}
							else{
								$CommonUI.getComboBox('#privtypeid').combobox('setValue',"01");
							}
							$('#uid').html(html+='<input id="uuid'+i+'" name="dto.appendinfoTemplates['+i+'].uuid" type="hidden" value="'+d["rows"][i].uuid+'"/>');
						}
				}
		},'json');
	}};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 10};
	var columns = [ [  {title: "模板名称",field: "templatename",width: 70,align : 'center'},
	                   {title: "模板类型",field: "privtypeid",width: 70,align : 'center',formatter:function(value,row,index){ 
	     					if(row.privtypeid=='02'){
	     						return "个人";
	     					}else if(row.privtypeid=='01'){
	     						return "科室";
	     					}
	     				}}] ];
	var queryParams = {page : 1,rows : 10};
	var url = $WEB_ROOT_PATH + '/tregisterplan/templateList.ajax';
	$CommonUI.datagrid('#templagenamedg', url, queryParams, columns, pageOpts, sortOpts,options);
	$('#saveTemplate').click(function(){
		var tab = $CommonUI.getTabs('#tabsResize').tabs('getSelected');
		var index = $CommonUI.getTabs('#tabsResize').tabs('getTabIndex',tab);
		var patientid=$('#hiddenpatientId').val();
		if (patientid == null || patientid == '') {
			$CommonUI.alert("请先接诊一个患者");
		}else{
			if(index=="0"){
				$('#createOrSaveDlg').dialog('open');
				$('#patientComplaint1').val($('#patientComplaint').val());//主诉
				$('#patientHistory1').val($('#patientHistory').val());//现病史
				$('#patientHistoryPast1').val($('#patientHistoryPast').val());//既往史
				$('#templatename').val("");
				$CommonUI.getComboBox('#privtypeid').combobox('setValue',"02");
			}else{
				$CommonUI.alert("维护中");
			}
			
		}
	});
});

function importTemplate(){
	var tab = $CommonUI.getTabs('#tabsResize').tabs('getSelected');
	var index = $CommonUI.getTabs('#tabsResize').tabs('getTabIndex',tab);
	if(index==0){
	     clearing();
		 $('#importTemplatedlg').dialog('open').dialog('setTitle', '病历模板');
		 $('#patientComplaint1').val($('#patientComplaint').val());//主诉
		 $('#patientHistory1').val($('#patientHistory').val());//现病史
		 $('#patientHistoryPast1').val($('#patientHistoryPast').val());//既往史
	}else if(index==1){
		parent.showTemplate();
	}
}
function createOrSave(){
	$('#createOrSaveDlg').dialog('open');
	$('#templatename').val("");
	$CommonUI.getComboBox('#privtypeid').combobox('setValue',"02");
}

function saveTemplate1(){
	//按模板名称查询，如果为空，保存，不为空，是否覆盖，是，修改，否，请重新输入模板名称!
	$('#createOrSaveDlg').dialog('close');
	var isValid = $CommonUI.getForm('createTemplateForm').form('validate');
	if (isValid) {
		var patientComplaint1=$('#patientComplaint1').val();
		var patientHistory1=$('#patientHistory1').val();
		var patientHistoryPast1=$('#patientHistoryPast1').val();
		var templatename = $('#templatename').val();//模板名称
		var privtypeid = $CommonUI.getComboBox('#privtypeid').combobox('getValue');
		var selectedRow = $("#templagenamedg").datagrid('getSelected');
		if (selectedRow) {
			var templatename1=selectedRow.templatename.trim();
			$.post($WEB_ROOT_PATH+ "/tregisterplan/templateBy.ajax",
					{'templatename':templatename},function(d){
						if(d!=null&&d!=""){
							if(d['total']=='0'){
								postReq($WEB_ROOT_PATH+'/tregisterplan/saveTemplate.ajax', "#createTemplateForm",function(d){
									$CommonUI.alert("修改成功！");
									clear2();
									$("#templagenamedg").datagrid('reload');
								}, function(d){
									clear2();
									$CommonUI.alert("修改失败！");
								},{skipHidden : false},{"zs":patientComplaint1,"xbs":patientHistory1,
									"jws":patientHistoryPast1,"templatename":templatename,
									"privtypeid":privtypeid});
							}else if(d['total']=='1'){
								if(templatename1==templatename.trim()){
									postReq($WEB_ROOT_PATH+'/tregisterplan/saveTemplate.ajax', "#createTemplateForm",function(d){
										$CommonUI.alert("修改成功！");
										clear2();
										$("#templagenamedg").datagrid('reload');
									}, function(d){
										$CommonUI.alert("修改失败！");
										clear2();
									},{skipHidden : false},{"zs":patientComplaint1,"xbs":patientHistory1,
										"jws":patientHistoryPast1,"templatename":templatename,
										"appendinfoTemplate.privtypeid":privtypeid});
								}else{
									$CommonUI.alert("模板名称已存在,请重新输入模板名称！");
								}
							}
						}
					},'json');
		}else{
			$.post($WEB_ROOT_PATH+ "/tregisterplan/templateBy.ajax",
				{'templatename':templatename},function(d){
					if(d!=null&&d!=""){
						if(d['total']=='0'){
								var html = "";
								$('#uid').html(html);
								postReq($WEB_ROOT_PATH+ "/tregisterplan/saveTemplate.ajax", "#createTemplateForm",function(d){
									if(d['total']=='1'){
										$("#templagenamedg").datagrid('reload');
										$CommonUI.alert("保存成功");
										clear2();
									}
								},function(){
									$CommonUI.autoCloseCenterMessage("失败!","info","",500);
									clear2();
								},{skipHidden : false},{"zs":patientComplaint1,"xbs":patientHistory1,"jws":patientHistoryPast1,"templatename":templatename,"privtypeid":privtypeid});
						}
						else {
							$CommonUI.alert("模板名称已存在,请重新输入模板名称！");
						}
					}
				},'json');
			}
		}
	else {
		$CommonUI.alert("请修改页面的错误");
	}
}
function removeTemplate1(){
	var selectedRow = $("#templagenamedg").datagrid('getSelected');
	if (selectedRow) {
		var templatename= selectedRow.templatename;
		$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
			$.post($WEB_ROOT_PATH+'/tregisterplan/deleteTemplate.ajax',{'templatename':templatename,'privtypeid':selectedRow.privtypeid}, function (d){
				if(d!=null&&d!=""){
					if(d['total']==0){
						var html = "";
						$('#uid').html(html);
						$("#templagenamedg").datagrid('reload');
						$CommonUI.alert("删除成功");
					}
					else{$CommonUI.alert("删除失败");}}
					},'json');
		});
	}
}
function templateSearch(){
	var templatename=$('#templatename1').val();
	$CommonUI.getDataGrid('#templagenamedg').datagrid({
		url:$WEB_ROOT_PATH + '/tregisterplan/templateList.ajax',
		queryParams:{"templatename":templatename}
	});
	$('#patientComplaint1').val("");//主诉
	$('#patientHistory1').val("");//现病史
	$('#patientHistoryPast1').val("");//现病史
}

function inTemplate1(){
	var patientid=$('#hiddenpatientId').val();//病人ID
	var admisSerialno=$('#hiddenadmisSerialno').val();
	if(patientid == null || patientid == "" || admisSerialno == null || admisSerialno == "") {
		$CommonUI.alert("请选择一个患者接诊导入");
	}
	else{
		$('#patientComplaint').val($('#patientComplaint1').val());//主诉
		$('#patientHistory').val($('#patientHistory1').val());//现病史
		$('#patientHistoryPast1').val($('#patientHistoryPast1').val());//现病史
		$("#importTemplatedlg").dialog('close');
	}
}
function myclose(){
	 $('#createOrSaveDlg').dialog('close');
}
function clearing(){
	clear1();
	$('#uuid1').val("");//主诉
	$('#uuid2').val("");//现病史
	$('#uuid3').val("");//现病史
	$('#templatename').val("");
	$CommonUI.getComboBox('#privtypeid').combobox('setValue',"02");
	$("#templagenamedg").datagrid('reload');
}
function clear1(){
	$('#patientComplaint1').val("");//主诉
	$('#patientHistory1').val("");//现病史
	$('#patientHistoryPast1').val("");//现病史
}
function clear2(){
	$('#uuid1').val("");//主诉
	$('#uuid2').val("");//现病史
	$('#uuid3').val("");//现病史
	$('#templatename').val("");
	$CommonUI.getComboBox('#privtypeid').combobox('setValue',"02");
}
