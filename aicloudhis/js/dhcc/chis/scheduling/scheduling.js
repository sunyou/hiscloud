$(function() {
	var orgidHosp=$('#orgidHosp').val();
	if(orgidHosp!=null&&orgidHosp!=""){
		$CommonUI.getComboBox('#orgid').combobox({  
		    url: $WEB_ROOT_PATH + '/tregisterplan/getOrg.ajax',  
		    valueField:'orgid',  
		    textField:'orgname'  
		});  
	}
	var options = {height : 375,width : '100%',singleSelect : true,pagination : true,
			onSelect:function(rowIndex, rowData){
				var url = $WEB_ROOT_PATH + '/tregisterplan/scheduLisfindbyUUid.ajax?registid='+rowData.registid
				+'&uuid='+rowData.uuid1;
	         	$.getJSON(url, function(d){ 
	         		$CommonUI.getComboBox('#orgid').combobox({disabled:true}); 
	         		$CommonUI.getComboBox('#dateTypeid').combobox({disabled:true}); 
	         		$CommonUI.getComboBox('#weekTypeid').combobox({disabled:true}); 
	         		$CommonUI.getComboBox('#registTypeid').combobox({disabled:true}); 
	         		$CommonUI.getComboBox('#empid').combobox({disabled:true});
	         		$('#orgid').combobox('setValue',d['rows'][0].orgid);
	         		$('#orgid').combobox('setText',d['rows'][0].orgname);
	         		$('#registTypeid').combobox('setValue',d['rows'][0].registTypeid);
	         	 if(rowData.registTypeid=='专家号'){
	    		    	 $('#emp').show();
	    				 $('#empid').combobox('setValue', rowData.empid);
	    				 $('#empid').combobox('setText', rowData.empname);
	    	    	}
	    		     if(rowData.registTypeid=='普通号'){
    		    	 $('#emp').hide();
	    	    	 }
	         		$('#dateTypeid').combobox('setValue',d['rows'][0].dateTypeid);
	         		$('#weekTypeid').combobox('setValue',d['rows'][0].weekTypeid);
	         		$('#limitAmount').val(d['rows'][0].limitAmount);
	         		$('#limitbookAddamount').val(d['rows'][0].limitbookAddamount);
	         		$('#bookqueueStartno').val(d['rows'][0].bookqueueStartno);
	         		$('#limitbookAmount').val(d['rows'][0].limitbookAmount);
	        	});
			},
			rownumbers : false,fitColumns : true};
	var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
	var pageOpts = {pageNumber : 1,pageSize : 10};
	var columns = [ [
          {title: "科室",field: "orgname",width: 80,align : 'center'},
          {title: "诊别类型",field: "registTypeid",width: 80,align : 'center'},
          {title: "专家名称",field: "empname",width: 70,align : 'center'},
          {title: "出诊时段",field: "dateTypeid",width: 70,align : 'center'},
          {title: "星期",field: "weekTypeid",width:60,align : 'center'},
          {title: "正号限额",field: "limitAmount",width: 60,align : 'center'},
          {title: "预约限额",field: "limitbookAmount",width: 60,align : 'center'},
          {title: "预约起始号",field: "bookqueueStartno",width: 60,align : 'center'},
          {title: "加号限额",field: "limitbookAddamount",width:60,align : 'center'}
           ]];
	var queryParams = {page : 1,rows : 10};
	var url = $WEB_ROOT_PATH + '/tregisterplan/addscheduList.ajax';
	$CommonUI.datagrid('#dtlFeeDg', url, queryParams, columns, pageOpts, sortOpts,options);
});
function addItemClick(){
	var isValid = $CommonUI.getForm('addItemForm').form('validate');
	if (isValid) {
		var registid=$('#addItemForm input[name="registernumber.registid""]').val();
		if (registid == "" || registid == null) {
			var registTypeid= $CommonUI.getComboBox('#registTypeid').combobox('getValue');
			var registTypename= $CommonUI.getComboBox('#registTypeid').combobox('getText');
			var  empname="";
			var  empid="";
			var inputstr="";
			var itemid="20201010003";
			var  dateTypeid = $CommonUI.getComboBox('#dateTypeid').combobox('getValue');
			var  weekTypeid = $CommonUI.getComboBox('#weekTypeid').combobox('getValue');
			var limitAmount = $('#limitAmount').val();
			var bookqueueStartno = $('#bookqueueStartno').val();
			var limitbookAmount = $('#limitbookAmount').val();
			var limitbookAddamount = $('#limitbookAddamount').val();
			var isstop='1';
			var orgid =$CommonUI.getComboBox('#orgid').combobox('getValue');
			var orgname =$CommonUI.getComboBox('#orgid').combobox('getText');
			var rowno='0';
			var registname=empname+registTypename;//xxx专家号  普通号
			var inputCode="P";
			if(registid == "" || registid == null){
			if(registTypeid=='01'){
				 $('#emp').show();
				 empid = $CommonUI.getComboBox('#empid').combobox('getValue');
				 empname = $CommonUI.getComboBox('#empid').combobox('getText');
				 if(empid==null||empid==""){
					 $CommonUI.alert('专家不能为空!');
					 registTypeid="";
					 return ;
				 }
				 inputstr = getFirstLetters(empname); 
				 $('#inputstr').val(inputstr);
			}
			$.post($WEB_ROOT_PATH+"/tregisterplan/addscheduling.ajax",
					{ 'dto.registernumber.registname':registname,
						'dto.registernumber.inputstr':inputstr,
				 	'dto.registernumber.inputCode':inputCode,
					 'dto.registernumberlistvo.dateTypeid':dateTypeid,
					 'dto.registernumberlistvo.weekTypeid':weekTypeid,
					 'dto.registernumberlistvo.registTypeid':registTypeid,
			         'dto.registernumberlistvo.empid':empid,
			         'dto.registernumberlistvo.empname':empname,
			         'dto.registernumberlistvo.orgid':orgid,
				     'dto.registernumber.registTypeid':registTypeid,
					 'dto.registernumber.isstop':isstop,
					 'dto.registernumber.orgid':orgid,
					 'dto.registernumber.orgname':orgname,
					 'dto.registernumber.empid': empid,    //ID
					 'dto.registernumber.empname': empname,    //专家医生
					 'dto.registerItem.registTypeid': registTypeid,
					 'dto.registerItem.rowno': rowno,
					 'dto.registerItem.itemid': itemid,
					 'registerplan.registid':registTypeid,
					 'registerplan.orgid':orgid,
					 'registerplan.orgname':orgname,
					 'registerplan.dateTypeid':dateTypeid,  //上午 ，下午
					 'registerplan.weekTypeid': weekTypeid, //星期几
					 'registerplan.limitAmount': limitAmount,//正号限额
					 'registerplan.limitbookAddamount': limitbookAddamount,
					 'registerplan.limitbookAmount': limitbookAmount,
					 'registerplan.bookqueueStartno': bookqueueStartno
					},function(d){
						if(d!=null&&d!=""){
							 if(d.total==0){
									$CommonUI.alert("添加成功!","","提示");
							   }
							   else{
								   $CommonUI.alert("此时间段已被添加","","提示");
							   }
							}
						$CommonUI.getDataGrid("#dtlFeeDg").datagrid('reload');
						},'json');
				}
			}
		}
}
function editRow() {
         if ($CommonUI.getDataGrid("#dtlFeeDg").datagrid('getSelections').length != 1) {
 			$CommonUI.alert('请选择一条数据更新!');return;}
         	var row = $("#dtlFeeDg").datagrid('getSelected');
         	var orgid =$CommonUI.getComboBox('#orgid').combobox('getValue');
         	if(orgid==null||orgid==""){
         		$CommonUI.alert('请重新选择一条数据!');
         	}else{
				var limitAmount = $('#limitAmount').val();
				var bookqueueStartno = $('#bookqueueStartno').val();
				var limitbookAmount = $('#limitbookAmount').val();
				var limitbookAddamount = $('#limitbookAddamount').val();
			    $.post($WEB_ROOT_PATH+"/tregisterplan/schedulingupdate.ajax",
						{
					     'registerplan.uuid':row.uuid1,
					     'registerplan.limitAmount':limitAmount,//正号限额
					     'registerplan.limitbookAddamount':limitbookAddamount,
					     'registerplan.limitbookAmount': limitbookAmount,
					     'registerplan.bookqueueStartno': bookqueueStartno
					}, function(d){
						if(d!=null&&d!=""){
						   if(d['total']==2){
							   $CommonUI.alert("修改成功!");
						   }
						   else{
							   $CommonUI.alert("修改失败!");
						//	   $CommonUI.alert("此时段不能修改,只能修改限额数！");
						   }
						}
						$CommonUI.getDataGrid("#dtlFeeDg").datagrid('reload');
						},'json');
         	}
}
function delRow(){
	if ($CommonUI.getDataGrid("#dtlFeeDg").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条数据删除!');
		return;
	}
	$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
		var row = $CommonUI.getDataGrid("#dtlFeeDg").datagrid('getSelected');
		$.post($WEB_ROOT_PATH+"/tregisterplan/schedulingdeleteById.ajax",{
		     'registernumber.registid':row.registid,    //普通号，专家号
	         'registerItem.uuid':row.uuid2,'uuid':row.uuid1},
			function(d){
			if(d!=null&&d!=""){
				   if(d['total']==2){
					   	$CommonUI.getDataGrid("#dtlFeeDg").datagrid('reload');
					   	$CommonUI.alert("删除成功!");
					   	clearClick();
				   }
			}
		},'json');
	});
}
function schedulingSave(){
	var startDate = $CommonUI.getDateTimeBox('#startDate').datetimebox('getValue');	
	var endDate = $CommonUI.getDateTimeBox('#endDate').datetimebox('getValue');
	if((startDate==null||startDate=='')){
		$CommonUI.alert("请选择起始时间！");
	    return;
	}else if((endDate==null || endDate=='')){
		$CommonUI.alert("请选择终止时间！");
		return;
	}else if((startDate!=null && startDate!='') && (endDate!=null && endDate!='') && (startDate>endDate)){
		$CommonUI.alert("起始时间不可大于终止时间!");	
		return;
	}
	$('#createScheduleBtn').attr('disabled','disabled');
	$.post($WEB_ROOT_PATH+"/tregisterplan/schedulingSavesucc.ajax",
			{'startDate':startDate,
	 		 'endDate':endDate
	 		 }, function(d){
	 			if(d!=null&&d!=""){
					if(d['total']==1){ 
						$CommonUI.alert("排班成功!");
					}
					else{$CommonUI.alert("排班失败!");}
				}
	 			$('#createScheduleBtn').removeAttr('disabled');
	},'json');
}
formatterDate = function(date) {
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
	return date.getFullYear() + '-' + month + '-' + day;
	};
function onSelectemp(){
	var  registTypeid = $CommonUI.getComboBox('#registTypeid').combobox('getValue');
	var orgid =$CommonUI.getComboBox('#orgid').combobox('getValue');
	if(registTypeid=='01'){
		var empTypeid = '01';//人员职称    01 表示医生
		$.post($WEB_ROOT_PATH + '/empMgr/empMgrCtrl.htm?BLHMI=empListByOrgidAndEmptypeid',{'dto.emp.orgid': orgid,'dto.emp.empTypeid': empTypeid,'dto.emp.empTitleid': registTypeid},
				function(d){
				if(d!=null&&d!=""){
					if(d['total']==0){
						$CommonUI.alert("没有专家!");
					}else{
						$('#emp').show();
						$('#empid').combobox('loadData',d);
					}
				}
			},'json');
		
	/*	$CommonUI.getComboBox('#empid').combobox({  
		    url: $WEB_ROOT_PATH + '/empMgr/empMgrCtrl.htm?BLHMI=empListByOrgidAndEmptypeid&dto.emp.orgid='+orgid+'&dto.emp.empTypeid='+empTypeid+'&dto.emp.empTitleid='+registTypeid,  
		    valueField:'empid',  
		    textField:'empname'
		});  */
	}
	if(registTypeid=='02'){
		$('#emp').hide();
	}
}
function clearClick(){
	$CommonUI.getForm('#addItemForm').form('clear');
	$CommonUI.getComboBox('#orgid').combobox({disabled:false}); 
	$CommonUI.getComboBox('#dateTypeid').combobox({disabled:false}); 
	$CommonUI.getComboBox('#weekTypeid').combobox({disabled:false}); 
	$CommonUI.getComboBox('#registTypeid').combobox({disabled:false});
	$CommonUI.getComboBox('#empid').combobox({disabled:false});
}
function categoryReset(){
	$('#registTypeid').combobox('setValue',"");
	$('#emp').hide();
}
function editPrince(){
	var  registTypeid = $CommonUI.getComboBox('#registTypeid1').combobox('getValue');
	var itemSpec= $('#itemSpec').val();
	if((registTypeid==null||registTypeid=="")&&(itemSpec==null||itemSpec=="")){
		$.post($WEB_ROOT_PATH+"/tregisterplan/tregisterplanCtrl.htm?BLHMI=editPrince",{'dto.registerItem.registTypeid': registTypeid,'dto.dtOrdItem.itemSpec': itemSpec},
				function(d){
				if(d!=null&&d!=""){
					if(d['dto.total']=='0'){ $CommonUI.alert("设置成功!");}
					else{$CommonUI.alert("设置失败!");}
				}
			},'json');
	}
	else{
		$CommonUI.alert("请输入设置信息!");
	}
}
