//deleteflag  0 为审核不可修改状态 对应不可选择药品 1 正常编辑状态 可以选择药品 2 只可修改需要日期 不可选择药品
$(function(){//加载完毕后执行此函数
	$CommonUI.getComboBox('#purchasecheckOrgid').combobox({  
	    url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
	    valueField:'orgid',  
	    textField:'orgname'  
	});  
	$CommonUI.getComboBox('#orgidApply').combobox({  
	    url: $WEB_ROOT_PATH + '/purchaseManage/orgList.ajax?grade=1',  
	    valueField:'orgid',  
	    textField:'orgname'  
	});  
	PlaceHolder.create(document.getElementById('inputStr'));
	$CommonUI.getDateBox("#purchasemakeDate").datebox("setValue",formatterDate(new Date()));
	$CommonUI.getDataGrid('#medDg').datagrid({ 
	    url: '', 
	    fitColumns:true,
	    method:'post',
	    pagination: false,
	    singleSelect:true,
	    height:328,
	    width:'100%',
	    columns:[[ 
                {field:'ck',checkbox:true},
                {field:'uuid',title:'采购单子表主键',width:190,align:'center',hidden:true}, 
  	  	        {field:'itemid',title:'项目编码',width:190,align:'center',hidden:true},
  	  	        {field:'dispensFacotr',title:'零售单位系数',width:190,align:'center',hidden:true},
  	  	        {field:'itemname',title:'药品名称',width:190,align:'center',formatter:function(value,row,index){
  	  	        	if(row.itemname==null||row.itemname==undefined){
  	  	        		return row.itemCommonName;
  	  	        	}else{
  	  	        		return row.itemname;	
  	  	        	}
  	  	        }},
  		        {field:'itemSpec',title:'药品规格',width:190,align:'center'}, 
  		        {field:'unitquantity',title:'订购数量',width:190,align:'center',editor:{type:'text',options:{}}},
  	  	        {field:'unittype',title:'包装单位类型',width:190,align:'center',editor:{type:'text'},hidden:true},
			    {field:'unitname',title:'订货单位',width:190,align:'center',editor:{type:'combobox',options:{valueField: 'value',textField: 'value',editable:false,panelHeight:'auto',onSelect:onChange}}},
  	  	        {field:'factor',title:'包装单位换算系数',width:190,align:'center',editor:{type:'text'},hidden:true},
  		        {field:'purchaseprice',title:'进价',width:190,align:'center',editor:{type:'text'}},//前台显示
  		        {field:'salesPrice',title:'售价',width:190,align:'center',editor:{type:'text'}},
  		        {field:'needdate',title:'要求日期',width:190,align:'center',editor:{type:'datebox',options:{editable:false}}},
  		        {field:'producerName',title:'产地',width:210,align:'center'},
  		        {field:'deleteRow',title:'操作',width:210,align:'center',formatter:function(value,row,index){
   						var a = '<a href="javascript:void(0)">删除</a> ';
   						return a;
  					}
  		        }
  	         ]],
	    onDblClickRow: function(rowIndex, rowData){
	    	if(deleteflag=="0"){
	    		$CommonUI.alert("已审核,不可操作!");
	    		return;
	    	 }
	 		$('#medDg').datagrid('beginEdit',rowIndex);
 			var unitnameEditor = $('#medDg').datagrid('getEditor', {index:rowIndex,field:'unitname'});
 			var priceEditor=$('#medDg').datagrid('getEditor', {index:rowIndex,field:'purchaseprice'});
			$(priceEditor.target).attr("disabled","disabled");
			var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:rowIndex,field:'salesPrice'});
			$(salesPriceEditor.target).attr("disabled","disabled");
	 		if(deleteflag=="2"){
 				//combox为不可编辑
 				$(unitnameEditor.target).combo(
     					$.extend({},$.fn.validatebox.defaults,{
     						disabled:true,hasDownArrow:false,value:rowData.unitname}
     				));
     		  	var unitquantityEditor = $('#medDg').datagrid('getEditor',{index:rowIndex,field:'unitquantity'});
     		  	$(unitquantityEditor.target).attr("disabled",true);
	 		}else{
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
	 		}
	     }, 
	     onClickCell: function(index,field,value){
	    	 if(deleteflag=="0"){
	    		 if(field =='deleteRow'){$CommonUI.alert("已审核，不可删除！");}
	    		 return;
	    	 }else if(field =='unitquantity'){
	    		 var ed = $CommonUI.getDataGrid('#medDg').datagrid('getEditor', {index:index,field:'unitquantity'});
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
//	    				当焦点失去时，注销绑定事件（避免绑定多次造成多次调用函数），移除焦点（不移除焦点再次输入时，已经没有绑定keyup事件）
	    				$(ed.target).focusout(function(){
	    					$(this).unbind();//移除绑定事件
	    					$(this).blur();//丢失焦点以后移除焦点
	    				});
	    			}
	    	 }else if(field =='deleteRow'){
	    		 if(deleteflag=="2"){
	    			 $CommonUI.alert("计划单已审核过，不可删除！");
	    			 return;
	    		 }
	    		 deleteRow(index);
	    	 }
	}
		}); 
	
	//采购记录
	var url = $WEB_ROOT_PATH+'/purchaseManage/drugPurchaseCtrl.ajax';
	var columns = [[
			          {field:'ck',checkbox:true},
				      {title: "计划编码",field: "uuidPl",align:'center',width:50,hidden:true},
				      {title: "采购单号",field: "uuid",align:'center',width: 110},
				      {title: "采购部门",field: "orgnameApply",align:'center',width: 80},
				      {title: "采购日期",field: "purchasemakeDate",align:'center',width: 70,
				    	  formatter:function(value,row,index){
		    		    		if(row.purchasemakeDate!=""&&row.purchasemakeDate!=null){
		 							var purchasemakeDate = row.purchasemakeDate.substr(0,10);
		 							return purchasemakeDate;
		 							
		 						}
		    		    		
		    		    	}	
				      },
				      {title: "采购人",field: "empname",align:'center',width:50},
				      {title: "采购总价",field: "amountTotal",align:'center',width:50},
				     /* {title: "折后/优惠总价",field: "jj",align:'center',width:70},*/
				      {field:'purchasecheckDate',title:'状态',width:90,align:'center',formatter:function(value,row,index){
				        	if (value==undefined){
				        		return "未审核";
				        	}else{
				        		return "已审核";
				        	}
				        }},
				      {title: "供应商",field: "entname",align:'center',width: 120},
				      {field:'overview',title:'操作',width:80,align:'center',formatter:function(value,row,index){
							var a = '<a href="javascript:void(0)" onclick="overview(\''+row.purchasecheckDate+'\',\''+row.uuidPl+'\',\''+row.uuid+'\',\''+row.entid+'\',\''+row.purchasename+'\',\''+row.purchasecheckOrgid+'\',\''+row.amountTotal+'\')">查看</a> ';
							return a;
					}},
				   ]];
	var queryParams = {page : 1,rows : 10};
	var options = {height : 310,singleSelect: true,pagination: true,rownumbers:true,fitColumns:true};
	var sortOpts = {remoteSort: false,sortName: '',sortOrder: 'asc'};
	var pageOpts = {pageNumber: 1,pageSize: 10};
	$CommonUI.datagrid('#hisPurDatagrid', url, queryParams, columns, pageOpts, sortOpts, options);
	$CommonUI.getDataGrid('#meddetailpurDatagrid').datagrid({ 
	    url: $WEB_ROOT_PATH +'/purchaseManage/drugCommonCtrl.ajax?BLHMI=itemsList&ismeditem=1', 
	    queryParams:{
			"medicine":$("#medicine").val(),
			"status":'1',
		},
	    fitColumns:true,
	    method:'post',
	    pagination: true,
	    singleSelect:false,
	  
	    height:310,
	    width:'100%',
	    pageNumber:1,
	    columns:[[ 
	            {field:'ck',checkbox:true},
	  	        {field:'itemname',title:'药品名称',width:190,align:'center'},
		        {field:'ordCatename',title:'药品分类',width:190,align:'center'}, 
	  	        {field:'itemid',title:'项目编码',width:190,align:'center',hidden:true },
		        {field:'itemSpec',title:'药品规格',width:190,align:'center'}, 
		        {field:'dispensUnit',title:'小单位',width:190,align:'center'}, 
		        {field:'warehousUnit',title:'大单位',width:190,align:'center'},    
		        {field:'itemDosename',title:'剂型',width:280,align:'center'},
		        {field:'producerName',title:'产地',width:210,align:'center'}
	         ]],
	    onSelect: function(rowIndex, rowData) {
	    	if($CommonUI.getDataGrid('#medDg').datagrid('getRows').length == 0){
	    		$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rowData);
	    		LastIndex=$CommonUI.getDataGrid('#medDg').datagrid('getRows').length-1;
	    		$('#medDg').datagrid('beginEdit', LastIndex);
	    		var unitnameEditor = $('#medDg').datagrid('getEditor', {index:0,field:'unitname'});
	    		if(rowData.warehousUnit==null||rowData.warehousUnit==''){
					$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
					$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
	    		}else{
	    			if(rowData.dispensUnit==rowData.warehousUnit){
						$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
						$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
			 		}else{
			 			$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
						$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.dispensUnit},{"value":rowData.warehousUnit}]});
			 		}
	    		}
	    		var priceEditor=$('#medDg').datagrid('getEditor', {index:0,field:'purchaseprice'});
				$(priceEditor.target).attr("disabled","disabled");
				$(priceEditor.target).val(rowData.wholesalesPrice);
				var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:0,field:'salesPrice'});
				$(salesPriceEditor.target).attr("disabled","disabled");	
	    	}else{
	    		var flag=true;
	    		for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
	    			if(rowData.itemid == $CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].itemid){
	    				flag=false;
	    				break;
	    			}
	    		}
	    		if(flag){
	    			$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rowData);
		    		LastIndex=$CommonUI.getDataGrid('#medDg').datagrid('getRows').length-1;
		    		$('#medDg').datagrid('beginEdit', LastIndex);
		    		var unitnameEditor = $('#medDg').datagrid('getEditor', {index:LastIndex,field:'unitname'});
		    		if(rowData.warehousUnit==null||rowData.warehousUnit==''){
		    			$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
						$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
		    		}else{
		    			if(rowData.dispensUnit==rowData.warehousUnit){
							$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rowData.dispensUnit}]});
			    			$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
				 		}else{
							$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rowData.dispensUnit},{"value":rowData.warehousUnit}]});
				 			$(unitnameEditor.target).combobox('setValue',rowData.dispensUnit);
				 		}	
		    		}
		    		var priceEditor=$('#medDg').datagrid('getEditor', {index:LastIndex,field:'purchaseprice'});
					$(priceEditor.target).attr("disabled","disabled");
					$(priceEditor.target).val(rowData.wholesalesPrice);
					var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:LastIndex,field:'salesPrice'});
					$(salesPriceEditor.target).attr("disabled","disabled");	
	    		}
	    	}
	    },
	    onUnselect:function(rowIndex, rowData) {
	    	for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
	    		var uuidme=$CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].uuid;
	    		if(uuidme!=null&&uuidme!=undefined&&uuidme!='null'){
	    			$CommonUI.alert('本条数据已保存，此操作无效');
	    			return;
	    		}else if(rowData.itemid == $CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].itemid){
	    			$CommonUI.getDataGrid('#medDg').datagrid('deleteRow',i);
	    		}
	    	}
	    },
	    onSelectAll:function(rows) {
	    	if($CommonUI.getDataGrid('#medDg').datagrid('getRows').length == 0){
	    		for(var i=0;i<rows.length;i++){
	    			$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rows[i]);
	    			$('#medDg').datagrid('beginEdit',i);
	    			var priceEditor=$('#medDg').datagrid('getEditor', {index:i,field:'purchaseprice'});
	    			$(priceEditor.target).attr("disabled","disabled");
	    			$(priceEditor.target).val(rows[i].wholesalesPrice);
	    			var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:i,field:'salesPrice'});
	    			$(salesPriceEditor.target).attr("disabled","disabled");
	    			var unitnameEditor = $('#medDg').datagrid('getEditor', {index:i,field:'unitname'});
	    			if(rows[i].warehousUnit==null||rows[i].warehousUnit==''){
	    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
						$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
	    			}else{
	    				if(rows[i].dispensUnit==rows[i].warehousUnit){
		    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
		    			}else{
		    				$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rows[i].dispensUnit},{"value":rows[i].warehousUnit}]});
							$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
		    			}
	    			}
	    		}
	    	}else{
	    		var flag = "";//是否可添加
	    		for(var j=0;j<rows.length;j++){
	    			for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
				    	if(rows[j].itemid != $CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].itemid){
				    		flag = true;
				    	}else{
				    		flag = false;
				    		break;
				    	}
	    			}
	    			if(flag == true){
	    	    		$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rows[j]);
	    	    		for(var k=0;k<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;k++){
			    			$('#medDg').datagrid('beginEdit',k);
		    	    		var priceEditor=$('#medDg').datagrid('getEditor', {index:k,field:'purchaseprice'});
		        			$(priceEditor.target).attr("disabled","disabled");
		        			$(priceEditor.target).val(rows[k].wholesalesPrice);
		    	    		var unitnameEditor = $('#medDg').datagrid('getEditor', {index:k,field:'unitname'});
		    	    		var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:k,field:'salesPrice'});
		        			$(salesPriceEditor.target).attr("disabled","disabled");
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
		    		}
	    	    	}
	    		}
	    	}
	    	
	    },
	});
});
var deleteflag="1";//正常编辑状态
var entidori=null;
var descriptionori=null;
//订购单位的onSelect事件，给包装单位系数和包装类型赋值
var onChange=function(){
	 var selectedRow = $('#medDg').datagrid("getSelected");
     var selectedIndex = $('#medDg').datagrid("getRowIndex", selectedRow);
     var unitnameEditor = $('#medDg').datagrid('getEditor',{index:selectedIndex,field:'unitname'});
     var factorEditor=$('#medDg').datagrid('getEditor',{index:selectedIndex,field:'factor'});
	 var unittypeEditor=$('#medDg').datagrid('getEditor',{index:selectedIndex,field:'unittype'});
     var unitname=$(unitnameEditor.target).combobox('getValue');
     var priceEditor=$('#medDg').datagrid('getEditor', {index:selectedIndex,field:'purchaseprice'});
     var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:selectedIndex,field:'salesPrice'});
     if(unitname!=undefined){
    	 if(unitname==selectedRow.dispensUnit){
    		 $(factorEditor.target).val(selectedRow.dispensFacotr);
    		 $(unittypeEditor.target).val('0002');
    		 $(priceEditor.target).val(selectedRow.wholesalesPrice);//进价
    		 if(selectedRow.salesPrice2==null){
    			 $(salesPriceEditor.target).val(selectedRow.salesPrice);//售价
    		 }else{
    			 $(salesPriceEditor.target).val(selectedRow.salesPrice2); 
    		 }
         }else{
        	 $(factorEditor.target).val(selectedRow.warehousFacotr);
    		 $(unittypeEditor.target).val('0003');
    		 $(priceEditor.target).val((selectedRow.wholesalesPrice/selectedRow.dispensFacotr*selectedRow.warehousFacotr).toFixed(2));
    		 if(selectedRow.salesPrice2==null){
        		 $(salesPriceEditor.target).val((selectedRow.salesPrice/selectedRow.dispensFacotr*selectedRow.warehousFacotr).toFixed(2));
    		 }else{
    			 $(salesPriceEditor.target).val((selectedRow.salesPrice2/selectedRow.dispensFacotr*selectedRow.warehousFacotr).toFixed(2));
    		 }
         } 
     }
};
//父页面datagrid中删除按钮
function deleteRow(index){
	//修改为直接删除，可以不用先选中再删除
	var row=$CommonUI.getDataGrid('#medDg').datagrid('getData')["rows"][index];
	var uuid=row.uuid;
	if(uuid==""||uuid==null){
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
			$CommonUI.getDataGrid('#medDg').datagrid('deleteRow',index);
		});
	}else{
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
			postReq($WEB_ROOT_PATH+ '/purchaseManage/stockMgrCtrl.ajax?BLHMI=deletePurById&uuidplan='+uuid, '', function() {
				$CommonUI.getDataGrid('#medDg').datagrid('deleteRow',index);
				$CommonUI.alert("删除成功");
				$('#creatPlanBtn').linkbutton('disable');
					}, function(){$CommonUI.alert("删除失败");},{skipHidden : false},{"uuid":uuid,"uuid":$('#uuid').val(),"purchaseprice":row.purchaseprice,"unitquantity":row.unitquantity});
		});
	}
}
//药品选择
//function medpurChoose(){
//	alert($('#medicine').val());
//	if(deleteflag=="2"||($('#uuidPl').val()!=""&&$('#uuidPl').val()!=undefined)||deleteflag=="0"){
//		$CommonUI.confirm("将替换计划单中药品信息，确定要选择药品吗？", 'question', '是的', function(){
//			clearpur();
//			mechoose();
//		});
//	}else{
//		mechoose();
//	}
//}

function medpurChoose(){
	$('#inputStr').val('');
	$('#cateid').combobox('clear');
	if(deleteflag=="0"){
		// if(field =='deleteRow'){$CommonUI.alert("已审核，不可删除！");}
		$CommonUI.alert("已审核,不可操作!");
		return;
	}else{
		$('#medPurChooseDlg').dialog('open').dialog('center');
		/*$CommonUI.queryForDataGrid("#meddetailmedDg",{
			page : 1,rows : 10
		});*/
		$CommonUI.getDataGrid('#meddetailpurDatagrid').datagrid({ 
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
		    pageNumber:1,
		    pageSize:10,
		    columns:[[ 
		              {field:'ck',checkbox:true},
			  	        {field:'itemname',title:'药品名称',width:190,align:'center'},
				        {field:'ordCatename',title:'药品分类',width:190,align:'center'}, 
			  	        {field:'itemid',title:'项目编码',width:190,align:'center',hidden:true },
				        {field:'itemSpec',title:'药品规格',width:190,align:'center'}, 
				        {field:'dispensUnit',title:'小单位',width:190,align:'center'}, 
				        {field:'warehousUnit',title:'大单位',width:190,align:'center'},    
				        {field:'itemDosename',title:'剂型',width:280,align:'center'},
				        {field:'producerName',title:'产地',width:210,align:'center'}
		         ]],
		    onSelectAll:function(rows) {
		    	if($CommonUI.getDataGrid('#medDg').datagrid('getRows').length == 0){
		    		for(var i=0;i<rows.length;i++){
		    			$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rows[i]);
		    			$('#medDg').datagrid('beginEdit',i);
		    			var priceEditor=$('#medDg').datagrid('getEditor', {index:i,field:'purchaseprice'});
		    			$(priceEditor.target).attr("disabled","disabled");
		    			$(priceEditor.target).val(rows[i].wholesalesPrice);
		    			var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:i,field:'salesPrice'});
		    			$(salesPriceEditor.target).attr("disabled","disabled");
		    			var unitnameEditor = $('#medDg').datagrid('getEditor', {index:i,field:'unitname'});
		    			if(rows[i].warehousUnit==null||rows[i].warehousUnit==''){
		    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
							$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
		    			}else{
		    				if(rows[i].dispensUnit==rows[i].warehousUnit){
			    				$(unitnameEditor.target).combobox('loadData', {total:1, rows:[{"value":rows[i].dispensUnit}]});
			    			}else{
			    				$(unitnameEditor.target).combobox('loadData', {total:2, rows:[{"value":rows[i].dispensUnit},{"value":rows[i].warehousUnit}]});
								$(unitnameEditor.target).combobox('setValue',rows[i].dispensUnit);
			    			}
		    			}
		    		}
		    	}else{
		    		var flag = "";//是否可添加
		    		for(var j=0;j<rows.length;j++){
		    			for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
					    	if(rows[j].itemid != $CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].itemid){
					    		flag = true;
					    	}else{
					    		flag = false;
					    		break;
					    	}
		    			}
		    			if(flag == true){
		    	    		$CommonUI.getDataGrid('#medDg').datagrid('appendRow',rows[j]);
		    	    		for(var k=0;k<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;k++){
				    			$('#medDg').datagrid('beginEdit',k);
			    	    		var priceEditor=$('#medDg').datagrid('getEditor', {index:k,field:'purchaseprice'});
			        			$(priceEditor.target).attr("disabled","disabled");
			        			$(priceEditor.target).val(rows[k].wholesalesPrice);
			    	    		var unitnameEditor = $('#medDg').datagrid('getEditor', {index:k,field:'unitname'});
			    	    		var salesPriceEditor=$('#medDg').datagrid('getEditor', {index:k,field:'salesPrice'});
			        			$(salesPriceEditor.target).attr("disabled","disabled");
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
			    		}
		    	    	}
		    		}
		    	}
		    	
		    }
			});
	}
}

//计算进货总价
function caculate(){
	return $('#quatity').val()*$('#Price1').val();
}

//保存
function medpurSave(){
	//保证订购数量和订购单位不能为空
	if($CommonUI.getDataGrid('#medDg').datagrid('getRows').length==0){
		$CommonUI.alert("请填写信息！");
		return;
	}else if(deleteflag=="0"){
		$CommonUI.alert("已审核，不可修改");
		return;
	}else if($('#purchasecheckOrgid').combobox('getText')==""||$('#purchasecheckOrgid').combobox('getText')==null||$('#entid').combobox('getText')==undefined){
		$CommonUI.alert("请完善采购科室");
		return;
	}else if($('#entid').combobox('getText')==""||$('#entid').combobox('getText')==null||$('#entid').combobox('getText')==undefined){
			$CommonUI.alert("请完善供应商信息");
			return;
	}else{
		var flag = false;
			for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
				var ed1 = $('#medDg').datagrid('getEditor', {index:i,field:'unitname'});
				var ed2 = $('#medDg').datagrid('getEditor', {index:i,field:'unitquantity'});
				var d1=undefined;
				if(ed1!=null){//!=表示处于编辑状态，结束编辑状态时，为null
					 d1 = $(ed1.target).combobox('getText');
				}else{
					 d1=$CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].unitname;
				}
				var d2=undefined;
				if(ed2!=null){
					 d2 = $(ed2.target).val();
				}else{
					 d2=$CommonUI.getDataGrid('#medDg').datagrid('getRows')[i].unitquantity;
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
	//结束所有编辑行
	if(flag){
		for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
			$('#medDg').datagrid('endEdit', i);
	}
	//计算药品总价进行判断
	var total=0;
	for(var j=0;j<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;j++){
		var unitquantity=$CommonUI.getDataGrid('#medDg').datagrid('getRows')[j].unitquantity;
		var purchaseprice=$CommonUI.getDataGrid('#medDg').datagrid('getRows')[j].purchaseprice;
		total=+unitquantity*purchaseprice;
	}	
	if(total.toFixed(2).indexOf(".")>6){
		$CommonUI.alert("药品数量过多，请修改");
		return;
	}
	var json = $('#medDg').datagrid('getData');
	var rows=json.rows;
	var Fields = new Array();
	var amountTotal=0;
	for(var i=0;i<rows.length;i++){
		var Field=new Object();
		Field.uuid=rows[i].uuid;
		Field.itemid=rows[i].itemid;//药品id
		Field.dispensUnit=rows[i].unitname;//包装单位名称
		Field.quantity=rows[i].unitquantity;//包装单位数量
		Field.dispensQuantity=rows[i].unitquantity;//零售单位数量
		Field.facotr=rows[i].factor;//包装单位换算系数
		Field.unittype=rows[i].unittype;//单位类型
		Field.salesPrice=rows[i].salesPrice;//零售价
		Field.amountTotal=rows[i].purchaseprice*rows[i].unitquantity;//零售价
		amountTotal+=rows[i].purchaseprice*rows[i].unitquantity;
		Field.purchaseprice=rows[i].purchaseprice;//进价
		Field.needdate=rows[i].needdate;//需要日期
		Field.dispensFacotr=rows[i].dispensFacotr;//dispensFacotr
		Fields[i]=Field;
	 }
	 $("#total").val(amountTotal);
	 Str = $.toJSON(Fields);
	 url=$WEB_ROOT_PATH +'/purchaseManage/stockMgrCtrl.ajax?BLHMI=savepur&fields='+Str;
	 var purchasecheckOrgid=$('#purchasecheckOrgid').combobox('getValue');//采购科室
	 var purchasemakeUserid=$('#purchasemakeUserid').val();//采购科室
	 var purchasemakeDate=$CommonUI.getDateBox('#purchasemakeDate').datebox('getValue');//制单日期
	 postReq(url, '#mePurForm',function(data){
		 $CommonUI.alert("保存成功");
		 $CommonUI.getDataGrid('#medDg').datagrid('acceptChanges');
		 $('#uuid').val(data.uuidPur);
		 entidori=$('#entid').combobox('getValue');
		 descriptionori=$('#purchaseDescribe').val();
		 var index = $('#medDg').datagrid('getRows').length;
		 $.each(data.uuids, function(i, uuidBean) {
			 $('#medDg').datagrid('getRows')[i].uuid = uuidBean.uuid;
		 });
		
		//启用置灰按钮
		$('#creatPurBtn').attr('disabled',false);
	 	},function(){
	 		$CommonUI.alert("保存失败");},{"skipHidden":false},
	 		{"pursubString":Str,"uuid":$('#uuid').val(),
	 		 "purchasecheckOrgid":purchasecheckOrgid,
	 		 "purchasemakeUserid":purchasemakeUserid,
	 		 "purchasemakeDate":purchasemakeDate
	 		});	
	}
}
//确认采购
function creatPur(){
	for(var k=0;k<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;k++){
		$CommonUI.getDataGrid('#medDg').datagrid('endEdit',k);
	}
    //主表内容是否有变动
	var entid=$('#entid').combobox('getValue');
	var description=$('#purchaseDescribe').val();
	if(entid!=entidori||description!=descriptionori){
		$CommonUI.alert("请先保存采购信息");
		//$('#creatPurBtn').linkbutton('disable');
		$('#creatPurBtn').attr('disabled',true);
		return;
	}else if(deleteflag=="0"){
		$CommonUI.alert("已审核,不可执行此操作");
		return;
	}
	//子表datagrid内容是否有变动
	if($CommonUI.getDataGrid('#medDg').datagrid('getChanges')!=""){
		$CommonUI.alert("请先保存");
		//$('#creatPurBtn').linkbutton('disable');
		$('#creatPurBtn').attr('disabled',true);
		return;
	}
	//update数据
	var uuid=$('#uuid').val();
	postReq($WEB_ROOT_PATH+ "/purchaseManage/stockMgrCtrl.ajax?BLHMI=updatepurcheck", '',function(data){
		if(data.result=='1'){
			$CommonUI.alert("确认采购成功");
			clearpur();
			//$('#creatPlanBtn').linkbutton('disable');
			$('#creatPlanBtn').attr('disabled',true); 
		}else{
			$CommonUI.alert("确认采购失败");
		}
		
		//$('#creatPurBtn').linkbutton('disable');
	 },function(){},{"skipHidden":false},{"uuid":uuid});
}
//药品选择关闭
function medetailpurclose(){
	$('#medPurChooseDlg').dialog('close');
}

//引用计划单按钮
function planQuote(){
	$('#planQuoteDlg').dialog('open').dialog('center');
	$('#uuidpl').val('');
	$CommonUI.getDateBox('#policymakDate1').datebox('setValue', '');	
	$CommonUI.getDateBox('#policymakDate2').datebox('setValue', '');
	/*$CommonUI.queryForDataGrid("#planQuoteDatagrid",{
		page : 1,rows : 10,
	});*/
	$CommonUI.getDataGrid('#planQuoteDatagrid').datagrid({ 
	    url: $WEB_ROOT_PATH+ '/purchaseManage/drugPlanCtrl.ajax?BLHMI=listcheckedplanhd', 
	    fitColumns:true,
	    queryParams:{
			"status":'1',
			
		},
	    method:'post',
	    rownumbers:true,
	    pagination: true,
	    singleSelect:true,
	    height:310,
	    width:'100%',
	    pageNumber: 1,
	    pageSize: 10,
	    columns:[[ 
                {field:'ck',checkbox:true},
	  	        {field:'uuid',title:'计划单号',width:120,align:'center'},
		        {field:'description',title:'计划描述',width:120,align:'center'}, 
	  	        {field:'amountTotal',title:'订购总金额(元)',width:120,align:'center'},
		        {field:'policymakDate',title:'订购日期',width:120,align:'center',
	  	        	formatter:function(value,row,index){
    		    		if(row.policymakDate!=""&&row.policymakDate!=null){
 							var policymakDate = row.policymakDate.substr(0,10);
 							return policymakDate;
 							
 						}
    		    		
    		    	}	
	  	        }, 
		        {field:'empname',title:'制单人',width:120,align:'center'}, 
		        {field:'orgnameApply',title:'订购部门',width:100,align:'center'},    
		        {field:'entname',title:'供应商',width:130,align:'center'},
	         ]],
		}); 
}

//引用计划单查询按钮
function planQuoteserch(){
	var uuidpl=$('#uuidpl').val();
	var policymakDate1=$CommonUI.getDateBox('#policymakDate1').datebox('getValue');
	var policymakDate2=$CommonUI.getDateBox('#policymakDate2').datebox('getValue');
	var orgidApply=$CommonUI.getComboBox('#orgidApply').combobox('getValue');
	/*if((policymakDate1 != "" && policymakDate2 != "") || (policymakDate1 != "" && policymakDate2 == "")) {
		if(policymakDate1 == ""){
			$CommonUI.alert("请选择开始日期");
		}else{
			$CommonUI.alert("请选择结束日期");
		}
	}else{*/
	if(policymakDate1!=''&&policymakDate2!=''){
		if(policymakDate1>policymakDate2){
			$CommonUI.alert("结束日期不能小于开始日期");
		}
	}
	$CommonUI.queryForDataGrid("#planQuoteDatagrid",{
		page : 1,rows : 10,
		"uuid" : uuidpl,
		"status":'1',
		"startDate":policymakDate1,
		"endDate":policymakDate2,
		"orgName":orgidApply
	});
}

//引用计划单确定按钮
function planQuoteconfirm(){
	//增加引用计划单的条件
	if($CommonUI.getDataGrid('#medDg').datagrid('getRows')==""){
		plan();	
	}else{
		$CommonUI.confirm("将替换原有药品信息，确定要引用计划单吗？", 'question', '是的', function(){
		plan();
		});
	}
}

function planQuoteclose(){
	$('#planQuoteDlg').dialog('close');
}

//选择药品弹出diag
//function mechoose(){
//	$CommonUI.placeholder();
//	$('#medPurChooseDlg').dialog('open').dialog('center');
//	$('#cateid').combobox('clear');
//	$('#inputStr').val('');
//	deleteflag="1";
//	$CommonUI.queryForDataGrid("#meddetailpurDatagrid",{
//		page : 1,rows : 10,
//	});
//	
//}

function medChoose(){
	var flag=true;	
	var rows=$CommonUI.getDataGrid('#medDg').datagrid('getRows');
	var inputstr=$('#medicine').val();
	var inputstrl=inputstr.toLowerCase();
	var inputstru=inputstr.toUpperCase();
	if(inputstr==""){
		return;
	}
	$('#medDg').datagrid('unselectAll');
	$('#medDg').datagrid('options').singleSelect=false;
	for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
		
		if((rows[i].itemname).indexOf(inputstrl)!=-1||(rows[i].inputstr).indexOf(inputstrl)!=-1||(rows[i].itemname).indexOf(inputstru)!=-1||(rows[i].inputstr).indexOf(inputstru)!=-1){
			flag=false;
			$CommonUI.getDataGrid('#medDg').datagrid('selectRow',i);
			//break;
		};
	}
	if(flag){
		return;
	};
	$('#medDg').datagrid('options').singleSelect=true;
	};
//引用计划单函数
function plan(){
	var row=$CommonUI.getDataGrid('#planQuoteDatagrid').datagrid('getSelected');
	if(row==null){
		$CommonUI.alert("请选择一条计划单信息");
		return;
	}
	row&&$.getJSON($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=listplansub',
			{'uuid':row.uuid},function(data){
				$('#purchasecheckOrgid').combobox('setValue',row.orgidApply);
				$('#entid').combobox('setValue',row.orgidService);
				$('#purchaseDescribe').val(row.description);
				$('#uuidPl').val(row.uuid);
				$('#uuid').val('');
				$CommonUI.getDataGrid('#medDg').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
				for(var n=0;n<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;n++){
					$('#medDg').datagrid('endEdit',n);//选择药品有可能开启编辑状态，此处要先结束编辑状态，双击的时候才能正常开启编辑状态
					$CommonUI.getDataGrid('#medDg').datagrid('getRows')[n].uuid="";
				};
				deleteflag="2";
				$('#selectItemsBtn').attr("disabled","disabled");
		});
	$('#planQuoteDlg').dialog('close');
}
//清空
function clearpur(){
	$('#entid').combobox('clear');
	$('#uuidPl').val('');
	$('#purchaseDescribe').val('');
	$('#uuid').val('');
	$('#selectItemsBtn').removeAttr("disabled");
	$CommonUI.getDataGrid('#medDg').datagrid('loadData',{"total":"0","rows":[]});
	deleteflag="1";
}
//采购记录
function historyPur(){
	$('#historyPurDlg').dialog('open').dialog('center');
	//清空采购单号和采购日期
	$('#purchaseid_s').val('');
	$('#purStartDate_s').datebox('clear');
	$('#purEndDate_s').datebox('clear');
	$CommonUI.queryForDataGrid("#hisPurDatagrid",{
		page : 1,rows : 10,
	});
	
}
//采购记录查看
function overview(purchasecheckDate,uuidPl,uuid,entid,description,purchasecheckOrgid,amountTotal){
	if($CommonUI.getDataGrid('#medDg').datagrid('getRows')==""){
		viewpur(uuidPl,uuid,entid,description,amountTotal,purchasecheckOrgid);	
	}else{
		$CommonUI.confirm("将替换原有药品信息，确定要查看吗？", 'question', '是的', function(){
		viewpur(uuidPl,uuid,entid,description,amountTotal,purchasecheckOrgid);
		});
	}
	//设置datagrid的状态
	if(purchasecheckDate == 'undefined'||purchasecheckDate ==''||purchasecheckDate ==undefined){
		if(uuidPl==""||uuidPl=='undefined'||uuidPl==undefined||uuidPl==null){
			deleteflag="1";//非引用计划单未审核  可修改日期
			//$('#creatPurBtn').linkbutton('enable');	
			$('#creatPurBtn').attr('disabled',false);
		}else{
			deleteflag="2";//引用计划单生成的未审核采购单
			//$('#creatPurBtn').linkbutton('enable');
			$('#creatPurBtn').attr('disabled',false);
		}
	}else{
		deleteflag="0";//审核  不可修改 
	}
	$('#historyPurDlg').dialog('close');
}
//采购记录查询
function hisPursearch(){
	var purchaseid = $('#purchaseid_s').val();
	var purStartDate = $CommonUI.getDateBox('#purStartDate_s').datebox('getValue');
	var purEndDate = $CommonUI.getDateBox('#purEndDate_s').datebox('getValue');
	/*if((purStartDate == "" && purEndDate != "") || (purStartDate != "" && purEndDate == "")) {
		if(purStartDate == ""){
			$CommonUI.alert("请选择开始日期");
		}else{
			$CommonUI.alert("请选择结束日期");
		}
	}else{*/
		if(purStartDate!=''&&purEndDate!=''){
			if(purStartDate>purEndDate){
				$CommonUI.alert("结束日期不能小于开始日期");
			}
		}
		$CommonUI.queryForDataGrid("#hisPurDatagrid",{
			page : 1,rows : 10,
			'uuid':purchaseid,
			'startDate':purStartDate,
			'endDate':purEndDate
		});
//		$CommonUI.getDataGrid('#hisPurDatagrid').datagrid({
//			url:$WEB_ROOT_PATH+'/purchaseManage/drugPurchaseCtrl.ajax',
//			queryParams:{
//				'uuid':purchaseid,
//				'startDate':purStartDate,
//				'endDate':purEndDate
//			}
//		});
	
}

function hisPurclose(){
	$('#historyPurDlg').dialog('close');
}
//选择药品查询
function medetailpursearch(){
	var inputStr=$('#inputStr').val();
	if(inputStr=="输入药品名称/助记符"){
		inputStr="";
	}
	var cateid=$('#cateid').combobox('getValue');
	$CommonUI.queryForDataGrid("#meddetailpurDatagrid",{
		page : 1,rows : 10,
		"medicine":inputStr,
		"cateId":cateid
	});
}

function viewpur(uuidPl,uuid,entid,description,amountTotal,purchasecheckOrgid){
	$.getJSON($WEB_ROOT_PATH+'/purchaseManage/stockMgrCtrl.ajax?BLHMI=listPur', {
		"uuid" : uuid,
	}, function(data) {
		console.log(data);
		$CommonUI.getDataGrid('#medDg').datagrid('loadData',{total:data.mePlSubBean.length,rows:data.mePlSubBean} );
		if(data.mePlSubBean!=""){
			for ( var i = 0; i < $CommonUI.getDataGrid('#medDg').datagrid('getRows').length; i++) {
				$('#medDg').datagrid('endEdit',i);
				$('#medDg').datagrid('getRows')[i].uuid =data.mePlSubBean[i].uuid;
			 }
			if(uuidPl!='undefined'){
				$('#uuidPl').val(uuidPl);
			}
			
		}
		if(entid=='null'){
			entid="";
		}
		if(purchasecheckOrgid==""||purchasecheckOrgid=='null'){
			purchasecheckOrgid="";
		}
		$('#purchasecheckOrgid').combobox('setValue',purchasecheckOrgid);
		$('#entid').combobox('setValue',entid);
		if(description!='undefined'){
			$('#purchaseDescribe').val(description);
		}
		$('#uuid').val(uuid);
		if(amountTotal!='undefined'){
			$('#total').val(amountTotal);
		}
		descriptionori=description;
		entidori=$('#entid').combobox('getValue');
		if(!(uuidPl=='undefined'||uuidPl=='')){
			$('#selectItemsBtn').attr("disabled","disabled");
		}
		

	});
}
//父页面选择药品检索
function medchoose(){
	var flag=true;	
	var inputstr=$('#medicine').val();
	var inputstrl=inputstr.toLowerCase();
	var inputstru=inputstr.toUpperCase();
	var rows=$CommonUI.getDataGrid('#medDg').datagrid('getRows');
	$('#medDg').datagrid('unselectAll');
	$('#medDg').datagrid('options').singleSelect=false;
	if(inputstr==""){
		return;
	}
	for(var i=0;i<$CommonUI.getDataGrid('#medDg').datagrid('getRows').length;i++){
		if((rows[i].itemname).indexOf(inputstrl)!=-1||(rows[i].inputstr).indexOf(inputstrl)!=-1||(rows[i].itemname).indexOf(inputstru)!=-1||(rows[i].inputstr).indexOf(inputstru)!=-1){
			flag=false;
			$CommonUI.getDataGrid('#medDg').datagrid('selectRow',i);
		};
	}
	if(flag){
		return;
	};
	$('#medDg').datagrid('options').singleSelect=true;
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


