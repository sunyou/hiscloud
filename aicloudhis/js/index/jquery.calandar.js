(function($) {
	$.fn.loadCalandar = function(options) {
		defaults = {
			color:"blue",
			dhcc_float:"right",
			showMonth:true,
			showYear:true
		};
		var options = $.extend(defaults, options);	
		var id=$(this).attr("id");
		var str="";
		str+='<div style="height:30px">';
		if(options.showYear){
			str+='<div style="position:relative;margin:0 5px 0 0;display: inline;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">';
			str+='<span style="margin-left:45px;width:18px;overflow:hidden;border-radius:6px;">';
			str+='<select onselect="changeMonth('+id+'\',\''+options+'\');" id="'+id+'_year" style="border:none;width:63px;margin-left:-45px;height:28px;border-radius:6px;">';
			str+='<option value="'+(parseInt(options.year))+'">'+(parseInt(options.year))+'</option>';
			str+='<option value="'+(parseInt(options.year)-1)+'">'+(parseInt(options.year-1))+'</option>';
			str+='<option value="'+(parseInt(options.year)-2)+'">'+(parseInt(options.year)-2)+'</option>';
			str+='</select></span><input name="box" id="'+id+'_year_text" value="'+options.year+'" style="width:45px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
		}			
		if(options.showMonth){
			str+='<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">';
			str+='<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;">';
			str+='<select id="'+id+'_month" style="width:48px;margin-left:-30px;height:28px;border:none;border-radius:6px;" >';
			str+='<option value="01">01</option>';  
			str+='<option value="02">02</option>';  
			str+='<option value="03">03</option>';  
			str+='<option value="04">04</option>';  
			str+='<option value="05">05</option>';  
			str+='<option value="06">06</option>';  
			str+='<option value="07">07</option>';  
			str+='<option value="08">08</option>';  
			str+='<option value="09">09</option>'; 
			str+='<option value="10">10</option>';  
			str+='<option value="11">11</option>';  
			str+='<option value="12">12</option>';
			if(parseInt(options.month)>9){
				str+='</select></span><input name="box" id="'+id+'_month_text" value="'+options.month+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}else{
				str+='</select></span><input name="box" id="'+id+'_month_text" value="0'+options.month+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}
			str+='<div id="'+id+'_month_last" class="calander_left"></div><div id="'+id+'_month_next" class="calander_right"></div>';
		}
		str+="</div>";
		$("#" + id).html(str);
		
		$("#"+id+"_month").live("change",function(){changeDate(this,id,options);});
		$("#"+id+"_year").live("change",function(){changeDate(this,id,options);});
		$("#"+id+"_year_text").live("change",function(){changeDate(null,id,options);});
		$("#"+id+"_month_text").live("change",function(){changeDate(null,id,options);});
		$("#"+id+"_month_last").live("click",function(){changeMonth('last',id,options);});
		$("#"+id+"_month_next").live("click",function(){changeMonth('next',id,options);});


		
		/*changeYear=function(obj,id,options){
			obj.parentNode.nextSibling.value=obj.value;
			options.eventFunc($("#"+id+"_year_text").val()-$("#"+id+"_month_text").val());
		};*/
		changeMonth=function(name,id,options){
			var currentYear = $("#"+id+"_year_text").val();
			var currentMonth=$("#"+id+"_month_text").val();
			var changeMonth;
			if (name == "last") {
				if(currentMonth=="01"){
					$("#"+id+"_year_text").val((parseInt(currentYear)-1));
					$("#"+id+"_month_text").val("12");
				}else{
					changeMonth=(parseInt(currentMonth)-1);
					if(changeMonth<10){
						$("#"+id+"_month_text").val("0"+changeMonth);
					}else{
						$("#"+id+"_month_text").val(changeMonth);
					}					
				}	
			}else if(name=="next"){
				if(currentMonth=="12"){
					$("#"+id+"_year_text").val((parseInt(currentYear)+1));
					$("#"+id+"_month_text").val("01");
				}else{
					changeMonth=(parseInt(currentMonth)+1);
					if(changeMonth<10){
						$("#"+id+"_month_text").val("0"+changeMonth);
					}else{
						$("#"+id+"_month_text").val(changeMonth);
					}					
				}	
			}
			options.eventFunc($("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val());
		}
		
		changeDate=function(obj,id,options){
			if(obj !=  null){
			obj.parentNode.nextSibling.value=obj.value;
			}		
			options.eventFunc($("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val());
		};
		
		
		this.getValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			if($("#"+id+"_year_text") != null && $("#"+id+"_month_text")!=null){
				return $("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val();
			}else if($("#"+id+"_year_text") != null && $("#"+id+"_month_text")==null){
				return $("#"+id+"_year_text").val();
			}else if($("#"+id+"_year_text") == null && $("#"+id+"_month_text")!=null){
				return $("#"+id+"_month_text").val();
			}else{
				return "";
			}			
		};
		this.getYearValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			return $("#"+id+"_year_text").val();				
		};
		
		this.getMonthValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			return $("#"+id+"_month_text").val();			
		};
		
		return this;
	};
	
	
	
	
	/*
		add by aitixiang 20140923
		
	*/
		$.fn.loadCalandarDay = function(options) {
		defaults = {
			color:"blue",
			dhcc_float:"right",
			showMonth:true,
			showYear:true
		};
		var options = $.extend(defaults, options);
		var id=$(this).attr("id");
		var str="";
		str+='<div style="height:30px">';
		if(options.showYear){
			str+='<div style="position:relative;margin:0 5px 0 0;display: inline;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">';
			str+='<span style="margin-left:45px;width:18px;overflow:hidden;border-radius:6px;">';
			str+='<select onselect="changeMonth('+id+'\',\''+options+'\');" id="'+id+'_year" style="border:none;width:63px;margin-left:-45px;height:28px;border-radius:6px;">';
			str+='<option value="'+(parseInt(options.year))+'">'+(parseInt(options.year))+'</option>';
			str+='<option value="'+(parseInt(options.year)-1)+'">'+(parseInt(options.year-1))+'</option>';
			str+='<option value="'+(parseInt(options.year)-2)+'">'+(parseInt(options.year)-2)+'</option>';
			str+='</select></span><input name="box" id="'+id+'_year_text" value="'+options.year+'" style="width:45px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
		}			
		if(options.showMonth){
			str+='<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">';
			str+='<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;">';
			str+='<select id="'+id+'_month" style="width:48px;margin-left:-30px;height:28px;border:none;border-radius:6px;" >';
			str+='<option value="01">01</option>';  
			str+='<option value="02">02</option>';  
			str+='<option value="03">03</option>';  
			str+='<option value="04">04</option>';  
			str+='<option value="05">05</option>';  
			str+='<option value="06">06</option>';  
			str+='<option value="07">07</option>';  
			str+='<option value="08">08</option>';  
			str+='<option value="09">09</option>'; 
			str+='<option value="10">10</option>';  
			str+='<option value="11">11</option>';  
			str+='<option value="12">12</option>';
			if(parseInt(options.month)>9){
				str+='</select></span><input name="box" id="'+id+'_month_text" value="'+options.month+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}else{
				str+='</select></span><input name="box" id="'+id+'_month_text" value="0'+options.month+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}
		//	str+='<div id="'+id+'_month_last" class="calander_left"></div><div id="'+id+'_month_next" class="calander_right"></div>';
		}
		
	//	if(options.showDay){
			str+='<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">';
			str+='<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;">';
			str+='<select id="'+id+'_day" style="width:48px;margin-left:-30px;height:28px;border:none;border-radius:6px;" >';
			str+='<option value="01">01</option>';  
			str+='<option value="02">02</option>';  
			str+='<option value="03">03</option>';  
			str+='<option value="04">04</option>';  
			str+='<option value="05">05</option>';  
			str+='<option value="06">06</option>';  
			str+='<option value="07">07</option>';  
			str+='<option value="08">08</option>';  
			str+='<option value="09">09</option>'; 
			str+='<option value="10">10</option>';  
			str+='<option value="11">11</option>';  
			str+='<option value="12">12</option>';
			if(parseInt(options.day)>9){
				str+='</select></span><input name="box" id="'+id+'_day_text" value="'+options.day+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}else{
				str+='</select></span><input name="box" id="'+id+'_day_text" value="0'+options.day+'" style="width:30px;position:absolute;left:0px;;height:28px;border:none;padding:0 0 0 4px;border-radius:6px;"></div>';
			}
			str+='<div id="'+id+'_month_last" class="calander_left"></div><div id="'+id+'_month_next" class="calander_right"></div>';
//	}
		
		str+="</div>";
		$("#" + id).html(str);
		
		$("#"+id+"_month").live("change",function(){changeDate(this,id,options);});
		$("#"+id+"_year").live("change",function(){changeDate(this,id,options);});
		$("#"+id+"_year_text").live("change",function(){changeDate(null,id,options);});
		$("#"+id+"_month_text").live("change",function(){changeDate(null,id,options);});
		$("#"+id+"_month_last").live("click",function(){changeMonth('last',id,options);});
		$("#"+id+"_month_next").live("click",function(){changeMonth('next',id,options);});


		
		/*changeYear=function(obj,id,options){
			obj.parentNode.nextSibling.value=obj.value;
			options.eventFunc($("#"+id+"_year_text").val()-$("#"+id+"_month_text").val());
		};*/
		changeMonth=function(name,id,options){
			var currentYear = $("#"+id+"_year_text").val();
			var currentMonth=$("#"+id+"_month_text").val();
			var changeMonth;
			if (name == "last") {
				if(currentMonth=="01"){
					$("#"+id+"_year_text").val((parseInt(currentYear)-1));
					$("#"+id+"_month_text").val("12");
				}else{
					changeMonth=(parseInt(currentMonth)-1);
					if(changeMonth<10){
						$("#"+id+"_month_text").val("0"+changeMonth);
					}else{
						$("#"+id+"_month_text").val(changeMonth);
					}					
				}	
			}else if(name=="next"){
				if(currentMonth=="12"){
					$("#"+id+"_year_text").val((parseInt(currentYear)+1));
					$("#"+id+"_month_text").val("01");
				}else{
					changeMonth=(parseInt(currentMonth)+1);
					if(changeMonth<10){
						$("#"+id+"_month_text").val("0"+changeMonth);
					}else{
						$("#"+id+"_month_text").val(changeMonth);
					}					
				}	
			}
			options.eventFunc($("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val());
		}
		
		changeDate=function(obj,id,options){
			if(obj !=  null){
			obj.parentNode.nextSibling.value=obj.value;
			}		
			options.eventFunc($("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val());
		};
		
		
		this.getValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			if($("#"+id+"_year_text") != null && $("#"+id+"_month_text")!=null){
				return $("#"+id+"_year_text").val()+'-'+$("#"+id+"_month_text").val();
			}else if($("#"+id+"_year_text") != null && $("#"+id+"_month_text")==null){
				return $("#"+id+"_year_text").val();
			}else if($("#"+id+"_year_text") == null && $("#"+id+"_month_text")!=null){
				return $("#"+id+"_month_text").val();
			}else{
				return "";
			}			
		};
		this.getYearValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			return $("#"+id+"_year_text").val();				
		};
		
		this.getMonthValue = function () {
			//var currentYear = $("#"+id+"_year_text").val();
			//var currentMonth=$("#"+id+"_month_text").val();
			return $("#"+id+"_month_text").val();			
		};
		
		return this;
	};
	/*$.fn.loadCalandar = function(options) {
		defaults = {
			color:"blue",
			dhcc_float:"right",
			showMonth:true,
			showYear:true
		};
		var options = $.extend(defaults, options);	
		var id=$(this).attr("id");
		var str="";
		if(options.showYear){
			str += "<div style=float:"+options.dhcc_float+"><span id="+id+"_year_last style='cursor:pointer;color:"+options.color+";padding-right:5px'>&lt;&lt;</span>";
			str += "<span id="+id+"_year>" + options.year + "</span>";
			str += "<span style='cursor:pointer;color:"+options.color+";padding-left:5px' id="+id+"_year_next>&gt;&gt;</span>";
		}			
		if(options.showMonth){
			str += "<span style='cursor:pointer;color:"+options.color+";padding-left:10px;padding-right:5px' id="+id+"_month_last>&lt;&lt; </span>";
			str += "<span style='cursor:pointer;padding-right:5px' name="+id+"_month >" + (parseInt(options.month)-2) + "</span>";
			str += "<span style='cursor:pointer;padding-right:5px' name="+id+"_month >" + (parseInt(options.month)-1) + "</span>";
			str += "<span select=\"true\" style='cursor:pointer;padding-right:5px;color:"+options.color+"' name="+id+"_month>" + parseInt(options.month) + "</span>";
			str += "<span style='cursor:pointer;padding-right:5px' name="+id+"_month >" + (parseInt(options.month)+1) + "</span>";
			str += "<span style=\"cursor:pointer;\" name="+id+"_month >" + (parseInt(options.month)+2) + "</span>";
			str += "<span id="+id+"_month_next style='cursor:pointer;color:"+options.color+";padding-left:5px' id="+id+"_month_next> &gt;&gt;</span></div>";
		}
		
		$("#" + id).html(str);
		
		$("#"+id+"_year_last").live("click",function(){changeYear('last',id,options);});
		$("#"+id+"_year_next").live("click",function(){changeYear('next',id,options);});

		$("#"+id+"_month_last").live("click",function(){changeMonth('last',id,options);});
		$("#"+id+"_month_next").live("click",function(){changeMonth('next',id,options);});

		var months = $("span[name="+id+"_month]");
		$.each(months,function(i,e){					
			$(e).live("click",function(){
				selectMonth(e,id,options);
			});
		});
		
		changeYear=function(name,id,options){
			var date="";
			var year = $("#" + id + "_year").html();
			if (name == "last") {
				$("#" + id + "_year").html(year - 1);
			} else if (name == "next") {
				$("#" + id + "_year").html(parseInt(year) + 1);
			}
			
			date=$("#" + id + "_year").html();
			if(options.showMonth){
				var month="";
				var months = $("span[name="+id+"_month]");	
				$.each(months,function(i,e){
					if($(e).attr("select")=="true"){
						month=$(e).html();
					}
				});
				date+="-";
				date+=month;
			}
			
			options.eventFunc(date);
		};
		
		changeMonth=function(name,id,options){
			var year="";
			if(options.showYear){
				year = $("#" + id + "_year").html();
			}
			
			var months = $("span[name="+id+"_month]");
			var month="";
			var startMonth=parseInt($(months[0]).html());
			if (name == "last") {
				for(var i=0;i<months.length;i++){
					if(startMonth >=2){
						$(months[i]).html($(months[i]).html()-1);							
					}
					if($(months[i]).attr("select")=="true"){
						month=$(months[i]).html();
					}
				}
			} else if (name == "next") {
				for(var i=0;i<months.length;i++){
					if(startMonth+5 <= 12){
						$(months[i]).html(parseInt($(months[i]).html())+1);							
					}	
					if($(months[i]).attr("select")=="true"){
						month=$(months[i]).html();
					}
				}
			}
			
			if(options.showYear){
				options.eventFunc(year+"-"+month);
			}else{
				options.eventFunc(month);
			}				
		};
		
		selectMonth=function(obj,id,options){
			var year="";
			if(options.showYear){
				year = $("#" + id + "_year").html();
			}
			
			var months = $("span[name="+id+"_month]");
			$.each(months,function(i,e){					
				$(e).css("color","#555");
				$(e).attr("select","false");
			});
			$(obj).css("color",options.color);
			$(obj).attr("select","true");
			
			if(options.showYear){
				options.eventFunc(year+"-"+$(obj).html());
			}else{
				options.eventFunc(month);
			}		
		};
		this.getValue = function () {
			var id=$(this).attr("id");
			//if(options.showYear && options.showMonth){
			var year="";
			var years = $("#" + id + "_year");
			if(years !=null){
				year = years.html();
			}
			
			var month="";
			var months = $("span[name="+id+"_month]");
			if(months != null && months.length>0){
			$.each(months,function(i,e){
				if($(e).attr("select")=="true"){
					month=$(e).html();
				}
			});
				}
			
			if(year !="" && month !=""){
				return year+"-"+month;
			}else if(year !="" && month==""){
				return year;
			}else if(year =="" && month !=""){
				return month;
			}else{
				return "";
			}
			
			
			
		};
		
		return this;
	};*/
	
})(jQuery);
