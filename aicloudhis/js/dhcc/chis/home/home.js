var aicloudhis = {};
;$(function(){
	aicloudhis.index = function(){
		this.initPage();
	};
	
	aicloudhis.index.prototype = {
		constructor:aicloudhis.index,
		left:0,
		top:0,
		initPage:function(){
			var parent = this;
			$("#schedual").mouseover(function(e){ 
				var that = this;
				$('div.floatWindow').hide();//避免图层遮盖
				that.left = e.pageX+10;
				that.top = e.pageY+10;
				$("#schedualDiv").removeClass("hidden").css({position:'fixed',top:that.top,left:that.left}).show();
				
			});
			$("#notice").mouseover(function(e){ 
				var that = this;
				$('div.floatWindow').hide();//避免图层遮盖
				that.left = e.pageX+10;
				that.top = e.pageY+10;
				$("#noticeDiv").removeClass("hidden").css({position:'fixed',top:that.top,left:that.left}).show();
				
			});
			$("#message").mouseover(function(){
				$('div.floatWindow').hide();
			});
			$("#system").mouseover(function(){
				$('div.floatWindow').hide();
			});
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
						/*showNewEventWindow($.fullCalendar.moment(start).format('YYYY-MM-DD'),
								$.fullCalendar.moment(end).format('YYYY-MM-DD'),allDay);*/
					}else{
						/*showNewEventWindow($.fullCalendar.moment(start).format('YYYY-MM-DD HH:mm'),
								$.fullCalendar.moment(end).format('YYYY-MM-DD HH:mm'),allDay);*/
					}
				
					//取消选中
					$('my_calendar').fullCalendar('unselect');
					
				},
				//点击存在的事件的时候调用的方法
				eventClick:function(calEvent,jsEvent,view) {
				   
				},
				//每次日历加载时进行viewDisplay这个方法也被换掉了，用viewRender来代替了----1
				viewRender : function(view){
				   //和1.x的版本不同了，换了相应的方法了，坑爹啊这是！！！！
					$("#startTime").val($.fullCalendar.moment(view.start).format('YYYY-MM-DD HH:mm'));
					$("#endTime").val($.fullCalendar.moment(view.end).format('YYYY-MM-DD HH:mm'));
					parent.showEventsToCalendar($.fullCalendar.moment(view.start).format('YYYY-MM-DD HH:mm'),
							 	$.fullCalendar.moment(view.end).format('YYYY-MM-DD HH:mm'));
				}
			});
		},
		showEventsToCalendar:function(start, end){
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
	};
	
	new aicloudhis.index();
});