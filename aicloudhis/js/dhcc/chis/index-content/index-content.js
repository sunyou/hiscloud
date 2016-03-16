var PageNo=1;
var PageSize=5;
$(function(){
	
	$CommonUI.getDateBox("#bookStartDate").datebox("setValue",formatterDate(new Date()));
	$CommonUI.getDateBox("#bookEndDate").datebox("setValue",formatterDate(new Date()));
	// 解决ie9/10下日历控件文字被遮挡了一部分的问题
	if ($.browser.msie){
		if($.browser.version.substr(0,2) == "9." || $.browser.version.substr(0,3) == "10."){
			$("#book_search .datebox input[type=text][class*=combo-text][class*=validatebox-text]")
				.css("padding-top","0px").css("padding-bottom","0px");
			$CommonUI.getDateBox("#bookStartDate").datebox("setValue",formatterDate(new Date()));
			$CommonUI.getDateBox("#bookEndDate").datebox("setValue",formatterDate(new Date()));
		}
	}
	//我的日程
	$CommonUI.getDialog("#myScheduleDlg").dialog("move", {"top" : "0"});
	//预约
	$CommonUI.getDialog("#calendarDlg").dialog("move", {"top" : "10"});
	
	//$CommonUI.getDialog("#bookInfo").dialog("move", {"top" : "50"});
	//患者管理
	$CommonUI.getDialog("#patdlg").dialog("move", {"top" : "10"});
	
	$("#div_space").show();
	//bookCountChart();
	/*
	$CommonUI.initCharts();
	$CommonUI.Charts('yuyueView', 'AngularGauge', 'yuyuetongji',$WEB_ROOT_PATH+"/indexContent/getIndexChartXml.ajax", 'jsonurl','375','300','javascript');
	window.dataUpdateTimer = null;
	
	FusionCharts.addEventListener("Rendered", function(e,a) {
		var updater= e.sender.setData? e.sender : null;
		//写入隐藏域
		bookCountChart();
		setTimeout(function (){if(updater) updater.setData(1,bookCountChart());},1000*1);
		//if(updater) updater.setData(1,bookCountChart());
		
		//定时执行
		window.dataUpdateTimer = window.setInterval (function (){ 

			var updater= e.sender.setData? e.sender : null;
			if(updater) updater.setData(1,bookCountChart());

		},1000*60*60*24 );
	});
	*/
	
	//我的日程begin

	//日期的插件  ----开始
	$('#my_calendar').fullCalendar({
		//表示日期插件的表头
			header: {
				//表示左侧的按钮
				left: 'prev,today,next',
				right:''
			},
			//默认日期--这个有个问题，如果设置了这个的话会出现一个小BUG就是进入以后显示的不是当周的日期好像只有周一的时候会出现这个情况
			//defaultDate: d,
			//today: d,
			// firstDay: 1,
			//是否可以点击添加事件
			selectable: true,
			//选择助手？还是帮助，不懂
			selectHelper: true,
			columnFormat: "ddd\nMM-DD",
			//设置相应的汉字
			buttonText:{
				prev: '',
				next: ''
			},
			//设置语言
			lang : 'zh-cn',
			//是否能编辑窗口
			editable : false,
			//定义固定的高度
			//weekMode : 'variable',
			//height:200,
			//表示宽高比
			//aspectRatio : 1.5,
			//设置头的高度
			contentHeight: 200,
			
			//表示显示当周的信息
			defaultView : 'basicWeek',
			//表示每行的事件间隔	
			//slotDuration : '03:00:00',

			//设置页面的事件不可以被拖动修改
			eventStartEditable : false,
			
			slotEventOverlap : true,
			//上面是否显示全天的东西
			allDaySlot : true,
			allDayText : '',
			//左侧的时间显示
			//axisFormat : 'HH:mm',
			//显示的开始事件
			//minTime : '6:00:00',
			//结束事件
			//maxTime : '24:00:00',
			
			//设置抬头显示的时间格式
			timeFormat: '',

			//添加的单击事件--------2
			//2.0.2版本中的参数变了 ---缺少了一个allDay的东西，来判断是否是全天事件，这个先忽略掉，以后再说
			select : function(start, end) {
				//alert(1);
				//调用弹出窗口的方法，点击页面上的话会弹出来一个新的添加事件的窗口
				//这句话是用来表示是否是全天事件呢
				var m = $.fullCalendar.moment(start);
				var allDay = !m.hasTime();
				//fullCalendar.formatData的意思是格式化的获取日历对象上面的日期
				if(allDay){
					//alert(allDay);
					//alert($.fullCalendar.moment(start).format('YYYY-MM-DD'));
					//alert($.fullCalendar.moment(end).format('YYYY-MM-DD'));
					showNewEventWindow($.fullCalendar.moment(start).format('YYYY-MM-DD'),
							$.fullCalendar.moment(end).format('YYYY-MM-DD'),allDay);
				}else{
					/*showNewEventWindow($.fullCalendar.moment(start).format('YYYY-MM-DD HH:mm'),
							$.fullCalendar.moment(end).format('YYYY-MM-DD HH:mm'),allDay);*/
				}
			
				//取消选中
				$('my_calendar').fullCalendar('unselect');
				
			},
			//点击存在的事件的时候调用的方法
			eventClick:function(calEvent,jsEvent,view) {
			   showModifyEventWindow(calEvent,$.fullCalendar.moment(view.start).format('YYYY-MM-DD HH:mm'));
			},
			//每次日历加载时进行viewDisplay这个方法也被换掉了，用viewRender来代替了----1
			viewRender : function(view){
			   //和1.x的版本不同了，换了相应的方法了，坑爹啊这是！！！！
				$("#startTime").val($.fullCalendar.moment(view.start).format('YYYY-MM-DD HH:mm'));
				$("#endTime").val($.fullCalendar.moment(view.end).format('YYYY-MM-DD HH:mm'));
				showEventsToCalendar($.fullCalendar.moment(view.start).format('YYYY-MM-DD HH:mm'),
						 	$.fullCalendar.moment(view.end).format('YYYY-MM-DD HH:mm'));
			}
		});
	//我的日程end
	
	//选择条件日期控件加载
	OutCalandarDateYM('BookOutCalandarYear','BookOutCalandarMonth','BookOutCalandarDay');
	OutCalandarDateYM("OutPatientOutCalandarYear","OutPatientOutCalandarMonth","");
	OutCalandarDateYM("CostOutCalandarYear","CostOutCalandarMonth","");
	
	//预加载预约列表内容
	bookList();
	
	//预加载患者列表内容
	patientList();
	
	//加载预约待诊统计数
	bookWaitingCount();
	
	//门诊指标内容显示
	outPatientCount();
	
	//收费指标内容显示
	costSum();
	
	//初始化时-分  
	for(var i=0 ;i<=23;i++){
		$("#hour").append("<option value='"+i+"'>"+i+"</option>"); 		 
	}
	for(var i=0 ;i<=59;i++){
		$("#minute").append("<option value='"+i+"'>"+i+"</option>"); 		 
	}
	
});

//单击添加提醒
function showNewEventWindow(start, end, allDay){
	$('#hour').val("");
	$('#minute').val("");
	$('#infoid').val("");
	$('#title').val("");	
	$('#contentInfo').val("");
	$("#isDeskRemind").attr('checked',false);
	
	$('#schFlag').val("save");
	$('#startdate').val(start);
	$('#myScheduleDlg').dialog('open').dialog('setTitle', '我的日程');
}

//我的提醒初始化
function showEventsToCalendar(start, end){
	$('#my_calendar').fullCalendar('removeEvents'); 
	$.ajax({
		  type: "post",
		  //这里要添加接口的调用  调用相应的接口
		  url: $WEB_ROOT_PATH + "/schedule/getMyScheduleList.ajax",
		  //start  当前周的日期，，，end   当前周的末---和上面2调用的不同，不一样没关系！！！！
		  data:{"startTime":start,"endTime":end},
		  dataType: "json",
		  success: function(jsonEvent){
			  
			  if(jsonEvent.result){
				  if(jsonEvent.eventTotal>0){
						$.each(jsonEvent.eventData,function(i,event){
							addEventToCalendar(event,true);
						});
					}
			  }else{
				  //$("#Div_Error").css("display","inline");
			  }
		 }
	});
}
//我的日程-双击已有日程展示弹出框进行修改
function showModifyEventWindow(calEvent,start){
	$('#myScheduleDlg').dialog('open').dialog('setTitle', '我的日程');
	$('#schFlag').val("update");
	//值回填
	$('#startdate').val(start);
	$('#infoid').val(calEvent.id);
	$('#title').val(calEvent.title);	
	$('#contentInfo').val(calEvent.content); 
	$("#hour option").eq(calEvent.hour).attr("selected",true);  //选中当前时间
	$("#minute option").eq(calEvent.minute).attr("selected",true);
	if(calEvent.isDeskRemind == 1){
	  $("#isDeskRemind").attr('checked',true);
	}
	//显示删除按钮
	$("#deleteMySchedule").css("display","");
	
}
//删除我的日程
function deleteMySchedule(){
	$('#schFlag').val("delete");
	var infoid = $("#infoid").val();
	postReq($WEB_ROOT_PATH+ '/schedule/deleteScheduleInfo.ajax?infoid='+infoid,'',succAddSch, err, {skipHidden : false});
}

//添加一个日程事件的方法
function addEventToCalendar(calEvent,stick){
	
	 $('#my_calendar').fullCalendar('renderEvent', calEvent, stick); 
}

function loadAgain(id){
	if (id!='' && id!=null){
		var cur_year=$("#BookOutCalandarYear_year").val();
		var cur_month=parseInt($("#BookOutCalandarMonth_month").val())+1;
		var cur_day=parseInt($("#BookOutCalandarDay_day").val());
		//某月最后一天
		var last_day=getLastMonthDay(cur_year,cur_month);
		if (cur_day*1>last_day){
			cur_day=last_day;
		}
		OutCalandarDateDay(cur_day,last_day);
		//加载预约列表内容
		bookList();
	}
	
}

function bookCountChart(){
	$.ajax({
        type: "GET",
        //url: $WEB_ROOT_PATH + "/js/index/index-test.json"
		url: $WEB_ROOT_PATH+"/indexStatisticsData/indexStatisticsDataCtrl.htm?BLHMI=bookWaitingCountChart",
		data:{},

        dataType: "json",
        success: function(data){
        	var bookData=data.dto;
        	//$("#bookWaitingCountChart").val(bookData.bookWaitingCount);
        	$CommonUI.initCharts();
        	$CommonUI.Charts('yuyueView', 'AngularGauge', 'yuyuetongji',$WEB_ROOT_PATH+"/indexContent/getIndexChartXml.ajax", 'jsonurl','375','200','flash');
        	window.dataUpdateTimer = null;
        	
        	FusionCharts.addEventListener("Rendered", function(e,a) {
        		var updater= e.sender.setData? e.sender : null;
        		if(updater) updater.setData(1,bookData.bookWaitingCount);
        	});
        }

    });
	//return $("#bookWaitingCountChart").val();
}

function update(date) {
	$.post("",{date:date},function(result){
		
	});
}

function gotodoc(obj){
}

function list(type){
	
}
function bookList(){
	var PageNo=$("#curPage2").val();
	//var curdate=$("#BookOutCalandarYear_year").val()+"-"+$("#BookOutCalandarMonth_month").val()+"-"+$("#BookOutCalandarDay_day").val();
	var patName=$("#book_patientName").val();
	var patTel=$("#book_patientTelephone").val();
	var patStartDate=$("#bookStartDate").datebox('getValue');
	var patEndDate=$("#bookEndDate").datebox('getValue');	
	var resultStart = patStartDate.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
	if (resultStart==null){
		$CommonUI.alert("预约初始日期格式不正确！","warning");
		return;
	}
	var resultEnd = patEndDate.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
	if (resultEnd==null){
		$CommonUI.alert("预约结束日期格式不正确！","warning");
		return;
	}
	if(patStartDate > patEndDate){
		$CommonUI.autoCloseCenterMessage("预约初始日期不能大于结束日期！","info","",1000);
		 return;
	}
	$.ajax({

         type: "post",          
         url: $WEB_ROOT_PATH+"/bookManage/getBookPatientList.ajax",
         data: {"patientName":patName,"patientTelephone":patTel,"endDate":patEndDate,"startDate":patStartDate,"page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#list_content').empty();   //清空resText里面的所有内容
                var html = '';
                var yuyuedata=data.rows;
                for(var i=0;i<yuyuedata.length;i++){
                	 var datas = yuyuedata[i];                    
                	 if(datas.symptoms==null||datas.symptoms=='null'){
                		 datas.symptoms="";
                	 }
                	 var birthDate = datas.birthDate; 
                	 if(birthDate==null){
                		 birthDate = "";                		 
                	 }else{
                		 birthDate = birthDate.substr(0,10);
                	 }
                	 var bookDate = datas.bookDate;
                	 if(bookDate==null){
                		 bookDate = "";                		 
                	 }else{
                		 bookDate = bookDate.substr(0,10);
                	 }
                	 var sex = datas.patientSexid;
                	 if(datas.patientSexid=="0"){
                		 sex ="男";
                	 }else if(datas.patientSexid=="1"){
                		 sex ="女";
                	 }else{
                		 sex ="未知";
                	 }
                	 
                	 var patientName = "";
                	 if(datas.patientName == null || datas.patientName == ""){
                		 patientName = "";
                	 }else{
                		 patientName = datas.patientName;
                	 }
                	 
                	 var patientTelephone = "";
                	 if(datas.patientTelephone == null || datas.patientTelephone == ""){
                		 patiepatientTelephonentName = "";
                	 }else{
                		 patientTelephone = datas.patientTelephone;
                	 }
                	 
                     html = html+'<tr><td><a href="javascript:void(0)">'+patientName+'</a></td>';
                     html+='<td>'+sex+'</td>';
                     html+='<td>'+birthDate+'</td> ';
                     html+='<td>'+patientTelephone+'</td> ';              
             		 html+='<td>'+bookDate+'</td>';
                     if (datas.empnameDiag!=null && datas.empnameDiag!='null'){
                    	 html+='<td>'+datas.empnameDiag+'</td>';
                     } else {
                    	 html+='<td></td>';
                     }
                     html+='<td>'+datas.orgname+'</td>';
                     html+='<td>'+datas.symptoms+'</td>';
                     html+='<td><a href="javascript:gotoMainPage(4,\''+datas.patientid+'\')">诊疗</a></td> </tr>';

                }
                
                createTitle(1);
                $('#list_content').html(html);
                
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus2').empty();   //清空resText里面的所有内容
				$('#page_plus2').html(pagePlus(PageNo,lastPage,1));
             }

     });
}
 
//待就诊列表
function waitList(){
	var PageNo=$("#curPage2").val();
	$.ajax({
         type: "GET",          
		 url: $WEB_ROOT_PATH+"/treatment/getWaitPatientList.ajax",
		 data: {"page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#list_content').empty();   //清空resText里面的所有内容
                var html = '';
                var listdata=data.rows;
                for(var i=0;i<listdata.length;i++){
                	 var datas = listdata[i];  
                	 var sex = "";
                	 if(datas.patientSexid="0"){
                		 sex = "男";
                	 }else if(datas.patientSexid="1"){
                		 sex = "女";
                	 }else{
                		 sex = "未知";
                	 }
                	 var dateTypename = datas.dateTypename;
                	 if(dateTypename == null){
                		 dateTypename = ""; 
                	 }
                	 var empid = datas.empid;
                	 if(empid == null){
                		 empid = ""; 
                	 }
                	 var registTypeid = datas.registTypeid;
                	 if(registTypeid == null){
                		 registTypeid = ""; 
                	 }
                	 
                	 var patientName = "";
                	 if(datas.patientName == null || datas.patientName == ""){
                		 patientName = "";
                	 }else{
                		 patientName = datas.patientName;
                	 }
                	 
                	 var patientTelephone = "";
                	 if(datas.patientTelephone == null || datas.patientTelephone == ""){
                		 patiepatientTelephonentName = "";
                	 }else{
                		 patientTelephone = datas.patientTelephone;
                	 }
                	 
                     html = html+'<tr><td><a href="javascript:void(0)">'+patientName+'</a></td>';
                     html+='<td>'+datas.patientSexid+'</td>';
                     //html+='<td>'+datas.birthDate+'</td> ';
                     html+='<td>'+datas.patientAge+'</td> ';
                     html+='<td>'+patientTelephone+'</td> ';
                     if (datas.statusName !="" && datas.statusName !=null){
                    	 html+='<td>预约</td> ';
                     } else {
                    	 html+='<td>登记</td> ';
                     }
                     //html+='<td>'+datas.dateTypeid+'</td> ';
                     html+='<td>'+dateTypename+'</td> '; 
                     html+='<td>'+empid+'</td> '; 
                     html+='<td>'+registTypeid+'</td> '; 
                     html+='<td><a href="javascript:gotoMainPage(4,\''+datas.patientid+'\')">诊疗</a></td> </tr>';

                }
                createTitle(2);
                $('#list_content').html(html);
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus2').empty();   //清空resText里面的所有内容
				$('#page_plus2').html(pagePlus(PageNo,lastPage,3));
             }

     });
}

//已接诊列表
function receiveList(){
	var PageNo=$("#curPage2").val();
	$.ajax({
         type: "GET", 
		 url: $WEB_ROOT_PATH+"/treatment/getReceivePatientList.ajax",
		 data: {"page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#list_content').empty();   //清空resText里面的所有内容
                var html = '';
                var listdata=data.rows;
                
                for(var i=0;i<listdata.length;i++){              	
                	 var datas = listdata[i]; 
                	 var sex = "";
                	 if(datas.patientSexid="0"){
                		 sex = "男";
                	 }else if(datas.patientSexid="1"){
                		 sex = "女";
                	 }else{
                		 sex = "未知";
                	 }
                	 var dateTypename = datas.dateTypename;
                	 if(dateTypename == null){
                		 dateTypename = ""; 
                	 }
                	 var empnameInput = datas.empnameInput;
                	 if(empnameInput == null){
                		 empnameInput = ""; 
                	 }
                	 var registTypeid = datas.registTypeid;
                	 if(registTypeid == null){
                		 registTypeid = ""; 
                	 }
                	 var patientName = "";
                	 if(datas.patientName == null || datas.patientName == ""){
                		 patientName = "";
                	 }else{
                		 patientName = datas.patientName;
                	 }
                	 
                	 var patientTelephone = "";
                	 if(datas.patientTelephone == null || datas.patientTelephone == ""){
                		 patiepatientTelephonentName = "";
                	 }else{
                		 patientTelephone = datas.patientTelephone;
                	 }
                	 
                     html = html+'<tr><td><a href="javascript:void(0)">'+patientName+'</a></td>';
                     html+='<td>'+sex+'</td>';
                     //html+='<td>'+datas.birthDate+'</td> ';
                     html+='<td>'+datas.patientAge+'</td> ';
                     html+='<td>'+patientTelephone+'</td> ';
                     if (datas.bookid !="" && datas.bookid !=null){
                    	 html+='<td>预约</td> ';
                     } else {
                    	 html+='<td>登记</td> ';
                     }
                     //html+='<td>'+datas.dateTypeid+'</td> ';
                     html+='<td>'+dateTypename+'</td> '; 
                     html+='<td>'+empnameInput+'</td> '; 
                     html+='<td>'+registTypeid+'</td> '; 
                     html+='<td><a href="javascript:gotoMainPage(4,\''+datas.patientid+'\')">诊疗</a></td> </tr>';

                }
                
                createTitle(3);
                $('#list_content').html(html);
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus2').empty();   //清空resText里面的所有内容
				$('#page_plus2').html(pagePlus(PageNo,lastPage,4));
             }

     });
}


function patientList(){
	var PageNo=$("#curPage1").val();
	$.ajax({
        type: "post",         
		url: $WEB_ROOT_PATH+"/patientManage/patDiagnoseInfo.ajax",
        data: {"patientName":$("#patName").val(),"patientTelephone":$("#patTelephone").val(),"page":PageNo,"rows":PageSize},

        dataType: "json",
        success: function(data){
               $('#pat_list').empty();   //清空resText里面的所有内容
               var html = ''; 
               var patdata=data.rows;
               var tmp_date='';
               var tmp_diag="";
               var tmp_address="";
               var address="";
               var sexId="";
               var patientName = "";
               for(var i=0;i<patdata.length;i++){
               	 var datas = patdata[i];  
                   /*  alert(i);
                    alert(datas.patAddress);
                     */
               	if (datas.createDatetime != null &&datas.createDatetime!=''){
               		tmp_date=datas.createDatetime.substr(0,10); 
               	}
               	var date=new Date(2007,3,30,10,59,51); 
               	tmp_diag = datas.diagName;
               	if(tmp_diag !=null ){
               		if (tmp_diag.length>2){
                   		tmp_diag=tmp_diag.substring(0, 2)+'...';
                   	}	
               	}else{
               		tmp_diag = "";
               	}
               	patientName=datas.patientName;
               	if (patientName != null && patientName.length>4){
               		patientName=patientName.substring(0, 4)+'...';
               	}
               	sexId=datas.patientSexid;
               	if (sexId != null && sexId.length>2){
               		sexId=sexId.substring(0, 2)+'...';
               	} 
			    if(datas.provinCesid != null){
			    	address+=datas.provinCesid;
			    }
			    if(datas.cityid != null){
			    	address+=datas.cityid;
			    }
			    if(datas.cityaeraId != null){
			    	address+=datas.cityaeraId;
			    }
			    if(datas.streetinfo != null){
			    	address+=datas.streetinfo;
			    }				
               	
               	if (address.length>2){
               		tmp_address=address.substring(0, 15);
               	} else {
               		tmp_address=address;
               	}
               	var birthDate = datas.birthDate;
               	if(birthDate == null){
               		birthDate = "";
               	}
               	html = html+'<tr><td><a href="javascript:void(0)" title="'+datas.patientName+'" >'+patientName+'</a></td>'
				+'<td title="'+datas.patientSexid+'">'+sexId+'</td> '
				+'<td>'+birthDate+'</td> '
				+'<td>'+datas.patientTelephone+'</td> '
				+'<td title="'+address+'">'+tmp_address+'</td> '
				//+'<td>'+datas.icard+'</td>'
				+'<td>'+tmp_date+'</td>'
				+'<td title="'+datas.diagName+'">'+tmp_diag+'</td>'
				+'<td><a href="javascript:void(0)" onclick="javascript:book(\''+datas.patientId+'\',\''+datas.patientName+'\',\''+datas.patientSexid+'\',\''+datas.birthDate+'\',\''+datas.icard+'\',\''+datas.patientTelephone+'\',\''+datas.provinCesid+'\',\''+datas.cityid+'\',\''+datas.cityaeraId+'\',\''+datas.streetinfo+'\')">预约</a>&nbsp;&nbsp;<a href="javascript:gotoMainPage(4,\''+datas.patientId+'\')">诊疗</a></td> </tr>';
               
            	
               }
               $('#pat_list').html(html);
           	
            //翻页栏
			var total=data.total;
			var lastPage= Math.ceil(total/PageSize);
			$('#page_plus1').html(pagePlus(PageNo,lastPage,2));

            }

    });
}

//工作提醒指标内容显示
function bookWaitingCount(){
	var tmpcount=0;
	$.ajax({
        type: "GET", 
		url: $WEB_ROOT_PATH+"/indexContent/getBookWaitingTarget.ajax",
		data:{},
        dataType: "json",
        success: function(data){
        	var bookData=data.rows[0];
        	var count=bookData.bookWaitingCount;
        	
        	if (count*1==0){
        		$('#bookWaitingCount').html(count);
        	}  else {
        		$('#bookWaitingCount').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	count=bookData.regWaitingCount;
        	//门诊指标-待就诊数据统计
        	if (count*1==0){
        		$('#regWaitingCount').html(count);
        	}  else {
        		$('#regWaitingCount').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	count=bookData.chargedMoney;
        	if (count*1==0){
        		$('#chargedMoney').html(0);
        	}  else {
        		$('#chargedMoney').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	
        	count=bookData.unchargeMoney;
        	if (count*1==0){
        		$('#unchargeMoney').html(0);
        	}  else {
        		$('#unchargeMoney').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	//门诊指标-待就诊数据统计
        	count=bookData.treatmentingCount;
        	if (count*1==0){
				$('#treatmentingCount').html(count);
			}  else {
				$('#treatmentingCount').html("<a href='javascript:void(0)'>"+count+"</a>");
			}
        	
        	//门诊指标-已就诊数据统计
        	count=bookData.treatmentedCount;
        	if (count*1==0){
				$('#treatmentedCount').html(count);
			}  else {
				$('#treatmentedCount').html("<a href='javascript:void(0)'>"+count+"</a>");
			}
        	
        	$CommonUI.initCharts();
        	$CommonUI.Charts('yuyueView', 'AngularGauge', 'yuyuetongji',$WEB_ROOT_PATH+"/indexContent/getIndexChartXml.ajax", 'jsonurl','375','200','javascript');
        	
        	FusionCharts.addEventListener("Rendered", function(e,a) {
        		var updater= e.sender.setData? e.sender : null;
    
        		setTimeout(function (){if(updater) updater.setData(1,count);},2000*1);
        		//if(updater) updater.setData(1,count);
        	});
        }

    });
}

//门诊指标内容显示
function outPatientCount(){
	$.ajax({
        type: "GET",
        //url: $WEB_ROOT_PATH + "/js/index/index-test.json"
		url: $WEB_ROOT_PATH+"/indexContent/getOutpatientTarget.ajax",
		data:{},

        dataType: "json",
        success: function(data){
        	var bookData=data.dto;
        	var count=bookData.outPatientNum;
        	//门诊人次 
        	if (count*1==0){
        		$('#outPatientNum').html(count);
        	}  else {
        		$('#outPatientNum').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	//总收入
        	count=bookData.totalIncome;
        	if (count*1==0){
        		$('#totalIncome').html(count);
        	}  else {
        		$('#totalIncome').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	//次均费用
        	count=bookData.averageCost;
        	if (count*1==0){
        		$('#averageCost').html(count);
        	}  else {
        		$('#averageCost').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	//出诊次数
        	count=bookData.visitCount;
        	if (count*1==0){
        		$('#visitCount').html(count);
        	}  else {
        		$('#visitCount').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	//预约率
        	var bookRate="19%";
        	$('#bookRate').html(bookRate);
        	
        	//回访次数 
        	count=bookData.returnVisitCount;
        	if (count*1==0){
        		$('#returnVisitCount').html(count);
        	}  else {
        		$('#returnVisitCount').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	//发药 
        	count=bookData.dispensingCount;
        	if (count*1==0){
        		$('#dispensingCount_out').html(count);
        	}  else {
        		$('#dispensingCount_out').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	// 处方数 
        	count=bookData.prescriptionCount;
        	if (count*1==0){
        		$('#prescriptionCount').html(count);
        	}  else {
        		$('prescriptionCount').html("<a href='javascript:void(0)'>"+count+"</a>");
        	}
        	
        	//高发病  
        	var highIncidence="感冒、发烧、酒精中毒";
        	$('#highIncidence').html(highIncidence);
        }

    });
}

//收费指标内容显示
function costSum(){
	$.ajax({
        type: "GET",
        //url: $WEB_ROOT_PATH + "/js/index/index-test.json"
		url: $WEB_ROOT_PATH+"/indexContent/getFeeTarget.ajax",
		data:{},

        dataType: "json",
        success: function(data){
        	var bookData=data.dto;
        	// 应收金额
        	var sum_money=bookData.receivableMoney;
        	$('#receivableMoney').html(sum_money);
        	//实收金额 
        	sum_money=bookData.paidMoney;
        	$('#paidMoney').html(sum_money);
        	//欠费金额
        	sum_money=bookData.arrearageMoney;
        	$('#arrearageMoney').html(sum_money);
        	//优惠金额 
        	sum_money=bookData.preferentialMoney;
        	$('#preferentialMoney').html(sum_money);
        	//现金支付 
        	sum_money=bookData.cashMoney;
        	$('#cashMoney').html(sum_money);
        	//其他支付
        	otherMoney=bookData.cashMoney;
        	$('#otherMoney').html(sum_money);
        }

    });
}


function pagePlus(curPage,lastPage,req){
	var pageHtml="";
	var prePage=curPage*1-1;
	var nextPage=curPage*1+1;
	
	if (curPage==1){
		pageHtml=pageHtml+"<span >首页&nbsp;</span >";
		pageHtml=pageHtml+"<span >上一页&nbsp;</span >";
	} else {
		pageHtml=pageHtml+"<a href='javascript:void(0)' onclick='gotoPage(1,"+req+")'>首页&nbsp;</a>";
		pageHtml=pageHtml+"<a href='javascript:void(0)' onclick='gotoPage("+prePage+","+req+")'>上一页&nbsp;</a>";
	}
	if (lastPage==0){
		pageHtml=pageHtml+"<span >第 "+curPage+" 页/共  1"+" 页&nbsp;</span>";
	} else {
		pageHtml=pageHtml+"<span >第 "+curPage+" 页/共 "+lastPage+" 页&nbsp;</span>";
	}
	if (curPage==lastPage || lastPage==0){
		pageHtml=pageHtml+"<span >下一页&nbsp;</span >";
		pageHtml=pageHtml+"<span >末页</span >";
	} else {
		pageHtml=pageHtml+"<a href='javascript:void(0)' onclick='gotoPage("+nextPage+","+req+")'>下一页&nbsp;</a>";
		pageHtml=pageHtml+"<a href='javascript:void(0)' onclick='gotoPage("+lastPage+","+req+")'>末页</a>";
	}

	return pageHtml;
}

function gotoPage(pageNo,req){
	//预约列表
	if (req==1){
		$("#curPage2").val(pageNo);
		bookList();
		//患者列表
	} else if (req==2){
		$("#curPage1").val(pageNo);
		patientList();
		//待诊列表
	} else if (req==3){
		$("#curPage2").val(pageNo);
		waitList();
		//已就诊列表
	} else if (req==4){
		$("#curPage2").val(pageNo);
		receiveList();
		//通知
	} else if (req==5){
		$("#curPage3").val(pageNo);
		noticeList();
		//公告
	} else if (req==6){
		$("#curPage3").val(pageNo);
		proclamationList();
	}
}

function OutCalandarDateYM(id1,id2,id3){
	var myDate = new Date();
	var year=parseInt(myDate.getFullYear());    //获取完整的年份(4位,1970-????)
	var month=parseInt(myDate.getMonth())+1;       //获取当前月份(0-11,0代表1月)
	var day=myDate.getDate();        //获取当前日(1-31)
	
	var html_year="";
	html_year='<select id="'+id1+'_year" style="border:none;width:72px;margin-left:-45px;height:28px;border-radius:6px;" onchange="loadAgain('+id3+');">';
	html_year+='<option value="'+(year+1)+'">'+(year+1)+'</option>';
	html_year+='<option value="'+year+'" selected="selected">'+year+'</option>';
	html_year+='<option value="'+(year-1)+'">'+(year-1)+'</option>';
	html_year+='</select>';
	$('#'+id1).empty();//清空resText里面的所有内容
	$("#"+id1).html(html_year);
	
	
	var html_month="";
	html_month+='<select id="'+id2+'_month" style="width:52px;margin-left:-30px;height:28px;border:none;border-radius:6px;"  onchange="loadAgain('+id3+');">';
	var i=1;
	var temp_html;
	for (;i<13;i++){
		if (i==month){
			temp_html='<option value='+AddZero(i)+' selected="selected">'+AddZero(i)+'</option>';
		} else {
			temp_html='<option value='+AddZero(i)+'>'+AddZero(i)+'</option>';
		}
			
		html_month+=temp_html;
	}
	html_month+='</select>';
	$('#'+id2).empty();//清空resText里面的所有内容
	$("#"+id2).html(html_month);
	
	if (id3!=''){
		var cur_year=$("#"+id1+"_year").val();
		var cur_month=parseInt($("#"+id2+"_month").val())+1;
		//某月最后一天
		var last_day=getLastMonthDay(cur_year,cur_month);
		
		OutCalandarDateDay(day,last_day);
	}
}

function OutCalandarDateDay(cur_day,last_day){
	var html_day="";
	var temp_html;
	html_day+='<select id="BookOutCalandarDay_day" style="width:52px;margin-left:-30px;height:28px;border:none;border-radius:6px;" onchange="loadAgain(1);">';
	var i=1;
	for (;i<last_day+1;i++){
		if (i==cur_day){
			temp_html='<option value='+AddZero(i)+' selected="selected">'+AddZero(i)+'</option>';
		} else {
			temp_html='<option value='+AddZero(i)+'>'+AddZero(i)+'</option>';
		}
		html_day+=temp_html;
	}
	html_day+='</select>';
	$('#BookOutCalandarDay').empty();//清空resText里面的所有内容
	$("#BookOutCalandarDay").html(html_day);
}
//获取某月最后一天
function getLastMonthDay(year,month){
	//var date=new Date(year+"/"+month+"/0");
	//var last_day=date.getDate();
	//return last_day;
	
	var dt = new Date(year+"/"+month+"/1");  
    dt.setDate(1);  
    dt.setMonth(dt.getMonth());  
    cdt = new Date(dt.getTime()-1000*60*60*24);  
    return cdt.getDate();
}
//跳转前一天
function changeLastDay(id_y,id_m,id_d){
	var year=$("#"+id_y+"_year").val();
	var month=parseInt($("#"+id_m+"_month").val());
	var day=parseInt($("#"+id_d+"_day").val())-1;
	if (day==0&&month==1){
		$("#"+id_y+"_year").val(AddZero(year*1-1));
		$("#"+id_m+"_month").val("12");
		$("#"+id_d+"_day").val("31");
		OutCalandarDateDay(31,31);
	} else {
		
		if (day==0){
			$("#"+id_m+"_month").val(AddZero(month*1-1));
			$("#"+id_d+"_day").val(getLastMonthDay(year,month));
			OutCalandarDateDay(getLastMonthDay(year,month),getLastMonthDay(year,month));
		} else {
			$("#"+id_d+"_day").val(AddZero(day));
		}
	}
	//重新加载预约列表
	loadAgain(1);
}
//跳转下一天
function changeNextDay(id_y,id_m,id_d){
	var year=$("#"+id_y+"_year").val();
	var month=parseInt($("#"+id_m+"_month").val());
	var day=parseInt($("#"+id_d+"_day").val())+1;
	var last_day=getLastMonthDay(year,month);
	if (day==32&&month==12){
		$("#"+id_y+"_year").val(year*1+1);
		$("#"+id_m+"_month").val("01");
		$("#"+id_d+"_day").val("01");
		OutCalandarDateDay(1,31);
	} else {
		if (day==last_day){
			$("#"+id_m+"_month").val(AddZero(month*1+1));
			OutCalandarDateDay(getLastMonthDay(year,month),getLastMonthDay(year,month));
			$("#"+id_d+"_day").val("01");
		} else {
			$("#"+id_d+"_day").val(AddZero(day));
		}
	}
	//重新加载预约列表
	loadAgain(1);
}

//跳转上一月
function changeLastMonth(id_y,id_m){
	var year=$("#"+id_y+"_year").val();
	var month=parseInt($("#"+id_m+"_month").val());
	
	if (month*1==1){
		$("#"+id_y+"_year").val(AddZero(year*1-1));
		$("#"+id_m+"_month").val("12");
	} else {
		$("#"+id_m+"_month").val(AddZero(month*1-1));
	}
}
//跳转下一月
function changeNextMonth(id_y,id_m){
	var year=$("#"+id_y+"_year").val();
	var month=parseInt($("#"+id_m+"_month").val());
	
	if (month*1==12){
		$("#"+id_y+"_year").val(AddZero(year*1+1));
		$("#"+id_m+"_month").val("01");
	} else {
		$("#"+id_m+"_month").val(AddZero(month*1+1));
	}
}

function AddZero(num){
	if (num<10){
		return "0"+num;
	} else {
		return num;
	}
}

function createTitle(flg){
	var html_title="";
	if (flg==1){
		html_title+='<tr>';
		html_title+='<th width="5%">姓名</th>  ';
		html_title+='<th width="3%">性别</th>';
		html_title+='<th width="7%">出生日期</th> ';
		html_title+='<th width="5%">移动电话</th> ';
		html_title+='<th width="5%">预约日期</th> ';
		html_title+='<th width="5%">预约医师</th> ';
		html_title+='<th width="7%">所属科室</th>';
		html_title+='<th width="7%">症状</th>';
		html_title+='<th width="7%">操作</th>';
		html_title+='</tr>';
	} else if (flg==2){
		html_title+='<tr>';
		html_title+='<th width="7%">姓名</th> ';
		html_title+='<th width="5%">性别</th>';
		html_title+='<th width="5%">年龄</th> ';
		html_title+='<th width="5%">移动电话</th> ';
		html_title+='<th width="10%">预约/登记</th>';
		html_title+='<th width="7%">时间段</th>';
		html_title+='<th width="7%">医师</th>';
		html_title+='<th width="7%">号别</th>';
		html_title+='<th width="7%">操作</th>';
		html_title+='</tr>';
	} else if (flg==3){
		html_title+='<tr>';
		html_title+='<th width="7%">姓名</th> ';
		html_title+='<th width="5%">性别</th>';
		html_title+='<th width="5%">年龄</th> ';
		html_title+='<th width="5%">移动电话</th> ';
		html_title+='<th width="10%">预约/登记</th>';
		html_title+='<th width="7%">时间段</th>';
		html_title+='<th width="7%">医师</th>';
		html_title+='<th width="7%">号别</th>';
		html_title+='<th width="7%">操作</th>';
		html_title+='</tr>';
	}
	$("#list_title").html(html_title);
}

function initPage(flg){
	if (flg==1){
		$("#initPage1").toggleClass("active",true);
		$("#initPage2").toggleClass("active",false);
		$("#initPage3").toggleClass("active",false);
		$("#book_search").css("display","");
		//$("#pageBar").css("display","");
		$("#curPage2").val(1);
		bookList();
	} else if (flg==2){
		$("#initPage2").toggleClass("active",true);
		$("#initPage1").toggleClass("active",false);
		$("#initPage3").toggleClass("active",false);
		$("#book_search").css("display","none");
		//$("#pageBar").css("display","none");
		$("#curPage2").val(1);
		waitList();
	} else if (flg==3){
		$("#initPage3").toggleClass("active",true);
		$("#initPage1").toggleClass("active",false);
		$("#initPage2").toggleClass("active",false);
		$("#book_search").css("display","none");
		//$("#pageBar").css("display","none");
		$("#curPage2").val(1);
		receiveList();
	} else if (flg==4){
		
		//通知
	} else if (flg==6){
		$("#initPage6").toggleClass("active",true);
		$("#initPage5").toggleClass("active",false);
		$("#initPage7").toggleClass("active",false);
		$("#curPage3").val(1);
		noticeList();
		//公告
	} else if (flg==5){
		$("#initPage5").toggleClass("active",true);
		$("#initPage6").toggleClass("active",false);
		$("#initPage7").toggleClass("active",false);
		$("#curPage3").val(1);
		proclamationList();
		//规章制度
	} else if (flg==7){
		$("#initPage7").toggleClass("active",true);
		$("#initPage5").toggleClass("active",false);
		$("#initPage6").toggleClass("active",false);
		$("#curPage3").val(1);
		regulationsList();
	}
	
}
//页面跳转
function gotoMainPage(page,patientId){
	//alert(page);
	var guide1="<ul class='breadcrumb'><li class='active only'>";
	var guide2="<span class='divider'>/</span></li> </ul> ";
	var div_space="<div style='height:10px'></div>";
	var title="";
	var url = "";
	if (page==1){
		title="首页";
		url = "${path}/mainPage/mainPageCtrl!index-content.htm";
		//$("#guide").html(guide1+title+guide2);
		//$("#pageFrame").css({height:980});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!index-content.htm";
	}else if(page==2){
		title="患者管理";
		url = "${path}/mainPage/mainPageCtrl!patCon.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!patCon.htm";
	}else if(page==3){
		title="预约管理";
		url = "${path}/mainPage/mainPageCtrl!personMgr.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!personMgr.htm";
	}else if(page==4){
		title="诊疗管理";
		parent.$("#guide").html(guide1+title+guide2+div_space);
		parent.$("#pageFrame").css({height:500});
		if(parent.treatmentURL!=""&&parent.treatmentURL!=undefined){
			parent.patientFlag="1";
			parent.patientId=patientId;
			//parent.window.frames["pageFrame"].src=parent.treatmentURL;
			url = parent.treatmentURL;
		}else{
			$CommonUI.alert("您可能没有访问权限,请联系管理员!","","提示");
			return;
		}
	}else if(page==5){
		title="收费管理";
		url = "mainPageCtrl!paadmFee.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:440});
		//parent.window.frames["pageFrame"].src="mainPageCtrl!paadmFee.htm";
	}else if(page==6){
		title="字典管理";
		url = "${path}/mainPage/mainPageCtrl!dictionary.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!dictionary.htm";
	}else if(page==7){
		title="打印处方";
		url = "${path}/mainPage/mainPageCtrl!printPrescription.htm";
		//$("#pageFrame").css({height:500});
		//$("#guide").html(guide1+title+guide2+div_space);
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!printPrescription.htm";
	}else if(page==10){
		title="排班管理";
		url = "${path}/mainPage/mainPageCtrl!scheduling.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!scheduling.htm";
	}else if(page==8){
		title="排班报表管理";
		url = "${path}/mainPage/mainPageCtrl!scheduleReports.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!scheduleReports.htm";
	}else if(page==9){
		title="测试批量插入数据";
		url = "${path}/mainPage/mainPageCtrl!batInsertData.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!batInsertData.htm";
	}else if(page==11){
		title="退费管理";
		url = "${path}/mainPage/mainPageCtrl!refundFee.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:450});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!refundFee.htm";
	}else if(page==12){
		title="机构管理";
		url = "${path}/mainPage/mainPageCtrl!agencyManage.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:600});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!agencyManage.htm";
	}else if(page==13){
		title="人员管理";
		url = "${path}/mainPage/mainPageCtrl!empMgr.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:580});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!empMgr.htm";
	}else if(page==14){
		title="数据导入";
		url = "${path}/mainPage/mainPageCtrl!fileupload.htm";
		//$("#guide").html(guide1+title+guide2+div_space);
		//$("#pageFrame").css({height:500});
		//window.frames["pageFrame"].src="${path}/mainPage/mainPageCtrl!fileupload.htm";
	}
	if(url != ""){
		window.parent.changeUrl(url,title);
	}
}
/*
 * 
 * 预约快捷实现参考预约管理功能实现
 * 
 * */
/*调用预约管理功能接口 beign*/

function book2(patientid){
	//必须设置，否则ajax取值有问题。
	$('#patientidL').val(patientid);
	$('#calendarDlg').dialog('open').dialog('setTitle', '预约');
	$('#symptoms').val('');
	var today = formatterDate(new Date());
	
	
	$.ajax({
        type: "get",
        //url: $WEB_ROOT_PATH + "/js/index/index-test.json"
		url: $WEB_ROOT_PATH+"/indexPatientList/indexPatientListCtrl.htm?BLHMI=patlist",
        data: {"dto.patientId":$("#patientidL").val()},

        dataType: "json",
        success: function(data){
               var patdata=data.rows;
               $('#patientNameL').html(patdata[0].patientName);
               $('#patientSexidL').html(patdata[0].patientSexid);
               $('#patientAgeL').html(patdata[0].birthDate);
               $('#patientTelephoneL').html(patdata[0].patientTelephone);
               $('#streetinfoL').html(patdata[0].provinCesid+patdata[0].cityId+patdata[0].cityaeraId+patdata[0].streetInfo);
               $('#icardL').html(patdata[0].icard);
               
        }
	});
	$CommonUI.fullcalendar('#calendar', '', $WEB_ROOT_PATH+"/bookManage/getBookCalendar.ajax?dto.curdate="+today, {}, 'GET',
	  function(calEvent, jsEvent, view) {
				if(calEvent.id == "01"){
					var curdate = formatterDate(new Date(calEvent.start));
					//必须这么赋值，否则ajax取到的值还是上传的值。
					var patientid = $('#patientidL').val();
					$.ajax({
				        type: "post",
						url: $WEB_ROOT_PATH+"/bookManage/checkPatientCanBook.ajax",
						data: {'bookDate': curdate,'patientid':patientid},
				        dataType: "json",
				        success: function(data){
				                var res=data.rows;
				                if(res.length != 0){
				                	$CommonUI.alert("您已经预约了今天的号,不可多次预约!","","提示");
				                }else{
				                	var options = {
				    						toolbar : "",
				    						height: 240,
				    						width: '100%',
				    						singleSelect: true,
				    						pagination: true,
				    						rownumbers:false,
				    						fitColumns:true
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
				    						{title:"医师",field:"empname",width:30},
				    						{title:"所属科室",field:"orgname",width:30},
				    						{title:"计划限额",field:"limitAmount",width:20,hidden:true},
				            				{title:"已使用数量",field:"usedAmount",width:20,hidden:true},
				    						{title:"已预约数",field:"usedresAmount",width:20},
				    						{title:"预约限额",field:"limitResamount",width:20,hidden: true},
				    						{title:"可预约数",field:"limitResamount1",width:20, 
				    							formatter:function(value,row,index){
				    								return parseInt(row.limitResamount)-parseInt(row.usedresAmount);
				    							}},
				    						{title:"操作",field:"action",width:30,
				    							    	 formatter:function(value,row,index){
				    							    		if((parseInt(row.limitResamount)-parseInt(row.usedresAmount)) != 0){
				    							    			var c = '<a href="javascript:void(0)" onclick="clickBook()"><B>点击预约</B></a> ';}
				    							    		else{
				    							    			 var c = '<B>已约满</B> ';
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
				    				
				    					$CommonUI.getDialog("#bookInfo").dialog("move", {"top" : "10"});
				    					$('#bookInfo').dialog('open').dialog('setTitle','预约信息');
				    					$('#bookInfo').dialog('open');
				                }
				        }});
					
						}
				},function(date, jsEvent, view){}); 
}

function clickBook2(){
	var patientid = $('#patientidL').val();
	var symptoms =  $('#symptoms').val();
	var row = $CommonUI.getDataGrid("#doclist").datagrid('getSelected');
	if(row!=null){
		var temp=row.empname;
		if (row.empname=='' ||row.empname==null)
		{
			temp="普通医生";
		}
		$CommonUI.confirm('确定预约'+temp+'的号?', 'question', '', function(){
			//alert(row.uuid);alert(row.empname);
			$.post($WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=saveBookAndUpdatePao",
					{'dto.patientBook.patientid': patientid,
					 'dto.patientBook.paoClinicUuid': row.uuid,
					 'dto.patientBook.symptoms': symptoms,
					 'dto.patientBook.bookDate': row.curdate,
					 'dto.patientBook.empnameDiag': row.empname,
					 'dto.patientBook.sortnum': 1,
					 'dto.patientBook.dateTypeid': row.dateType,
					 'dto.patientBook.dateTypename': 1,
					 'dto.patientBook.bookUsemode': '01',
					 'dto.patientBook.bookStatus': '预约',
					 'dto.patientBook.orgidHosp': '软件园诊所',
					 'dto.patientBook.orgname': row.orgname,
					 'dto.patientBook.orgid': 1,
					 'dto.patientBook.registid': row.registid,	
					 
					 'dto.paoClinic.uuid':row.uuid,
					 'dto.paoClinic.limitAmount':row.limitAmount,
					 'dto.paoClinic.usedAmount':parseInt(row.usedAmount)+1,
					 'dto.paoClinic.limitResamount':row.limitResamount,
					 'dto.paoClinic.usedresAmount':parseInt(row.usedresAmount)+1,
					 'dto.paoClinic.curdate':row.curdate,
					 'dto.paoClinic.dateTypeid':row.dateType,
					 'dto.paoClinic.orgid':1,
					 'dto.paoClinic.orgidHosp':1,
					 'dto.paoClinic.registid':row.registid
					}, function(){
				$CommonUI.alert("预约成功!","","提示");
				$("#dg1").datagrid('reload');		
				$("#bookInfo").dialog('close');
			});
		});
	}
}


function book(patientid,patientName,patientSexid,age,icard,patientTelephone,provinCesid,cityid,cityaeraid,streetinfo){
	//alert(streetinfo);
	if(icard == null || icard == 'null'){
		icard = '';
	}
	$('#calendarDlg').dialog('open').dialog('setTitle', '预约');
	$('#symptoms').val('');
	$('#patientidL').val(patientid);
	$('#patientNameL').text(patientName);
	if(patientSexid != 'undefined'){
		$('#patientSexidL').text(patientSexid);
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
						data: {'bookDate': curdate,'patientid':patientid},
				        dataType: "json",
				        success: function(data){
				                var res=data.rows;
				                if(data != 0){
				                	$CommonUI.autoCloseCenterMessage("您已经预约了今天的号,不可多次预约！","info","",1000);
				                }else{
				                	
				                	$('#bookInfo').dialog('open').dialog('setTitle','预约信息');
			    					$('#bookInfo').dialog('open');
				                	var options = {
				    						toolbar : "",
				    						height: 190,
				    						//width: '100%',
				    						width: 660,
				    						singleSelect: true,
				    						pagination: true,
				    						rownumbers:false,
				    						fitColumns:false,
				    						//pagePosition:'bottom',
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
				    					    {title:"uuid",field:"uuid",width:20,hidden:true},
				    					    {title:"号别编码",field:"registid",hidden:true},
				    						{title:"日期",field:"curdate",width:80,align : 'center'},						
				    						{title:"时间",field:"dateTypeid",width:80,align : 'center'},
				    						{title:"时间转id",field:"dateType",hidden:true,
				    							formatter:function(value,row,index){
				    								if(row.dateTypeid=='上午'){
				    									row.dateType = '01';
				    								}else{
				    									row.dateType = '02';
				    								} 
				    								return row.dateType;
				    							}},
				    						{title:"号别",field:"registTypeid",width:80,align : 'center'},
				    						{title:"医师id",field:"empid",hidden: true},
				    						{title:"医师",field:"empname",width:80,align : 'center',
				    							formatter:function(value,row,index){
				    								if(row.empid == ''){
				    									return '普通医师';
				    								}else 
				    									return row.empname;
				    								}
			    							},
				    						{title:"所属科室",field:"orgname",width:80,align : 'center'},
				    						{title:"计划限额",field:"limitAmount",hidden:true},
				            				{title:"已使用数量",field:"usedAmount",hidden:true},
				    						{title:"已预约数",field:"usedresAmount",width:60,align : 'center'},
				    						{title:"预约限额",field:"limitResamount",hidden: true},
				    						{title:"可预约数",field:"limitResamount1",width:60,align : 'center', 
				    							formatter:function(value,row,index){
				    								return parseInt(row.limitResamount)-parseInt(row.usedresAmount);
				    							}},
			    							/*{title:"预约方式",field:"bookUsemode",width:30,editor:{type:'combobox',options:{valueField:'id',textField:'text',panelHeight:70,data:[{id:'03',text:'现场'},{id:'02',text:'网络'},{id:'01',text:'电话'}]}}},*/
				    						{title:"操作",field:"action",width:80,align : 'center',
				    							    	 formatter:function(value,row,index){
				    							    		var c = '';
				    							    		if((parseInt(row.limitResamount)-parseInt(row.usedresAmount)) != 0){
				    							    			 c = '<a href="javaScript:void(0)" onclick="clickBook(\''+row.empid+'\',\''+row.empname+'\',\''+row.orgid+'\',\''+row.orgname+'\',\''+row.uuid+'\',\''+row.curdate+'\',\''+row.dateType+'\',\''+row.registid+'\')"><B>点击预约</B></a> ';}
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
		postReq($WEB_ROOT_PATH+"/bookManage/bookManageCtrl.htm?BLHMI=cancleBookAndUpdatePao",'',
				function(msg){	
			 		if(msg["dto"].result == '0'){
			 			$CommonUI.alert("<span style='color: red'> "+patientName+" </span>已被接诊，不能取消预约！");
			 			$CommonUI.getDataGrid("#bookedInfo").datagrid('reload');
			 		}else {
			 			$CommonUI.getDataGrid("#bookedInfo").datagrid('reload');
			 			$CommonUI.autoCloseCenterMessage("取消成功！","info","",1000);
					}
				},
				function(){			
					$CommonUI.autoCloseCenterMessage("取消失败！","info","",1000);
				},{skipHidden : false},{'dto.patientBook.bookid': bookid,
					'dto.paoClinic.uuid':paoClinicUuid
				  });
	});
}

formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

/*调用预约管理功能接口end*/


/*调用患者管理新增功能接口 beign*/
function createPatientTop(){
	document.getElementById('family').style.display='none';
	document.getElementById('contact').style.display='none';
	$CommonUI.getForm('#createForm').form('clear');
	$('#dlg').dialog('open').dialog('setTitle', '新增患者信息');
	$("#dlg").dialog('open');
	//$('#patientIdentityid').combobox('setValue','01');
	$CommonUI.getComboBox('#patientIdentityid').combobox({ 
	    url: $WEB_ROOT_PATH + '/patientManage/getDefaultValueWhenCreatePatient.ajax',
	    valueField:'patientIdentityid',  
	    textField:'patientIdentityname'  
	}); 
}
function closePatDlg(){
	//$('#patdlg').dialog('close');
	$('#dlg').dialog('close');
}
function reloadPatIndexDg(){
	//$("#patIndexDg").datagrid('reload');
	patientList();
}
/*调用患者管理新增功能接口 end*/

//关闭我的日程弹窗口
function closeMyScheduleDlg(){
	$('#myScheduleDlg').dialog('close');
}
//保存我的提醒
function saveMySchedule(){
	var schFlag = $('#schFlag').val();
	var title = $("#title").val(); 
	if(title =="" || title == null){
		$CommonUI.alert("请输入标题！");
		return;
	} 
	postReq($WEB_ROOT_PATH+ '/schedule/saveScheduleInfo.ajax?BLHMI='+schFlag+'', 'createScheduleForm',succAddSch, err, {skipHidden : false});

}
//回调函数
function succAddSch(d) {
	var schFlag = $('#schFlag').val();
	 
	if(schFlag=="save"){
		tsInfo = "新增日程信息";
	}else if(schFlag=="update"){
		tsInfo = "修改日程信息";
	}else{
		tsInfo = "删除日程信息";
	}
	if(d!=null&&d!=""){
		if(d.reslut=="success"){
			$CommonUI.alert(tsInfo+"成功！");			
		}else{
			$CommonUI.alert(tsInfo+"失败!");
		}
	} 
	var start = $("#startTime").val();
	var end = $("#endTime").val();
	showEventsToCalendar(start,end);
	closeMyScheduleDlg();
}






