//页面初始化
$(function(){
		var options = {toolbar : "#tb",height : 460,width : '100%',singleSelect : false,pagination : true,
				rownumbers : true,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 15};
		var columns = [ [
		                {field : 'id', title : "messageid",width:40,hidden:true},
		                {field : "patientName",title : "患者姓名",width:60,align : 'center'},
		                {field : "sendTime",title : "发送时间",width:60,align : 'center'},
		                {field : "msgInfo",title : "发送内容",width:280,align : 'center'},
		                {field : "status",title : "发送状态",width:50,align : 'center'}
		     	        //{field : "name4",title : "手机",width:140,align : 'center'},
		     	        //{field : "name5",title : "科室",width:140,align : 'center'},
		     	        //{field : "name6",title : "职称",width:140,align : 'center'}		     	       
		  		] ];
		var queryParams = {page : 1,rows : 15};
		var url = $WEB_ROOT_PATH+"/patientMessage/getMessageList.ajax";
		$CommonUI.datagrid('#message', url, queryParams, columns, pageOpts, sortOpts,options);
		//$("#messageInfo").text(1111);
		//document.getElementById("test").value = "1000";//
		$CommonUI.getComboBox('#patientNameT').combobox({
			onChange: function(){
				$CommonUI.getComboBox('#patientNameT').combobox('panel').panel('panel').css('z-index','99999999');
				setTimeout("checkZindex()",10);
			}
		});

});		

function checkZindex(){
	if($CommonUI.getComboBox('#patientNameT').combobox('panel').panel('panel').css('z-index')!= 99999999){
		$CommonUI.getComboBox('#patientNameT').combobox('panel').panel('panel').css('z-index','99999999');
	}else{
		setTimeout("checkZindex()",10);
	}
}

 //点诊断名称下拉列表中的一行，进行赋值
var patientListClick  = function (rowIndex,rowData){
	$('#patientName').val(rowData.patientName); 
	findData();
}   
function findData(){ 
	var patientName = $("#patientName").combogrid("getValue");
	$CommonUI.getDataGrid('#message').datagrid({
    	url:$WEB_ROOT_PATH + "/patientMessage/getMessageList.ajax",
    	queryParams:{ 
			"patientName":encodeURI(patientName)
    	}
    });
	$CommonUI.getDataGrid('#message').datagrid('load', {  
		"rows": 15,  
		"page": 1, 
		"patientName":encodeURI(patientName)
	});    
}
/**
 * 发送消息
 * **/
function sendMessage(){
	$CommonUI.getForm('#messageForm').form('clear');
	$('#messageDlg').dialog('open').dialog('setTitle', '发送信息窗口');	
	//String loginHosName = (String)session.getAttribute("loginHosName");
	//$("#messageInfo").val("【健康乐诊所】\n");
	var loginHosName=$("#loginHosName").val();
	$("#messageInfo").val(loginHosName+":");
	//document.getElementById("messageInfo").value = "1000";
}
/***
 * 选择发送人员
 */
function selectPatient(){
	$CommonUI.getForm('#patientForm').form('clear');
	$('#patientDlg').dialog('open').dialog('setTitle', '选择患者窗口');
	$CommonUI.getEdataGrid('#patientdg').datagrid({
		method:'get',
	    url:$WEB_ROOT_PATH+'/patientMessage/getPatientList.ajax',
	    fitColumns: true,
	    pagination: true,
	    height : 310,
		singleSelect: false,
		/*rownumbers: true,*/
	    columns:[[
	     	    	{field : "ck1",checkbox : true,width : 40,align : 'center'},
	     	    	{title : "patientid",field : "patientid",hidden:true}, 
	     			{title : "姓名",field : "patientName",width : 180,align : 'center'},
	     			{title : "性别",field : "patientSexid",width : 185,align : 'center'},
	     			{title : "电话",field : "patientTelephone",width : 185,align : 'center'}
	     		   ]],
	    queryParams:{page : 1,rows : 10},  
	    //queryParams:{} 
	    onCheck: function(rowIndex, rowData) {	    	
	    	var patientId=$("#patientId").val();
			var patientName=$("#name").val();
			var patientTelephone=$("#phone").val();
			if(patientId.indexOf(rowData.patientid)==-1){
				patientId=patientId+rowData.patientid+",";
				patientTelephone=patientTelephone+rowData.patientTelephone+",";
				patientName=patientName+rowData.patientName+";";
				$("#name").val(patientName);
				$("#phone").val(patientTelephone);
				$("#patientId").val(patientId);
			}else{
				$CommonUI.alert("该人员已存在！");
				return;
			}	
	    },
	    onUncheck: function(rowIndex, rowData) {
	    	var patientId=$("#patientId").val();
			var patientName=$("#name").val();
			var patientTelephone=$("#phone").val();
			patientName = patientName.replace(rowData.patientName+";","").trim();
			//patientName = patientName.replace(/\s/g,""); 
			patientId = patientId.replace(rowData.patientid+",","").trim();
			patientTelephone = patientTelephone.replace(rowData.patientTelephone+",","").trim();
			$("#name").val(patientName);
			$("#phone").val(patientTelephone);
			$("#patientId").val(patientId);
	    }
	    });
}

var patientListClickT  = function (rowIndex,rowData){
	$('#patientNameT').val(rowData.patientName); 
	findPatient();
}
/***
 * 人员选择页面-查询
 */
function findPatient(){
	var patientName = $("#patientNameT").combobox('getText');
	$CommonUI.getDataGrid('#patientdg').datagrid({
    	url:$WEB_ROOT_PATH + "/patientMessage/getPatientList.ajax",
    	queryParams:{
    		"filterStr":encodeURI(patientName)
    	}
    });
	$CommonUI.getDataGrid('#patientdg').datagrid('load', {  
		"rows": 15,  
		"page": 1, 
		"filterStr":encodeURI(patientName)
	});    
}
/****
 * 人员选择页面-确定
 */
function determinePatient(){
	var selections = $('#patientdg').datagrid('getSelections'); 
	if(selections.length){
		var patientId="";
		var patientName="";
		var patientTelephone="";
		for(var i=0;i<selections.length;){
			var data = selections[i];
			if((++i)==selections.length){
				patientId=patientId+data.patientid;
				patientTelephone=patientTelephone+data.patientTelephone;
				patientName=patientName+data.patientName;
			}else{
				patientId=patientId+data.patientid+",";
				patientTelephone=patientTelephone+data.patientTelephone+",";
				patientName=patientName+data.patientName+";";
			}			
		}
		$("#name").val(patientName);
		$("#phone").val(patientTelephone);
		$("#patientId").val(patientId);
		$('#patientDlg').dialog('close');
	}else{
		$CommonUI.alert("请选择人员!");
	}
}
/****
 * 发送
 */
function sendData(){
	//$('#send').attr('disabled','disabled');
	var messageInfo=$("#messageInfo").val();
	var patientId=$("#patientId").val();//还需去掉最后一个逗号；
	patientId = patientId.substring(0,patientId.length-1);
	var patientTelephone=$("#phone").val();//还需去掉最后一个逗号；
	patientTelephone = patientTelephone.substring(0,patientTelephone.length-1);
	var patientName=$("#name").val();
	if(patientName==""){
		$CommonUI.alert("请选择发送人员！");
		$('#send').attr('disabled',false);
		return;
	}
	$.ajax({
		 type: "post",
			url: $WEB_ROOT_PATH + "/patientMessage/sendPatientMessage.ajax",
			data:{
				 "messageInfo" : messageInfo,
			     "patientId" : patientId,
			     "patientTelephone" : patientTelephone
				},
	        dataType: "json",
	        success: function(data){
				if(data.result == "success"){
					$CommonUI.alert(data.msg);	
	        		$('#send').attr('disabled',false);
	        		$("#message").datagrid('reload');
	        		$('#messageDlg').dialog('close');
				}else if(data.result == "empty"){
					$CommonUI.alert(data.msg);	
        			$('#send').attr('disabled',false);
				}else{
					$CommonUI.alert(data.msg);	
	        		$('#send').attr('disabled',false);
				} 
	        }
	});
	/*postReq(url, null,succAdd, err, {skipHidden : false},
			{"dto.messageInfo" : messageInfo,
		     "dto.patientId" : patientId,
		     "dto.patientTelephone" : patientTelephone
		});*/
}
function succAdd(data) {	
	if(data.result=="success"){
		$CommonUI.alert("发送成功!");	
		$("#message").datagrid('reload');
		$('#messageDlg').dialog('close');
	}else{
		$CommonUI.alert("发送失败!");
	}
}
function err(){
	$CommonUI.alert("发送失败!");
}
