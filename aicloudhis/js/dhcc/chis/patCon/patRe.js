var flag="1";
$(function(){
	$CommonUI.getDialog("#dlg").dialog("move", {"top" : "30"});
	var options = {toolbar : "#tb",height : 470,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     			{title : "姓名",field : "patientName",width : 80,align : 'center'},
	     			{title : "性别",field : "patientSexid",width : 80,align : 'center'},
	     			{title : "年龄",field : "age",width:80,align : 'center'},
	     			{title : "证件号码",field : "icard",width : 200,align : 'center',
	     				formatter:function(value,row,index){ 
	     					var str=row.icard;
	     					if(str!=""&&str!=null){
	     						if(str.length==18){
	     							return str.substr(0,6)+"********"+str.substr(str.length-4);
	     						}
	     						else if(str.length==15){
	     							return str.substr(0,6)+"******"+str.substr(str.length-3);
	     						}
 							}
	     				}
	     			},
	     			
	     			{title : "移动电话",field : "patientTelephone",width : 150,align : 'center'},
	     			{title : "详细地址",field : "streetinfo",width : 250,align : 'center',
	     				formatter:function(value,row,index){
	     				    var familyAddress = ""; 
	     				    if(row.provinCesidname != null){
	     				    	familyAddress+=row.provinCesidname;
	     				    }
	     				    if(row.cityidname != null){
	     				    	familyAddress+=row.cityidname;
	     				    }
	     				    if(row.cityaeraidname != null){
	     				    	familyAddress+=row.cityaeraidname;
	     				    }
	     				    if(row.streetinfoname != null){
	     				    	familyAddress+=row.streetinfoname;
	     				    }
	     				
	     				   return "<div align='left'>"+familyAddress+"</div>"; 
     						    					
	     				}},
	     			{title : "创建时间",field : "createDatetime",width : 150,align : 'center',
	     					formatter:function(value,row,index){ 
	     						if(row.createDatetime!=""&&row.createDatetime!=null){
	     							var createDatetime = value.substr(0,10);
	     							return createDatetime;
	     						}
	     					}
	     				},
	     			{title : "症状",field : "diagName",width : 150,align : 'center',hidden:true},
	     			{title : "操作",field : "lookRecord",width : 120,align : 'center',formatter:function(value,row,index){
	     				var familyAddress=row.provinCesid+row.cityid+row.cityaeraid+row.streetinfo;
	     				//return a = '<a href="javascript:void(0)" onclick="treats(\''+row.patientid+'\')">诊疗</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="javascript:void(0)" onclick="look(\''+row.patientid+'\',\''+familyAddress+'\')">就诊记录</a>';
	     				return a = '<a href="javascript:void(0)" onclick="look(\''+row.patientid+'\',\''+familyAddress+'\')">就诊记录</a>';
	     			}}]];
	var queryParams = {page : 1,rows : 15};
	var url = $WEB_ROOT_PATH + '/patientManage/getPatientList.ajax';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	$("#familyCheck").click(function() {
		  var val = $(this).val();
		  if (val==0) {
			$("#familyCheck").attr("checked","checked");
			$("#familyCheck").val(1);
			$("#family").show();
		} else {
			$("#familyCheck").removeAttr("checked");
			$("#familyCheck").val(0);
			$("#family").hide();
		}
	});
	$("#contactCheck").click(function() {
		var val = $(this).val();
		if (val==0) {
			$("#contactCheck").attr("checked","checked");
			$("#contactCheck").val(1);
			$("#contact").show();
		} else {
			$("#contactCheck").removeAttr("checked");
			$("#contactCheck").val(0);
			$("#contact").hide();
		}
	});
	
});

function setIdentityname(){
	var patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
	$('#patientIdentityname').val(patientIdentityname);
}

function treats(patientid){
	var guide1="<ul class='breadcrumb'><li class='active only'>";
	var guide2="<span class='divider'>/</span></li> </ul> ";
	var div_space="<div style='height:10px'></div>";
	var title="";
	if(parent.treatmentURL!=""&&parent.treatmentURL!=undefined){
		title="诊疗管理";
		parent.$("#guide").html(guide1+title+guide2+div_space);
		parent.patientFlag="1";
		parent.patientId=patientid;
		parent.document.getElementById("pageFrame").src=parent.treatmentURL;
		
	}else{
		$CommonUI.alert("诊疗失败!","","提示");
	}
}
function FindData() {	
	var patName = $("#patName").val();
	var myPatientTelephone = $("#patPhone").val();
	var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15,page : 1,rows : 15};
	var columns = [ [
		     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
		     			{title : "姓名",field : "patientName",width : 80,align : 'center'},
		     			{title : "性别",field : "patientSexid",width : 80,align : 'center'},
		     			{title : "年龄",field : "age",width:80,align : 'center'},
		     			{title : "证件号码",field : "icard",width : 200,align : 'center'},
		     			{title : "移动电话",field : "patientTelephone",width : 150,align : 'center'},
		     			{title : "详细地址",field : "streetinfo",width : 250,align : 'center',
		     				formatter:function(value,row,index){ 
		     				 
		     					 var familyAddress = ""; 
			     				    if(row.provinCesidname != null){
			     				    	familyAddress+=row.provinCesidname;
			     				    }
			     				    if(row.cityidname != null){
			     				    	familyAddress+=row.cityidname;
			     				    }
			     				    if(row.cityaeraidname != null){
			     				    	familyAddress+=row.cityaeraidname;
			     				    }
			     				    if(row.streetinfo != null){
			     				    	familyAddress+=row.streetinfo;
			     				    }
		     					
		     					return familyAddress;
		     				}},
		     			{title : "创建时间",field : "createDatetime",width : 150,align : 'center',
		     					formatter:function(value,row,index){ 
		     						if(row.createDatetime!=""&&row.createDatetime!=null){
		     							var createDatetime = value.substr(0,10);
		     							return createDatetime;
		     						}
		     					}
		     				}, 	     			
		     			{title : "操作",field : "lookRecord",width : 120,align : 'center',formatter:function(value,row,index){
			     			var familyAddress=row.provinCesid+row.cityid+row.cityaeraid+row.streetinfo;
			     			return a = '<a href="javascript:void(0)" onclick="treats(\''+row.patientid+'\')">诊疗</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="javascript:void(0)" onclick="look(\''+row.patientid+'\',\''+familyAddress+'\')">就诊记录</a>';
			     		}}]];
	var queryParams = {"patientName":patName,
					   "patientEname":patName,
					   "inputstr":patName,
			           "patientTelephone":myPatientTelephone};
	var url = $WEB_ROOT_PATH + '/patientManage/getPatientList.ajax';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
}
//新增患者
function createPatient(){
	document.getElementById('family').style.display='none';
	document.getElementById('contact').style.display='none';
	$CommonUI.getForm('#createForm').form('clear');
	$('#dlg').dialog('open').dialog('setTitle', '新增患者信息');
	clearValidata();
	$CommonUI.getComboBox('#patientIdentityid').combobox({ 
	    url: $WEB_ROOT_PATH + '/patientManage/getDefaultValueWhenCreatePatient.ajax',
	    valueField:'patientIdentityid',  
	    textField:'patientIdentityname'  
	});  
}

function ename(){
	var patientName = $('#createForm input[name="patientName"]').val();
	var patientEname=getLettersUpper(patientName);
	$('#patientEname').val(patientEname);
}

//根据输入的年龄生成出生日期
function createBirthday(){
	if($('#age').val() < 0 || $('#age').val() > 150){
		$CommonUI.alert('请输入正确的年龄！','error');
		$('#age').val('');
		$('#birthDate').datebox('setValue','');
		return;
	}
	var birYear = new Date().getFullYear()-$('#age').val();
	if($('#birthDate').datebox('getValue') == ''){
		$('#birthDate').datebox('setValue',birYear+'-01-01');
	}else{
		$('#birthDate').datebox('setValue',birYear+$('#birthDate').datebox('getValue').substring(4));
	}
}

var count=0;
function saveCreate() {
	var isValid = $CommonUI.getForm('createForm').form('validate');
	if (isValid) {
		var patientid = $('#createForm input[name="patientid"]').val();
		if (patientid == "" || patientid == null) {
			var patientName = $('#createForm input[name="patientName"]').val();
			var arrRslt = makePy(patientName); 
			$('#inputstr').val(arrRslt);
			$.post($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax",{"patientName":patientName},function(d){
				if(d!=null&&d!=""){
					if(d['total']!=0){
						$CommonUI.confirm(patientName+"已存在，是否创建", 'question', '确定', function(){
							patientNameConfirm();
						}, '取消', function(){
							return;
						});
					}else{
						patientNameConfirm();
					}
				}
			},"json");
		}else {
			/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
			$('#patientIdentityname').val(patientIdentityname);*/
			/*var patientTelephone = $('#createForm input[name="patientTelephone"]').val();
			if(patientTelephone.length!=11){
				$CommonUI.alert("请输入有效的移动电话");
				return;
			}
			var phone= mobilePhoneCheck(patientTelephone);
			if(phone==false){
				$CommonUI.alert("请输入正确的移动电话");
				return;
			}*/
			var icard = $('#createForm input[name="icard"]').val();
			if (icard == "" || icard == null) {
				changeImg();
				var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
					return;
				}
				postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=update', 'createForm',
						succUpdate, err, {skipHidden : false});
			}else{
				var idcardTypeid = $('#idcardTypeid').combobox('getValue'); 
				if(idcardTypeid == "01"){					
					if(icard.length==15){
						 var icard1= checkCardId1(icard);
						 checkCardId(icard1);
					}else{
						checkCardId(icard);
					}
				}else{
					flag=="1";
				}
				if(flag=="0"){
					$CommonUI.alert("输入身份证号码格式不正确!");
					return;
				}
				if(flag=="1"){
					//身份证才做处理
					if(idcardTypeid == "01"){
						if(icard.length==15){
							 var icard1= checkCardId1(icard);
							 icard= icard1;
						}
						var sex=getPersonSexByIdcard(icard);//身份证查询性别
						var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
						if(sex=="男"){
							$('#patientSexId').combobox('setValue',1);
						}
						else{
							$('#patientSexId').combobox('setValue',2);
						}
						sex=sex+"性";
						$('#patientSexId').combobox('setText',sex);
						$('#patientSename').val(sex+"性");
						changeImg();
						$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
					}  
					var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
					var today = formatterDate(new Date());
					var compare=dateCompare(birthDate,today);
					if(compare=='1'){
						$CommonUI.alert("请选择正确的出生日期!");
						return;
					}
					var icard = $('#createForm input[name="icard"]').val();
					$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax?icard="+ icard, function(d) {
						if(d!=null&&d!=""){
							if(d['total']==1||d['total']==0){
								/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
								$('#patientIdentityname').val(patientIdentityname);*/
								postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=update', 'createForm',
										succUpdate, err, {skipHidden : false});
							}
							else{
								$CommonUI.alert("身份证信息已存在!");
							}
						}
					});
					}
				}
			}
		} 
	else {
		$CommonUI.alert("红色为必填项");
	}
}
function updatePatient() {
	var selectedRow = $("#dg").datagrid('getSelected');
	if (selectedRow) {
		document.getElementById('family').style.display='none';
		document.getElementById('contact').style.display='none';
		$('#dlg').dialog('open').dialog('setTitle', '修改登记信息');
		clearValidata();
		$CommonUI.getForm('#createForm').form('clear');
		var patientid = selectedRow.patientid; 
		$("#patientid").attr("value", patientid);
		changeImg();
		$CommonUI.getComboBox('#patientIdentityid').combobox({ 
		    url: $WEB_ROOT_PATH + '/patientManage/getDefaultValueWhenCreatePatient.ajax',
		    valueField:'patientIdentityid',  
		    textField:'patientIdentityname'  
		});  
		$.getJSON($WEB_ROOT_PATH+"/patientManage/getPatientById.ajax?patientid="
				+ patientid, function(d) {
			    
				$('#createForm input[name="patientName"]').val(d['rows'][0].patientName);
				$('#patientEname').val(d['rows'][0].patientEname);
				$('#patientTelephone').numberbox('setValue',d['rows'][0].patientTelephone);
				//$('#createForm input[name="patientTelephone"]').val(d['dto.patient'].patientTelephone);
				if(d['rows'][0].idcardTypeid!=null&&d['rows'][0].idcardTypeid!=""){
					$('#idcardTypeid').combobox('setValue',d['rows'][0].idcardTypeid);
					$('#icard').val(d['rows'][0].icard);
				}
				$('#patientSexId').combobox('setValue',d['rows'][0].patientSexid);
				changeImg();
				$('#age').numberbox('setValue',selectedRow.age); 
				$CommonUI.getDateBox('#birthDate').datebox('setValue', d['rows'][0].birthDate);
				$('#patientIdentityid').combobox('setValue',d['rows'][0].patientIdentityid);
				$('#patientIdentityname').val(d['rows'][0].patientIdentityname);
				$('#createForm input[name="patientIdentityname"]').val(d['rows'][0].patientIdentityname);
				$('#marriedid').combobox('setValue',d['rows'][0].marriedid);
				$('#nationalityid').combobox('setValue',d['rows'][0].nationalityid);
				$('#occupationid').combobox('setValue',d['rows'][0].occupationid);
				//地址回显示处理，先加载所有，再定位到自己
				if(d['rows'][0].countryid !=null && d['rows'][0].countryid!=""){
					$('#countryid').combobox('setValue',d['rows'][0].countryid);
					var value = $('#countryid').combobox('getValue');
				    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?&dictName=area&upid="+value;
				    $('#provinCesid').combobox('setValue', "");  
				    $('#provinCesid').combobox('reload', url); 
					if(d['rows'][0].provinCesid != null && d['rows'][0].provinCesid!=""){
						$('#provinCesid').combobox('setValue',d['rows'][0].provinCesid);
						var value = $('#provinCesid').combobox('getValue');
					    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?&dictName=area&upid="+value;
					    $('#cityid').combobox('setValue', "");  
					    $('#cityid').combobox('reload', url); 
						if(d['rows'][0].cityid != null && d['rows'][0].cityid!=""){
							$('#cityid').combobox('setValue',d['rows'][0].cityid);
							var value = $('#cityid').combobox('getValue');
						    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?&dictName=area&upid="+value;
						    $('#cityaeraid').combobox('setValue', "");  
						    $('#cityaeraid').combobox('reload', url);  
							$('#cityaeraid').combobox('setValue',d['rows'][0].cityaeraid);
						}
					}
				}
				$('#inputstr').val(d['rows'][0].inputstr);
				$('#streetinfo').val(d['rows'][0].streetinfo);
				$('#flPostcode').val(d['rows'][0].flpostcode);
				$('#entName').val(d['rows'][0].entName);
				$('#entContactor').val(d['rows'][0].entContactor);
				$('#entAddr').val(d['rows'][0].entAddr);
				$('#entTelenum').val(d['rows'][0].entTelenum);
				$('#entPostcode').val(d['rows'][0].entPostcode);
				$('#ctName').val(d['rows'][0].ctName);
				$('#ctRoleid').val(d['rows'][0].ctRoleid);
				$('#ctAddr').val(d['rows'][0].ctAddr);
				$('#ctElenum').val(d['rows'][0].ctElenum);
				$('#createDatetime').val(d['rows'][0].createDatetime);
				$('#note').val(d['rows'][0].note);
			//	$('#createForm input[name="patientName"]').attr("readonly","readonly");
				
			});
		} else {
			$CommonUI.alert("请选择一行记录修改！");
		}
}
function err(){
	$CommonUI.alert("失败");
}
function succUpdate(d) {
	if(d!=null&&d!=""){
		if(d['dto.patient'].patientid!=null){
			$CommonUI.alert("修改成功!");
		}
	}
	$("#dg").datagrid('reload');
	$("#dlg").dialog('close');
}
//回调函数
function succAdd(d) {
	if(d!=null&&d!=""){
		 
		if(d.result=="success"){
			if(d.msgCode != null && d.msgCode != ""){
				$CommonUI.alert(d.msgCode);
			}else{
				$CommonUI.alert("新增患者信息成功!");
				$("#dg").datagrid('reload');
				try {
					patientList(); //只有首页面才有此方法
				} catch (e) {					 
				}
				
				$("#dlg").dialog('close');
			}
		}
	}  	
}
 

function myclose(){
	 $('#dlg').dialog('close');
	 $("#dg").datagrid('reload');
}
function onSelectCity(record){
	var value = $('#cityid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?&dictName=area&upid="+value;
//    if($('#cityaeraid').combobox('getValue')!=null&&$('#cityaeraid').combobox('getValue')!=""){
//    	$CommonUI.alert("请正确输入区县");
//    }
    $('#cityaeraid').combobox('setValue', "");  
    $('#cityaeraid').combobox('reload', url);  
}
function onSelectProvice(record){
	var value = $('#provinCesid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?&dictName=area&upid="+value;
    $('#cityid').combobox('setValue', "");  
    $('#cityaeraid').combobox('setValue', "");
    $('#cityid').combobox('reload', url); 
}
function onSelectCountry(record){
	debugger;
	var value = $('#countryid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/dict/getDictContentList.ajax?dictName=area&upid="+value;
    $('#provinCesid').combobox('setValue', "");  
    $('#cityid').combobox('setValue', ""); 
    $('#cityaeraid').combobox('setValue', "");  
    $('#provinCesid').combobox('reload', url);  
}
function upperCase(){
	flag="1";
	var icard= $('#icard').val();
	if (icard == "" || icard == null) {
		return;
	}else{
		var idcardTypeid= $('#idcardTypeid').combobox('getValue');
		if (idcardTypeid == "" || idcardTypeid == null) {
			$CommonUI.alert("请选择证件类型！");
			return;
		}else{
			//证件类型为身份证时才对性别、出生日期进行初始化
			var certType = $('#idcardTypeid').val();
			if(certType == "01"){
				if(icard.length==15){
					 var icard1= checkCardId1(icard);
					 icard =icard1;
				}
				checkCardId(icard);
				var sex=getPersonSexByIdcard(icard);//身份证查询性别
				var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
				if(sex=="男"){
				$('#patientSexId').combobox('setValue',1);
				}
				else{
					$('#patientSexId').combobox('setValue',2);
				}
				sex=sex+"性";
				$('#patientSexId').combobox('setText',sex);
				$('#patientSename').val(sex);
				$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
				changeImg();
			}			
		}
	}
}

//屏蔽多余空格
function replace(mthis){
	/*var result=$(mthis).attr("value").replace(/(^\s*)|(\s*$)/g, "");
	$(mthis).attr("value",result); */
	var name = $(mthis).val();
	while (name.indexOf('  ') > 0) {  
		name = name.replace('  ', ' ');  
    }
	$(mthis).val($.trim(name));
}

formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

function look(patientid,familyAddress){
	$('#historyDLg').dialog('open').dialog('setTitle', '历次就诊记录');
	$('#DetailsName').html("");//病人姓名
	$('#DetailsGender').html("");//病人性别
	$('#DetailsAge').html("");//年龄
	$('#DetailsPhone').html("");//联系电话
	$('#DetailsAddress').html("");//地址
	$('#DetailsSerialno').html("");//就诊序号
	$('#DetailsDoctor').html("");//就诊医生
	$('#DetailsTime').html("");//就诊时间
	$('#DetailsDiag').html("");//诊断
	$('#DetailsLoc').html("");//科
	
	$('#DetailsComplaint').html("");//主诉
	$('#DetailsHistory').html("");//现病史
	$('#DetailsTemperature').html("");//体温
	$('#DetailsHeartRate').html("");//心率
	$('#DetailsSBP').html("");//收缩压
	$('#DetailsDBP').html("");//舒张压
	$('#DetailsRhythm').html("");
	$('#DetailsOther').html("");
	
	$('#html').html("");
	$CommonUI.getDataGrid('#historyDataGrid').datagrid({
		method:'get',
	    url:$WEB_ROOT_PATH+'/treatment/getReceivePatientList.ajax',
	    fitColumns: false,
	    showGroup: true,
	    pagination: true,
		singleSelect: true,
		rownumbers: true,
		showFooter: true,
		scrollbarSize:0,
		height:380,
	    columns:[[
	        {field:'admisSerialno',title:'就诊流水号',hidden:true},
	        {field:'admisDatetime',title:'接诊时间',width:70,align:'center'},    
	        {field:'diagName',title:'诊断',width:142,align:'center'}, 
	        {field:'empnameAdmis',title:'医生',width:80,align:'center'}, 
	    ]],
		queryParams:{
			"patientid":patientid
		},onClickRow:function(index,rowData){
			$.getJSON($WEB_ROOT_PATH+ "/treatment/findAppendInfoRecord.ajax",
			{"admisSerialno":rowData.admisSerialno},
				function(d) {
					if(d["rows"] !=0) {
						$('#DetailsName').html(d["rows"][0].patientName);//病人姓名
						$('#DetailsGender').html(d["rows"][0].patientSexid);//病人性别
						$('#DetailsAge').html(d["rows"][0].age);//年龄
						$('#DetailsPhone').html(d["rows"][0].patientTelephone);//联系电话
						$('#DetailsAddress').html(familyAddress);//地址
						$('#DetailsSerialno').html(d["rows"][0].admisSerialno);//就诊序号
						$('#DetailsDoctor').html(d["rows"][0].empnameAdmis);//就诊医生
						$('#DetailsTime').html(d["rows"][0].admisDatetime);//就诊时间
						$('#DetailsDiag').html(rowData.diagName);//诊断
						$('#DetailsLoc').html(d["rows"][0].orgname);//科室
						for (var i=0; i< d["total"]; i++) {
							if(d["rows"][0].appendTypeid != null) {
								if (d["rows"][i].appendTypeid==01) {
									$('#DetailsComplaint').html(d["rows"][i].appendContent);//主诉
								} else if(d["rows"][i].appendTypeid==02) {
									$('#DetailsHistory').html(d["rows"][i].appendContent);//现病史
								} else if(d["rows"][i].appendTypeid==03) {
									$('#DetailsTemperature').html(d["rows"][i].appendContent);//体温
								} else if(d["rows"][i].appendTypeid==04) {
									$('#DetailsHeartRate').html(d["rows"][i].appendContent);//心率
								} else if(d["rows"][i].appendTypeid==05) {
									$('#DetailsSBP').html(d["rows"][i].appendContent);//收缩压
								} else if(d["rows"][i].appendTypeid==06) {
									$('#DetailsDBP').html(d["rows"][i].appendContent);//舒张压
								} else if(d["rows"][i].appendTypeid==07) {//心律
									var data = d["rows"][i].appendContent;
									if(data == 01){
										$('#DetailsRhythm').html("心律齐");
									}else if(data == 02){
										$('#DetailsRhythm').html("心律不齐");
									}else if(data == 03){
										$('#DetailsRhythm').html("绝对不齐");
									}								
								}else if(d["rows"][i].appendTypeid==08) {
									$('#DetailsOther').html(d["rows"][i].appendContent);//其他
								}
							} else {//没有这些信息，初始化
								$('#DetailsComplaint').html("");//主诉
								$('#DetailsHistory').html("");//现病史
								$('#DetailsTemperature').html("");//体温
								$('#DetailsHeartRate').html("");//心率
								$('#DetailsSBP').html("");//收缩压
								$('#DetailsDBP').html("");//舒张压
								$('#DetailsRhythm').html("");//心律
								$('#DetailsOther').html("");//其他
							}
						}
					}
			});
			
			$.getJSON($WEB_ROOT_PATH+ "/treatment/getOrdSubByAdminno.ajax",{"admisSerialno":rowData.admisSerialno},function(d){
				var html='';
				if(d["total"]!=0) {
					html+='<tr><td align="left">医嘱类型</td>'
							  +'<td align="left">药品名称</td>'
							  +'<td align="center">用法</td>'
							  +'<td align="center">付数</td>'
							  +'<td align="center">每次剂量数</td>'
							  +'<td align="center">使用频次</td>'
							  +'<td align="center">疗程数</td>'
						+'</tr>';
					for(var i=0; i<d["total"]; i++){
						 html+='<tr>';
						 html+='<td width="80"align="left">'+d["rows"][i].ordName+'</td>';
				       	 html+='<td width="80"align="left">'+d["rows"][i].itemname+'</td>';
				       	 if(d["rows"][i].usagename!=null) {
				       		html+='<td width="40"align="center">'+d["rows"][i].usagename+'</td>';
				       	 }else{
				       		html+='<td width="40"align="center">/</td>';
				       	 }
				       	 html+='<td width="40"align="center">'+d["rows"][i].timesQuantity+'</td>';
				       	 if(d["rows"][i].permedQuantity!=null) {
				       		html+='<td width="80"align="center">'+d["rows"][i].permedQuantity+'</td>';
						 }else {
							 html+='<td width="80"align="center">/</td>';
						 }
				       	if(d["rows"][i].freqid!=null) {
				       		html+='<td width="80"align="center">'+d["rows"][i].freqid+'</td>';
						 }else {
							 html+='<td width="80"align="center">/</td>';
						 }
				       	if(d["rows"][i].freqquantity!=null) {
				       		html+='<td width="80"align="center">'+d["rows"][i].freqquantity+'</td>';
						 }else {
							 html+='<td width="80"align="center">/</td>';
						 }
				       	 html+='</tr>';
					}
					$('#html').html(html);
				}else {
					$('#html').html("没有开立医嘱！");
				}
			});
		}
	});
}
function deletePatient(){
	 if ($CommonUI.getDataGrid("#dg").datagrid('getSelections').length != 1) {
			$CommonUI.alert('请选择一条数据删除!');return;}
      	var row = $("#dg").datagrid('getSelected');
      	$CommonUI.confirm('删除不可恢复，确定删除吗？', 'question', 0, function(){
    		//先判断是否存在就诊记录
    		$.post($WEB_ROOT_PATH+"/patientManage/deletePatientById.ajax",{
    		     'patientid':row.patientid},
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
function changeImg() { 
	var curIndex= $('#patientSexId').combobox('getValue');
	var arr=new Array(); 
	arr[0]="wz.jpg"; 
	arr[1]="man.png"; 
	arr[2]="woman.png"; 
	var obj=document.getElementById("tp"); 
	if (curIndex!=1&&curIndex!=2) { 
		curIndex=0; 
	}
	var strs=obj.src.split("/");
	obj.src=obj.src.replace(strs[strs.length-1],arr[curIndex]);
} 

//验证出生日期合理性
function valiBirthData(){
	var flag = true;
	var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
	var today = formatterDate(new Date());
	var lowerDate = (new Date().getFullYear()-150)+'-01-01';
	var result1=dateCompare(birthDate,today);//和今天比较
	var result2=dateCompare(birthDate,lowerDate);//和150年前比较
	if(result1 == 1 || result2 == -1){
		flag = false;
	}
	return flag;
}
//选择出生日期时触发select
function checkBirthDay(){
	var result = valiBirthData();
	if(!result){
		$CommonUI.alert("请输入有效的出生日期！");
		if($('#age').numberbox('getValue') == ''){
			$('#birthDate').datebox('setValue','');
		}else{
			var birYear = new Date().getFullYear()-$('#age').val();
			$('#birthDate').datebox('setValue',birYear+'-01-01');
		}
		return;
	}
	var age = getPersonAgeByBirthDate($('#birthDate').datebox('getValue'));
	$('#age').numberbox('setValue',age);
}

function clearValidata(){
	$('#patientName').removeClass('validatebox-invalid');
	$('#patientTelephone').removeClass('validatebox-invalid');
}
function checkCardId(socialNo){  
	if (socialNo.length != 18) {  
		flag="0";
	    return (false);  
	  }  
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};   
	if(area[parseInt(socialNo.substr(0,2))]==null) {  
	   flag="0";
        return (false);  
   }   
	var Wi = new Array(  
            7,9,10,5,8,4,2,1,6,  
            3,7,9,10,5,8,4,2,1  
            );  
	var   lSum    = 0;  
	var   nNum    = 0;  
    for (var i = 0; i < 17; ++i){  
        if ( socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9' ){  
        	flag="0";
            return (false);  
        }  
        else{  
            nNum = socialNo.charAt(i) - '0';  
        }  
         lSum += nNum * Wi[i];  
    }  
    if( socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x'){  
        lSum += 10*Wi[17];  
    }  
    else if ( socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9' ){  
    	flag="0";
        return (false);  
    }  
    else{  
        lSum += ( socialNo.charAt(17) - '0' ) * Wi[17];  
    }  
    if ( (lSum % 11) == 1 ){  
        return true;  
    }  
    else{  
    	flag="0";
        return (false);  
    } 
}  

function checkCardId1(id){
	var lastNumber;
	var zone=id.substring(0,6);
	var year="19" + id.substring(6,8);
	var mdo=id.substring(8,15);
	id = zone + year + mdo;
	var getNum=eval(id.charAt(0)*7 +id.charAt(1)*9 +id.charAt(2)*10 +id.charAt(3)*5 +id.charAt(4)*8 +id.charAt(5)*4 +id.charAt(6)*2 +id.charAt(7)*1 +id.charAt(8)*6 +id.charAt(9)*3 +id.charAt(10)*7 +id.charAt(11)*9 +id.charAt(12)*10 +id.charAt(13)*5 +id.charAt(14)*8 +id.charAt(15)*4 +id.charAt(16)*2);
	getNum=getNum%11;
	switch (getNum) {
	case 0 :
	lastNumber="1";
	break;
	case 1 :
	lastNumber="0";
	break;
	case 2 :
	lastNumber="X";
	break;
	case 3 :
	lastNumber="9";
	break;
	case 4 :
	lastNumber="8";
	break;
	case 5 :
	lastNumber="7";
	break;
	case 6 :
	lastNumber="6";
	break;
	case 7 :
	lastNumber="5";
	break;
	case 8 :
	lastNumber="4";
	break;
	case 9 :
	lastNumber="3";
	break;
	case 10 :
	lastNumber="2";
	break;
	}
	id = id + lastNumber;
	return id;
}

function telePhoneConfirm(){
	var idcardTypeid= $('#idcardTypeid').combobox('getValue');
	var icard = $('#createForm input[name="icard"]').val();
	if (idcardTypeid == "" || idcardTypeid == null) {
		if(icard!=null&&icard!=""){
			$CommonUI.alert("请选择证件类型！");
			return;
		}else{
			changeImg();
			var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
			if (birthDate == "" || birthDate == null) {
				$CommonUI.alert("出生日期不为空！");
			}
			else{
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
				}else{
					postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
				}
			}
		}
	}else{
		if(icard==null||icard==""){
			changeImg();
			var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
			if (birthDate == "" || birthDate == null) {
				$CommonUI.alert("出生日期不为空！");
			}else{
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
				}else{
					postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
				}
			}
		}else{
			var icard = $('#createForm input[name="icard"]').val();
			//身份证才做处理
			var idcardTypeid = $('#idcardTypeid').combobox('getValue'); 
			if(idcardTypeid == "01"){
				if(icard.length==15){
					 var icard1= checkCardId1(icard);
					 checkCardId(icard1);
				}else{
					checkCardId(icard);
				}
			}else{
				flag=="1";
			}
			
			if(flag=="0"){
				$CommonUI.alert("输入身份证号码格式不正确!");
			}
			if(flag=="1"){
				//身份证才做处理
				if(idcardTypeid == "01"){
					if(icard.length==15){
						var icard1= checkCardId1(icard);
						icard = icard1;
					}
					var sex=getPersonSexByIdcard(icard);//身份证查询性别
					var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
					if(sex=="男"){
						$('#patientSexId').combobox('setValue',1);
					}else{
						$('#patientSexId').combobox('setValue',2);
					}
					changeImg();
					sex=sex+"性";
					$('#patientSexId').combobox('setText',sex);
					$('#patientSename').val(sex);
					$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
				}
								
				var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
				if (birthDate == "" || birthDate == null) {
					$CommonUI.alert("出生日期不为空！");
				}
				else{
					var today = formatterDate(new Date());
					var compare=dateCompare(birthDate,today);
					if(compare=='1'){
						$CommonUI.alert("请选择正确的出生日期!");
					}else{
						var icard = $('#createForm input[name="icard"]').val();
						$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax?icard="+ icard, function(d) {
							if(d!=null&&d!=""){
								if(d['total']==0){
									/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
									$('#patientIdentityname').val(patientIdentityname);*/
									postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
								}
								else{
									$CommonUI.alert("身份证信息已存在!");
								}
							}
						});
					}
				}
			}
		}
	}
}

function patientNameConfirm() {
	var patientTelephone = $('#createForm input[name="patientTelephone"]').val();
//	if(patientTelephone.length!=11){
//		$CommonUI.alert("请输入有效的移动电话");
//		return;
//	}
//	var phone= mobilePhoneCheck(patientTelephone);
//	if(phone==false){
//		$CommonUI.alert("请输入正确的移动电话");
//		return;
//	}else{
	$.post($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax",{"patientTelephone":patientTelephone},function(d){
		if(d!=null&&d!=""){
			if(d['total']!=0){
				$CommonUI.confirm(patientTelephone+"已存在，是否创建", 'question', '确定', function(){
					telePhoneConfirm();
				}, '取消', function(){
					return;
				});
			}else{
				telePhoneConfirm();
			}
		}
	},"json");
//	}
}
//防止html注入
function illegalChar(id){
	var name = $(id).val().match(/^([\u4e00-\u9fa5]{0,20}|[a-zA-Z]{0,32})$/g);
	if (name==null){
		$(id).val("");
		$CommonUI.alert("请输入中英文！");
		return;
	}
}
