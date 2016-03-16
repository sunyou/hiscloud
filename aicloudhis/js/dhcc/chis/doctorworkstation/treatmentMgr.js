//诊疗管理
//待就诊columns
var flagPat="1";
var RegisterPatientID;
var RegisterPatientName;
var isUpdate = "0";
var count=0;
var waitcolumns=[[
	            {field:'patientid',title:'患者编码',width:50,align:'center',hidden:true},
	      		{field:'patientName',title:'姓名',width:50,align:'center',sort:true},
	      		{field:'patientTelephone',title:'移动电话',width:80,align:'center'},
	    		{field:'patientSexname',title:'性别',width:30,align:'center'},
	    		{field:'patientAge',title:'年龄',width:35,align:'center'},
	    		{field:'statusName',title:'状态',width:30,align:'center',
	    			formatter:function(value,row,index){
		    			if(row.bookStatus == 00) {
		    				return "<span style='color: green;'>预约</span>";
		    			}else{
		    				return "<span style='color: brown;'>挂号</span>";
		    			}
	    			}
	    		},
	    		{field:'action',title : "操作",width:30,align:'center',
     				formatter:function(value,row,index){
    		    		var c = '<a href="#" onclick="clickwait(\''+row.statusName+'\',\''+row.patientid+'\',\''+row.serialno+'\',\''+row.registid+'\',\''+row.validdate1+'\',\''+row.validdate2+'\',\''+row.bookid+'\',\''+row.registTypeid+'\',\''+row.dateTypeid+'\',\''+row.dateTypename+'\',\''+row.patientName+'\')">接诊</a> ';
    		    		return c;
    		    	}}
	    	]];
//已接诊columns
var receivecolumns=[[
	        {field:'admisSerialno',title:'就诊流水号',width:50,hidden:true},
	        {field:'patientid',title:'患者编码',width:50,hidden:true},
	        {field:'empIdAdmis',title:'接诊人编码',width:50,hidden:true},
	        {field:'empnameAdmis',title:'接诊人名称',width:50,hidden:true},
	        {field:'patientName',title:'姓名',width:50,align:'center',sort:true},
	        {field:'admisDatetime',title:'就诊日期',width:80,align:'center'},	    	{field:'patientSename',title:'性别',width:30,align:'center'},
	    	{field:'patientAge',title:'年龄',width:30,align:'center'},
	    	{field:'action',title : "操作",width:30,align:'center',
	    		formatter:function(value,row,index){
		    		var c = '<a href="#" onclick="clickreceive(\''+row.serialno+'\',\''+row.patientid+'\',\''+row.patientName+'\',\''+row.admisSerialno+'\',\''+row.admisDatetime.substring(0,10)+'\')">接诊</a> ';
		    		return c; }}
		    ]];
//初始化
$(function() {
	$("#TreatFrame").css("height",getIframeHeight());
	$("#leftSide").css("height",getIframeHeight());
	$CommonUI.getDateBox("#begindate").datebox("setValue",formatterDate(new Date()));
	$("#wait").attr("checked",true);
	$CommonUI.getDialog("#registerInfo").dialog("move", {"top" : "50"});
	var dateStr = formatterDate(new Date());
	$CommonUI.getPropertyGrid('#patientList').datagrid({
		height: (getIframeHeight()-80),
		width:310,
		onDblClickRow:DblclickFuntion,
		method:'post',
	    url: $WEB_ROOT_PATH+'/treatment/getWaitPatientList.ajax',
	    showGroup: true,
	    pagination: true,
	    singleSelect: true,
		rownumbers: true,
	    scrollbarSize: 0,
	    columns:waitcolumns,
	    fitColumns:true,
	    queryParams:{
			page : 1,
			rows : 10,
			bookDate:dateStr//预约日期
		}
	});
	
	//待就诊与已就诊选择
	$("input[name='selectPatientType']").click(function(){
		//2015-4-21  yangchunyan添加
		$CommonUI.getDateBox("#begindate").datebox("setValue",formatterDate(new Date()));
		selectAndRefresh();
	});
	//刷新
	$('#refresh').click(function(){
		//2015-4-21  yangchunyan添加
		$CommonUI.getDateBox("#begindate").datebox("setValue",formatterDate(new Date()));
		selectAndRefresh();
	});
    //挂号检索提示
	$("#poshytip").on('mouseover', function() {
		$CommonUI.poshytip($("#poshytip"),'请输入患者姓名/助记符/手机号');
	});
	$("#poshytip").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#poshytip"));
	});
   //接诊查询提示
	$("#patientName2").on('mouseover', function() {
		$CommonUI.poshytip($("#patientName2"),'接诊按患者姓名查询');
	});
	$("#patientName2").on('mouseleave', function() {	
		$CommonUI.destoryPoshytip($("#patientName2"));
	});
	
	$("#familyCheck").click(function() {
		  var val = $(this).val();
		  if (val==0) {
			$("#familyCheck").attr("checked","checked");
			$("#familyCheck").val(1);
			$("#family").show();
		} else {
			$("#familyCheck").removeAttr("checked");
			$("#familyCheck").val(0);
			$("#family").hide();
		}
	});
	$("#contactCheck").click(function() {
		var val = $(this).val();
		if (val==0) {
			$("#contactCheck").attr("checked","checked");
			$("#contactCheck").val(1);
			$("#contact").show();
		} else {
			$("#contactCheck").removeAttr("checked");
			$("#contactCheck").val(0);
			$("#contact").hide();
		}
	});
});
//刷新与复选框
function selectAndRefresh(){
	var mySelect=$("input[name='selectPatientType']:checked").val();
	var options = {height: (getIframeHeight()-80),width : 310,singleSelect : true,pagination : true,rownumbers : true,fitColumns : true,scrollbarSize: 0};
//	var sortOpts = {remoteSort : false,sortName : '',sortOrder : ''};
	var pageOpts = {pageNumber : 1,pageSize : 10};
	var dateStr = $('#begindate').datebox('getValue');
	var queryParams = {
		page : 1,
		rows : 10,
		bookDate:dateStr,//预约日期
		AdmisDatetime:dateStr//就诊日期
	};
	if(mySelect==1){
		url = $WEB_ROOT_PATH+'/treatment/getWaitPatientList.ajax';
		columns = waitcolumns;
	}else{
		url = $WEB_ROOT_PATH+'/treatment/getReceivePatientList.ajax';
		columns = receivecolumns;
	}
	$CommonUI.datagrid('#patientList', url, queryParams, columns, pageOpts, options);
}

//待接诊接诊操作
function clickwait(statusName,patientid,serialno,registid,validdate1,validdate2,bookid,registTypeid,dateTypeid,dateTypename,patientName){
	document.getElementById('TreatFrame').contentWindow.clearAll();//清除诊疗页面所有数据
	if("登记" == statusName){
		$.post($WEB_ROOT_PATH+"/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=saverepatient",
		    {
			 'dto.paadm.patientid': patientid,
			 'dto.paadm.serialno': serialno,
			 //部分更新方法更新挂号表中就诊状态
			 'dto.treatPaRegister.serialno': serialno,
			 'dto.treatPaRegister.bookid': bookid
				}, function(data){
					var opts=$.evalJSON(data);
					var admisSerialno = opts["dto.paadm"].admisSerialno;
					if(admisSerialno != null && admisSerialno != '') {
						toIframe(patientid,admisSerialno,serialno);
						document.getElementById('TreatFrame').contentWindow.loadPatinetInfo(patientid,admisSerialno,serialno);//加载患者信息
//						$CommonUI.autoCloseCenterMessage("开始接诊  <span style='color: blue;'>"+patientName+"</span>!","info","",1000);
						document.getElementById('TreatFrame').contentWindow.loadTreatedRecord(patientid);//加载历次就诊列表
						$('#patientList').datagrid('options').url=$WEB_ROOT_PATH+'/treatment/getWaitPatientList.ajax';
						$('#patientList').datagrid('load');
					}
			});
	}else if("预约" == statusName){
		$.post($WEB_ROOT_PATH+"/treatment/savebkpatient.ajax",
			{
			 'bookid': bookid,
		     'patientid': patientid,
			 'dto.treatPaRegister.bookid': bookid,
		     'dto.treatPaRegister.patientid': patientid,
		     'dto.treatPaRegister.registid':registid,
		     'dto.treatPaRegister.registTypeid':registTypeid,
		     'dto.treatPaRegister.dateTypeid':dateTypeid,
			 'dto.treatPaRegister.dateTypename':dateTypename,
			 //就诊表插数据
			 'dto.paadm.patientid': patientid,
			 //更新预约表
			 'dto.patientBook.bookid':bookid
		 		}, function(data){
					var opts=$.evalJSON(data);
					var admisSerialno = opts["rows"][0].admisSerialno;
					var serialno = opts["rows"][0].serialno;
					if(admisSerialno != null && admisSerialno != '') {
						toIframe(patientid,admisSerialno,serialno);
						document.getElementById('TreatFrame').contentWindow.loadPatinetInfo(patientid,admisSerialno,serialno);//加载患者信息
//						$CommonUI.autoCloseCenterMessage("开始接诊  <span style='color: blue;'>"+patientName+"</span>!","info","",1000);
					}
					document.getElementById('TreatFrame').contentWindow.loadTreatedRecord(patientid);//加载历次就诊列表
					$('#patientList').datagrid('options').url=$WEB_ROOT_PATH+'/treatment/getWaitPatientList.ajax';
					$('#patientList').datagrid('load');
			});
		 }
		
}
//向诊疗页面传患者id，就诊流水号，挂号流水号
function toIframe(patientid,admisSerialno,serialno){
	$('#TreatFrame').contents().find('#hiddenpatientId').val(patientid);
	$('#TreatFrame').contents().find('#hiddenadmisSerialno').val(admisSerialno);
	$('#TreatFrame').contents().find('#hiddenserialno').val(serialno);
}
//已接诊中在有效期内该医生没有接诊过该患者
function treatSaveCall(serialno,patientid,patientName){
	//该患者在有效期内没有就诊记录
	url=$WEB_ROOT_PATH+"/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=treatedSave";
	postReq(url,'',function(data){
		var admisSerialno = data["dto.paadm"].admisSerialno;
		toIframe(patientid,admisSerialno,serialno);
		if(admisSerialno != null && admisSerialno != '') {
			document.getElementById('TreatFrame').contentWindow.loadPatinetInfo(patientid,admisSerialno,serialno);//加载患者信息
//			$CommonUI.autoCloseCenterMessage("开始接诊接诊  <span style='color: blue;'>"+patientName+"</span>!","info","",1000);
		}
	},'','',{'dto.paadm.patientid': patientid,'dto.paadm.serialno': serialno});
}
//加载所有就诊信息
function loadTreatedInfo(patientid,newadmisSerialno,admisSerialno,newserialno){
	var iframeID = document.getElementById('TreatFrame').contentWindow;
	iframeID.loadPatinetInfo(patientid,newadmisSerialno,newserialno); //加载患者信息
	iframeID.loadAppendInfo(admisSerialno);						//加载门诊病历附属信息
	iframeID.diagdetail(admisSerialno);							//加载门诊病历诊断信息
	iframeID.loadOrder(admisSerialno);							//加载医嘱
	iframeID.loadTreatedRecord(patientid);						//加载历次就诊记录列表
}
/*//已接诊接诊操作(根据情况接诊秦海版本)
function clickreceive(serialno,patientid,patientName){
	document.getElementById('TreatFrame').contentWindow.clearAll();
	var empIdAdmis=$('#hiddenLoginId').val();//登陆者的ID
	$.getJSON($WEB_ROOT_PATH+ "/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=getAdmisSerialno",
			{"dto.paadm.serialno":serialno},
			function(d) {
				if (d['total'] == 0) {//该挂号流水号没有查询到就诊记录
					treatSaveCall(serialno,patientid,patientName);
					selectAndRefresh();
				}else {//该患者在有效期内有就诊记录
					if(d["rows"][0].empIdAdmis==empIdAdmis) {
						//数据库进行了排序，直接取第一个的医生ID与session中医生id作比较,相同说明最近一次是该医生接诊
						var admisSerialno = d["rows"][0].admisSerialno;
						url=$WEB_ROOT_PATH+"/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=treatedUpdate";
						postReq(url,'',function(data){
							if(admisSerialno != null && admisSerialno != '') {
								toIframe(patientid,admisSerialno,serialno);
								loadTreatedInfo(patientid,admisSerialno,serialno);
								selectAndRefresh();
//								$CommonUI.autoCloseCenterMessage("再次接诊  <span style='color: blue;'>"+patientName+"</span> 成功!","info","",1000);
							}
						},'','',{'dto.paadm.admisSerialno': admisSerialno});
					} else {
						var flag = 0; //定义一个变量，作为是否有该医生的就诊记录的标志位
						for(var i=0; i<d["total"]; i++) {//遍历查找是否有该医生的就诊记录
							if(d["rows"][i].empIdAdmis == empIdAdmis) {
								flag++;//标志位置1
								var admisSerialno = d["rows"][i].admisSerialno;
								$CommonUI.confirm('您接诊之后， <span style="color: blue;">'+patientName+'</span>被其他医生接诊过，确定再次接诊吗', 'question', '', function(){
									url=$WEB_ROOT_PATH+"/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=treatedUpdate";
									postReq(url,'',function(data){
										var admisSerialno = data["dto.paadm"].admisSerialno;
										if(admisSerialno != null && admisSerialno != '') {
											toIframe(patientid,admisSerialno,serialno);
											loadTreatedInfo(patientid,admisSerialno,serialno);
											selectAndRefresh();
//											$CommonUI.autoCloseCenterMessage("再次接诊  <span style='color: blue;'>"+patientName+"</span> 成功!","info","",1000);
										}
									},'','',{'dto.paadm.admisSerialno': admisSerialno});
								});
							}
						}
						if (flag == 0) {//就诊记录中没有该医生对该患者的就诊记录
							treatSaveCall(serialno,patientid,patientName);
							selectAndRefresh();
						}
				}
		}
	});
	$('#patientList').datagrid('options').url=$WEB_ROOT_PATH+'/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=receivelist';
	$('#patientList').datagrid('load');
}*/


//若接诊日期和就诊日期是同一天则采用一条就诊记录，若不是同一天则生成新的就诊记录，页面显示原有就诊记录
function clickreceive(serialno,patientid,patientName,admisSerialno,admisDatetime){
	if(admisDatetime!=null && admisDatetime.length>10){
		admisDatetime = admisDatetime.substring(0,10);
	}
	var newadmisDatetime=formatterDate(new Date());
	if(admisDatetime==newadmisDatetime){
		document.getElementById('TreatFrame').contentWindow.clearAll();
		toIframe(patientid,admisSerialno,serialno);
		loadTreatedInfo(patientid,admisSerialno,admisSerialno,serialno);
	}else{
		url=$WEB_ROOT_PATH+"/treatment/directTreatment.ajax";
		postReq(url,'',function(data){
			if(data["rows"].length>0){
				var newadmisSerialno = data["rows"][0].admisSerialno;
				var newserialno=data["rows"][0].serialno;
				document.getElementById('TreatFrame').contentWindow.clearAll();
				toIframe(patientid,newadmisSerialno,newserialno);
				var iframeID = document.getElementById('TreatFrame').contentWindow;//不加载医嘱信息
				iframeID.loadPatinetInfo(patientid,newadmisSerialno,newserialno); //加载患者信息
				iframeID.loadNoUuidAppendInfo(admisSerialno);						//加载门诊病历附属信息
				iframeID.diagnouuiddetail(admisSerialno);							//加载门诊病历诊断信息
				iframeID.loadTreatedRecord(patientid);
			}
		},'','',{'patientid':patientid});
	}
}

//挂号
function patRegister() {
	var grid = $CommonUI.getComboGrid('#patientComboGrid').combogrid('grid');	
	var row = grid.datagrid('getSelected');
	if(row!=null){	
		$.ajax({
	        type: "GET",
			url: $WEB_ROOT_PATH+"/patientManage/patientManageCtrl.htm?BLHMI=checkPatient",
			data: {'dto.paregister.patientid': row.patientid},
	        dataType: "json",
	        success: function(data){
	                var res=data.rows;
	                if(res.length != 0){
	                	var mySelect=$("input[name='selectPatientType']:checked").val();
	                    	url=$WEB_ROOT_PATH + "/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=nameQuery";
	                    	postReq(url,'',function(msg){
	                    		if(msg["total"] !=0) {
	                    			if(msg["rows"][0].mySelect==1) {
		                        		$("#wait").attr("checked",true);	
		                        		$CommonUI.getPropertyGrid('#patientList').datagrid({  
		                        		    url: "",
		                        		    height: (getIframeHeight()-80),
		                        		    width:310,
		                        		    showGroup: true,
		                        		    pagination: true,
		                        		    singleSelect: true,
		                        			rownumbers: true,
		                        		    scrollbarSize: 0,
		                        		    pageSize : 10,
		                        		    columns:waitcolumns,
		                        		    fitColumns:true,
		                        		    data:msg
		                        		});
		                        	$CommonUI.autoCloseCenterMessage("<span style='color: blue;'>"+row.patientName+"</span>已挂号（待接诊），无需重复挂号！","info","",1000);
		                    		} else if(msg["rows"][0].mySelect==2){
		                    			$("#treating").attr("checked",true);	
		                    			$('#patientList').datagrid({
		                    				height: (getIframeHeight()-80),
		                    				width:310,
		                    				url:"",//防止再次请求（默认记住最初地址）
		                        		    pagination: true,
		                        		    pagination: true,
		                    				pageSize : 10,
		                    				columns:receivecolumns,
		                        		    fitColumns:true,
		                	        	 	data:msg
		                        		});
			                        	$CommonUI.autoCloseCenterMessage("<span style='color: blue;'>"+row.patientName+"</span>已挂号（已接诊），无需重复挂号！","info","",1000);
		                    		}
	                    		} else {
	                    			registerDlg();
//	                    			$CommonUI.alert("<span style='color: blue;'>"+row.patientName+"</span>已挂其他医生专家号，不可再次挂号！","","提示");
	                    		}
	                    		$('#patientList').datagrid('loadData',msg);
	                		},'','',{"dto.patientid":row.patientid,"dto.mySelect":mySelect,"dto.patientName":row.patientName});
	                }else{
	                	registerDlg();
	                }
	        }}); 
	}
	else{
		$CommonUI.alert("请选择患者!","","提示");
	}
	//$('#patientComboGrid').combogrid('clear');//清空combobox 
	$("#patientComboGrid").combogrid("setValue","");
}
//挂号弹窗
function registerDlg(){
	$('#registerInfo').dialog('open').dialog('setTitle', '挂号');
	var options = {height: 190,width: '100%',singleSelect: true,pagination: true,rownumbers:false,fitColumns:true};
		var sortOpts = {remoteSort: false,sortName: '',sortOrder: ''};
		var pageOpts = {pageNumber: 1,pageSize: 10};
		var columns = [[
		    {title:"uuid",field:"uuid",width:30,hidden:true},
		    {title:"号别编码",field:"registid",width:30,hidden:true},
			{title:"日期",field:"curdate",width:30},						
			{title:"时间",field:"dateTypeid",width:20},
			{title:"时间转id",field:"dateType",width:20,hidden:true,
				formatter:function(value,row,index){
					if(row.dateTypeid=='上午'){
						row.dateType = '01';
					}else{
						row.dateType = '02';
					} 
					return row.dateType;
				}},
			{title:"号别",field:"registTypeid",width:20},
			{title:"医师",field:"empname",width:30},
			{title:"所属科室",field:"orgname",width:30},
			{title:"计划限额",field:"limitAmount",width:20,hidden: true},
			{title:"已使用数量",field:"usedAmount",width:20},
			{title:"已预约数",field:"usedresAmount",width:20,hidden: true},
			{title:"预约限额",field:"limitResamount",width:20,hidden: true},
			{title:"可挂号数",field:"resAmount",width:20, 
				formatter:function(value,row,index){
					return parseInt(row.limitAmount)-parseInt(row.usedAmount);
				}},
			{title:"操作",field:"action",width:30,
				    	 formatter:function(value,row,index){
				    		 var c="";
				    		 if((parseInt(row.limitAmount)-parseInt(row.usedAmount)) != 0){
				    			c = '<a href="#" onclick="clickRegister(\''+row.patientid+'\',\''+row.registid+'\',\''+row.empname+'\',\''+row.uuid+'\',\''+row.limitAmount+'\',\''+row.usedAmount+'\',\''+row.limitResamount+'\',\''+row.usedresAmount+'\',\''+row.curdate+'\',\''+row.dateType+'\',\''+row.registTypeid+'\')"><B>点击挂号</B></a> ';}
				    		 else if(parseInt(row.limitAmount)-parseInt(row.usedAmount) == 0){
				    			 c = '<B>已挂满</B> ';
				    		 	}
				    	   /* if(row.dateTypeid == '上午' && row.timeFlag != 0){
				    			var c = '<B>失效</B>';
    						}else if(row.dateTypeid == '下午' && row.timeFlag != 1){
    							var c = '<B>失效</B>';
    						}*/
							return c;
					    }}
				  ]];
		var queryParams = {page: 1,rows: 10};
		var url =  $WEB_ROOT_PATH+"/bookManage/getBookDoctorListByToday.ajax";
		$CommonUI.datagrid('#doclist', url, queryParams, columns, pageOpts, sortOpts, options);
}
	
function clickRegister(patientid,registid,empname,uuid,limitAmount,usedAmount,limitResamount,usedresAmount,curdate,dateType,registTypeid){
	var select = $CommonUI.getComboGrid('#patientComboGrid').combogrid('grid').datagrid('getSelected');
	if(select==null){
		select = new Object();
		select.patientName=RegisterPatientName;
		select.patientid = RegisterPatientID;
	}
	if(empname == "" || empname == "普通医师" || empname == "普通医生"){
		register = "你确定给 <span style='color: blue;'>"+select.patientName+"</span> 挂 <span style='color: blue;'>普通号</span> 吗？";
	} else {
		register = "你确定给<span style='color: blue;'>"+select.patientName+"</span>挂<span style='color: blue;'>"+empname+"</span>的</span><span style='color: red;'>专家号</span>吗？";
	}
	$CommonUI.confirm(register, 'question', '', function(){
		$.post($WEB_ROOT_PATH+"/patientManage/patientManageCtrl.htm?BLHMI=patRegAndUpdatePao",
				{
				//门急诊挂号登记
				 'dto.paregister.patientid': select.patientid,
			 	 'dto.paregister.registid':registid,
			     'dto.paregister.registTypeid': registTypeid,
			     'dto.paregister.dateTypeid': dateType,
			     //更新挂号号表,已使用数量
			     'dto.paoClinic.uuid':uuid
				}, function(data){
					var opts=$.evalJSON(data);
					var patientid = opts["dto.paregister"].patientid;
					$CommonUI.getDataGrid('#patientList').datagrid({
						height: 431,
						url:$WEB_ROOT_PATH + "/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=nameQuery",
						columns:waitcolumns,
						queryParams:{page : 1,rows : 10,"dto.patientid":patientid,"dto.mySelect":1}
					});
					/*url=$WEB_ROOT_PATH + "/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=nameQuery";
                	postReq(url,'',function(msg){
                		$('#patientList').datagrid('loadData',msg);
                		$("#wait").attr("checked",true);	
                		$('#patientList').datagrid({
                			url:"",
                			columns:waitcolumns,
        	        	 	data:msg
                		});
            		},'','',{"dto.patientid":patientid,"dto.mySelect":1});*/
			$("#wait").attr("checked",true);
			$("#registerInfo").dialog('close');	
			$CommonUI.autoCloseCenterMessage("给<span style='color: blue;'>"+select.patientName+"</span>挂号成功!","info","",1000);
		});
	});
}

//查询(无用)
function nameQuery() {
	var patientName2 = $("#patientName2").val();
	//replace(/^\s+|\s+$/g,"");去除两头空格
	patientName2 = patientName2.replace(/\s+/g,""); //输入全是空格或者tab，去除所有空格
	if(patientName2 == ""){
		selectAndRefresh();
	} else {
		var mySelect = $("input[name='selectPatientType']:checked").val();
		var url = $WEB_ROOT_PATH + "/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=nameQuery";
		var columns = [[
				        {field:'patientName',title:'姓名',width:50,align:'center',sort:true},
				        {field:'patientTelephone',title:'移动电话',width:70,align:'center'},
				    	{field:'patientSexId',title:'性别',width:30,align:'center'},
				    	{field:'patientAge',title:'年龄',width:30,align:'center'},
				    	{field:'statusName',title:'状态',width:40,align:'center',
				    		formatter: function(value,row,index){
				    			if(row.mySelect == 2) {
				    				return "<span style='color: red;'>已接诊</span>";
				    			}else {
				    				if(row.bookStatus == 00){
				    					return "<span style='color: green;'>预约</span>";
				    				} else {
				    					return "<span style='color: brown;'>挂号</span>";
				    				}
				    			}
				    	}},
				    	{field:'action',title : "操作",width:30,align:'center',
				    		formatter:function(value,row,index){
				    			if(row.mySelect == 1) {
			    		    		var c = '<a href="#" onclick="clickwait(\''+row.statusName+'\',\''+row.patientid+'\',\''+row.serialno+'\',\''+row.registid+'\',\''+row.validdate1+'\',\''+row.validdate2+'\',\''+row.bookid+'\',\''+row.registTypeid+'\',\''+row.dateTypeid+'\',\''+row.dateTypename+'\',\''+row.patientName+'\')">接诊</a> ';
			    					return c;
			    		    	}else {
						    		var c = '<a href="#" onclick="clickreceive(\''+row.serialno+'\',\''+row.patientid+'\',\''+row.patientName+'\','+row.admisSerialno+')">接诊</a> ';
									return c; 
				    			}
							}},
				    	{field:'mySelect',title:'待接诊与已接诊切换',hidden:true,formatter:function(value,row,index){
				    			if(row.mySelect == 1) {
									$("#wait").attr("checked",true);
								}else {
									$("#treating").attr("checked",true);
								}
				    		}}
					    ]];
		var queryParams = {page : 1,rows : 10,"dto.patientName":patientName2,"dto.mySelect":mySelect};
		var options = {height : 431,width : 310,singleSelect: true,pagination: true,rownumbers:true,fitColumns:true};
		var sortOpts = {remoteSort: false,sortName: '',sortOrder: ''};
		var pageOpts = {pageNumber: 1,pageSize: 10};
		$CommonUI.datagrid('#patientList', url, queryParams, columns, pageOpts, sortOpts, options);
	}
	$('#patientName2').val("");
}
//输入框回车查询
function entersearch(){
   var event = window.event || arguments.callee.caller.arguments[0];
   if (event.keyCode == 13)
   {
	   nameQuery();
   }
}
//列表双击事件
function DblclickFuntion(index,row){
	var mySelect=$("input[name='selectPatientType']:checked").val();
	if(mySelect==1) {
		clickwait(row.statusName,""+row.patientid,""+row.serialno,""+row.registid,row.validdate1,row.validdate2,""+row.bookid,""+row.registTypeid,row.dateTypeid,row.dateTypename,row.patientName);
	}else if(mySelect==2) {
		clickreceive(""+row.serialno,""+row.patientid,row.patientName,row.admisSerialno,row.admisDatetime);
	}
}
function createPatient(){
	isUpdate="0";
	document.getElementById('family').style.display='none';
	document.getElementById('contact').style.display='none';
	$CommonUI.getForm('#createForm').form('clear');
	$('#dlg').dialog('open').dialog('move',{"top": "50"}).dialog('setTitle', '新增患者信息');
	clearValidata();
	$CommonUI.getComboBox('#patientIdentityid').combobox({ 
	    url: $WEB_ROOT_PATH + '/patientManage/getDefaultValueWhenCreatePatient.ajax',
	    valueField:'patientIdentityid',  
	    textField:'patientIdentityname'  
	});
}
function onSelectCountry(record){
	var value = $('#countryid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=country&dto.value="+value;
    $('#provinCesid').combobox('setValue', "");  
    $('#cityid').combobox('setValue', ""); 
    $('#cityaeraid').combobox('setValue', "");  
    $('#provinCesid').combobox('reload', url);  
}
function onSelectCity(record){
	var value = $('#cityid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=city&dto.value="+value;
    if($('#cityaeraid').combobox('getValue')!=null&&$('#cityaeraid').combobox('getValue')!=""){
    	$CommonUI.alert("请正确输入区县");
    }
    $('#cityaeraid').combobox('setValue', "");  
    $('#cityaeraid').combobox('reload', url);  
}
function onSelectProvice(record){
	var value = $('#provinCesid').combobox('getValue');
    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=province&dto.value="+value;
    $('#cityid').combobox('setValue', "");  
    $('#cityaeraid').combobox('setValue', "");
    $('#cityid').combobox('reload', url); 
}
function myclose(){
	 $('#dlg').dialog('close');
}
function saveCreate() {
	var isValid = $CommonUI.getForm('createForm').form('validate');
	if (isValid) {
		var patientid = $('#createForm input[name="patientid"]').val();
		if (patientid == "" || patientid == null) {
			var patientName = $('#createForm input[name="patientName"]').val();
			var arrRslt = makePy(patientName); 
			$('#inputstr').val(arrRslt);
			$.post($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax",{"patientName":patientName},function(d){
				if(d!=null&&d!=""){
					if(d['total']!=0){
						$CommonUI.confirm(patientName+"已存在，是否创建", 'question', '确定', function(){
							patientNameConfirm();
						}, '取消', function(){
							return;
						});
					}else{
						patientNameConfirm();
					}
				}
			},"json");
		}else {
			/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
			$('#patientIdentityname').val(patientIdentityname);*/
			/*var patientTelephone = $('#createForm input[name="dto.patient.patientTelephone"]').val();
			if(patientTelephone.length!=11){
				$CommonUI.alert("请输入有效的移动电话");
				return;
			}
			var phone= mobilePhoneCheck(patientTelephone);
			if(phone==false){
				$CommonUI.alert("请输入正确的移动电话");
				return;
			}*/
			var icard = $('#createForm input[name="icard"]').val();
			if (icard == "" || icard == null) {
				changeImg();
				var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
					return;
				}
				postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=update', 'createForm',
						succAdd, err, {skipHidden : false});
			}else{
				if(icard.length==15){
					 var icard1= checkCardId1(icard);
					 checkCardId(icard1);
				}else{
					checkCardId(icard);
				}
				if(flagPat=="0"){
					$CommonUI.alert("输入身份证号码格式不正确!");
					return;
				}
				if(flagPat=="1"){
					if(icard.length==15){
						 var icard1= checkCardId1(icard);
						 icard= icard1;
					}
					var sex=getPersonSexByIdcard(icard);//身份证查询性别
					var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
					if(sex=="男"){
						$('#patientSexId').combobox('setValue',1);
					}
					else{
						$('#patientSexId').combobox('setValue',2);
					}
					sex=sex+"性";
					$('#patientSexId').combobox('setText',sex);
					$('#patientSename').val(sex+"性");
					changeImg();
					$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
					
					var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
					var today = formatterDate(new Date());
					var compare=dateCompare(birthDate,today);
					if(compare=='1'){
						$CommonUI.alert("请选择正确的出生日期!");
						return;
					}
					var icard = $('#createForm input[name="icard"]').val();
					$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax?icard="+ icard, function(d) {
						if(d!=null&&d!=""){
							if(d['total']==1||d['total']==0){
								/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
								$('#patientIdentityname').val(patientIdentityname);*/
								postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=update', 'createForm',
										succAdd, err, {skipHidden : false});
							}
							else{
								$CommonUI.alert("身份证信息已存在!");
							}
						}
					});
					}
				}
			}
		} 
	else {
		$CommonUI.alert("红色为必填项");
	}
}
function upperCase(){
	flagPat="1";
	var icard= $('#icard').val();
	if (icard == "" || icard == null) {return;}else{
		var idcardTypeid= $('#idcardTypeid').combobox('getValue');
		if (idcardTypeid == "" || idcardTypeid == null) {
			$CommonUI.alert("请选择证件类型！");
			return;}
		else{
			if(icard.length==15){
				 var icard1= checkCardId1(icard);
				 icard =icard1;
			}
			checkCardId(icard);
			var sex=getPersonSexByIdcard(icard);//身份证查询性别
			var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
			if(sex=="男"){
				$('#patientSexId').combobox('setValue',1);
			}
			else{
				$('#patientSexId').combobox('setValue',2);
			}
			$('#patientSexId').combobox('setText',sex);
			$('#patientSename').val(sex);
			$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
			changeImg();
		}
	}
}
function replace(mthis){
	 var result=$(mthis).attr("value").replace(/(^\s*)|(\s*$)/g, "");  
     $(mthis).attr("value",result); 
}
formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};
function err(){
	$CommonUI.alert("失败");
};
function succAdd(PatData) {
	if(PatData==null||PatData==""){
		$CommonUI.alert("登记患者信息失败");
		return;
	}
	myclose();
	RegisterPatientID=PatData["dto.patient"].patientid;
	RegisterPatientName = PatData["dto.patient"].patientName;
	if(isUpdate=="0"){
		directTreatment(RegisterPatientID);
	}else if(isUpdate=="1"){
		document.getElementById('TreatFrame').contentWindow.loadBasicInfo(RegisterPatientID);
	}
};
//直接接诊
function directTreatment(patientId) {
	var row;
	if(patientId!==""&&patientId!=undefined){
		row = new Object();
		row.patientid=patientId;
	}else{
		row = $CommonUI.getComboGrid('#patientComboGrid').combogrid('grid').datagrid('getSelected');
	}
	if(row!=null){	
		$.post($WEB_ROOT_PATH+"/treatment/directTreatment.ajax",
			{'patientid': row.patientid},function(data){
				if(data.total!=0){
					document.getElementById('TreatFrame').contentWindow.clearAll();
					toIframe(data.rows[0].patientid,data.rows[0].admisSerialno,data.rows[0].serialno);
					loadTreatedInfo(data.rows[0].patientid,data.rows[0].admisSerialno,data.rows[0].admisSerialno,data.rows[0].serialno);
					//$("#treating").attr("checked",true);
					selectAndRefresh();
					$CommonUI.getComboGrid('#patientComboGrid').combogrid('clear');
				}else{
					$CommonUI.alert("对不起，已没有可用挂号，如需接诊请排班增加医生挂号数量！");
				}
			},"json");
	}else{
		if($CommonUI.getComboGrid('#patientComboGrid').combogrid('getValue')!=""){
			$CommonUI.confirm('是否登记该患者', 'question', '', function(){
				createPatient();
			});
		}
	}
}
window.onload = function(){
	if(parent.patientFlag=="1"){
		parent.patientFlag="2";
		directTreatment(parent.patientId);
	}
};

function treatsearch(){
	var mySelect=$("input[name='selectPatientType']:checked").val();
	var dateStr = $('#begindate').datebox('getValue');
	if(mySelect==1){
		$CommonUI.getDataGrid('#patientList').datagrid({
			pageNumber: 1,
			url:$WEB_ROOT_PATH+"/treatment/getWaitPatientList.ajax",
			queryParams:{
				page:1,
				rows:10,
				bookDate:dateStr//预约日期
			}
		});
	}else{
		$CommonUI.getDataGrid('#patientList').datagrid({
			pageNumber: 1,
			url:$WEB_ROOT_PATH+"/treatment/getReceivePatientList.ajax",
			queryParams:{
				page:1,
				rows:10,
				AdmisDatetime:dateStr//就诊日期
			}
		});
	}
}

//日期转化格式
var formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

//加载患者详细信息
function loadPatientDetailInfo(patientid){
	isUpdate="1";
	document.getElementById('family').style.display='none';
	document.getElementById('contact').style.display='none';
	$CommonUI.getForm('#createForm').form('clear');
	$('#dlg').dialog('open').dialog('center').dialog('move',{"top": "50"}).dialog('setTitle', '修改登记信息');
	clearValidata();
	$("#patientid").attr("value", patientid);
	changeImg();
	$CommonUI.getComboBox('#patientIdentityid').combobox({ 
	    url: $WEB_ROOT_PATH + '/patientManage/getDefaultValueWhenCreatePatient.ajax',
	    valueField:'patientIdentityid',  
	    textField:'patientIdentityname'  
	});
	$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientById.ajax?patientid="
			+ patientid, function(d) {
		$('#patientTelephone').val(d['dto.patient'].patientTelephone);
		$('#createForm input[name="dto.patient.patientName"]').val(d['dto.patient'].patientName);
		$('#patientEname').val(d['dto.patient'].patientEname);
		$('#patientIdentityname').val(d['dto.patient'].patientIdentityname);
		$('#createForm input[name="dto.patient.patientTelephone"]').val(d['dto.patient'].patientTelephone);
		if(d['dto.patient'].idcardTypeid!=null&&d['dto.patient'].idcardTypeid!=""){
			$('#idcardTypeid').combobox('setValue',d['dto.patient'].idcardTypeid);
			$('#icard').val(d['dto.patient'].icard);
		}
		$('#patientSexId').combobox('setValue',d['dto.patient'].patientSexId);
		changeImg();
		$CommonUI.getDateBox('#birthDate').datebox('setValue', d['dto.patient'].birthDate);
		$('#patientIdentityid').combobox('setValue',d['dto.patient'].patientIdentityid);
		$('#marriedid').combobox('setValue',d['dto.patient'].marriedid);
		$('#nationalityid').combobox('setValue',d['dto.patient'].nationalityid);
		$('#occupationid').combobox('setValue',d['dto.patient'].occupationid);
		if(d['dto.patient'].countryid!=null&&d['dto.patient'].countryid!=""){
			$('#countryid').combobox('setValue',d['dto.patient'].countryid);
			var value = $('#countryid').combobox('getValue');
		    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=country&dto.value="+value;
		    $('#provinCesid').combobox('setValue', "");  
		    $('#provinCesid').combobox('reload', url); 
			if(d['dto.patient'].provinCesid!=null&&d['dto.patient'].provinCesid!=""){
				$('#provinCesid').combobox('setValue',d['dto.patient'].provinCesid);
				var value = $('#provinCesid').combobox('getValue');
			    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=province&dto.value="+value;
			    $('#cityid').combobox('setValue', "");  
			    $('#cityid').combobox('reload', url); 
				if(d['dto.patient'].cityid!=null&&d['dto.patient'].cityid!=""){
					$('#cityid').combobox('setValue',d['dto.patient'].cityid);
					var value = $('#cityid').combobox('getValue');
				    var url = $WEB_ROOT_PATH+"/comDictList/comDictListCtrl.htm?BLHMI=listDictContent&dto.type=city&dto.value="+value;
				    $('#cityaeraid').combobox('setValue', "");  
				    $('#cityaeraid').combobox('reload', url);  
					$('#cityaeraid').combobox('setValue',d['dto.patient'].cityaeraid);
				}
			}
		}
		$('#inputstr').val(d['dto.patient'].inputstr);
		$('#streetinfo').val(d['dto.patient'].streetinfo);
		$('#flPostcode').val(d['dto.patient'].flPostcode);
		$('#entName').val(d['dto.patient'].entName);
		$('#entContactor').val(d['dto.patient'].entContactor);
		$('#entAddr').val(d['dto.patient'].entAddr);
		$('#entTelenum').val(d['dto.patient'].entTelenum);
		$('#entPostcode').val(d['dto.patient'].entPostcode);
		$('#ctName').val(d['dto.patient'].ctName);
		$('#ctRoleid').val(d['dto.patient'].ctRoleid);
		$('#ctAddr').val(d['dto.patient'].ctAddr);
		$('#ctElenum').val(d['dto.patient'].ctElenum);
		$('#createDatetime').val(d['dto.patient'].createDatetime);
	});
}
//清空登记dlg的validata悬浮框
function clearValidata(){
	$('#patientName').removeClass('validatebox-invalid');
	$('#patientTelephone').removeClass('validatebox-invalid');
}
//更改男女头像图片
function changeImg() { 
	var curIndex= $('#patientSexId').combobox('getValue');
	var arr=new Array(); 
	arr[0]="wz.jpg"; 
	arr[1]="man.png"; 
	arr[2]="woman.png"; 
	var obj=document.getElementById("tp"); 
	if (curIndex!=1&&curIndex!=2) { 
		curIndex=0; 
	}
	var strs=obj.src.split("/");
	obj.src=obj.src.replace(strs[strs.length-1],arr[curIndex]);
}
function checkCardId(socialNo){  
	if (socialNo.length != 18) {  
		flagPat="0";
	    return (false);  
	  }  
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};   
	if(area[parseInt(socialNo.substr(0,2))]==null) {  
		flagPat="0";
        return (false);  
   }   
	var Wi = new Array(  
            7,9,10,5,8,4,2,1,6,  
            3,7,9,10,5,8,4,2,1  
            );  
	var   lSum    = 0;  
	var   nNum    = 0;  
    for (var i = 0; i < 17; ++i){  
        if ( socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9' ){  
        	flagPat="0";
            return (false);  
        }  
        else{  
            nNum = socialNo.charAt(i) - '0';  
        }  
         lSum += nNum * Wi[i];  
    }  
    if( socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x'){  
        lSum += 10*Wi[17];  
    }  
    else if ( socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9' ){  
    	flagPat="0";
        return (false);  
    }  
    else{  
        lSum += ( socialNo.charAt(17) - '0' ) * Wi[17];  
    }  
    if ( (lSum % 11) == 1 ){  
        return true;  
    }  
    else{  
    	flagPat="0";
        return (false);  
    } 
}  

function checkCardId1(id){
	var lastNumber;
	var zone=id.substring(0,6);
	var year="19" + id.substring(6,8);
	var mdo=id.substring(8,15);
	id = zone + year + mdo;
	var getNum=eval(id.charAt(0)*7 +id.charAt(1)*9 +id.charAt(2)*10 +id.charAt(3)*5 +id.charAt(4)*8 +id.charAt(5)*4 +id.charAt(6)*2 +id.charAt(7)*1 +id.charAt(8)*6 +id.charAt(9)*3 +id.charAt(10)*7 +id.charAt(11)*9 +id.charAt(12)*10 +id.charAt(13)*5 +id.charAt(14)*8 +id.charAt(15)*4 +id.charAt(16)*2);
	getNum=getNum%11;
	switch (getNum) {
	case 0 :
	lastNumber="1";
	break;
	case 1 :
	lastNumber="0";
	break;
	case 2 :
	lastNumber="X";
	break;
	case 3 :
	lastNumber="9";
	break;
	case 4 :
	lastNumber="8";
	break;
	case 5 :
	lastNumber="7";
	break;
	case 6 :
	lastNumber="6";
	break;
	case 7 :
	lastNumber="5";
	break;
	case 8 :
	lastNumber="4";
	break;
	case 9 :
	lastNumber="3";
	break;
	case 10 :
	lastNumber="2";
	break;
	}
	id = id + lastNumber;
	return id;
};
formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};
/*//已接诊列表点击接诊生成新的就诊记录，并带出原来就诊信息
function creatnewadm(serialno,patientid,patientName){
	url=$WEB_ROOT_PATH+"/treatmentpatientlist/treatmentpatientlistCtrl.htm?BLHMI=treatedSave";
	postReq(url,'',function(data){
		var newadmisSerialno = data["dto.paadm"].admisSerialno;
		toIframe(patientid,admisSerialno,serialno);
		if(admisSerialno != null && admisSerialno != '') {
			document.getElementById('TreatFrame').contentWindow.loadPatinetInfo(patientid,admisSerialno,serialno);//加载患者信息
		}
	},'','',{'dto.paadm.patientid': patientid,'dto.paadm.serialno': serialno});
}*/

function ename(){
	var patientName = $('#createForm input[name="patientName"]').val();
	var patientEname=getLettersUpper(patientName);
	$('#patientEname').val(patientEname);
}
function telePhoneConfirm(){
	var idcardTypeid= $('#idcardTypeid').combobox('getValue');
	var icard = $('#createForm input[name="icard"]').val();
	if (idcardTypeid == "" || idcardTypeid == null) {
		if(icard!=null&&icard!=""){
			$CommonUI.alert("请选择证件类型！");
			return;
		}
		else{
			changeImg();
			var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
			if (birthDate == "" || birthDate == null) {
				$CommonUI.alert("出生日期不为空！");
			}
			else{
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
				}else{
					postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
				}
			}
		}
	}
	else{
		if(icard==null||icard==""){
			changeImg();
			var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
			if (birthDate == "" || birthDate == null) {
				$CommonUI.alert("出生日期不为空！");
			}else{
				var today = formatterDate(new Date());
				var compare=dateCompare(birthDate,today);
				if(compare=='1'){
					$CommonUI.alert("请选择正确的出生日期!");
				}else{
					postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
				}
			}
		}
		else{
			var icard = $('#createForm input[name="icard"]').val();
			if(icard.length==15){
				 var icard1= checkCardId1(icard);
				 checkCardId(icard1);
			}else{
				checkCardId(icard);
			}
			if(flagPat=="0"){
				$CommonUI.alert("输入身份证号码格式不正确!");
			}
			if(flagPat=="1"){
				if(icard.length==15){
					var icard1= checkCardId1(icard);
					icard = icard1;
				}
				var sex=getPersonSexByIdcard(icard);//身份证查询性别
				var birthday=getPersonBirthDateByIdcard(icard);//身份证查询出生日期
				if(sex=="男"){
					$('#patientSexId').combobox('setValue',1);
				}
				else{
					$('#patientSexId').combobox('setValue',2);
				}
				changeImg();
				sex=sex+"性";
				$('#patientSexId').combobox('setText',sex);
				$('#patientSename').val(sex);
				$CommonUI.getDateBox('#birthDate').datebox('setValue',birthday);
				var birthDate= $CommonUI.getDateBox('#birthDate').datebox('getValue');
				if (birthDate == "" || birthDate == null) {
					$CommonUI.alert("出生日期不为空！");
				}
				else{
					var today = formatterDate(new Date());
					var compare=dateCompare(birthDate,today);
					if(compare=='1'){
						$CommonUI.alert("请选择正确的出生日期!");
					}else{
						var icard = $('#createForm input[name="icard"]').val();
						$.getJSON($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax?icard="+ icard, function(d) {
							if(d!=null&&d!=""){
								if(d['total']==0){
									/*var  patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
									$('#patientIdentityname').val(patientIdentityname);*/
									postReq($WEB_ROOT_PATH+ '/patientManage/savePatient.ajax?BLHMI=save', 'createForm',succAdd, err, {skipHidden : false});
								}
								else{
									$CommonUI.alert("身份证信息已存在!");
								}
							}
						});
					}
				}
			}
		}
	}
}
function setIdentityname(){
	var patientIdentityname = $CommonUI.getComboBox('#patientIdentityid').combobox('getText');
	$('#patientIdentityname').val(patientIdentityname);
}
//选择出生日期时触发select
function checkBirthDay(){
	var result = valiBirthData();
	if(!result){
		$CommonUI.alert("请输入有效的出生日期！");
		if($('#age').numberbox('getValue') == ''){
			$('#birthDate').datebox('setValue','');
		}else{
			var birYear = new Date().getFullYear()-$('#age').val();
			$('#birthDate').datebox('setValue',birYear+'-01-01');
		}
		return;
	}
	var age = getPersonAgeByBirthDate($('#birthDate').datebox('getValue'));
	$('#age').numberbox('setValue',age);
}
function patientNameConfirm() {
	var patientTelephone = $('#createForm input[name="dto.patient.patientTelephone"]').val();
//	if(patientTelephone.length!=11){
//		$CommonUI.alert("请输入有效的移动电话");
//		return;
//	}
//	var phone= mobilePhoneCheck(patientTelephone);
//	if(phone==false){
//		$CommonUI.alert("请输入正确的移动电话");
//		return;
//	}else{
	$.post($WEB_ROOT_PATH+ "/patientManage/getPatientList.ajax",{"dto.patientTelephone":patientTelephone},function(d){
		if(d!=null&&d!=""){
			if(d['total']!=0){
				$CommonUI.confirm(patientTelephone+"已存在，是否创建", 'question', '确定', function(){
					telePhoneConfirm();
				}, '取消', function(){
					return;
				});
			}else{
				telePhoneConfirm();
			}
		}
	},"json");
//	}
}
//防止html注入
function illegalChar(id){
	var name = $(id).val().match(/^([\u4e00-\u9fa5]{0,20}|[a-zA-Z]{0,32})$/g);
	if (name==null){
		$(id).val("");
		$CommonUI.alert("请输入中英文！");
		return;
	}
}
//根据输入的年龄生成出生日期
function createBirthday(){
	if($('#age').val() < 0 || $('#age').val() > 150){
		$CommonUI.alert('请输入正确的年龄！','error');
		$('#age').val('');
		$('#birthDate').datebox('setValue','');
		return;
	}
	var birYear = new Date().getFullYear()-$('#age').val();
	if($('#birthDate').datebox('getValue') == ''){
		$('#birthDate').datebox('setValue',birYear+'-01-01');
	}else{
		$('#birthDate').datebox('setValue',birYear+$('#birthDate').datebox('getValue').substring(4));
	}
}
