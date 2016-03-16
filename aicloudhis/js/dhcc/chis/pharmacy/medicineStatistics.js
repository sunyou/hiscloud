//页面初始化
$(function(){
		var options = {toolbar : "#statistics",height : 460,width : '100%',singleSelect : true,pagination : true,rownumbers : true,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 10};
		var columns = [ [
		                {field : 'uuid', checkbox : true,width:40,hidden:true},
		                {field : "itemname",title : "项目名称",width:160,align : 'center'},
		                //{field : "uuidWindow",title : "发药窗口",width:40},	
		                //{field : "batchcode",title : "项目批次号",width:40},
		     	        //{field : "outmedUserid",title : "发药人",width:40},
		     	        ///{field : "execUsername",title : "执行人员名称",width:40},		     	        
		     	        ///{field : "execOrgname",title : "执行科室名称",width:40},
		     	        ///{field : "execDatetime",title : "执行日期",width:40},
		                //{field : "serialno",title : "挂号流水号",width:40},
		                //{field : "admisSerialno",title : "就诊流水号",width:40},
		                //{field : "patientid",title : "患者编码",width:40}, 	      
		     	        //{field : "dispensUnit",title : "零售单位",width:40},
		     	        //{field : "dispensQuantity",title : "零售数量",width:40},
		     	        ///{field : "wholesalesPrice",title : "批发价",width:40},
		     	        ///{field : "wholesalesAmount",title : "批发总金额",width:40},itemSpec
		                {field : "itemSpec",title : "药品规格",width:140,align : 'center'},
		     	        {field : "salesPrice",title : "零售价",width:140,align : 'center'},
		     	        {field : "dispensUnit",title : "零售单位",width:140,align : 'center'},
		     	        {field : "drugFlag",title : "发退标志",width:140,align : 'center'},
		     	        ///{field : "salesAmount",title : "零售总金额",width:40},
		     	        {field : "execdispensQuantity",title : "发/退数量",width:140,align : 'center'},
		     	        {field : "orgidHosp",title : "所属诊所",width:160,align : 'center'}
//		     	        {field:'infostatue',title:'发布状态',width:140,align:'center',formatter: function(value,row,index){
//		     	    	   if(value == true){
//		     	    		   return "已发布";
//		     	    	   }else {
//		     	    		   return "未发布";
//		     	    	   }
//		     	         }}
		  		] ];
		var queryParams = {page : 1,rows : 10};
		var url = $WEB_ROOT_PATH+"/pharmacyManage/drugReturnList.ajax?returnFlag=0";
		$CommonUI.datagrid('#show', url, queryParams, columns, pageOpts, sortOpts,options);
		
		//document.getElementsByName("radio")[0].checked="checked";
		/*$('#printBtn').click(function(){
			var options = $('#show').datagrid('options');
	    	//alert(options.pageNumber);
	    	//alert(options.pageSize);
	    	var preTime = $CommonUI.getDateBox('#preTime').datebox('getValue');
	    	var endTime = $CommonUI.getDateBox('#endTime').datebox('getValue');
	    	var radio = document.getElementsByName("radio");
	    	var url = "";
	    	printFlag =	$('#printFlag').val();
	    	//if(radio[0].checked && printFlag==1){
	    	if(printFlag==1){
	    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!print.htm?"+preTime+"&"+endTime+"&1&"+options.pageNumber+"&"+options.pageSize;
	    	}else if(printFlag==-1){
	    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!drugPrint.htm?"+preTime+"&"+endTime+"&-1&"+options.pageNumber+"&"+options.pageSize;
	    	}else{
	    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!statisticsPrint.htm?"+preTime+"&"+endTime+"&0&"+options.pageNumber+"&"+options.pageSize;
	    	}    	    	
	    	$("#printBtn").attr("href",url);
	    	window.open(url);
		});*/
});

    function selectClick(){
    	    
	    	var preTime = $CommonUI.getDateBox('#preTime').datebox('getValue');
	    	var endTime = $CommonUI.getDateBox('#endTime').datebox('getValue');	
	    	/*if((preTime==null||preTime=='') && (endTime!=null && endTime!='')){
	    		$CommonUI.alert("请选择起始时间！");
	    	    return;
	    	}else if((preTime!=null && preTime!='') && (endTime==null || endTime=='')){
	    		$CommonUI.alert("请选择终止时间！");
	    		return;
	    	}else if((preTime!=null && preTime!='') && (endTime!=null && endTime!='') && (preTime>endTime)){
	    		$CommonUI.alert("起始时间不可大于终止时间!");	
	    		return;
	    	}
	    	*/
	    	if((preTime!=null && preTime!='') && (endTime!=null && endTime!='') && (preTime>endTime)){
	    		$CommonUI.alert("起始时间大于终止时间，请选择正确的查询日期!");	
	    		return;
	    	}
	    	//printFlag=1;
	    	var radio = document.getElementsByName("radio");
	    	if(radio[0].checked){
	    		$CommonUI.getDataGrid('#show').datagrid({
		    		url:$WEB_ROOT_PATH + "//pharmacyManage/drugReturnList.ajax?returnFlag=1",
		    		queryParams:{
		    			"preTime":preTime,
		    			"endTime":endTime,
		    			"rows":10,
			    		"page":1
		    		}
		    	});
	    		$CommonUI.getDataGrid('#show').datagrid('load', {  
	    			"rows": 10,  
	    			"page": 1,  
	    			"preTime":preTime,
	    			"endTime":endTime
	    		});    
	    		$('#printFlag').val(1);
	    	}else if(radio[1].checked){
	    		$CommonUI.getDataGrid('#show').datagrid({
	    			url:$WEB_ROOT_PATH + "//pharmacyManage/drugReturnList.ajax?returnFlag=-1",
	    			queryParams:{
	    				"preTime":preTime,
	    				"endTime":endTime,
	    				"rows":10,
			    		"page":1
	    			}
	    		});
	    		$CommonUI.getDataGrid('#show').datagrid('load', {  
	    			"rows": 10,  
	    			"page": 1,  
	    			"preTime":preTime,
	    			"endTime":endTime	    			
	    		});     
	    		$('#printFlag').val(-1);
	    	}else{
	    		$CommonUI.getDataGrid('#show').datagrid({
	    			url:$WEB_ROOT_PATH + "//pharmacyManage/drugReturnList.ajax?returnFlag=0",
	    			queryParams:{
	    				"preTime":preTime,
	    				"endTime":endTime,
	    				"rows":10,
			    		"page":1
	    			}
	    		}).datagrid('load', {  
	    			"rows": 10,  
	    			"page": 1,  
	    			"preTime":preTime,
	    			"endTime":endTime	    			
	    		});     
	    		//$CommonUI.getDataGrid('#show')
	    		//$CommonUI.alert("统计类型不可为空，请选择发药或退药!");	
	    		//return;
	    	}	    	
//    	   var json = $CommonUI.loopBlock('#statistics');
//   	       $("#show").datagrid('load', json);
    }
    
    function print(){
    	//if(printFlag==0){}
    	//var text = $CommonUI.getDataGrid('#show').datagrid('selectAll');
    	//alert(text);
    	//List a = text;
    	//alert(a[0]);
    	var options = $('#show').datagrid('options');
    	//alert(options.pageNumber);
    	//alert(options.pageSize);
    	var preTime = $CommonUI.getDateBox('#preTime').datebox('getValue');
    	var endTime = $CommonUI.getDateBox('#endTime').datebox('getValue');
    	var radio = document.getElementsByName("radio");
    	var url = "";
    	printFlag =	$('#printFlag').val();
    	//if(radio[0].checked && printFlag==1){
    	if(printFlag==1){
    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!print.htm?"+preTime+"&"+endTime+"&1&"+options.pageNumber+"&"+options.pageSize;
    	}else if(printFlag==-1){
    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!drugPrint.htm?"+preTime+"&"+endTime+"&-1&"+options.pageNumber+"&"+options.pageSize;
    	}else{
    		 url = $WEB_ROOT_PATH+"/pharmacyStatistics/pharmacyStatisticsCtrl!statisticsPrint.htm?"+preTime+"&"+endTime+"&0&"+options.pageNumber+"&"+options.pageSize;
    	}    	    	
    	//$("#printBtn").attr("href",url);
    	window.open(url);
    }
