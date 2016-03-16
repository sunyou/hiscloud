
$(function(){
	//noticeList();
	proclamationList();
});
//通知
function noticeList(){
	var PageNo=$("#curPage3").val();
	$.ajax({

         type: "post",
		 url: $WEB_ROOT_PATH+"/notice/getNoticeList.ajax",
		 data: {"infotypeid":1,"infostatue":"01","page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#notice_list').empty();   //清空resText里面的所有内容
                var html = '';
                var listdata=data.rows;
                var tempdate="";
                for(var i=0;i<listdata.length;i++){
                	 var datas = listdata[i];  
                    /*  alert(i);
                     alert(datas.patAddress);
                      */
                	 tempdate=datas.createdate;
                	 if (tempdate!='' && tempdate !=null){
                		 tempdate=tempdate.substring(0, 10);
                	 }
                     html = html+'<tr><td><a href="javaScript:void(0)" onclick="noticeInformation(\''+datas.infoid+'\')" >'+datas.infotitle+'</a></td>';
                     html+='<td>'+tempdate+'</td>';
                     html+=' </tr>';

                }
                //createTitle(2);
                $('#notice_list').html(html);
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus3').empty();   //清空resText里面的所有内容
				$('#page_plus3').html(pagePlus(PageNo,lastPage,5));
             }

     });
}

//公告
function proclamationList(){
	var PageNo=$("#curPage3").val();
	$.ajax({

         type: "post",         
		 url: $WEB_ROOT_PATH+"/notice/getNoticeList.ajax",
		 data: {"infotypeid":2,"infostatue":"01","page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#notice_list').empty();   //清空resText里面的所有内容
                var html = '';
                var listdata=data.rows;
                var tempdate="";
                for(var i=0;i<listdata.length;i++){
                	 var datas = listdata[i];  
                    /*  alert(i);
                     alert(datas.patAddress);
                      */
                	 tempdate=datas.createdate;
                	 if (tempdate!='' && tempdate !=null){
                		 tempdate=tempdate.substring(0, 10);
                	 }
                     html = html+'<tr><td><a href="javaScript:void(0)" onclick="noticeInformation(\''+datas.infoid+'\')" >'+datas.infotitle+'</a></td>';
                     html+='<td>'+tempdate+'</td>';
                     html+=' </tr>';

                }
                //createTitle(2);
                $('#notice_list').html(html);
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus3').empty();   //清空resText里面的所有内容
				$('#page_plus3').html(pagePlus(PageNo,lastPage,5));
             }

     });
}
//规章制度
function regulationsList(){
	var PageNo=$("#curPage3").val();
	$.ajax({

         type: "post",       
		 url: $WEB_ROOT_PATH+"/notice/getNoticeList.ajax",
		 data: {"infotypeid":3,"infostatue":"01","page":PageNo,"rows":PageSize},
         dataType: "json",
         success: function(data){
                $('#notice_list').empty();   //清空resText里面的所有内容
                var html = '';
                var listdata=data.rows;
                var tempdate="";
                for(var i=0;i<listdata.length;i++){
                	 var datas = listdata[i];  
                    /*  alert(i);
                     alert(datas.patAddress);
                      */
                	 tempdate=datas.createdate;
                	 if (tempdate!='' && tempdate !=null){
                		 tempdate=tempdate.substring(0, 10);
                	 }
                     html = html+'<tr><td><a href="javaScript:void(0)" onclick="noticeInformation(\''+datas.infoid+'\')" >'+datas.infotitle+'</a></td>';
                     html+='<td>'+tempdate+'</td>';
                     html+=' </tr>';

                }
                //createTitle(2);
                $('#notice_list').html(html);
                //翻页栏
				var total=data.total;
				var lastPage= Math.ceil(total/PageSize);
				
				$('#page_plus3').empty();   //清空resText里面的所有内容
				$('#page_plus3').html(pagePlus(PageNo,lastPage,5));
             }

     });
}

function noticeInformation(infoid){
	var url = $WEB_ROOT_PATH+'/notice/getNoticeById.ajax?infoid='+infoid;
	$("#newnotice").dialog("open");
	$.getJSON(url, function(data){
		$("#infotitle").val(data.rows[0].infotitle);
		$("#infocontent").val(data.rows[0].infocontent);
		$CommonUI.fillBlock('#newnotice', data);
	});
	
//	$CommonUI.getDataGrid('#downloadfile').datagrid({
//		height: 190, 
//		width: '100%', 
//		singleSelect: true,
//		fitColumns: false,
//		autoRowHeight: true,
//		pagination : true,
//		scrollbarSize: 0,
//		pageList: [5],
//		pageOpts: {pageNumber : 1,pageSize : 5},
//		queryParams: {"dto.infoidString":infoid},
//		url : $WEB_ROOT_PATH+"/notice/noticeCtrl.htm?BLHMI=listAnnex",
//		columns :[[
//	                {field:'ck1', checkbox:true},   
//	     	        {field:'annexname',title:'附件标题',width:260,align:'center'}, 
//     	    	    {field:"downloadaction",title:'下载',width:160,align:'center',formatter:function(value,row,index){
//     					var c = '<a href="#" onclick="downloadAttachment(\''+row.annexname+'\',\''+row.uuid+'\')">下载</a> ';
//    					return c;
//	    		    }}
//	    		    /*{field:'deloperation',title:'操作',width:120,align:'center',formatter:function(value,row,index){
//     					var c = '<a href="#"  onclick="delAnnex(\''+row.uuid+'\',\''+row.annexname+'\')">删除</a> ';
//    					return c;
//	    		    }}*/
//	    		 ]]
//	});
}
//下载附件
function downloadAttachment(annexname,uuid){

	window.location.href=$WEB_ROOT_PATH+"/notice/noticeCtrl.htm?BLHMI=downloadFile&dto.fileName="+encodeURI(encodeURI(annexname))+"&dto.uuid="+uuid;
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





