$(function(){
	tableweek("");//表头初始化
	//科室下拉框
	var orgidHosp=$('#orgidHosp').val();
	$CommonUI.getComboBox('#orgid').combobox({  
	    //url: $WEB_ROOT_PATH + '/agencyManage/agencyManageCtrl.htm?BLHMI=OrgList&dto.Org.orgid='+orgidHosp,  
	    valueField:'orgid',  
	    textField:'orgname'  
	}); 
	/*$('#orgid').combobox('setValue',"");
	$('#orgid').combobox('setText',"  ");*/

});

//获取时间的变量
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getFullYear(); //当前年

//查询数据
function searchSchedulereports() {
	var orgid= $CommonUI.getComboBox('#orgid').combobox('getValue');
	$.ajax({
     type: "GET",
		//url: $WEB_ROOT_PATH+'/schedulereports/schedulereportsCtrl.htm?BLHMI=findPaoClinic',
		data:{"dto.scheduleReportsVo.orgid":orgid,
				"dto.startDate":weekdateLoop(1),//对应周一的日期
				"dto.endDate":weekdateLoop(7)//对应周末的日期
			  },

     dataType: "json",
     success: function(data){
    	 var html = '';
         var datas=data.rows;
         var temp_data="";
         for(var i=0;i<datas.length;i++){
        	 temp_data = datas[i]; 
        	 html+='<tr>';
        	 html+='<td width="43"align="center">'+temp_data.orgname+'</td>';
        	 html+='<td width="50"align="center">'+temp_data.registTypeid+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.mondayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.mondayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.tuesdayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.tuesdayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.wednesdayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.wednesdayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.thursdayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.thursdayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.fridayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.fridayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.saturdayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.saturdayAfternoon+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.sundayMorning+'</td>';
        	 html+='<td width="43"align="center">'+temp_data.sundayAfternoon+'</td>';
        	 html+='</tr>';
         }
         $("#html").empty();
         tableweek(html);
     }
 });
}
//表头
function tableweek(temp_html){
	var html = '';
	html=html+'<tr><td rowspan="3"align="center">科室</td>'
	  +' <td rowspan="3"align="center">号别 </td>';
	  for (var z=1;z<8;z++){//指定周的日期
		  html+=' <td colspan="2"align="center">'+weekdateLoop(z)+'</td>';
	  }
	  html+='</tr>';
	  
	  html+='<tr><td colspan="2"align="center">星期一</td>'
		  +'<td colspan="2"align="center">星期二</td>'
		  +'<td colspan="2"align="center">星期三</td>'
		  +'<td colspan="2"align="center">星期四</td>'
		  +'<td colspan="2"align="center">星期五</td>'
		  +'<td colspan="2"align="center">星期六</td>'
		  +'<td colspan="2"align="center">星期日</td>';
	  html+='</tr>';
	  html+='<tr>';
	  for (var day=0;day<7;day++){
		  html+='<td align="center">上午</td>';
		  html+='<td align="center">下午</td>';
	  }
	  html+='</tr>';
	  html+=temp_html;
	  $('#html').html(html);
};

//获得本周的开端日期
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
    return formatterDate(weekStartDate);
}
//获得本周的停止日期
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    return formatterDate(weekEndDate);
}
//日期格式
function formatterDate(date){
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

function weekdateLoop(z){//循环指定日期所在周
	var date=$CommonUI.getDateBox('#selectDate').datebox('getValue');
	if(date==""){
		date=new Date();
	}
	var select_date = new Date(date); //点击的日期
    var select_DayOfWeek = select_date.getDay(); //指定日期是所在周的第几天
    
    if(select_DayOfWeek==0){
    	select_DayOfWeek=7;
    }
    var select_Day = select_date.getDate(); //指定日期日
    var select_Month = select_date.getMonth(); //指定日期月
    var select_Year = select_date.getFullYear(); //指定日期年
    var weekEndDate = new Date(select_Year, select_Month, select_Day + (z - select_DayOfWeek));    
    return formatterDate(weekEndDate);
}
