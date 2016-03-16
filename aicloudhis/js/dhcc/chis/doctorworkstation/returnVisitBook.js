//随访
function followUpTreat(){
		var patientid = $('#hiddenpatientId').val();
		var curdate = $CommonUI.getDateBox('#returnVisitDate').datebox('getValue');
		if(curdate==null || curdate == ''){
			return -1;
		}
		var result = curdate.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
		if (result==null){
			$CommonUI.alert("随访日期格式不正确！","warning");
			return -1;
		}
		postReq($WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=followUpBook","",
				function(result){
					if(result.total==-1){
						$CommonUI.alert("随访日期应大于当前日期");
					}else if(result.total==-2){
						$CommonUI.alert("该患者已有 "+curdate+" 预约！","info");
					}else if(result.total==-3){
						$CommonUI.alert("该患者近期挂号在 "+curdate+" 有效！","info");
					}else if(result.total==-4){
						$CommonUI.alert(curdate+"没有普通医师的号或已挂满！","info");
					}else if(result.total==1){
						$CommonUI.autoCloseCenterMessage("预约成功！","info","",1000);
					}
			},"",{"skipHidden":false},{'dto.bookDate': curdate,'dto.patientid':patientid});
		
		/*
		var today = new Date().format('yyyy-MM-dd');
		if(curdate <= today){
			$CommonUI.autoCloseCenterMessage("回访日期应大于今天！","info","",1000);
 			return;
		}
		$.ajax({
	        type: "POST",
			url: $WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=checkReturnVisitBook",
			data: {'dto.bookDate': curdate,'dto.patientid':patientid},
	        dataType: "json",
	        success: function(data){
	                if(data.total != 0){
	                	$CommonUI.autoCloseCenterMessage("该患者已有 "+curdate+" 预约！","info","",1000);
	                	return;
	                }else{
	                	$.ajax({
	        		        type: "POST",
	        				url: $WEB_ROOT_PATH+"/paRegister/paRegisterCtrl.htm?BLHMI=list",
	        				data: {'dto.dateString': curdate,'dto.paRegister.patientid':patientid},
	        		        dataType: "json",
	        		        success: function(data){
	        		        	if(data.totals != 0){
	        		        		$CommonUI.autoCloseCenterMessage("该患者近期挂号在 "+curdate+" 有效！","info","",1000);
	        		        	}else{
	        		        		$.ajax({
	    		        				type: "POST",
	    		        				url:$WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=ordinaryDoclistCheck",
	    		        				data: {'dto.curdate': curdate},
	    		        		        dataType: "json",
	    		        		        success: function(data){
	    		        		        	if(data.rows == 0){
	    		        		        		$CommonUI.autoCloseCenterMessage(curdate+"没有普通医师的号或已挂满！","info","",1000);
	    		        		        	}else{
	    		        		    			$('#bookInfo').dialog('open').dialog('setTitle','预约信息');
	    		        		            		var options = {
	    		        		    					toolbar : "",
	    		        		    					height: 190,
	    		        		    					width: '100%',
	    		        		    					singleSelect: true,
	    		        		    					pagination: true,
	    		        		    					rownumbers:false,
	    		        		    					fitColumns:true,
	    		        		    					onClickRow:function(){}
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
	    		        		    					{title:"预约方式",field:"bookUsemode",width:30,editor:{type:'combobox',options:{valueField:'id',textField:'text',panelHeight:70,data:[{id:'03',text:'现场'},{id:'02',text:'网络'},{id:'01',text:'电话'}]}}},
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
	    		        		    				var url =  $WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=ordinaryDoclistCheck&dto.curdate="+curdate;
	    		        		    				$CommonUI.datagrid('#doclist', url, queryParams, columns, pageOpts, sortOpts, options);	
	    		        		        	}
	    		        		        }
	    		        			});
	        		        	}
	        		        	
	        		        }
	                	});
	                }}
			});*/
}
function clickBook(empid,empname,orgid,orgname,uuid,curdate,dateType,registid){
	
	var patientid = $('#hiddenpatientId').val();
	if(empname == ''){
		tip = "确定预约 <span style='color: red'>普通医师</span> 的号吗？";
	} else {
		tip = "确定预约  <span style='color: red'>"+empname+"</span> 的专家号吗？";
	}
	
	$CommonUI.confirm(tip, 'question', '', function(){
		postReq($WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=saveBookAndUpdatePao",'',
				function(msg){
			        if(msg["dto"].result == '0'){
			        	$CommonUI.alert("预约失败！");
			        	$("#doclist").datagrid('reload');
			        }else {
			        	$CommonUI.autoCloseCenterMessage("预约成功！","info","",1000);
						$("#bookInfo").dialog('close');
			        }
				},
				function(){
						$CommonUI.autoCloseCenterMessage("预约失败！","info","",1000);},
				{skipHidden : false},
				{'dto.patientBook.patientid': patientid,
				 'dto.patientBook.paoClinicUuid': uuid,
				 'dto.patientBook.bookDate': curdate,
				 'dto.patientBook.empId_diag':empid,
				 'dto.patientBook.empnameDiag': empname,
				 'dto.patientBook.orgid':orgid,
				 'dto.patientBook.orgname': orgname,
				 'dto.patientBook.bookUsemode': '03',
				 
				 'dto.patientBook.dateTypeid': dateType,
				 'dto.patientBook.registid': registid,
				 'dto.paoClinic.uuid':uuid
				});
	});
}
