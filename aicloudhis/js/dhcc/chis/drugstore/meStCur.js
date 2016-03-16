$(function(){
	
//	$CommonUI.getComboBox('#produce').combobox({
//		textField:'entname',
//		valueField:'entid',
//		pagination:true,
//		url:$WEB_ROOT_PATH+'/businessman/businessmanCtrl.htm?BLHMI=list&dto.stop=1'
//	});
	
	/*var orgidHosp=$('#orgidHosp').val();
	$CommonUI.getComboBox('#org').combobox({
		textField:'orgname',
		valueField:'orgid',
		url: $WEB_ROOT_PATH + '/agencyManage/agencyManageCtrl.htm?BLHMI=list&dto.Org.orgid='+orgidHosp
	});*/
	//判断批示是否选中，隐藏显示批次
	$('#1').click(function(){
		var radio = document.getElementsByName("radio");
		if(radio[0].checked){
			$('#bacth').show();
//			document.getElementById("bacth").style.display="none";
		}
	});
	
	$('#2').click(function(){
		var radio = document.getElementsByName("radio");
		if(radio[1].checked){
			$('#bacth').hide();
		}
	});
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15};
	var columns = [ [
	     			
	     			{title : "药品名称",field : "itemname",width : 80,align : 'left',halign:"center"},
	     			{title : "药品规格",field : "itemSpec",width:80,align : 'center'},
	     			{title : "药品分类",field : "pharmacyCatename",width:80,align : 'center'},
	     			{title : "库存",field : "quantity",width:80,align : 'center'},
	     			{title : "科室",field : "orgname",width:120,align : 'center'},
	     			{title : "生产厂商",field : "entname",width:80,align : 'center'}
	     		    ] ];
	var orgid=$CommonUI.getComboBox("#org").combobox('getValue');
	var queryParams = {page : 1,rows : 15,'orgid':orgid};
	var url =$WEB_ROOT_PATH + '/purchaseManage/meStCurCtrl.ajax?BLHMI=allMeStCurList';
	var options = {toolbar : "#tb",height : 462,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : true};
	$CommonUI.datagrid('#show', '', queryParams, columns, pageOpts, sortOpts,options);
});

function selectClick(){
	var radio = document.getElementsByName("radio");
	 var name=$("#name").val();
	 var orgid=$CommonUI.getComboBox("#org").combobox('getValue');
	 if(orgid==null || orgid==''){
		 $CommonUI.alert("请选择科室!");	
			return;
	 }
	 var category=$CommonUI.getComboBox("#category").combobox('getValue');
	 var produce=$CommonUI.getComboBox("#produce").combobox('getValue');
	 if(radio[0].checked){
			var columns1 = [ [
			     			{title : "药品批次",field : "batchcode",width : 80,align : 'center'},
			     			{title : "药品名称",field : "itemname",width : 80,align : 'left',halign:"center"},
			     			{title : "药品规格",field : "itemSpec",width:80,align : 'center'},
			     			{title : "药品分类",field : "ordCatename",width:80,align : 'center'},
			     			{title : "购入原价",field : "wholesalesPrice",width:80,align : 'center'},
			     			{title : "销售单价",field : "salesPrice",width:80,align : 'center'},
			     			{title : "批发额",field : "storageWholesalesprice",width:80,align : 'center'},
			     			{title : "销售额",field : "storageSalesprice",width:80,align : 'center'},
			     			{title : "库存",field : "quantity",width:80,align : 'center',
						    	  formatter: function(value,row,index){
						    		  if(row.dispensUnit!=null && row.dispensUnit.e!=''){
						    			  return value+row.dispensUnit;
						    		  }else{
											return value;					
									}
						    	  }},
			     			{title : "科室",field : "orgname",width:80,align : 'center'},
			     			{title : "生产厂商",field : "entname",width:80,align : 'center'},
			     			{title : "过期日期",field : "invaliddate",width:80,align : 'center',
			     				
			     				formatter:function(value,row,index){
			    		    		if(row.invaliddate!=""&&row.invaliddate!=null){
			 							var invaliddate = row.invaliddate.substr(0,10);
			 							return invaliddate;
			 							
			 						}
			    		    		
			    		    	}	
			     			},
			     		    ] ];
			var number=$("#number").val();
			var queryParams1 = {page : 1,rows : 15,'batchcode':number,'medicine':name,'cateId':category,'entidProducer':produce,'orgid':orgid};
			var url1 =$WEB_ROOT_PATH + '/purchaseManage/meStCurCtrl.ajax?BLHMI=meStCurList';
			$CommonUI.getDataGrid('#show').datagrid({
				url:url1,
				columns:columns1,
				queryParams:queryParams1
			});
	 }else{
			var columns1 = [ [
			     			{title : "药品名称",field : "itemname",width : 80,align : 'left',halign:"center"},
			     			{title : "药品规格",field : "itemSpec",width:80,align : 'center'},
			     			{title : "药品分类",field : "ordCatename",width:80,align : 'center'},
			     			{title : "库存",field : "quantity",width:80,align : 'center',
						    	  formatter: function(value,row,index){
						    		  if(row.dispensUnit!=null && row.dispensUnit.e!=''){
						    			  return value+row.dispensUnit;
						    		  }else{
											return value;					
									}
						    	  }},
			     			{title : "科室",field : "orgname",width:120,align : 'center'},
			     			{title : "生产厂商",field : "entname",width:80,align : 'center'}
			     		    ] ];
			var queryParams1 = {page : 1,rows : 15,'medicine':name,'cateId':category,'entidProducer':produce,'orgid':orgid};
			var url1 =$WEB_ROOT_PATH + '/purchaseManage/meStCurCtrl.ajax?BLHMI=allMeStCurList';
			$CommonUI.getDataGrid('#show').datagrid({
				url:url1,
				columns:columns1,
				queryParams:queryParams1
			});
	 }
}
