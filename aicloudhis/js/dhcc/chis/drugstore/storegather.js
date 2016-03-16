$(function() {
	$CommonUI.getDataGrid('#bg').datagrid({
		height : 410,
		width:1200,
		url: $WEB_ROOT_PATH + "/drugStorageSummary/outInStoreCtrl.ajax?BLHMI=gatherlist",
		fitColumns : true,
		pageSize:14,
		pageList:[14,20,30],
		showHeader : true,
		singleSelect : true,
		pagination: true,
		striped:true,
		rownumbers:true,
		columns : [ [
						{
							field:'web',title:'唯一编码',align:'center',hidden:true 
						},{
							field:'itemname',title:'药品名称',width:80,align:'center'
						},{
							field:'orgname',title:'科室',width:50,align:'center'
						},{
							field:'inouttypeid',title:'出入库类型',width:60,align:'center',
							formatter: function(value,row,index){
								if(value=='0001'){
									return "调拨退库";
								}else if(value=='0101'){
									return "调拨出库";
								}else if(value=='0010'){
									return "直接调拨";
								}else{
									return null;
								}
							}
						},{
							field:'direct',title:'出入库方向',width:50,align:'center',
							formatter: function(value,row,index){
								if(value==1){
									return "入库";
								}else if(value==-1){
									return "出库";
								}else{
									return null;
								}
							}
						},{
							field:'inoutdatetime',title:'出入库时间',width:60,align:'center',
							formatter:function(value,row,index){
		    		    		if(row.inoutdatetime!=""&&row.inoutdatetime!=null){
		 							var inoutdatetime = row.inoutdatetime.substr(0,10);
		 							return inoutdatetime;
		 							
		 						}
		    		    		
		    		    	}	
						},{
							field:'batchcode',title:'药品批次',width:60,align:'center'
						},{
							field:'basicUnit',title:'单位类型',width:40,align:'center'
						},{
							field:'quantity',title:'请求数量',width:40,align:'center'
						}
						,{
							field:'totalQuantity',title:'供给数量',width:40,align:'center'

						}
						]]

	});
//	var comurl=$WEB_ROOT_PATH + "/drugStorageSummary/outInStoreCtrl.ajax";
//	//获取单据号
//	$CommonUI.getComboBox('documentno').combobox({
//		valueField: 'inoutid',
//		textField: 'documentno',
//		url: comurl,
//	});
	
});
//统计查询
function nocheck(){
	var itemname=$('#itemname').val();
	var startime=$CommonUI.getDateTimeBox('#startime').datetimebox('getValue');
	var endtime=$CommonUI.getDateTimeBox('#endtime').datetimebox('getValue');
	if((startime!=null && startime!='') && (endtime!=null && endtime!='') && (startime>endtime)){
		$CommonUI.alert("起始时间不可大于终止时间!");	
		return;
	}
	var orgname=$CommonUI.getComboBox('#orgname').combobox('getValue');
	var queryParams={
			"medicine":itemname,
			"startDate":startime,
			"endDate":endtime,
			"orgid":orgname,
	};
	$CommonUI.getDataGrid('#bg').datagrid({
		url: $WEB_ROOT_PATH + "/drugStorageSummary/outInStoreCtrl.ajax",
		queryParams:queryParams,
	});
}
