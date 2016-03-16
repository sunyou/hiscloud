var nodeParent = null;
var nodeSelected = null;
var nodeUpId = null;
var nodeId = null;
var nodeText = null;
var nodeGrade = null;
var nodeLeaf = null;
var nodeOrdgrdes = null;
var nodeGrpFlag = null;
var nodePrivtypeid  = null;
var attributes =null;
var operatTypeId = null;
var ordTypeId = null;

//医嘱字典的数据
var oldOrdDicGrpUuid = null;
var oldOrddicid = null;


//datagrid 的编辑功能
var editingIndex = -1;
var units = [];
var oldunits = [];

var FreqCollection = [];
var UsageCollection = [];
var freqquantityUnitCollection=[
                    	        {id:'00',text:'天',selected:true},
                    		    {id:'00',text:'周'}
                    	      ];
var unitidUnitCollection=[
                    	        {id:'000',text:'g',selected:true},
                    		    {id:'001',text:'片'}
                    	      ];
var unitQuantityCollection=[
              	        {id:'000',text:'g',selected:true},
              		    {id:'001',text:'片'}
              	      ];

var freqs = [];
var oldFreqs = [];

var usages = [];
var oldUsages = [];

var dispensunits = [];
var oldDispensunits = [];

var isBinding =  false;


var itemidFlag = true;//判断项目名称是否合法
var perQuantityFlag = true;//判断单次剂量是否合法
var unitidFlag = true;//判断单次剂量单位是否合法
var freqNameFlag = true;//判断频次是否合法
var usagenameFlag = true;//判断用法是否合法
var freqquantityFlag = true;//判断疗程是否合法

//删除操作时保存删除字典uuid
var deleteUuid;

$(function() {
	var options_pat = { toolbar: "#toolbarRight", height: 240, width: '100%', border: true, singleSelect: true, pagination: false, rownumbers: false,
						fitColumns: true,
	};
	var sortOpts_pat ={ remoteSort: false, sortName: '', sortOrder: 'asc' };
	var queryParams_pat = { page: 1, rows: 10 };
	var columns_pat =[[
	               {title: "唯一编码",filed:"uuid",hidden:true},  
	               {title: "医嘱类型",field: "ordTypeid",hidden:true},
	               {title: "医嘱分类",field: "ordCateid",hidden:true},
	               {title: "是否停用",field: "isstop",hidden:true},
	               {title: "字典分类",field:"dtordgrid",hidden:true},    
	               {title: "字典编码",field: "orddicid",hidden:true},
	               {title: "字典名称助记符",field:"inputstr",hidden:true},
	               {title: "是否默认显示",field:"isdisplay",hidden:true},
	               {title: "频次",field: "freqid",hidden:true},
	               {title: "用法",field: "itemUsageid",hidden:true},
	               {title: "付数",field: "timesQuantity",hidden:true},
	               {title: "名称",field: "orddicname",width: 80,align:'center'},
	               {title: "描述",field: "orddicnote",width:100,align:'center'},
	               {title: "总金额",field: "amountTotal",width: 60,align:'center'},
	               {field:'action',title:'操作',width:100,align:'center',formatter: function(value,row,index){
	   	        	var e = '<a href="#" onclick="ordDicUpdate(\''+row.uuid+'\','+row.ordTypeid+',\''+row.ordCateid+'\','+row.isstop+',\'' + row.dtordgrid + '\',\'' + row.orddicid + '\',\'' + row.orddicname + '\',\'' + row.orddicnote + '\',\'' + row.inputstr + '\',\'' + row.freqid + '\',\'' + row.itemUsageid + '\',\'' + row.timesQuantity + '\',\'' + row.isdisplay + '\')" style="margin:0 5px">修改</a><a href="#" onclick="ordDicDelete(\'01\',\''+row.dtordgrid+'\',\''+row.orddicid+'\')"  style="margin:0 5px">删除</a>';
	   	        	return e; 
	   	        }}
	              ]];
	
	var url_pat = $WEB_ROOT_PATH+"/clinicTemplate/queryTnOrdListClinic.ajax?nodeId=00";
	
	$CommonUI.datagrid('#ordDicList', url_pat, queryParams_pat, columns_pat, sortOpts_pat, options_pat);
	
	// ordDicList 添加行选中事件
	$CommonUI.getDataGrid('#ordDicList').datagrid({
		onSelect: function(rowIndex,rowData){
		ordDicUpdate(rowData.uuid,rowData.ordTypeid,rowData.ordCateid,rowData.isstop,rowData.dtordgrid ,rowData.orddicid ,rowData.orddicname,rowData.orddicnote,rowData.inputstr,rowData.freqid,rowData.itemUsageid,rowData.timesQuantity,rowData.isdisplay);
		}
	});
	
	loadGrid();
	
	loadGrid2();
	
	// 页面初始化时初始化树
	treeHandle("01");
	
	// 初始化频次、用法集合类
	if((FreqCollection.length == 0) || (UsageCollection == 0) ){
    	initcomboboxData();
    }
	
	// 填写分类名称失去焦点是生成助记符
	$('#dtordgrname').blur(function(){
		if($('#dtordgrname') !=  undefined && $('#dtordgrname') != null && $('#dtordgrname').val().length > 0){
		   $('#inputstr').val(makePy($('#dtordgrname').val()));
		 }
	});
	
	// 医嘱字典名称失去焦点时生成助记符
	$('#orddicname').blur(function(){
		if($('#orddicname') !=  undefined && $('#orddicname') != null && $('#orddicname').val().length > 0){
		   $('#orddicinputstr').val(makePy($('#orddicname').val()));
		 }
	});
	
	//ordTemplateCateDialog 对话框关闭时调用方法
	$CommonUI.getDialog('#ordTemplateCateDialog').dialog({
	 onClose:function(){setParameter();}
	});
	
	$("#Wmedicine").show();
	$("#Cmedicine").hide(); 
	
	//医嘱类型复选框选择事件
	$CommonUI.getComboBox('#ordTypeId').combobox({
	onSelect: function(){
		$CommonUI.getDataGrid('#detailTable').datagrid("loadData",{"total":"0","rows":[]});
		
		$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
		
		ordTypeId =$CommonUI.getComboBox('#ordTypeId').combobox('getValue');
		isBinding = false;
		if((nodeId == null||nodeId == '') || (nodeLeaf == null||nodeLeaf == '' || nodeLeaf =='0')){
			$CommonUI.alert("请正确选择一个节点!","info");
			$CommonUI.getComboBox('#ordTypeId').combobox('setText','');
			$CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
			return;
		}
		
		
		if(ordTypeId == "00" || ordTypeId == "01" || ordTypeId == "02" ){
		  if(ordTypeId == "01"){			  
			   
			   $("#Cmedicine").show();
			   
			   $("#chinaMedicineGrid").datagrid("resize");
			   
			   $("#Wmedicine").hide(); 
		   }else{
			   
			   $("#Wmedicine").show();
			   
			   $("#detailTable").datagrid("resize");
			   
			   $("#Cmedicine").hide(); 
		   }
	   }else{
		   
			//$("#tabsOrder").tabs('select',1);
			
			//$CommonUI.alert("请选择机构医嘱字典导入!","info");
		   
		   $CommonUI.alert("不能维护非西药、中草药、材料医嘱!","info");
			$CommonUI.getComboBox('#ordTypeId').combobox('setText','');
			$CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
	   }
      }
	});
	
	// tab标签的选择
	/*$CommonUI.getTabs('#tabsOrder').tabs({
		onSelect:function(title,index){
			if(index == 0){
				  $("#ordSysTemplateCateTree").hide(); 
				  $("#ordTemplateCate").height(512);
			}else{
				 ordSYSTemplateCateTreeInit();
				 $("#ordSysTemplateCateTree").show(); 
				 $("#ordTemplateCate").height(175);
			}
		}
	});*/
	
});

//机构医嘱字典树的初始化
/*function ordSYSTemplateCateTreeInit(){
	//树的展示
	var strUrl = $WEB_ROOT_PATH + '/clinicTemplate/queryChildrenNodes.ajax?isSYSclinicOrdDicGrp=' + true;
	 $CommonUI.getTree('#ordSysTemplateCateTree').tree({
			url: strUrl,
			lines: true,
			onClick : function(node) {
				if(node !=  undefined || node != null){
					// nothing to do
				}
			}
		});
};*/

// 新建医嘱模板分类
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
		$('#upid').val(nodeId);
		$('#grade').val(nodeGrade + 1);
		$('#grpflag').val(nodeGrpFlag);
		$('#privtypeid').val(nodePrivtypeid);
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
		$('#upname').val("");
	}
	    $('#dtordgrid').val(nodeId);
		$('#dtordgrname').val(nodeText);
		$('#inputstr').val(makePy(nodeText));
		$('#upid').val(nodeUpId);
		$('#grade').val(nodeGrade);
		$('#grpflag').val(nodeGrpFlag);
		$('#privtypeid').val(nodePrivtypeid);
		
		 $CommonUI.getComboBox('#leaf').combobox({disabled:true});
		 
		if(nodeLeaf == 0){
			$CommonUI.getComboBox('#leaf').combobox('select', '0');
		}else{
		    $CommonUI.getComboBox('#leaf').combobox('select', '1');
		}
		
		if(nodeGrpFlag == 0){
			$CommonUI.getComboBox('#grpflag').combobox('select', '0');
		}else{
			$CommonUI.getComboBox('#grpflag').combobox('select', '1');
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
	
	// 根节点不让删除,即: upid为null
	
	if(nodeUpId ==  undefined || nodeUpId == null || nodeUpId == "" ){
		
		$CommonUI.alert("根节点不允许删除!","info");
		
		return;
		
	}else{
		$CommonUI.confirm("确定删除此分类、以及该分类底下子节点吗？",'question','确  定',confirm,'取 消',cancel,false);
	}
	
}

// 确定删除
function confirm(){
	if( nodeSelected ==  undefined || nodeSelected == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	var url =$WEB_ROOT_PATH+'/clinicTemplate/deleteKnOrdGrpNodesClinic.ajax?nodeId=' + nodeId;
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
		var url =$WEB_ROOT_PATH+'/clinicTemplate/addKnOrdGrpNodesClinic.ajax';
		postReq(url, "#ordTemplateCateDialog", successHandler, errorHandler,  {skipHidden:false});
		
	}else if(operatTypeId == "02"){
		if($('#dtordgrid').val() == null || $('#dtordgrid').val().length == 0 ){
			$CommonUI.alert("请正确选择一个节点!","info");
			return;
		}
		
		var url =$WEB_ROOT_PATH+'/clinicTemplate/updateKnOrdGrpNodesClinic.ajax';
		postReq(url, "#ordTemplateCateDialog", successHandler, errorHandler,  {skipHidden:false});
	}
}

// 医嘱分类窗体关闭按钮事件
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
	var strUrl = $WEB_ROOT_PATH + '/clinicTemplate/getOrdTreeClinic.ajax';
	if(handleType=="01"){
		$CommonUI.getTree('#ordTemplateCateTree').tree({
			url: strUrl,
			lines: true,
			onClick : function(node) {
				if(node !=  undefined || node != null){
				    nodeParent = $CommonUI.getTree('#ordTemplateCateTree').tree('getParent', node.target);
					nodeSelected = node;
					nodeId = node.id;
					nodeText = node.text;
					nodeGrade = node.attributes["grade"];
					nodeLeaf =  node.attributes["leaf"];
					nodeUpId =  node.attributes["upid"];
					nodeOrdgrdes = node.attributes["ordgrdes"];
					nodeGrpFlag = node.attributes["grpflag"];
					nodePrivtypeid = node.attributes["privtypeid"];
					//加载当前分类中的字典
					$CommonUI.getDataGrid('#ordDicList').datagrid("loadData",{"total":"0","rows":[]});
					
					if(nodeLeaf != undefined && nodeLeaf != null && nodeLeaf == "1" ){
						var url = $WEB_ROOT_PATH+"/clinicTemplate/queryTnOrdListClinic.ajax?nodeId=" + nodeId ;
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
					
					clearOrdDicControlValue();
					
					$CommonUI.getDataGrid('#detailTable').datagrid("loadData",{"total":"0","rows":[]});
					
					$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
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
	 nodeGrpFlag = null;
	
}

// 清空树节点控件的值
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

//清空医嘱字典信息控件的值
function clearOrdDicControlValue(){
	  //$CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
	  //$CommonUI.getDataGrid('#ordDicGridList').edatagrid("loadData",{"total":"0","rows":[]});
	  $CommonUI.getComboBox('#ordTypeId').combobox('setText','');
	  $CommonUI.getComboBox('#ordTypeId').combobox('setValue','');
	  $('#orddicname').val('');
	  $CommonUI.getComboBox('#ordCateid').combobox('setText','');
	  $CommonUI.getComboBox('#ordCateid').combobox('setValue','');
	  $('#orddicinputstr').val('');
	  $CommonUI.getComboBox('#isstop').combobox('select', '0');
	  $('#notedes').val('');
	  
	  //中草药界面
	  $CommonUI.getComboBox('#cMedTQ').combobox('setText','');
	  $CommonUI.getComboBox('#cMedTQ').combobox('setValue','');
	  
	  $CommonUI.getComboBox('#cMedUsagename').combobox('setText','');
	  $CommonUI.getComboBox('#cMedUsagename').combobox('setValue','');
	  
	  $CommonUI.getComboBox('#cMedFrequency').combobox('setText','');
	  $CommonUI.getComboBox('#cMedFrequency').combobox('setValue','');
}

// 医嘱字典查询
function ordDicquery(){
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	var ordDicNameQueryInputStr = $('#ordDicNameQueryInputStr').val();
	if(ordDicNameQueryInputStr == '' || ordDicNameQueryInputStr ==  undefined || ordDicNameQueryInputStr == null){
		$CommonUI.alert("请输入查询条件!","info");
		return;
	}
	var url = $WEB_ROOT_PATH+"/clinicTemplate/clinicTemplateCtrl.htm?BLHMI=queryOrdClinicDicList";
	$CommonUI.getDataGrid('#ordDicList').datagrid({
		url:url,
		queryParams:{
			"dto.nodeId":nodeId,
			"dto.ordDicNameQueryInputStr":ordDicNameQueryInputStr
		}
	});
}

//医嘱字典保存
function ordDicSave(){
	
	if(nodeId == '' || nodeId ==  undefined || nodeId == null){
		$CommonUI.alert("请正确选择一个节点!","info");
		return;
	}
	
	var ordTypeId = $CommonUI.getComboBox('#ordTypeId').combobox('getValue');
	if(ordTypeId == null || ordTypeId == undefined || ordTypeId =='' ){
		$CommonUI.alert("请选择医嘱类型！！" ,"info");
		return;
	}
	
	
	if($('#orddicname') == null || $('#orddicname') == undefined || $('#orddicname').val().length == 0){
		$CommonUI.alert("请录入医嘱字典名称！" ,"info");
		return;
	} 
	
	operatTypeId = "04";
	
	var url  = $WEB_ROOT_PATH+'/clinicTemplate/saveOrdDicClinic.ajax';
	
	
	var dtordgrid = nodeId;
	
	var privattypeid = nodePrivtypeid;
	
	var orddicName = $('#orddicname').val();
	
	var ordDicInputStr = $('#orddicinputstr').val();
	
	var ordDicNote = $('#notedes').val();
	
	var isdisplay =  $CommonUI.getComboBox('#isdisplay').combobox('getValue');
	
	//var ordCateid = $CommonUI.getComboBox('#ordCateid').combobox('getValue');
	
	var isstop = $CommonUI.getComboBox('#isstop').combobox('getValue');
	
	
	var ordDicSubs = null;
	
	var data = null;
	var StrInspect = null;
	var StrInspect1 = null;
	var StrInspect2 = null;
	var StrInspect3 = null;
	var StrInspect4 = null;
	
   if(ordTypeId == "01"){
	   //中草药医嘱
	   $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('acceptChanges');
	   
		ordDicSubs =$('#chinaMedicineGrid').datagrid('getData');
		
		//data = getArrayFromdateGrid(ordDicSubs); 
		var rowsInspect=ordDicSubs.rows;
		var FieldsInspect1 = new Array();
		var FieldsInspect2 = new Array();
		var FieldsInspect3 = new Array();
		var FieldsInspect4 = new Array();
		for(var i=0; i<rowsInspect.length; i++)
		{
			var Field1 = new Object();
			var Field2 = new Object();
			var Field3 = new Object();
			var Field4 = new Object();
			
			Field1.uuid = rowsInspect[i].uuidone;
			Field1.rowno = rowsInspect[i].rownoone;
			Field1.itemid = rowsInspect[i].itemidone;
			Field1.itemname = rowsInspect[i].itemnameone;
			Field1.quantity = rowsInspect[i].quantityone;
			Field1.salesPrice = rowsInspect[i].salespriceone;
			Field1.dispensFacotr = rowsInspect[i].dispensfacotrone;
			
			
			Field2.uuid = rowsInspect[i].uuidtwo;
			Field2.rowno = rowsInspect[i].rownotwo;
			Field2.itemid = rowsInspect[i].itemidtwo;
			Field2.itemname = rowsInspect[i].itemnametwo;
			Field2.quantity = rowsInspect[i].itemnametwo;
			Field2.salesPrice = rowsInspect[i].salespricetwo;
			Field2.dispensFacotr = rowsInspect[i].dispensfacotrtwo;
			
			Field3.uuid = rowsInspect[i].uuidthree;
			Field3.rowno = rowsInspect[i].rownothree;
			Field3.itemid = rowsInspect[i].itemidthree;
			Field3.itemname = rowsInspect[i].itemnamethree;
			Field3.quantity = rowsInspect[i].quantitythree;
			Field3.salesPrice = rowsInspect[i].salespricethree;
			Field3.dispensFacotr = rowsInspect[i].dispensfacotrthree;
			
			Field4.itemid = rowsInspect[i].uuidfour;
			Field4.rowno = rowsInspect[i].rownofour;
			Field4.itemid = rowsInspect[i].itemidfour;
			Field4.itemname = rowsInspect[i].itemnamefour;
			Field4.quantity = rowsInspect[i].quantityfour;
			Field4.salesPrice = rowsInspect[i].salespricefour;
			Field4.dispensFacotr = rowsInspect[i].dispensfacotrfour;			 
			
			FieldsInspect1[i] = Field1;
			FieldsInspect2[i] = Field2;
			FieldsInspect3[i] = Field3;
			FieldsInspect4[i] = Field4;
		}
		StrInspect1 = $.toJSON(FieldsInspect1);
		StrInspect2 = $.toJSON(FieldsInspect2);
		StrInspect3 = $.toJSON(FieldsInspect3);
		StrInspect4 = $.toJSON(FieldsInspect4);
		
	}else{
		//西医医嘱或材料医嘱
		$CommonUI.getDataGrid('#detailTable').datagrid('acceptChanges');
		
		ordDicSubs =$('#detailTable').datagrid('getData');
		//data = getArrayFromEdateGrid(ordDicSubs); 
		var rowsInspect=ordDicSubs.rows;
		var FieldsInspect = new Array();
		for(var i=0; i<rowsInspect.length; i++)
		{
			var Field = new Object();
			Field.ordItemid = rowsInspect[i].ordItemid; //项目ID
			Field.itemid = rowsInspect[i].itemid; //项目ID
			Field.itemname = rowsInspect[i].itemname; //项目名称
			Field.itemSpec = rowsInspect[i].itemSpec; //规格
			Field.freqid = rowsInspect[i].freqid;//频次  
			Field.quantity = rowsInspect[i].quantity;//总计数量
			Field.unitQuantity = rowsInspect[i].unitQuantity; //包装单位数量
			Field.unitName = rowsInspect[i].unitName; 
 			Field.freqQuantity = rowsInspect[i].freqQuantity;
			Field.salesPrice = rowsInspect[i].salesPrice;//零售价		
			Field.amountTotal = rowsInspect[i].amountTotal;//金额
			Field.uuid = rowsInspect[i].uuid;
			Field.rowno = rowsInspect[i].rowno; 
			Field.dispensunitname = rowsInspect[i].dispensunitname; 
			Field.medunitName = rowsInspect[i].medunitname; //单次计量单位名称
			Field.permedQuantity = rowsInspect[i].permedQuantity; //单次计量
			Field.factor = rowsInspect[i].medfactor;
			Field.usageid = rowsInspect[i].usageid;//用法编码
			Field.usagename = rowsInspect[i].usagename;//用法编码
			Field.usagename = rowsInspect[i].usagename;//用法名称
			Field.freqUnit = rowsInspect[i].freqUnit;//疗程单位
			Field.freqQuantity = rowsInspect[i].freqQuantity;//疗程数
			
			 
			FieldsInspect[i] = Field;
		}
		StrInspect = $.toJSON(FieldsInspect);
 
	}

    if (ordDicSubs.rows.length < 1){
	    $CommonUI.alert("请添加医嘱字典明细項目！" ,"info");
	    return;
    }
    
    if (!itemidFlag){
    	$CommonUI.alert("请正确选择医嘱项目名称！" ,"info");
    	setFlag();
 	    return;
    }
    if (!perQuantityFlag){
    	$CommonUI.alert("请输入医嘱单次剂量！" ,"info");
    	setFlag();
 	    return;
    }
    if (!unitidFlag){
    	$CommonUI.alert("请选择医嘱单次剂量单位！" ,"info");
    	setFlag();
 	    return;
    }
    if(!freqNameFlag){
    	$CommonUI.alert("请选择医嘱频次！" ,"info");
    	setFlag();
 	    return;
    }
    if (!usagenameFlag){
    	$CommonUI.alert("请选择医嘱用法！" ,"info");
    	setFlag();
 	    return;
    }
    if(!freqquantityFlag){
    	$CommonUI.alert("请选择医嘱疗程！" ,"info");
    	setFlag();
 	    return;
    }
	
//	data["dto.nodeId"] = dtordgrid;
//	data["dto.privtypeid"] = privattypeid;
//	data["dto.ordTypeId"] = ordTypeId;
//	data["dto.orddicName"] = orddicName;
//	data["dto.ordDicNameInputStr"] = ordDicInputStr;
//	data["dto.ordDicNote"] = ordDicNote;
//	//data["dto.ordCateid"] = ordCateid;
//	data["dto.isstop"] = isstop;
//	
//	data["dto.oldOrdDicGrpUuid"] = oldOrdDicGrpUuid;
//	data["dto.oldOrddicid"] = oldOrddicid;
//	
//	data["dto.isdisplay"] = isdisplay;
//	
//	data["dto.deleteUuid"] = $('#deleteUuid').val();    

	if(ordTypeId == "01"){
		var timesquantity = $CommonUI.getComboBox('#cMedTQ').combobox('getValue');
		var usagename = $CommonUI.getComboBox('#cMedUsagename').combobox('getValue');
		var frequency = $CommonUI.getComboBox('#cMedFrequency').combobox('getValue');		
		postReq(url,
				'',
				successHandler,
				errorHandler,
				{skipHidden:false},
				{
					"dtordgrid": dtordgrid,  
					"privtypeid": '999',   
					"ordTypeId": ordTypeId, //医嘱类型  
					"orddicName": orddicName, 
					"ordDicNameInputStr" : ordDicInputStr,
					"ordDicNote" : ordDicNote,					
					"isstop" : isstop,					
					"oldOrdDicGrpUuid" : oldOrdDicGrpUuid,
					"oldOrddicid" : oldOrddicid,
					"isdisplay" : isdisplay,
					"deleteUuid" : $('#deleteUuid').val(),
					"timesquantity": timesquantity,
				    "usagename" : usagename,
				    "frequency" : frequency,
				    "ordItemString1":StrInspect1, //明细项1json
				    "ordItemString2":StrInspect2, //明细项2json
				    "ordItemString3":StrInspect3, //明细项3json
				    "ordItemString4":StrInspect4, //明细项4json
				}
		);
	}else{
		postReq(url,
				'',
				successHandler,
				errorHandler,
				{skipHidden:false},
				{					 
					"dtordgrid": dtordgrid,  
					"privtypeid": '999',   
					"ordTypeId": ordTypeId, //医嘱类型  
					"orddicName": orddicName, 
					"ordDicNameInputStr" : ordDicInputStr,
					"ordDicNote" : ordDicNote,					
					"isstop" : isstop,					
					"oldOrdDicGrpUuid" : oldOrdDicGrpUuid,
					"oldOrddicid" : oldOrddicid,
					"isdisplay" : isdisplay,
					"deleteUuid" : $('#deleteUuid').val(), 
					"ordItemString":StrInspect //明细项json
				}
	    );
	}
}

//重置flag字段初始值
function setFlag(){
	itemidFlag = true;
	perQuantityFlag = true;
	unitidFlag = true;
	freqNameFlag = true;
	usagenameFlag = true;
	freqquantityFlag = true;
}

//将中草药datagrid的数据转换为后台格式字符串
var getArrayFromdateGrid = function(jsonObject){
	var data = new Array();
	if(jsonObject != null && jsonObject != undefined && jsonObject.rows != 0 ){
		var rows = jsonObject.rows;
		for(var n= 0 ; n < rows.length; n++){
			
			var m = 2*n;
			
			// one 
			var key1 = "dto.herbaldates[" + m + "].uuid";
			var value1=rows[n].uuidone;
			data[key1] = value1;
			
			var key2 = "dto.herbaldates[" + m + "].rowno";
			var value2=rows[n].rownoone;
			data[key2] = value2;
			
			var key3 = "dto.herbaldates[" + m + "].itemid";
			var value3=rows[n].itemidone;
			data[key3] = value3;
			
			var key4 = "dto.herbaldates[" + m + "].itemname";
			var value4=rows[n].itemnameone;
			data[key4] = value4;
			
			var key5 = "dto.herbaldates[" + m + "].quantity";
			var value5=rows[n].quantityone;
			data[key5] = value5;
			
			
			// two
			var key6 = "dto.herbaldates[" + (m+1) + "].uuid";
			var value6=rows[n].uuidtwo;
			data[key6] = value6;
			
			var key7 = "dto.herbaldates[" + (m+1) + "].rowno";
			var value7=rows[n].rownotwo;
			data[key7] = value7;
			
			var key8 = "dto.herbaldates[" + (m+1) + "].itemid";
			var value8=rows[n].itemidtwo;
			data[key8] = value8;
			
			var key9 = "dto.herbaldates[" + (m+1) + "].itemname";
			var value9=rows[n].itemnametwo;
			data[key9] = value9;
			
			var key10 = "dto.herbaldates[" + (m+1) + "].quantity";
			var value10=rows[n].quantitytwo;
			data[key10] = value10;
			
			
			// three
			var key11 = "dto.herbaldates[" + (m+2) + "].uuid";
			var value11=rows[n].uuidthree;
			data[key11] = value11;
			
			var key12 = "dto.herbaldates[" + (m+2) + "].rowno";
			var value12=rows[n].rownothree;
			data[key12] = value12;
			
			var key13 = "dto.herbaldates[" + (m+2) + "].itemid";
			var value13=rows[n].itemidthree;
			data[key13] = value13;
			
			var key14 = "dto.herbaldates[" + (m+2) + "].itemname";
			var value14=rows[n].itemnamethree;
			data[key14] = value14;
			
			var key15 = "dto.herbaldates[" + (m+2) + "].quantity";
			var value15=rows[n].quantitythree;
			data[key15] = value15;
			
			
			
			// four
			
			var key16 = "dto.herbaldates[" + (m+3) + "].uuid";
			var value16=rows[n].uuidfour;
			data[key16] = value16;
			
			var key17 = "dto.herbaldates[" + (m+3) + "].rowno";
			var value17=rows[n].rownofour;
			data[key17] = value17;
			
			var key18 = "dto.herbaldates[" + (m+3) + "].itemid";
			var value18=rows[n].itemidfour;
			data[key18] = value18;
			
			var key19 = "dto.herbaldates[" + (m+3) + "].itemname";
			var value19=rows[n].itemnamefour;
			data[key19] = value19;
			
			var key20 = "dto.herbaldates[" + (m+3) + "].quantity";
			var value20=rows[n].quantityfour;
			data[key20] = value20;
			
			var key21 = "dto.herbaldates[" + m + "].salesprice";
			var value21=rows[n].salespriceone;
			data[key21] = value21;
			
			var key22 = "dto.herbaldates[" + (m+1) + "].salesprice";
			var value22=rows[n].salespricetwo;
			data[key22] = value22;
			
			var key23 = "dto.herbaldates[" + (m+2) + "].salesprice";
			var value23=rows[n].salespricethree;
			data[key23] = value23;
			
			var key24 = "dto.herbaldates[" + (m+3) + "].salesprice";
			var value24=rows[n].salespricefour;
			data[key24] = value24;
			
			var key25 = "dto.herbaldates[" + m + "].dispensfacotr";
			var value25=rows[n].dispensfacotrone;
			data[key25] = value25;
			
			var key26 = "dto.herbaldates[" + (m+1) + "].dispensfacotr";
			var value26=rows[n].dispensfacotrtwo;
			data[key26] = value26;
			
			var key27 = "dto.herbaldates[" + (m+2) + "].dispensfacotr";
			var value27=rows[n].dispensfacotrthree;
			data[key27] = value27;
			
			var key28 = "dto.herbaldates[" + (m+3) + "].dispensfacotr";
			var value28=rows[n].dispensfacotrfour;
			data[key28] = value28;
			
		}
		
		return data;
	}
};
//将西药dategrid中的数据转换为后台格式字符串
var getArrayFromEdateGrid = function(jsonObject){
	var data = new Array();
	if(jsonObject != null && jsonObject != undefined && jsonObject.rows != 0 ){
		var rows = jsonObject.rows;
		
		for(var n = 0 ; n < rows.length; n++){
			var key1 = "dto.dates[" + n + "].ordGroupno";
			var value1=rows[n].ordGroupno;
			data[key1] = value1;
			
			//项目名称
			var key2 = "dto.dates[" + n + "].itemid";
			var value2=rows[n].itemid;
			if(value2 == ""){
				itemidFlag = false;//判断项目名称是否合法
			}
			data[key2] = value2;
			
			var key3 = "dto.dates[" + n + "].itemname";
			var value3=rows[n].itemname;
			data[key3] = value3;
			
			var key4 = "dto.dates[" + n + "].itemspec";
			var value4=rows[n].itemspec;
			data[key4] = value4;
			
			var key5 = "dto.dates[" + n + "].salesPrice";
			var value5=rows[n].salesPrice;
			data[key5] = value5;
			
			//单次剂量
			var key6 = "dto.dates[" + n + "].perQuantity";
			var value6=rows[n].perQuantity;
			if (value6 == "" || value6 == undefined || value6 == null){//判断项目名称是否合法
				perQuantityFlag = false;
			}
			data[key6] = value6;
			
			//单次剂量单位
			var key7 = "dto.dates[" + n + "].unitid";
			var value7=rows[n].unitid;
			if (value7 == " " || value7 == "" || value7 == undefined || value7 == null){//判断项目名称是否合法
				unitidFlag = false;
			}
			data[key7] = value7;
			
			//频次
			var key8 = "dto.dates[" + n + "].freqName";
			var value8=rows[n].freqName;
			if (value8 == " " || value8 == "" || value8 == undefined || value8 == null){
				freqNameFlag = false;
			}
			data[key8] = value8;
			
			//用法
			var key9 = "dto.dates[" + n + "].usagename";
			var value9=rows[n].usagename;
			if (value9 == " " || value9 == "" || value9 == undefined || value9 == null){
				usagenameFlag = false;
			}
			data[key9] = value9;
			
			//疗程
			var key10 = "dto.dates[" + n + "].freqquantity";
			var value10=rows[n].freqquantity;
			if(value10 == " " || value10 == "" || value10 == undefined || value10 == null){
				freqquantityFlag = false;
			}
			data[key10] = value10;
			
			var key11 = "dto.dates[" + n + "].freqquantityunit";
			var value11=rows[n].freqquantityunit;
			data[key11] = value11;
			
			var key12 = "dto.dates[" + n + "].quantity";
			var value12=rows[n].quantity;
			data[key12] = value12;
			
			var key13 = "dto.dates[" + n + "].quantityunit";
			var value13=rows[n].quantityunit;
			data[key13] = value13;
			
			var key14 = "dto.dates[" + n + "].amounttotal";
			var value14=rows[n].amounttotal;
			data[key14] = value14;
			
			var key15 = "dto.dates[" + n + "].medunitname";
			var value15=rows[n].medunitname;
			data[key15] = value15;
			
			var key16 = "dto.dates[" + n + "].basicunitname";
			var value16=rows[n].basicunitname;
			data[key16] = value16;
			
			var key17 = "dto.dates[" + n + "].dispensunitname";
			var value17=rows[n].dispensunitname;
			data[key17] = value17;
			
			var key18 = "dto.dates[" + n + "].itemnamehidden";
			var value18=rows[n].itemnamehidden;
			data[key18] = value18;
			
			var key19 = "dto.dates[" + n + "].medfactor";
			var value19=rows[n].medfactor;
			data[key19] = value19;
			
			var key20 = "dto.dates[" + n + "].dispensfacotr";
			var value20=rows[n].dispensfacotr;
			data[key20] = value20;
			
			/*var key21 = "dto.dates[" + n + "].uuid";
			var value21=rows[n].uuid;
			data[key21] = value21;*/
		}
	}
	return data;
}; 
// 医嘱字典修改
function ordDicUpdate(uuid,ordTypeid,ordCateid,isstop,dtordgrid,orddicid,orddicname,orddicnote,inputstr,frequency,usagename,timesquantity,isdisplay){
	
	// 医嘱字典组子表uuid
	oldOrdDicGrpUuid = uuid;
	
	//医嘱字典编码
	oldOrddicid = orddicid;
	
	//填充医嘱类型的值
	$CommonUI.getComboBox('#ordTypeId').combobox('setValue',ordTypeid);
	ordTypeId = ordTypeid;
	
	//填充是否停用
	$CommonUI.getComboBox('#isstop').combobox('setValue',isstop);
	
	//默认显示
	$CommonUI.getComboBox('#isdisplay').combobox('setValue',isdisplay);
	
	//填充医嘱名称
	$('#orddicname').val(orddicname);
	
	//填充医嘱名称助记符
	$('#orddicinputstr').val(inputstr);
	
	//填充医嘱备注
	$('#notedes').val(orddicnote);
	
	// 频次
	$CommonUI.getComboBox('#cMedFrequency').combobox('setValue',frequency);
	//用法
	$CommonUI.getComboBox('#cMedUsagename').combobox('setValue',usagename);
	//付数
	$CommonUI.getComboBox('#cMedTQ').combobox('setValue',timesquantity);
	
	 if(ordTypeid == "01"){
		   $("#Cmedicine").show();
		   
		   $("#chinaMedicineGrid").datagrid("resize");
		   
		   $("#Wmedicine").hide(); 
	   }else{
		   
		   $("#Wmedicine").show();
		   
		   $("#detailTable").datagrid("resize");
		   
		   $("#Cmedicine").hide(); 
	   }
	
	var url = $WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicItemListClinic.ajax?orddicid=" + orddicid + "&ordTypeId=" + ordTypeid;
	postReq(url, 
			"", 
			function(data){
		      if(ordTypeid == "01"){
		    	  $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid("loadData",data);
		      }else{
		    	  fillDetailTable(data);  
		      }
		     
	        }, 
			function(data){
	        	$CommonUI.alert("医嘱字典修改失败!","error");
	    		return;
	        },  
			{skipHidden:false}
	       );
	
}

// 填充 医嘱字典明细数据(id = 'DetailTable' datagrid)
function fillDetailTable(data){

	initcomboboxData(); //初始频次、用法
    
    units = [];
    /*FreqCollection = [
                       {"id":1,"freqDeg":1,"freqName":"每日一次","freqNote":"每日一次","freqTimeAct":"12:00","freqUnit":"天","freqcn":1,"freqid":"0001","intervalDays":0},
                       {"id":2,"freqDeg":2,"freqName":"每日两次","freqNote":"每日两次","freqTimeAct":"8:00;16:00","freqUnit":"天","freqcn":1,"freqid":"0002","intervalDays":0}
                     ];*/
    oldFreqs = FreqCollection;
    
   /* UsageCollection =[
                       {"id":270,"description":"口服","grade":1,"inputstr":"kf","leaflag":0,"stopflag":0,"type":"usagename","value":"00"},
                       {"id":271,"description":"注射","grade":1,"inputstr":"zs","leaflag":0,"stopflag":0,"type":"usagename","value":"01"}
                     ];*/
    oldUsages = UsageCollection;
    
    $CommonUI.getDataGrid('#detailTable').datagrid('loadData',data);
     
     rows =  $CommonUI.getDataGrid('#detailTable').datagrid('getRows');
     
     for(var n = 0; n < rows.length;n++){
    	 units = [
    	          {unitid:'0000',unitname:rows[n].medunitname},
  	   		      {unitid:'0001',unitname:rows[n].basicunitname}
    	         ];
    	 
    	oldunits = units;
    	
    	dispensunits = [
    	                 {unitid:'0002',unitname:rows[n].dispensunitname,selected:true}
    	                ];
    	oldDispensunits = dispensunits;
	    
    	$CommonUI.getDataGrid('#detailTable').datagrid('beginEdit',n);
    	 
        $CommonUI.getDataGrid('#detailTable').datagrid('endEdit',n);
       }	
    
}

// 医嘱字典删除
function ordDicDelete(ordDicDeleteTypeId,dtordgrid,orddicid,uuid){
	
	//删除类型: 00 : 删除分类; 01 : 删除字典 ; 02: 删除字典明细
	
	// 医嘱字典分类Id
	if(ordDicDeleteTypeId == "00"){
		
		
	}else if(ordDicDeleteTypeId == "01"){ //删除不区分类型
		
		if(dtordgrid == "" || orddicid ==""){
			alert("请正确的选择删除的字典!","info");
			return;
		}
		
		var url = $WEB_ROOT_PATH+"/clinicTemplate/deleteOrdDicStandByOrddicIdClinic.ajax?orddicid=" + orddicid + "&dtordgrid=" + dtordgrid;
		postReq(url, 
				"", 
				function(data){
			     $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
			     clearOrdDicControlValue();
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
		var url = $WEB_ROOT_PATH+"/clinicTemplate/clinicTemplateCtrl.htm?BLHMI=deleteOrdDicStandByUuid&dto.uuid=" + uuid + "&dto.nodeId=" + dtordgrid;
		postReq(url, 
				"", 
				function(data){
			     $CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
			     //clearOrdDicControlValue();
			     //oldOrdDicGrpUuid = null;
			     //oldOrddicid = null;
			    }, 
				function(data){
		        	$CommonUI.alert("医嘱字典明细删除失败!","error");
		    		return;
		        },  
				{skipHidden:false}
		       );
		
	}
	
}

// 医嘱开立频率的选择
var freqnameOnSelect=function(record){/*
	var selectedRow = $('#doctorOrdersGrid1').datagrid("getSelected");
    var selectedIndex = $('#doctorOrdersGrid1').datagrid("getRowIndex", selectedRow);
    $("#doctorOrdersGrid1").datagrid('endEdit', selectedIndex);
    $('#doctorOrdersGrid1').datagrid('updateRow',{
		index: selectedIndex,
		row: {
			freqname:record.freqName,
			freqid:record.freqDeg,
			intervalDays:0
		}
	});
    $('#doctorOrdersGrid1').edatagrid('editRow',selectedIndex);
*/};



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
		clearOrdDicControlValue();
	}
	
	if(operatTypeId == "04"){
		
	  if(data.reslut == "success"){
		  clearOrdDicControlValue();
		  oldOrdDicGrpUuid = null;
		  oldOrddicid = null;
		  $('#deleteUuid').val("");//保存成功后清空保存删除字典uuid数组
		  $CommonUI.getDataGrid('#detailTable').datagrid("loadData",{"total":"0","rows":[]});
		  $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid("loadData",{"total":"0","rows":[]});
		  $CommonUI.alert("保存成功!","info");
		  //$CommonUI.getDataGrid('#ordDicList').datagrid('loadData',data);
		  
		  //重新查询右上列表记录
		  var url = $WEB_ROOT_PATH+"/clinicTemplate/queryTnOrdListClinic.ajax?nodeId=" + nodeId ;
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
		 ordTemplateCateCancel();
	}
   
}

// 请求失败执行的方法
function errorHandler(data){
   if(operatTypeId == "01"){
	   $CommonUI.alert("新建分类失败!","error");
	}
   if(operatTypeId == "02"){
	   $CommonUI.alert("修改分类失败!","error");
	}
   if(operatTypeId == "03"){
	   $CommonUI.alert("删除分类失败!","error");
	}
   if(operatTypeId == "04"){
	   $CommonUI.alert("保存医嘱字典失败!","error");  
	   clearOrdDicControlValue();
   }
   ordTemplateCateCancel();
   return;
}

// datagrid 的编辑功能

function unitsFormatter(value){
	for(var i=0; i<units.length; i++){
		if (units[i].unitid == value) return units[i].unitname;
	}
	return value;
}

function oldunitsFormatter(value){
	for(var i=0; i<oldunits.length; i++){
		if (oldunits[i].unitid == value) return oldunits[i].unitname;
	}
	return value;
}

function oldFreqsFormatter(value){
	for(var i=0; i<oldFreqs.length; i++){
		if (oldFreqs[i].freqid == value) return oldFreqs[i].freqName;
	}
	return value;
}

function oldUsagesFormatter(value){
	for(var i=0; i<oldUsages.length; i++){
		if (oldUsages[i].value == value) return oldUsages[i].description;
	}
	return value;
}

function dispensunitsFormatter(value){
	for(var i=0; i<dispensunits.length; i++){
		if (dispensunits[i].unitid == value) return dispensunits[i].unitname;
	}
	return value;
}

function oldDispensunitFormatter(value){
	for(var i=0; i<oldDispensunits.length; i++){
		if (oldDispensunits[i].unitid == value) return oldDispensunits[i].unitname;
	}
	return value;
}

function loadGrid(){
	var lastIndex;
	$CommonUI.getDataGrid('#detailTable').datagrid({
		singleSelect:true,
		fitColumns:true,
		fit:true,
		    toolbar:[{
		        text:'添加',
		        iconCls:'chis-add',
		        handler:function(){                     
                    var ordTypeId = $CommonUI.getComboBox('#ordTypeId').combobox('getValue');
                	if(ordTypeId == null || ordTypeId == undefined || ordTypeId =='' ){
                		$CommonUI.alert("请选择医嘱类型！" ,"info");
                		return;
                	}
		            $CommonUI.getDataGrid('#detailTable').datagrid('endEdit', lastIndex);
		            $CommonUI.getDataGrid('#detailTable').datagrid('appendRow',{
		                itemid:'',
		                unitid:' ',
		                freqName:' ',
		                freqUnit:' ',
		                price:'',
		                count:'',
		                total:'',
		                prePay:''
		            });
		            lastIndex = $CommonUI.getDataGrid('#detailTable').datagrid('getRows').length-1;
		            //$CommonUI.getDataGrid('#detailTable').datagrid('selectRow', lastIndex);
		            $CommonUI.getDataGrid('#detailTable').datagrid('beginEdit', lastIndex);
		            initcomboboxData();
		        }
		    },'-',{
		        text:'删除',
		        iconCls:'chis-wrong',
		        handler:function(){
		            var selectedRow = $CommonUI.getDataGrid('#detailTable').datagrid('getSelected');
		            var selectedIndex = $CommonUI.getDataGrid('#detailTable').datagrid('getRowIndex', selectedRow);
		            selectedRow && $CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
	    	        	$CommonUI.getDataGrid('#detailTable').datagrid("deleteRow", selectedIndex);
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
		    }
		    ],
		    columns:[[
		              {field:'uuid',width:40,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'rowno',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'序号'},
		              {field:'ordGroupno',width:40,align:'center',editor:{type:'numberbox'},title:'关联'},
		              {field:'ordItemid',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'itemid',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
		              {field:'itemname',width:175,align:'center',
						     editor:{
									type:'combogrid',
		                                  options:{
	                                            textField: 'itemname',
	                                            idField: 'itemid',
											    hasDownArrow:false,
											    url:$WEB_ROOT_PATH +'/clinicTemplate/queryOrdDicSubListsClinic.ajax',
											    onClickRow:combogridClick,
											    method:'post',
											    mode:'remote',
											    pagination: true,
											    panelWidth: 730,
		                                        columns:
		                                        [[
		                                          {field:'ordItemid',title:'唯一编码',hidden:true},
	                                              {field:'itemid',title:'项目编码',width:120},
		                                          {field:'itemname',title:'项目名称',width:120},
		                                          {field:'itemSpec',title:'项目规格',width:100},
	                                              {field:'salesPrice',title:'项目单价',width:60,align:'right'},
	                                              {field:'medunit',title:'剂量单位',width:60},
	                                              {field:'basicUnit',title:'基本单位',width:60},
	                                              {field:'dispensUnit',title:'零售单位',width:60},
	                                              {field:'medfactor',title:'剂量序数',width:60},
	                                              {field:'dispensFacotr',title:'零售序数',width:60}
										        ]]
								        }
								     },title:'项目名称'},
		              {field:'itemSpec',width:90,align:'center',editor:{type:'validatebox'},title:'项目规格'},
		              {field:'salesPrice',width:60,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'项目单价'},
		              {field:'permedQuantity',width:60,align:'center',editor:{type:'numberbox',options:{min:1}},title:'单次剂量'},
		              {field:'unitid',width:40,align:'center',
							 editor:{
									type:'combobox',
									options:{
										valueField:'text',
										textField:'text',
										data:unitidUnitCollection,
									}
								 },title:'单位'},
		              {field:'freqid',width:80,align:'center',formatter:oldFreqsFormatter,
				                        editor:{
				                              type:'combobox',
				                              options:{
				                              valueField:'freqid',
				                              textField:'freqName',
				                              data: FreqCollection
				                               }
				                              },title:'频次'},
		              {field:'usageid',width:80,align:'center',formatter:oldUsagesFormatter,
				      	                        editor:{
					                                type:'combobox',
					                                options:{
					                                valueField:'value',
					                                textField:'description',
					                                data: UsageCollection
					                                }
					                              },title:'用法'},
		              {field:'freqQuantity',width:60,align:'center',editor:{type:'numberbox'},title:'疗程'},
		              {field:'freqUnit',width:40,align:'center',
							editor:{
								  type:'combobox',
								      options:{
								      valueField: 'text',
								      textField: 'text',
								      data:freqquantityUnitCollection
								   }    
								  },title:'单位'},
 		              {field:'unitQuantity',width:60,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'总计数量'},
		              {field:'unitName',width:40,align:'center',
							editor:{
						        type:'combobox',
						        options:{
						          valueField: 'text',
						          textField: 'text',
						          data:unitQuantityCollection
						         }
						        },title:'单位'},
		              {field:'amountTotal',width:80,align:'center',editor:{type:'numberbox',options:{min:0,precision:2}},title:'总计金额'},
		              {field:'selectunitid',width:10,align:'center',hidden:true,editor:{type:'validatebox'},title:'单位类型编码'},
		              {field:'selectunitname',width:10,align:'center',hidden:true,editor:{type:'validatebox'},title:'单位类型名称'},
		              {field:'medunitname',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'剂量单位名称'},
		              {field:'basicunitname',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'基本单位名称'},
		              {field:'dispensunitname',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'零售单位名称'},
		              {field:'itemnamehidden',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
		              {field:'medfactor',width:100,align:'center',hidden:true,editor:{type:'validatebox'},title:'剂量单位系数'},
		              {field:'dispensFacotr',width:100,align:'center',hidden:true,editor:{type:'validatebox'},title:'零售单位系数'},
		              {field:'unitidhidden',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'单次用量单位编码'},
		              {field:'freqnamehidden',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'频次编码'},
		              {field:'usagename',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'用法名称'}
		              ]],
		    
		    onClickRow:function(rowIndex){
		        editingIndex = rowIndex;
		    	if (lastIndex != rowIndex){
		    		
		        	$CommonUI.getDataGrid('#detailTable').datagrid('endEdit', lastIndex);
		            
		            $CommonUI.getDataGrid('#detailTable').datagrid('beginEdit', rowIndex);
		            
		            lastIndex = rowIndex;
		        }else{
		        	
		        	$CommonUI.getDataGrid('#detailTable').datagrid('selectRow',lastIndex);
		        	
		            editingIndex = lastIndex;
				}
		    
		    	//是否关联，不知道做什么用，先注释掉
		    	if(isBinding == false ){
		    		var itemnameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'itemname'});
			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicSubListsClinic.ajax?ordTypeId=" +  ordTypeId});
			    	
			    	isBinding = true;
		    	}
		    		//
		    	    var freqNameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'freqid'});
				    
				    $(freqNameEdit.target).combobox('loadData',FreqCollection);
				    
				    //
				    var usageidEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'usageid'});
				    
				    $(usageidEdit.target).combobox('loadData',UsageCollection);
				    
				    //
				    var itemnameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'itemname'});
				    
				    
				    var itemnameHiddenEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'itemnamehidden'});
			          
			        $(itemnameEdit.target).combogrid('setValue',$(itemnameHiddenEdit.target).val());
			        $(itemnameEdit.target).combogrid('setValue','123123123');
			        //单位初始化
                    var freqquantityUnitEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'freqUnit'});
				    
				    $(freqquantityUnitEdit.target).combobox('loadData',freqquantityUnitCollection);
				    
				    //单位初始化
                    var unitidUnitEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitid'});
				    
				    $(unitidUnitEdit.target).combobox('loadData',unitidUnitCollection);
				    
				    //单位初始化
                    var unitNameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitName'});
				    
				    $(unitNameEdit.target).combobox('loadData',unitQuantityCollection);
				    
				    //
                    //var quantityunitEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'quantityunit'});
				    
				    //$(quantityunitEdit.target).combobox('loadData',dispensunits);
				    
				    //
				    var priceEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});
				    $(priceEdit.target).numberbox({
						disabled:true
					});
				    
				    //
				    var itemspecEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'itemSpec'});
				    $(itemspecEdit.target).attr({"disabled":true});
				    
				    //
				    //
				    var amounttotalEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'amountTotal'});
				    $(amounttotalEdit.target).numberbox({
						disabled:true
					});
				    
			},
		    
		    onClickCell: function(rowIndex, field, value){
		    	
		    	var perQuantityEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'permedQuantity'}); // 单次量
		    	var salesPriceEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});  // 单价
		    	var unitidEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitid'});          //单次用量单位
		    	var freqNameEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'freqid'});      //频次
		    	var freqquantityEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'freqQuantity'}); //疗程
		    	var medfactorEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'medfactor'});        //剂量单位与基本单位换算序数
		    	var dispensfacotrEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'dispensFacotr'});//零售单位与基本单位换算序数
		    	
		    	var quantityEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitQuantity'});         //总数量
		    	var quantityunitEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitName'}); //总数量单位
		    	var amounttotalEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'amountTotal'});   //总金额
		    	
		    	var unitidhiddenEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitidhidden'});   //单次用量单位编码
		    	var freqnamehiddenEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'freqnamehidden'});   //频次编码
		    	
		    	 
		    	var perQuantity="";
		    	var salesPrice="";
		    	var unitid=" ";
		    	var freqName=" ";
		    	var freqquantity="";
		    	var medfactor= "";
		    	var dispensfacotr="";
		    	
		    	 
		    	
		    	if(perQuantityEdit != null){
		    		perQuantity = $(perQuantityEdit.target).numberbox('getValue');
		    	}
		    	if(salesPriceEdit != null){
		    		salesPrice = $(salesPriceEdit.target).numberbox('getValue');
		    	}
		    	if(unitidEdit != null){
		    		unitid= $(unitidEdit.target).combobox('getValue');//单位
		    		if(unitid == ""){
		    		  unitidhidden = $(unitidhiddenEdit.target).val();
			    	  $(unitidEdit.target).combobox('setValue',unitidhidden);
		    		}
		    	}
		    	if(freqNameEdit != null){
		    		freqName = $(freqNameEdit.target).combobox('getValue');
		    		if(freqName == ""){
		    			freqnamehidden = $(freqnamehiddenEdit.target).val();
		    			 $(freqNameEdit.target).combobox('setValue',freqnamehidden);
		    		}
		    	}
		    	if(freqquantityEdit != null){
		    		freqquantity = $(freqquantityEdit.target).numberbox('getValue');
		    	}
		    	if(medfactorEdit != null){
		    		medfactor = $(medfactorEdit.target).val();
		    	}
		    	if(dispensfacotrEdit != null){
		    		dispensfacotr = $(dispensfacotrEdit.target).val();
		    	}
		    	 
		    	//改变用法时，取用法名称
//		    	var usageNameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'usagename'});
//		    	var usageidEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'usageid'});	
//		    	if(field=="usageid"){
//		    		if(usageidEdit != null){
//		    			 $(usageidEdit.target).combo({
//				    		    onChange:function(newValue,oldValue){
// 		    				 $(usageNameEdit.target).val($(usageidEdit.target).combobox('getText')); //尽然取不到text
// 		    				 $(usageNameEdit.target).val($(usageidEdit.target).combobox('getValue'));
//
//				    		}
//				    	});
//		    		}
//		    	}		    	
		    	
		    	  // 改变单次用量 onchange事件
			     if(field=="permedQuantity"){
			       if(perQuantityEdit != null){
			    	   $(perQuantityEdit.target).numberbox({
			    		    onChange:function(newValue,oldValue){
			    		   var totalQuantity =  GetTotalQuantity(newValue,unitid,freqName,freqquantity,"天",medfactor,dispensfacotr);
			    		   
			    		   var totalAmount = GetTotalAmount(totalQuantity,salesPrice);
			    		   
			    		   if(quantityEdit != null){
			    			   $(quantityEdit.target).numberbox('setValue',totalQuantity); 
			    		   }
			    		   
			    		   if(amounttotalEdit != null){
			    			   $(amounttotalEdit.target).numberbox('setValue',totalAmount); 
			    		   }
			    		}
			    	});
			       }
			     }
			     
			    	 // 改变单次用量单位
			    	 if(field=="unitid"){
			    		 if(unitidEdit!= null){
				    	   $(unitidEdit.target).combo({
				    		   onChange:function(newValue,oldValue){
				    			   
				    		   var totalQuantity =  GetTotalQuantity(perQuantity,newValue,freqName,freqquantity,"天",medfactor,dispensfacotr);
				    		   
				    		   var totalAmount = GetTotalAmount(totalQuantity,salesPrice);
				    		   
				    		   if(quantityEdit != null){
				    			   $(quantityEdit.target).numberbox('setValue',totalQuantity); 
				    		   }
				    		   
				    		   if(amounttotalEdit != null){
				    			   $(amounttotalEdit.target).numberbox('setValue',totalAmount); 
				    		   }
				    		   
				    		   $(unitidhiddenEdit.target).val(newValue); 
				    		   
				    		}
				    	});
			    		 }
				      }
			    	 
			    	 // 改变频次
			    	 if(field=="freqid"){
			    		 
			    		 if(freqNameEdit != null){
			    		  $(freqNameEdit.target).combo({
				    		   onChange:function(newValue,oldValue){
				    		   var totalQuantity =  GetTotalQuantity(perQuantity,unitid,newValue,freqquantity,"天",medfactor,dispensfacotr);
				    		   
				    		   var totalAmount = GetTotalAmount(totalQuantity,salesPrice);
				    		   
				    		   if(quantityEdit != null){
				    			   $(quantityEdit.target).numberbox('setValue',totalQuantity); 
				    		   }
				    		   
				    		   if(amounttotalEdit != null){
				    			   $(amounttotalEdit.target).numberbox('setValue',totalAmount); 
				    		   }
				    		   
				    		   $(freqnamehiddenEdit.target).val(newValue); 
				    		}
				    	});
			    		 }
				      }
			    	 
			    	 // 改变疗程
			    	 if(field=="freqQuantity"){
			    		if(freqquantityEdit!=null){
				    	   $(freqquantityEdit.target).numberbox({
				    		    onChange:function(newValue,oldValue){
				    		   var totalQuantity =  GetTotalQuantity(perQuantity,unitid,freqName,newValue,"天",medfactor,dispensfacotr);
				    		   
				    		   var totalAmount = GetTotalAmount(totalQuantity,salesPrice);
				    		   
				    		   if(quantityEdit != null){
				    			   $(quantityEdit.target).numberbox('setValue',totalQuantity); 
				    		   }
				    		   
				    		   if(amounttotalEdit != null){
				    			   $(amounttotalEdit.target).numberbox('setValue',totalAmount); 
				    		   }
				    		}
				    	});
			    		}
				      }
		    	// 改变总计数量
		    	 if(field=="quantity"){
		    		if(quantityEdit!=null){
			    	   $(quantityEdit.target).numberbox({
			    		    onChange:function(newValue,oldValue){
			    		   var totalQuantity =  GetTotalQuantity(perQuantity,unitid,freqName,newValue,"天",medfactor,dispensfacotr);
			    		   
			    		   var totalAmount = GetTotalAmount(totalQuantity,salesPrice);
			    		   			    		   
			    		   if(amounttotalEdit != null){
			    			   $(amounttotalEdit.target).numberbox('setValue',totalAmount); 
			    		   }
			    		}
			    	});
		    		}
			      }
		    },
		    
		    onSelect:function(rowIndex, rowData){
		    	$('#detailTable').datagrid('beginEdit',rowIndex);
		    	
		    	var unitEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitid'});
		        
		        units = initcombobox(rowIndex);
		        
		        if (unitEdit!=null && unitEdit!="" && unitEdit!=undefined){
			        $(unitEdit.target).combobox('loadData',units);
			    	
			    	unitsFormatter($(unitEdit.target).combobox('getValue'));
		        }
		        
		    	
		    	
		    	// 
		    	
		    	var quantityunitEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'unitName'});
		    	
		    	var dispensunitEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'dispensunitname'});
		    	
		    	dispensunits = [
		    	                 {unitid:'0002',unitname:$(dispensunitEdit.target).val(),selected:true}
		    	               ];
		    	
                $(quantityunitEdit.target).combobox('loadData',dispensunits);
		    	
                dispensunitsFormatter($(quantityunitEdit.target).combobox('getValue'));               
             
		    	
              //改变用法时，取用法名称by caorj
		      var usageNameEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'usagename'});
		      var usageidEdit = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'usageid'});	
		      $(usageNameEdit.target).val($(usageidEdit.target).combobox('getText'));
		      
		    },
		    
		    onBeforeEdit: function(rowIndex, rowData){		    	
		    	isBinding =  false;		    	
		    },		    
		    onAfterEdit: function(rowIndex, rowData, changes){
		    	
		          oldunits = units;		          
		          oldDispensunits = dispensunits;	         
		    }
		});
}

function initcombobox(rowIndex){
	
	var selectunits = [];

	var medunitEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'medunitname'});
	
    var basicunitEdit  = $('#detailTable').datagrid('getEditor', {index:rowIndex,field:'basicunitname'});
    
    var medunit;
    
    var basicunit;
    
    if(medunitEdit != undefined && medunitEdit != null){
    	medunit = $(medunitEdit.target).val();
    }
    	
    if(basicunitEdit != undefined && basicunitEdit != null){
    	basicunit = $(basicunitEdit.target).val();
    }
    
    var isMedUnit = false;
	var isBasicUnit = false;
	if(medunit != undefined && medunit != null && medunit.length !=0){
		isMedUnit = true;
	}
	if(basicunit != undefined && basicunit != null && basicunit.length !=0){
		isBasicUnit = true;
	}
	
	if(isMedUnit == true && isBasicUnit == true){
	selectunits=[
	   	        {unitid:'0000',unitname:medunit},
	   		    {unitid:'0001',unitname:basicunit}
	   	      ];
	}else if(isMedUnit == true && isBasicUnit == false){
	selectunits=[
	   	        {unitid:'0000',unitname:medunit}
	   	      ];
	}else if(isMedUnit == false && isBasicUnit == true){
	selectunits=[
	   	        {unitid:'0001',unitname:basicunit}
	   	      ];
	}
	
	return selectunits;
 }

var combogridClick = function(rowIndex,rowData){
	
	var ordItemidEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'ordItemid'});
	var itemidEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'itemid'});
	var itemnameEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'itemname'});
	var itemspecEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'itemSpec'});
	var priceEdit  = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'salesPrice'});
	var unitEdit  = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'unitid'});
	var medunitEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'medunitname'});
	var basicunitEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'basicunitname'});
	var dispensunitEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'dispensunitname'});
	var itemnameHiddenEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'itemnamehidden'});
	var medfactorEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'medfactor'});
	var dispensfacotrEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'dispensFacotr'});
	var quantityunitEdit  = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'unitName'});
	
	var amounttotalEdit = $('#detailTable').datagrid('getEditor', {index:editingIndex,field:'amountTotal'});
	$(ordItemidEdit.target).val(rowData.ordItemid);
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	
	$(itemspecEdit.target).attr({"disabled":true});
	$(itemspecEdit.target).val(rowData.itemSpec);
	$(priceEdit.target).numberbox({
		disabled:true
	});
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(medunitEdit.target).val(rowData.medunit);
	$(basicunitEdit.target).val(rowData.basicUnit);
	$(dispensunitEdit.target).val(rowData.dispensUnit);
	$(itemnameHiddenEdit.target).val(rowData.itemname);
	$(medfactorEdit.target).val(rowData.medfactor);
	$(dispensfacotrEdit.target).val(rowData.dispensFacotr);
	$(amounttotalEdit.target).numberbox({
		disabled:true
	});
	
	units=[
	        {unitid:'0000',unitname:rowData.medunit},
		    {unitid:'0001',unitname:rowData.basicUnit}
	      ];
	 
	 oldunits = units;
	 
	$(unitEdit.target).combobox('loadData',units);
	
	dispensunits = [{unitid:'0002',unitname:rowData.dispensUnit,selected:true}];
	
	oldDispensunits = dispensunits;
	
	$(quantityunitEdit.target).combobox('loadData',dispensunits);
}

function initcomboboxData(){
	
	if( FreqCollection.length == 0 ){
		var freqUrl =$WEB_ROOT_PATH + '/clinicTemplate/getFreqListClinic.ajax';
		
		postReq(freqUrl,null,initFreqDataSuccess, initFreqDataError,  {skipHidden:false});
	}
	if(UsageCollection.length == 0){
       var usageUrl =$WEB_ROOT_PATH + '/dict/getDictContentList.ajax?dictName=usage';
		
	   postReq(usageUrl,null,initUsageDataSuccess, initUsageDataError,  {skipHidden:false});
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

function initUsageDataSuccess(data){
	
	UsageCollection = data.rows;
	usages = data.rows;
	oldUsages = data.rows;
}

function initUsageDataError(data){
	// nothing to do
}

/* 说明:
 * 1. perQuantity： 单次剂量 ;
 *    unitid: 单次剂量单位; 
 *    freqName:频次; 
 *    freqquantity：疗程;
 *    
 * 2. 疗程的单位默认为"天"
 */

var frequnit;
var freqcn;
var freqdeg;

// 计算总数量
function GetTotalQuantity(perQuantity,unitid,freqName,freqquantity,freqquantityunit,medfactor,dispensfacotr){
	
	var totalQuantity = 0.00;
	
	var FreqFactor = 0; // 总疗程天数
	
	var oneTimes = 0;  // 一天次数
	
	var days = 0; // 天数
	
	var weeks = 0; // 周数
	
	var totalBasicQuantity = 0.00; //基本单位下总数量
	
	var perBasicQuantity = 0.00; // 基本单位下的单次用量
	
	
	if(perQuantity == ""){
		totalQuantity = 0.00;
		return totalQuantity;
	}else if(unitid == " "){
		totalQuantity = 0.00;
		return totalQuantity;
	}else if(freqName == " "){
		totalQuantity = 0.00;
		return totalQuantity;
	}else if(freqquantity==""){
		totalQuantity = 0.00;
		return totalQuantity;
	}else{
		GetFreqs(freqName);
		if(freqquantityunit == "天"){
			FreqFactor = freqquantity;
		}else if(freqquantityunit == "周"){
			FreqFactor = freqquantity*7;
		}
		
		days = FreqFactor;
		
		if(unitid == "0000"){
			perBasicQuantity = perQuantity * medfactor;
		}else{
			perBasicQuantity = perQuantity;
		}
		
		if(frequnit == "时"){
			if(freqdeg == 1){
				oneTimes = Math.floor(24 / freqcn);
				 if(24 % freqcn > 0){
					 oneTimes = oneTimes + 1; 
				 }
					 
			}else{
				oneTimes = 24*freqdeg;
			}
		}else if(frequnit == "天"){
			
			oneTimes = freqdeg;
			
			if(freqdeg == 1 && freqcn > 1){
              	if(Math.floor(FreqFactor/freqcn) < (FreqFactor/freqcn)){
              		
              		days = Math.floor(FreqFactor/freqcn) + 1;
              		
              	}else{
              		
              		days = Math.floor(FreqFactor/freqcn);
              	}			
			}
		}else if(frequnit == "周"){
			
			oneTimes = freqdeg;
			
			var quantityOneWeek = 0.00;
			
			quantityOneWeek = oneTimes*perBasicQuantity;
			
			if(Math.floor(days/7) < (days/7)){
				weeks =  Math.floor(days/7) + 1;
			}else{
				weeks =  Math.floor(days/7);
			}
			
			if(freqcn > 1){
				if(weeks % freqcn > 0){
					weeks = Math.floor(weeks/freqcn) + 1;
				}else{
					weeks =1;
				}
			}
			
			var  totalQuantityWeek = quantityOneWeek * weeks / dispensfacotr;
			
			if(Math.floor(totalQuantityWeek) < totalQuantityWeek){
				totalQuantity = Math.floor(totalQuantityWeek) + 1;
			}else{
				totalQuantity = Math.floor(totalQuantityWeek);
				return totalQuantity;
			}
		}
		
		if(Math.floor(perBasicQuantity * oneTimes * days) < (perBasicQuantity * oneTimes * days)){
			totalBasicQuantity = Math.floor(perBasicQuantity * oneTimes * days) + 1;
		}else{
			totalBasicQuantity = Math.floor(perBasicQuantity * oneTimes * days) ;
		}
		if(Math.floor(totalBasicQuantity/dispensfacotr) < (totalBasicQuantity/dispensfacotr)){
			totalQuantity = Math.floor(totalBasicQuantity/dispensfacotr) + 1;
		}else{
			totalQuantity = Math.floor(totalBasicQuantity/dispensfacotr);
		}
		return totalQuantity;	
	}
	
}

/* 说明:
 * 1. perQuantity： 单次剂量 ;
 *    unitid: 单次剂量单位; 
 *    freqName:频次; 
 *    freqquantity：疗程;
 *    salesPrice:单价;
 *    
 * 2. 疗程单位默认为"天"
 */

// 计算总金额
function GetTotalAmount(totalQuantity,salesPrice){
	 return (totalQuantity*salesPrice).toFixed(2);
}

/* 说明:
 *  1. freqName: 频次编码;
 *  
 *  2. 计算每天多少次
 */

// 频次的拆分
function GetFreqs(freqName){
	if(FreqCollection.length == 0){
		initcomboboxData();
	}
	if(FreqCollection.length > 0){
		for(var n = 0 ; n< FreqCollection.length; n++){
			if(FreqCollection[n].freqid == freqName){
				frequnit = FreqCollection[n].freqUnit;
				freqcn = FreqCollection[n].freqcn;
				freqdeg = FreqCollection[n].freqDeg;
			}
		}
	}
}


function loadGrid2(){
	var lastIndex;
	$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid({	 
		 
		toolbar:[{
		        text:'添加',
		        iconCls:'chis-add',
		        handler:function(){
		        	if(ordTypeId == null ){
                    	$CommonUI.alert("请正确选择医嘱类型!","info");
                    	return;
		            }
		            $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('endEdit', lastIndex);
		            $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('appendRow',{
		            	itemidone:'',
		            	itemnameone:'',
		            	quantityone:'',
		            	salespriceone:'',
		            	dispensfacotrone:'',
		            	itemidone:'',
		            	itemnameone:'',
		            	quantityone:'',
		            	salespriceone:'',
		            	dispensfacotrone:'',
		            	itemidtwo:'',
		            	itemnametwo:'',
		            	quantitytwo:'',
		            	salespricetwo:'',
		            	dispensfacotrtwo:'',
		            	itemidthree:'',
		            	itemnamethree:'',
		            	quantitythree:'',
		            	salespricethree:'',
		            	dispensfacotrthree:'',
		            	itemidfour:'',
		            	itemnamefour:'',
		            	quantityfour:'',
		            	salespricefour:'',
		            	dispensfacotrfour:'',
		                
		            });
		            lastIndex = $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('getRows').length-1;
		            //$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('selectRow', lastIndex);
		            $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('beginEdit', lastIndex);
		          }
		    },'-',{
		        text:'删除',
		        iconCls:'chis-wrong',
		        handler:function(){
		            var row = $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('getSelected');
		            if (row){
		                var index = $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('getRowIndex', row);
		                $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('deleteRow', index);
		            }
		        }
		    }
		    ],
		    
		    columns:[[
		              {field:'uuidone',width:40,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'rownoone',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'序号'},
		              {field:'itemidone',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
		              {field:'itemnameone',width:170,align:'center',
							editor:{
						          type:'combogrid',
                                  options:{
                                    textField: 'itemname',
                                    idField: 'itemid',
								      hasDownArrow:false,
								      url:$WEB_ROOT_PATH +'/clinicTemplate/queryOrdDicSubListsClinic.ajax',
								      onClickRow:combogridClickOne,
								      method:'get',
								      mode:'remote',
								      pagination: true,
								      panelWidth: 730,
                                    columns:
                                    [[
                                      {field:'itemid',title:'项目编码',width:120},
                                      {field:'itemname',title:'项目名称',width:120},
                                      {field:'itemSpec',title:'项目规格',width:100},
                                      {field:'salesPrice',title:'项目单价',width:60,align:'right'},
                                      {field:'medunit',title:'剂量单位',width:60,align:'right'},
                                      {field:'basicUnit',title:'基本单位',width:60,align:'right'},
                                      {field:'dispensUnit',title:'零售单位',width:60,align:'right'},
                                      {field:'medfactor',title:'剂量系数',width:60,align:'right'},
                                      {field:'dispensFacotr',title:'零售系数',width:60,align:'right'}
							         ]]
					               }
					             },title:'项目名称'},
		              {field:'quantityone',width:60,align:'center',
								     editor:{
							             type:'numberbox'
							            },title:'重量(g)'},
		              {field:'salespriceone',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'零售价'},
		              {field:'dispensfacotrone',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'基本单位与零售单位换算序数'},
		              {field:'itemnamehiddenone',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
		              
		              {field:'uuidtwo',width:40,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'rownotwo',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'序号'},
		              {field:'itemidtwo',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
		              {field:'itemnametwo',width:170,align:'center',
							editor:{
						          type:'combogrid',
                                  options:{
                                    textField: 'itemname',
                                    idField: 'itemid',
								      hasDownArrow:false,
								      url:$WEB_ROOT_PATH +'/clinicTemplate/queryOrdDicSubListsClinic.ajax',
								      onClickRow:combogridClickTwo,
								      method:'get',
								      mode:'remote',
								      pagination: true,
								      panelWidth: 730,
                                    columns:
                                    [[
                                      {field:'itemid',title:'项目编码',width:120},
                                      {field:'itemname',title:'项目名称',width:120},
                                      {field:'itemSpec',title:'项目规格',width:100},
                                      {field:'salesPrice',title:'项目单价',width:60,align:'right'},
                                      {field:'medunit',title:'剂量单位',width:60,align:'right'},
                                      {field:'basicUnit',title:'基本单位',width:60,align:'right'},
                                      {field:'dispensUnit',title:'零售单位',width:60,align:'right'},
                                      {field:'medfactor',title:'剂量序数',width:60,align:'right'},
                                      {field:'dispensFacotr',title:'零售序数',width:60,align:'right'}
							         ]]
					               }
					             },title:'项目名称'},
		              {field:'quantitytwo',width:60,align:'center',
								     editor:{
							             type:'numberbox'
							            },title:'重量(g)'},
		              {field:'salespricetwo',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'零售价'},
		              {field:'dispensfacotrtwo',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'基本单位与零售单位换算序数'},
		              {field:'itemnamehiddentwo',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
		              
		              
		              {field:'uuidthree',width:40,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'rownothree',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'序号'},
		              {field:'itemidthree',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
		              {field:'itemnamethree',width:170,align:'center',
							editor:{
						          type:'combogrid',
                                  options:{
                                    textField: 'itemname',
                                    idField: 'itemid',
								      hasDownArrow:false,
								      url:$WEB_ROOT_PATH +'/clinicTemplate/queryOrdDicSubListsClinic.ajax',
								      onClickRow:combogridClickThree, 
								      method:'get',
								      mode:'remote',
								      pagination: true,
								      panelWidth: 730,
                                    columns:
                                    [[
                                      {field:'itemid',title:'项目编码',width:120},
                                      {field:'itemname',title:'项目名称',width:120},
                                      {field:'itemSpec',title:'项目规格',width:100},
                                      {field:'salesPrice',title:'项目单价',width:60,align:'right'},
                                      {field:'medunit',title:'剂量单位',width:60,align:'right'},
                                      {field:'basicUnit',title:'基本单位',width:60,align:'right'},
                                      {field:'dispensUnit',title:'零售单位',width:60,align:'right'},
                                      {field:'medfactor',title:'剂量序数',width:60,align:'right'},
                                      {field:'dispensFacotr',title:'零售序数',width:60,align:'right'}
							         ]]
					               }
					             },title:'项目名称'},
		              {field:'quantitythree',width:60,align:'center',
								     editor:{
							             type:'numberbox'
							            },title:'重量(g)'},
		              {field:'salespricethree',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'零售价'},
		              {field:'dispensfacotrthree',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'基本单位与零售单位换算序数'},
		              {field:'itemnamehiddenthree',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
		              
		              {field:'uuidfour',width:40,align:'center',hidden:true,editor:{type:'validatebox'},title:'唯一编码'},
		              {field:'rownofour',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'序号'},
		              {field:'itemidfour',hidden:true,width:100,align:'center',editor:{type:'validatebox'},title:'项目编码'},
		              {field:'itemnamefour',width:170,align:'center',
							editor:{
						          type:'combogrid',
                                  options:{
                                    textField: 'itemname',
                                    idField: 'itemid',
								      hasDownArrow:false,
								      url:$WEB_ROOT_PATH +'/clinicTemplate/queryOrdDicSubListsClinic.ajax',
								      onClickRow:combogridClickFour,
								      method:'get',
								      mode:'remote',
								      pagination: true,
								      panelWidth: 730,
                                    columns:
                                    [[
                                      {field:'itemid',title:'项目编码',width:120},
                                      {field:'itemname',title:'项目名称',width:120},
                                      {field:'itemspec',title:'项目规格',width:100},
                                      {field:'salesprice',title:'项目单价',width:60,align:'right'},
                                      {field:'medunit',title:'剂量单位',width:60,align:'right'},
                                      {field:'basicunit',title:'基本单位',width:60,align:'right'},
                                      {field:'dispensunit',title:'零售单位',width:60,align:'right'},
                                      {field:'medfactor',title:'剂量序数',width:60,align:'right'},
                                      {field:'dispensfacotr',title:'零售序数',width:60,align:'right'}
							         ]]
					               }
					             },title:'项目名称'},
		              {field:'quantityfour',width:60,align:'center',
								     editor:{
							             type:'numberbox'
							            },title:'重量(g)'},
		              {field:'salespricefour',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'零售价'},
		              {field:'dispensfacotrfour',width:40,align:'center',hidden:true,editor:{type:'numberbox'},title:'基本单位与零售单位换算序数'},
		              {field:'itemnamehiddenfour',width:80,align:'center',hidden:true,editor:{type:'validatebox'},title:'隐藏项目名称'},
		              ]],
		    onClickRow:function(rowIndex){
		        editingIndex = rowIndex;
		    	if (lastIndex != rowIndex){
		    		
		        	$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('endEdit', lastIndex);
		            
		            $CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('beginEdit', rowIndex);
		            
		            lastIndex = rowIndex;
		        }else{
		        	
		        	$CommonUI.getDataGrid('#chinaMedicineGrid').datagrid('selectRow',lastIndex);
		        	
		            editingIndex = lastIndex;
				}
		    	
		    	
		    	//改变url，带入医嘱类型查询
		    	if(isBinding == false){ 
		    		var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnameone'});			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicSubListsClinic.ajax?ordTypeId=" +  ordTypeId});
		    		var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnametwo'});			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicSubListsClinic.ajax?ordTypeId=" +  ordTypeId});
		    		var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamethree'});			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicSubListsClinic.ajax?ordTypeId=" +  ordTypeId});
		    		var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamefour'});			    	
		    		$(itemnameEdit.target).combogrid({url:$WEB_ROOT_PATH+"/clinicTemplate/queryOrdDicSubListsClinic.ajax?ordTypeId=" +  ordTypeId});
			    	isBinding = true;
		    	}
		    	
		         //回填
		    	
				    var itemnameoneEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnameone'});
				    
				    var itemnameHiddenEditone = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamehiddenone'});
			          
			        $(itemnameoneEdit.target).combogrid('setValue',$(itemnameHiddenEditone.target).val());
		        
			        
                    var itemnametwoEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnametwo'});
				    
				    var itemnameHiddenEdittwo = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamehiddentwo'});
			          
			        $(itemnametwoEdit.target).combogrid('setValue',$(itemnameHiddenEdittwo.target).val());
			        
			        
                    var itemnamethreeEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamethree'});
				    
				    var itemnameHiddenEditthree = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamehiddenthree'});
			          
			        $(itemnamethreeEdit.target).combogrid('setValue',$(itemnameHiddenEditthree.target).val());
			        
			        
                    var itemnamefourEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamefour'});
				    
				    var itemnameHiddenEditfour = $('#chinaMedicineGrid').datagrid('getEditor', {index:rowIndex,field:'itemnamehiddenfour'});
			          
			        $(itemnamefourEdit.target).combogrid('setValue',$(itemnameHiddenEditfour.target).val());
		        
			},
		    
			onSelect:function(rowIndex, rowData){
			    	$('#chinaMedicineGrid').datagrid('beginEdit',rowIndex);
			},
		    
		    onClickCell: function(rowIndex, field, value){
		    	
		    }
		});
}




var combogridClickOne = function(rowIndex,rowData){
	
	var itemidEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemidone'});
	var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnameone'});
	var priceEdit  = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'salespriceone'});
	var dispensfacotrEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'dispensfacotrone'});
	var itemnamehiddenoneEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamehiddenone'});
	
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(dispensfacotrEdit.target).val(rowData.dispensFacotr);
	$(itemnamehiddenoneEdit.target).val(rowData.itemname);
	
}


var combogridClickTwo = function(rowIndex,rowData){
	
	var itemidEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemidtwo'});
	var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnametwo'});
	var priceEdit  = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'salespricetwo'});
	var dispensfacotrEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'dispensfacotrtwo'});
	var itemnamehiddentwoEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamehiddentwo'});
	
	
	
	
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(dispensfacotrEdit.target).val(rowData.dispensFacotr);
	$(itemnamehiddentwoEdit.target).val(rowData.itemname);
	
	
}

 
var combogridClickThree = function(rowIndex,rowData){
	
	var itemidEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemidthree'});
	var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamethree'});
	var priceEdit  = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'salespricethree'});
	var dispensfacotrEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'dispensfacotrthree'});
	var itemnamehiddenthreeEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamehiddenthree'});
	
	
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(dispensfacotrEdit.target).val(rowData.dispensFacotr);
	$(itemnamehiddenthreeEdit.target).val(rowData.itemname);
}

var combogridClickFour = function(rowIndex,rowData){
	
	var itemidEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemidfour'});
	var itemnameEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamefour'});
	var priceEdit  = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'salespricefour'});
	var dispensfacotrEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'dispensfacotrfour'});
	var itemnamehiddenfourEdit = $('#chinaMedicineGrid').datagrid('getEditor', {index:editingIndex,field:'itemnamehiddenfour'});
	
	
	$(itemidEdit.target).val(rowData.itemid);
	$(itemnameEdit.target).combogrid('setValue',rowData.itemname);
	$(priceEdit.target).numberbox('setValue',rowData.salesPrice);
	$(dispensfacotrEdit.target).val(rowData.dispensFacotr);
	$(itemnamehiddenfourEdit.target).val(rowData.itemname);
}
