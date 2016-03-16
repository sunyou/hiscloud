var nodeParent = null;
var nodeSelected = null;
var nodeUpId = null;
var nodeId = null;
var nodeText = null;
var nodeGrade = null;
var nodeLeaf = null;
var nodeOrdgrdes = null;
var attributes =null;
var operatTypeId = null;
var ordTypeId = null;

//医嘱字典的数据
var oldOrdDicGrpUuid = null;
var oldOrddicid = null;

//datagrid 的编辑功能
var editingIndex = -1;
var FreqCollection = [];
var freqs = [];
var oldFreqs = [];
var unitnames = [];
var oldunitnames = [];

//医嘱类型 和医嘱子类型
var ordCateid = null;
var ordTypeId = null;
 
var unitQuantityCollection=[
              	        {id:'000',text:'g',selected:true},
              		    {id:'001',text:'片'}
              	      ];
//页面初始化
$(function() {
	var options_pat = { toolbar: "#toolbarRight", height: 240, width: '100%', border: true, singleSelect: true, pagination: false, rownumbers: false,
						fitColumns: true,
	};
	var sortOpts_pat ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var queryParams_pat = { page: 1, rows: 10 };
	var columns_pat =[[
	               {title: "唯一编码",filed:"uuid",hidden:true},//医嘱组子表唯一编码  
	               {title: "医嘱类型",field: "ordTypeid",hidden:true},
	               {title: "医嘱分类",field: "ordCateid",hidden:true},
	               {title: "是否停用",field: "isstop",hidden:true},
	               {title: "字典分类",field:"dtordgrid",hidden:true},//医嘱组编码 
	               {title: "字典编码",field: "orddicid",hidden:true},//医嘱套编码
	               {title: "字典名称助记符",field:"inputstr",hidden:true},
	               {title: "名称",field: "orddicname",width: 80,align:'center'},
	               {title: "描述",field: "orddicnote",width:100,align:'center'},//医嘱组描述
	               {title: "总金额",field: "amountTotal",width: 60,align:'center'},
	               {field:'action',title:'操作',width:100,align:'center',formatter: function(value,row,index){
	   	        	  var e = '<a href="#" onclick="ordDicUpdate(\''+row.uuid+'\','+row.ordTypeid+',\''+row.ordCateid+'\','+row.isstop+',\'' + row.dtordgrid + '\',\'' + row.orddicid + '\',\'' + row.orddicname + '\',\'' + row.orddicnote + '\',\'' + row.inputstr + '\')" style="margin:0 5px">修改</a><a href="#" onclick="ordDicDelete(\'01\',\''+row.dtordgrid+'\',\''+row.orddicid+'\')"  style="margin:0 5px">删除</a>';
	   	        	  return e; 
	   	           }}
	              ]];
	
	var url_pat = $WEB_ROOT_PATH+"/ordTemplate/queryTnOrdList.ajax?nodeId=00";//过滤医嘱字典组子表医嘱组id为"00"(云诊所一级) ?nodeId=0
	//右上datagrid初始化
	$CommonUI.datagrid('#ordDicList', url_pat, queryParams_pat, columns_pat, sortOpts_pat, options_pat);
	
	// ordDicList 添加行选中事件
	$CommonUI.getDataGrid('#ordDicList').datagrid({
		onSelect: function(rowIndex,rowData){
			ordDicUpdate(rowData.uuid, rowData.ordTypeid, rowData.ordCateid, rowData.isstop, rowData.dtordgrid , rowData.orddicid , rowData.orddicname , rowData.orddicnote , rowData.inputstr );
		}
	});
	
	// 页面初始化时初始化树
	treeHandle("01");
	
	loadGrid();
	 
	 
});


// 新建医嘱模板组主表分类
function newAddOrdTemplateCate(){
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}else{
		if(nodeLeaf){
			$CommonUI.alert("当前节点为叶子节点,不能新建!","info");
			return;
		}
		$('#upname').val(nodeText);
		$('#upid').val(nodeId);//上级医嘱组编码即为点击节点的医嘱组编码（新建节点是点击节点的子节点）
		$('#grade').val(nodeGrade + 1);//新建node级次为点击node级次的下一级次（级次号grade越大，级次越低）
	    $CommonUI.getComboBox('#leaf').combobox({disabled:false});
	    $('#ordTemplateCateDialog').dialog('open').dialog('setTitle', '新建模板分类');
	}
	operatTypeId = "01";
} 

// 医嘱分类修改按钮事件
function ordTemplateCateUpdate(){
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	if(nodeParent !=  undefined || nodeParent != null){
		 $('#upname').val(nodeParent.text);
	}else{
		$('#upname').val("");//云诊所没有父节点，上级名称为空
	}
    $('#dtordgrid').val(nodeId);
	$('#dtordgrname').val(nodeText);
	$('#inputstr').val(makePy(nodeText));
	$('#upid').val(nodeUpId);
	$('#grade').val(nodeGrade);
	$CommonUI.getComboBox('#leaf').combobox({disabled:true});
	if(nodeLeaf == 0){
		$CommonUI.getComboBox('#leaf').combobox('select', '0');
	}else{
	    $CommonUI.getComboBox('#leaf').combobox('select', '1');
	}
	$('#ordgrdes').val(nodeOrdgrdes);
    $('#ordTemplateCateDialog').dialog('open').dialog('setTitle', '修改模板分类');
    
    operatTypeId = "02";
     
     
}

// 医嘱分类删除按钮事件
function ordTemplateCateDelete(){
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!");
		return;
	}
	operatTypeId = "03";
	$CommonUI.confirm("确定删除此分类、以及该分类底下子节点吗？",'question','确  定',confirm,'取 消',cancel,false);
}

// 确定删除
function confirm(){
	if( nodeSelected ==  undefined || nodeSelected == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	var url =$WEB_ROOT_PATH+'/ordTemplate/deleteKnOrdGrpNodes.ajax?nodeId=' + nodeId;
	postReq(url,null,successHandler, errorHandler,  {skipHidden:false});
}

//取消删除
function cancel(){
  setParameter();
}

//医嘱分类窗体保存按钮事件
function ordTemplateCateSave(){
	if(operatTypeId == "01"){
		if($('#upid').val() == null || $('#upid').val().length == 0 ){
			$CommonUI.alert("请正确选择一个节点!","info");
			return;
		}
		var url =$WEB_ROOT_PATH+'/ordTemplate/addKnOrdGrpNodes.ajax';
		postReq(url, "#ordTemplateCateDialog", successHandler, errorHandler,  {skipHidden:false});
		
	}else if(operatTypeId == "02"){
		if($('#dtordgrid').val() == null || $('#dtordgrid').val().length == 0 ){
			$CommonUI.alert("请正确选择一个节点!","info");
			return;
		}		
		var url =$WEB_ROOT_PATH+'/ordTemplate/updateKnOrdGrpNodes.ajax';
		postReq(url, "#ordTemplateCateDialog", successHandler, errorHandler,  {skipHidden:false});
	}
}

//新建医嘱分类dialog窗体关闭按钮事件
function ordTemplateCateCancel(){
	 setParameter();
	 $('#ordTemplateCateDialog').dialog('close');
}

// 医嘱分类刷新按钮事件
function ordTemplateRefresh(){
	treeHandle("01");
}

// 树节点的操作
function treeHandle(handleType,data){
	//树的展示
	var strUrl = $WEB_ROOT_PATH + '/ordTemplate/getOrdTree.ajax';
	if(handleType=="01"){
		$CommonUI.getTree('#ordTemplateCateTree').tree({
			url: strUrl,
			lines: true,
			onClick : function(node) {
				if(node != undefined || node != null){
				    nodeParent = $CommonUI.getTree('#ordTemplateCateTree').tree('getParent', node.target);
					nodeSelected = node;
					nodeId = node.id;//医嘱组id
					nodeText = node.text;//医嘱组名称
					nodeGrade = node.attributes["grade"];//级次
					nodeLeaf =  node.attributes["leaf"];//是否叶子节点
					nodeUpId =  node.attributes["upid"];//上级医嘱组编码
					nodeOrdgrdes = node.attributes["ordgrdes"];//医嘱组使用说明
					//加载当前分类中的所有医嘱字典到右上datagrid，加载之前先清空已有数据
					$CommonUI.getDataGrid('#ordDicList').datagrid("loadData",{"total":"0","rows":[]});
					if(nodeLeaf != undefined && nodeLeaf != null && nodeLeaf == "1" ){//叶子节点才加载医嘱字典
						var url = $WEB_ROOT_PATH+"/ordTemplate/queryTnOrdList.ajax?nodeId=" + nodeId ;
						postReq(url, 
								"#ordDicList", 
								function(data){
							      $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
						        }, 
								function(data){
						        	$CommonUI.alert("查询当前分类下字典错误！" ,"error");
						    		return;
						        },  
								{skipHidden:false}
						       );
					}
					
					
					oldOrdDicGrpUuid = null;
					oldOrddicid = null;
					
					clearOrdDicControlValue();//清空医嘱字典信息控件的值（右中、右下）
					
//					$CommonUI.getDataGrid('#ordDicGridList').datagrid("loadData",{"total":"0","rows":[]});
				}
			}
		});
	}
	
	//树节点的增加
	if(handleType=="02"){
		if(nodeSelected != '' && nodeSelected !=  undefined && nodeSelected != null){
			$CommonUI.getTree('#ordTemplateCateTree').tree('append',{
				parent:nodeSelected.target,
				data: data
			});
			}
	}
	
	//树节点的修改
    if(handleType=="03"){
    	if(nodeSelected != '' && nodeSelected !=  undefined && nodeSelected != null){
    		$CommonUI.getTree('#ordTemplateCateTree').tree('update',{
    			target:nodeSelected.target,
    			id: data[0].id,
    			text: data[0].text,
    			iconCls:  data[0].iconCls,
    			state: data[0].state,
    			attributes : data[0].attributes
			});
    	}
	}
    
    //树节点删除
    if(handleType=="04"){
    	if(data){
    		$CommonUI.getTree('#ordTemplateCateTree').tree('remove', nodeSelected.target);
    	}
    }
}
// 重置全局变量
function setParameter(){
     clearControlValue(); 
     nodeParent = null;
	 nodeSelected = null;
	 nodeUpId = null;
	 nodeId = null;
	 nodeText = null;
	 nodeGrade = null;
	 nodeLeaf = null;
	 attributes =null;
	 nodeOrdgrdes = null;
	 operatTypeId = null;
}

// 清空ordTemplateCateDialog中各控件的值
function clearControlValue(){
	$('#upname').val("");
	$('#dtordgrid').val("");
	$('#dtordgrname').val("");
	$('#inputstr').val("");
	$('#upid').val("");
	$('#grade').val("");
	$CommonUI.getComboBox('#leaf').combobox('select', '0');
	$('#ordgrdes').val("");
}

//清空医嘱字典信息控件的值（右中、右下）
function clearOrdDicControlValue(){
	 //右下
	 $CommonUI.getDataGrid('#ordDicGridList').datagrid("loadData",{"total":"0","rows":[]});
	 //右中
	 //医嘱类型
	 $CommonUI.getComboBox('#ordTypeId').combobox('setText','');
	 $CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
	 //医嘱名称
	 $('#orddicname').val('');
	 //医嘱子类
	 $CommonUI.getComboBox('#ordCateid').combobox('setText','');
	 $CommonUI.getComboBox('#ordCateid').combobox('setValue','');
	 //输入串 
	 $('#orddicinputstr').val('');
	 //停用标志
	 $CommonUI.getComboBox('#isstop').combobox('select', '0');
	 //备注
	 $('#notedes').val('');
}

//医嘱字典查询（右上）
function ordDicquery(){
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	var ordDicNameInputStr = $('#ordDicNameInputStr').val();
	if(ordDicNameInputStr == '' || ordDicNameInputStr ==  undefined || ordDicNameInputStr == null){
		$CommonUI.alert("请输入查询条件!","info");
		return;
	}
	var url = $WEB_ROOT_PATH+"/ordTemplate/queryTnOrdList.ajax?nodeId=" + nodeId + "&orddicname=" + encodeURI(encodeURI(ordDicNameInputStr));
	postReq(url, 
			"#ordDicList", 
			function(data){
		      $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
	        }, 
			function(data){
	        	$CommonUI.alert("查询当前分类下字典错误！" ,"error");
	    		return;
	        },  
			{skipHidden:false}
	       );
}

//医嘱字典保存(右中、右下)
function ordDicSave(){
	operatTypeId = "04";
	
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	//医嘱类型
	var ordTypeId = $CommonUI.getComboBox('#ordTypeId').combobox('getValue');
	if(ordTypeId == null || ordTypeId == undefined || ordTypeId =='' ){
		$CommonUI.alert("请选择医嘱类型！！" ,"info");
		return;
	}
	
	var ordCateid = $CommonUI.getComboBox('#ordCateid').combobox('getValue');
	if(ordCateid == null || ordCateid == undefined || ordCateid =='' ){
		$CommonUI.alert("请选择医嘱子类！！" ,"info");
		return;
	}
	
	
	if($('#orddicname') == null || $('#orddicname') == undefined || $('#orddicname').val().length == 0){
		$CommonUI.alert("请录入医嘱字典名称！" ,"info");
		return;
	} 
	
	$CommonUI.getDataGrid('#ordDicGridList').datagrid('acceptChanges');
	
	var url  = $WEB_ROOT_PATH+'/ordTemplate/saveOrdDic.ajax';
	
	//医嘱组id
	var dtordgrid = nodeId;
	//医嘱字典名称
	var orddicName = $('#orddicname').val();
	//输入串 
	var ordDicInputStr = $('#orddicinputstr').val();
	//备注
	var ordDicNote = $('#notedes').val();
	//医嘱字典子类
	var ordCateid = $CommonUI.getComboBox('#ordCateid').combobox('getValue');
	//停用标志
	var isstop = $CommonUI.getComboBox('#isstop').combobox('getValue');
	
	//医嘱字典明细datagrid（右下）
	var ordDicSubs = $('#ordDicGridList').datagrid('getData');
	//当医嘱明细信息（右下datagrid）为空时禁止保存
	if(ordDicSubs.rows.length == 0){
		$CommonUI.alert("请录入医嘱明细信息！" ,"info");
		return;
	}else{
		
		var jsonInspect = $('#ordDicGridList').datagrid('getData');
		var rowsInspect=jsonInspect.rows;
		var FieldsInspect = new Array();
		for(var i=0; i<rowsInspect.length; i++)
		{
			var Field = new Object();
			Field.itemid = rowsInspect[i].itemid;
			Field.itemname = rowsInspect[i].itemname;
			Field.itemSpec = rowsInspect[i].itemSpec;
			Field.freqid = rowsInspect[i].freqid;
			Field.unitQuantity = rowsInspect[i].unitQuantity;
			Field.unitName = rowsInspect[i].unitName;
			Field.salesPrice = rowsInspect[i].salesPrice; 
			
			Field.amountTotal = rowsInspect[i].amountTotal;
			Field.uuid = rowsInspect[i].uuid;
			Field.rowno = rowsInspect[i].rowno; 
			Field.dispensunitname = rowsInspect[i].dispensunitname; 
			
			FieldsInspect[i] = Field;
		}
		StrInspect = $.toJSON(FieldsInspect);
		
		
	}
	//将edategrid中的数据转换为后台格式字符串
	var ordItemString = $.toJSON(ordDicSubs); 
	
//	var data = "";
//	//封装医嘱组id
//	data["nodeId"] = dtordgrid;
//	//封装医嘱字典中数据（右中）到data对象中
//	data["ordTypeId"] = ordTypeId;
//	data["orddicName"] = orddicName;
//	data["ordDicInputStr"] = ordDicInputStr;
//	data["ordDicNote"] = ordDicNote;
//	data["ordCateid"] = ordCateid;
//	data["isstop"] = isstop;
//	data["oldOrdDicGrpUuid"] = oldOrdDicGrpUuid;
//	data["oldOrddicid"] = oldOrddicid;
	
	 
	postReq(url,
	'',
	successHandler,
	errorHandler,
	'',
	{
		"dtordgrid": dtordgrid,  
		"ordTypeId": ordTypeId,
		"orddicName": orddicName,
		"ordDicInputStr": ordDicInputStr,
		"ordDicNote": ordDicNote,
		"ordCateid": ordCateid,
		"isstop": isstop,
		"oldOrdDicGrpUuid": oldOrdDicGrpUuid,
		"oldOrddicid": oldOrddicid,
		"ordItemString":StrInspect
	} 
    );
}
//将edategrid中的数据转换为后台格式字符串
var getArrayFromEdateGrid = function(jsonObject){
	var data = new Array();
	if(jsonObject != null && jsonObject != undefined && jsonObject.rows != 0 ){
		var rows = jsonObject.rows;
		//封装data对象把医嘱字典明细datagrid中的数据保存起来，js中对象以键值对的形式赋值
		for(var n = 0 ; n < rows.length; n++){
			var key1 = "dates[" + n + "].rowno";//序号
			var value1=rows[n].rowno;
			data[key1] = value1;
			
			var key2 = "dates[" + n + "].amountTotal";//总计金额
			var value2=rows[n].amountTotal;
			data[key2] = value2;
			
			var key3 = "dates[" + n + "].uuid";//唯一编码
			var value3=rows[n].uuid;
			data[key3] = value3;
			
			var key4 = "dates[" + n + "].itemname";//项目名称
			var value4=rows[n].itemname;
			data[key4] = value4;
			
			var key5 = "dates[" + n + "].freqid";//频次
			var value5=rows[n].freqid;
			data[key5] = value5;
			
			var key6 = "dates[" + n + "].unitQuantity";//总计数量
			var value6=rows[n].unitQuantity;
			data[key6] = value6;
			
			var key7 = "dates[" + n + "].itemid";//项目编码
			var value7=rows[n].itemid;
			data[key7] = value7;
			
			var key8 = "dates[" + n + "].itemspec";//项目规格
			var value8=rows[n].itemspec;
			data[key8] = value8;
			
			var key9 = "dates[" + n + "].unitName";
			var value9=rows[n].unitName;
			data[key9] = value9;
			
			var key10 = "dates[" + n + "].salesPrice";//项目单价
			var value10=rows[n].salesPrice;
			data[key10] = value10;
		}
	}
	return $.toJSON(data);
};
//医嘱字典修改（右上datagrid中最后一栏）
function ordDicUpdate(uuid,ordTypeid,ordCateid,isstop,dtordgrid,orddicid,orddicname,orddicnote,inputstr){
	
	// 医嘱字典组子表(标准) uuid
	oldOrdDicGrpUuid = uuid;
	
	//医嘱字典编码
	oldOrddicid = orddicid;
	
	//填充医嘱类型的值
	$CommonUI.getComboBox('#ordTypeId').combobox('setValue',ordTypeid);
	
	//填充医嘱子类
	$CommonUI.getComboBox('#ordCateid').combobox('setValue',ordCateid);
	
	//填充是否停用
	$CommonUI.getComboBox('#isstop').combobox('setValue',isstop);
	
	//填充医嘱名称
	$('#orddicname').val(orddicname);
	
	//填充医嘱名称助记符
	$('#orddicinputstr').val(inputstr);
	
	//填充医嘱备注
	$('#notedes').val(orddicnote==null?"":orddicnote);
	
	var url = $WEB_ROOT_PATH+"/ordTemplate/queryOrdDicItemStandList.ajax?orddicid=" + orddicid ;
	//获取医嘱字典明细数据(id = 'DetailTable' datagrid)
	postReq(url, 
			"", 
			function(data){
		      fillOrdDicGridList(data);
	        }, 
			function(data){
	        	$CommonUI.alert("医嘱字典修改失败!","error");
	    		return;
	        },  
			{skipHidden:false} 
	       );
	
}

//医嘱字典修改时填充医嘱字典明细数据(id = 'ordDicGridList' datagrid)
function fillOrdDicGridList(data){
	if((FreqCollection.length == 0)){
		initcomboboxData();
	}
    oldFreqs = FreqCollection;
    //填充医嘱字典明细数据
    $CommonUI.getDataGrid('#ordDicGridList').datagrid('loadData',data);
    
    //设置医嘱明细中每条记录的unitName字段值为dispensunitname字段值
    rows = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getRows');
    for(var n = 0; n < rows.length;n++){
    	unitnames = [{unitid:'0002',unitname:rows[n].dispensunitname,selected:true}];
    	oldunitnames = unitnames;
	    
    	$CommonUI.getDataGrid('#ordDicGridList').datagrid('beginEdit',n);
        $CommonUI.getDataGrid('#ordDicGridList').datagrid('endEdit',n);
    }	
}
//医嘱字典删除（右上datagrid中最后一栏）//删除类型: 00 : 删除分类; 01 : 删除字典 ; 02: 删除字典明细
function ordDicDelete(ordDicDeleteTypeId,dtordgrid,orddicid,uuid){
	//医嘱字典分类Id
	if(ordDicDeleteTypeId == "00"){
		
	}else if(ordDicDeleteTypeId == "01"){
		
		if(dtordgrid == "" || orddicid == ""){
			alert("请正确的选择删除的字典!","info");
			return;
		}
		
		var url = $WEB_ROOT_PATH+"/ordTemplate/deleteOrdDicStandByOrddicId.ajax?orddicid=" + orddicid + "&dtordgrid=" + dtordgrid;
		postReq(url, 
				"", 
				function(data){
				    $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
				    clearOrdDicControlValue();//清空医嘱字典信息控件的值（右中、右下）
				    oldOrdDicGrpUuid = null;
				    oldOrddicid = null;
				    $CommonUI.alert("医嘱字典删除成功!","info");
			    }, 
				function(data){
		        	$CommonUI.alert("医嘱字典删除失败!","error");
		    		return;
		        },  
				{skipHidden:false}
		       );
		
		
	}else if(ordDicDeleteTypeId == "02"){
		var url = $WEB_ROOT_PATH+"/ordTemplate/ordTemplateCtrl.htm?BLHMI=deleteOrdDicStandByUuid&dto.uuid=" + uuid + "&dto.nodeId=" + dtordgrid;
		postReq(url, 
				"", 
				function(data){
			     $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
			     }, 
				function(data){
		        	$CommonUI.alert("医嘱字典明细删除失败!","error");
		    		return;
		        },  
				{skipHidden:false}
		       );
	}
}

// 医嘱字典明细录入
var comboGridClick = function(rowIndex,rowData){
	
    var flag = false;
    var index = $('#ordDicGridList').edatagrid('getRows').length;
    for(var n = 0 ;n < index;n++){
    	if($('#ordDicGridList').edatagrid('getRows')[n].itemid == rowData.itemid){
    		flag = true;
    		break;
    	}
    }
    if(flag){
    	$CommonUI.alert("已录入【" + rowData.itemname + "】项目！" ,"info");
    	return;
    }else{
    	InitEdataGridRowWithComboGrid(rowData);
    }
};

// 请求成功执行的方法
function successHandler(data){
	// 新建增加节点
	if(operatTypeId == "01"){
		treeHandle("02",data);
	}
	
	// 修改节点
	if(operatTypeId == "02"){
		treeHandle("03",data);
	}
	
	// 删除节点
	if(operatTypeId == "03"){
		treeHandle("04",data);
		$CommonUI.getDataGrid('#ordDicList').datagrid("loadData",{"total":"0","rows":[]});
		clearOrdDicControlValue();//清空医嘱字典信息控件的值（右中、右下）
	}
	
	if(operatTypeId == "04"){
		if(data.reslut == "success"){
			 $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
			  clearOrdDicControlValue();//清空医嘱字典信息控件的值（右中、右下）
			  oldOrdDicGrpUuid = null;
			  oldOrddicid = null;
			  $CommonUI.alert("保存成功!","info");
			  
			  var url = $WEB_ROOT_PATH+"/ordTemplate/queryTnOrdList.ajax?nodeId=" + nodeId ;
				postReq(url, 
						"#ordDicList", 
						function(data){
					      $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
				        }, 
						function(data){
				        	$CommonUI.alert("查询当前分类下字典错误！" ,"error");
				    		return;
				        },  
						{skipHidden:false}
				       );
				
		}else{
			$CommonUI.alert("保存失败!","info");
		}
	 
	}
	if(operatTypeId == "04"){
		// nothing to do
	}else{
		//新建医嘱分类dialog窗体关闭按钮事件
		 ordTemplateCateCancel();
	}
   
}

// 请求失败执行的方法
function errorHandler(data){
   if(operatTypeId == "01"){
	   $CommonUI.alert("新建分类失败!","error");
	}
   if(operatTypeId == "02"){
	   $CommonUI.alert("修改医嘱分类失败!","error");
	}
   if(operatTypeId == "03"){
	   $CommonUI.alert("删除医嘱分类失败!","error");
	}
   if(operatTypeId == "04"){
	   $CommonUI.alert("保存医嘱字典失败!","error");  
   }
   //新建医嘱分类dialog窗体关闭按钮事件
   ordTemplateCateCancel();
   return;
}


function unitNamesFormatter(value){
	for(var i=0; i<unitnames.length; i++){
		if (unitnames[i].unitid == value) return unitnames[i].unitname;
	}
	return value;
}

function oldunitNamesFormatter(value){
	for(var i=0; i<oldunitnames.length; i++){
		if (oldunitnames[i].unitid == value) return oldunitnames[i].unitname;
	}
	return value;
}

function oldFreqsFormatter(value){
	for(var i=0; i<oldFreqs.length; i++){
		if (oldFreqs[i].freqid == value) return oldFreqs[i].freqName;
	}
	return value;
}
 
function loadGrid(){
	var lastIndex = undefined;//记录医嘱明细datagrid中最后添加的一条记录的索引（更本质的是最新打开的可编辑行索引）

	//控制表格高度 singleSelect:true, fitColumns:true, fit:true,
	$CommonUI.getDataGrid('#ordDicGridList').datagrid({
			singleSelect:true,
			fitColumns:true,
			fit:true,
		    toolbar:[{
		        text:'添加',
		        iconCls:'chis-add',
		        handler:function(){
		    	   
		    	  //医嘱类型
		    		var ordTypeId = $CommonUI.getComboBox('#ordTypeId').combobox('getValue');
		    		if(ordTypeId == null || ordTypeId == undefined || ordTypeId =='' ){
		    			$CommonUI.alert("请选择医嘱类型！" ,"info");
		    			return;
		    		}
		    		
		    		var ordCateid = $CommonUI.getComboBox('#ordCateid').combobox('getValue');
		    		if(ordCateid == null || ordCateid == undefined || ordCateid =='' ){
		    			$CommonUI.alert("请选择医嘱子类！" ,"info");
		    			return;
		    		}		    		
		    	
		        	//添加第一条记录时，lastIndex为undefined，endEdit对一个索引为undefined的行执行无效
		            $CommonUI.getDataGrid('#ordDicGridList').datagrid('endEdit', lastIndex);
		            $CommonUI.getDataGrid('#ordDicGridList').datagrid('appendRow',{
		            	itemid:'',
		            	itemname:'',
		            	itemspec:'',
		            	freqid:' ',
		                unitQuantity:'',
		                unitName:' ',
		                salesPrice:'',
		                amountTotal:''
		            });
		            lastIndex = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getRows').length-1;
		            $CommonUI.getDataGrid('#ordDicGridList').datagrid('selectRow', lastIndex);
		            $CommonUI.getDataGrid('#ordDicGridList').datagrid('beginEdit', lastIndex);
		             
		            initcomboboxData();
		        }
		    },'-',{
		        text:'删除',
		        iconCls:'chis-wrong',
		        handler:function(){
		            var row = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getSelected');
		            if (row){
		                var index = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getRowIndex', row);
		                $CommonUI.getDataGrid('#ordDicGridList').datagrid('deleteRow', index);
		            }
		        }
		    }
		    ],
		    
		    columns:[[
			            {field:'uuid',width:10,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
				        {field:'rowno',width:40,align:'center',editor:{type:'numberbox'},title:'序号'},
				        {field:'itemid',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
				        {field:'itemname',width:180,align:'center',
						     editor:{
									type:'combogrid',
		                                  options:{
	                                         textField: 'itemname',
	                                         idField: 'itemid',
	                                         align:'center',
											    hasDownArrow:false,
											    url:$WEB_ROOT_PATH+'/ordTemplate/queryOrdDicSubStandLists.ajax?&ordCateid='+ordCateid,
											    onClickRow:combogridClick,
											    method:'get',
											    mode:'remote',
											    pagination: true,
											    mode:'remote',
									            fitColumns:true,
											    panelWidth: 600,
		                                        columns:
		                                        [[
									              {field:'itemid',title:'项目编码',width:100, align:'center',hidden:true},
									              {field:'itemname',title:'项目名称',width:100, align:'center' },
									              {field:'inputstr',title:'助记符',width:40, align:'center',hidden:true },
									              {field:'itemSpec', title:'规格',width:60,align:'center'},
									              {field:'salesPrice',title:'单价',width:40,align:'center'},
									              {field:'basicUnit',title:'基本单位',width:70,align:'center',hidden:true},
									              {field:'dispensUnit',title:'零售单位',width:40,align:'center'},
									              {field:'dispensFacotr', title:'零售单位序数', width:40, align:'center',hidden:true}
									            ]]  
								             }},title:'项目名称'},
							            		  {field:'itemSpec',width:140,align:'center',editor:{type:'validatebox'},title:'项目规格'},
							            		  {field:'freqid',width:100,align:'center',formatter:oldFreqsFormatter,
							                          editor:{
							                              type:'combobox',
							                              options:{
							                              valueField:'freqid',
							                              textField:'freqName',
							                              data:FreqCollection
							                               }
							                              },title:'频次'},
					                               {field:'unitQuantity',width:110,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'总计数量'},
					                               {field:'unitName',width:40,align:'center',
					       							editor:{
					       						        type:'combobox',
					       						        options:{
					       						          valueField: 'text',
					       						          textField: 'text',
					       						          data:unitQuantityCollection
					       						         }
					       						        },title:'单位'},
			    						            {field:'salesPrice',width:130,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'项目单价'},
			    						            {field:'amountTotal',width:130,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'总计金额'},
			    						            {field:'itemnamehidden',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
                                                  {field:'dispensunitname',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'零售单位名称'}
				        ]],
		    
		    onClickRow:function(rowIndex){
		    	//editingIndex用以记录可编辑行索引
		        editingIndex = rowIndex;
		    	if (lastIndex != rowIndex){
		        	$CommonUI.getDataGrid('#ordDicGridList').datagrid('endEdit', lastIndex);
		            $CommonUI.getDataGrid('#ordDicGridList').datagrid('beginEdit', rowIndex);
		            lastIndex = rowIndex;//记录最新打开的可编辑行索引，用以在下次打开其他非最终行时关闭此行
		        }else{
		        	$CommonUI.getDataGrid('#ordDicGridList').datagrid('selectRow',lastIndex);	        	
		            editingIndex = lastIndex;
				}
		    
		    	if(isBinding == false){
		    		
		    		var itemnameEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'itemname'});
			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/ordTemplate/queryOrdDicSubStandLists.ajax?ordCateid=" +  ordCateid});
			    	
			    	isBinding = true;
		    	}
		    		//
	    	    var freqNameEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'freqid'});
			    $(freqNameEdit.target).combobox('loadData',FreqCollection);
			    //
			    //单位初始化
                var unitNameEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'unitName'});			    
			    $(unitNameEdit.target).combobox('loadData',unitQuantityCollection);
			    
			    var itemnameEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'itemname'});
			    var itemnameHiddenEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'itemnamehidden'});
		        $(itemnameEdit.target).combogrid('setValue',$(itemnameHiddenEdit.target).val());
		        
		        //项目规格置灰
		        var itemspecEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'itemSpec'});
			    $(itemspecEdit.target).attr({"disabled":true});
			    //单价置灰
			    var salesPriceEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});
			    $(salesPriceEdit.target).attr({"disabled":true});
			    
			    
			 },
		    
		    onClickCell: function(rowIndex, field, value){
		    	var unitQuantityEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'unitQuantity'}); // 数量
		    	var salesPriceEdit  = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});  // 单价
		    	var amounttotalEdit  = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'amountTotal'});   //总金额
		    	
		    	var unitQuantity = 0.00;
		    	var salesPrice = 0.00;
		    	var amounttotal=0.00;
		    	
		    	
		    	if(unitQuantityEdit != null){
		    		unitQuantity = $(unitQuantityEdit.target).numberbox('getValue');
		    	}
		    	if(salesPriceEdit != null){
		    		salesPrice =  $(salesPriceEdit.target).numberbox('getValue');
		    	}
		    	
		    	
		    	if(field=="unitQuantity"){
		    		 $(unitQuantityEdit.target).numberbox({
		    			 onChange: function(newValue,oldValue){
		    				 if(amounttotalEdit != null){
		    					 
		    					 amounttotal = (newValue*salesPrice).toFixed(2);  //g或片的时候需要转换单位计算
		    					 
			    				 $(amounttotalEdit.target).numberbox('setValue',amounttotal);
			    			 } 
		    			 }
		    		}); 
		    	}
		    },
		    
		    onSelect:function(rowIndex, rowData){
		    	$('#ordDicGridList').datagrid('beginEdit',rowIndex);
		    	var unitNameEdit  = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'unitName'});
		    	var dispensunitEdit = $('#ordDicGridList').datagrid('getEditor', {index:rowIndex,field:'dispensunitname'});
		    	unitnames = [{unitid:'0002',unitname:$(dispensunitEdit.target).val(),selected:true}];
                $(unitNameEdit.target).combobox('loadData',unitnames);
                unitNamesFormatter($(unitNameEdit.target).combobox('getValue'));
		    },
		    
		    onBeforeEdit: function(rowIndex, rowData){
		    	isBinding =  false;
		    },
		    
		    onAfterEdit: function(rowIndex, rowData, changes){
		    	oldunitnames = unitnames;
		     }
		});
	// 初始化频次、用法集合类
	if((FreqCollection.length == 0)){
    	initcomboboxData();
    }
	
	//给页面中点击新建按钮时dialog中的分类名称控件绑定blur事件：分类名称失去焦点时自动生成助记符
	$('#dtordgrname').blur(function(){
		if($('#dtordgrname') !=  undefined && $('#dtordgrname') != null && $('#dtordgrname').val().length > 0){
			$('#inputstr').val(makePy($('#dtordgrname').val()));
		}
	});
	
	//给页面中右侧中间医嘱名称绑定blur事件： 医嘱字典名称失去焦点时生成助记符
	$('#orddicname').blur(function(){
		if($('#orddicname') !=  undefined && $('#orddicname') != null && $('#orddicname').val().length > 0){
		   $('#orddicinputstr').val(makePy($('#orddicname').val()));
		 }
	});
	
	//ordTemplateCateDialog 对话框关闭时调用方法
	$CommonUI.getDialog('#ordTemplateCateDialog').dialog({
		onClose:function(){
			setParameter();
		}
	});
	
	//医嘱类型复选框选择事件
	$CommonUI.getComboBox('#ordTypeId').combobox({
	onSelect: function(){
		//清空右下datagrid
		$CommonUI.getDataGrid('#ordDicGridList').datagrid("loadData",{"total":"0","rows":[]});
		ordTypeId =$CommonUI.getComboBox('#ordTypeId').combobox('getValue');
		
		//(nodeId == null||nodeId == '')首先保证是一个节点;(nodeLeaf == null||nodeLeaf == '' || nodeLeaf =='0')其次在是节点的基础上保证是一个叶子节点
		if((nodeId == null||nodeId == '') || (nodeLeaf == null||nodeLeaf == '' || nodeLeaf =='0')){
			$CommonUI.alert("请正确选择一个节点!","info");
			$CommonUI.getComboBox('#ordTypeId').combobox('setText','');
			$CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
			return;
		}
		if(ordTypeId == "00" || ordTypeId == "01" || ordTypeId == "02"){
			$CommonUI.alert("不能维护西药、中草药、材料医嘱!","info");
			$CommonUI.getComboBox('#ordTypeId').combobox('setText','');
			$CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
		}
		
		//联动取医嘱子类值 
	    $('#ordCateid').combobox({
	    	valueField:'value',
			textField:'description',
		    url:$WEB_ROOT_PATH+'/dict/getDictContentList.ajax?dictName=ordType&grade=2&upid='+ordTypeId,
		    panelHeight:'auto',
		    required:true,
		    editable:true,//不可编辑，只能选择 
		 });
	    
		
	  }
	});
	//医嘱子类型复选框选择事件
	$CommonUI.getComboBox('#ordCateid').combobox({
	onSelect: function(){ 
		ordCateid = $CommonUI.getComboBox('#ordCateid').combobox('getValue'); 		 
	  }
	});
	
	var ordgriListtoolbar=[{
	    text:'添加',
	    iconCls:'chis-add',
	    handler:function(){
	    	alert(1);
	    	//添加第一条记录时，lastIndex为undefined，endEdit对一个索引为undefined的行执行无效
	        $CommonUI.getDataGrid('#ordDicGridList').datagrid('endEdit', lastIndex);
	        alert(2);
	        $CommonUI.getDataGrid('#ordDicGridList').datagrid('appendRow',{
	        	itemid:'',
	        	itemname:'',
	        	itemspec:'',
	        	freqid:' ',
	            unitQuantity:'',
	            unitName:' ',
	            salesPrice:'',
	            amountTotal:''
	        });
	        lastIndex = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getRows').length-1;
	        $CommonUI.getDataGrid('#ordDicGridList').datagrid('selectRow', lastIndex);
	        $CommonUI.getDataGrid('#ordDicGridList').datagrid('beginEdit', lastIndex);
	         alert(3);
	        initcomboboxData();
	    }
	},'-',{
	    text:'删除',
	    iconCls:'chis-wrong',
	    handler:function(){
	        var row = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getSelected');
	        if (row){
	            var index = $CommonUI.getDataGrid('#ordDicGridList').datagrid('getRowIndex', row);
	            $CommonUI.getDataGrid('#ordDicGridList').datagrid('deleteRow', index);
	        }
	    }
	}
	];
	var itemname = $CommonUI.getComboBox('#itemid').combobox('getValue'); 
}
//医嘱明细datagrid（右下）中项目名称combogrid绑定onClickRow事件
var combogridClick = function(rowIndex,rowData){
	var itemidEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'itemid'});
	var itemnameEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'itemname'});
	var itemspecEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'itemSpec'});
	var priceEdit  = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'salesPrice'});
	var itemnameHiddenEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'itemnamehidden'});
	var unitQuantityEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'unitQuantity'});
	var unitNameEdit  = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'unitName'});
	var dispensunitEdit = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'dispensunitname'});
	
	
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	$(itemspecEdit.target).val(rowData.itemSpec);
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(itemnameHiddenEdit.target).val(rowData.itemname);
	$(dispensunitEdit.target).val(rowData.dispensUnit);
	
	//默认总计数量为1 默认算出费用
//	var a = 1.00;
//	var q = a.toFixed(2); 
//	$(unitQuantityEdit.target).val(q);	 
//	var amounttotal = (1.00*rowData.salesPrice).toFixed(2);
//	var amounttotalEdit  = $('#ordDicGridList').datagrid('getEditor', {index:editingIndex,field:'amountTotal'}); 
//	$(amounttotalEdit.target).numberbox('setValue',amounttotal);	 
		 
	unitnames = [{unitid:'0002',unitname:rowData.dispensUnit,selected:true}];
	$(unitNameEdit.target).combobox('loadData',unitnames);
	oldunitnames = unitnames;
};

function initcomboboxData(){
	if( FreqCollection.length == 0 ){
		var freqUrl =$WEB_ROOT_PATH + '/ordTemplate/getFreqList.ajax';
		postReq(freqUrl,null,initFreqDataSuccess, initFreqDataError,  {skipHidden:false});
	}
}
function initFreqDataSuccess(data){
	//FreqCollection =$.toJSON(data['rows']);
	FreqCollection = data.rows;
	freqs = data.rows;
	oldFreqs = data.rows;
}
function initFreqDataError(data){
	// nothing to do
}
