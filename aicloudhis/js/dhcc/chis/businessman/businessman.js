$(function () {
	// 获取datagrid的数据
	$CommonUI.getDataGrid('#show').datagrid({
	    url:  $WEB_ROOT_PATH+'/agencyManage/getBusinessmanList.ajax',
	    method:'post',
	    height:465,
	    striped: true,
	    fitColumns : true,
	    pageList: [15,20,50,100], 
	    columns:[[ 
  	    	{field : "ck1",checkbox : true,width : 40,align : 'center'},
	        {field:'entname',title:'企业信息名称',width:150,align:'center'},
	        {field:'contactor',title:'联系人',width:80,align:'center'},
	        {field:'phone',title:'企业电话',width:100,align:'center'},
	        {field:'entAddr',title:'企业地址',width:200,align:'center'},  
	        {field:'entZip',title:'企业邮编',width:150,align:'center'},
	        {field:'entFax',title:'企业传真',width:100,align:'center'},
	        {field:'isproducer',title:'生产厂商',width:83,align:'center',
	        	formatter: function(value,row,index){
	  		    	   if(value == 1){
	  		    		   return "是";
	  		    	   }else {
	  		    		   return "否";
	  		    	   }
	  		     }
	        },
	        {field:'issupplier',title:'供应厂商',width:83,align:'center',
	        	formatter: function(value,row,index){
	  		    	   if(value == 1){
	  		    		   return "是";
	  		    	   }else {
	  		    		   return "否";
	  		    	   }
  		       	}
	        },
	        {field:'isstop',title:'停用',width:49,align:'center',
	        	formatter: function(value,row,index){
	  		    	   if(value == 1){
	  		    		   return "是";
	  		    	   }else {
	  		    		   return "否";
	  		    	   }
		       	}
	        },
	        {field:'note',title:'备注',width:100,align:'center',hidden:true}
	    ]] 
	});
	
	// 条件查询弹窗提交按钮
	/*$("#selectBt").on('click', function() {
		 var json = $CommonUI.loopBlock('#selectForm');
		 $("#show").datagrid('load', json);
		 $CommonUI.getWindow('#selectWin').window('close');
	});*/
}); 

	//新增或修改数据成功处理
	function succ(data){
		$CommonUI.alert("厂商信息保存成功!");
		$("#show").datagrid('reload');
		$("#detailWin").window('close');
	}
	// 新增或修改数据失败处理
	function err(xhr,textStatus,errorThrown){
		$CommonUI.alert("厂商信息保存失败！");	
	}

	//取消
	function cancelClick() {
		$CommonUI.getWindow("#detailWin").window("close");
	}

	// 打开“新增用户”弹窗
	function addClick() {
		$('#judgeStop_name').attr("style","display:block;");
		$('#judgeStop_value').attr("style","display:none;");
		$('#detailWin').dialog('open').dialog('setTitle', '新增');
		//$('#entid').removeAttr("readonly");
		$CommonUI.getForm('#detail').form('clear');
		$('#flg').val(1);
		$('#isproducer_option').attr("selected","selected");
		$('#issupplier_option').attr("selected","selected");
		$('#isstop_option').attr("selected","selected");
	}
	
	// 查询
	function selectClick() {
		/*$("#selectWin").show();
		$('#selectWin').dialog('open').dialog('setTitle', '查询');
		$CommonUI.getWindow("#selectWin").window("center");
		$CommonUI.getWindow("#selectWin").window("open");*/
	    var json = $CommonUI.loopBlock('#selectForm');
	    $("#show").datagrid('load', json);
	}

	// 取消查询
	/*function selectCanBtClick() {
		$CommonUI.getWindow("#selectWin").window("close");
	}*/

	// 清除输入框内容
	function clear() {
		$("#detailWin input").val('');
		$("#selectForm input").val('');
	}
	
	// “删除”按钮事件
	function delRow() {
		if($CommonUI.getDataGrid("#show").datagrid('getSelections').length != 1){
			$CommonUI.alert('请选择一条数据删除!');
			return;
		}
		var row = $("#show").datagrid('getSelected');
		$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
			$.post($WEB_ROOT_PATH+"/agencyManage/deleteBusinessman.ajax",{'entid': row.entid},function(){
					$CommonUI.getDataGrid("#show").datagrid('reload');
			});
		});
	}
	
	//新增或修改数据
	function saveupdate() {
		var isValid = $CommonUI.getForm('#detail').form('validate');
		if (isValid){
			if(document.getElementById("isproducer").checked||document.getElementById("issupplier").checked){
				var patientTelephone = $("#phone").val();
				var phone=mobilePhoneCheck(patientTelephone);
				var phone1=fixedPhoneCheck(patientTelephone);
				//alert("移动电话："+phone+",座机："+phone1);
				if(!phone&&!phone1){
					$CommonUI.alert("请输入正确的移动电话");
				}else{
					if($('#flg').val()==1){
						postReq($WEB_ROOT_PATH
								+ '/agencyManage/saveBusinessman.ajax', '#detail',
								succ, err, {
									skipHidden : false,
							},
							{
								"businessman.isproducer":document.getElementById("isproducer").checked?"1":"0",
								"businessman.issupplier":document.getElementById("issupplier").checked?"1":"0",
								"businessman.isstop":document.getElementById("isstop").checked?"1":"0"
							});
					}else{
						postReq($WEB_ROOT_PATH
								+ '/agencyManage/saveBusinessman.ajax', '#detail',
								succ, err, {
									skipHidden : false,
							},
							{
								"businessman.isproducer":document.getElementById("isproducer").checked?"1":"0",
								"businessman.issupplier":document.getElementById("issupplier").checked?"1":"0",
								"businessman.isstop":document.getElementById("isstop").checked?"1":"0"
							});
					}
				}
			}else{
				$CommonUI.alert("请选择厂商类型！");
			}
		}
	}
	
	// 更新一条记录
	function editRow() {
		if($CommonUI.getDataGrid("#show").datagrid('getSelections').length != 1){
			$CommonUI.alert('请选择一条数据更新!');
			return;
		}
		$CommonUI.getForm('#detail').form('clear');
		$('#flg').val(0);
		var row = $("#show").datagrid('getSelected');
		var entid = row.entid;
		//alert(entid);
		var url = $WEB_ROOT_PATH+'/agencyManage/getBusinessmanListById.ajax?entid='+entid;
		
		$("#detailWin").show();
		$("#detailWin").window("open");
		$CommonUI.getWindow("#detailWin").window("setTitle", "更新用户信息");
		$.getJSON(url, function(data){
			/*d=data.rows;
			alert(d[0].entid);
			alert(d[0].isproducer);
			$("#entid").val(d[0].entid).attr("readonly","readonly");*/
			$CommonUI.fillBlock('#detailWin', data);
			if(data.businessman.isproducer=="1"){$("#isproducer").attr("checked",true);}
			if(data.businessman.issupplier=="1"){$("#issupplier").attr("checked",true);}
			if(data.businessman.isstop=="1"){$("#isstop").attr("checked",true);}
		});
	}
