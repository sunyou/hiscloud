var deleteflag="1";
var entidori=null;
var descriptionori=null;
$(function(){
	$CommonUI.getComboBox('#orgidApply').combobox({  
	    url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
	    valueField:'orgid',  
	    textField:'orgname'  
	});  
	$CommonUI.getComboBox('#orgidApply1').combobox({  
	    url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
	    valueField:'orgid',  
	    textField:'orgname'  
	});  
	
	PlaceHolder.create(document.getElementById('inputStr'));
	$CommonUI.getDateBox("#policymakDate").datebox("setValue",formatterDate(new Date()));
	$CommonUI.getDataGrid('#plandatagrid').datagrid({
		url: '', 
		rownumbers:false,
	    fitColumns:false,
	    method:'post',
	    pagination: false,
	    singleSelect:true,
	    height:328,
	    width:'100%',
	    columns:[[ 
	                {field:'ck',checkbox:true},
	                {field:'uuid',width:20,title:'唯一编码',hidden:true},
	                {field:'itemid',title:'药品编码',width:20,align:'center',hidden:true},
			        {field:'salesPrice',title:'售价',width:20,align:'center',editor:{type:'text'},hidden:true},
		  	        {field:'quantity',title:'基本单位数量',width:20,align:'center',editor:{type:'text'},hidden:true},
		  	        {field:'factor',title:'包装单位换算系数',width:20,align:'center',editor:{type:'text'},hidden:true},
		  	        {field:'unittype',title:'包装单位类型',width:20,align:'center',editor:{type:'text'},hidden:true},
	               
		  	        {field:'itemname',title:'药品名称',width:170,align:'center'},
		  	        {field:'unitquantity',title:'订购数量',width:115,align:'center',editor:{type:'text',options:{}}}, 
			        {field:'unitname',title:'订货单位',width:115,align:'center',editor:{type:'combobox',options:{valueField: 'value',textField: 'value',editable:false,panelHeight:'auto',onSelect:onChange}}},
			        {field:'purchaseprice',title:'进价',width:110,align:'center',editor:{type:'text'}},
			        {field:'totalpl',title:'药品总价',width:160,align:'center',editor:{type:'text'}},
			        {field:'itemDosename',title:'剂型',width:160,align:'center'},
			        {field:'producerName',title:'产地',width:200,align:'center'},
			        {field:'deleteRow',title:'操作',width:100,align:'center',formatter:function(value,row,index){
 						var a = '<a href="javascript:void(0)">删除</a> ';
 						return a;
		             }}
		         ]],
	     onDblClickRow: function(rowIndex, rowData){
		 	$('#plandatagrid').datagrid('endEdit',rowIndex);
	 		$('#plandatagrid').datagrid('beginEdit',rowIndex);
	 		var unitnameEditor = $('#plandatagrid').datagrid('getEditor', {index:rowIndex,field:'unitname'});
	 		if(rowData.warehousUnit==null||rowData.warehousUnit==''){
				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
	 		}else{
	 			if(rowData.dispensUnit==rowData.warehousUnit){
					$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
		 		}else{
					$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.dispensUnit},{"value":rowData.warehousUnit}]});
		 		}
	 		}
			var totalplEditor=$('#plandatagrid').datagrid('getEditor', {index:rowIndex,field:'totalpl'});
			$(totalplEditor.target).attr("disabled","disabled");
			var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:rowIndex,field:'purchaseprice'});
			$(priceEditor.target).attr("disabled","disabled");
	     },
	     onClickCell: function(index,field,value){
	    	 if(deleteflag=="0"){
	    		 if(field =='deleteRow'){$CommonUI.alert("已审核，不可删除！");}
	    		//$CommonUI.alert("已审核,不可操作!");
	    		return;
     		 }else if(field == 'unitquantity'){
    			var ed = $CommonUI.getDataGrid('#plandatagrid').datagrid('getEditor', {index:index,field:''+field+''});
    			if(ed !=null){
    				$(ed.target).keyup(function(){
    					//简单实现numberbox功能
    				   if(this.value.indexOf(".")==this.value.lastIndexOf(".")){
    					   $(ed.target).val($(ed.target).val().replace(/[^\d.]/g,''));
    					   if(this.value.indexOf(".")!=-1){
    						   this.value = this.value.substr(0, this.value.indexOf(".")+3);  //小数点后两位
    					   }
    				   }else{
    					   this.value = this.value.substr(0, this.value.length - 1);
    					}
    				   this.value = this.value.substr(0, 8);//长度8位
    				   onChange();
    				});
//    				当焦点失去时，注销绑定事件（避免绑定多次造成多次调用函数），移除焦点（不移除焦点再次输入时，已经没有绑定keyup事件）
    				$(ed.target).focusout(function(){
    					$(this).unbind();//移除绑定事件
    					$(this).blur();//丢失焦点以后移除焦点
    				});
    			}
	    	 }else if(field =='deleteRow'){
	    		 deleteRow(index);
	    	 }
	     }
	});
});
	 
	
//根据订购单位和数量计算药品总价和订购总价
var onChange=function(){
  	  var selectedRow = $('#plandatagrid').datagrid("getSelected");
      var selectedIndex = $('#plandatagrid').datagrid("getRowIndex", selectedRow);
      var unitnameEditor = $('#plandatagrid').datagrid('getEditor',{index:selectedIndex,field:'unitname'});
      var unitname=$(unitnameEditor.target).combobox('getValue');
  	  var unitquantityEditor = $('#plandatagrid').datagrid('getEditor',{index:selectedIndex,field:'unitquantity'});
  	  var unitquantity=$(unitquantityEditor.target).val();
  	  var totalplEditor = $('#plandatagrid').datagrid('getEditor', {index:selectedIndex,field:'totalpl'});
	  /*var quantityEditor = $('#plandatagrid').datagrid('getEditor',{index:selectedIndex,field:'quantity'});*/
	  var factorEditor=$('#plandatagrid').datagrid('getEditor',{index:selectedIndex,field:'factor'});
	  var unittypeEditor=$('#plandatagrid').datagrid('getEditor',{index:selectedIndex,field:'unittype'});
	  var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:selectedIndex,field:'purchaseprice'});
	  var salesPriceEditor=$('#plandatagrid').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
  	  //计算药品总价
	  if(unitname!=undefined&&unitquantity!=undefined){
  		  if(unitname==selectedRow.dispensUnit){
  			$(totalplEditor.target).val((unitquantity*selectedRow.wholesalesPrice).toFixed(2)); 
  			/*$(quantityEditor.target).val(unitquantity*selectedRow.dispensFacotr);*/
  			$(factorEditor.target).val(selectedRow.dispensFacotr);
  			$(unittypeEditor.target).val('0002');
  			$(priceEditor.target).val(selectedRow.wholesalesPrice);
	  			if(selectedRow.salesPrice2==null){
	   			 $(salesPriceEditor.target).val(selectedRow.salesPrice);//售价
	   		 }else{
	   			 $(salesPriceEditor.target).val(selectedRow.salesPrice2); 
	   		 }
  		  }else{
  	  	  	$(totalplEditor.target).val((unitquantity*selectedRow.wholesalesPrice*selectedRow.warehousFacotr/selectedRow.dispensFacotr).toFixed(2));
  	  	    $(factorEditor.target).val(selectedRow.warehousFacotr);
			$(unittypeEditor.target).val('0003');
			$(priceEditor.target).val(selectedRow.wholesalesPrice*selectedRow.warehousFacotr/selectedRow.dispensFacotr);
				if(selectedRow.salesPrice2==null){
	       		 $(salesPriceEditor.target).val((selectedRow.salesPrice/selectedRow.dispensFacotr*selectedRow.warehousFacotr).toFixed(2));
	   		 }else{
	   			 $(salesPriceEditor.target).val((selectedRow.salesPrice2/selectedRow.dispensFacotr*selectedRow.warehousFacotr).toFixed(2));
	   		 }
  		  }
	  		
  	  }
  	 //计算订购总价
	   var index = $('#plandatagrid').datagrid('getRows').length;
	   var totalPrice=0;
	   for(var i=0;i<index;i++){
		   if($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'})==null){
			  var totalpl= Number($('#plandatagrid').datagrid('getRows')[i].totalpl);
		   }else{
			   totalpl=Number($($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'}).target).val());
		   }
		   totalPrice = Number(totalPrice) + totalpl;
	   }
	   $('#total').val(totalPrice.toFixed(2));
	}; 

//选择药品按钮
function medplanChoose(){
	$('#inputStr').val('');
	$('#cateid').combobox('clear');
	if(deleteflag=="0"){
		// if(field =='deleteRow'){$CommonUI.alert("已审核，不可删除！");}
		$CommonUI.alert("已审核,不可操作!");
		return;
	}else{
		$('#medChooseplanDlg').dialog('open').dialog('center');
		/*$CommonUI.queryForDataGrid("#meddetailplanDatagrid",{
			page : 1,rows : 10
		});*/
		$CommonUI.getDataGrid('#meddetailplanDatagrid').datagrid({ 
		    url: $WEB_ROOT_PATH +'/purchaseManage/drugCommonCtrl.ajax?BLHMI=itemsList&ismeditem=1', 
		    fitColumns:true,
		    queryParams:{
				"medicine":$('#medicine').val(),
				"status":'1',
				
			},
		    method:'post',
		    pagination: true,
		    singleSelect:false,
		    height:310,
		    width:'95%',
		    onSelect:onSelect,
		    onUnselect:onUnselect,
		    pageNumber:1,
		    pageSize:10,
		    columns:[[ 
		            {field:'ck',checkbox:true},
		  	        {field:'itemname',title:'药品名称',width:190,align:'center'},
			        {field:'ordCatename',title:'药品分类',width:190,align:'center'}, 
		  	        {field:'itemid',title:'药品编码',width:190,align:'center',hidden:true },
			        {field:'itemSpec',title:'药品规格',width:190,align:'center'},
			        {field:'warehousUnit',title:'大单位',width:190,align:'center'},    
			        {field:'dispensUnit',title:'小单位',width:190,align:'center'}, 
			        {field:'itemDosename',title:'剂型单位',width:190,align:'center'},
			        {field:'producerName',title:'产地',width:210,align:'center'}
		         ]],
		    onSelectAll:function(rows) {
		    	if($CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length == 0){
		    		for(var i=0;i<rows.length;i++){
		    			$CommonUI.getDataGrid('#plandatagrid').datagrid('appendRow',rows[i]);
		    			$('#plandatagrid').datagrid('beginEdit',i);
		    			var unitnameEditor = $('#plandatagrid').datagrid('getEditor', {index:i,field:'unitname'});
		    			if(rows[i].warehousUnit==null||rows[i].warehousUnit==''){
		    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
							$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
		    			}else{
		    				if(rows[i].dispensUnit==rows[i].warehousUnit){
			    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
								$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
			    			}else{
			    				$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rows[i].dispensUnit},{"value":rows[i].warehousUnit}]});
								$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
			    			}	
		    			}
		    			var totalplEditor=$('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'});
		    			$(totalplEditor.target).attr("disabled","disabled");
		    			var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:i,field:'purchaseprice'});
		    			$(priceEditor.target).attr("disabled","disabled");
		    			$(priceEditor.target).val(rows[i].wholesalesPrice);
//		    			var entidProducerEditor=$('#plandatagrid').datagrid('getEditor', {index:i,field:'entidProducer'});
//		    			$(entidProducerEditor.target).attr("disabled","disabled");
//		    			$(entidProducerEditor.target).val(rows[i].entidProducer);
		    		  }
				}else{
		    		var flag = "";//是否可添加
		    		for(var j=0;j<rows.length;j++){
		    			for(var i=0;i<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++){
					    	if(rows[j].itemid != $CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[i].itemid){
					    		flag = true;
					    	}else{
					    		flag = false;
					    		break;
					    	}
		    			}
		    			if(flag == true){
		    	    		$CommonUI.getDataGrid('#plandatagrid').datagrid('appendRow',rows[j]);
		    	    		$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows');
		    	    		for(var k=0;k<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;k++){
			    	    		$('#plandatagrid').datagrid('beginEdit',k);
			    	    		var unitnameEditor = $('#plandatagrid').datagrid('getEditor', {index:k,field:'unitname'});
			    	    		if(rows[j].warehousUnit==null||rows[j].warehousUnit==''){
			    	    			$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[j].dispensUnit}]});
			    					$(unitnameEditor.target).combobox('setValue',rows[j].dispensUnit);
			    	    		}else{
			    	    			if(rows[j].dispensUnit==rows[j].warehousUnit){
				    	    			$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[j].dispensUnit}]});
				    					$(unitnameEditor.target).combobox('setValue',rows[j].dispensUnit);
				    	    		}else{
				    	    			$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rows[j].dispensUnit},{"value":rows[j].warehousUnit}]});
				    					$(unitnameEditor.target).combobox('setValue',rows[j].dispensUnit);
				    	    		}
			    	    		}
			    	    		var totalplEditor=$('#plandatagrid').datagrid('getEditor', {index:k,field:'totalpl'});
			    	    		$(totalplEditor.target).attr("disabled","disabled");
			    	    		var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:k,field:'purchaseprice'});
			    	    		$(priceEditor.target).attr("disabled","disabled");
			    	    		$(priceEditor.target).val(rows[j].wholesalesPrice);
//			    	    		var entidProducerEditor=$('#plandatagrid').datagrid('getEditor', {index:k,field:'entidProducer'});
//				    			$(entidProducerEditor.target).attr("disabled","disabled");
//				    			$(entidProducerEditor.target).val(rows[j].entidProducer);
		    	    		}
		    	    	}
		    		}
		    	}
		    },
			});
	}
}
//子页面药品检索clickRow事件
var GridClick = function (rowIndex,rowData){
	$CommonUI.queryForDataGrid("#meddetailplanDatagrid",{
		page : 1,rows : 10,
		"dto.itmeid":rowData.itemid,
	});
};

//选择药品Dlg确定按钮
function medeplanconfirm(){
	flag="";
	for(var j=0;j<Fields.length;j++)
		for(var k=0;k<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++){
			if (Fields[j].itemid==$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[k].itemid)
				return;
		}
	$('#medChooseplanDlg').dialog('close');
}
//选择药品关闭按钮
function medeplanclose(){
	$('#medChooseplanDlg').dialog('close');
	/*$('#plandatagrid').datagrid('getRows');*/
}
//药品选择
function onSelect(rowIndex, rowData){
	if($CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length==0){
		$CommonUI.getDataGrid('#plandatagrid').datagrid('appendRow',rowData);
		LastIndex=$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length-1;
		$('#plandatagrid').datagrid('beginEdit', 0);
		var unitnameEditor = $('#plandatagrid').datagrid('getEditor', {index:0,field:'unitname'});
		if(rowData.warehousUnit==null||rowData.warehousUnit==''){
			$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
			$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
		}else{
			if(rowData.dispensUnit==rowData.warehousUnit){
				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
				$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
	 		}else{
				$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.dispensUnit},{"value":rowData.warehousUnit}]});
				$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
	 		}
		}
		var totalplEditor=$('#plandatagrid').datagrid('getEditor', {index:0,field:'totalpl'});
		$(totalplEditor.target).attr("disabled","disabled");
		var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:0,field:'purchaseprice'});
		$(priceEditor.target).attr("disabled","disabled");
		$(priceEditor.target).val(rowData.wholesalesPrice);
//		var entidProducerEditor=$('#plandatagrid').datagrid('getEditor', {index:0,field:'entidProducer'});
//		$(entidProducerEditor.target).attr("disabled","disabled");
//		$(entidProducerEditor.target).val(rowData.entidProducer);
	}else{
		var flag=true;
		for(var i=0;i<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++){
			if(rowData.itemid == $CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[i].itemid){
				flag=false;
				break;
			}
		};
		if(flag){
			$CommonUI.getDataGrid('#plandatagrid').datagrid('appendRow',rowData);
			LastIndex=$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length-1;
			$('#plandatagrid').datagrid('beginEdit', LastIndex);
			var unitnameEditor = $('#plandatagrid').datagrid('getEditor', {index:LastIndex,field:'unitname'});
			if(rowData.warehousUnit==null||rowData.warehousUnit==''){
				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
				$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
			}else{
				if(rowData.dispensUnit==rowData.warehousUnit){
					$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
					$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
		 		}else{
					$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.dispensUnit},{"value":rowData.warehousUnit}]});
					$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
		 		}
			}
			var totalplEditor=$('#plandatagrid').datagrid('getEditor', {index:LastIndex,field:'totalpl'});
			$(totalplEditor.target).attr("disabled","disabled");
			var priceEditor=$('#plandatagrid').datagrid('getEditor', {index:LastIndex,field:'purchaseprice'});
			$(priceEditor.target).attr("disabled","disabled");
			$(priceEditor.target).val(rowData.wholesalesPrice);
//			var entidProducerEditor=$('#plandatagrid').datagrid('getEditor', {index:LastIndex,field:'entidProducer'});
//			$(entidProducerEditor.target).attr("disabled","disabled");
//			$(entidProducerEditor.target).val(rowData.entidProducer);
		}
	};
};

function onUnselect(rowIndex, rowData){
	for(var i=0;i<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++)
		if(rowData.itemid==$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[i].itemid)
	$CommonUI.getDataGrid('#plandatagrid').datagrid('deleteRow',i);
}
//删除按钮
function deleteRow(index){
	var row=$CommonUI.getDataGrid('#plandatagrid').datagrid('getData')["rows"][index];
	var uuid=row.uuid;
	//分为两种情况，保存前后删除处理不同
	if (uuid == "" || uuid == null) {
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
		$CommonUI.getDataGrid('#plandatagrid').datagrid('deleteRow',index);	
		//计算订购总价
		var length = $('#plandatagrid').datagrid('getRows').length;
		var totalPrice=0;
		var totalpl1=0;
		for(var i=0;i<length;i++){
			if($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'})==null){
				totalpl1=Number($('#plandatagrid').datagrid('getRows')[i].totalpl);
			}else{
				totalpl1=Number($($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'}).target).val());
			}
		   totalPrice = Number(totalPrice) +totalpl1;
		}
		$('#total').val(totalPrice.toFixed(2));
		}); 
	}else{
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
			postReq($WEB_ROOT_PATH+ '/purchaseManage/stockMgrCtrl.ajax?BLHMI=deleteById&uuidplan='+uuid, '', function(data) {
				if(data.result=='1'){
					
				
					$CommonUI.alert("删除成功");
					$('#plandatagrid').datagrid("deleteRow", index);
					//计算订购单价
					var length = $('#plandatagrid').datagrid('getRows').length;
				    var totalPrice=0;
				    for(var i=0;i<length;i++){
				    	if($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'})==null){
							totalpl2=Number($('#plandatagrid').datagrid('getRows')[i].totalpl);
						}else{
							totalpl2=Number($($('#plandatagrid').datagrid('getEditor', {index:i,field:'totalpl'}).target).val());
						}
					   totalPrice = Number(totalPrice) + totalpl2;
				    }
				    $('#total').val(totalPrice.toFixed(2));
					/*$('#creatPlanBtn').linkbutton('disable');*/
				    $('#creatPlanBtn').attr('disabled',true); 
				}else{
					$CommonUI.alert("删除失败");
				}
						}, function() {
						$CommonUI.alert("删除失败");
					}, {
						skipHidden : false
		},{"uuid":uuid,"uuid":$('#uuidplan').val(),"purchaseprice":row.purchaseprice,"unitquantity":row.unitquantity});
	});	
	 }	
};
//保存计划单
function savePlan(){
	if(deleteflag=="0"){
		$CommonUI.alert("已审核,不可操作!");
		return;
	}
   //判断批量保存的条件
	if($CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length==0){
		$CommonUI.alert("请填写信息！");
		return;
	}else if($('#total').val().indexOf(".")>6){
		$CommonUI.alert("药品数量过多，请修改");
		return;
	}else if($('#orgidApply').combobox('getValue')==""||$('#orgidApply').combobox('getValue')==null||$('#entid').combobox('getValue')==undefined){
		$CommonUI.alert("请完善订购科室！");
		return;
	}else if($('#entid').combobox('getValue')==""||$('#entid').combobox('getValue')==null||$('#entid').combobox('getValue')==undefined){
		$CommonUI.alert("请完善供应商信息");
		return;
	}else{
		var flag = false;
		for(var i=0;i<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++){
			var ed1 = $('#plandatagrid').datagrid('getEditor', {index:i,field:'unitname'});
			var ed2 = $('#plandatagrid').datagrid('getEditor', {index:i,field:'unitquantity'});
			var d1=undefined;
			if(ed1!=null){//!=表示处于编辑状态，结束编辑状态时，为null
				 d1 = $(ed1.target).combobox('getText');
			}else{
				 d1=$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[i].unitname;
			}
			var d2=undefined;
			if(ed2!=null){
				 d2 = $(ed2.target).val();
			}else{
				 d2=$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows')[i].unitquantity;
			}
			if(d1!=null && d1!="" && d1!= undefined && d2!=null && d2!="" && d2!= undefined){
				flag = true;
			}else{
				flag = false;
				$CommonUI.alert("请完善订购数量或订购单位信息");
				break;
			}
			}
			}
	if(flag){
		for(var j=0;j<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;j++){
			$('#plandatagrid').datagrid('endEdit',j);
		}
		/*$CommonUI.getDataGrid('#plandatagrid').datagrid('getChanges');*/
		var json = $('#plandatagrid').datagrid('getData');
		var rows=json.rows;
		var Fields = new Array();
		for(var i=0;i<rows.length;i++){
			var Field=new Object();
			Field.uuid=rows[i].uuid;
			Field.itemid=rows[i].itemid;//药品id
			Field.quantity=rows[i].quatity;//基本单位数量
			Field.dispensUnit=rows[i].unitname;//包装单位名称
			Field.dispensQuantity=rows[i].unitquantity;//包装单位数量
			Field.facotr=rows[i].factor;//包装单位换算系数
			Field.unittype=rows[i].unittype;//单位类型
			Field.salesPrice=rows[i].salesPrice;//零售价
			Field.purchaseprice=rows[i].purchaseprice;//进价
			Fields[i]=Field;
		 }
		 Str = $.toJSON(Fields);
		 url=$WEB_ROOT_PATH +'/purchaseManage/stockMgrCtrl.ajax?BLHMI=saveplan&fields='+Str;
		var  orgidApply= $('#orgidApply').combobox('getValue');
		var policymakeUserid=$('#policymakeUserid').val();
		var policymakDate=$CommonUI.getDateBox('#policymakDate').datebox('getValue');
		 postReq(url, '#planForm',function(data){
			 if(data.result=='1'){
				 $CommonUI.alert("保存成功");
				 $CommonUI.getDataGrid('#plandatagrid').datagrid('acceptChanges');
				 $('#uuidplan').val(data.uuidPlan);
				 var index = $('#plandatagrid').datagrid('getRows').length;
				 $.each(data.uuids, function(i, uuidBean) {
					 $('#plandatagrid').datagrid('getRows')[i].uuid = uuidBean.uuid;
				 });
				 
				//启用置灰按钮
				 $('#creatPlanBtn').attr('disabled',false); 
				entidori=$('#entid').combobox('getValue');
				orgidApply=	$('#orgidApply').combobox('getValue');
				descriptionori=$('#description').val();
			 }else{
				 $CommonUI.alert("保存失败");
			 }
			
		 },function(){
			 $CommonUI.alert("保存失败");
			 },{"skipHidden":false},
			 {"pldetailString":Str,"uuid":$('#uuidplan').val(),
		      "orgidApply":orgidApply,
		      "policymakDate":policymakDate,
			  "policymakeUserid":policymakeUserid
			 });
		 
		 
		}
}

//选择药品Dlg中查询功能
function medeplansearch(){
	var inputStr=$('#inputStr').val();
	var cateid=$('#cateid').combobox('getValue');
	$CommonUI.queryForDataGrid("#meddetailplanDatagrid",{
		page : 1,rows : 10,
		"medicine":inputStr,
		"cateId":cateid
	});
}

//确认生成计划单
function creatPlan(){
	for(var k=0;k<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;k++){
		$CommonUI.getDataGrid('#plandatagrid').datagrid('endEdit',k);
	}
	//判断主表内容是否有变化
	var entid=$('#entid').combobox('getValue');
	var description=$('#description').val();
	if(entid!=entidori||description!=descriptionori){
		$CommonUI.alert("请先保存");
		$('#creatPurBtn').linkbutton('disable');
		return;
	}else if(deleteflag=="0"){
		$CommonUI.alert("已审核,不可执行此操作");
		return;
	}
	//子表datagrid内容是否有变动
	if($CommonUI.getDataGrid('#plandatagrid').datagrid('getChanges')!=""){
		//$('#creatPlanBtn').linkbutton('disable');
		$('#creatPlanBtn').attr('disabled',true); 
		$CommonUI.alert("请先保存");
		return;
	}
	//update数据
	var uuid=$('#uuidplan').val();
	postReq($WEB_ROOT_PATH+ "/purchaseManage/stockMgrCtrl.ajax?BLHMI=updateplancheck", '',function(data){
		if(data.result=='1'){
			$CommonUI.alert("生成计划单成功");
			clearPlan();
			//$('#creatPlanBtn').linkbutton('disable');
			$('#creatPlanBtn').attr('disabled',true); 
		}else{
			$CommonUI.alert("生成计划单失败");
		}
		
	 },function(){},{"skipHidden":false},{"uuid":uuid});	
	}

//清空
function clearPlan(){
	$('#uuidplan').val('');
	$('#total').val('');
	$('#entid').combobox('clear');
	$('#description').val('');
	$('#selectItemsBtn').removeAttr("disabled");

	$CommonUI.getDataGrid('#plandatagrid').datagrid('loadData',{"total":"0","rows":[]});
	deleteflag="1";
}
//历史计划
function historyPlan(){
	$('#historyplanDlg').dialog('open').dialog('center');
	//置空计划单号订购日期
	$('#uuid').val('');
	$('#policymakDate1').datebox('clear');
	$('#policymakDate2').datebox('clear');
	$CommonUI.getDataGrid('#historyplanDatagrid').datagrid({ 
	    url: $WEB_ROOT_PATH+ '/purchaseManage/drugPlanCtrl.ajax', 
	    fitColumns:true,
	    method:'post',
	    rownumbers:true,
	    pagination: true,
	    singleSelect:true,
	    height:310,
	    width:'100%',
	    columns:[[ 
	            {field:'ck',checkbox:true},
	  	        {field:'uuid',title:'计划单号',width:180,align:'center'},
		        {field:'description',title:'计划描述',width:130,align:'center'}, 
	  	        {field:'amountTotal',title:'订购总金额(元)',width:120,align:'center'},
		        {field:'policymakDate',title:'订购日期',width:120,align:'center',
	  	        	formatter:function(value,row,index){
    		    		if(row.policymakDate!=""&&row.policymakDate!=null){
 							var policymakDate = row.policymakDate.substr(0,10);
 							return policymakDate;
 							
 						}
    		    		
    		    	}	
		        }, 
		        {field:'empname',title:'制单人',width:110,align:'center'}, 
		       /* {field:'orgnameApply',title:'订购部门',width:120,align:'center'},    */
		        {field:'entname',title:'供应商',width:160,align:'center'},
		        {field:'policycheckUserid',title:'状态',width:100,align:'center',formatter:function(value,row,index){
		        	if (value==undefined){
		        		return "未审核";
		        	}else{
		        		return "已审核";
		        	}
		        }},
		        {field:'overview',title:'操作',width:80,align:'center',formatter:function(value,row,index){
						var a = '<a href="#" onclick="overview(\''+row.policycheckUserid+'\',\''+row.uuid+'\',\''+row.orgidService+'\',\''+row.description+'\',\''+row.orgidApply+'\',\''+row.amountTotal+'\')">查看</a> ';
						return a;
				}},
	         ]],
		});
}

//历史计划查询
function histroyplansearch(){
	var uuid=$('#uuid').val();
	var policymakDate1=$CommonUI.getDateBox('#policymakDate1').datebox('getValue');
	var policymakDate2=$CommonUI.getDateBox('#policymakDate2').datebox('getValue');
	var orgidApply=$CommonUI.getComboBox('#orgidApply1').combobox('getValue');
	if(policymakDate1!=''&&policymakDate2!=''){
		if(policymakDate1>policymakDate2){
			$CommonUI.alert("结束日期不能小于开始日期！");
		}
	}
	$CommonUI.queryForDataGrid("#historyplanDatagrid",{
		page : 1,rows : 10,
		"uuid" : uuid,
		"startDate":policymakDate1,
		"endDate":policymakDate2,
		"orgName":orgidApply
	});
}
//历史计划关闭
function histroyplanclose(){
	$('#historyplanDlg').dialog('close');
}
//历史计划查看
function overview(policycheckUserid,uuid,entid,description,orgnameApply,amountTotal){
	if( policycheckUserid == ''||policycheckUserid == 'undefined'){  //注意判断条件为字符串null未审核
		deleteflag="1";
	}else{
		deleteflag="0";
	}
	$.getJSON($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=listplansub', {
		"uuid" : uuid,
	}, function(data) {
		$CommonUI.getDataGrid('#plandatagrid').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
		for ( var i = 0; i < $CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length; i++) {
			$('#plandatagrid').datagrid('getRows')[i].uuid =data.mePlSubBean[i].uuid;
			$('#plandatagrid').datagrid('endEdit',i);//选择药品会开启编辑状态
		}
		$('#orgidApply').combobox('setValue',orgnameApply);
		$('#entid').combobox('setValue',entid);
		
		$('#uuidplan').val(uuid); 
		if(amountTotal!='undefined'){
			$('#total').val(amountTotal);
		}
		if(description!='undefined'){
			$('#description').val(description);
		}
		 if(deleteflag=="0"){
			 $('#selectItemsBtn').attr("disabled","disabled");
		 }
		
	});
	$('#historyplanDlg').dialog('close');
};

function medchoose(){
	var flag=true;	
	var rows=$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows');
	var inputstr=$('#medicine').val();
	var inputstrl=inputstr.toLowerCase();
	var inputstru=inputstr.toUpperCase();
	if(inputstr==""){
		return;
	}
	$('#plandatagrid').datagrid('unselectAll');
	$('#plandatagrid').datagrid('options').singleSelect=false;
	for(var i=0;i<$CommonUI.getDataGrid('#plandatagrid').datagrid('getRows').length;i++){
		
		if((rows[i].itemname).indexOf(inputstrl)!=-1||(rows[i].inputstr).indexOf(inputstrl)!=-1||(rows[i].itemname).indexOf(inputstru)!=-1||(rows[i].inputstr).indexOf(inputstru)!=-1){
			flag=false;
			$CommonUI.getDataGrid('#plandatagrid').datagrid('selectRow',i);
			//break;
		};
	}
	if(flag){
		return;
	};
	$('#plandatagrid').datagrid('options').singleSelect=true;
	};
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
