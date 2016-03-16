//门诊病历部分

//新增或修改数据失败处理
var flagPat="1";
function err(xhr,textStatus,errorThrown){
	$CommonUI.alert("保存/修改信息失败！");	
}
function appendSucc(msg){
	var html = ""; //页面初始
	for(var i=0; i<9; i++){
		html+='<input id="uuid'+i+'" name="appendInfoList['+i+'].uuid" type="hidden" value="'+msg.rows[i].uuid+'"/>';
	}
	$('#hiddenuid').html(html);
	var curdate = $CommonUI.getDateBox('#returnVisitDate').datebox('getValue');
	if(curdate==null || curdate == ''){
		$CommonUI.alert("门诊病历保存成功");	
	}
	/*$CommonUI.autoCloseCenterMessage("门诊病历保存成功！","info","",1000);*/
}

//没有患者信息弹出提示
function editorAlert(id) {
	var patientid=$('#hiddenpatientId').val();//患者ID
	var admisSerialno=$('#hiddenadmisSerialno').val();
	if(patientid == null || patientid == "" || admisSerialno == null || admisSerialno == "") {
		$('#'+id+'').val("");
		$CommonUI.alert("请先接诊一个患者");
	}
}

//患者信息修改
/*
function uapdatePatientInfo() {
	var flag="1";
	var patientid = $('#hiddenpatientId').val();
	var patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
	$('#patientIdentityName').val(patientIdentityname);
	var patientTelephone = $('#createForm input[name="dto.patient.patientTelephone"]').val();
	var phone= mobilePhoneCheck(patientTelephone);
	if(phone==false){
		$CommonUI.alert("请输入正确的移动电话");
		return;
	}
	var icard = $('#createForm input[name="dto.patient.icard"]').val();
	if (icard == "" || icard == null) {
		var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
		var today = formatterDate(new Date());
		var compare=dateCompare(birthDate,today);
		if(compare=='1'){
			$CommonUI.alert("请重新选择出生日期!");
			return;
		}
		postReq($WEB_ROOT_PATH+ '/patientManage/patientManageCtrl.htm?BLHMI=update', 'createForm',
				function(){
			loadBasicInfo(patientid);
			$CommonUI.alert("修改成功！");
		}, '', {skipHidden : false});
	}else{
		parent.checkCardId(icard);
		if(flag=="0"){
			$CommonUI.alert("输入身份证号码格式不正确!");
			return;
		}
		if(flag=="1"){
			var sex=getPersonSexByIdcard(icard);//身份证查询性别
			var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
			if(sex=="男"){
				$('#patientSexId').combobox('setValue',1);
			}
			else{
				$('#patientSexId').combobox('setValue',2);
			}
			$('#patientSexId').combobox('setText',sex);
			$('#patientSename').val(sex);
			$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
			var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
			var today = formatterDate(new Date());
			var compare=dateCompare(birthDate,today);
			if(compare=='0'||compare=='1'){
				$CommonUI.alert("请重新选择出生日期!");
				return;
			}
			$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax?dto.patient.icard="+ icard, function(d) {
				if(d!=null&&d!=""){
					if(d['total']==1||d['total']==0){
						var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
						$('#patientIdentityName').val(patientIdentityname);
						postReq($WEB_ROOT_PATH+ '/patientManage/patientManageCtrl.htm?BLHMI=update', 'createForm',
								function(){
							loadBasicInfo(patientid);
							$CommonUI.alert("患者信息修改成功！");
						}, '', {skipHidden : false});
					}
					else{
						$CommonUI.alert("身份证信息已存在!");
					}
				}
			});
			}
		}
}	*/
//清空患者信息
function clearAllPatientInfo(){
	$('#hiddenadmisSerialno').val('');
	$('#hiddenserialno').val('');
	$('#hiddenpatientId').val('');
	$('#nameSpan').html('');
	$('#sexSpan').html('');
	$('#ageSpan').html('');
	$('#phoneSpan').html('');
	$('#patientIdentitynameSpan').html('');
	/*$('#diagnosesSpan').html('');*/
};

//接诊操作加载患者基本信息
function loadPatinetInfo(patientid,admisSerialno,serialno){
	loadBasicInfo(patientid);
	loadAdminSer(admisSerialno,serialno);
	/*loadPatientDetailInfo(patientid);*/
}
//加载就诊流水号和挂号流水号
function loadAdminSer(admisSerialno,serialno){
	var html = ""; //页面初始
	for(var i=0; i<9; i++) {
		$('#hiddenadmisSerialnos').html(html+='<input id="admisSerialno'+i+'" name="appendInfoList['+i+'].admisSerialno" type="hidden" value="'+admisSerialno+'"/>');
	}
	html ="";
	for (var i=0; i<9; i++){
		$('#hiddenserialnos').html(html+='<input id="serialno'+i+'" name="appendInfoList['+i+'].serialno" type="hidden" value="'+serialno+'"/>');
	}
}
//加载患者基本信息
function loadBasicInfo(patientid){
	$.getJSON($WEB_ROOT_PATH+ "/patientManage/outPatient.ajax",
			{"patientid":patientid},
			function(d) {
			$('#nameSpan').html(d["rows"][0].patientName);//患者姓名
			$('#sexSpan').html(d["rows"][0].patientSename);//患者性别
			$('#ageSpan').html(d["rows"][0].age);//年龄
			$('#phoneSpan').html(d["rows"][0].patientTelephone);//联系电话
			$('#patientIdentitynameSpan').html(d["rows"][0].patientIdentityname);//患者身份
			$('#unfoldOrFold').show();
			$('#openDetailsDlg').css("display","block");
	});
}

//接诊操作加载门诊病历附加信息
function loadAppendInfo(admisSerialno) {
	$.getJSON($WEB_ROOT_PATH+ "/treatment/findAppendInfoRecord.ajax",
			{"admisSerialno":admisSerialno},
			function(d) {
				if(d["total"]!=0){
					var html = ""; //页面初始
					for (var i=0; i<d["total"]; i++) {
						$('#hiddenuid').html(html+='<input id="uuid'+i+'" name="appendInfoList['+i+'].uuid"  type="hidden" value="'+d["rows"][i].uuid+'"/>');
						if (d["rows"][i].appendTypeid==01) {
							$('#patientComplaint').val(d["rows"][i].appendContent);//主诉
						} else if(d["rows"][i].appendTypeid==02) {
							$('#patientHistory').val(d["rows"][i].appendContent);//现病史
						} else if(d["rows"][i].appendTypeid==03) {
							$('#patientTemperature').val(d["rows"][i].appendContent);//体温
						} else if(d["rows"][i].appendTypeid==04) {
							$('#patientHeartRate').val(d["rows"][i].appendContent);//心率
						} else if(d["rows"][i].appendTypeid==05) {
							$('#patientSBP').val(d["rows"][i].appendContent);//收缩压
						} else if(d["rows"][i].appendTypeid==06) {
							$('#patientDBP').val(d["rows"][i].appendContent);//舒张压
						} else if(d["rows"][i].appendTypeid==07) {
							$('#patientRhythm').val(d["rows"][i].appendContent);//心律
						} else if(d["rows"][i].appendTypeid==08) {
							$('#other').val(d["rows"][i].appendContent);//其他
						}else if(d["rows"][i].appendTypeid==09) {
							if(d["rows"][i].appendContent=='on'){
								$('#referral').attr('checked',true);//复诊
							}
						}
					}
				}
		});
}

function loadOrder(admisSerialno){
	setTimeout(function() {
	var url= $WEB_ROOT_PATH+'/searchOrd/listOrder.ajax';
	postReq(url,'',function(msg){
		$('#historyOrder').datagrid("loadData",msg);
	},'','',{"admisSerialno":admisSerialno});
	}, 100);
};
function loadTreatedRecord(patientid){
	setTimeout(function() {
		$CommonUI.getDataGrid('#historyDataGrid').datagrid({
			url:$WEB_ROOT_PATH+'/treatment/loadTreatedRecord.ajax',
			queryParams:{"patientid":patientid}
		});
	}, 100);
};
//清空门诊病历、医嘱、历次就诊记录信息，并跳至门诊病历tab
function clearAll(){
	$CommonUI.getTabs('#tabsResize').tabs('select',0);
	clearAllPatientInfo();//清空患者信息
	clearnCase();//清空门诊病历信息页面
	clearnOrd();//清空所有医嘱页面内容
	clearHistoryRecord();//清空历次就诊列表页面
}
//清空门诊病历信息页面
function clearnCase() {
	$('#hiddenadmisSerialnos').html("");
	$('#hiddenserialnos').html("");
	$('#hiddenuid').html("");
	$CommonUI.getForm("#appendInfoForm").form('clear');
	$("input[name='selectDiagnosis'][value='00']").attr("checked",true);
	$('#diagnosisGrid').datagrid('loadData', {"total" : "0","rows" : []});
}
//清空所有医嘱页面内容
function clearnOrd(){
	$('#historyOrder').datagrid("loadData",{"total":"0","rows":[]});
	$('#doctorOrdersGrid1').datagrid("loadData",{"total":"0","rows":[]});
	$('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
	$('#inspectionGrid').datagrid("loadData",{"total":"0","rows":[]});
}
//清空历次就诊列表页面
function clearHistoryRecord(){
	$('#historyDataGrid').datagrid("loadData",{"total":"0","rows":[]});
}

function saveSuc(data){
	uuid = data["dto.paDiaglist"][0].uuid;
	$CommonUI.alert("保存成功");
};

//患者详细信息弹窗
function loadPatientDetailInfo() {
	var patientid=$('#hiddenpatientId').val();
	parent.loadPatientDetailInfo(patientid);
}

//已接诊操作加载门诊病历附加信息(不带出uuid)
function loadNoUuidAppendInfo(admisSerialno){
$.getJSON($WEB_ROOT_PATH+ "/treatment/findAppendInfoRecord.ajax",
		{"admisSerialno":admisSerialno},
		function(d) {
			if(d["total"]!=0){
				$('#hiddenuid').html('');
				for (var i=0; i<d["total"]; i++) {
					if (d["rows"][i].appendTypeid==01) {
						$('#patientComplaint').val(d["rows"][i].appendContent);//主诉
					} else if(d["rows"][i].appendTypeid==02) {
						$('#patientHistory').val(d["rows"][i].appendContent);//现病史
					} else if(d["rows"][i].appendTypeid==03) {
						$('#patientTemperature').val(d["rows"][i].appendContent);//体温
					} else if(d["rows"][i].appendTypeid==04) {
						$('#patientHeartRate').val(d["rows"][i].appendContent);//心率
					} else if(d["rows"][i].appendTypeid==05) {
						$('#patientSBP').val(d["rows"][i].appendContent);//收缩压
					} else if(d["rows"][i].appendTypeid==06) {
						$('#patientDBP').val(d["rows"][i].appendContent);//舒张压
					} else if(d["rows"][i].appendTypeid==07) {
						$('#patientRhythm').val(d["rows"][i].appendContent);//心律
					} else if(d["rows"][i].appendTypeid==08) {
						$('#other').val(d["rows"][i].appendContent);//其他
					}else if(d["rows"][i].appendTypeid==09) {
						if(d["rows"][i].appendContent=='on'){
							$('#referral').attr('checked',true);//复诊
						}
					}
				}
			}
	});
}
