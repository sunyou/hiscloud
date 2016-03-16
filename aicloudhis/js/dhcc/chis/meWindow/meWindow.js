//list加载数据
$(function () {
	// 获取datagrid的数据
	$CommonUI.getDataGrid("#show").datagrid({
	    url: $WEB_ROOT_PATH + "/agencyManage/getMeWindowList.ajax",
	    method:"post",
	    height:465,
	    striped: true,
	    fitColumns : true,
	    pageList: [15,20,50,100], 
	    columns:[[ 
  	    	{field: "ck1", checkbox: true, width: 40, align: "center"},
	        {field: "orgname", title: "所属科室", width: 200, align: "center"},
	        {field: "windonsname", title: "窗口名称", width: 200, align: "center"},
	        {field: "isstop", title:"启用标识", width:200, align:"center",
	        	formatter: function(value, row, index){
	  		    	   if(value == 1){
	  		    		   return "启用";
	  		    	   }else {
	  		    		   return "不启用";
	  		    	   }
	  		     }
	        }
	    ]] 
	});
}); 

//查询窗口列表
function selectClick() {
    var json = $CommonUI.loopBlock("#selectForm");
    $("#show").datagrid("load", json);
}

//新增窗口
function addClick() {
	$CommonUI.getDialog("#detailWin").dialog({
		title: " 新 增",  
	    width: 400,  
	    height: 350,  
	    closed: true,
	    modal: true
	}).dialog("open");
	$CommonUI.getForm("#detail").form("clear");
	$("#flg").val("save");
	$("#enableFlag").attr("checked", "checked");
}

//修改窗口
function editRow() {
	if($CommonUI.getDataGrid("#show").datagrid("getSelections").length != 1){
		$CommonUI.alert("请选择一条数据更新!");
		return;
	}
	var oneWindowInfo = $("#show").datagrid('getSelected');
	$CommonUI.getForm("#detail").form("clear");
	$("#flg").val("update");
	$CommonUI.getDialog("#detailWin").dialog({
		title: " 修 改",  
	    width: 400,  
	    height: 350,  
	    closed: true,
	    modal: true
	}).dialog("open");
	$CommonUI.fillBlock('#detailWin', fillListDataToUpdateForm(oneWindowInfo, "meWindow.", {}));
}

//新增、修改保存数据
function saveClick() {
	var isValid = $CommonUI.getForm("#detail").form("validate");
	if(isValid) {
		postReq($WEB_ROOT_PATH + "/agencyManage/saveMeWindow.ajax", "#detail",
					succ, err, {
						skipHidden : false
				});
	}
}

//新增、修改取消
function cancelClick() {
	$CommonUI.getWindow("#detailWin").window("close");
}

//新增、修改成功
function succ(data){
	$CommonUI.alert("信息保存成功!");
	$("#show").datagrid('reload');
	$("#detailWin").window("close");
}

//新增、修改失败
function err(xhr,textStatus,errorThrown){
	$CommonUI.alert("信息保存失败！");	
}
	
//清除输入框内容
function clear() {
	$("#selectForm").reset();
}
	
//删除窗口
function delRow() {
	if($CommonUI.getDataGrid("#show").datagrid("getSelections").length != 1){
		$CommonUI.alert("请选择一条数据更新!");
		return;
	}
	var row = $("#show").datagrid("getSelected");
	$CommonUI.confirm("确定删除吗？", "question", 0, function(){
		$.post($WEB_ROOT_PATH + "/agencyManage/deleteMeWindow.ajax", {"uuid": row.uuid}, function(){
			$("#show").datagrid('reload');
		});
	});
}

//科室选择
function orgSelect() {
	$("input[name='meWindow.orgname']").val($("#orgComboxPop").combobox("getText"));
}
