var year = 2014;
var month=7;
var type = "";
var opt="";
function  changeDate(t,o) {
	type = t;
	opt=o;
	var year = $("#year").html();
	var month = $("#month").html();
	if(type=="year") {
		if(opt=="add") {
			year = year*1 +1;
		} else {
			year = year*1 -1;			
		}
	} 
	if(type=="month") {
		if(opt=="add") {
			month = month*1+1;
			if(month==13) {
				month=1;
				year=year*1+1;
			}
		} else {
		    month=month*1-1;
			if(month==0) {
				month=12;
				year=year*1-1;
			}
		}
	}
	$("#year").html(year);
	$("#month").html(month);
	return year+"-"+month;
}


function  changeDateGetYear(o) {
	opt=o;
	var year = $("#year").html();
		if(opt=="add") {
			year = year*1 +1;
		} else {
			year = year*1 -1;			
		}
	
	$("#year").html(year);
	return year;
}
