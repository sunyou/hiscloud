//开医嘱部分
var timer;
var deleteUuid;
window.onload = function(){
	if(parent.parent.patientFlag=="1"){
		parent.parent.patientFlag="2";
		directTreatment(parent.parent.patientId);
	}
};
$(function() {
	$('#saveBtn').click(function(){
		var tab = $CommonUI.getTabs('#tabsResize').tabs('getSelected');
		var index = $CommonUI.getTabs('#tabsResize').tabs('getTabIndex',tab);
		var diagnosissaveFlag=0;
		if(index==0){
			var patientid=$('#hiddenpatientId').val();
			if (patientid != null && patientid != '') {
				//诊断
				diagnosissaveFlag=diagnosissave();
				if(diagnosissaveFlag==-1){
					return;
				};
				//门诊病历
				if($CommonUI.getForm("#appendInfoForm").form("validate")){
					postReq($WEB_ROOT_PATH+'/treatment/saveAppendInfo.ajax', "#appendInfoForm", appendSucc, err, {skipHidden:false});
				}
				//随访
				if(followUpTreat()==-1){
					return;
				};
			} else {
				$CommonUI.alert("请先接诊一个患者");
			}
		}else if(index==1){
			//医嘱页面审核
			if(!check()){
				//检查西医医嘱疗程和单次剂量
				return;
			}
			$('#chinaMedicineGrid').datagrid('acceptChanges');
			var jsonCM = $('#chinaMedicineGrid').datagrid('getData');
			var rowsCM=jsonCM.rows;
			var FieldsCM = new Array();
			var j = 0;
			for(var i=0; i<rowsCM.length; i++)
			{
				if(rowsCM[i].chinaMedicine1!=undefined && rowsCM[i].chinaMedicine1!=""){
					var Field1 = new Object();
					Field1.itemname = rowsCM[i].chinaMedicine1;
					Field1.itemid = rowsCM[i].chinaMedicine11;
					Field1.salesPrice = rowsCM[i].chinaMedicine21;
					Field1.permedQuantity = rowsCM[i].chinaMedicine2;
					Field1.unitQuantity = rowsCM[i].chinaMedicine2;
					Field1.rowno = j;
					FieldsCM[j] = Field1;
					j++;
				}
				if(rowsCM[i].chinaMedicine3!=undefined && rowsCM[i].chinaMedicine3!=""){
					var Field2 = new Object();
					Field2.itemname = rowsCM[i].chinaMedicine3;
					Field2.itemid = rowsCM[i].chinaMedicine13;
					Field2.salesPrice = rowsCM[i].chinaMedicine23;
					Field2.permedQuantity = rowsCM[i].chinaMedicine4;
					Field2.unitQuantity = rowsCM[i].chinaMedicine4;
					Field2.rowno = j;
					FieldsCM[j] = Field2;
					j++;
				}
				if(rowsCM[i].chinaMedicine5!=undefined && rowsCM[i].chinaMedicine5!=""){
					var Field3 = new Object();
					Field3.itemname = rowsCM[i].chinaMedicine5;
					Field3.itemid = rowsCM[i].chinaMedicine15;
					Field3.salesPrice = rowsCM[i].chinaMedicine25;
					Field3.permedQuantity = rowsCM[i].chinaMedicine6;
					Field3.unitQuantity = rowsCM[i].chinaMedicine6;
					Field3.rowno = j;
					FieldsCM[j] = Field3;
					j++;
				}
				if(rowsCM[i].chinaMedicine7!=undefined && rowsCM[i].chinaMedicine7!=""){
					var Field4 = new Object();
					Field4.itemname = rowsCM[i].chinaMedicine7;
					Field4.itemid = rowsCM[i].chinaMedicine17;
					Field4.salesPrice = rowsCM[i].chinaMedicine27;
					Field4.permedQuantity = rowsCM[i].chinaMedicine8;
					Field4.unitQuantity = rowsCM[i].chinaMedicine8;
					Field4.rowno = j;
					FieldsCM[j] = Field4;
					j++;
				}
			}
			var StrCM = $.toJSON(FieldsCM);
			var cMedTQ = $('#cMedTQ').combobox('getValue');
			var cMedUsageid = $('#cMedUsageid').val();
			var cMedFrequency = $('#cMedFrequency').combobox('getValue');
			var cMedOrgidExec = $('#cMedOrgidExec').val();
			if(StrCM!="[]"){
				if(cMedTQ==null||cMedTQ==undefined||cMedTQ==""){
					$CommonUI.alert("请输入付数","error");
					$CommonUI.getTabs('#tabsOrder').tabs('select',1);
					return ;
				}
				if(cMedUsageid==null||cMedUsageid==undefined||cMedUsageid==""){
					$CommonUI.alert("请输入用法","error");
					$CommonUI.getTabs('#tabsOrder').tabs('select',1);
					return ;
				}
				if(cMedFrequency==null||cMedFrequency==undefined||cMedFrequency==""){
					$CommonUI.alert("请输入频次","error");
					$CommonUI.getTabs('#tabsOrder').tabs('select',1);
					return ;
				}
				if(cMedOrgidExec==null||cMedOrgidExec==undefined||cMedOrgidExec==""){
					$CommonUI.alert("请在机构关系中配置中草药接收科室","error");
					$CommonUI.getTabs('#tabsOrder').tabs('select',1);
					return ;
				}
			}
			$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('acceptChanges');
			$('#inspectionGrid').datagrid('acceptChanges');
			var Str="";
			//var StrCM="";
			var StrInspect="";
			var url=$WEB_ROOT_PATH+'/ordSave/saveItemNew.ajax';
			var myIndex=$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
			var patientId=$('#hiddenpatientId').val();
			var admisSerialno=$('#hiddenadmisSerialno').val();
			var serialno = $('#hiddenserialno').val();
			if(patientId==""||patientId==undefined){
				$CommonUI.alert("请先选择患者", 'warning');
				$CommonUI.getTabs('#tabsResize').tabs('select',0);
				return;
			}
			if(admisSerialno==""||admisSerialno==undefined){
				$CommonUI.alert("请先挂号", 'warning');
				$CommonUI.getTabs('#tabsResize').tabs('select',0);
				return;
			}
			var json = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getData');
			var rows=json.rows;
			var Fields = new Array();
			var j=0;
			for(var i=0; i<rows.length; i++)
			{
				if(rows[i].itemid==""||rows[i].itemid==undefined||rows[i].itemid==null){
					continue;
				}
				var Field = new Object();
				Field.itemid = rows[i].itemid;
				Field.rowno = j;
				Field.perQuantity = rows[i].perQuantity;
				Field.basicUnit = rows[i].basicUnit;
				Field.freqid = rows[i].freqid;
				Field.freqDay = rows[i].freqDay;
		    	Field.freqDeg = rows[i].freqDeg;
				Field.usagename = rows[i].usagename;
				Field.usageid = rows[i].usageid;
				Field.freqquantity = rows[i].freqquantity;
				Field.frequnit = rows[i].frequnit;
				Field.salesPrice = rows[i].salesPrice;
				Field.orgnameExec = rows[i].orgnameExec;
				Field.unitQuantity = rows[i].unitQuantity;
				Field.ordGroupno = rows[i].ordGroupno;
				Field.controlCateid = rows[i].controlCateid;
				Field.itemname = rows[i].itemname;
				Field.unitName = rows[i].unitName;
				Field.itemspec = rows[i].itemspec;
				Field.orgidExec = rows[i].orgidExec;
				Field.factor = rows[i].factor;
				Field.medfactor = rows[i].medfactor;
				Field.inputunitSign = rows[i].inputunitSign;
				Field.medunitName = rows[i].medunitName;
				Field.uuid = rows[i].uuid;
				Field.ordid = rows[i].ordid;
				Field.ordCateid = rows[i].ordCateid;
				Field.usageid = rows[i].usageid;
				Field.ismeditem = rows[i].ismeditem;
				Field.intervalDays = rows[i].intervalDays;
				Field.orgid = $("#loginLocId").val();
				Field.orgname = $("#loginLocName").val();
				Field.orgidHosp = $("#orgidHosp").val();
				Field.amountTotal = rows[i].totalPrice;
				Field.amountPati = rows[i].totalPrice;
				Field.quantity = rows[i].unitQuantity*rows[i].factor;
				Field.permedQuantity = rows[i].perQuantity*rows[i].medfactor;
				Field.purchasePrice = rows[i].purchasePrice;
				Fields[j] = Field;
				j++;
			}
			Str = $.toJSON(Fields);
			var jsonInspect = $('#inspectionGrid').datagrid('getData');
			var rowsInspect=jsonInspect.rows;
			var FieldsInspect = new Array();
			for(var i=0; i<rowsInspect.length; i++)
			{
				var Field = new Object();
				Field.ordid = rowsInspect[i].ordid;
				Field.orddicid = rowsInspect[i].orddicid;
				Field.applyid = rowsInspect[i].applyid;
				Field.spbody = rowsInspect[i].spbody;
				Field.ordName = rowsInspect[i].ordName;
				Field.ordTypeid = rowsInspect[i].ordTypeid;
				Field.ordTypename = rowsInspect[i].ordTypename;
				Field.orgidExec = rowsInspect[i].orgidExec;
				Field.orgnameExec = rowsInspect[i].orgnameExec;
				Field.note = rowsInspect[i].note;
				Field.salesPrice = rowsInspect[i].amountTotal;
				Field.amountTotal = rowsInspect[i].amountTotal;
				Field.amountPati = rowsInspect[i].amountTotal;
				Field.itemid = rowsInspect[i].orddicid;
				Field.itemname = rowsInspect[i].ordName;
				Field.orgid = $("#loginLocId").val();
				Field.orgname = $("#loginLocName").val();
				Field.orgidHosp = $("#orgidHosp").val();
				Field.rowno = i;
				FieldsInspect[i] = Field;
			}
			StrInspect = $.toJSON(FieldsInspect);
			postReq(url,'',function(resuletStr){
				if(resuletStr.result==0){
		    		$("#WMedordid").val("");
					$('#deleteUuid').val("");
					loadOrder(admisSerialno);
					$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("loadData",{"total":"0","rows":[]});
					totalPriceOnChange();
					$('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
					$("input[name='singleDose']").val("");
					$("input[name='medicineFilter']").val("");
					$("input[name='remarks']").val("");
					$("#totalPrice").html("");
					$("#cMedordid").val();
					$('#inspectionGrid').datagrid("loadData",{"total":"0","rows":[]});
				}else {
					$CommonUI.alert("保存失败","error");
				}
			},function(){$CommonUI.autoCloseCenterMessage("保存医嘱失败,请稍等重试","info","",500);},{skipHidden : false},{
			"filterStr":myIndex,
			"deleteUuid":$("#deleteUuid").val(),
			//西药
			"orderItemString":Str,
			//中药
			"orderItemStringCM":StrCM,
			"usagename":$("#cMedUsagename").combo('getText'),
			"usageid":$("#cMedUsageid").val(),
			"orgnameExec":$("#cMedOrgnameExec").combo('getValue'),
			"orgidExec":$("#cMedOrgidExec").val(),
			"frequency":$("#cMedFrequency").combo('getValue'),
			"ordid":$("#cMedordid").val(),
			"note":$("#CMnote").val(),
			"timesQuantity":Number($("#cMedTQ").combo('getValue')),
			//诊疗
			"inspectString" : StrInspect,
			"patientid":patientId,
			"admisSerialno":admisSerialno,
			"serialno":serialno,
			//处方主表信息
			"tord.serialno":serialno,
			"tord.admisSerialno":admisSerialno,
			"tord.patientid":patientId,
			"tord.empidInput":$("#loginId").val(),
			"tord.empnameInput":$("#loginName").val(),
			"tord.empidDoct":$("#loginId").val(),
			"tord.empnameDoct":$("#loginName").val(),
			"tord.orgid":$("#loginLocId").val(),
			"tord.orgname":$("#loginLocName").val(),
			"tord.orgidHosp":$("#orgidHosp").val()
			});
		}else{
			//alert("历次就诊记录审核");
		}
		loadTreatedRecord($('#hiddenpatientId').val());
	});
	orderClickCell = function(rowIndex, field, value){
		if(field=="action"){
			return;
		}
		var selectedRow = $('#historyOrder').datagrid("getData");
		var ordid = selectedRow.rows[rowIndex].ordid;
		var ordTypeid = selectedRow.rows[rowIndex].ordTypeid;
		if(ordTypeid=="00"||ordTypeid=='02'){
			$CommonUI.getTabs('#tabsOrder').tabs('select',0);
			var url=$WEB_ROOT_PATH+'/westernMedicine/listSubNew.ajax';
			postReq(url,'',function(resuletStr){
				$("#WMedordid").val(ordid);
		    	$('#deleteUuid').val("");
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('loadData',resuletStr);
				totalPriceOnChange();
	    	},'','',{"ordid":ordid});
		}else if(ordTypeid=="01"){
			$CommonUI.getTabs('#tabsOrder').tabs('select',1);
			var url=$WEB_ROOT_PATH+'/chineseMedicine/listSub.ajax';
			var note = selectedRow.rows[rowIndex].note;
			var timesQuantity = selectedRow.rows[rowIndex].timesQuantity;
			postReq(url,'',function(msg){
				$("#cMedordid").val(ordid);
				$("input[name='tord.note']").val(note);
				$("#cMedTQ").combobox('setValue',timesQuantity);
				$('#chinaMedicineGrid').datagrid('loadData',msg);
				$('#cMedOrgnameExec').combobox('setValue',msg["rows"][0].orgnameExec);
				$('#cMedOrgidExec').val(msg["rows"][0].orgidExec);
				$('#cMedFrequency').combobox('setValue',msg["rows"][0].freqid);
				$('#cMedUsagename').combobox('setValue',msg["rows"][0].usagename);
				$('#cMedUsageid').val(msg["rows"][0].usageid);
				changeTotalPrice();
			},function(){},{},{"ordid":ordid});
		}else{
			$CommonUI.getTabs('#tabsOrder').tabs('select',2);
			var url=$WEB_ROOT_PATH+'/inspection/listSub.ajax';
			postReq(url,'',function(msg){
				$('#inspectionGrid').datagrid('loadData',msg);
			},function(){},{},{"ordid":ordid});
		}
	};
	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid({
	    //fitColumns:true,
	    singleSelect:true,
	    onAfterEdit:ordersGridOnAfterEdit,
	    height:220,
	    fitColumns:true,
	    toolbar:doctorOrdersGridToolbar,
	    columns:[[
	        {field:'ordGroupno',width:20,align:'center',editor:{type:'numberbox'},title:'关联'},
	        {field:'westernMedicineType',width:40,align:'center',formatter: function(value,row,index){return '临时';},title:'医嘱类型'},
	        {field:'itemname',width:100,align:'center',editor:{type:'combogrid',id:'doctorOrdersGridDetailed',options:{onPressEnter:comboGridOnPressEnter,mode:'remote',hasDownArrow:false,onClickRow:comboGridClick,url: $WEB_ROOT_PATH+'/westernMedicine/searchItem.ajax',idField: 'itemCommonName',textField: 'itemCommonName',fitColumns:true,panelWidth: 600,columns: [[{field:'itemCommonName',title:'名称',width:100,align:'center'},{field:'basicUnit',title:'基本单位',width:40,align:'center'},{field:'dispensUnit',title:'发药单位',width:40,align:'center'},{field:'itemSpec',title:'规格',width:70,align:'center'},{field:'salesPrice',title:'单价',width:70,align:'center'},{field:'itemid',title:'项目编码',width:70,align:'center',hidden:true},{field:'controlCateid',title:'管制',width:70,align:'center',hidden:true},{field:'dispensFacotr',title:'发药系数',width:70,align:'center',hidden:true},{field:'medunit',title:'剂量系数',width:70,align:'center',hidden:true},{field:'medfactor',title:'剂量单位',width:70,align:'center',hidden:true},{field:'ismeditem',title:'是否药品',width:70,align:'center',hidden:true},{field:'ordCateid',title:'医嘱类别子类',width:70,align:'center',hidden:true}]]}},title:'名称'},
	        {field:'perQuantity',width:35,align:'center',editor:{type:'numberbox',options:{onChange:frequnitOnChange}},title:'单次剂量'},
	        {field:'basicUnit',width:22,align:'center',editor:{type:'combobox',options:{onChange:frequnitOnChange,valueField: 'value',textField: 'value'}},title:'单位'},
	        {field:'freqName',width:50,align:'center',editor:{type:'combobox',options:{onSelect:freqnameOnSelect,mode:'remote',valueField: 'freqid',textField: 'freqName',url: $WEB_ROOT_PATH+'/westernMedicine/listFrequecy.ajax'}},title:'频次'},
	        {field:'usagename',width:40,align:'center',editor:{type:'combobox',options:{onSelect:usagenameOnSelect,mode:'remote',valueField:'value',textField:'description',url: $WEB_ROOT_PATH+'/westernMedicine/listUsagename.ajax'}},title:'用法'},
	        {field:'freqquantity',width:30,align:'center',editor:{type:'numberbox',options:{onChange:frequnitOnChange}},title:'疗程'},
	        {field:'frequnit',width:30,align:'center',editor:{type:'combobox',options:{onChange:frequnitOnChange,valueField: 'value',textField: 'value'}},title:'单位'},
	        {field:'salesPrice',width:30,align:'center',editor:{type:'text'},title:'单价'},
	        {field:'orgnameExec',width:50,align:'center',editor:{type:'combobox',options:{onSelect:ctlocOnSelect,valueField: 'orgidExec',textField: 'orgnameExec'}},title:'接收科室'},
	        {field:'unitQuantity',width:30,align:'center',editor:{type:'numberbox',options:{onChange:unitQuantityOnChange}},title:'数量'},
	        {field:'unitName',width:30,align:'center',editor:{type:'text'},title:'单位'},
	        {field:'totalPrice',width:30,align:'center',editor:{type:'text'},title:'金额'},
	        {field:'itemid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'医嘱编码'},
	        {field:'ismeditem',hidden:true,width:10,align:'center',editor:{type:'text'},title:'是否药品'},
	        {field:'controlCateid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'管制分类'},
	        {field:'itemspec',hidden:true,width:10,align:'center',editor:{type:'text'},title:'规格'},
	        {field:'orgidExec',hidden:true,width:10,align:'center',editor:{type:'text'},title:'接收科室编码'},
	        {field:'factor',hidden:true,width:10,align:'center',editor:{type:'text'},title:'包装单位与基本单位换算'},
	        {field:'medfactor',hidden:true,width:10,align:'center',editor:{type:'text'},title:'剂量系数'},
	        {field:'permedQuantity',hidden:true,width:10,align:'center',editor:{type:'text'},title:'剂量单位数量'},
	        {field:'medunitName',hidden:true,width:10,align:'center',editor:{type:'text'},title:'剂量单位名称'},
	        {field:'inputunitSign',hidden:true,width:10,align:'center',editor:{type:'text'},title:'基本单位名称'},
	        {field:'uuid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'唯一编码'},
	        {field:'ordid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'医嘱编码'},
	        {field:'ordCateid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'医嘱类别子类'},
	        {field:'usageid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'用法编码'},
	        {field:'freqid',hidden:true,width:10,align:'center',editor:{type:'text'},title:'频次'},
	        {field:'freqDeg',hidden:true,width:10,align:'center',editor:{type:'text'},title:'频次数'},
	        {field:'freqDay',hidden:true,width:10,align:'center',editor:{type:'text'},title:'频次单位'},
	        {field:'intervalDays',hidden:true,width:10,align:'center',editor:{type:'text'},title:'间隔天数'},
	        {field:'orgnameJson',hidden:true,width:10,align:'center',editor:{type:'text'},title:'接收科室json'},
	        {field:'flag',width:20,align:'center',hidden:true,editor:{type:'text'},title:'数据库'},
	        {field:'flag1',width:20,align:'center',hidden:true,editor:{type:'text'},title:'1'},
	        {field:'flag2',width:20,align:'center',hidden:true,editor:{type:'text'},title:'2'},
	        {field:'purchasePrice',hidden:true,width:10,align:'center',editor:{type:'text'},title:'购入价'},
	    ]]
	});
	$CommonUI.getDataGrid('#historyOrder').datagrid({  
	    url:$WEB_ROOT_PATH+'/searchOrd/listOrder.ajax',
	    fitColumns:true,
	    singleSelect:true,
	    height:130,
	    rowStyler:function(index,row){
	    	if (row.rekStatus==0){
	    		return 'background-color:#5BC0DE;';
	    	}else if (row.rekStatus==1){
	    		return 'background-color:#EC971F;';
	    	}else{
	    		return 'background-color:#d3d3d3;';
	    	}
	    },
	    onClickCell:orderClickCell,
	    queryParams:{
	    	"admisSerialno":$('#hiddenadmisSerialno').val()
	    },
	    columns:[[
	        {field:'ordid',title:'医嘱Id',width:100,hidden:true,align:'center'},
	        {field:'ordName',title:'医嘱名称',width:100,align:'center'},  
	        {field:'rekStatus',title:'结算状态',width:100,align:'center',formatter: function(value,row,index){if (value==0){return "新医嘱";} else if(value==1){return "已发送到收费室";} else if(value==2){return "已收费";}else {return "其他";}}},  
	        {field:'orgnameExec',title:'接收科室',width:100,align:'center'},
	        {field:'ordDate',title:'开立时间',width:100,align:'center'},
	        {field:'empnameDoct',title:'医生',width:100,align:'center'},
	        {field:'action',title:'操作',width:100,align:'center',formatter: function(value,row,index){
	        	if(row.ordTypeid =='00' || row.ordTypeid =='01' || row.ordTypeid =='02'){
	        		e = '<a href="#" onclick="updateOrderAction(\''+row.ordid+'\','+row.ordTypeid+',\''+row.note+'\','+row.timesQuantity+')" style="margin:0 5px">修改</a><a href="#" onclick="deleteOrderAction(\''+row.ordid+'\','+row.ordTypeid+','+index+')"  style="margin:0 5px">删除</a><a href="#" id="prescriptionid" onclick="prescriptionShow(\''+row.ordid+'\','+row.ordTypeid+')"  style="margin:0 5px">处方笺</a>';
	        	}else{
	        		e = '<a href="#" onclick="updateOrderAction(\''+row.ordid+'\','+row.ordTypeid+',\''+row.note+'\','+row.timesQuantity+')" style="margin:0 5px">修改</a><a href="#" onclick="deleteOrderAction(\''+row.ordid+'\','+row.ordTypeid+','+index+')"  style="margin:0 5px">删除</a>';
	        	}
	        	return e;
	        }}
	    ]]
	});
	$('#importTemplate').click(function(){
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
	});
	$('#sendToFee').click(function(){
		var url=$WEB_ROOT_PATH+'/westernMedicine/sendOrder2Charge.ajax';
		var admisSerialno = $('#hiddenadmisSerialno').val();
		$CommonUI.confirm("确认发送?",'question','确定',function(){
			postReq(url,'',function(resuletStr){
				clearAllPatientInfo();
				clearAll();
				$CommonUI.getTabs('#tabsResize').tabs('select',0);
				$('#unfoldOrFold').css("display","none");
				$('#openDetailsDlg').css("display","none");
	    	},'','',{"admisSerialno":admisSerialno});
		});
	});
	/*
	$('#sendToFee').click(function(){
		if($CommonUI.getLinkButton('#sendToFee').linkbutton('options').disabled){
			return;
		}
		var url=$WEB_ROOT_PATH+'/westernMedicine/westernMedicineCtrl.htm?BLHMI=sendOrder2Charge';
		var admisSerialno = $('#hiddenadmisSerialno').val();
		$CommonUI.confirm("确认发送?",'question','确定',function(){
			postReq(url,'',function(resuletStr){
				clearAllPatientInfo();
				clearAll();
				$CommonUI.getTabs('#tabsResize').tabs('select',0);
	    	},'','',{"admisSerialno":admisSerialno});
		});
	});*/
	/*
	 * 
	 * $('#saveBtn').click(function(){
		var tab = $CommonUI.getTabs('#tabsResize').tabs('getSelected');
		var index = $CommonUI.getTabs('#tabsResize').tabs('getTabIndex',tab);
		if(index==0){
			var patientid=$('#hiddenpatientId').val();
			if (patientid != null && patientid != '') {
				//诊断
				if(diagnosissave()==-1){
					return;
				};
				//门诊病历
				if($CommonUI.getForm("#appendInfoForm").form("validate")){
					postReq($WEB_ROOT_PATH+'/appendInfo/appendInfoCtrl.htm?BLHMI=appendInfoSaveOrUpdate', "#appendInfoForm", appendSucc, err, {skipHidden:false});
				}
				//随访
				followUpTreat();
			} else {
				$CommonUI.alert("请先接诊一个患者");
			}
		}else if(index==1){
			//医嘱页面审核
			var subtab = $CommonUI.getTabs('#tabsOrder').tabs('getSelected');
			var subindex = $CommonUI.getTabs('#tabsOrder').tabs('getTabIndex',subtab);
			if(subindex==0){
				if(!check()){
					//检查西医医嘱疗程和单次剂量
					return;
				}
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('acceptChanges');
				//医嘱录入审核
				var url=$WEB_ROOT_PATH+'/westernMedicine/westernMedicineCtrl.htm?BLHMI=saveItem';
		    	var Str="";
		    	var myIndex=$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
		    	var patientId=$('#hiddenpatientId').val();
		    	var admisSerialno=$('#hiddenadmisSerialno').val();
		    	var serialno = $('#hiddenserialno').val();
		    	if(patientId==""||patientId==undefined){
		    		$CommonUI.alert("请先选择患者", 'warning');
		    		return;
		    	}
		    	if(admisSerialno==""||admisSerialno==undefined){
		    		$CommonUI.alert("请先挂号", 'warning');
		    		return;
		    	}
		    	var json = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getData');
		    	var rows=json.rows;
		    	var Fields = new Array();
		    	var j=0;
		    	for(var i=0; i<rows.length; i++)
		    	{
		    		if(rows[i].itemid==""||rows[i].itemid==undefined||rows[i].itemid==null){
		    			continue;
		    		}
		    		var Field = new Object();
		    		Field.itemid = rows[i].itemid;
		    		Field.rowno = rows[i].rowno;
		    		Field.perQuantity = rows[i].perQuantity;
		    		Field.basicUnit = rows[i].basicUnit;
		    		Field.freqid = rows[i].freqid;
		    		Field.freqDay = rows[i].freqDay;
		    		Field.freqDeg = rows[i].freqDeg;
		    		Field.usagename = rows[i].usagename;
		    		Field.usageid = rows[i].usageid;
		    		Field.freqquantity = rows[i].freqquantity;
		    		Field.frequnit = rows[i].frequnit;
		    		Field.salesPrice = rows[i].salesPrice;
		    		Field.orgnameExec = rows[i].orgnameExec;
		    		Field.unitQuantity = rows[i].unitQuantity;
		    		Field.ordGroupno = rows[i].ordGroupno;
		    		Field.controlCateid = rows[i].controlCateid;
		    		Field.itemname = rows[i].itemname;
		    		Field.unitName = rows[i].unitName;
		    		Field.itemspec = rows[i].itemspec;
		    		Field.orgidExec = rows[i].orgidExec;
		    		Field.factor = rows[i].factor;
		    		Field.medfactor = rows[i].medfactor;
		    		Field.inputunitSign = rows[i].inputunitSign;
		    		Field.medunitName = rows[i].medunitName;
		    		Field.uuid = rows[i].uuid;
		    		Field.ordid = rows[i].ordid;
		    		Field.ordCateid = rows[i].ordCateid;
		    		Field.usageid = rows[i].usageid;
		    		Field.ismeditem = rows[i].ismeditem;
		    		Field.intervalDays = rows[i].intervalDays;
		    		Fields[j] = Field;
		    		j++;
		    	}
		    	Str = $.toJSON(Fields);
		    	postReq(url, 'westernMedicineDiv',function(resuletStr){
		    		$("#WMedordid").val("");
		    		$('#deleteUuid').val("");
		    		loadOrder(admisSerialno);
		    		$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("loadData",{"total":"0","rows":[]});
		    		totalPriceOnChange();
		    	},'','',{"filterStr":myIndex,"orderItemString":Str,"patientId":patientId,"admisSerialno":admisSerialno,"serialno":serialno});
			}else if(subindex==1){
				$('#chinaMedicineGrid').datagrid('acceptChanges');
				//中草药医嘱审核
				var url=$WEB_ROOT_PATH+'/chineseMedicine/chineseMedicineCtrl.htm?BLHMI=saveItem';
		    	var Str="";
		    	var patientId=$('#hiddenpatientId').val();
		    	var admisSerialno=$('#hiddenadmisSerialno').val();
		    	var serialno = $('#hiddenserialno').val();
		    	var json = $('#chinaMedicineGrid').datagrid('getData');
		    	var rows=json.rows;
		    	var Fields = new Array();
		    	var cMedTQ = $('#cMedTQ').combobox('getValue');
		    	var cMedUsageid = $('#cMedUsageid').val();
		    	var cMedFrequency = $('#cMedFrequency').combobox('getValue');
		    	var cMedOrgidExec = $('#cMedOrgidExec').val();
		    	if(cMedTQ==null||cMedTQ==undefined||cMedTQ==""){
		    		$CommonUI.alert("请输入付数","error");
		    		return ;
		    	}
		    	if(cMedUsageid==null||cMedUsageid==undefined||cMedUsageid==""){
		    		$CommonUI.alert("请输入用法","error");
		    		return ;
		    	}
		    	if(cMedFrequency==null||cMedFrequency==undefined||cMedFrequency==""){
		    		$CommonUI.alert("请输入频次","error");
		    		return ;
		    	}
		    	if(cMedOrgidExec==null||cMedOrgidExec==undefined||cMedOrgidExec==""){
		    		$CommonUI.alert("请输入接收科室","error");
		    		return ;
		    	}
		    	for(var i=0; i<rows.length; i++)
		    	{
		    		var Field = new Object();
		    		
		    		Field.chinaMedicine1 = rows[i].chinaMedicine1;
		    		Field.chinaMedicine11 = rows[i].chinaMedicine11;
		    		Field.chinaMedicine21 = rows[i].chinaMedicine21;
		    		Field.chinaMedicine2 = rows[i].chinaMedicine2;
		    		Field.chinaMedicine3 = rows[i].chinaMedicine3;
		    		Field.chinaMedicine13 = rows[i].chinaMedicine13;
		    		Field.chinaMedicine23 = rows[i].chinaMedicine23;
		    		Field.chinaMedicine4 = rows[i].chinaMedicine4;
		    		Field.chinaMedicine5 = rows[i].chinaMedicine5;
		    		Field.chinaMedicine15 = rows[i].chinaMedicine15;
		    		Field.chinaMedicine25 = rows[i].chinaMedicine25;
		    		Field.chinaMedicine6 = rows[i].chinaMedicine6;
		    		Field.chinaMedicine7 = rows[i].chinaMedicine7;
		    		Field.chinaMedicine17 = rows[i].chinaMedicine17;
		    		Field.chinaMedicine27 = rows[i].chinaMedicine27;
		    		Field.chinaMedicine8 = rows[i].chinaMedicine8;
		    		Fields[i] = Field;
		    	}
		    	Str = $.toJSON(Fields);
		    	postReq(url, 'chinaMedicineDiv',function(resultStr){
		    		if(resultStr["resultStr"]==0){
		    			$('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
		    			$("input[name='singleDose']").val("");
		    			$("input[name='medicineFilter']").val("");
		    			$("input[name='remarks']").val("");
		    			$("#totalPrice").html("");
		    			$("#cMedordid").val();
		    			loadOrder(admisSerialno);
		    		}else {
		    			$CommonUI.alert("保存失败","error");
		    		}
		    	},"",{"skipHidden":false},{"orderItemString":Str,"patientId":patientId,"admisSerialno":admisSerialno,"serialno":serialno});
			}else{
				$('#inspectionGrid').datagrid('acceptChanges');
		    	var patientid=$('#hiddenpatientId').val();
		    	var admisSerialno=$('#hiddenadmisSerialno').val();
		    	var serialno = $('#hiddenserialno').val();
		    	var json = $('#inspectionGrid').datagrid('getData');
		    	var rows=json.rows;
		    	var Fields = new Array();
		    	for(var i=0; i<rows.length; i++)
		    	{
		    		var Field = new Object();
		    		Field.ordid = rows[i].ordid;
		    		Field.orddicid = rows[i].orddicid;
		    		Field.applyid = rows[i].applyid;
		    		Field.spbody = rows[i].spbody;
		    		Field.ordName = rows[i].ordName;
		    		Field.ordTypeid = rows[i].ordTypeid;
		    		Field.ordTypename = rows[i].ordTypename;
		    		Field.orgidExec = rows[i].orgidExec;
		    		Field.orgnameExec = rows[i].orgnameExec;
		    		Field.note = rows[i].note;
		    		Fields[i] = Field;
		    	}
		    	Str = $.toJSON(Fields);
		    	var url=$WEB_ROOT_PATH+'/inspection/inspectionCtrl.htm?BLHMI=inspectionSaveAndApply';
		    	postReq(url, '',function(data){
		    		$('#inspectionGrid').datagrid("loadData",{"total":"0","rows":[]});
		    		$CommonUI.getDataGrid('#historyOrder').datagrid('load');
		    		loadOrder(admisSerialno);
		    	},function(){$CommonUI.autoCloseCenterMessage("审核失败","info","",500);},{skipHidden : false},{"inspectString" : Str,"patientid":patientid,"admisSerialno":admisSerialno,"serialno":serialno});
			}
		}else{
			//alert("历次就诊记录审核");
		}
		loadTreatedRecord($('#hiddenpatientId').val());
	});
	
	*/
//患者详细信息展示切换	
/*$('#unfoldOrFold').toggle(function(){
	var patientid = $('#hiddenpatientId').val();
	$("#patientid").attr("value", patientid);
	loadPatientDetailInfo(patientid);
	$('#basicInfo').hide();
	$('#morePatientInfo').show();//患者详细信息
	$('#unfoldImg').attr({src: "/chis/images/u.png",title: "收起患者详细信息"});
},function(){
	$('#morePatientInfo').hide();
	$('#basicInfo').show();
	$('#unfoldImg').attr({src: "/chis/images/d.png",title: "展开患者详细信息"});
});*/
});
//检查西医医嘱疗程和单次剂量
function check(){
	var length = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
	for(var i=0;i<length;i++){
		var itemidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemid'});
		if(itemidEditor==null){
			continue;
		}
		if($(itemidEditor.target).val()==""||$(itemidEditor.target).val()==undefined||$(itemidEditor.target).val()==null){
			continue;
		}
		//单次剂量
		var perQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'perQuantity'});
		if(perQuantityEditor==null){
			continue;
		}
		if($(perQuantityEditor.target).numberbox('getValue')==""||$(perQuantityEditor.target).numberbox('getValue')==undefined||$(perQuantityEditor.target).numberbox('getValue')==null){
			$CommonUI.alert("第"+(i+1)+"行,请输入单次剂量","error");
			$CommonUI.getTabs('#tabsOrder').tabs('select',0);
			return false;
		}
		//疗程
		var freqquantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'freqquantity'});
		if(freqquantityEditor==null){
			continue;
		}
		if($(freqquantityEditor.target).numberbox('getValue')==""||$(freqquantityEditor.target).numberbox('getValue')==undefined||$(freqquantityEditor.target).numberbox('getValue')==null){
			$CommonUI.alert("第"+(i+1)+"行,请输入疗程","error");
			$CommonUI.getTabs('#tabsOrder').tabs('select',0);
			return false;
		}
	}
	return true;
}
//从combogrid保存医嘱到datagrid
function saveOrdFromCombogrid(rowIndex,rowData,msg,flag){
	if(flag==1){
		//用于用户输入不合法,重新返回编辑状态
		msg=$.evalJSON(msg);
		var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'basicUnit'});
		$(basicUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.basicUnit,"selected":true },{"value":rowData.medunitName}]});
		var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'orgnameExec'});
		$(orgnameExecEditor.target).combobox('loadData',msg["rows"]);
		//单价
		var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});
		$(salesPriceEditor.target).val(rowData.salesPrice);
		$(salesPriceEditor.target).attr({"disabled":true});
		//剂量单位名称
		var medunitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'medunitName'});
		$(medunitNameEditor.target).val(rowData.medunitName);
		//名称
		var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'itemname'});
		$(itemnameEditor.target).val(rowData.itemname);
		//医嘱编码
		var itemidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'itemid'});
		$(itemidEditor.target).val(rowData.itemid);
		//管制分类
		var controlCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'controlCateid'});
		$(controlCateidEditor.target).val(rowData.controlCateid);
		//包装单位名称
		var unitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'unitName'});
		$(unitNameEditor.target).val(rowData.unitName);
		$(unitNameEditor.target).attr({"disabled":true});
		//规格
		var itemspecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'itemspec'});
		$(itemspecEditor.target).val(rowData.itemspec);
		//包装单位与基本单位换算
		var factorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'factor'});
		$(factorEditor.target).val(rowData.factor);
		
		//剂量系数
		var medfactorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'medfactor'});
		$(medfactorEditor.target).val(rowData.medfactor);
		//基本单位
		$(basicUnitEditor.target).combobox('setValue', rowData.basicUnit);
		//基本单位名称
		var inputunitSignEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'inputunitSign'});
		$(inputunitSignEditor.target).val(rowData.inputunitSign);
		//医嘱类别子类
		var ordCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'ordCateid'});
		$(ordCateidEditor.target).val(rowData.ordCateid);
		//是否药品
		var ismeditemEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'ismeditem'});
		$(ismeditemEditor.target).val(rowData.ismeditem);
		//接收科室json
		var orgnameJsonEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'orgnameJson'});
		$(orgnameJsonEditor.target).val($.toJSON(msg));
		//接收科室id
		var orgidExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'orgidExec'});
		$(orgidExecEditor.target).val(msg["rows"][0].orgidExec);
		//接收科室
		var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'orgnameExec'});
		$(orgnameExecEditor.target).combobox("setValue",msg["rows"][0].orgnameExec);
		//疗程单位
		var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:rowIndex,field:'frequnit'});
		$(frequnitEditor.target).combobox('loadData', {total:2, rows:[{"value":"天","selected":true},{"value":"周"}]});
	}else{
		var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	    var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
		var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'basicUnit'});
		$(basicUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.basicUnit,"selected":true },{"value":rowData.medunit}]});
		var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
		$(orgnameExecEditor.target).combobox('loadData',msg["rows"]);
		//单价
		var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
		$(salesPriceEditor.target).val(rowData.salesPrice);
		$(salesPriceEditor.target).attr({"disabled":true});
		//剂量单位名称
		var medunitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medunitName'});
		$(medunitNameEditor.target).val(rowData.medunit);
		//名称
		var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemname'});
		$(itemnameEditor.target).val(rowData.itemCommonName);
		//医嘱编码
		var itemidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemid'});
		$(itemidEditor.target).val(rowData.itemid);
		//管制分类
		var controlCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'controlCateid'});
		$(controlCateidEditor.target).val(rowData.controlCateid);
		//包装单位名称
		var unitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitName'});
		$(unitNameEditor.target).val(rowData.dispensUnit);
		$(unitNameEditor.target).attr({"disabled":true});
		//规格
		var itemspecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemspec'});
		$(itemspecEditor.target).val(rowData.itemSpec);
		//包装单位与基本单位换算
		var factorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'factor'});
		$(factorEditor.target).val(rowData.dispensFacotr);
		//剂量系数
		var medfactorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medfactor'});
		$(medfactorEditor.target).val(rowData.medfactor);
		//基本单位
		$(basicUnitEditor.target).combobox('setValue', rowData.basicUnit);
		//基本单位名称
		var inputunitSignEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'inputunitSign'});
		$(inputunitSignEditor.target).val(rowData.basicUnit);
		//医嘱类别子类
		var ordCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'ordCateid'});
		$(ordCateidEditor.target).val(rowData.ordCateid);
		//是否药品
		var ismeditemEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'ismeditem'});
		$(ismeditemEditor.target).val(rowData.ismeditem);
		//接收科室json
		var orgnameJsonEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameJson'});
		$(orgnameJsonEditor.target).val($.toJSON(msg));
		//接收科室id
		var orgidExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgidExec'});
		$(orgidExecEditor.target).val(msg["rows"][0].orgidExec);
		//接收科室
		var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
		$(orgnameExecEditor.target).combobox("setValue",msg["rows"][0].orgnameExec);
		//频次
		var freqNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqName'});
		var freqNameData=$(freqNameEditor.target).combobox("getData");
		$(freqNameEditor.target).combobox("setValue",freqNameData[0].freqName);
		var freqidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqid'});
		$(freqidEditor.target).val(freqNameData[0].freqid);
		var freqDegEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDeg'});
		$(freqDegEditor.target).val(freqNameData[0].freqDeg);
		var freqDayEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDay'});
		$(freqDayEditor.target).val(freqNameData[0].freqUnit);
		var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
		$(intervalDaysEditor.target).val(freqNameData[0].intervalDays);
		//用法
		var usagenameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usagename'});
		var usagenameData=$(usagenameEditor.target).combobox("getData");
		$(usagenameEditor.target).combobox('setValue',usagenameData[0].description);
		var usageidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usageid'});
		$(usageidEditor.target).val(usagenameData[0].value);
		//疗程单位
		var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'frequnit'});
		$(frequnitEditor.target).combobox('loadData', {total:2, rows:[{"value":"天","selected":true},{"value":"周"}]});
		//购入价
		var purchasePriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'purchasePrice'});
		$(purchasePriceEditor.target).val(rowData.wholesalesPrice);
	}
	
}
//combogrid的单击响应事件
function comboGridClick(rowIndex,rowData){
	var url=$WEB_ROOT_PATH+'/orderpermit/permission.ajax';
	postReq(url, '', function(msg){
		if(msg["total"]==1){
			//有权限,接收科室确定
			var flag=false;//判断是否具有 相同医嘱的标志
			var index = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
			var editRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
			var editIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex",editRow);
			for(var i=0;i<index;i++){
				if(i==editIndex){
					continue;
				}
				if($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemid'})!=null){
					if($($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemid'}).target).val()==rowData.itemid){
						flag=true;
					}
				}else{
					var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getData");
					var itemid = selectedRow.rows[i].itemid;
					if(itemid==rowData.itemid){
						flag=true;
					}
				}
				
			}
			if(flag==true){
				$CommonUI.confirm("已存在相同医嘱,是否继续开立?", 'warning', "继续", function(){
					saveOrdFromCombogrid(rowIndex,rowData,msg);
				}, "取消", function(){
					$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('deleteRow',index-1);
					return false;});
			}else{
				saveOrdFromCombogrid(rowIndex,rowData,msg);
			}
		}else if(msg["total"]==2){
			$CommonUI.alert("限制药品,请谨慎", 'warning');
			var flag=false;//判断是否具有 相同医嘱的标志
			var index = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
			var editRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
			var editIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex",editRow);
			for(var i=0;i<index;i++){
				if(i==editIndex){
					continue;
				}
				if($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemid'})!=null){
					if($($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemid'}).target).val()==rowData.itemid){
						flag=true;
					}
				}else{
					var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getData");
					var itemid = selectedRow.rows[i].itemid;
					if(itemid==rowData.itemid){
						flag=true;
					}
				}
			}
			if(flag==true){
				$CommonUI.confirm("已存在相同医嘱,是否继续开立?", 'warning', "继续", function(){
					saveOrdFromCombogrid(rowIndex,rowData,msg);
				}, "取消", function(){
					$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('deleteRow',index-1);
					return false;});
			}else{
				saveOrdFromCombogrid(rowIndex,rowData,msg);
			}
		}else if(msg["total"]==3){
			$CommonUI.alert("库存不足,请更换药品或者入库该药品", 'error');
		}else{
			$CommonUI.alert("权限不足", 'error');
		}
	},'','',{"patientType":"01","ordItemid":rowData.itemid,"controlCateid":rowData.controlCateid,"type":"01","ordCateid":rowData.ordCateid});
	
}

//西医执行科室选择
function ctlocOnSelect(record){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
    var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
    //接收科室
	var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox('setValue', record.orgnameExec);
	//接收科室编码
	var orgidExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgidExec'});
	$(orgidExecEditor.target).val(record.orgidExec);
}
//医嘱grid工具栏
var doctorOrdersGridToolbar = [{
	    text:'添加',
	    iconCls:'chis-add',
	    handler:function(){
	    	var myIndex=$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows').length;
	    	
	    	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('appendRow',{
	    		//index: myIndex,
	    		row:{
	    			rowno:myIndex+1,
	    			westernMedicineType:"临时"
	    		}
	    	});
	    	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('selectRow',myIndex);
	    	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('beginEdit',myIndex);	    	
	    }
	},{
	    text:'删除',
	    iconCls:'chis-wrong',
	    handler:function(){
	        var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	        var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
	        selectedRow && $CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
	        	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("deleteRow", selectedIndex);
	        	totalPriceOnChange();
	        	if(selectedRow.uuid!=""&&selectedRow.uuid!=undefined&&selectedRow.uuid!=null){
	        		deleteUuid=$('#deleteUuid').val();
	        		if(deleteUuid!=""&&deleteUuid!=undefined){
	        			deleteUuid=deleteUuid+","+selectedRow.uuid;
	        		}else{
	        			deleteUuid=selectedRow.uuid;
	        		}
	        		$('#deleteUuid').val(deleteUuid);
		        }
	        });
	    }
	},{
		text:'新建处方',
	    iconCls:'chis-clear',
	    handler:function(){
	    	$("#WMedordid").val("");
    		$('#deleteUuid').val("");
	    	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("loadData",{"total":"0","rows":[]});
	    }
	}];
//中药grid工具栏
var chinaMedicineGridToolbar =[{
	    text:'添加',
	    iconCls:'chis-add',
	    handler:function(){
	    	var myIndex=$('#chinaMedicineGrid').datagrid('getRows').length;
	    	$('#chinaMedicineGrid').datagrid('appendRow',{});
	    	$('#chinaMedicineGrid').datagrid('selectRow',myIndex);
	    	$('#chinaMedicineGrid').datagrid('beginEdit',myIndex);
	    }
	},{
	    text:'删除',
	    iconCls:'chis-wrong',
	    handler:function(){
	        var selectedRow = $('#chinaMedicineGrid').datagrid("getSelected");
	        var selectedIndex = $('#chinaMedicineGrid').datagrid("getRowIndex", selectedRow);
	        selectedRow && $CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
	        	$('#chinaMedicineGrid').datagrid("deleteRow", selectedIndex);
	        });
	    }
	},{
	    text:'新建处方',
	    iconCls:'chis-clear',
	    handler:function(){
	    	$('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
			$("input[name='tord.note']").val("");
			$("#totalPriceCM").html("0.0");
			$("#cMedordid").val("");
			$('#historyOrder').datagrid("unselectAll");
	    }
	}];
//中药第一列选择
function chinaMedicine1OnSelect(record){
	var selectedRow = $('#chinaMedicineGrid').datagrid("getSelected");
    var selectedIndex = $('#chinaMedicineGrid').datagrid("getRowIndex", selectedRow);
    var url=$WEB_ROOT_PATH+'/orderpermit/permissionCM.ajax';
    postReq(url,'',function(data){
    	if(data["total"]!="1"){
    		var strs = data["total"].split("^");
    		$CommonUI.alert(strs[1]);
    		var chinaMedicine1Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine1'});
			$(chinaMedicine1Editor.target).combobox('setValue','');
    		return;
    	}else{
			var chinaMedicine1Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine1'});
			$(chinaMedicine1Editor.target).combobox('setValue',record.itemname);
			var chinaMedicine11Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine11'});
			$(chinaMedicine11Editor.target).val(record.itemid);
			var chinaMedicine21Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine21'});
			$(chinaMedicine21Editor.target).val(record.salesPrice);
			changeTotalPrice();
		}
	},'','',{"ordItemid":record.itemid,"orgidExec":$("#cMedOrgidExec").val()});
}
//中药第三列选择
function chinaMedicine3OnSelect(record){
	var selectedRow = $('#chinaMedicineGrid').datagrid("getSelected");
    var selectedIndex = $('#chinaMedicineGrid').datagrid("getRowIndex", selectedRow);
    var url=$WEB_ROOT_PATH+'/orderpermit/permissionCM.ajax';
    postReq(url,'',function(data){
    	if(data["total"]!="1"){
    		var strs = data["total"].split("^");
    		$CommonUI.alert(strs[1]);
    		var chinaMedicine3Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine3'});
			$(chinaMedicine3Editor.target).combobox('setValue','');
    		return;
    	}else{
    		var chinaMedicine3Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine3'});
    		$(chinaMedicine3Editor.target).combobox('setValue',record.itemname);
    		var chinaMedicine13Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine13'});
    		$(chinaMedicine13Editor.target).val(record.itemid);
    		var chinaMedicine23Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine23'});
    		$(chinaMedicine23Editor.target).val(record.salesPrice);
    		changeTotalPrice();
    	}
    },'','',{"ordItemid":record.itemid,"orgidExec":$("#cMedOrgidExec").val()});
}
//中药第五列选择
function chinaMedicine5OnSelect(record){
	var selectedRow = $('#chinaMedicineGrid').datagrid("getSelected");
    var selectedIndex = $('#chinaMedicineGrid').datagrid("getRowIndex", selectedRow);
    var url=$WEB_ROOT_PATH+'/orderpermit/permissionCM.ajax';
    postReq(url,'',function(data){
    	if(data["total"]!="1"){
    		var strs = data["total"].split("^");
    		$CommonUI.alert(strs[1]);
    		var chinaMedicine5Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine5'});
			$(chinaMedicine5Editor.target).combobox('setValue','');
    		return;
    	}else{
    		var chinaMedicine5Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine5'});
    		$(chinaMedicine5Editor.target).combobox('setValue',record.itemname);
    		var chinaMedicine15Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine15'});
    		$(chinaMedicine15Editor.target).val(record.itemid);
    		var chinaMedicine25Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine25'});
    		$(chinaMedicine25Editor.target).val(record.salesPrice);
    		changeTotalPrice();
    	}
    },'','',{"ordItemid":record.itemid,"orgidExec":$("#cMedOrgidExec").val()});
}
//中药第七列选择
function chinaMedicine7OnSelect(record){
	var selectedRow = $('#chinaMedicineGrid').datagrid("getSelected");
    var selectedIndex = $('#chinaMedicineGrid').datagrid("getRowIndex", selectedRow);
    var url=$WEB_ROOT_PATH+'/orderpermit/permissionCM.ajax';
    postReq(url,'',function(data){
    	if(data["total"]!="1"){
    		var strs = data["total"].split("^");
    		$CommonUI.alert(strs[1]);
    		var chinaMedicine7Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine7'});
			$(chinaMedicine7Editor.target).combobox('setValue','');
    		return;
    	}else{
    		var chinaMedicine7Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine7'});
    		$(chinaMedicine7Editor.target).combobox('setValue',record.itemname);
    		var chinaMedicine17Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine17'});
    		$(chinaMedicine17Editor.target).val(record.itemid);
    		var chinaMedicine27Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:selectedIndex,field:'chinaMedicine27'});
    		$(chinaMedicine27Editor.target).val(record.salesPrice);
    		changeTotalPrice();
    	}
    },'','',{"ordItemid":record.itemid,"orgidExec":$("#cMedOrgidExec").val()});
}
function changeTotalPrice(){
	var CMGridData = $('#chinaMedicineGrid').datagrid('getRows');
	var index = CMGridData.length;
	var totalPrice=0;
	for(var i=0;i<index;i++){
		var price1Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine21'});
		var price2Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine23'});
		var price3Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine25'});
		var price4Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine27'});
		var count1Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine2'});
		var count2Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine4'});
		var count3Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine6'});
		var count4Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine8'});
		if(price1Editor!=null&&count1Editor!=null){
			if(!isNaN($(price1Editor.target).val())&&!isNaN($(count1Editor.target).val())){
				totalPrice = Number(totalPrice) + Number($($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine21'}).target).val() * $($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine2'}).target).val());
			}
		}else{
			if(!isNaN(CMGridData[i].chinaMedicine21)&&!isNaN(CMGridData[i].chinaMedicine2)){
				totalPrice = Number(totalPrice) + Number(CMGridData[i].chinaMedicine21 * CMGridData[i].chinaMedicine2);
			}
		}
		if(price2Editor!=null&&count2Editor!=null){
			if(!isNaN($(price2Editor.target).val())&&!isNaN($(count2Editor.target).val())){
				totalPrice = Number(totalPrice) + Number($($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine23'}).target).val() * $($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine4'}).target).val());
			}
		}else{
			if(!isNaN(CMGridData[i].chinaMedicine23)&&!isNaN(CMGridData[i].chinaMedicine4)){
				totalPrice = Number(totalPrice) + Number(CMGridData[i].chinaMedicine23* CMGridData[i].chinaMedicine4);
			}
		}
		if(price3Editor!=null&&count3Editor!=null){
			if(!isNaN($(price3Editor.target).val())&&!isNaN($(count3Editor.target).val())){
				totalPrice = Number(totalPrice) + Number($($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine25'}).target).val() * $($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine6'}).target).val());
			}
		}else{
			if(!isNaN(CMGridData[i].chinaMedicine25)&&!isNaN(CMGridData[i].chinaMedicine6)){
				totalPrice = Number(totalPrice) + Number(CMGridData[i].chinaMedicine25 * CMGridData[i].chinaMedicine6);
			}
		}
		if(price4Editor!=null&&count4Editor!=null){
			if(!isNaN($(price4Editor.target).val())&&!isNaN($(count4Editor.target).val())){
				totalPrice = Number(totalPrice) + Number($($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine27'}).target).val() * $($('#chinaMedicineGrid').datagrid('getEditor', {index:i,field:'chinaMedicine8'}).target).val());
			}
		}else{
			if(!isNaN(CMGridData[i].chinaMedicine27)&&!isNaN(CMGridData[i].chinaMedicine8)){
				totalPrice = Number(totalPrice) + Number(CMGridData[i].chinaMedicine27 * CMGridData[i].chinaMedicine8);
			}
		}
	}
	var cMedTQ = $('#cMedTQ').combobox('getValue'); 
	totalPrice = totalPrice * cMedTQ;
	$('#totalPriceCM').html(totalPrice.toFixed(2));
}
//检验检查grid工具栏
var inspectionGridToolbar =[{
    text:'添加',
    iconCls:'chis-add',
    handler:function(){
    	var myIndex=$('#inspectionGrid').datagrid('getRows').length;
    	$('#inspectionGrid').datagrid('appendRow',{
    		report:'<a herf="#">查看</a>'
    	});
    	$('#inspectionGrid').datagrid('selectRow',myIndex);
    	$('#inspectionGrid').datagrid('beginEdit',myIndex);
    }
},{
    text:'删除',
    iconCls:'chis-wrong',
    handler:function(){
        var selectedRow = $('#inspectionGrid').datagrid("getSelected");
        if(selectedRow==null){
        	$CommonUI.autoCloseCenterMessage("请选中一行再删除");
        	return;
        }else{
	        var selectedIndex = $('#inspectionGrid').datagrid("getRowIndex", selectedRow);
	        selectedRow && $CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
	        	$('#inspectionGrid').datagrid("deleteRow", selectedIndex);
	        });
        }
    }
}];
formatterDateTime = function(myDate) {
    Y = myDate.getFullYear();
    M = myDate.getMonth()+1<10?"0"+(myDate.getMonth()+1):myDate.getMonth()+1;
	D = myDate.getDate()<10?"0"+myDate.getDate():myDate.getDate();
    h = myDate.getHours()<10?"0"+myDate.getHours():myDate.getHours();
    m = myDate.getMinutes()<10?"0"+myDate.getMinutes():myDate.getMinutes();
    s = myDate.getSeconds()<10?"0"+myDate.getSeconds():myDate.getSeconds();
    return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
};
var inspectionRowClick = function (rowIndex,rowData){
	var url=$WEB_ROOT_PATH+'/orderpermit/permissionInsp.ajax';
	postReq(url, '', function(msg){
		var flag=false;
		var index = $('#inspectionGrid').datagrid('getRows').length;
		var editRow = $CommonUI.getDataGrid('#inspectionGrid').datagrid("getSelected");
		var editIndex = $CommonUI.getDataGrid('#inspectionGrid').datagrid("getRowIndex",editRow);
		for(var i=0;i<index;i++){
			if(i==editIndex){
				continue;
			}
			if($CommonUI.getDataGrid('#inspectionGrid').datagrid('getEditor', {index:i,field:'orddicid'})!=null){
				if($($CommonUI.getDataGrid('#inspectionGrid').datagrid('getEditor', {index:i,field:'orddicid'}).target).val()==rowData.orddicid){
					flag=true;
				}
			}else{
				var selectedRow = $CommonUI.getDataGrid('#inspectionGrid').datagrid("getData");
				var itemid = selectedRow.rows[i].orddicid;
				if(itemid==rowData.orddicid){
					flag=true;
				}
			}
		}
		if(flag==true){
			$CommonUI.alert("已存在相同医嘱!");
			return;
		}else{
			var selectedRow = $('#inspectionGrid').datagrid("getSelected");
		    var selectedIndex = $('#inspectionGrid').datagrid("getRowIndex", selectedRow);
			//医嘱套编码
			var orddicidEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orddicid'});
			$(orddicidEditor.target).val(rowData.orddicid);
			//医嘱类型编码
			var ordTypeidEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'ordTypeid'});
			$(ordTypeidEditor.target).val(rowData.ordTypeid);
			//医嘱类型编码
			var ordTypenameEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'ordTypename'});
			if(rowData.ordTypeid=="03"){
				$(ordTypenameEditor.target).combobox("setValue","检验");
			}else if(rowData.ordTypeid=="04"){
				$(ordTypenameEditor.target).combobox("setValue","检查");
			}else if(rowData.ordTypeid=="05"){
				$(ordTypenameEditor.target).combobox("setValue","治疗");
			}else if(rowData.ordTypeid=="06"){
				$(ordTypenameEditor.target).combobox("setValue","手术");
			}
			//名称
			var ordNameEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'ordName'});
			$(ordNameEditor.target).val(rowData.orddicname);
			//名称备份
			var ordNameBackupEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'ordNameBackup'});
			$(ordNameBackupEditor.target).val(rowData.orddicname);
			//单价
			var amountTotalEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'amountTotal'});
			$(amountTotalEditor.target).val(rowData.amountTotal);
			$(amountTotalEditor.target).attr({"disabled":true});
			
			var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
			$(orgnameExecEditor.target).combobox('loadData',msg);
			//接收科室json
			var orgnameJsonEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgnameJson'});
			$(orgnameJsonEditor.target).val($.toJSON(msg));
			//接收科室id
			var orgIdExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgidExec'});
			$(orgIdExecEditor.target).val(msg.rows[0].orgidExec);
			//接收科室
			var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
			$(orgnameExecEditor.target).combobox("setValue",msg.rows[0].orgnameExec);
		}
	},'','',{"ordItemid":rowData.orddicid,"ordCateid":rowData.ordCateid});
};
//西医医嘱结束编辑状态
var ordersGridOnAfterEdit=function(rowIndex, rowData, changes){
	if(rowData.flag1!=""&&rowData.flag1!=undefined){
		$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('updateRow',{
			index: rowIndex,
			row: {
				itemname: rowData.flag1,
				orgnameExec:rowData.flag2
			}
		});
	}
};
//删除一个处方(医嘱套)
function deleteOrderAction(ordid,ordTypeid,index){
	$CommonUI.confirm("确认删除?",'question','确定',function(){
		if(ordTypeid=='00'||ordTypeid=='02'){
			postReq($WEB_ROOT_PATH+'/searchOrd/delete.ajax?ordid='+ordid,'',
				function(msg){
					if(msg["rekStatus"]==1){
						$("#WMedordid").val("");
			    		$('#deleteUuid').val("");
						//$CommonUI.getDataGrid('#historyOrder').datagrid('load');
						loadOrder($('#hiddenadmisSerialno').val());
						$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("loadData",{"total":"0","rows":[]});
						$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
					}else if(msg["rekStatus"]==2){
						$CommonUI.alert("医嘱已结算,不能删除",'error');
					}
				},function(){});
		}else if(ordTypeid=='01'){
			postReq($WEB_ROOT_PATH+'/searchOrd/delete.ajax?ordid='+ordid,'',
				function(msg){
					if(msg["rekStatus"]==1){
						//$CommonUI.getDataGrid('#historyOrder').datagrid('load');
						loadOrder($('#hiddenadmisSerialno').val());
						$('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
						$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
						$("#cMedordid").val("");
					}else if(msg["rekStatus"]==2){
						$CommonUI.alert("医嘱已结算,不能删除",'error');
					}
					
				},function(){});
		}else{
			postReq($WEB_ROOT_PATH+'/inspection/deleteInspection.ajax?ordid='+ordid,'',
					function(msg){
						if(msg["rekStatus"] == 2){
							$CommonUI.alert("医嘱已结算,不能删除",'error');
						}else{
							loadOrder($('#hiddenadmisSerialno').val());
							$('#inspectionGrid').datagrid("loadData",{"total":"0","rows":[]});
							$CommonUI.autoCloseCenterMessage("删除成功","info","",1000);
						}
					},function(){$CommonUI.autoCloseCenterMessage("删除失败","info","",1000);});
		}
	});
}
function timeOutFun(msg){
	var i=0;
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	while(itemnameEditor!=null){
		i++;
		itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	}
	if(i>=$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRows").length){
		clearInterval(timer);
		return;
	}
	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('selectRow',i);
	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('beginEdit',i);
	itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	$(itemnameEditor.target).combogrid({url:''});
	var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'basicUnit'});
	$(basicUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":msg.rows[i].inputunitSign},{"value":msg.rows[i].medunitName}]});
	var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'frequnit'});
	$(frequnitEditor.target).combobox('loadData', {total:2, rows:[{"value":"天"},{"value":"周"}]});
	var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'salesPrice'});
	$(salesPriceEditor.target).attr({"disabled":true});
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	$(itemnameEditor.target).combo({disabled:true});
	var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'orgnameExec'});
	$(orgnameExecEditor.target).combo({disabled:true});
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	$(itemnameEditor.target).combo({disabled:true});
	var unitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'unitName'});
	$(unitNameEditor.target).attr({"disabled":true});
}
//更新一个处方
function updateOrderAction(ordid,ordTypeid,note,timesQuantity){
	if(ordTypeid=='00'||ordTypeid=='02'){
		$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('acceptChanges');
		$CommonUI.getTabs('#tabsOrder').tabs('select',0);
		var url=$WEB_ROOT_PATH+'/westernMedicine/listSubNew.ajax';
		postReq(url,'westernMedicineDiv',function(msg){
			if(msg["rekStatus"]!=2){
				$("#WMedordid").val(ordid);
	    		$('#deleteUuid').val("");
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('loadData',msg);
				timer = setInterval(function(){
					timeOutFun(msg);
				},100);
			}else{
				$CommonUI.alert("医嘱已结算,不能修改",'error');
			}
		},function(){},{},{"ordid":ordid,"rekStatus":"2"});
	}else if(ordTypeid=='01'){
		$('#chinaMedicineGrid').datagrid('acceptChanges');
		$CommonUI.getTabs('#tabsOrder').tabs('select',1);
		var url=$WEB_ROOT_PATH+'/chineseMedicine/listSub.ajax';
		postReq(url,'',function(msg){
			if(msg["rekStatus"]==-1){
				$CommonUI.alert("医嘱不存在,不能修改",'error');
			}else if(msg["rekStatus"]==2){
				$CommonUI.alert("医嘱已结算,不能修改",'error');
			}else{
				$("#cMedordid").val(ordid);
				$("input[name='tord.note']").val(note=="undefined"?"":note);
				$("#cMedTQ").combobox('setValue',timesQuantity);
				$('#chinaMedicineGrid').datagrid('loadData',msg);
				$('#cMedOrgnameExec').combobox('setValue',msg["rows"][0].orgnameExec);
				$('#cMedOrgidExec').val(msg["rows"][0].orgidExec);
				$('#cMedFrequency').combobox('setValue',msg["rows"][0].freqid);
				$('#cMedUsagename').combobox('setValue',msg["rows"][0].usagename);
				$('#cMedUsageid').val(msg["rows"][0].usageid);
				for(var i=0;i<msg["total"];i++){
					$('#chinaMedicineGrid').datagrid('selectRow',i);
					$('#chinaMedicineGrid').datagrid('beginEdit',i);
				}
				changeTotalPrice();
			}
		},function(){},{},{"ordid":ordid,"rekStatus":"2"});
	}else{
		$('#inspectionGrid').datagrid('acceptChanges');
		$CommonUI.getTabs('#tabsOrder').tabs('select',2);
		var url=$WEB_ROOT_PATH+'/inspection/listSub.ajax';
		postReq(url,'',function(msg){
			if(msg["rekStatus"] == 2){
				$CommonUI.alert("医嘱已结算,不能修改",'error');
			}else{
				$('#inspectionGrid').datagrid('loadData',msg);
				for(var i=0;i<msg["total"];i++){
					$('#inspectionGrid').datagrid('selectRow',i);
					$('#inspectionGrid').datagrid('beginEdit',i);
					//单价
					var amountTotalEditor = $('#inspectionGrid').datagrid('getEditor', {index:i,field:'amountTotal'});
					$(amountTotalEditor.target).attr({"disabled":true});
					//接收科室
					var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:i,field:'orgnameExec'});
					$(orgnameExecEditor.target).combo({disabled:true});
					//名称
					var amountTotalEditor = $('#inspectionGrid').datagrid('getEditor', {index:i,field:'ordName'});
					$(amountTotalEditor.target).combo({disabled:true});
				}
			}
		},function(){},{},{"ordid":ordid,"rekStatus":"2"});
	}
	return false;
};
//中草药医嘱执行科室选择
var cMedOrgnameExecOnSelect = function(record){
	$('#cMedOrgnameExec').val(record.orgnameExec);
	$('#cMedOrgidExec').val(record.orgidExec);
}; 
//中草药医嘱用法选择
var cMedUsagenameOnSelect = function(record){
	$('#cMedUsageid').val(record.value);
};
var freqnameOnSelect=function(record){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	if(selectedRow==null||selectedRow==undefined){
		return;
	}
	var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
    //频次
    var freqNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqName'});
	$(freqNameEditor.target).combobox('setValue',record.freqName);
	//频次Id
	var freqidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqid'});
	$(freqidEditor.target).val(record.freqid);
	//频次数
	var freqDegEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDeg'});
	$(freqDegEditor.target).val(record.freqDeg);
	//频次单位
	var freqDayEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDay'});
	$(freqDayEditor.target).val(record.freqUnit);
	//间隔天数
	var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
	$(intervalDaysEditor.target).val(record.intervalDays);
	
	//单次计量单位
	var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'basicUnit'});
	var basicUnit =0;
	if(basicUnitEditor!=null&&basicUnitEditor!=undefined){
		basicUnit = $(basicUnitEditor.target).combobox('getValue');
	}
	//单次剂量
	var perQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'perQuantity'});
	var perQuantity=0 ;
	if(perQuantityEditor!=null&&perQuantityEditor!=undefined){
		perQuantity = $(perQuantityEditor.target).numberbox('getValue');
	}
	//疗程
	var freqquantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqquantity'});
	var freqquantity=0;
	if(freqquantityEditor!=null&&freqquantityEditor!=undefined){
		freqquantity = $(freqquantityEditor.target).numberbox('getValue');
	}
	//疗程单位
	var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'frequnit'});
	var frequnit=0;
	if(frequnitEditor!=null&&frequnitEditor!=undefined){
		frequnit = $(frequnitEditor.target).combobox('getValue');
	}
	//频次数
	var intervalDays=1;
	var freqDegEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDeg'});
	var freqDeg=0;
	if(freqDegEditor!=null&&freqDegEditor!=undefined){
		freqDeg = $(freqDegEditor.target).val();
		var freqDayEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDay'});
		var unit = $(freqDayEditor.target).val();
		if(unit=="T"){
			freqDeg=0;
		}else if(unit=="时"){
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
			intervalDays=24/intervalDays;
			freqDeg = freqDeg*intervalDays;  
			intervalDays=1;
		}else if(unit=="周"){
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
			intervalDays=intervalDays*7;
		}else{
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
		}
	}
	
	//剂量系数
	var medfactorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medfactor'});
	var medfactor=0;
	if(medfactorEditor!=null&&medfactorEditor!=undefined){
		medfactor =$(medfactorEditor.target).val();
	}
	//包装单位与基本点位系数
	var factorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'factor'});
	var factor=0;
	if(factorEditor!=null&&factorEditor!=undefined){
		factor =$(factorEditor.target).val();
	}
	
	//获取基本单位
	var inputunitSignEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'inputunitSign'});
	var inputunitSign=0;
	if(inputunitSignEditor!=null&&inputunitSignEditor!=undefined){
		inputunitSign =$(inputunitSignEditor.target).val();
	}
	//总数量
	var unitQuantity=0;
	if(inputunitSign==basicUnit){
		if(frequnit=="周"){
			frequnit=7;
		}else{
			frequnit=1;
		}
		unitQuantity = Math.ceil(Math.ceil(freqquantity*frequnit/(intervalDays))* perQuantity * freqDeg /factor);
	}else{
		if(frequnit=="周"){
			frequnit=7;
		}else{
			frequnit=1;
		}
		unitQuantity = Math.ceil(Math.ceil(freqquantity*frequnit/(intervalDays))* (perQuantity / medfactor) * freqDeg /factor);
	}
	var unitQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitQuantity'});
	$(unitQuantityEditor.target).val(unitQuantity);
	//单价
	var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
	var salesPrice = $(salesPriceEditor.target).val();
	//金额
	var totalPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'totalPrice'});
	$(totalPriceEditor.target).val(unitQuantity*salesPrice);
	$(totalPriceEditor.target).attr({"disabled":true});
	totalPriceOnChange();
};
var usagenameOnSelect = function(record){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	if(selectedRow==null||selectedRow==undefined){
		return;
	}
    var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
    //用法名称
    var usagenameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usagename'});
	$(usagenameEditor.target).combobox('setValue',record.description);
    //用法ID
    var usageidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usageid'});
	$(usageidEditor.target).val(record.value);
};
var frequnitOnChange = function(newValue, oldValue){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	if(selectedRow==null||selectedRow==undefined){
		return;
	}
	var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
	
	//单次计量单位
	var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'basicUnit'});
	var basicUnit =0;
	if(basicUnitEditor!=null&&basicUnitEditor!=undefined){
		basicUnit = $(basicUnitEditor.target).combobox('getValue');
	}
	//单次剂量
	var perQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'perQuantity'});
	var perQuantity=0 ;
	if(perQuantityEditor!=null&&perQuantityEditor!=undefined){
		perQuantity = $(perQuantityEditor.target).numberbox('getValue');
	}
	//疗程
	var freqquantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqquantity'});
	var freqquantity=0;
	if(freqquantityEditor!=null&&freqquantityEditor!=undefined){
		freqquantity = $(freqquantityEditor.target).numberbox('getValue');
	}
	//疗程单位
	var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'frequnit'});
	var frequnit=0;
	if(frequnitEditor!=null&&frequnitEditor!=undefined){
		frequnit = $(frequnitEditor.target).combobox('getValue');
	}
	//频次数
	var intervalDays=1;
	var freqDegEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDeg'});
	var freqDeg=0;
	if(freqDegEditor!=null&&freqDegEditor!=undefined){
		freqDeg = $(freqDegEditor.target).val();
		var freqDayEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDay'});
		var unit = $(freqDayEditor.target).val();
		if(unit=="T"){
			freqDeg=0;
		}else if(unit=="时"){
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
			intervalDays=24/intervalDays;
			freqDeg = freqDeg*intervalDays;  
			intervalDays=1;
		}else if(unit=="周"){
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
			intervalDays=intervalDays*7;
		}else{
			var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
			if(intervalDaysEditor!=null&&intervalDaysEditor!=undefined){
				intervalDays =$(intervalDaysEditor.target).val();
			}
		}
	}
	//剂量系数
	var medfactorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medfactor'});
	var medfactor=0;
	if(medfactorEditor!=null&&medfactorEditor!=undefined){
		medfactor =$(medfactorEditor.target).val();
	}
	//包装单位与基本点位系数
	var factorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'factor'});
	var factor=0;
	if(factorEditor!=null&&factorEditor!=undefined){
		factor =$(factorEditor.target).val();
	}
	
	//获取基本单位
	var inputunitSignEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'inputunitSign'});
	var inputunitSign=0;
	if(inputunitSignEditor!=null&&inputunitSignEditor!=undefined){
		inputunitSign =$(inputunitSignEditor.target).val();
	}
	//总数量
	var unitQuantity=0;
	if(inputunitSign==basicUnit){
		if(frequnit=="周"){
			frequnit=7;
		}else{
			frequnit=1;
		}
		unitQuantity = Math.ceil(Math.ceil(freqquantity*frequnit/(intervalDays))* perQuantity * freqDeg /factor);
	}else{
		if(frequnit=="周"){
			frequnit=7;
		}else{
			frequnit=1;
		}
		unitQuantity = Math.ceil(Math.ceil(freqquantity*frequnit/(intervalDays))* (perQuantity / medfactor) * freqDeg /factor);
	}
	var unitQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitQuantity'});
	$(unitQuantityEditor.target).val(unitQuantity);
	//单价
	var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
	var salesPrice = $(salesPriceEditor.target).val();
	//金额
	var totalPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'totalPrice'});
	$(totalPriceEditor.target).val(unitQuantity*salesPrice);
	$(totalPriceEditor.target).attr({"disabled":true});
	totalPriceOnChange();
};
var comboGridOnPressEnter=function(){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
	if(selectedRow==null||selectedRow==undefined){
		return;
	}
	var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemname'});
	var comboSelectedRow = $(itemnameEditor.target).combogrid('grid').datagrid("getSelected");
	var comboSelectedIndex =  $(itemnameEditor.target).combogrid('grid').datagrid("getRowIndex", comboSelectedRow);
	comboGridClick(comboSelectedIndex,comboSelectedRow);
};
var totalPriceOnChange = function(newValue, oldValue){
	var gridDate = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getRows');
	var index = gridDate.length;
	var totalPrice=0;
	for(var i=0;i<index;i++){
		var totalPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'totalPrice'});
		if(totalPriceEditor!=null){
			if(!isNaN($(totalPriceEditor.target).val())){
				totalPrice = Number(totalPrice) + Number($($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'totalPrice'}).target).val());
			}
		}else{
			totalPrice = Number(totalPrice) +Number(gridDate[i].totalPrice);
		}
	}
	$('#totalPrice').val(totalPrice.toFixed(2));
};
var unitQuantityOnChange = function(newValue, oldValue){
	var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getSelected");
    var selectedIndex = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
    //获取当前总数量
	var unitQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitQuantity'});
	if(unitQuantityEditor==null||unitQuantityEditor==""||unitQuantityEditor==undefined){
		return;
	}
	var unitQuantity = $(unitQuantityEditor.target).val();
	//单价
	var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
	var salesPrice = $(salesPriceEditor.target).val();
	//金额
	var totalPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'totalPrice'});
	$(totalPriceEditor.target).val(unitQuantity*salesPrice);
	totalPriceOnChange();
	
}; 
tabsOrderOnSelect = function(title,index){
	if(title=="中草药医嘱"){
		//用法
		var usagenameData=$("#cMedUsagename").combobox("getData");
		$("#cMedUsageid").val(usagenameData[0].value);
		$("#cMedUsagename").combobox("setValue",usagenameData[0].text);
		//接收科室
		var cMedOrgnameExecData=$("#cMedOrgnameExec").combobox("getData");
		$("#cMedOrgidExec").val(cMedOrgnameExecData[0].orgidExec);
		$("#cMedOrgnameExec").combobox("setValue",cMedOrgnameExecData[0].orgnameExec);
	}
};
cMedTQOnSelect = function(record){
	changeTotalPrice();
};
function timeOutTemplate(json){
	var i=0;
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	while(itemnameEditor!=null){
		i++;
		itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:i,field:'itemname'});
	}
	if(i>=$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRows").length){
		clearInterval(timer);
		return;
	}
	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('selectRow',i);
	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('beginEdit',i);
	saveOrdFromCombogrid(i,json.rows[i],json.rows[i].orgnameJson,1);
}
function respo(data){
	if(data.resultString!="1"){
		var strs = data.resultString.split("^");
		$CommonUI.alert(strs[1]);
		$("#tabsOrderDiv").removeClass("body-mask");
		$("#tabsOrder").css("visibility","visible");
		return;
	}
	if(data.type=="00"){
		$CommonUI.getTabs('#tabsOrder').tabs('select',0);
		for(var i=0;i<data.dtTemplateVo.length;i++){
			var j = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getRows").length;
	    	var flag=false;
			for(var k=0;k<j;k++){
				if(k==j){
					alert(j);
					continue;
				}
				if($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:k,field:'itemid'})!=null){
					if($($CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:k,field:'itemid'}).target).val()==data.dtTemplateVo[i].tOrdItem.itemid){
						flag=true;
					}
				}else{
					var selectedRow = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid("getData");
					var itemid = selectedRow.rows[k].itemid;
					if(itemid==data.dtTemplateVo[i].tOrdItem.itemid){
						flag=true;
					}
				}
			}
			
			if(flag==true){
				$("#tabsOrderDiv").removeClass("body-mask");
				$("#tabsOrder").css("visibility","visible");
				$CommonUI.alert("已存在相同医嘱,请手动输入", 'warning');
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('deleteRow',j);
				return false;
			}else{
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('appendRow',{
		    		row:{
		    			rowno:j+1,
		    			westernMedicineType:"临时"
		    		}
		    	});
				$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('selectRow',j);
		    	$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('beginEdit',j);
				sendTemplateToGrid(data.dtTemplateVo[i].tOrdItem,data.dtTemplateVo[i].orglist,j);
			}
		}
	}else if(data.type=="01"){
		$CommonUI.getTabs('#tabsOrder').tabs('select',1);
		$("#cMedTQ").combobox('setValue',data.resultObj.rows[0].timesQuantity);
		$('#cMedFrequency').combobox('setValue',data.resultObj.rows[0].freqid);
		$('#cMedUsagename').combobox('setValue',data.resultObj.rows[0].usagename);
		$('#cMedUsageid').val(data.resultObj.rows[0].usageid);
		//$('#chinaMedicineGrid').datagrid('loadData',data.resultObj);
		for(var i=0;i<data.resultObj.total;i++){
			var j = $('#chinaMedicineGrid').datagrid("getRows").length;
			$('#chinaMedicineGrid').datagrid('appendRow',{});
			$('#chinaMedicineGrid').datagrid('selectRow',j);
			$('#chinaMedicineGrid').datagrid('beginEdit',j);
			sendTemplateToCm(data.resultObj.rows[i],j);
		}
		changeTotalPrice();
	}else{
		$CommonUI.getTabs('#tabsOrder').tabs('select',2);
		var j = $('#inspectionGrid').datagrid("getRows").length;
		
    	var flag=false;
		for(var k=0;k<j;k++){
			if(k==j){
				continue;
			}
			if($('#inspectionGrid').datagrid('getEditor', {index:k,field:'orddicid'})!=null){
				if($($('#inspectionGrid').datagrid('getEditor', {index:k,field:'orddicid'}).target).val()==data.dtTemplateVo[0].knOrd.orddicid){
					flag=true;
				}
			}else{
				var selectedRow = $('#inspectionGrid').datagrid("getData");
				var itemid = selectedRow.rows[k].orddicid;
				if(itemid==data.dtTemplateVo[0].knOrd.orddicid){
					flag=true;
				}
			}
		}
		if(flag==true){
			$("#tabsOrderDiv").removeClass("body-mask");
			$("#tabsOrder").css("visibility","visible");
			$CommonUI.alert("已存在相同医嘱,请手动输入", 'warning');
			$CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('deleteRow',j);
			return false;
		}else{
			$('#inspectionGrid').datagrid('appendRow',{
	    		row:{
	    			report:'<a herf="#">查看</a>'
	    		}
	    	});
	    	$('#inspectionGrid').datagrid('selectRow',j);
	    	$('#inspectionGrid').datagrid('beginEdit',j);
			sendTemplateToInspection(data.dtTemplateVo[0].knOrd,data.dtTemplateVo[0].orglist,j);
		}
	}
	$("#tabsOrderDiv").removeClass("body-mask");
	$("#tabsOrder").css("visibility","visible");
}
//加载模板数据到grid
function sendTemplateToGrid(rowData,msg,index){
    var selectedIndex = index;
	var basicUnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'basicUnit'});
	$(basicUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.basicUnit,"selected":true },{"value":rowData.medunit}]});
	
	//疗程单位
	var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'frequnit'});
	$(frequnitEditor.target).combobox('loadData', {total:2, rows:[{"value":"天","selected":true},{"value":"周"}]});
	
	var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox('loadData',msg);
	//单价
	var salesPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
	$(salesPriceEditor.target).val(rowData.salesPrice);
	$(salesPriceEditor.target).attr({"disabled":true});
	//用法
	var usageidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usageid'});
	$(usageidEditor.target).val(rowData.itemUsageid);
	$(usageidEditor.target).attr({"disabled":true});
	//剂量单位名称
	var medunitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medunitName'});
	$(medunitNameEditor.target).val(rowData.medunit);
	//名称
	var itemnameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemname'});
	$(itemnameEditor.target).combogrid('setValue', rowData.itemname);
	//医嘱编码
	var itemidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemid'});
	$(itemidEditor.target).val(rowData.itemid);
	//管制分类
	var controlCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'controlCateid'});
	$(controlCateidEditor.target).val(rowData.controlCateid);
	//包装单位名称
	var unitNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitName'});
	$(unitNameEditor.target).val(rowData.dispensUnit);
	$(unitNameEditor.target).attr({"disabled":true});
	//规格
	var itemspecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'itemspec'});
	$(itemspecEditor.target).val(rowData.itemSpec);
	//包装单位与基本单位换算
	var factorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'factor'});
	$(factorEditor.target).val(rowData.dispensFacotr);
	//剂量系数
	var medfactorEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'medfactor'});
	$(medfactorEditor.target).val(rowData.medfactor);
	//基本单位
	$(basicUnitEditor.target).combobox('setValue', rowData.basicUnit);
	//基本单位名称
	var inputunitSignEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'inputunitSign'});
	$(inputunitSignEditor.target).val(rowData.basicUnit);
	//医嘱类别子类
	var ordCateidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'ordCateid'});
	$(ordCateidEditor.target).val(rowData.ordCateid);
	//是否药品
	var ismeditemEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'ismeditem'});
	$(ismeditemEditor.target).val(rowData.ismeditem);
	//接收科室json
	var orgnameJsonEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameJson'});
	$(orgnameJsonEditor.target).val($.toJSON(msg));
	//接收科室id
	var orgidExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgidExec'});
	$(orgidExecEditor.target).val(msg[0].orgidExec);
	//接收科室
	var orgnameExecEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox("setValue",msg[0].orgnameExec);
	$(this).delay(1000);
	 //频次
    var freqNameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqName'});
	$(freqNameEditor.target).combobox('setValue',rowData.freqName);
	//频次Id
	var freqidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqid'});
	$(freqidEditor.target).val(rowData.freqid);
	//频次数
	var freqDegEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDeg'});
	$(freqDegEditor.target).val(rowData.freqDeg);
	//频次单位
	var freqDayEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqDay'});
	$(freqDayEditor.target).val(rowData.freqUnit);
	//间隔天数
	var intervalDaysEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'intervalDays'});
	$(intervalDaysEditor.target).val(rowData.intervalDays);
	
	//用法
	var usagenameEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usagename'});
	$(usagenameEditor.target).combobox('setValue',rowData.usagename);
	var usageidEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'usageid'});
	$(usageidEditor.target).val(rowData.usageid);
	
	//疗程
	var freqquantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'freqquantity'});
	$(freqquantityEditor.target).numberbox("setValue",rowData.freqquantity);
	var frequnitEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'frequnit'});
	$(frequnitEditor.target).combobox('setValue',rowData.frequnit);
	//单次剂量
	var perQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'perQuantity'});
	$(perQuantityEditor.target).numberbox('setValue',rowData.perQuantity);
	//总数量
	var unitQuantityEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'unitQuantity'});
	$(unitQuantityEditor.target).val(rowData.unitQuantity);
	//价格
	var totalPriceEditor = $CommonUI.getDataGrid('#doctorOrdersGrid1').datagrid('getEditor', {index:selectedIndex,field:'totalPrice'});
	$(totalPriceEditor.target).val(rowData.amountTotal);
	
}
function sendTemplateToCm(rowData,index){
	var chinaMedicine1Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine1'});
	$(chinaMedicine1Editor.target).combobox("setValue",rowData.chinaMedicine1);
	var chinaMedicine2Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine2'});
	$(chinaMedicine2Editor.target).numberbox("setValue",rowData.chinaMedicine2);
	var chinaMedicine3Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine3'});
	$(chinaMedicine3Editor.target).combobox("setValue",rowData.chinaMedicine3);
	var chinaMedicine4Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine4'});
	$(chinaMedicine4Editor.target).numberbox("setValue",rowData.chinaMedicine4);
	var chinaMedicine5Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine5'});
	$(chinaMedicine5Editor.target).combobox("setValue",rowData.chinaMedicine5);
	var chinaMedicine6Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine6'});
	$(chinaMedicine6Editor.target).numberbox("setValue",rowData.chinaMedicine6);
	var chinaMedicine7Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine7'});
	$(chinaMedicine7Editor.target).combobox("setValue",rowData.chinaMedicine7);
	var chinaMedicine8Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine8'});
	$(chinaMedicine8Editor.target).numberbox("setValue",rowData.chinaMedicine8);
	var chinaMedicine11Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine11'});
	$(chinaMedicine11Editor.target).val(rowData.chinaMedicine11);
	var chinaMedicine13Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine13'});
	$(chinaMedicine13Editor.target).val(rowData.chinaMedicine13);
	var chinaMedicine15Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine15'});
	$(chinaMedicine15Editor.target).val(rowData.chinaMedicine15);
	var chinaMedicine17Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine17'});
	$(chinaMedicine17Editor.target).val(rowData.chinaMedicine17);
	var chinaMedicine21Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine21'});
	$(chinaMedicine21Editor.target).val(rowData.chinaMedicine21);
	var chinaMedicine23Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine23'});
	$(chinaMedicine23Editor.target).val(rowData.chinaMedicine23);
	var chinaMedicine25Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine25'});
	$(chinaMedicine25Editor.target).val(rowData.chinaMedicine25);
	var chinaMedicine27Editor = $('#chinaMedicineGrid').datagrid('getEditor', {index:index,field:'chinaMedicine27'});
	$(chinaMedicine27Editor.target).val(rowData.chinaMedicine27);
}
function sendTemplateToInspection(rowData,orglist,index){
	//医嘱套编码
	var orddicidEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'orddicid'});
	$(orddicidEditor.target).val(rowData.orddicid);
	//医嘱类型编码
	var ordTypeidEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'ordTypeid'});
	$(ordTypeidEditor.target).val(rowData.ordTypeid);
	//医嘱类型编码
	var ordTypenameEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'ordTypename'});
	if(rowData.ordTypeid=="03"){
		$(ordTypenameEditor.target).combobox("setValue","检验");
	}else if(rowData.ordTypeid=="04"){
		$(ordTypenameEditor.target).combobox("setValue","检查");
	}else if(rowData.ordTypeid=="05"){
		$(ordTypenameEditor.target).combobox("setValue","治疗");
	}else if(rowData.ordTypeid=="06"){
		$(ordTypenameEditor.target).combobox("setValue","手术");
	}
	//名称
	var ordNameEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'ordName'});
	$(ordNameEditor.target).combogrid("setValue",rowData.orddicname);
	
	//单价
	var amountTotalEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'amountTotal'});
	$(amountTotalEditor.target).val(rowData.amountTotal);
	$(amountTotalEditor.target).attr({"disabled":true});
	
	var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox('loadData',orglist);
	//接收科室json
	var orgnameJsonEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'orgnameJson'});
	$(orgnameJsonEditor.target).val($.toJSON(orglist));
	//接收科室id
	var orgIdExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'orgidExec'});
	$(orgIdExecEditor.target).val(orglist[0].orgidExec);
	//接收科室
	var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:index,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox("setValue",orglist[0].orgnameExec);
}
function cmCtlocOnSelect(record){
	var selectedRow = $('#inspectionGrid').datagrid("getSelected");
    var selectedIndex = $('#inspectionGrid').datagrid("getRowIndex", selectedRow);
    //接收科室
	var orgnameExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgnameExec'});
	$(orgnameExecEditor.target).combobox('setValue', record.orgnameExec);
	//接收科室编码
	var orgidExecEditor = $('#inspectionGrid').datagrid('getEditor', {index:selectedIndex,field:'orgidExec'});
	$(orgidExecEditor.target).val(record.orgidExec);
}
function prescriptionShow(ordid,ordTypeid){
	parent.prescriptionShow(ordid,ordTypeid);
}
//医嘱tab切换tab页
function changeOrdTabs(index){
	$CommonUI.getTabs('#tabsOrder').tabs('select',index);
}
//检验检查
var inspectionGridOnAfterEdit=function(rowIndex, rowData, changes){
	if(rowData.ordNameBackup!=""&&rowData.ordNameBackup!=undefined){
		$CommonUI.getDataGrid('#inspectionGrid').datagrid('updateRow',{
			index: rowIndex,
			row: {
				ordName: rowData.ordNameBackup
			}
		});
	}
};
function addMyClass(myClass){
	$("#tabsOrder").css("visibility","hidden");
	$("#tabsOrderDiv").addClass(myClass);
	$("#tabsOrderDiv").css("visibility","visible");
}
