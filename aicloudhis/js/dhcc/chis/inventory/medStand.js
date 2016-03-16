$(function(){
	var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : false};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	{title : "uuid",field : "uuid",hidden:true},
	     	    	{title : "拼音简码",field : "itemChemistryName",hidden:true},
	     	    	{title : "五笔简码",field : "itemCommonName",hidden:true},
	     	    	{title : "助记码",field : "inputstr",hidden:true},
	     	    	{title : "药品用法",field : "itemUsageid",hidden:true},
	     	    	{title : "药品状态",field : "activeflag",hidden:true},
	     	    	{title : "生产厂家",field : "entidProducer",hidden:true},	     	    		     	    	    	    	
	     	    	
	     			{title : "药品名称",field : "itemname",width : 150,align : 'center'},
	     			{title : "医嘱分类",field : "ordCatename",width : 100,align : 'center'},
	     			{title : "药品剂型",field : "itemDoseid",width : 99,align : 'center'},
	     			{title : "发票分类",field : "chargeCatename",width: 80,align : 'center'},
	     			{title : "药理类别",field : "pharmacyCatename",width: 140,align : 'center'},
	     			{title : "零售单位",field : "dispensUnit",width : 80,align : 'center'},
	     			{title : "零售系数",field : "dispensFacotr",width : 80,align : 'center'},
	     			{title : "零售价",field : "salesPrice",width : 80,align : 'center'},
	     			//{title : "剂量单位",field : "medUnit",width : 80,align : 'center'},
	     			{title : "药品规格",field : "itemSpec",width : 150,align : 'center'},	     			
	     			{title : "入库单位",field : "warehousUnit",width : 89,align : 'center'},
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
	var url = $WEB_ROOT_PATH+"/purchaseManage/drugCommonCtrl.ajax?ismeditem=1";
	//var url = $WEB_ROOT_PATH + '/patientManage/patientManageCtrl.htm?BLHMI=list';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	
	$CommonUI.getEdataGrid('#inportdg').datagrid({
		method:'get',
	    url:'',
	    fitColumns: true,
	    pagination: false,
	    height : 200,
		singleSelect: true,
		/*rownumbers: true,*/
	    columns:[[
	     	    	{field : "ck1",checkbox : true,width : 50,align : 'center'},
	     			{title : "药品名称",field : "itemName0",width : 110,align : 'center'},
	     			{title : "药品分类",field : "itemName1",width : 70,align : 'center'},
	     			{title : "发票分类",field : "itemName2",width:70,align : 'center'},
	     			{title : "大单位",field : "itemName3",width : 50,align : 'center'},
	     			{title : "换算量",field : "itemName4",width : 50,align : 'center'},
	     			{title : "小单位",field : "itemName5",width : 50,align : 'center'},
	     			{title : "剂型",field : "itemName6",width : 60,align : 'center'},
	     			{title : "剂型单位",field : "itemName7",width : 70,align : 'center'},
	     			{title : "药品规格",field : "itemName8",width : 100,align : 'center'},
	     			{title : "用法",field : "itemName9",width : 60,align : 'center'}
	     		   ]],
	     			queryParams:{}  
	    });
	/**
	 * 药品名称-模糊查询
	 
	$("#patientName").combogrid({
		panelWidth: 320,
        panelHeight: 338,
        hasDownArrow:false,
        pagination: true,
        idField: 'itemid',
		pagination: true,
		mode: 'remote',
		textField:'itemName',
		method:'get',
		//queryParams : { contactsId : contactsFriendsId },
		url: $WEB_ROOT_PATH+'/medStand/medStandCtrl.htm?BLHMI=nameList',
		columns: [[
					{field:'itemid',title:'id',hidden:true},
					{field:'itemName',title:'药品名称',width:100,align:'center'},
					{field:'itemSpec',title:'规格',width:80,align:'center'},
					{field:'dispensUnit',title:'零售单位',width:60,align:'center'},
					{field:'basicUnit',title:'基本单位',width:60,align:'center'}	
				]]
	});* */
	/**
	 * 药品类型-模糊查询
	 
	$("#drugClassification").combogrid({
		panelWidth: 120,
        panelHeight: 160,
        hasDownArrow:false,
        pagination: false,
        idField: 'ordCateid',
		mode: 'remote',
		textField:'ordCatename',
		method:'get',
		//queryParams : { contactsId : contactsFriendsId },
		url: $WEB_ROOT_PATH+'/medStand/medStandCtrl.htm?BLHMI=classificationList',
		columns: [[
					{field:'ordCateid',title:'id',hidden:true},
					{field:'ordCatename',title:'医嘱类型',width:120,align:'center'}//药品类型
				]]
	});* */
	$('#drugClassification').combobox('setValue',"");
	$('#drugClassification').combobox('setText',"全部");
});

function findData(){
	var itemname = $('#patientName').val();
	/*var drugName=$CommonUI.getComboGrid('#patientName').combogrid('grid');
	var name=drugName.datagrid('getSelected');
		if(name != null){
			itemname=name.itemName;
		}*/
	
	var ordCateid = $('#drugClassification').combobox('getValue');;
	/*var drugCate=$CommonUI.getComboGrid('#drugClassification').combogrid('grid');
	var cateName=drugCate.datagrid('getSelected');
		if(cateName != null){
			ordCateid=cateName.ordCateid;
		}*/	
	var radio = document.getElementsByName("radio");
	
	if(radio[0].checked || radio[1].checked){
		$CommonUI.getDataGrid('#dg').datagrid({
	    	url:$WEB_ROOT_PATH + "/purchaseManage/drugCommonCtrl.ajax?ismeditem=1",
	    	queryParams:{
				"medicine":itemname,
				"cateId":ordCateid,
				"status":radio[0].checked?radio[0].value:radio[1].value
	    	}
	    });
		$CommonUI.getDataGrid('#dg').datagrid('load', {  
			"pageSize": 10,  
			"pageNo": 1,
			"medicine":itemname,
			"cateId":ordCateid,
			"status":radio[0].checked?radio[0].value:radio[1].value
		});    
	}else{
		$CommonUI.getDataGrid('#dg').datagrid({
	    	url:$WEB_ROOT_PATH + "/purchaseManage/drugCommonCtrl.ajax?ismeditem=1",
	    	queryParams:{
				"medicine":itemname,
				"cateId":ordCateid,
				"status":""
	    	}
	    });
		$CommonUI.getDataGrid('#dg').datagrid('load', {  
			"pageSize": 10,  
			"pageNo": 1,
			"medicine":itemname,
			"cateId":ordCateid,
			"status":""
		});    
	}   
}

function createItem(){
	$CommonUI.getForm('#createForm').form('clear');
	//document.getElementById("update").style.display="none";
	//document.getElementById("save").style.display="block";
	//document.getElementById("close").style.display="block";
	$("#update").hide();
	$("#save").show();
	$("#close").show();
	
	$('#dlg').dialog('open').dialog('setTitle', '药品基本信息');
	$("#dlg").dialog('open');
}
function updateItem(){
	var selectedRow = $("#dg").datagrid('getSelected');
	//document.getElementById("save").style.display="none";
	//document.getElementById("update").style.display="block";
	$("#update").show();
	$("#save").hide();
	$("#close").show();
	
	if (selectedRow) {
	    $CommonUI.getForm('#createForm').form('clear');
	    $('#dlg').dialog('open').dialog('setTitle', '药品基本信息');
	    $("#dlg").dialog('open');
	    var itemid = selectedRow.itemid;
	    //var uuid = selectedRow.uuid;
	    //var itemName = selectedRow.itemName;
	    //alert(itemName);
	   
	    //alert(itemName);
	    //var itemDoseid = selectedRow.itemDoseid;
	    //$('#itemDoseid').combobox('setValue',itemDoseid);/medStand/medStandCtrl.htm?BLHMI=medList
	    $.getJSON($WEB_ROOT_PATH+ "/infoManage/medStandList.ajax?itemid="
				+ itemid, function(data) {
	    	      
	    	      //alert(data.rows[0].itemDoseid);
	    	     $('#itemid1').val(data.rows[0].itemid);
	    	     $('#ordItemid').val(data.rows[0].ordItemid);
	    	     $('#itemName').val(data.rows[0].itemname); 
	    	     $('#itemChemistryName').val(data.rows[0].itemChemistryName);
	    	     $('#itemCommonName').val(data.rows[0].itemCommonName);
	    	     
	    	     $('#inputstr').val(data.rows[0].inputstr);
	    	     $('#ordCateid').combobox('setValue',data.rows[0].ordCateid);
	    	     $('#itemDoseid').combobox('setValue',data.rows[0].itemDoseid);
	    	     
	    	     $('#basicUnit').combobox('setValue',data.rows[0].basicUnit);
	    	     $('#medUnit').combobox('setValue',data.rows[0].medunit);
	    	     $('#medFactor').val(data.rows[0].medfactor);
	    	     
	    	     //$('#itemUsageid').combobox('setValue',data.rows[0].itemUsageid);
	    	     $('#chargeCateid').combobox('setValue',data.rows[0].chargeCateid);
	    	     $('#pharmacycate').combobox('setValue',data.rows[0].pharmacyCateTwosubid);
	    	     $('#itemSpec').val(data.rows[0].itemSpec);
	    	     
	    	     $('#wholesalesPrice').val(data.rows[0].wholesalesPrice);
	    	     $('#salesPrice').val(data.rows[0].salesPrice);
	    	     $('#dispensUnit').combobox('setValue',data.rows[0].dispensUnit);
	    	     
	    	     $('#dispensFacotr').val(data.rows[0].dispensFacotr);	    	     
	    	     $('#warehousUnit').combobox('setValue',data.rows[0].warehousUnit);
	    	     $('#warehousFacotr').val(data.rows[0].warehousFacotr);
	    	     if(data.rows[0].createtime==""||data.rows[0].createtime=='null'){
	    				
    			 }else{
    				  $('#createTime').datebox('setValue',data.rows[0].createtime.substr(0,10));	
    			 }
	    	     if(data.rows[0].updatetime==""||data.rows[0].updatetime=='null'){
	    				
	    		 }else{
	    			 $('#updateTime').datebox('setValue',data.rows[0].updatetime.substr(0,10));
	    		 }
	    	       	     
	    	     
	    	     $('#entIdSupplier').combobox('setValue',data.rows[0].entidSupplier);
	    	     
	    	     $('#entidProducer').combobox('setValue',data.rows[0].entidProducer);
	    	     $('#nationaldrugs').combobox('setValue',data.rows[0].nationaldrugs);
	    	     //alert(data.rows[0].activeflag);
	    	     if(data.rows[0].activeflag == true){
	    	    	 document.getElementById("radio1").checked = "checked";
	    	     }else{
	    	    	 document.getElementById("radio2").checked = "checked"; 
	    	     }
	    });
	    //var ordCatename= selectedRow.ordCatename;
	   // alert(ordCatename);
	    //alert(uuid);
	}else {
		$CommonUI.alert("请选择一行记录");
	}
}
function importItem(){
	$CommonUI.getForm('#inportForm').form('clear');
	$('#inportDlg').dialog('open').dialog('setTitle', '药品目录');
	$("#inportDlg").dialog('open');
	$CommonUI.getDataGrid('#inportdg').datagrid({  
		url:$WEB_ROOT_PATH + "/js/dhcc/chis/inventory/json/inport.json"
	});
}
function importItemInfo(){
}
function saveItem(){
	//$('#dlg').dialog('close');
	//$CommonUI.alert("保存成功！");
	var url=$WEB_ROOT_PATH + '/infoManage/medStandCtrl.ajax?BLHMI=saveItemMedStand';
	
	var ordCateid = $("#ordCateid").combobox('getValue');
	if(ordCateid == "" || ordCateid == null){
		$CommonUI.alert("医嘱类型不可为空!");	
		return;
	}
	//var entId = $("#entname").combobox('getValue');
	//var radio = document.getElementsByName("drugRadio");
	var pharmacycate = $("#pharmacycate").combobox('getValue');
	if(pharmacycate == "" || pharmacycate == null){
		$CommonUI.alert("药理类别不可为空!");	
		return;
	}
	/*var activeflag = false;
	if(radio[0].checked){
		activeflag=true;
	}*/
	var itemName = $('#itemName').val(); 
	if(itemName == "" || itemName == null){
		$CommonUI.alert("药品名称不可为空!");	
		return;
	}
	var radio = document.getElementsByName("drugRadio");
	var activeflag = 0;
	if(radio[0].checked){
		activeflag = 1;
	}
	var medfactor =parseFloat($("#medFactor").val());
	var wholesalesPrice = parseFloat($("#wholesalesPrice").val());
	var salesPrice = parseFloat($("#salesPrice").val());
	var dispensFacotr = parseFloat($("#dispensFacotr").val());
	var warehousFacotr = parseFloat($("#warehousFacotr").val());
//	
  //	postReq(url, 'createForm',succAdd, err, {skipHidden : false},{"activeflag" : activeflag});
	
	 postReq(url, '#createForm',function(data){
		 if(data.result=='1'){
			 $CommonUI.alert("添加药品信息成功!");	
				$("#dg").datagrid('reload');
				$('#dlg').dialog('close');
		 }else{
			 $CommonUI.alert("保存失败");
		 }
		
	 },function(XMLHttpRequest, textStatus, errorThrown){
		 $CommonUI.alert("保存失败");
		 },{"skipHidden":false},
		 {"activeflag" : activeflag,
		  "ismeditem":1,	 
		  "medfactor" : medfactor,
		  "wholesalesPrice" : wholesalesPrice,
		  "salesPrice" : salesPrice,
		  "dispensFacotr" : dispensFacotr,
		  "warehousFacotr" : warehousFacotr,
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
function update(){ 
	//$('#dlg').dialog('close');
	//$CommonUI.alert("保存成功！");
	var url=$WEB_ROOT_PATH + '/infoManage/medStandCtrl.ajax?BLHMI=saveItemMedStand';
	var itemName = $('#itemName').val(); 
	if(itemName == "" || itemName == null){
		$CommonUI.alert("药品名称不可为空!");	
		return;
	}
	var ordCateid = $("#ordCateid").combobox('getValue');
	if(ordCateid == "" || ordCateid == null){
		$CommonUI.alert("医嘱类型不可为空!");	
		return;
	}

	var pharmacycate = $("#pharmacycate").combobox('getValue');
	if(pharmacycate == "" || pharmacycate == null){
		$CommonUI.alert("药理类别不可为空!");	
		return;
	}
	/**
	
	var entId = $("#entname").combobox('getValue');
	var radio = document.getElementsByName("drugRadio");
	var chargeCateid = $("#chargeCateid").combobox('getValue');
	var activeflag = false;
	if(radio[0].checked){
		activeflag=true;
	}***/
	var radio = document.getElementsByName("drugRadio");
	var activeflag = 0;
	if(radio[0].checked){
		activeflag = 1;
	}
	var ordCateid = $("#ordCateid").combobox('getText');
	/****
	if(ordCateid=="西药"){
		ordCateid="01";
	}else if(ordCateid=="中药"){
		ordCateid="02";
	}
	****/
	//var chargeCateid = $("#chargeCateid").combobox('getText');	
	/****
	if(chargeCateid == "西药费"){
		chargeCateid="01";
	}else if(chargeCateid == "草药费"){
		chargeCateid="02";
	}else if(chargeCateid == "其他费"){
		chargeCateid="03";
	}***/
	var itemDoseid = $("#itemDoseid").combobox('getText');
	/*****
	$.getJSON($WEB_ROOT_PATH+ "/medStand/medStandCtrl.htm?BLHMI=dictionaryList&dto.type=dosage&dto.itemDoseid="
			+ itemDoseid, function(data) {
		      if(data.rows!=null && data.rows.length!=0){
		    	  itemDoseid = data.rows[0].id; 
		    	  alert("**itemDoseid*****"+itemDoseid);
		      }
	});	
	
	switch(itemDoseid){
	  case "粉针剂" : itemDoseid ="01";  break;
	  case "冻干粉针剂" : itemDoseid ="02";  break;
	  case "溶媒结晶粉针剂" : itemDoseid ="03";  break;
	  case "注射液" : itemDoseid ="04";  break;
	  case "溶液剂" : itemDoseid ="05";  break;
	  case "注射剂" : itemDoseid ="06";  break;
	  default : itemDoseid=""; break;
	}****/
	var itemid = $("#itemid1").val();
	var medfactor =parseFloat($("#medFactor").val());
	var wholesalesPrice = parseFloat($("#wholesalesPrice").val());
	var salesPrice = parseFloat($("#salesPrice").val());
	var dispensFacotr = parseFloat($("#dispensFacotr").val());
	var warehousFacotr = parseFloat($("#warehousFacotr").val());
//	
  //	postReq(url, 'createForm',succAdd, err, {skipHidden : false},{"activeflag" : activeflag});
	
	 postReq(url, '#createForm',function(data){
		 if(data.result=='1'){
			 $CommonUI.alert("修改药品信息成功!");	
				$("#dg").datagrid('reload');
				$('#dlg').dialog('close');
		 }else{
			 $CommonUI.alert("修改失败");
		 }
		
	 },function(XMLHttpRequest, textStatus, errorThrown){
		 $CommonUI.alert("修改失败");
		 },{"skipHidden":false},
		 {"activeflag" : activeflag,
		  "medfactor" : medfactor,
		  "wholesalesPrice" : wholesalesPrice,
		  "salesPrice" : salesPrice,
		  "dispensFacotr" : dispensFacotr,
		  "warehousFacotr" : warehousFacotr,
		  "itemid" : itemid
		 }
		 );	

	
//	postReq(url, 'createForm',succUpdate, err, {skipHidden : false},
//			{"activeflag" : activeflag,
//		     //"dto.itemMedStand.ordCateid" : ordCateid,
//		     //"dto.itemMedStand.itemDoseid" : itemDoseid,
//		     //"dto.itemMedStand.chargeCateid" : chargeCateid,
//		     "itemid" : itemid
//		     });
//	postReq(url, '#createForm',function(data){
//		 if(data.result=='1'){
//			 $CommonUI.alert("修改药品信息成功!");	
//				$("#dg").datagrid('reload');
//				$('#dlg').dialog('close');
//		 }else{
//			 $CommonUI.alert("修改失败");
//		 }
//		
//	 },function(){
//		 $CommonUI.alert("修改失败");
//		 },{"skipHidden":false},
//		 {"activeflag" : activeflag, "itemid" : itemid});	
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
	$CommonUI.alert("添加药品信息成功!");	
	$("#dg").datagrid('reload');
	$('#dlg').dialog('close');
}
function succUpdate(data) {
	$CommonUI.alert("修改药品信息成功!");	
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
