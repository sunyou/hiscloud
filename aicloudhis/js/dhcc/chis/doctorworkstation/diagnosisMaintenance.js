//诊断模板
$(function(){
	//页面初始化加载datagrid数据 
	$CommonUI.getDataGrid('#diagDatagrid').datagrid({    
	    url: $WEB_ROOT_PATH +'/template/getDiagnosisList.ajax?page=1&rows=15', 
	    fitColumns:true,
	    onClickRow:diagDatagridClick,
	    singleSelect:true,
	    pagination: true,
	    height:310,
	    columns:[[ 
            {field:'sortno',title:'排序号',width:230,align:'center'},
	        {field:'diagTypeid',title:'诊断编码',width:230,align:'center'},    
	        {field:'diagname',title:'诊断名称',width:230,align:'center'},    
	        {field:'diagaliases',title:'诊断常用名',width:230,align:'center'},
	        {field:'inputstr',title:'助记符',width:230,align:'center'},
	        {field:'uuid',title:'唯一编码',width:230,align:'center',hidden:true }
	    ]]    
	});  
});

//新增
function addDiag(){
    var uuid = $("#uuid").val(); 
	var isValid = $CommonUI.getForm('#diagForm').form('validate');
	if(uuid==""&&isValid){
		postReq($WEB_ROOT_PATH + '/template/addDiagnosis.ajax','diagForm',
				function(msg){
			
			        $CommonUI.getForm("#diagForm").form('clear');
					$CommonUI.alert("增加成功！");
					$('#diagDatagrid').datagrid('load');
				},
				function(){	$CommonUI.alert("增加失败！");},
				{skipHidden : false}
		);	
		
	}else if(uuid!=""){
		$CommonUI.alert("请选择修改或其他操作");
	}		
}
//点诊断名称下拉列表中的一行，进行赋值
var diagTempClick  = function (rowIndex,rowData){
	$('#diagTypeid').val(rowData.diagTypeid);
	$('#inputstr').val(rowData.inputstr);
	$('#diagaliases').val(rowData.diagName);
	$('#diagid').val(rowData.diagid);
};

//清空
function clearDiagForm(){
   $CommonUI.getForm("#diagForm").form('clear'); 
   $("#sortno").val(1);
}

//选中诊断列表datagrid的一行，将诊断维护的信息填充
var diagDatagridClick  = function (rowIndex,rowData){ 
	$('#diagid').val(rowData.diagid); 
	$('#diagTypeid').val(rowData.diagTypeid); 
	$('#diagnameGrid').combogrid("setValue",rowData.diagname);
	$('#diagaliases').val(rowData.diagaliases);
	$('#inputstr').val(rowData.inputstr);
	$('#sortno').val(rowData.sortno);
	$('#uuid').val(rowData.uuid);
	
//	$.getJSON($WEB_ROOT_PATH+ "/diagnosis/diagnosisCtrl.htm?BLHMI=listdiagTemplate",
//			{"dto.uuid":uuid},
//			function(msg) {
//				$('#diagid').val(msg["rows"][0].diagid);
//				$('#diagnameGrid').combogrid("setValue",msg["rows"][0].diagname);
//				$('#diagaliases').val(msg["rows"][0].diagaliases);
//				$('#inputstr').val(msg["rows"][0].inputstr);
//				$('#sortno').val(msg["rows"][0].sortno);
//				$('#uuid').val(uuid);
//			});
};
//修改
function updateDiag(){
		if($CommonUI.getDataGrid("#diagDatagrid").datagrid('getSelections').length != 1){
			$CommonUI.alert('请选择一条数据修改!');
			return;
		}else{
			var uuid=$('#diagDatagrid').datagrid('getSelected').uuid;
			postReq($WEB_ROOT_PATH + '/template/updateDiagnosis.ajax','diagForm',
					function(msg){
				        if(msg.result == "success"){
				        	$CommonUI.getForm("#diagForm").form('clear');
							$CommonUI.alert("修改成功！");
							$('#diagDatagrid').datagrid('load');
							$("#sortno").val(1);
				        }else{
				        	$CommonUI.alert("修改失败！");
				        }	        
					},
					function(){	$CommonUI.alert("修改失败！");},
					{skipHidden : false},{"uuid":uuid});	
		}	
	}
//删除
function deleteDiagForm(){
	if($CommonUI.getDataGrid("#diagDatagrid").datagrid('getSelections').length != 1)
    {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}else{
		var uuid=$('#diagDatagrid').datagrid('getSelected').uuid;
		postReq($WEB_ROOT_PATH + '/template/deleteDiagnosis.ajax','',
				function(msg){ 
					if(msg.result == "success"){
						$CommonUI.getForm("#diagForm").form('clear');
						$CommonUI.alert("删除成功！");
						$('#diagDatagrid').datagrid('load');
					}else{
						$CommonUI.alert("删除失败！");
					}
			        
				},
				function(){	$CommonUI.alert("删除失败！");},
				{skipHidden : false}, {"uuid":uuid});	
	};	
};
	
	
	
	
