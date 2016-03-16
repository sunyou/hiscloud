$(function(){
	//$CommonUI.datebox('#adjustStartTime', (new Date()).format("yyyy-MM-dd"), true);
	//$CommonUI.datebox('#adjustEndTime', (new Date()).format("yyyy-MM-dd"), true);
	var onClickCell = function(index,field,value){
		
		if(field == 'newQuantity'){			 
			quantityEdit(index,field,value);			
		}
	};
	var options = {height : 425,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : false,
			onClickCell : onClickCell};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	{title : "uuid",field : "uuid",hidden:true},
	     	    	{title : "orgid",field : "orgid",hidden:true},
	     	    	{title : "adjuestcurid",field : "adjuestcurid",hidden:true},
	     			//{title : "药品名称",field : "itemname",width : 200,align : 'center'},
	     			{title : "药品名称",field : "itemCommonName",width : 140,align : 'center'},
	     			{title : "药品规格",field : "itemSpec",width : 140,align : 'center'},
	     			{title : "批次",field : "batchcode",width : 120,align : 'center'},
	     			{title : "失效效期",field : "invalidDate",width : 160,align : 'center'},
	     			{title : "调整前数量",field : "quantity",width : 100,align : 'center',editor:{type:'text'}},	     			
	     			{title : "调整后数量",field : "newQuantity",width : 100,align : 'center',editor:{type:'text'}},
	     			{title : "调整差值",field : "adjustBalance",width : 100,align : 'center',editor:{type:'text',options:{editable:false}}},
	     			
	     			{title : "库存单位",field : "dispensUnit",width : 120,align : 'center'},
	     			{title : "生产厂家",field : "entname",width : 150,align : 'center'}
	     			] ];
	var queryParams = {page : 1,rows : 15};
	var url = '';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
	
	
	$CommonUI.getEdataGrid('#searchdg').datagrid({
		method:'get',
	    url:$WEB_ROOT_PATH+'/purchaseManage/meStCurCtrl.ajax',
	    fitColumns: true,
	    pagination: true,
	    height : 310,
		singleSelect: false,
		//rownumbers: true,
	    columns:[[
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	{title : "uuid",field : "uuid",hidden:true},
	     	    	{title : "orgid",field : "orgid",hidden:true},
	     	    	{title : "adjuestcurid",field : "adjuestcurid",hidden:true},
	     	    	//{title : "newQuantity",field : "newQuantity",hidden:true},
	     			//{title : "药品名称",field : "itemname",width : 140,align : 'center'},
	     	    	{title : "药品名称",field : "itemCommonName",width : 140,align : 'center'},
	     			{title : "药品规格",field : "itemSpec",width : 140,align : 'center'},
	     			{title : "批次",field : "batchcode",width : 110,align : 'center'},
	     			{title : "失效效期",field : "invalidDate",width : 110,align : 'center'},
	     			//{title : "批次库存",field : "quantity",width : 110,align : 'center'},
	     			{title : "批次库存",field : "quantity",width : 110,align : 'center',
	     				formatter: function(value,row,index){
	     					return value.toFixed(2);  
	     				}
	     			},
	     			{title : "库存单位",field : "dispensUnit",width : 110,align : 'center'},
	     			{title : "生产厂家",field : "entname",width : 110,align : 'center'}
	     		   ]],
	     			queryParams:{},
	     onCheck: function(rowIndex, rowData) {
	    	 var length = $CommonUI.getDataGrid('#dg').datagrid('getRows').length;
	    	 $CommonUI.getDateBox("#adjustTime").datebox("setValue",$('#policymakDateHidden').val());
	    	 var flag= true;
	    	 for(var i=0;i<length;i++){
					if(rowData!=null && rowData!="" &&
							$CommonUI.getDataGrid('#dg').datagrid('getRows')[i]!=null
							&& (rowData.uuid == $CommonUI.getDataGrid('#dg').datagrid('getRows')[i].uuid)){
						flag = false;
					}
			 }
	    	 if(flag){
	    		 $CommonUI.getDataGrid('#dg').datagrid('appendRow',rowData);
		    	 $CommonUI.getDataGrid('#dg').datagrid('beginEdit',length);
		    	 var rows = $CommonUI.getDataGrid('#dg').datagrid('getRows');
		    	 for(var i=0;i<$CommonUI.getDataGrid('#dg').datagrid('getRows').length;i++){
						var quantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'quantity'});
						var balanceEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'adjustBalance'});		   
						
						var quantity = rows[i].quantity.toFixed(2);
						$(quantityEditor.target).val(quantity);
						//$(balanceEditor.target).val($(balanceEditor.target).val().toFixed(2));
						//$(balanceEditor.target).val($(balanceEditor.target).val.toFixed(2));
						$(quantityEditor.target).attr("disabled", true);
						$(balanceEditor.target).attr("disabled", true);
				}	
	    	 }
	    	 
	     },
	     onUncheck: function(rowIndex, rowData) {
	    	 var length = $CommonUI.getDataGrid('#dg').datagrid('getRows').length;
	    	 for(var i=0;i<length;i++){
					if(rowData!=null && rowData!="" && 
							$CommonUI.getDataGrid('#dg').datagrid('getRows')[i]!=null
							&& (rowData.uuid == $CommonUI.getDataGrid('#dg').datagrid('getRows')[i].uuid)){
						$CommonUI.getDataGrid('#dg').datagrid('deleteRow',i);
					}
				}
	     },
	    });
	
	/***
	 * 药品检索
	 * 
	var optionsSelect = {toolbar : "#dlg",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : false};
	var sortOptsSelect = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOptsSelect = {pageNumber : 1,pageSize : 15};
	var columnsSelect = [ [
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	{title : "uuid",field : "uuid",hidden:true},
	     			{title : "药品名称",field : "itemName",width : 140,align : 'center'},
	     			{title : "药品规格",field : "itemSpec",width : 140,align : 'center'},
	     			{title : "批次",field : "batchcode",width : 110,align : 'center'},
	     			{title : "失效效期",field : "invalidDate",width : 110,align : 'center'},
	     			{title : "批次库存",field : "quantity",width : 110,align : 'center'},
	     			{title : "单位",field : "orgidHosp",width : 110,align : 'center'},
	     			{title : "生产厂家",field : "entidProducer",width : 110,align : 'center'}
	     			] ];
	var queryParamsSelect = {page : 1,rows : 15};
	var urlSelect = $WEB_ROOT_PATH+'/inventoryAdjustment/inventoryAdjustmentCtrl.htm?BLHMI=drugList';
	$CommonUI.datagrid('#searchdg', urlSelect, queryParamsSelect, columnsSelect, pageOptsSelect, sortOptsSelect,optionsSelect);
	**/
	
	$CommonUI.getEdataGrid('#adjustmentdg').datagrid({
		method:'get',
	    url:$WEB_ROOT_PATH+'/purchaseManage/inventoryAdjustmentCtrl.ajax?BLHMI=adjustList',
	    fitColumns: true,
	    pagination: true,
	    height : 310,
		singleSelect: true,
		/*rownumbers: true,*/
	    columns:[[
	     	    	{field : "ck1",checkbox : true,width : 80,align : 'center'},
	     	    	{title : "itemid",field : "itemid",hidden:true},
	     	    	//{title : "adjuestcurid",field : "adjuestcurid",hidden:true},
	     	    	{title : "batchcode",field : "batchcode",hidden:true},
	     			{title : "调整人",field : "empName",width : 180,align : 'center'},
	     	    	//{title : "调整单号",field : "adjuestcurid",width : 180,align : 'center'},
	     			{title : "调整部门",field : "orgname",width : 185,align : 'center'},
	     			{title : "调整日期",field : "adjustDate",width : 185,align : 'center',
	     				 formatter:function(value,row,index){
		    		    		if(row.adjustDate!=""&&row.adjustDate!=null){
		 							var adjustDate = row.adjustDate.substr(0,10);
		 							return adjustDate;
		 							
		 						}
		    		    		
		    		    	}		
	     			},
	     			{title : "调整原因",field : "adjustReason",width : 181,align : 'center'}
	     		   ]],
	    //queryParams:{page : 1,rows : 15}  
	    queryParams:{} 		   
	    });
	
	/**
	 * 药品名称-模糊查询
	 
	$("#drugName").combogrid({
		panelWidth: 300,
        panelHeight: 280,
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
					{field:'itemName',title:'药品名称',width:135,align:'center'},
					{field:'itemSpec',title:'规格',width:135,align:'center'}
				]]
	});* */
	$CommonUI.getDateBox("#adjustTime").datebox("setValue",$('#policymakDateHidden').val());
	//alert($('#useridSession').val());
	$('#departmentId').combobox('setValue',$('#orgidSession').val());
	$('#adjustcurUserid').val($('#useridSession').val());
});

/**
 * 药品检索
 * **/
function checkDrug(){
	var orgid = $("#departmentId").combobox('getValue');
	$CommonUI.getForm('#searchForm').form('clear');
	$('#dlg').dialog('open').dialog('setTitle', '药品选择窗口');	
	$CommonUI.getDataGrid('#searchdg').datagrid('load',
			{  "dto.itemName":"",
		       "dto.ordCateid":"",
		       "dto.orgid":orgid
			});
	$('#ordCateid').combobox('setValue',"");
	$('#ordCateid').combobox('setText',"全部");
}
/**
 * 药品检索页面-查询
 * **/
function findItem(){
	/***
	var itemName = null;
	var itemGrid=$CommonUI.getComboGrid('#drugName').combogrid('grid');
	var itemSelect=itemGrid.datagrid('getSelected');
	if(itemSelect != null){
		itemName=itemSelect.itemName;
	}****/
	var itemName = $("#drugName").val();
	var ordCateid  = $("#ordCateid").combobox('getValue');
	var orgid = $("#departmentId").combobox('getValue');
	//alert(itemName);
	//alert(ordCateid);
	$CommonUI.getDataGrid('#searchdg').datagrid({
		method:'post',
    	url:$WEB_ROOT_PATH + "/purchaseManage/meStCurCtrl.ajax",
    	queryParams:{
			"medicine":itemName,
			"cateId":ordCateid,
			"pageSize": 10,  
			"pageNo": 1,
			"orgid":orgid
    	}
    });	
	$CommonUI.getDataGrid('#searchdg').datagrid('load', {  
		method:'post',
		"pageSize": 10,  
		"pageNo": 1,  
		"medicine":itemName,
		"cateId":ordCateid,
		"orgid":orgid
	});     
}

/**
 * 药品检索页面-确定
 * **/
function determineItem(){
	var itemSelected = $CommonUI.getDataGrid('#searchdg').datagrid('getSelected');
	if(itemSelected != null){
		var length = $CommonUI.getDataGrid('#dg').datagrid('getRows').length;
		var flag = true;
		//alert(itemSelected.uuid);
		if(length!=0){
			var rowsData = $CommonUI.getDataGrid('#dg').datagrid('getRows');
			for(var i=0;i<length;i++){
				if(rowsData[i].uuid == itemSelected.uuid){
					flag = false;
				}
			}
		}
		if(flag){
			for(var i=0;i<length;i++){
				if(itemSelected.uuid == $CommonUI.getDataGrid('#dg').datagrid('getRows')[i].uuid){
					$CommonUI.getDataGrid('#dg').datagrid('deleteRow',i);
				}
			}
			$CommonUI.getDateBox("#adjustTime").datebox("setValue",$('#policymakDateHidden').val());
			$CommonUI.getDataGrid('#dg').datagrid('appendRow',itemSelected);
			$CommonUI.getDataGrid('#dg').datagrid('beginEdit',length);	
	        for(var i=0;i<$CommonUI.getDataGrid('#dg').datagrid('getRows').length;i++){
				var quantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'quantity'});
				var balanceEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'adjustBalance'});		   
				$(quantityEditor.target).attr("disabled", true);
				$(balanceEditor.target).attr("disabled", true);
			}	
			$('#dlg').dialog('close');
		}else{
			 $CommonUI.alert("此药品信息已存在！");
		}		
	}else{
		$CommonUI.alert("请选择要调整的药品信息！");
	}
	
}

function checkAdjustment(){
	var orgid = $("#departmentId").combobox('getValue');
	$CommonUI.getForm('#adjustmentForm').form('clear');
	$('#adjustmentDlg').dialog('open').dialog('setTitle', '调整单记录');	
	$CommonUI.getDataGrid('#adjustmentdg').datagrid('load',
			{  "rowno":-1,
		       "orgid":"",
		       "startDate":"",
		       "endDate":"",
			});
	$('#orgid').combobox('setValue',$('#orgidSession').val());
	/**$CommonUI.getDataGrid('#adjustmentdg').datagrid({  
		url:''
	});**/
}
/***
 * 确认调整（保存）
 * **/
function save(){
	//var json = $('#dg').datagrid('getData');
	var rows = $CommonUI.getDataGrid('#dg').datagrid('getRows');
	if(rows != null && rows != ""){
	//var rows=json.rows;
	var Str="";
	var Fields = new Array();
	var j=0;
	var adjustcurid = "";
	for(var i=0; i<rows.length; i++)
	{
		var Field = new Object();
		Field.uuid = rows[i].uuid;
		Field.orgid = rows[i].orgid;
		Field.itemid = rows[i].itemid;
		Field.batchcode = rows[i].batchcode;
		
		//给 调整单 中添加药品信息
		if(rows[i].adjuestcurid != null && rows[i].adjuestcurid != ""){
			Field.adjustCurid = rows[i].adjuestcurid;
			adjustcurid=rows[i].adjuestcurid;
			
		}else{
			//库存id
			Field.adjustCurid = rows[i].uuid;
		}	
		/*if(rows[i].newQuantity != null && rows[i].newQuantity != ""){
			Field.quantity = rows[i].newQuantity;
			Field.balance = rows[i].balance;
		}*/
		var newQuantityEd=$('#dg').datagrid('getEditor', {index:i,field:'newQuantity'}); 
		var newQuantity=$(newQuantityEd.target).val();
		var balanceEd=$('#dg').datagrid('getEditor', {index:i,field:'adjustBalance'}); 
		var balance=$(balanceEd.target).val();
		//alert("newQuantity: "+newQuantity);
		//alert(balance);
		//alert(rows[i].adjuestcurid);
		//alert(rows[i].quantity);
		if(newQuantity<0){
			var j=i+1;
			$CommonUI.alert("第"+j+"行调整后数量不能为负数！");
			return;
		}
		if(newQuantity != null && newQuantity != ""){
			Field.afterQuantity = newQuantity;
			Field.beforeQuantity = rows[i].quantity;
			Field.balance = balance;
			//alert(Field.balance);
		}else{
			Field.beforeQuantity = rows[i].quantity;
			Field.afterQuantity = rows[i].quantity;
			Field.balance = 0;
			//alert(Field.balance);
		}
		
		
		Fields[j] = Field;
		j++;
	}
	Str = $.toJSON(Fields);
	//alert(Fields.length);
	//var adjustcurid = $("#adjustcurid").val();
	//var sheetId = $("#sheetId").val();
	/**
	if(sheetId == null || sheetId == ""){
		$CommonUI.alert("调整单号不能为空！");
		//$("#sheetId").html("<font color='red'>单号不能为空</font>");   
		return ;
	}**/
	var departmentId = $("#departmentId").combobox('getValue');
	//var departmentName = $("#departmentId").combobox('getText');
	if(departmentId == null || departmentId == ""){
		$CommonUI.alert("调整部门不能为空！");
		//$("#sheetId").html("<font color='red'>单号不能为空</font>");   
		return ;
	}
	//alert(departmentName);
//	if(departmentName!=null && departmentName!=""){
//		$.getJSON($WEB_ROOT_PATH+ "/inventoryAdjustment/inventoryAdjustmentCtrl.htm?BLHMI=adjustDepartment&dto.departmentName="
//				+ departmentName, function(data) {
//			      if(data.rows!=null && data.rows.length!=0){
//			    	   departmentId = data.rows[0].id;
//			    	   departmentName = data.rows[0].text;  
//			    	   //alert("**departmentId*****"+data.rows[0].id);
//			    	   //alert("**departmentId*****"+departmentId);
//			      }
//		});	
//	}	
	//alert("111111");
	var adjustTime = $("#adjustTime").datebox('getValue');
	//alert("111111");
	//var adjustTime = $("#adjustTime").val();
	//alert(adjustTime);
	if(adjustTime=="" || adjustTime==null){
		$CommonUI.alert("调整日期不可为空！");
		return;
	}
	if(!adjustTime.match("^[1-2]\\d{3}-[0-1]\\d-[0-3]\\d")){
		 $CommonUI.alert("日期格式不正确，正确格式为：yyyy-MM-dd");
		 return;
	}
	var adjustReason = $("#adjustReason").val();
	var url=$WEB_ROOT_PATH + '/purchaseManage/adjustMgrCtrl.ajax?BLHMI=save';
	window.setTimeout(function(){
		//if(departmentId != departmentName){
			postReq(url, null,succAdd, err, {skipHidden : false},
					{"fields" : Str,
				     "adjustCurid" : adjustcurid,
				    // "sheetId" : sheetId,
				     "orgid" : departmentId,
				     //"departmentName" : departmentName,
				     "adjustDate" : adjustTime,
				     "fields":Str,
				     "adjustReason" : adjustReason
				});
//		}else{
//			$CommonUI.alert("调整失败！");
//		}
	},800);
	//alert("@@@departmentId@"+departmentId);
	//alert(departmentName);
	}else{
		$CommonUI.alert("请选择要调整的信息！");
	}
}

function err(){
	$CommonUI.alert("调整失败！");
}
function succAdd(data) {
	$CommonUI.alert("调整成功!");	
	$CommonUI.getDataGrid('#dg').datagrid('loadData',{"total":"0","rows":[]});
	$CommonUI.getForm('#checkForm').form('clear');
	$('#departmentId').combobox('setValue',$('#orgidSession').val());
	$('#adjustcurUserid').val($('#useridSession').val());
	//$("#dg").datagrid('reload');
	//$('#dlg').dialog('close');
}
var quantityEdit = function(index,field,value){
	var ed = $CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:index,field:''+field+''});
	if(ed !=null){
		$(ed.target).keyup(function(){
			if(this.value.indexOf(".")==this.value.lastIndexOf(".")){
				   $(ed.target).val($(ed.target).val().replace(/[^\d.]/g,''));
				   if(this.value.indexOf(".")!=-1){
					   this.value = this.value.substr(0, this.value.indexOf(".")+3);  //小数点后两位
				   }
			   }else{
				   this.value = this.value.substr(0, this.value.length - 1);
				}
			   this.value = this.value.substr(0, 8);//长度8位
			var selectedRow = $('#dg').datagrid("getSelected");
			var selectedIndex = $('#dg').datagrid("getRowIndex", selectedRow);
			if(field=='newQuantity'){ 
				   var newQuantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:selectedIndex,field:'newQuantity'});
				   var newQuantity = $(newQuantityEditor.target).val();
   
				   var quantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:selectedIndex,field:'quantity'});
				   var balanceEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:selectedIndex,field:'adjustBalance'});
				   
				   //$(quantityEditor.target).attr("disabled", true);
				   //$(balanceEditor.target).attr("disabled", true);
				   
				   var quantity = $(quantityEditor.target).val();
				   $(balanceEditor.target).val((newQuantity-quantity).toFixed(2));
				   
			}
		});
		$(ed.target).focusout(function(){
			$(this).unbind();//移除绑定事件
			$(this).blur();//丢失焦点以后移除焦点
		});
	}
};
/**
 * 查看调整单页面-查询
 * **/
function findAdjustSheetItem(){
	var rowno = $("#rowno").val();
	var orgid=$("#orgid").combobox('getValue');
	var adjustStartTime = $CommonUI.getDateBox('#adjustStartTime').datebox('getValue');
	var adjustEndTime = $CommonUI.getDateBox('#adjustEndTime').datebox('getValue');
	if((adjustStartTime!=null && adjustStartTime!='') && (adjustEndTime!=null && adjustEndTime!='') && (adjustStartTime>adjustEndTime)){
		$CommonUI.alert("起始时间不可大于终止时间!");	
		return;
	}
	$CommonUI.getDataGrid('#adjustmentdg').datagrid({
    	url:$WEB_ROOT_PATH+'/purchaseManage/inventoryAdjustmentCtrl.ajax?BLHMI=adjustList',
    	queryParams:{
			//"dto.rowno":rowno,
			
			"orgid":orgid,
			"startDate":adjustStartTime,
			"endDate":adjustEndTime
    	}
    });		
}
/**
 * 查看调整单页面-确定
 * **/
function insertAdjustSheetItem(){
	var itemSelected = $CommonUI.getDataGrid('#adjustmentdg').datagrid('getSelected');
	$CommonUI.getDataGrid('#dg').datagrid('loadData',{"total":"0","rows":[]});
	$CommonUI.getForm('#checkForm').form('clear'); 
	$('#departmentId').combobox('setValue',$('#orgidSession').val());
	if(itemSelected !=null){
		/***给调整单赋值**/
		//$("#sheetId").val(itemSelected.rowno);
		//alert(itemSelected.adjuestcurid);
		//$("#sheetId").val(itemSelected.adjuestcurid);
		$("#adjustcurUserid").val(itemSelected.empName);
		//alert(itemSelected.orgid);
		//$('#departmentId').combobox('setValue',itemSelected.orgid);
		//$('#adjustTime').datebox('setValue',itemSelected.adjustcurDatetime);
		if(itemSelected.adjustDate==""||itemSelected.adjustDate=='null'){
			
		}else{
			$CommonUI.getDateBox("#adjustTime").datebox("setValue",itemSelected.adjustDate.substr(0,10));
		}
		
		$("#adjustReason").val(itemSelected.adjustReason);
		//var itemid = itemSelected.itemid;
		var adjustId = itemSelected.adjustId;
		//var adjustcurid = itemSelected.adjuestcurid;
		var orgid = $('#departmentId').combobox('getValue');
		//alert(orgid);
		var batchcode = itemSelected.batchcode;
		if(adjustId!=null && adjustId!=""){
			$.getJSON($WEB_ROOT_PATH+ "/purchaseManage/adjustMgrCtrl.ajax?BLHMI=insertAdjustItem&adjustId="+adjustId,
					function(data) {
				     if(data!=null){
				    	 var rows = data.mePlSubBean;
				    	 for(var i=0;i<rows.length;i++){
				    		 $CommonUI.getDataGrid('#dg').datagrid('appendRow',rows[i]);
				    		 $CommonUI.getDataGrid('#dg').datagrid('beginEdit',i);
				    		 var quantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'quantity'});
				 			 var balanceEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'adjustBalance'});	
				 			 var newQuantityEditor=$CommonUI.getDataGrid('#dg').datagrid('getEditor', {index:i,field:'newQuantity'});
				 			 $(newQuantityEditor.target).attr("disabled", true);
				 			 $(quantityEditor.target).attr("disabled", true);
				 			 $(balanceEditor.target).attr("disabled", true);
				    	 }
				    	 for(var i=0;i<rows.length;i++){
				    		 var adjustBalance =  rows[i].differenceQuantity.toFixed(2);
				    		 var newQuantity = rows[i].quantity.toFixed(2);
				    		 var quantity = (rows[i].quantity-rows[i].differenceQuantity).toFixed(2);
				    		 $CommonUI.getDataGrid('#dg').datagrid('updateRow',{
				    				index: i,
				    				row: {
				    					adjustBalance: adjustBalance,
				    					newQuantity :  newQuantity,
				    					quantity : quantity
				    				}
				    			});


				    	 }  
				     }
			});
		}
		
		//var length = $CommonUI.getDataGrid('#dg').datagrid('getRows').length;
		//$CommonUI.getDataGrid('#dg').datagrid('beginEdit',length);	
		$('#adjustmentDlg').dialog('close');
		$('#checkDrug').attr('disabled','disabled');
		$('#save').attr('disabled','disabled');
		$('#history').attr('disabled','disabled');
		/*$('#checkDrug').linkbutton('disable');
		$('#save').linkbutton('disable');
		$('#history').linkbutton('disable');*/
	}else{
		$CommonUI.alert("请选择一条调整单信息!");	
	}
	
}
function clean(){
	$CommonUI.getDataGrid('#dg').datagrid('loadData',{"total":"0","rows":[]});
	$CommonUI.getForm('#checkForm').form('clear');
	//document.getElementById("checkDrug").disabled=false;
	$('#checkDrug').attr('disabled',false);
	$('#save').attr('disabled',false);
	$('#history').attr('disabled',false);
	/*$('#checkDrug').linkbutton('enable');
	$('#save').linkbutton('enable');
	$('#history').linkbutton('enable');*/
	$('#departmentId').combobox('setValue',$('#orgidSession').val());
	$('#adjustcurUserid').val($('#useridSession').val());
}
function myclose(){
	 $('#dlg').dialog('close');
	
}
function myclose1(){
	 $('#adjustmentDlg').dialog('close');
}

//日期转化格式
var formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};
//解决placceholder兼容
var PlaceHolder = {
	    _support: (function() {
	        return 'placeholder' in document.createElement('input');
	    })(),

	    //提示文字的样式，需要在页面中其他位置定义
	    className: 'abc',

	    init: function() {
	        if (!PlaceHolder._support) {
	            //未对textarea处理，需要的自己加上
	            var inputs = document.getElementsByTagName('input');
	            inputs.value = inputs.attributes.placeholder.nodeValue;
	            PlaceHolder.create(inputs);
	        }
	    },

	    create: function(inputs) {
	        var input;
	        if (!inputs.length) {
	            inputs = [inputs];
	        }
	        for (var i = 0, length = inputs.length; i <length; i++) {
	            input = inputs[i];
	            if (!PlaceHolder._support && input.attributes && input.attributes.placeholder) {
	            	PlaceHolder._setValue(input);
	                input.addEventListener('keydown', function(e) {
	                    if (this.value === this.attributes.placeholder.nodeValue) {
	                        this.value = '';
	                        this.className = '';
	                    }
	                }, false);
	                input.addEventListener('blur', function(e) {
	                    if (this.value === '') {
	                        PlaceHolder._setValue(this);
	                    }
	                }, false);
	            }
	        }
	    },

	    _setValue: function(input) {
	        input.value = input.attributes.placeholder.nodeValue;
	        input.className = PlaceHolder.className;
	    }
	};



