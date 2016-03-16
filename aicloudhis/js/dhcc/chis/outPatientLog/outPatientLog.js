$(function(){
	$CommonUI.datebox('#start', (new Date()).format("yyyy-MM-dd"), true);
	$CommonUI.datebox('#end', (new Date()).format("yyyy-MM-dd"), true);
	var start=$CommonUI.getDateBox("#start").datebox('getValue')+" 00:00:00";
	var end=$CommonUI.getDateBox("#end").datebox('getValue')+" 23:59:59";
	var options = {toolbar : "#tb",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 15,page : 1,rows : 15};
	var columns = [ [
	     	    	{title : "月/日",field : "admistime",width : 80,align : 'center'},
	     	    	{title : "姓名",field : "patientName",width : 80,align : 'center'},
	     	    	{title : "性别",field : "patientSexid",width : 50,align : 'center'},
	     			{title : "年龄",field : "age",width:50,align : 'center'},
	     			{title : "家庭地址",field : "familyAddress",width : 220,align : 'center',
	     				formatter:function(value,row,index){ 
	     				    var familyAddress = ""; 
	     				    if(row.provinCesid != null){
	     				    	familyAddress+=row.provinCesid;
	     				    }
	     				    if(row.cityid != null){
	     				    	familyAddress+=row.cityid;;
	     				    }
	     				    if(row.cityaeraid != null){
	     				    	familyAddress+=row.cityaeraid;;
	     				    }
	     				    if(row.streetinfo != null){
	     				    	familyAddress+=row.streetinfo;;
	     				    }
	     				 
	     					return "<div align='left'>"+familyAddress+"</div>";
	     				}},
	     			{title : "职业",field : "occupationid",width : 80,align : 'center'},
//	     			{title : "发病日期",field : "fbrq",width :85,align : 'center'},
	     			{title : "初诊",field : "cz",width : 60,align : 'center',
	     				formatter:function(value,row,index){ 
	     					if(row.cz=='1'){
	     						return "√";
	     					}
	     					else{
	     						return "";
	     					}
	     				}},
	     			{title : "复诊",field : "fz",width : 60,align : 'center',
	     					formatter:function(value,row,index){ 
		     					if(row.cz=='0'){
		     						return "√";
		     					}
		     					else{
		     						return "";
		     					}
		     				}},
	     			{title : "症状/体征",field : "zztz",width : 120,align : 'center',
		     					formatter:function(value,row,index){
		     					var  zztz = "";
		     					if(row.complaint != null){
		     						zztz += row.complaint+"/";
		     					}
		     					if(row.temperature != null){
		     						zztz += "体温:"+row.temperature+";";
		     					}
		     					if(row.heartRate != null){
		     						zztz += "心率:"+row.heartRate+";";
		     					}
		     					if(row.rhythm != null){
		     						zztz += "心律:"+row.rhythm+";";
		     					}
		     					 
		     					return zztz;
		     				}},
	     			{title : "血压",field : "cxy",width : 70,align : 'center',
	     					formatter:function(value,row,index){ 
		     					if(row.sbp != null && row.dbp){		     						 
		     						return row.sbp;
		     					}
		     					else{
		     						return "";
		     					}
		     				}},
	     			{title : "诊断",field : "diagName",width : 120,align : 'center'},
	     			{title : "治疗方法",field : "zlff",width : 80,align : 'center'},
//	     			{title : "备注",field : "bz",width : 80,align : 'center'}
	     		    ] ];
	var queryParams = {	"startTime":start,
			"endTime":end};
	var url =$WEB_ROOT_PATH + '/outPatient/queryOutPatientList.ajax';
	$CommonUI.datagrid('#dg', url, queryParams, columns, pageOpts, sortOpts,options);
});
function findDate(){
	var start=$CommonUI.getDateBox("#start").datebox('getValue')+" 00:00:00";
	var end=$CommonUI.getDateBox("#end").datebox('getValue')+" 23:59:59";
	if((start==null||start=='') && (end!=null && end!='')){
		$CommonUI.alert("请选择起始时间！");
	    return;
	}else if((start!=null && start!='') && (end==null || end=='')){
		$CommonUI.alert("请选择终止时间！");
		return;
	}else if((start!=null && start!='') && (end!=null && end!='') && (start>end)){
		$CommonUI.alert("起始时间不可大于终止时间!");	
		return;
	}
	$CommonUI.getDataGrid('#dg').datagrid({
		url:$WEB_ROOT_PATH + "/outPatient/queryOutPatientList.ajax",
		queryParams:{
			"startTime":start,
			"endTime":end,
			"page":1,
    		"rows":15
		}
	});
}
function print(){
	var options = $('#dg').datagrid('options');
	var start = $CommonUI.getDateBox('#start').datebox('getValue');
	var end = $CommonUI.getDateBox('#end').datebox('getValue');
	var url = $WEB_ROOT_PATH+"/outPatient/outPatientCtrl!print.htm?"+start+"&"+end+"&-1&"+options.pageNumber+"&"+options.pageSize;
	$("#printBtn").attr("href",url);
}
