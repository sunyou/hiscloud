//主页面初始化
$(function(){
		var options = {toolbar : "#button",height : 465,width : '100%',singleSelect : true,pagination : true,rownumbers : false,fitColumns : true};
		var sortOpts = {remoteSort : false,sortName : '',sortOrder : 'asc'};
		var pageOpts = {pageNumber : 1,pageSize : 15};
		var columns = [[
		                {field:'ck1', checkbox:true},  
		                {field:'infotypeid',title:'类型',width:80,align:'center',formatter: function(value,row,index){
		                	if(value == 1){ 
		                		return "通知"; 
		                	}else if(value == 2){ 
		                		return "公告"; 
		                	}else if(value == 3){
		                		return "制度";
		                	}
			     	    }},
		     	        {field:'infotitle',title:'信息标题',width:350,align:'center'},  
		     	        {field:'createusername',title:'创建人',width:80,align:'center'}, 
		     	        {field:'createdate',title:'创建时间',width:100,align:'center'}, 
		     	        {field:'orgidHosp',title:'所属诊所',width:100,align:'center',formatter: function(value,row,index){
		     	        	var hospname = $('#hospname').val();
		     	        	return hospname;
			     	    }}, 
		     	        {field:'infostatue',title:'发布状态',width:80,align:'center',formatter: function(value,row,index){
		     	    	   if(value == 01){ return "已发布"; }else if(value == 00){ return "未发布"; }
		     	         }},
	     	    	    {field:"loadoperation",title:'附件',width:40,align:'center',formatter:function(value,row,index){
	     					var c = '<a href="#"  onclick="loadwindow(\''+row.infoid+'\')"><img src="'+$WEB_ROOT_PATH+'/images/fileopera.png"/></a> ';
	    					return c;
		    		    }},
		  		]];
		var queryParams = {page : 1,rows : 15,};
		var url = $WEB_ROOT_PATH+"/notice/getNoticeList2.ajax";
		$CommonUI.datagrid('#show', url, queryParams, columns, pageOpts, sortOpts,options);
		
		$CommonUI.getComboBox('#timeselect').combobox({  
		    onSelect: function(){
		    	var duration = $('#timeselect').combobox('getValue');
		    	$.post($WEB_ROOT_PATH + '/notice/noticeCtrl.htm?BLHMI=timeQuery',{'dto.Duration':duration},
		    			function(data){
		    				$CommonUI.getDataGrid('#show').datagrid('loadData',data);
		    			},'json');
				//Load and show the first page rows. If the 'param' is specified, it will replace with the queryParams property.
				//Usually do a query by passing some parameters, this method can be called to load new data from server. 
		    }
		});
});

/*创建弹出框*/
function addClick(){
	$CommonUI.getDialog("#newnotice").dialog("move", {"top":"50"});
	$('#newnotice').dialog('open').dialog('setTitle', '发布公告');
	$CommonUI.getForm('#noticeinfo').form('clear');
	document.getElementById("newinfostatue1").checked = "checked";
}

//删除通知
function delRow() {
	if ($CommonUI.getDataGrid("#show").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条通知删除!');
		return;
	}
	$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
		var row = $CommonUI.getDataGrid("#show").datagrid('getSelected');
		$.post($WEB_ROOT_PATH+"/notice/deleteNotice.ajax",{'infoid': row.infoid}, function(){
			$CommonUI.getDataGrid("#show").datagrid('reload');
		});
	});
}

//修改弹出框
function editRow() {
	if ($CommonUI.getDataGrid("#show").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条通知更新!');
		return; 
	}
	var row = $("#show").datagrid('getSelected');
	var infoid = row.infoid;
	var url = $WEB_ROOT_PATH+'/notice/findById.ajax?infoid='+infoid;
	$("#updatenotice").dialog("open");
	$CommonUI.getDialog("#updatenotice").dialog("setTitle", "更新通知");
	$.getJSON(url, function(data){
		$CommonUI.fillBlock('#updatenotice', data);
	});
}

/*新建保存*/
function save() {
	if($("#newnotice #infotypeid").val() == null || $("#newnotice #infotypeid").val() == ""){
		$CommonUI.alert("类型不能为空");
		return;
	}
	if($("#newnotice #infotitle").val() == ""){
		$CommonUI.alert("标题不能为空");
		return;
	}
	if($("#newnotice #infocontent").val() == ""){
		$CommonUI.alert("内容不能为空");
		return;
	}
	var isValid = $CommonUI.getForm('#noticeinfo').form('validate');
	if(isValid) {
	/*	var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		$('#createdate').val(year + "-" + month + "-" + day + hour+":"+minute+":"+second);*/
		postReq($WEB_ROOT_PATH+ '/notice/saveNotice.ajax', '#noticeinfo',
				successnew, err, {skipHidden : false,});
	}else {
		$CommonUI.alert("不能为空");
	}
}

/*更新(修改)保存*/
function update() {
	if($("#updatenotice #infotitle").val() == ""){
		$CommonUI.alert("标题不能为空");
		return;
	}
	if($("#updatenotice #infocontent").val() == ""){
		$CommonUI.alert("内容不能为空");
		return;
	}
	var isValid = $CommonUI.getForm('#noticeinfomodify').form('validate');
	if (isValid) {
		var infoid = $('#infoid').val();
		if(infoid != null && infoid != "" && infoid != undefined){
			postReq($WEB_ROOT_PATH + '/notice/saveNotice.ajax',"#noticeinfomodify",
					successupdate, err,{skipHidden:false});
		}else {
		$CommonUI.alert("不能为空");
		}
	}
}
//发布通知
function release() {
	if ($CommonUI.getDataGrid("#show").datagrid('getSelections').length != 1) {
		$CommonUI.alert('请选择一条通知发布!');
		return; 
	}
	if($("#show").datagrid('getSelected').infostatue == "01"){
		$CommonUI.alert('该信息已发布');
		return; 
	}
	$CommonUI.confirm('确定发布吗?','question','发布',function(){   
	        var row = $("#show").datagrid('getSelected');
	    	var infoid = row.infoid;
	    	var url = $WEB_ROOT_PATH+'/notice/releaseNotice.ajax';
	        postReq(url,'',successrelease, errrelease,'',{'infoid':infoid});
	},'取消','','请确认');
}

//上传(下载)附件窗口
function loadwindow(infoid) {
	$CommonUI.getDialog('#load').dialog({  
		onOpen:function(){
				$('#annexTable').find('tr').each(function () {
					if($(this).index() != 0){
						$(this).remove();
					}
				});
	    }
	});  
	$CommonUI.getDialog("#load").dialog("move", {"top" : "50"});
	$('#load').dialog('open').dialog('setTitle', '附件上传/下载');
	$CommonUI.getForm('#uploadFile').form('clear');	
	$('#singleFile0').css('display','none');
	$('#singleFileSize0').text(0);
	$('#annexQuantity').text(0);
	$('#annexsSize').text(0);
	$('#annexsSize').css('color','black');
	//页面初始化
	$CommonUI.getDataGrid('#downloadfile').datagrid({
		height: 190, 
		width: '100%', 
		singleSelect: true,
		fitColumns: true,
		autoRowHeight: true,
		pagination : true,
		scrollbarSize: 0,
		pageList: [5],
		pageOpts: {pageNumber : 1,pageSize : 5},
		queryParams: {"dto.infoidString":infoid},
		url : $WEB_ROOT_PATH+"/notice/noticeCtrl.htm?BLHMI=listAnnex",
		columns :[[
	                {field:'ck1', checkbox:true},  
	     	        /*{field:'noticeid', hidden:true}, */ 
	     	        {field:'annexname',title:'附件标题',width:80,align:'center'}, 
     	    	    {field:"downloadaction",title:'下载',width:20,align:'center',formatter:function(value,row,index){
     					var c = '<a href="#" onclick="downloadAttachment(\''+row.annexname+'\',\''+row.uuid+'\')">下载</a> ';
    					return c;
	    		    }},
	    		    {field:'deloperation',title:'操作',width:20,align:'center',formatter:function(value,row,index){
     					var c = '<a href="#"  onclick="delAnnex(\''+row.uuid+'\',\''+row.annexname+'\')">删除</a> ';
    					return c;
	    		    }}
	    		 ]]
	});
	$('#hiddenNoticeid').val(infoid);
}

//附件datagrid删除附件
function delAnnex(uuid, annexname) {
	$CommonUI.confirm('确定删除吗？', 'question', 0, function(){
		//var row = $CommonUI.getDataGrid("#downloadfile").datagrid('getSelected');
		$.post($WEB_ROOT_PATH+"/notice/noticeCtrl.htm?BLHMI=deleteAnnex",
				{'dto.releaseAnnex.uuid': uuid,'dto.releaseAnnex.annexname': annexname}, function(){
			$CommonUI.getDataGrid("#downloadfile").datagrid('reload');
		});
	});
}

//添加附件
function addAttachment() {
	var annexTable =document.getElementById("annexTable");
	var lastRowIndex = annexTable.rows.length-1;
	var lastfile = $('#file'+lastRowIndex).val();
	if(lastfile == '' || lastfile == undefined || lastfile == null){
		return;
	}
	if (annexTable.rows.length >= 6){
		$CommonUI.alert("单次上传附件不能超过6个！");
		return;
	}
    var newAnnex = annexTable.insertRow(-1);//在最上的位置
    var rows = annexTable.rows.length;
    newAnnex.id='tr'+rows;//新行添加后总行数是动态变化的，可以应用这一特点生成每一行的特定id
    //添加两列    
    var newAnnexTd0 = newAnnex.insertCell(-1);    
    var newAnnexTd1 = newAnnex.insertCell(-1);
    //设置列内容和属性    
    var num = rows-1;
    newAnnexTd0.innerHTML = '<input type="hidden" name="uploadFlg" id="uploadFlg" />'+'<input type="hidden" id="filename'+num+'" name="dto.fileNameList['+num+']" />'
    	+'<input type="file" id = "file'+num+'" name = "dto.uploadFileList['+num+']" style="width: 350px;" onchange="javascript:getName(this);" /> <span id="singleFile'+num+'" style="display: none;">附件大小：<span id="singleFileSize'+num+'">0</span> M</span>'; 
    newAnnexTd1.innerHTML= '<button onclick=\"removeAttachment(this);\" >删除</button>';
    newAnnexTd0.align="left";
    newAnnexTd1.align='center';
	
	/*var rowNum=$("#annexTable tr").length+1;
	var html = '<tr id="tr+'+rowNum+'">'; 
	html +=	$("#tr1").html();
	html += '</tr>';
    $("#annexTable").append(html);*/
}
//删除附件
function removeAttachment(obj){
	/* //获得表格对象
    var annexTable=document.getElementById('annexTable');
    //根据id获得将要删除行的对象
    var tr=document.getElementById('tr'+id);
    //取出行的索引，设置删除行的索引
    annexTable.deleteRow(tr.rowIndex);*/
	var index = $(obj).parent().parent().index();
	$(obj).parent().parent().remove();
    $('#annexTable').find('tr').each(function () {
    	if($(this).index() >= index){
    		var thisIndex = $(this).index(); 
    		$(this).attr('id','tr'+(thisIndex+1));
    		$('#filename'+(thisIndex+1)).attr('id','filename'+thisIndex);
    		$('#filename'+thisIndex).attr('name','dto.fileNameList['+thisIndex+']');
    		$('#file'+(thisIndex+1)).attr('id','file'+thisIndex);
    		$('#file'+thisIndex).attr('name','dto.uploadFileList['+thisIndex+']');
    		$('#singleFile'+(thisIndex+1)).attr('id','singleFile'+thisIndex);
    		$('#singleFileSize'+(thisIndex+1)).attr('id','singleFileSize'+thisIndex);
    	}
	});
    checkAnnex();
}

//批量上传
function uploadAttachment(){
	var length = document.getElementById("annexTable").rows.length;
//	获取有效附件个数（如果最后一个file控件没有添加附件，个数减一）
	var lastname = $('#file'+(length-1)).val();
	if(lastname == ''){
		length = length -1;
	}
//	获取附件总大小
	var annexSize = 0;
	for(var i=0; i<length; i++){
		var obj = document.getElementById("file"+i);
		annexSize += fileChange(obj);
	}
	if(annexSize > 2){
		alert('单次上传附件总大小不能超过2M！');
		return;
	}
	/*var name = $('#fileName').val();
	postReq($WEB_ROOT_PATH + '/notice/noticeCtrl.htm?BLHMI=batUpload','#uploadFile',uploadSuccess, uploadErr, ''
			);
	*/
	/*var ReleaseAnnexs = new Array();
	var releaseAnnexStr = "";
	var row = $("#show").datagrid('getSelected');
	var infoid = row.infoid;
	$('#annexTable').find('tr').each(function () {
	  if($(this).find('td').first().find('input').val() != ''){
		  var ReleaseAnnex = new Object();
		  ReleaseAnnex.annexname = $(this).find('td').first().find('input').val();
		  ReleaseAnnex.noticeid = infoid;
		  ReleaseAnnexs.push(ReleaseAnnex);
	  }
    });
	if(ReleaseAnnexs.length == 0){
		$CommonUI.alert("请选择一个文件上传！");
	}else{
		releaseAnnexStr = $.toJSON(ReleaseAnnexs);
		postReq($WEB_ROOT_PATH + '/notice/noticeCtrl.htm?BLHMI=batUpload','',uploadSuccess, uploadErr, '',
				{"dto.releaseAnnexStr":releaseAnnexStr});
		$CommonUI.getDataGrid("#downloadfile").datagrid('reload');
	}*/
	/* var fileName=$("#fileName").val();
	 if (fileName==""){
		alert("请选择上传文件！");
		return; 
	 }
	 */
	var flag=false;
	$('#annexTable').find('tr').each(function () {
		  if($(this).find('td').first().find('input').last().val() != ''){
			  flag = true;
		  }
    });
	
	//判断上传路劲是否存在
	$.get($WEB_ROOT_PATH + '/notice/noticeCtrl.htm?BLHMI=isExist', function(data){
		if (!flag){
			alert("请添加文件进行上传！");
			return;
		}
		if (data["dto.isExistFlag"] == "0"){
			$CommonUI.autoCloseCenterMessage('上传路径不存在','error','错误',3000);
			return;
		}
		//开始上传
		start();
		$("#load").css("pointer-events", "none"); 
		$CommonUI.getForm('#uploadFile').form('submit',{
			url : $WEB_ROOT_PATH + '/notice/noticeCtrl.htm?BLHMI=batUpload',
			onSubmit : function(){},
			success : function(strJson) {
				$('#p').progressbar('setValue', 100);
				$CommonUI.alert("上传成功");
				$("#load").css("pointer-events", "auto"); 
				$CommonUI.getDataGrid("#downloadfile").datagrid('reload');
				$('#annexTable').find('tr').each(function () {
					if($(this).index() != 0){
						$(this).remove();
					}else {
						//$(this).find('td').first().find('input').last().val('');
						$('#uploadFlg').val('');
						$('#filename0').val('');
						var obj = document.getElementById('file0');
					    obj.outerHTML=obj.outerHTML;
					    $('#singleFile0').css('display','none');
						$('#singleFileSize0').text(0);
						$('#annexQuantity').text(0);
						$('#annexsSize').text(0);
					}
				});
			}
		});
	},"json");
}

//进度条
function start(){
	$('#p').css('display','block');
	var value = $('#p').progressbar('getValue');
	if (value < 90){
		value += Math.floor(Math.random() * 10);
		$('#p').progressbar('setValue', value);
		setTimeout(arguments.callee, 1);
	}else if(value = 100){
		$('#p').progressbar('setValue', 0);
		$('#p').css('display','none');
	}
}

//下载附件
function downloadAttachment(annexname,uuid){

	window.location.href=$WEB_ROOT_PATH+"/notice/noticeCtrl.htm?BLHMI=downloadFile&dto.fileName="+encodeURI(encodeURI(annexname)+"&dto.uuid="+uuid);
}

/*查询*/
function selectClick() {
	var json = $CommonUI.loopBlock('#selectForm');
	$("#show").datagrid('load', json);
}

/*新增提示并重加载*/
function successnew(data) {
	$CommonUI.alert("新建成功");
	$("#show").datagrid('reload');
	$("#newnotice").dialog('close');
}

/*修改提示并重加载*/
function successupdate(data) {
	$CommonUI.alert("修改成功");
	$("#show").datagrid('reload');
	$("#updatenotice").dialog('close');
}

function successrelease(data) {
	$CommonUI.alert("发布成功");
	$("#show").datagrid('reload');
}

function errrelease(){
	$CommonUI.alert("发布失败");
}
function err(){
	$CommonUI.alert("保存数据失败");
}

function uploadSuccess(){
	$CommonUI.alert("上传成功");
}
function uploadErr(){
	$CommonUI.alert("上传失败");
}

/*取消新增按钮*/
function closeNewNotice(){
	 $('#newnotice').dialog('close');
}
/*取消修改按钮*/
function closeUpdateNotice(){
	 $('#updatenotice').dialog('close');
}

function getName(obj){
	var num = $(obj).prop('id').substring($(obj).prop('id').length-1);
	var name = $(obj).val().substring($(obj).val().lastIndexOf('\\')+1); //获取上传文件名(对应多浏览器)
	if(name.length > 255){
		$CommonUI.alert("文件名太长,请修改文件名后再上传！");
		//var bj = document.getElementById('file'+num) ;
	    obj.outerHTML=obj.outerHTML;
		return;
	}
	$("#uploadFlg").val("1"); 
	$('#filename'+num).val(name);
	$('#singleFile'+num).css('display','inline');
	$('#singleFileSize'+num).text(fileChange(obj).toFixed(4));
	checkAnnex();
}

var isIE = /msie/i.test(navigator.userAgent) && !window.opera;  
//检查当前file对象文件的大小，返回单位为M
function fileChange(target) { 
	var fileSize = 0;          
	if (isIE && !target.files) {      
		var filePath = target.value;      
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");         
		var file = fileSystem.GetFile (filePath);      
		fileSize = file.Size;     
	} else {     
		fileSize = target.files[0].size;      
	}    
	var size = fileSize / 1024 / 1024;     
	return size;
	/*if(size>2000){   
		$("#uploadFlg").val(""); 
		alert("附件不能大于2M"); 
		//$(target).val('');
		target.outerHTML=target.outerHTML;//清空当前file控件的值
		return;
	} else {
		getName(target);
		$("#uploadFlg").val("1"); 
	}*/
}

//检查附件总数和大小并显示
function checkAnnex(){
	var length = $('#annexTable tr').length;
	var lastname = $('#file'+(length-1)).val();
	if(lastname == ''){
		length = length -1;
	}
	var annexquantity = 0;
	var annexSize = 0;
	for(var i=0; i<length; i++){
		var obj = document.getElementById("file"+i);
		annexSize += fileChange(obj);
	}
	if(annexSize > 2){
		$('#annexsSize').css('color','red');
	}else{
		$('#annexsSize').css('color','black');
	}
	$('#annexQuantity').text(length);
	$('#annexsSize').text(annexSize.toFixed(4));
}
