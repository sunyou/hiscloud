$(function(){
	$CommonUI.getDateBox("#startDate").datebox("setValue",formatterDate(new Date()));
	$CommonUI.getDateBox("#endDate").datebox("setValue",formatterDate(new Date(new Date().valueOf()+6*24*60*60*1000)));
	$CommonUI.getDialog("#calendarDlg").dialog("move", {"top" : "0"});
	$CommonUI.getDialog("#bookInfo").dialog("move", {"top" : "50"});
	var options = {toolbar : "#tb",height : 220,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true,scrollbarSize:0};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 10,pageList:[5]};
	var columns = [ [
	     	    	{title : "id",field : "patientid",width : 80,align : 'center',hidden:true},
	     			{title : "姓名",field : "patientName",width : 80,align : 'center'},
	     			{title : "性别",field : "patientSexid",width : 80,align : 'center'},
	     			{title : "出生日期",field : "birthDate",width : 80,align : 'center',hidden:true},
	     			{title : "年龄",field : "age",width:80,align : 'center'},
	     			{title : "证件号码",field : "icard",width : 150,align : 'center'},
	     			{title : "移动电话",field : "patientTelephone",width : 150,align : 'center'},
	     			{title : "省",field : "provinCesid",width : 50,align : 'center',hidden:true},
	     			{title : "市",field : "cityid",width : 50,align : 'center',hidden:true},
	     			{title : "县",field : "cityaeraid",width : 50,align : 'center',hidden:true},
	     			{title : "街道",field : "streetinfo",width : 50,align : 'center',hidden:true},
	     			{title : "创建时间",field : "createDatetime",width : 150,align : 'center',hidden:true},
	     			{title : "详细地址",field : "address",width : 150,align : 'center',
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
		     				    return familyAddress;
	     				}},
	     				
	     			{title : "操作",field:"action",width:100,align:'center',
	     				formatter:function(value,row,index){
	    		    		var c = '<a href="#" onclick="book(\''+row.patientid+'\',\''+row.patientName+'\',\''+row.patientSexId+'\',\''+row.age+'\',\''+row.icard+'\',\''+row.patientTelephone+'\',\''+row.provinCesid+'\',\''+row.cityid+'\',\''+row.cityaeraid+'\',\''+row.streetinfo+'\')">预约</a> ';
	    					return c;
	    		    	}}
	     		    ] ];
	
	var queryParams = {page : 1,rows : 10};
	var url = $WEB_ROOT_PATH + "/patientManage/getPatientList.ajax";
	$CommonUI.datagrid('#patientinfo', url, queryParams, columns, pageOpts, sortOpts,options);
	
	var options1 = {toolbar : "#tb1",height : 220,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true,scrollbarSize:0};
	var startDate =  $CommonUI.getDateBox('#startDate').datebox('getValue');		
	var endDate = $CommonUI.getDateBox('#endDate').datebox('getValue');
	var queryParams1 = {page : 1,rows : 10,"startDate":startDate,"endDate":endDate};
	var columns1 = [ [
	                  	{title : "预约编号", field : "bookid",width : 80,align : 'center',hidden:true},
	                  	{title : "uuid", field : "paoClinicUuid",width : 100,align : 'center',hidden:true},
	                  	{title : "患者编号",field : "patientid",width : 80,align : 'center',hidden:true},
	                    {title : "号别编码",field:"registid",width:30,hidden:true},
	                  	{title : "日期",field:"curdate",width:60,hidden:true},						
						{title : "时间",field:"dateTypeid",width:20,hidden:true},
						{title : "时间转id",field:"dateType",width:20,hidden:true,
							formatter:function(value,row,index){
								if(row.dateTypeid=='上午'){
									row.dateType = '01';
								}else{
									row.dateType = '02';
								} 
								return row.dateType;
							}},
		     			{title : "姓名",field : "patientName",width : 80,align : 'center'},
		     			{title : "性别",field : "patientSexId",width : 80,align : 'center',
		     				formatter:function(value,row,index){
		    		    		if(row.patientSexid!=""&&row.patientSexid!=null){
	     						
	     							var patientSexId;
    								if(row.patientSexid=='0'){
    									patientSexId = '未知的性别';
    								}else if(row.patientSexid=='1'){
    									patientSexId = '男性';
    								}else{
    									patientSexId = '女性';
    								} 
	    							
	     							return patientSexId;
	     							
	     						}
		    		    		
		    		    	}},
		     			{title : "年龄",field : "age",width : 80,align : 'center',
		     				formatter:function(value,row,index){
		     					if(row.birthDate!=""&&row.birthDate!=null){
		     						var birthDate=row.birthDate.substr(0,10);
		     						return ages(birthDate);
		     					}
		     				}
		     			},
		     			{title : "移动电话",field : "patientTelephone",width : 90,align : 'center'},
		    		    {title : "预约日期",field : "bookDate",width : 80,align : 'center',hidden: true},
		    		    {title : "预约时间",field : "bookTime",width : 80,align : 'center',
		    		    	formatter:function(value,row,index){
		    		    		if(row.bookDate!=""&&row.bookDate!=null){
	     							var bookDate = row.bookDate.substr(0,10);
	     							var dateTypeid;
    								if(row.dateTypeid=='01'){
    									dateTypeid = '上午';
    								}else{
    									dateTypeid = '下午';
    								} 
	    							
	     							return bookDate+' '+dateTypeid;
	     							
	     						}
		    		    		
		    		    	}},
		     			{title : "预约医师",field : "empnameDiag",width : 80,align : 'center',
								formatter:function(value,row,index){
									if(row.empnameDiag == ''){
										return '普通医师';
									}else 
										return row.empnameDiag;
									}
		    		    },
		    		    {title : "所属科室",field:"orgname",align : 'center',width:70},
		    		    {title : "预约方式",field : "bookUsemode",width : 80,align : 'center',
		    		    	formatter:function(value,row,index){
								if(row.bookUsemode == '01'){
									return '人工预约';
								}else 
									return '';
								}	
		    		    },
		     			{title : "症状",field : "symptoms",width : 80,align : 'center'},
		     			{title : "预约状态",field : "bookStatus",width : 80,align : 'center',hidden: true},
		     			{title : "操作",field:"action",width:80,align:'center',
		     				formatter:function(value,row,index){
		     					var today = formatterDate(new Date());
		     					var c ='';
		     					if(row.bookDate >= today){
		     						 c = '<a href="#" onclick="cancleBook(\''+row.bookid+'\',\''+row.patientName+'\',\''+row.paoClinicUuid+'\')">取消预约</a> ';
		     					}
		    					return c;
		    		    	}}
		     		    ] ];
	var url1 = $WEB_ROOT_PATH+"/bookManage/getBookPatientList.ajax";
	$CommonUI.datagrid('#bookedInfo', url1, queryParams1, columns1, pageOpts, sortOpts,options1);
});
function RegisterQuery() {	
	var patientName = $("#patientName").val();
	var patientTelephone = $("#patientTelephone").val();
	
	$CommonUI.getDataGrid('#patientinfo').datagrid({
		url:$WEB_ROOT_PATH + "/patientManage/getPatientList.ajax",
		queryParams:{
			"patientName":patientName,
			"patientTelephone":patientTelephone
		}
	});
}

function BookedQuery() {		
	var patientName = $("#patientName1").val();
	var patientTelephone = $("#patientTelephone1").val();
	var startDate =  $CommonUI.getDateBox('#startDate').datebox('getValue');		
	var endDate = $CommonUI.getDateBox('#endDate').datebox('getValue');

	if((startDate != '' && endDate == '')||(startDate == '' && endDate != '')){
		$CommonUI.autoCloseCenterMessage("请选择完整的预约初始和结束日期！","info","",1000);
		 return;
	}
	if(startDate != '' && endDate != ''){
		var result1 = startDate.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
		if (result1==null){
			$CommonUI.alert("预约初始日期格式不正确！","warning");
			return;
		}
		var result2 = endDate.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
		if (result2==null){
			$CommonUI.alert("预约结束日期格式不正确！","warning");
			return;
		}
		if(startDate > endDate){
			$CommonUI.autoCloseCenterMessage("预约初始日期不能大于结束日期！","info","",1000);
			 return;
		}
	}
	$CommonUI.getDataGrid('#bookedInfo').datagrid({
		url:$WEB_ROOT_PATH+"/bookManage/getBookPatientList.ajax",
		queryParams:{
			"patientName":patientName,
			"patientTelephone":patientTelephone,
			"startDate":startDate,
			"endDate":endDate
		}
	});
}

function book(patientid,patientName,patientSexId,age,icard,patientTelephone,provinCesid,cityid,cityaeraid,streetinfo){
	if(icard == null || icard == 'null'){
		icard = '';
	}
	$('#calendarDlg').dialog('open').dialog('setTitle', '预约');
	$('#symptoms').val('');
	$('#patientidL').val(patientid);
	$('#patientNameL').text(patientName);
	if(patientSexId != 'undefined'){
		$('#patientSexIdL').text(patientSexId);
    }
	
	$('#patientAgeL').text(age);
	var familyAddress = ""; 
    if(provinCesid != 'undefined'){
    	familyAddress+=provinCesid;
    }
    if(cityid != 'undefined'){
    	familyAddress+=cityid;;
    }
    if(cityaeraid != 'undefined'){
    	familyAddress+=cityaeraid;;
    }
    if(streetinfo != 'undefined'){
    	familyAddress+=streetinfo;;
    }
    if(patientTelephone != 'undefined'){
    	$('#patientTelephoneL').text(patientTelephone);
    }
	
	
	$('#streetinfoL').text(familyAddress);
	$('#icardL').text(icard);
	
	$CommonUI.fullcalendar('#calendar', '', $WEB_ROOT_PATH+"/bookManage/getBookCalendar.ajax", {}, 'GET',
	  function(calEvent, jsEvent, view) {
				if(calEvent.id == "01"){
					var curdate = formatterDate(new Date(calEvent.start));
					var patientid = $('#patientidL').val();
					
					$.ajax({
				        type: "GET",
						url: $WEB_ROOT_PATH+"/bookManage/checkPatientCanBook.ajax",
						data: {'bookDate': curdate,'patientId':patientid},
				        dataType: "json",
				        success: function(data){
				            
				                if(data == '1'){
				                	$CommonUI.autoCloseCenterMessage("您已经预约了今天的号,不可多次预约！","info","",1000);
				                }else{
				                	
				                	$('#bookInfo').dialog('open').dialog('setTitle','预约信息');
			    					$('#bookInfo').dialog('open');
				                	var options = {
				    						toolbar : "",
				    						height: 190,
				    						width: '100%',
				    						singleSelect: true,
				    						pagination: true,
				    						rownumbers:false,
				    						fitColumns:true,
				    						onLoadSuccess:function(){
				    							var length = $CommonUI.getDataGrid('#doclist').datagrid('getRows').length;
				    							for(var i=0; i<length;i++){
				    								$CommonUI.getDataGrid('#doclist').datagrid('beginEdit',i);
				    								}
				    							},
				    						 onSelect:function(record){
					    						 $CommonUI.getDataGrid('#doclist').datagrid('beginEdit',record);
					    						}
				    						};
				    					var sortOpts = {
				    						remoteSort: false,
				    						sortName: '',
				    						sortOrder: 'asc'
				    								};
				    					var pageOpts = {
				    						pageNumber: 1,
				    						pageSize: 10
				    								};
				    					var columns = [[
				    					    {title:"uuid",field:"uuid",width:30,hidden:true},
				    					    {title:"号别编码",field:"registid",width:30,hidden:true},
				    						{title:"日期",field:"curdate",width:30,
				    					    	formatter:function(value,row,index){
				    		    		    		if(row.curdate!=""&&row.curdate!=null){
				    	     							var curdate = row.curdate.substr(0,10);
				    	     							return curdate;
				    	     							
				    	     						}
				    		    		    		
				    		    		    	}
				    					    },						
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
				    						{title:"医师id",field:"empid",width:20,hidden: true},
				    						{title:"医师",field:"empname",width:30,
				    							formatter:function(value,row,index){
				    								if(row.empid == ''){
				    									return '普通医师';
				    								}else 
				    									return row.empname;
				    								}
			    							},
				    						{title:"所属科室",field:"orgname",width:30},
				    						{title:"计划限额",field:"limitAmount",width:20,hidden:true},
				            				{title:"已使用数量",field:"usedAmount",width:20,hidden:true},
				    						{title:"已预约数",field:"usedresAmount",width:30},
				    						{title:"预约限额",field:"limitResamount",width:20,hidden: true},
				    						{title:"可预约数",field:"limitResamount1",width:30, 
				    							formatter:function(value,row,index){
				    								return parseInt(row.limitResamount)-parseInt(row.usedresAmount);
				    							}},
			    							/*{title:"预约方式",field:"bookUsemode",width:30,editor:{type:'combobox',options:{valueField:'id',textField:'text',panelHeight:70,data:[{id:'03',text:'现场'},{id:'02',text:'网络'},{id:'01',text:'电话'}]}}},*/
				    						{title:"操作",field:"action",width:30,
				    							    	 formatter:function(value,row,index){
				    							    		var c = '';
				    							    		if((parseInt(row.limitResamount)-parseInt(row.usedresAmount)) != 0){
				    							    			 c = '<a href="#" onclick="clickBook(\''+row.empid+'\',\''+row.empname+'\',\''+row.orgid+'\',\''+row.orgname+'\',\''+row.uuid+'\',\''+row.curdate+'\',\''+row.dateType+'\',\''+row.registid+'\')"><B>点击预约</B></a> ';}
				    							    		else{
				    							    			  c = '<B>已约满</B> ';
				    							    		 	}
				    										return c;
				    								    }}
				    							  ]];
				    					var queryParams = {
				    						page: 1,
				    						rows: 10
				    								  };
				    					var url =  $WEB_ROOT_PATH+"/bookManage/getBookDoctorListByDate.ajax?curdate="+curdate;
				    					$CommonUI.datagrid('#doclist', url, queryParams, columns, pageOpts, sortOpts, options);				
				    					
				                }
				        }});
					
						}
				},function(date, jsEvent, view){}); 
}

function clickBook(empid,empname,orgid,orgname,uuid,curdate,dateType,registid){
	
	//$CommonUI.getDataGrid('#doclist').datagrid('endEdit',index);
	/*var bookUsemodeEditor = $('#doclist').datagrid('getEditor', {index:index,field:'bookUsemode'});
	var bookUsemode = $(bookUsemodeEditor.target).combobox('getValue');
	if(bookUsemode == undefined){
		$CommonUI.autoCloseCenterMessage("请选择预约方式！","info","",1000);
		return;
	}*/
	
	var patientid = $('#patientidL').val();
	var symptoms =  $('#symptoms').val();
	if(empname == ''){
		tip = "确定预约 <span style='color: red'>普通医师</span> 的号吗？";
	} else {
		tip = "确定预约  <span style='color: red'>"+empname+"</span> 的专家号吗？";
	}
	
	$CommonUI.confirm(tip, 'question', '', function(){
		postReq($WEB_ROOT_PATH+"/bookManage/bookManageCtrl.ajax?BLHMI=saveBookAndUpdatePao",'',
				function(result){
			        if(result == '0'){
			        	$CommonUI.alert("预约失败！");
			        	$("#doclist").datagrid('reload');
			        }else {
			        	$CommonUI.autoCloseCenterMessage("预约成功！","info","",1000);
						$("#bookInfo").dialog('close');
						$("#bookedInfo").datagrid('reload');
						$('#calendar').fullCalendar( 'refetchEvents');
			        }
				},
				function(){
						$CommonUI.autoCloseCenterMessage("预约失败！","info","",1000);},
				{skipHidden : false},
				{'patientid': patientid,
				 'paoClinicUuid': uuid,
				 'symptoms': symptoms,
				 'bookDate': curdate,
				 'empId_diag':empid,
				 'empnameDiag': empname,
				 'orgid':orgid,
				 'orgname': orgname,
				 'bookUsemode': '01',
				 'dateTypeid': dateType,
				 'registid': registid
				});
	});
}

function cancleBook(bookid,patientName,paoClinicUuid) {
	$CommonUI.confirm("确定要取消<span style='color: red'> "+patientName+" </span>的预约吗?", 'question', '', function(){
		var url=$WEB_ROOT_PATH+"/bookManage/bookManageCtrl.ajax?BLHMI=cancleBookAndUpdatePao&bookId="+bookid+"&paoClinicUuid="+paoClinicUuid;

		postReq(url,'',
				function(result){	
			 		if(result == '0'){
			 			$CommonUI.alert("<span style='color: red'> "+patientName+" </span>已被接诊，不能取消预约！");
			 			$CommonUI.getDataGrid("#bookedInfo").datagrid('reload');
			 		}else if(result == '1'){
			 			$CommonUI.getDataGrid("#bookedInfo").datagrid('reload');
			 			$CommonUI.autoCloseCenterMessage("取消预约成功！","info","",1000);
			 		}else{
			 			$CommonUI.autoCloseCenterMessage("取消预约失败！","info","",1000);
			 			
					}
				},
				function(){			
					$CommonUI.autoCloseCenterMessage("取消预约失败！","info","",1000);
				},{skipHidden : false},{'bookid': bookid,
					'paoClinicUuid':paoClinicUuid
				  });
	});
}

function redirect2PatientReg(){
	parent.changeUrl($WEB_ROOT_PATH+'/patientManage/patient-index.html','患者管理');
}

formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

//计算年龄
function  ages(str){   
      var   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);     
      if(r==null)return   false;     
      var d= new Date(r[1], r[3]-1, r[4]);     
      if (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])   
      {   
            var Y = new Date().getFullYear();   
            return (Y-r[1]);   
      }   
    
}   