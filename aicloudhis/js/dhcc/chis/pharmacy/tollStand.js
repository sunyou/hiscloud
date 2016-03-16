$(function(){
	var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : false};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	//{title : "uuid",field : "uuid",hidden:true},
	     	    	//{title : "拼音简码",field : "itemChemistryName",hidden:true},
	     	    	//{title : "五笔简码",field : "itemCommonName",hidden:true},
	     	    	{title : "助记码",field : "inputstr",hidden:true},
	     	    	//{title : "药品用法",field : "itemUsageid",hidden:true},
	     	    	{title : "收费状态",field : "activeflag",hidden:true},
	     	    	//{title : "生产厂家",field : "entIdProducer",hidden:true},	     	    		     	    	    	    	
	     	    	
	     			{title : "收费项目名称",field : "itemname",width : 240,align : 'center'},
	     			//{title : "医嘱分类",field : "ordCateid",width : 100,align : 'center'},
	     			//{title : "剂型",field : "itemDoseid",width : 89,align : 'center'},
	     			{title : "发票分类",field : "chargeCatename",width: 100,align : 'center'},
	     			{title : "零售单位",field : "dispensUnit",width : 100,align : 'center'},
	     			{title : "零售系数",field : "dispensFacotr",width : 100,align : 'center'},
	     			{title : "零售价",field : "salesPrice",width : 100,align : 'center'},
	     			{title : "基本单位",field : "basicUnit",width : 120,align : 'center'},
	     			{title : "项目规格",field : "itemSpec",width : 150,align : 'center'},	     			
	     			{title : "批发价",field : "wholesalesPrice",width : 118,align : 'center'},
	     			{title : "创建日期",field : "createtime",width : 110,align : 'center',
	     				 formatter:function(value,row,index){
		    		    		if(row.createtime!=""&&row.createtime!=null){
		 							var createtime = row.createtime.substr(0,10);
		 							return createtime;
		 							
		 						}
		    		    		
		    		    	}
	     			}
	     			] ];
	var queryParams = {page : 1,rows : 15};
	var url = $WEB_ROOT_PATH+"/purchaseManage/drugCommonCtrl.ajax?ismeditem=2";
	//var url = $WEB_ROOT_PATH + '/patientManage/patientManageCtrl.htm?BLHMI=list';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	
	/**
	 * 发票类型-模糊查询
	 
	$("#chargeClassification").combogrid({
		panelWidth: 125,
        panelHeight: 160,
        hasDownArrow:false,
        pagination: false,
        idField: 'chargeId',
		mode: 'remote',
		textField:'chargeName',
		method:'get',
		//queryParams : { contactsId : contactsFriendsId },
		url: $WEB_ROOT_PATH+'/tollStand/tollStandCtrl.htm?BLHMI=chargeCategoryList',
		columns: [[
					{field:'chargeId',title:'ID',hidden:true},
					{field:'chargeName',title:'发票类型',width:120,align:'center'}//收费类别
				]]
	});* */
	$('#chargeClassification').combobox('setValue',"");
	$('#chargeClassification').combobox('setText',"全部");
});

/*****
 * 查询* 
 */
function findData(){
	/***
	var itemname = null;
	var drugName=$CommonUI.getComboGrid('#patientName').combogrid('grid');
	var name=drugName.datagrid('getSelected');
		if(name != null){
			itemname=name.itemName;
		}
	***/
	var chargeName = $("#chargeName").val();
	var chargeCateid = $("#chargeClassification").combobox('getValue');
	/*var chargeGrid=$CommonUI.getComboGrid('#chargeClassification').combogrid('grid');
	var chargeSelect=chargeGrid.datagrid('getSelected');
		if(chargeSelect != null){
			chargeCateid=chargeSelect.chargeId;
		}*/
	var radio = document.getElementsByName("radio");
	
	if(radio[0].checked || radio[1].checked){
		$CommonUI.getDataGrid('#dg').datagrid({
	    	url:$WEB_ROOT_PATH + "/purchaseManage/drugCommonCtrl.ajax?ismeditem=2",
	    	queryParams:{
				"itemname":chargeName,
				"chargeCateid":chargeCateid,
				"status":radio[0].checked?radio[0].value:radio[1].value
	    	}
	    });	
		$CommonUI.getDataGrid('#dg').datagrid('load', {  
			"pageSize": 10,  
			"pageNo": 1,
			"itemname":chargeName,
			"chargeCateid":chargeCateid,
			"status":radio[0].checked?radio[0].value:radio[1].value
		});    
	}else{
		$CommonUI.getDataGrid('#dg').datagrid({
	    	url:$WEB_ROOT_PATH + "/purchaseManage/drugCommonCtrl.ajax?ismeditem=2",
	    	queryParams:{
				"itemname":chargeName,
				"chargeCateid":chargeCateid,
				"status":""
	    	}
	    });	
		$CommonUI.getDataGrid('#dg').datagrid('load', {  
			"pageSize": 10,  
			"pageNo": 1,
			"itemname":chargeName,
			"chargeCateid":chargeCateid,
			"status":""
		});    
	}    
}
/**
 * 新增
 * **/
function createItem(){
	$CommonUI.getForm('#createForm').form('clear');
	//document.getElementById("update").style.display="none";
	//document.getElementById("save").style.display="block";
	//document.getElementById("close").style.display="block";
	$("#update").hide();
	$("#save").show();
	$("#close").show();
	
	$('#dlg').dialog('open').dialog('setTitle', '材料基本信息');
	$("#dlg").dialog('open');
}
 /***
  *保存 
  * ***/
function saveItem(){
	//$('#dlg').dialog('close');
	//$CommonUI.alert("保存成功！");
	var url=$WEB_ROOT_PATH + '/infoManage/medStandCtrl.ajax?BLHMI=saveItemMedStand';
	/**
	var ordCateid = $("#ordCateid").combobox('getValue');
	var entId = $("#entname").combobox('getValue');
	var radio = document.getElementsByName("drugRadio");
	var chargeCateid = $("#chargeCateid").combobox('getValue');
	var activeflag = false;
	if(radio[0].checked){
		activeflag=true;
	}***/
	var itemName = $('#itemName').val(); 
	if(itemName == "" || itemName == null){
		$CommonUI.alert("药品名称不可为空!");	
		return;
	}
	var chargeCateid = $('#chargeCateid').combobox('getValue');
	if(chargeCateid == "" || chargeCateid == null){
		$CommonUI.alert("发票类型不可为空!");	
		return;
	}
	var pharmacycate = $('#pharmacycate').combobox('getValue');
	if(pharmacycate == "" || pharmacycate == null){
		$CommonUI.alert("药理类型不可为空!");	
		return;
	}
	var ordCateid = $('#ordCateid').combobox('getValue');
	if(ordCateid == "" || ordCateid == null){
		$CommonUI.alert("医嘱类型不可为空!");	
		return;
	}
	var radio = document.getElementsByName("drugRadio");
	if(!radio[0].checked && !radio[1].checked){
		$CommonUI.alert("是否启用不可为空!");	
		return;
	}
	var activeflag = 0;
	if(radio[0].checked){
		activeflag = 1;
	}
	var wholesalesPrice = parseFloat($("#wholesalesPrice").val());
	var salesPrice = parseFloat($("#salesPrice").val());
	var dispensFacotr = parseFloat($("#dispensFacotr").val());
	//var activeflagSelect = document.getElementById("activeflag");
	//alert(activeflagSelect.value);
	//var index=activeflagSelect.selectedIndex ;
	//var activeflag = activeflagSelect.options[index].value;
	//var activeflag = false;
	//if(activeflagSelect == "1"){
	//	activeflag = true;
	//}
	 postReq(url, '#createForm',function(data){
		 if(data.result=='1'){
			 $CommonUI.alert("添加收费信息成功!");	
				$("#dg").datagrid('reload');
				$('#dlg').dialog('close');
		 }else{
			 $CommonUI.alert("保存失败");
		 }
		
	 },function(){
		 $CommonUI.alert("保存失败");
		 },{"skipHidden":false},
		 {"activeflag" : activeflag,
			  "ismeditem":2,	 
			  "wholesalesPrice" : wholesalesPrice,
			  "salesPrice" : salesPrice,
			  "dispensFacotr" : dispensFacotr
			 }
		 );	
	//var url2=$WEB_ROOT_PATH + '/medStand/medStandCtrl.htm?BLHMI=saveMeStDefinition';
	/****postReq(url, 'createForm',succAdd, err, {skipHidden : false},
			{"dto.itemMedStand.ordCateid" : ordCateid,
		     "dto.itemMedStand.entidProducer" : entId,
		     "dto.itemMedStand.chargeCateid" : chargeCateid,
		     "dto.itemMedStand.activeflag" : activeflag,
		     "dto.meStDefinition.isstopflag": activeflag});
		     ****/
	//postReq(url2, 'createForm',succAdd, err, {skipHidden : false});
	 //$("#dg").datagrid('reload');
	 //('#dlg').dialog('close');
	 //window.location.reload();
	 
}

function err(){
	$CommonUI.alert("失败");
}
function succAdd(data) {
	$CommonUI.alert("添加收费信息成功!");	
	$("#dg").datagrid('reload');
	$('#dlg').dialog('close');
}
function succUpdate(data) {
	$CommonUI.alert("修改收费信息成功!");	
	$("#dg").datagrid('reload');
	$('#dlg').dialog('close');
}
function myclose(){
	 $('#dlg').dialog('close');
	 $("#dg").datagrid('reload');
}
function clearItem(){
	$CommonUI.getForm('#createForm').form('clear');
}
function updateItem(){
	var selectedRow = $("#dg").datagrid('getSelected');
	$("#update").show();
	$("#save").hide();
	$("#close").show();
	if (selectedRow!=null && selectedRow!="") {
	    $CommonUI.getForm('#createForm').form('clear');
	    $('#dlg').dialog('open').dialog('setTitle', '收费基本信息');
	    $("#dlg").dialog('open');
	    var itemid = selectedRow.itemid;
	    $.getJSON($WEB_ROOT_PATH+ "/infoManage/medStandList.ajax?itemid="
				+ itemid, function(data) {
	    	 if(data != null){
	    		   $('#itemid').val(data.rows[0].itemid);
	    		   $('#ordItemid').val(data.rows[0].ordItemid);
	    		   $('#itemName').val(data.rows[0].itemname); 
		    	   $('#inputstr').val(data.rows[0].inputstr);
		    	   $('#chargeCateid').combobox('setValue',data.rows[0].chargeCateid);
		    	   
		    	   $('#salesPrice').val(data.rows[0].salesPrice);
		    	   $('#dispensUnit').combobox('setValue',data.rows[0].dispensUnit);
		    	   $('#dispensFacotr').val(data.rows[0].dispensFacotr);
		    	   
		    	   $('#basicUnit').combobox('setValue',data.rows[0].basicUnit); 
		    	   $('#itemspec').val(data.rows[0].itemSpec);
		    	   $('#wholesalesPrice').val(data.rows[0].wholesalesPrice);
		    	   
		    	   $('#orderPrice').val(data.rows[0].orderPrice);
		    	   $('#ordCateid').combobox('setValue',data.rows[0].ordCateid);
		    	   $('#pharmacycate').combobox('setValue',data.rows[0].pharmacyCateTwosubid);
		    	   
		    	   if(data.rows[0].createtime==""||data.rows[0].createtime=='null'){
	    				
	    			 }else{
	    				  $('#createTime').datebox('setValue',data.rows[0].createtime.substr(0,10));	
	    			 }
		    	     if(data.rows[0].updatetime==""||data.rows[0].updatetime=='null'){
		    				
		    		 }else{
		    			 $('#updateTime').datebox('setValue',data.rows[0].updatetime.substr(0,10));
		    		 }
		    	  // $('#activeflag').combobox('setValue',data.rows[0].activeflag);
		    	   if(data.rows[0].activeflag == true){
		    	    	 document.getElementById("radio1").checked = "checked";
		    	   }else{
		    	    	 document.getElementById("radio2").checked = "checked"; 
		    	   }
	    	 }
	    });
     }else {
 		$CommonUI.alert("请选择一行记录");
 	}
}

function update(){ 
	var url=$WEB_ROOT_PATH + '/infoManage/medStandCtrl.ajax?BLHMI=saveItemMedStand';
	var itemName = $('#itemName').val(); 
	if(itemName == "" || itemName == null){
		$CommonUI.alert("收费名称不可为空!");	
		return;
	}
	var chargeCateid = $('#chargeCateid').combobox('getValue');
	if(chargeCateid == "" || chargeCateid == null){
		$CommonUI.alert("发票类型不可为空!");	
		return;
	}
	var pharmacycate = $('#pharmacycate').combobox('getValue');
	if(pharmacycate == "" || pharmacycate == null){
		$CommonUI.alert("药理类型不可为空!");	
		return;
	}
	var ordCateid = $('#ordCateid').combobox('getValue');
	if(ordCateid == "" || ordCateid == null){
		$CommonUI.alert("医嘱类型不可为空!");	
		return;
	}
	/***
	if(chargeCateid == "西药费"){
		chargeCateid="01";
	}else if(chargeCateid == "草药费"){
		chargeCateid="02";
	}else if(chargeCateid == "其他费"){
		chargeCateid="03";
	}***/
	//alert(chargeCateid);
//	$.getJSON($WEB_ROOT_PATH+ "/tollStand/tollStandCtrl.htm?BLHMI=chargeCategoryList&dto.chargeName="
//			+ chargeCateid, function(data) {
//		 if(data != null && data.rows[0] != null){
//			 //alert(data.rows[0].chargeId);
//			 chargeCateid = data.rows[0].chargeId;
//		 }
//	});
	//alert(chargeCateid);
	var itemid = $("#itemid").val();
	var radio = document.getElementsByName("drugRadio");
	var activeflag = 0;
	if(radio[0].checked){
		activeflag = 1;
	}
	var wholesalesPrice = parseFloat($("#wholesalesPrice").val());
	var salesPrice = parseFloat($("#salesPrice").val());
	var dispensFacotr = parseFloat($("#dispensFacotr").val());
	window.setTimeout(function(){
		postReq(url, '#createForm',function(data){
			 if(data.result=='1'){
				 $CommonUI.alert("修改收费信息成功!");	
					$("#dg").datagrid('reload');
					$('#dlg').dialog('close');
			 }else{
				 $CommonUI.alert("修改失败");
			 }
			
		 },function(){
			 $CommonUI.alert("修改失败");
			 },{"skipHidden":false},
			 {"activeflag" : activeflag,
				 "wholesalesPrice" : wholesalesPrice,
				  "salesPrice" : salesPrice,
				  "dispensFacotr" : dispensFacotr,
				 "itemid" : itemid});	
//		postReq(url, 'createForm',succUpdate, err, {skipHidden : false},
//				{"activeflag" : activeflag,
//			     //"dto.itemMatStand.ordCateid" : ordCateid,
//			     //"dto.itemMatStand.itemDoseid" : itemDoseid,
//			     //"dto.itemTollStand.chargeCateid" : chargeCateid,
//			     "itemid" : itemid
//			     });
	},100);
	
}
