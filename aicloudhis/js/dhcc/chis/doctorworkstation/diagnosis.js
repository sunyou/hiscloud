//诊断模块
$(function() {
	$CommonUI.getDataGrid('#diagnosisGrid').datagrid({
		height : (getIframeHeight()-60)*0.5-30-60,
		width:857,
		//fitColumns : true,
		showHeader : true,
		autoSave : false,
		singleSelect : true,
		onAfterEdit : diagGridOnAfterEdit,
		columns : [ [ {field : 'uuid',title : '唯一编码',width : 85,align : 'center',hidden : true},
		              {field : 'diagroleid',title : '诊断类型(主,次诊断)',width : 85,align : 'center',editor:{type:'text'},hidden : true},
		              {field : 'diagTypeid',title : '诊断类型(中西医)',width : 85,align : 'center',hidden : true},
		              {field : 'rowno',title:'序号',width:30,align:'center',hidden : true},
					  {field : 'diagid',title : '诊断编码',width : 85,align : 'center',editor:{type:'text'},hidden : true},
					  {field : 'diagrolename',title : '诊断类型',width : 232,align : 'center',editor : {type : 'combobox',options : {onSelect : diagroleonSelect,width : 230, panelHeight : 53,valueField : 'diagrolename',textField : 'diagrolename',editable:false,panelHeight:'auto'}}}, 
					  {field : 'diagName',title : '诊断',width : 232,align : 'center',editor : {type : 'combogrid',id : 'diagnosisGridDetailed',options : {onClickRow : diagRowClick,onPressEnter:diagnameonPressEnter,width : 245,mode : 'remote',method : 'post',hasDownArrow : false,idField : 'diagName',textField : 'diagName', pagination:true,panelWidth : 350,panelHeight : 320,columns : [ [ {field : 'diagid',title : '疾病编码',width : 120,align : 'center'},{field : 'diagName',title : '疾病名称',width : 200,align : 'center'} ] ]}}},
					  {field : 'diagDesc',title : '症状描述',width :232,align : 'center',editor : {type : 'text'}}, 
		              {field : 'dateInput',title : '开立时间',width : 85,align : 'center',editor : {type : 'text'},hidden : true}, 
		              {field : 'empIdInput',title : '开立人编码',width : 85,align : 'center',editor : {type : 'text'},hidden : true},
		              {field : 'empnameInput',title : '开立人名称',width : 85,align : 'center',editor : {type : 'text'},hidden : true},
		              {field : 'flagdiagName',title : '诊断名称备份',width : 85,align : 'center',editor : {type : 'text'},hidden : true}, 
					  {field :'deleteRow',title:'操作',width:137,align : 'center',formatter: function(value,row,index){
							var e = '<a href="javascript:void(0)">删除</a> ';
							return e; 
				     }}
					 ] ],
	   onClickCell: function(index,field,value){
		   if(field =='deleteRow'){
			  diagnosisDeleteDate(index);  
		   }
	   },
	   onDblClickRow:function(rowIndex, rowData){
		   $('#diagnosisGrid').datagrid('beginEdit',rowIndex);
		   loaddiagData(rowIndex);
	   }
	});
});
//诊断添加
function diagnosisadd(){
	var patientid = $('#hiddenpatientId').val();
	if (patientid == "" || patientid == "undefined" || patientid == null) {
		$CommonUI.alert("请先选择一个患者");
		$CommonUI.getTabs('#tabsResize').tabs('select', 0);
		return;
	} 
	//结束编辑状态
	for(var i=0;i<$('#diagnosisGrid').datagrid('getRows').length;i++){
		$('#diagnosisGrid').datagrid('endEdit',i);
	}
	//判断添加的条件
	var myIndex = $('#diagnosisGrid').datagrid('getRows').length;
	var row=null;
	if(myIndex!=0){
	     row = $('#diagnosisGrid').datagrid('getRows')[myIndex - 1];
	}
	if (myIndex != 0&& (row.diagroleid == null || row.diagroleid == ""|| row.diagroleid == undefined|| row.diagName == null || row.diagName == "" || row.diagName == undefined)) {
		$CommonUI.alert("请完善诊断类型和诊断信息");
		return;
	}else{
		//获取最大的rowno,mySQL自增从1开始
		var maxrowno=0;
		if(myIndex==0){
		     maxrowno=0;
		}else if(myIndex==1){
			 maxrowno=$('#diagnosisGrid').datagrid('getRows')[myIndex-1].rowno;
		}else{
			for(var i=0;i<myIndex-1;i++){
				if($('#diagnosisGrid').datagrid('getRows')[i].rowno>=$('#diagnosisGrid').datagrid('getRows')[i+1].rowno)
					maxrowno=$('#diagnosisGrid').datagrid('getRows')[i].rowno;
				else
			     maxrowno=$('#diagnosisGrid').datagrid('getRows')[i+1].rowno;	
			}	
		}
		var mySelect = $("input[name='selectDiagnosis']:checked").val();
		var diagrolename="";
		var diagroleid="";
		if(mySelect==00){
			  diagrolename="主诊断";
			  diagroleid="00";
		}else{
			 diagrolename="证候诊断";
			 diagroleid="03";
		}
		$('#diagnosisGrid').datagrid('appendRow', {
				rowno : maxrowno+1,
				diagTypeid : mySelect,
				diagrolename:diagrolename,
				diagroleid:diagroleid
		});
    	$('#diagnosisGrid').datagrid('selectRow',myIndex);
		$('#diagnosisGrid').datagrid('beginEdit',myIndex);
		loaddiagData(myIndex);
	}
}

// 诊断保存 可以不存在西医诊断，一旦有西医诊断必须要有主要诊断
function diagnosissave() {
	// 判断保存的条件
	var rows = $('#diagnosisGrid').datagrid('getRows');
	var rowIndex = $('#diagnosisGrid').datagrid('getRows').length;
	for(var i=0;i<rowIndex;i++){
		$('#diagnosisGrid').datagrid('endEdit',i);
	}
	var orgidHosp=$('#orgidHosp').val();//登陆人所属诊所
	var orgid=$('#loginLocId').val();//登陆人所属科室
	var loginId=$('#loginId').val();  //登陆人id
	var loginName=$('#loginName').val();//登陆人姓名
	var serialno=$('#hiddenserialno').val();
	var loginLocName=$('#loginLocName').val();
	// 获取datagrid最后一行
	if (rowIndex == 0) {
		 $CommonUI.alert("请添加诊断信息","info");
         return -1;
	} else {
		var LastRow = rows[rowIndex - 1];
	}
	var flag = true;
	if (LastRow.diagroleid == null || LastRow.diagroleid == ""|| LastRow.diagroleid == undefined || LastRow.diagName == null|| LastRow.diagName == "" || LastRow.diagName == undefined) {
		$CommonUI.alert("请完善诊断信息","info");
		return -1;
	} else {
		for ( var j = 0; j < rows.length; j++) {
			if (rows[j].diagroleid == "01") {
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].diagroleid == "00") {
						flag = true;
						break;
					} else {
						flag = false;
					}
				}
				break;
			}
		}
	}
	// 进行批量保存
	if (flag == true) {
		var patientid = $('#hiddenpatientId').val();// 患者ID
		var admisSerialno = $('#hiddenadmisSerialno').val();
		var json = $('#diagnosisGrid').datagrid('getData');
    	var rows=json.rows;
    	var Fields = new Array();
    	for(var i=0; i<rows.length; i++){
    		var Field = new Object();
    		if (rows[i].uuid == undefined||rows[i].uuid==''){
	    		Field.diagroleid = rows[i].diagroleid;
	    		Field.diagName = rows[i].diagName;
	    		Field.diagDesc = rows[i].diagDesc;
	    		Field.admisSerialno = admisSerialno;
	    		Field.diagTypeid = rows[i].diagTypeid;
	    		Field.patientid =  patientid;
	    		Field.diagid = rows[i].diagid;
	    		Field.rowno = rows[i].rowno;
	    		Field.orgidHosp = orgidHosp;
	    		Field.orgid  = orgid ;
	    		Field.serialno = serialno;
	    		Field.orgname = loginLocName;
	    		Field.empidInput = loginId;
	    		Field.empnameInput = loginName;
    		}else{
	    		Field.diagroleid = rows[i].diagroleid;
	    		Field.diagName = rows[i].diagName;
	    		Field.diagDesc = rows[i].diagDesc;
	    		Field.admisSerialno = admisSerialno;
	    		Field.diagTypeid = rows[i].diagTypeid;
	    		Field.patientid =  patientid;	
	    		Field.diagid = rows[i].diagid;
	    		Field.uuid = rows[i].uuid;
	    		Field.rowno = rows[i].rowno;
	    		Field.orgidHosp = orgidHosp;
	    		Field.orgid  = orgid ;
	    		Field.serialno = serialno;
	    		Field.orgname = loginLocName;
	    		Field.empidUpdate = loginId;
	    		Field.empnameUpdate = loginName;
	    		Field.empidInput = rows[i].empIdInput;
	    		Field.empnameInput = rows[i].empnameInput;
	    		//Field.dateInput = rows[i].dateInput;
    		}
    	   Fields[i] = Field;
    	}
    	Str = $.toJSON(Fields);
    	var url=$WEB_ROOT_PATH+'/treatment/saveDiag.ajax';
    	postReq(url, '#diagnosisGrid',function(data){
    		var index = $('#diagnosisGrid').datagrid('getRows').length;
			for ( var i = 0; i < index; i++) {
				$('#diagnosisGrid').datagrid('getRows')[i].uuid = data.rows[i].uuid;
				$('#diagnosisGrid').datagrid('getRows')[i].dateInput = data.rows[i].dateInput;
				$('#diagnosisGrid').datagrid('getRows')[i].empIdInput = data.rows[i].empidInput;
				$('#diagnosisGrid').datagrid('getRows')[i].empnameInput = data.rows[i].empnameInput;
			}
			$('#diagnosesSpan').text(data.rows[0].diagName);
			$CommonUI.getDataGrid('#diagnosisGrid').datagrid('load');
			return 1;
			//$CommonUI.autoCloseCenterMessage("保存成功","info","",500);
    	},"",{"skipHidden":false},{"diagString":Str});
	} else if (flag == false) {
		$CommonUI.alert("请填写主诊断信息");
		return -1;
	}
}
// 诊断Grid删除数据
function diagnosisDeleteDate(index) {
	var row=$('#diagnosisGrid').datagrid('getData')["rows"][index];
	var uuid=row.uuid;
	if (uuid == "" || uuid == null) {
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function() {
					$('#diagnosisGrid').datagrid("endEdit", index);
					$('#diagnosisGrid').datagrid("deleteRow", index);
				});
	} else {
		$CommonUI.confirm("确定删除行吗？", 'question', '是的', function(){
			postReq(
					$WEB_ROOT_PATH
							+ '/treatment/deleteDiag.ajax?uuid='
							+ uuid, '', function() {
						$CommonUI.alert("删除成功");
						$('#diagnosisGrid').datagrid("endEdit", index);
						$('#diagnosisGrid').datagrid("deleteRow", index);
					}, function() {
						$CommonUI.alert("删除失败");
					}, {
						skipHidden : false
		});
	});
}};
// 加载诊断类型和诊断数据
var loaddiagData = function(rowIndex){
	    var mySelect = $("input[name='selectDiagnosis']:checked").val();
		if( mySelect=='00'){
		    var diagrolenameEditor = $('#diagnosisGrid').datagrid('getEditor', {index:rowIndex,field:'diagrolename'});
		    $(diagrolenameEditor.target).combobox('loadData',{total:2, rows:[{"diagrolename":"主诊断"},{"diagrolename":"次要诊断"}]});
		    var diagNameEditor = $('#diagnosisGrid').datagrid('getEditor', {index:rowIndex,field:'diagName'});
			$(diagNameEditor.target).combogrid({url:$WEB_ROOT_PATH +'/treatment/searchDiagname.ajax?diagTypeid=00'});
		}else{
			var diagrolenameEditor = $('#diagnosisGrid').datagrid('getEditor', {index:rowIndex,field:'diagrolename'});
			$(diagrolenameEditor.target).combobox('loadData',{total:2, rows:[{"diagrolename":"证候诊断"},{"diagrolename":"疾病诊断"}]});
			var diagNameEditor = $('#diagnosisGrid').datagrid('getEditor', {index:rowIndex,field:'diagName'});
			$(diagNameEditor.target).combogrid({url:$WEB_ROOT_PATH +'/treatment/searchDiagname.ajax?diagTypeid=01'});
		}
};
// 患者诊断角色onSelect事件
var diagroleonSelect = function(record) {
	 var selectedRow = $('#diagnosisGrid').datagrid("getSelected");
     var selectedIndex = $('#diagnosisGrid').datagrid("getRowIndex", selectedRow);
	 var diagroleidEditor = $('#diagnosisGrid').datagrid('getEditor', {index:selectedIndex,field:'diagroleid'});
	   if(record.diagrolename=="主诊断"){
		   $(diagroleidEditor.target).val('00');
	   }else if(record.diagrolename=="次要诊断"){
		   $(diagroleidEditor.target).val('01');  
	   }else if(record.diagrolename=="证候诊断"){
		   $(diagroleidEditor.target).val('03');
	   }else if(record.diagrolename=="疾病诊断"){
		   $(diagroleidEditor.target).val('02');
	   }
};

var diagnameonPressEnter=function(){
	var selectedRow = $CommonUI.getDataGrid('#diagnosisGrid').datagrid("getSelected");
	if(selectedRow==null||selectedRow==undefined){
		return;
	}
	var selectedIndex = $CommonUI.getDataGrid('#diagnosisGrid').datagrid("getRowIndex", selectedRow);
	var diagNameEditor = $CommonUI.getDataGrid('#diagnosisGrid').datagrid('getEditor', {index:selectedIndex,field:'diagName'});
	var comboSelectedRow = $(diagNameEditor.target).combogrid('grid').datagrid("getSelected");
	var comboSelectedIndex =  $(diagNameEditor.target).combogrid('grid').datagrid("getRowIndex", comboSelectedRow);
	diagRowClick(comboSelectedIndex,comboSelectedRow);
	
};
//疾病名称rowclick事件
var diagRowClick = function(rowIndex, rowData) {
	var selectedRow = $('#diagnosisGrid').datagrid("getSelected");
    var selectedIndex = $('#diagnosisGrid').datagrid("getRowIndex", selectedRow);
	var diagidEditor = $('#diagnosisGrid').datagrid('getEditor', {index:selectedIndex,field:'diagid'});
	var flagdiagNameEditor = $('#diagnosisGrid').datagrid('getEditor', {index:selectedIndex,field:'flagdiagName'});
	$(diagidEditor.target).val(rowData.diagid);
	$(flagdiagNameEditor.target).val(rowData.diagName);
};

//常用诊断功能
function diagimportTemplate() {
	var patientid = $('#hiddenpatientId').val();
	if (patientid == "" || patientid == "undefined" || patientid == null) {
		$CommonUI.alert("请先选择一个患者");
		$CommonUI.getTabs('#tabsResize').tabs('select', 0);
	}else{
		var mySelect = $("input[name='selectDiagnosis']:checked").val();
		$('#diagimpTemplateDlg').dialog('open').dialog('center');
		$('#diagtemplatesearch').val('');
		$.getJSON($WEB_ROOT_PATH+ "/treatment/listdiagTemplate.ajax", {
			"diagTypeid":mySelect
		}, function(msg) {
			$CommonUI.getDataGrid('#diagTemplateGrid').datagrid('loadData', msg);
		});
	}
};
//诊断模板双击事件
function diagTemplateGridClick(rowIndex, rowData) {
	var myIndex = $('#diagnosisGrid').datagrid('getRows').length;
	for(var i=0;i<$('#diagnosisGrid').datagrid('getRows').length;i++){
		$('#diagnosisGrid').datagrid('endEdit',i);
	}
	var row = null;
	if (myIndex == 0) {
		row = $('#diagnosisGrid').datagrid('getRows')[myIndex];
	} else {
		row = $('#diagnosisGrid').datagrid('getRows')[myIndex - 1];
	}
	if (myIndex != 0&& (row.diagroleid == null || row.diagroleid == ""|| row.diagroleid == undefined|| row.diagName == null || row.diagName == "" || row.diagName == undefined)){
		$CommonUI.alert("请完善诊断类型和诊断信息");
		$('#diagimpTemplateDlg').dialog('close');
		return;
	}else{
		var mySelect = $("input[name='selectDiagnosis']:checked").val();
		var diagrolename=""; 
		var diagroleid="";
		if(mySelect==00){
			  diagrolename="主诊断";
			  diagroleid="00";
		}else{
			 diagrolename="证候诊断";
			 diagroleid="03";
		}
		var maxrowno=0;
		if(myIndex==0){
		     maxrowno=0;
		}else if(myIndex==1){
			 maxrowno=$('#diagnosisGrid').datagrid('getRows')[myIndex-1].rowno;
		}else{
			for(var i=0;i<myIndex-1;i++){
				if($('#diagnosisGrid').datagrid('getRows')[i].rowno>=$('#diagnosisGrid').datagrid('getRows')[i+1].rowno)
					maxrowno=$('#diagnosisGrid').datagrid('getRows')[i].rowno;
				else
			     maxrowno=$('#diagnosisGrid').datagrid('getRows')[i+1].rowno;	
			}	
		}
		$('#diagnosisGrid').datagrid('appendRow', {
				rowno : maxrowno + 1,
				diagTypeid : mySelect,
				diagName : rowData.diagname,
				diagid: rowData.diagid,
				diagTypeid : rowData.diagTypeid,
				diagrolename : diagrolename,
				diagroleid : diagroleid
		});
	  $('#diagimpTemplateDlg').dialog('close');
	}
};

//诊断模板关闭
function diagtemclose(){
	$('#diagimpTemplateDlg').dialog('close');	
}

//诊断模板确定
function diagQuoteconfirm(){
	var selectedRow = $('#diagTemplateGrid').datagrid("getSelected");
	var selectedIndex = $('#diagTemplateGrid').datagrid("getRowIndex", selectedRow);
	if(selectedRow==undefined){
		$CommonUI.alert("请选择一条诊断信息！");
	}else{
		diagTemplateGridClick(selectedIndex,selectedRow);
	}
}
//诊断模板查询
function diagsearch(){
	var diagaliases=$('#diagtemplatesearch').val();
	var mySelect = $("input[name='selectDiagnosis']:checked").val();
	postReq(
			$WEB_ROOT_PATH+ '/treatment/listdiagTemplate.ajax', '', function(msg) {
				$CommonUI.getDataGrid('#diagTemplateGrid').datagrid('loadData', msg);
			}, function() {
			}, {skipHidden : false},{"diagaliases":diagaliases,"diagTypeid":mySelect});
};
//结束编辑状态后就会触发此函数;updateRow不会使其他数据置空
var diagGridOnAfterEdit = function(rowIndex, rowData) {
	if(rowData.flagdiagName != ""){
		$CommonUI.getDataGrid('#diagnosisGrid').datagrid('updateRow', {
			index : rowIndex,
			row : {
				diagName : rowData.flagdiagName
			}
		});	
	}
};

function diagdetail(admisSerialno) {
	postReq($WEB_ROOT_PATH+ "/treatment/diagDetail.ajax",'',function(msg){
		$CommonUI.getDataGrid('#diagnosisGrid').datagrid('loadData', msg);
	},function(){},{},{"admisSerialno":admisSerialno});
};

function diagint() {
	$CommonUI.getDataGrid('#diagnosisGrid').datagrid('loadData', {
		"total" : "0",
		"rows" : []
	});
};
//已接诊非当天接诊时，带出诊断信息(无uuid)
function diagnouuiddetail(admisSerialno) {
	postReq($WEB_ROOT_PATH+ "/treatment/diagDetail.ajax",'',function(msg){
	     if(msg['total']>0){
	    	 for(var i=0;i<msg['total'];i++){
	    		 msg["rows"][i].uuid=''; 
	    	 }
	     }
	$CommonUI.getDataGrid('#diagnosisGrid').datagrid('loadData', msg);
	},function(){},{},{"admisSerialno":admisSerialno});
};
