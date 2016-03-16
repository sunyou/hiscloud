var flag1="3";//1保存,2已审核 ,3未保存
$(function(){
	$CommonUI.getDataGrid('#bill').datagrid({
		height:465,
		fitColumns:true,
		striped:true,
		singleSelect:true,
		rownumbers: true,
		pagination: false,
		onClickCell: function(index,field,value){
			if(flag1=="2"){
				if(field == 'deleteRow1') {
				$CommonUI.alert("已审核,不可操作!");}
				return;
			}
			else{
				if(field == 'deleteRow1') {
					var length = $CommonUI.getDataGrid('#bill').datagrid('getRows').length;
					var adjustid=$CommonUI.getDataGrid('#bill').datagrid('getData')["rows"][index].adjustid;
					var uuid=$CommonUI.getDataGrid('#bill').datagrid('getData')["rows"][index].uuid;
					if(length=="1"&&adjustid!=null&&adjustid!=""){
						$CommonUI.confirm("您确定删除该项目？", 'warning', '确定', function(){
							postReq($WEB_ROOT_PATH+'/drugsAdjustPrice/adjustpricebillCtrl.ajax?BLHMI=delete', '', function(d){
								
								 if(d.result=="1"){
									 $('#bill').datagrid('deleteRow',index);
									 $CommonUI.autoCloseCenterMessage("删除成功！","info",500);
								 }else{
									 $CommonUI.alert("删除失败");
								 }
								
							}, function(){
								$CommonUI.alert("删除失败");
								
							}, {skipHidden:false}, {"uuid":uuid,"adjustid":adjustid});
						 }, '取消', '', '', false);
					}else{
						$CommonUI.confirm("您确定删除该项目？", 'warning', '确定', function(){
							var uuid=$CommonUI.getDataGrid('#bill').datagrid('getData')["rows"][index].uuid;
							if(uuid==undefined){
								$('#bill').datagrid('deleteRow',index);
								$CommonUI.alert("删除成功！");
							}else{
								postReq($WEB_ROOT_PATH+'/drugsAdjustPrice/adjustpricebillCtrl.ajax?BLHMI=delete', '', function(d){
									
									 if(d.result=="1"){
										 $('#bill').datagrid('deleteRow',index);
										 $CommonUI.autoCloseCenterMessage("删除成功！","info",500);
									 }else{
										 $CommonUI.alert("删除失败！");
									 }
									
								}, function(){
									$CommonUI.alert("删除失败！");
								}, {skipHidden:false}, {"uuid":uuid});
							}
						 }, '取消', '', '', false);
					}
				}
				if(field != 'action') {
					$('#bill').datagrid('beginEdit', index);
					var e = $('#bill').datagrid('getEditor', {index:index,field:field});
					if(e!=null){
						$(e.target).focus();
					}else{
						$(this).focus();
					}
				}
				if(field == 'newwholesalesPrice' || field == 'newsalesPrice'){
					quantityOrPriceEdit(index,field,value);
				}
			}
		},
		onDblClickRow:function(rowIndex, rowData){
			var isfinished=rowData.isfinished;
			if(isfinished!=1){
				$CommonUI.getDataGrid('#bill').datagrid('beginEdit',rowIndex);
				var salesPriceEditor = $('#bill').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});//原零售价
				var wholesalesPriceEditor = $('#bill').datagrid('getEditor', {index:rowIndex,field:'wholesalesPrice'});//原购入价
				var wholesalesDifferenceEditor = $('#bill').datagrid('getEditor', {index:rowIndex,field:'wholesalesDifference'});//零售价差价
				var salesDifferenceEditor = $('#bill').datagrid('getEditor', {index:rowIndex,field:'salesDifference'});//购入价差额
				var warehousUnitEditor= $('#bill').datagrid('getEditor', {index:rowIndex,field:'unitname'});
				$(salesDifferenceEditor.target).attr({"disabled":true});
				$(wholesalesDifferenceEditor.target).attr({"disabled":true});
				$(salesPriceEditor.target).attr({"disabled":true});
				$(wholesalesPriceEditor.target).attr({"disabled":true});
				if(rowData.warehousUnit==rowData.dispensUnit){
					$(warehousUnitEditor.target).combo(
							$.extend({},$.fn.validatebox.defaults,{
								editable:false,panelHeight:'auto',disabled:false,hasDownArrow:true}
						));
					$(warehousUnitEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.warehousUnit}]});
					$(warehousUnitEditor.target).combobox('setValue',rowData.dispensUnit);
				}else if (rowData.warehousUnit==rowData.warehousUnit){
					$(warehousUnitEditor.target).combo(
							$.extend({},$.fn.validatebox.defaults,{
								editable:false,panelHeight:'auto',disabled:false,hasDownArrow:true}
						));
					$(warehousUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.warehousUnit},{"value":rowData.dispensUnit}]});
					$(warehousUnitEditor.target).combobox('setValue',rowData.warehousUnit);
				}
			}
		},
		columns:[[  
	        {field : "ck1",checkbox : true,width : 80,align : 'center'},
  			{title : "系数",field : "dispensFacotr",width : 110,align : 'center',hidden:true},
  			{title : "uuid",field : "uuid",width : 111,align : 'center',hidden:true},
  			{title : "adjustid",field : "adjustid",width : 111,align : 'center',hidden:true},
  			{title : "药品名称",field : "itemname",width : 110,align : 'center'},
  			{title : "规格", field : "itemSpec",width : 80,align : 'center'},
  			{title : "包装单位类型",field: "unittype",align:'center',editor:{type:'text'},hidden:true},
  			{title : "单位", field:"unitname",width:80,align:'center',editor:{type:'combobox',options:{valueField: 'value',textField: 'value',editable:false,panelHeight:'auto',onSelect:onChange}}},
  			{title : "原购入价",field : "wholesalesPrice",width : 80,align : 'center',editor:{type:'text'}},
  			{title : "原零售价",field : "salesPrice",width : 80,align : 'center',editor:{type:'text'}},
  			{title : "新购入价",field : "newwholesalesPrice",width : 80,align : 'center',editor:{type:'text'}},
  			{title : "新零售价",field : "newsalesPrice",width : 80,align : 'center',editor:{type:'text'}},
  			{title : "生效日期",field : "adjustDatetime",width : 90,align : 'center'
  				,formatter:function(value,row,index){
  					if(row.adjustDatetime!=""&&row.adjustDatetime!=null){
							var adjustDatetime = value.substr(0,10);
							return adjustDatetime;
						}
  				},editor: {type: 'datebox',options:{editable:false}}},
  			{title : "调价原因",field : "adjustReason",width : 90,align : 'center',editor: {type: 'text'}},
  			{title : "购入价差额",field : "salesDifference",width : 90,align : 'center',editor:{type:'text'}},
  			{title : "零售价差额",field : "wholesalesDifference",width : 90,align : 'center',editor:{type:'text'}},
  			{field:'deleteRow1',title:'操作',width:70,align:'center',formatter:function(value,row,index){
	        	
  				return a = '<a href="javascript:void(0)" (\''+row.adjustid+'\',\''+row.isfinished+'\',\''+index+'\')">删除</a> ';
			}}
		 ]]
	});
	//引用采购单关闭按钮
	$("#qtordDlgClose").click(function(){
		$CommonUI.getDialog("#quotePurDlg").dialog("close");
	});
	//药品选择关闭按钮
	$("#itemsSelectDlgClose").click(function(){
		$CommonUI.getDialog("#itemsSelectDlg").dialog("close");
	});
	$CommonUI.getDataGrid('#bill').datagrid('loadData',{"total":"0","rows":[]});
});
function chooseDrug(){
	if(flag1=="1"||flag1=="2"){
		 $CommonUI.getDataGrid('#bill').datagrid('loadData',{"total":"0","rows":[]});
		 flag1=3;
	}
	$('#sureBtn').attr('disabled',true);
	$('#medChooseDlg').dialog('open').dialog('center');
	var url = $WEB_ROOT_PATH +'/purchaseManage/drugCommonCtrl.ajax?BLHMI=itemsList&ismeditem=1';
	var columns = [[ 
		{field:'ck',checkbox:true},
		{field:'itemname',title:'药品名称',width:190,align:'center'},
		{field:'ordCatename',title:'药品分类',width:190,align:'center'}, 
		{field:'itemid',title:'项目编码',width:190,align:'center',hidden:true },
		{field:'itemSpec',title:'药品规格',width:190,align:'center'}, 
		{field:'basicUnit',title:'小单位',width:190,align:'center'}, 
		{field:'dispensUnit',title:'大单位',width:190,align:'center'},    
		{field:'itemDosename',title:'剂型单位',width:280,align:'center'},
		{field:'producerName',title:'生产商家',width:210,align:'center'}
		         ]];
	var queryParams = {page : 1,rows : 10};
	var sortOpts = {remoteSort: false,sortName: '',sortOrder: 'asc'};
	var pageOpts = {pageNumber: 1,pageSize: 10};
	var options = {height : 310,singleSelect: false,pagination: true,rownumbers:true,fitColumns:true,
			onCheck: onCheck,onUncheck:onUncheck,onCheckAll:ckOrSlAll};
	$CommonUI.datagrid('#queryDrugBillWindow', url, queryParams, columns, pageOpts, sortOpts, options);
}
var onCheck = function(rowIndex, rowData) {
	var flag = "";
	var length = $CommonUI.getDataGrid('#bill').datagrid('getRows').length;
	if(length == 0){
		addItem(rowData,length);
	}else{
		for(var i=0;i<length;i++){
    		if(rowData.itemid != $CommonUI.getDataGrid('#bill').datagrid('getRows')[i].itemid){
    			flag = true;
    		}else{
    			flag = false;
    			break;
    		}
    	}
	}
	if(flag == true){
		addItem(rowData,length);
	}
};
var onUncheck = function(rowIndex, rowData) {
	for(var i=0;i<$CommonUI.getDataGrid('#bill').datagrid('getRows').length;i++){
		if(rowData.itemid == $CommonUI.getDataGrid('#bill').datagrid('getRows')[i].itemid){
			$CommonUI.getDataGrid('#bill').datagrid('deleteRow',i);
		}
	}
};
var ckOrSlAll = function(rows){
//	$CommonUI.showMessage('数据加载中......', 'info', '', 1000, true, true, '', '', '', '', false);
	var length = $CommonUI.getDataGrid('#bill').datagrid('getRows').length;
	if(length == 0){
		for(var i=0;i<rows.length;i++){
			var rowData = rows[i];
			addItem(rowData,i);
			}
	}else{
		var flag = "";//是否可添加
		for(var j=0;j<rows.length;j++){
			for(var i=0;i<$CommonUI.getDataGrid('#bill').datagrid('getRows').length;i++){
		    	if(rows[j].itemid != $CommonUI.getDataGrid('#bill').datagrid('getRows')[i].itemid){
		    		flag = true;
		    	}else{
		    		flag = false;
		    		break;
		    	}
			}
			if(flag == true){
				var rowData = rows[j];
				addItem(rowData,i);
	    	}
		}
	}
};
function addItem(rowData,length){
	$CommonUI.getDataGrid('#bill').datagrid('appendRow',rowData);
	$CommonUI.getDataGrid('#bill').datagrid('beginEdit',length);
	var salesPriceEditor = $('#bill').datagrid('getEditor', {index:length,field:'salesPrice'});//原零售价
	var wholesalesPriceEditor = $('#bill').datagrid('getEditor', {index:length,field:'wholesalesPrice'});//原购入价
	var wholesalesDifferenceEditor = $('#bill').datagrid('getEditor', {index:length,field:'wholesalesDifference'});//零售价差价
	var salesDifferenceEditor = $('#bill').datagrid('getEditor', {index:length,field:'salesDifference'});//购入价差额
	var warehousUnitEditor= $('#bill').datagrid('getEditor', {index:length,field:'unitname'});
	
	var adjustDatetimeEditor= $('#bill').datagrid('getEditor', {index:length,field:'adjustDatetime'});
	var today = formatterDate(new Date()).substr(0,10);
	$(adjustDatetimeEditor.target).datebox('setValue',today);
	
	var unittypeEditor=$('#bill').datagrid('getEditor',{index:length,field:'unittype'});
	
	 if(rowData.warehousUnit==rowData.dispensUnit || rowData.warehousUnit==null || rowData.dispensUnit==null){
		 $(warehousUnitEditor.target).combo(
			$.extend({},$.fn.validatebox.defaults,{
			editable:false,panelHeight:'auto',disabled:false,hasDownArrow:false}
		));
		if(rowData.warehousUnit==null){//没有库存单位，其实在选择药品时已经过滤，但是数据原因，所以添加判断。
			$(warehousUnitEditor.target).combobox('setValue',rowData.dispensUnit);
			$(unittypeEditor.target).val('0002');//零售
		}else{
			$(warehousUnitEditor.target).combobox('setValue',rowData.warehousUnit);
			$(unittypeEditor.target).val('0003');//库存
		}
	 }
	 else{//零售单位
		$(warehousUnitEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.warehousUnit},{"value":rowData.dispensUnit}]});
		$(warehousUnitEditor.target).combo(
			$.extend({},$.fn.validatebox.defaults,{
				editable:false,panelHeight:'auto',disabled:false,hasDownArrow:true}
		));
		$(warehousUnitEditor.target).combobox('setValue',rowData.dispensUnit);
	}
	$(salesDifferenceEditor.target).attr({"disabled":true});
	$(wholesalesDifferenceEditor.target).attr({"disabled":true});
	$(salesPriceEditor.target).attr({"disabled":true});
	$(wholesalesPriceEditor.target).attr({"disabled":true});
}
var onChange=function(){
	 var selectedRow = $('#bill').datagrid("getSelected");
	 var selectedIndex = $('#bill').datagrid("getRowIndex", selectedRow);
	 var unitnameEditor = $('#bill').datagrid('getEditor',{index:selectedIndex,field:'unitname'});
	 var unittypeEditor=$('#bill').datagrid('getEditor',{index:selectedIndex,field:'unittype'});
	 
	 var newwholesalesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'newwholesalesPrice'});
	 var salesDifferenceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'salesDifference'});
	 var newsalesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'newsalesPrice'});
	 var totalplEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'wholesalesDifference'});
	 var unitname=$(unitnameEditor.target).combobox('getValue');
	 var wholesalesPrice = selectedRow.wholesalesPrice;
     var salesPrice = selectedRow.salesPrice;
     if(unitname!=undefined&&unitname!=null&&unitname!=""){
    	 if(unitname==selectedRow.dispensUnit){//小单位    
    		 $(unittypeEditor.target).val('0002');//零售单位类型
    		 var salesPriceEditor = $('#bill').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
    		 $(salesPriceEditor.target).val(salesPrice);
    		 var wholesalesPriceEditor = $('#bill').datagrid('getEditor', {index:selectedIndex,field:'wholesalesPrice'});
    		 $(wholesalesPriceEditor.target).val(wholesalesPrice);
    		 
    		 var newwholesalesPrice = $(newwholesalesPriceEditor.target).val();
    		 var  salesDifference=roundFun((newwholesalesPrice-wholesalesPrice),2);
    		 $(salesDifferenceEditor.target).val(salesDifference);
    		   
    		 var newsalesPrice = $(newsalesPriceEditor.target).val();
    		 var  wholesalesDifference=roundFun((newsalesPrice-salesPrice),2);
    		 $(totalplEditor.target).val(wholesalesDifference);
    	 }
    	 else  if(unitname==selectedRow.warehousUnit){//大单位
		     $(unittypeEditor.target).val('0003');//库存
		     $(unitnameEditor.target).combobox('setValue',unitname);
			 var dispensFacotr=selectedRow.dispensFacotr;  //零售系数
			 var warehousFacotr=selectedRow.warehousFacotr;//库存系数
			 var salesPriceEditor = $('#bill').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
			 wholesalesPrice =  warehousFacotr*wholesalesPrice/dispensFacotr;//库存系数*零售单价/零售系数
			 salesPrice = warehousFacotr*salesPrice/dispensFacotr;
			 $(salesPriceEditor.target).val(salesPrice);
			 var wholesalesPriceEditor = $('#bill').datagrid('getEditor', {index:selectedIndex,field:'wholesalesPrice'});
			 $(wholesalesPriceEditor.target).val(wholesalesPrice);
			 
			 var newwholesalesPrice = $(newwholesalesPriceEditor.target).val();
			 var  salesDifference=roundFun((newwholesalesPrice-wholesalesPrice),2);
			 $(salesDifferenceEditor.target).val(salesDifference);
			   
			 var newsalesPrice = $(newsalesPriceEditor.target).val();
			 var  wholesalesDifference=roundFun((newsalesPrice-salesPrice),2);
			 $(totalplEditor.target).val(wholesalesDifference);
		 }
	 }
};
function saveBill(){
	var fl=false;
	var length = $CommonUI.getDataGrid('#bill').datagrid('getRows').length;
	if(length==0){
		$CommonUI.alert("保存不能为空!");
		return; 
	}
	var isfinished =$('#bill').datagrid('getRows')[0].isfinished;
//	if(isfinished==1){
////		$CommonUI.alert("已审核,不可操作!");
//		return;
//	}
	if(isfinished!=1){
		if(length != 0){
			var d1=""; d2=""; d3="";d4="";
			for(var i=0;i<length;i++){
				var ed4 = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:i,field:'unitname'});
				var ed1 = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:i,field:'newwholesalesPrice'});
				var ed2 = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:i,field:'newsalesPrice'});
				var ed3 = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:i,field:'adjustDatetime'});
				if(ed4!=null){
					d4 = $(ed4.target).combobox('getValue');
				}else{
					d4=$CommonUI.getDataGrid('#bill').datagrid('getRows')[i].unitname;
				}
				if(ed1!=null){
					d1 = $(ed1.target).val();
				}else{
					d1=$CommonUI.getDataGrid('#bill').datagrid('getRows')[i].newwholesalesPrice;
				}
				if(ed2!=null){
					d2 = $(ed2.target).val();
				}else{
					d2=$CommonUI.getDataGrid('#bill').datagrid('getRows')[i].newsalesPrice;
				}
				if(ed3!=null){
					d3 = $(ed3.target).datebox('getValue');
				}else{
					d3=$CommonUI.getDataGrid('#bill').datagrid('getRows')[i].adjustDatetime;
				}
				var today = formatterDate(new Date());
				var compare=dateCompare(d3,today);
				if(compare=='-1'){
					$CommonUI.alert("第"+(i+1)+"行生效日期不小于当天！请重新输入日期!");
					return;
				}
				if(d1!=null && d1!="" &&d2!=null && d2!="" &&d3!=null && d3!="" &&d4!=null && d4!=""){
					$('#bill').datagrid('endEdit', i);
				}else{
					fl = true;
				}
			}
		}
	}
	if(fl){
		$CommonUI.alert("单位、新购入价、新零售价、生效日期不能为空!");
		return;
	}
	getSaveDatas();
	flag1=1;
}
var quantityOrPriceEdit = function(index,field,value){
	var ed = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:index,field:''+field+''});
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
		   var selectedRow = $('#bill').datagrid("getSelected");
		   var selectedIndex = $('#bill').datagrid("getRowIndex", selectedRow);
		   var newwholesalesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'newwholesalesPrice'});
		   var wholesalesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'wholesalesPrice'});
		   var salesDifferenceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'salesDifference'});
		   var newsalesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'newsalesPrice'});
		   var salesPriceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
		   var wholesalesDifferenceEditor=$CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:selectedIndex,field:'wholesalesDifference'});
		   if(field=='newwholesalesPrice'){ 
			   var newwholesalesPrice = $(newwholesalesPriceEditor.target).val();
			   var wholesalesPrice = $(wholesalesPriceEditor.target).val();
			  var  salesDifference=roundFun((newwholesalesPrice-wholesalesPrice),2);
			   $(salesDifferenceEditor.target).val(salesDifference);
		   }else if(field=='newsalesPrice'){
			   var newsalesPrice = $(newsalesPriceEditor.target).val();
			   var salesPrice = $(salesPriceEditor.target).val();
			   var  wholesalesDifference=roundFun((newsalesPrice-salesPrice),2);
			   $(wholesalesDifferenceEditor.target).val(wholesalesDifference);
		   }
		});
		$(ed.target).focusout(function(){
			$(this).unbind();//移除绑定事件
			$(this).blur();//丢失焦点以后移除焦点
		});
	}
};
function getSaveDatas(){
	if(flag1=='2'){
		$CommonUI.alert("已审核！");
		return;
	}
	json = $('#bill').datagrid('getData');
	var Str="";
	var rows=json.rows;
	var Fields = new Array();
	var j=0;
	var adjustid =$('#bill').datagrid('getRows')[0].adjustid;
	for(var i=0; i<rows.length; i++)
	{
		if(rows[i].itemid==""||rows[i].itemid==undefined){
			continue;
		}
		var Field = new Object();
		Field.uuid=rows[i].uuid;//uuid
		Field.itemid=rows[i].itemid;//项目编码
		Field.batchcode=rows[i].batchcode;//项目批号
		Field.itemSpec=rows[i].itemSpec;//itemSpec  规格
		Field.unitname = rows[i].unitname;//单位
		
		if(rows[i].factor!=""&&rows[i].factor!=null){
			Field.dispensFacotr = rows[i].factor;//零售系数
		}else{
			Field.dispensFacotr = rows[i].dispensFacotr;//零售系数
		}
		Field.warehousFacotr = rows[i].warehousFacotr;//入库系数
		Field.wholesalesPrice = rows[i].wholesalesPrice;//原购入价  旧批发价(进价)
		Field.salesPrice = rows[i].salesPrice;//原零售价      旧零售价
		if((rows[i].oldsalesPrice!=""&&rows[i].oldsalesPrice!=undefined)&&(rows[i].oldwholesalesPrice!=""&&rows[i].oldwholesalesPrice!=undefined)){
			Field.oldwholesalesPrice = rows[i].oldwholesalesPrice;//原购入价  旧批发价(进价)
			Field.oldsalesPrice = rows[i].oldsalesPrice;//原零售价      旧零售价
		}else{
			Field.oldwholesalesPrice = rows[i].wholesalesPrice;//原购入价  旧批发价(进价)
			Field.oldsalesPrice = rows[i].salesPrice;//原零售价      旧零售价
		}
		Field.newwholesalesPrice = rows[i].newwholesalesPrice;//新购入价   新批发价(进价)
		Field.newsalesPrice = rows[i].newsalesPrice;//新零售价
		Field.adjustReason = rows[i].adjustReason;//调价原因
		Field.wholesalesDifference = rows[i].wholesalesDifference;
		Field.unittype=rows[i].unittype;//单位名称
		Field.salesDifference = rows[i].salesDifference;
		Field.adjustDatetime = rows[i].adjustDatetime+" 23:59:59";//生效日期
		Fields[j] = Field;
		j++;
	}
	Str = $.toJSON(Fields);
	//if (adjustid == "" || adjustid == null) {
	
	var url=$WEB_ROOT_PATH + '/drugsAdjustPrice/adjustpricebillCtrl.ajax?BLHMI=save';
	postReq(url, null,function(d){
		 $CommonUI.alert("保存成功");
		 var index = $('#bill').datagrid('getRows').length;
		 $.each(data.uuids, function(i, uuidBean) {
			 $('#bill').datagrid('getRows')[i].uuid = uuidBean.uuid;
			 $('#bill').datagrid('getRows')[i].adjustid = data.adjustid;
		 });
//		 for ( var i = 0; i < index; i++) {
//			 $('#bill').datagrid('getRows')[i].uuid = d["dto.meprsublist"][i].uuid;
//			 $('#bill').datagrid('getRows')[i].adjustid = d["dto.meprsublist"][i].adjustid;
//		 }
		// $('#sureBtn').linkbutton('enable');
		 $('#sureBtn').attr('disabled',false);
		
	},function(){
		$CommonUI.autoCloseCenterMessage("保存失败","info","",500);
	},{skipHidden : false},{"fields":Str,"adjustid":adjustid});

//	}
//	else{
//		var url=$WEB_ROOT_PATH + '/drugsAdjustPrice/adjustpricebillCtrl.ajax?BLHMI=save';
//		postReq(url, null,function(d){
//			 $CommonUI.alert("修改成功");
//			 var index = $('#bill').datagrid('getRows').length;
//			 for ( var i = 0; i < index; i++) {
//				 $('#bill').datagrid('getRows')[i].uuid = d["dto.meprsublist"][i].uuid;
//			 }
//			//$('#sureBtn').linkbutton('enable');
//			 $('#sureBtn').attr('disabled',false);
//		},function(){
//			$CommonUI.autoCloseCenterMessage("修改失败","info","",500);
//		},{skipHidden : false},{"fields":Str,"adjustid":adjustid});
//	}
}
//打开已有调价单查询页面
function queryOverBill(){
	///$("#uid").val("");
	$('#queryOverAdjustPriceBillDLg').dialog('open').dialog('center');
	$CommonUI.getForm('#form1').form('clear');
	$CommonUI.getDataGrid('#queryOverBillWindow').datagrid({ 
	    url: $WEB_ROOT_PATH +'/drugsAdjustPrice/adjustPriceCtrl.ajax?BLHMI=searchBillRecord', 
	    fitColumns:true,
	    method:'post',
	    autoSave:true,
	    pagination: true,
	    singleSelect:false,
	    height:335,
	    width:'100%',
	    columns:[[ 
                {field:'ck',checkbox:true},
	  	        {field:'adjustid',title:'调价单号',width:190,align:'center'},
		        {field:'inputDatetime',title:'建单日期',width:190,align:'center',
	  	        	formatter:function(value,row,index){
	  					if(row.inputDatetime!=""&&row.inputDatetime!=null){
								var inputDatetime = row.inputDatetime.substr(0,10);
								return inputDatetime;
							}
	  				}}, 
	  	        {field:'empname',title:'制单人',width:190,align:'center'},
		        {field:'isfinished',title:'审核状态',width:190,align:'center',
	  	        	formatter:function(value,row,index){ 
 						isfinished=row.isfinished;
 						if(isfinished=='0'){
 							return "未审核";
 						}
 						else if(isfinished=='1'){
 							return "已审核";
 						}
	  	        	}
		        }, 
		        {field:'checkname',title:'审核人',width:190,align:'center'}, 
		        {field:'deleteRow',title:'操作',width:210,align:'center',
		        	formatter:function(value,row,index){
		        	return a = '<a href="javascript:void(0)" onclick="lookOver(\''+row.adjustid+'\',\''+row.isfinished+'\',\''+index+'\')">查看</a> ';
		        }
		        
		 }]],queryParams:{"isfinished":''}  
	}); 
}
//调价单操作中查看按钮
function lookOver(adjustid,isfinished,index){
	if(isfinished=="0"){//已保存
		flag1="1";
		for(var i=0;i<length;i++){
			$('#bill').datagrid('endEdit', i);
		}
		$('#sureBtn').attr('disabled',false);
	}else if(isfinished=="1"){//已审核
		flag1="2";
	}
	$("#adjustid1").val(adjustid);
	$('#queryOverAdjustPriceBillDLg').dialog('close');
	$CommonUI.getDataGrid('#bill').datagrid({ 
		queryParams:{"adjustid":adjustid},
		url: $WEB_ROOT_PATH +'/drugsAdjustPrice/prSubList.ajax?BLHMI=searchDetailedRecord',
		columns:[[  
			        {field : "ck1",checkbox : true,width : 80,align : 'center'},
		  			{title : "系数",field : "dispensFacotr",width : 110,align : 'center',hidden:true},
		  			{title : "uuid",field : "uuid",width : 111,align : 'center',hidden:true},
		  			{title : "adjustid",field : "adjustid",width : 111,align : 'center',hidden:true},
		  			{title : "药品名称",field : "itemname",width : 110,align : 'center'},
		  			{title : "规格", field : "itemSpec",width : 80,align : 'center'},
		  			{title : "包装单位类型",field: "unittype",align:'center',editor:{type:'text'},hidden:true},
		  			{title : "单位", field:"unitname",width:80,align:'center'},
		  			{title : "原购入价",field : "wholesalesPrice",width : 80,align : 'center',formatter:function(value,row,index){
		  				if(row.oldwholesalesPrice!=""&&row.oldwholesalesPrice!=null){
		  					return row.oldwholesalesPrice;}
		  				else{return row.wholesalesPrice;}
		  				}},
		  			{title : "原零售价",field : "salesPrice",width : 80,align : 'center',formatter:function(value,row,index){
		  				if(row.oldsalesPrice!=""&&row.oldsalesPrice!=null){
	  					return row.oldsalesPrice;}
		  				else{return row.salesPrice;}}},
	  	    		/*{title : "原购入价",field : "oldwholesalesPrice",width : 80,align : 'center',editor:{type:'text'}},
		  			{title : "原零售价",field : "oldsalesPrice",width : 80,align : 'center',editor:{type:'text'}},*/
		  			{title : "新购入价",field : "newwholesalesPrice",width : 80,align : 'center',editor:{type:'text'}},
		  			{title : "新零售价",field : "newsalesPrice",width : 80,align : 'center',editor:{type:'text'}},
		  			{title : "生效日期",field : "adjustDatetime",width : 90,align : 'center'
		  				,formatter:function(value,row,index){
		  					if(row.adjustDatetime!=""&&row.adjustDatetime!=null){
									var adjustDatetime = row.adjustDatetime.substr(0,10);
									return adjustDatetime;
								}
		  				},editor: {type: 'datebox',options:{editable:false}}},
		  			{title : "调价原因",field : "adjustReason",width : 90,align : 'center',editor: {type: 'text'}},
		  			{title : "购入价差额",field : "salesDifference",width : 90,align : 'center'},
		  			{title : "零售价差额",field : "wholesalesDifference",width : 90,align : 'center'},
		  			{field:'deleteRow1',title:'操作',width:70,align:'center',formatter:function(value,row,index){
			        	return a = '<a href="javascript:void(0)" (\''+row.adjustid+'\',\''+row.isfinished+'\',\''+index+'\')">删除</a> ';
					}}
				 ]]
	}); 
}

function queryBill(){
	//条件查询   调价单号       建单日期   审核状态
	var adjustid="";var startDate="";var endDate="";var isfinished="";
	adjustid= $('#adjustid').val();
	startDate =$CommonUI.getDateBox('#startDate').datebox('getValue');	
	endDate=$CommonUI.getDateBox('#endDate').datebox('getValue');	
	isfinished=$CommonUI.getComboBox('#isfinished').combobox('getValue');
	
/*	if((startDate=="")&&(endDate!="")||(startDate!="")&&(endDate=="")){
		if(startDate == ""){
			$CommonUI.alert("请选择开始日期！");
		}else{
			$CommonUI.alert("请选择结束日期！");
		}
	}else{*/
	if(startDate != '' && endDate != ''){	
		if(startDate>endDate){
			$CommonUI.alert("结束日期不能小于开始日期！");
		}
	}
	$CommonUI.getDataGrid('#queryOverBillWindow').datagrid({ 
    url: $WEB_ROOT_PATH +'/drugsAdjustPrice/adjustPriceCtrl.ajax?BLHMI=searchBillRecord',
    queryParams:{
		"uuid":adjustid,
		"startDate":startDate,
		"endDate":endDate,
		"status":isfinished}
	}); 
//	}
/*	var compare= dateCompare(endDate,startDate);
	if((startDate==null||startDate=="")&&(endDate==null||endDate=="")){
		$CommonUI.getDataGrid('#queryOverBillWindow').datagrid({ 
			url: $WEB_ROOT_PATH +'/adjustpricebill/adjustpricebillCtrl.htm?BLHMI=searchBillRecord',
			queryParams:{"dto.mePrHd.adjustid":adjustid,"dto.mePrHd.isfinished":isfinished}
		}); 
	}else if(startDate!=null&&startDate!=""&&endDate!=null&&endDate!=""){
		if(compare=='0'||compare=='1'){
			startDate=startDate+" 00:00:00";
			endDate=endDate+" 23:59:59";
		$CommonUI.getDataGrid('#queryOverBillWindow').datagrid({ 
		    url: $WEB_ROOT_PATH +'/adjustpricebill/adjustpricebillCtrl.htm?BLHMI=searchBillRecord',
		    queryParams:{
				"dto.mePrHd.adjustid":adjustid,
				"dto.startDate":startDate,
				"dto.endDate":endDate,
				"dto.mePrHd.isfinished":isfinished}
			}); 
		}else{
			$CommonUI.alert("开始时间小于等于结束时间!");
		}
	}else {
		$CommonUI.alert("如果按时间查询，请输入开始和结束时间！");
	}*/
}
//父页面datagrid中删除按钮
function deleteRow(index){
	$CommonUI.getDataGrid('#bill').datagrid('deleteRow',index);
	var data = $CommonUI.getDataGrid('#bill').datagrid('getData');
	$CommonUI.getDataGrid('#bill').datagrid('loadData',data);
	setAllEditor();
}

//选择药品查询
function medetailpursearch(){
	var inputStr=$('#inputStr').val();
	var cateid=$('#cateid').combobox('getValue');
	$CommonUI.queryForDataGrid("#queryDrugBillWindow",{
		page : 1,rows : 10,
		"medicine":inputStr,
		"cateId":cateid
	});
}
//药品选择关闭
function billclose(){
	$('#medChooseDlg').dialog('close');
}
//调价记录选择关闭
function closesonBill(){
	$('#medChooseDlg').dialog('close');
}
function closesonOverAdjust(){
	$('#queryOverAdjustPriceBillDLg').dialog('close');
}
function clearning(){
	$CommonUI.getDataGrid('#bill').datagrid('loadData',{"total":"0","rows":[]});
}
formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
	};
 function   roundFun(numberRound,roundDigit){    //四舍五入，保留位数为roundDigit      
	 if(numberRound>=0){  
		 var   tempNumber   =   parseInt((numberRound   *   Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);   
	 	 return   tempNumber;
	 }else{	
		 numberRound1=-numberRound;
	 	 var   tempNumber   =   parseInt((numberRound1   *   Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);   
	 	 return   -tempNumber;   
	 }   
  }
 function sureApproval(){
	 var adjustid =$("#adjustid1").val();
	var length = $CommonUI.getDataGrid('#bill').datagrid('getRows').length;
	if(length == 0){
		$CommonUI.alert("没有调价可审批！");
	}else{
		
		//$('#sureBtn').linkbutton('disable');
		 $('#sureBtn').attr('disabled',false);
		var isfinished= $CommonUI.getDataGrid('#bill').datagrid('getRows')[0].isfinished;
		if(isfinished==1){
			$CommonUI.alert("已审核！");
			return;
		}else{
			for(var i=0;i<length;i++){
				var ed3 = $CommonUI.getDataGrid('#bill').datagrid('getEditor', {index:i,field:'adjustDatetime'});
				
				if(ed3!=null){
					d3 = $(ed3.target).datebox('getValue');
				}else{
					d3=$CommonUI.getDataGrid('#bill').datagrid('getRows')[i].adjustDatetime;
				}
				var today = formatterDate(new Date());
				var compare=dateCompare(d3,today);
				if(compare=='-1'){
					$CommonUI.alert("第"+(i+1)+"行生效日期不小于当天！请重新输入日期!");
					return;
				}
			}
			$CommonUI.confirm('确定要审核吗？', 'question', 0, function(){
				$.post($WEB_ROOT_PATH+"/drugsAdjustPrice/adjustpricebillCtrl.ajax?BLHMI=update",
						{'adjustid':adjustid}, 
					function(data){
							if(data.result=='1'){
			    				$CommonUI.autoCloseCenterMessage("调价成功！","info","",500);
			    				$CommonUI.getDataGrid('#bill').datagrid('loadData',{"total":"0","rows":[]});
		    				}else if(d['dto.total']==1){
		    					$CommonUI.autoCloseCenterMessage("调价失败！","info","",500);
		    					 $CommonUI.getDataGrid('#bill').datagrid('loadData',{"total":"0","rows":[]});
		    				}
		    				$('#sureBtn').attr('disabled',true);
		    				
				},'json');
			});
		}
	}
}	
