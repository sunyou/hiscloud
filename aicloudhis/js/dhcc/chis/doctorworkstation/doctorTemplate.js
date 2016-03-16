//医嘱开立模板
var number;
$(function(){
	number=Math.floor(getIframeHeight()*0.65/25)-2;
	$CommonUI.getTree('#doctorTemplateTree').tree({
		url: $WEB_ROOT_PATH + '/clinicTemplate/getOrdTreeClinic.ajax?isForService='+true,
		lines: true,
		onClick : function(node) {
			if(node !=  undefined || node != null){
			    nodeParent = $CommonUI.getTree('#doctorTemplateTree').tree('getParent', node.target);
				nodeSelected = node;
				nodeId = node.id;
				nodeText = node.text;
				nodeGrade = node.attributes["grade"];
				nodeLeaf =  node.attributes["leaf"];
				nodeUpId =  node.attributes["upid"];
				nodeOrdgrdes = node.attributes["ordgrdes"];
				nodeGrpFlag = node.attributes["grpflag"];
				nodePrivtypeid = node.attributes["privtypeid"];
				if(nodeLeaf == "1" ){
					var url = $WEB_ROOT_PATH+"/clinicTemplate/queryTnOrdListClinic.ajax?nodeId=" + nodeId ;
					postReq(url, 
							"", 
							function(data){
						      	var itemJson="<table id=\"doctorTemplateTable\" border=\"1\">";
								for (var j=0;j<data.total;j++){
										if(j%2==0){
											if(j!=0){
												itemJson +="</tr>";
											}
											itemJson +="<tr>";
										}
										itemJson+="<td width=142 height=25>"+"<button type=\"button\" style=\"width:142px; height:23px;overflow:hidden \" align=\"center\" ordtype=\""+ data.rows[j].ordTypeid+"\" value=\""+data.rows[j].orddicname+"\" code=\""+data.rows[j].orddicid+"\">"+data.rows[j].orddicname+"</button>"+"</td>";
								}
								if(j%2==0){
									itemJson +="</tr>";
								}else{
									itemJson +="<td width=142 height=25></td></tr>";
								}
								j =  Math.ceil(j/2);
								if(j<number){
									for(;j<number;j++){
										itemJson +="<tr><td width=142 height=25></td><td width=142 height=25></td></tr>";
									}
								}
								itemJson +="</table>";
								$("#doctorTemplate").html(itemJson);
					        }, 
							function(data){
					        	$CommonUI.alert("查询当前分类下字典错误！" ,"error");
					    		return;
					        },
							{skipHidden:false}
					       );
				}
			}
		}
	});
	$("#doctorTemplate").live('click',function(e){
		if($(e.target).attr("code")==""||$(e.target).attr("code")==undefined||$(e.target).attr("code")==null){
			return;
		}
		if($(e.target).attr("value")==undefined||$(e.target).attr("value")==null||$(e.target).attr("value")==""){
			return;
		}
		document.getElementById('TreatFrame').contentWindow.addMyClass("body-mask");
		if($(e.target).attr("ordtype")=="00"){
			document.getElementById('TreatFrame').contentWindow.changeOrdTabs(0);
		}else if($(e.target).attr("ordtype")=="01"){
			document.getElementById('TreatFrame').contentWindow.changeOrdTabs(1);
		}else{
			document.getElementById('TreatFrame').contentWindow.changeOrdTabs(2);
		}
		var url=$WEB_ROOT_PATH+'/doctortemplate/templateClick.ajax';
		postReq(url,'',function(data){
			window.frames[0].respo(data);
		},'','',{"orddicid":$(e.target).attr("code"),"ordTypeid":$(e.target).attr("ordtype"),"orgidExec":$("#TreatFrame").contents().find("#cMedOrgidExec").val()});
	});
});
function showTemplate(){
	if($('#doctorTemplateDiv').css('display')=="none"){
		$('#doctorTemplateDiv').css('display','block');
    	$('#doctorTemplateDiv').css('z-index','10');
    	var url=$WEB_ROOT_PATH + "/doctortemplate/initDoctorTemplate.ajax";
    	postReq(url,"",function(data){
    		var itemJson="<table id=\"doctorTemplateTable\" border=\"1\">";
			for (var j=0;j<data.total;j++){
					if(j%2==0){
						if(j!=0){
							itemJson +="</tr>";
						}
						itemJson +="<tr>";
					}
					itemJson+="<td width=142 height=25>"+"<button type=\"button\"  style=\"width:140px; height:23px;overflow:hidden\" align=\"center\" ordtype=\""+ data.rows[j].ordTypeid+"\" value=\""+data.rows[j].orddicname+"\" code=\""+data.rows[j].orddicid+"\">"+data.rows[j].orddicname+"</button>"+"</td>";
			}
			if(j%2==0){
				itemJson +="</tr>";
			}else{
				itemJson +="<td width=142 height=25></td></tr>";
			}
			j =  Math.ceil(j/2);
			if(j<number){
				for(;j<number;j++){
					itemJson +="<tr><td width=142 height=25></td><td width=142 height=25></td></tr>";
				}
			}
			itemJson +="</table>";
			$("#doctorTemplate").html(itemJson);
    	});
    	return;
	}
	$('#doctorTemplateDiv').css('display','none');
	$('#doctorTemplateDiv').css('z-index','0');
}
function closeTemplate(){
	$('#doctorTemplateDiv').css('display','none');
	$('#doctorTemplateDiv').css('z-index','0');
}
