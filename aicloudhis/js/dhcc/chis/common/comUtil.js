/*
 * 通过身份证查询人员出生日期
 * */
function getPersonBirthDateByIdcard(UUserCard){
	var birthDate="";
	if (UUserCard.length==18){
		//获取出生日期
		birthDate=UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
	} 
	return birthDate;
}

/*
 * 通过身份证查询人员性别
 * */
function getPersonSexByIdcard(UUserCard){
	var sex="";
	if (UUserCard.length==18){
		//获取性别
		if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
			sex="男";
		} else {
			sex="女";
		}
	}
	return sex;
}

/*
 * 通过出生日期查询人员年龄
 * */
function getPersonAgeByBirthDate(strBirthDate){
	//获取年龄
	var myDate = new Date();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	
	var birthDate=new Date(strBirthDate);
	birthDate=formatDate(birthDate);
	var age = myDate.getFullYear() - birthDate.substring(0, 4) - 1;
	if (birthDate.substring(5,7) < month) {
		age++;
	}else if(birthDate.substring(5,7) == month && birthDate.substring(8,10) <= day){
		age++;
	}
	return age;
}

/*
 * 格式化日期格式为yyyy-mm-dd
 * */
function formatDate(date){
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
};

/*
 * 将选中的数据赋值到修改表单数据中
 * listData 必须是JSON格式
 * generalPrefix 表单中的一般前缀
 * specialMap 特殊对应
 * */
function fillListDataToUpdateForm(listData, generalPrefix, specialMap) {
	for(var dataKey in listData) {
		if(specialMap.hasOwnProperty(dataKey)) {
			listData[specialMap[dataKey]] = listData[dataKey];
			//document.getElementsByName(specialMap[dataKey]).value = listData[specialMap[dataKey]];
		} else {
			listData[generalPrefix+dataKey] = listData[dataKey];
			//document.getElementsByName(generalPrefix+dataKey).value = listData[generalPrefix+dataKey];
		}
	}
	return listData;
};

/**
 * 获取当前屏幕高度下，iframe可用高度。
 */
function getIframeHeight(){
	var h = 0;
	if ($.browser.msie){
		h = $(window.top).height() - 145;
	}else{
		h = $(window.top).height() - 140;
	}
	return h > 500 ? h : 500;
}

$(function($){
	rewriteJqAjax();
	rewriteJqGetJSON();
	rewriteJqPost();
});
function rewriteJqAjax(){
	// 备份$.ajax    
    var _ajax = $.ajax;
    // 重写$.ajax
    $.ajax = function(opt,n){
        var _success = opt && opt.success || function(a, b, c){};
        var _complete = opt && opt.complete || function(a, b){};
        var _opt = $.extend(opt, {
        	successParamData:null,
        	successParamTextStatus:null,
        	successParamJqXHR:null,
        	success:function(data, textStatus, jqXHR){
        		this.successParamData = data;
        		this.successParamTextStatus = textStatus;
        		this.successParamJqXHR = jqXHR;
        	},
        	complete:function(data, textStatus){
            	var sessionStatus = data.getResponseHeader('sessionstatus');
                // sessioin超时 
            	if(sessionStatus == 'timeout') {  
            		window.top.location.href=$WEB_ROOT_PATH; 
                    return;  
                } 
	            if(textStatus == "success"){
	            	_success(this.successParamData, this.successParamTextStatus,this.successParamJqXHR);
	            	_complete(data, textStatus);
        		}
            }    
        });
        return _ajax(_opt,n);
    };
}
function rewriteJqGetJSON(){
	$.getJSON = function(url,data,callback){
		if(typeof(data) == "function"){
			callback = data;
		}
		$.ajax({
			 type: "post",
				url: url,
				data:data,
				dataType: "json",
		        success: function(data){
		        	callback(data);
		        }
		});
	}
}
function rewriteJqPost(){
	$.post = function(url,data,callback,type){
		if(typeof(data) == "function"){
			callback = data;
			type = callback;
		}
		$.ajax({
			 type: "post",
				url: url,
				data:data,
				dataType: type,
		        success: function(data){
		        	callback(data);
		        }
		});
	}
}
function rewriteJqGet(){
	$.get = function(url,data,callback,type){
		if(typeof(data) == "function"){
			callback = data;
			type = callback;
		}
		$.ajax({
			 type: "get",
				url: url,
				data:data,
				dataType: type,
		        success: function(data){
		        	callback(data);
		        }
		});
	}
}
