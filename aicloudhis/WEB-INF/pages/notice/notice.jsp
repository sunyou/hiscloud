<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>



<!DOCTYPE html PUBLIC "-//W3C//DTD H TML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>通知公告</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/notice/notice.js"></script>
<style type="text/css">

</style>

</head>
<body>
<input id="hospname" type="hidden" value="云诊所"/>
<div id="button" >
	<form id="selectForm" method="post">
	        <span>标题关键字：</span><input class="validatebox" style="width:120px;height:18px;" type="text" name="infotitle" data-options="
	        required:false"/>
	        <!-- <select id="timeselect" class="combobox" name="time" panelHeight="100" style="width:80px;" editable="false">  
		    <option select="selected">时间查询</option>
		    <option value="1">最近一天</option>  
		    <option value="7">最近一周</option>  
		    <option value="30">最近一月</option>  
			</select> -->
			<span>创建日期:</span><input class="datebox" id="startDate" name="startDate" data-options="editable:false" style="height: 25px; width: 100px"><span>至</span><input class="datebox" id="endDate" name="endDate" data-options="editable:false" style="height: 25px; width: 100px">&nbsp;
            <select id=infotypeCheck class="combobox" panelHeight="100" style="width:80px;" name="infotypeid" editable="false">
            <option value="" select="selected">信息类型</option>
            <option value="1">通知</option>  
		    <option value="2">公告</option> 
		    <option value="3">制度</option> 
            </select>&nbsp;
          	<!-- <a class="linkbutton" data-options="iconCls:'chis-query'"  onclick="javascript:selectClick()">查询</a>
			<a class="linkbutton" data-options="iconCls:'chis-add'" onclick="javascript:addClick()">新建</a> 
			<a class="linkbutton" data-options="iconCls:'chis-edit'" onclick="javascript:editRow()">修改</a> 
			<a class="linkbutton" data-options="iconCls:'chis-wrong'" onclick="javascript:delRow()">删除</a> 
			<a class="linkbutton" data-options="iconCls:'chis-publish'" onclick="javascript:release()">发布</a>  --> 
			
			<!-- <a class="linkbutton" data-options="iconCls:'chis-query'" href="javascript:selectClick()">查询</a>
			<a class="linkbutton" data-options="iconCls:'chis-add'" href="javascript:addClick()">新建</a> 
			<a class="linkbutton" data-options="iconCls:'chis-edit'" href="javascript:editRow()">修改</a> 
			<a class="linkbutton" data-options="iconCls:'chis-wrong'" href="javascript:delRow()">删除</a> 
			<a class="linkbutton" data-options="iconCls:'chis-publish'" href="javascript:release()">发布</a>  --> 
			
			<button type="button" class="btn btn-primary btn-sm" onclick="javascript:selectClick()">查询</button>
			<button type="button" class="btn btn-info btn-sm" onclick="javascript:addClick()">新建</button>
			<button type="button" class="btn btn-warning btn-sm" onclick="javascript:editRow()">修改</button>
			<button type="button" class="btn btn-danger btn-sm" onclick="javascript:delRow()">删除</button>
			<button type="button" class="btn btn-success btn-sm" onclick="javascript:release()">发布</button>
			   
    </form>
</div>

<table id="show"> </table> 

<!-- 新建通知公告表单 -->
<div id=newnotice class="dialog" title="Modal Window"
			data-options="modal:true,closed:true"
			style="width: 600px; height: 450px;">
	<form id="noticeinfo" method="post" style="margin: 10px;">
	
	<table border=0 cellspacing="15" cellpadding=5 style="margin: 10px;">
	<tr>
	<td width="60px">
    <select id="infotypeid" name="releaseInfo.infotypeid">   
    <option value="1">通知</option>  
    <option value="2">公告</option>  
    <option value="3">制度</option>   
    </select> 
    </td>
    <td width="50px">信息标题</td>
    <td>
    <input id = "infotitle" class="validatebox" type="text" name="releaseInfo.infotitle" style="width:350px;" placeholder="请输入标题"/>
    </td>
    </tr>
	
	<tr>
	<td colspan="3">
	<textarea id="infocontent" name="releaseInfo.infocontent" style="resize:none; width: 530px; height: 280px;">
	</textarea><br/>
	</td>
	</tr>
	
	<tr>
	<td colspan="3">
	<input type="radio" checked="checked" id="newinfostatue1" name="releaseInfo.infostatue" value="00"/>
	未发布&nbsp;&nbsp;
	<input type="radio" name="releaseInfo.infostatue" value="01"/>已发布
	</td>
	</tr>	
	</table>
	
	<div align="center">
	<button id="submitBtn" type="button" class="btn btn-success btn-sm" onclick="javascript:save()">保存</button>
	<button id="cancelBtn" type="button" class="btn btn-danger btn-sm" onclick="javascript:closeNewNotice()">取消</button>
	<!-- <a id="submitBtn" class="linkbutton" data-options="iconCls:'chis-save'" href="javascript:save()">保存</a> 
	<a id="cancelBtn" class="linkbutton" data-options="iconCls:'chis-quit'" href="javascript:closeNewNotice()">取消</a> -->
	</div>
	
	</form>
</div>
 
<!-- 附件上传/下载表单 -->
<div id="load" class="dialog" title="Modal Window" style="width: 670px; height: 390px;" data-options="modal:true,closed:true">
 <table border="0" align="center" style="width: 625px;height: 340px;">
  <tr>
   <td>
	<div style="width:100%">
		<fieldset style="margin: 1px; padding: 10px;">
			<legend>上传附件</legend>
			<div id="p" class="progressbar" style="width: 600px;height: 20px;display: none;" ></div>
			<div id="div">
			<form id="uploadFile" method="post" enctype="multipart/form-data">
			<table id = "annexTools" width="100%" border="0" align="center" style="padding-left: 10;margin-left: 10">
			<tr>
			<!-- <td><a id="addAttachment" class="linkbutton"  style = "display:block; text-align:center;" data-options="iconCls:'chis-add'" href="javascript:addAttachment()">添加附件</a></td>
			<td><a id="uploadAttachment" class="linkbutton" style = "display:block; text-align:center;" data-options="iconCls:'chis-export'" href="javascript:uploadAttachment()">批量上传</a></td> -->
			<td><a id="addAttachment" class="btn btn-warning" href="javascript:void(0)" role="button" style = "display:block; text-align:center;" onclick="javascript:addAttachment()">添加附件</a></td>
			<td><a id="uploadAttachment"  class="btn btn-success" href="javascript:void(0)" role="button" style = "display:block; text-align:center;" onclick="javascript:uploadAttachment()">批量上传</a></td>
			</tr>
			</table>
			<table id="annexTable" border="0" align="center" style="padding-left: 10px;width: 600px;">
			  <tr id="tr1">
			    <td align="left" colspan="2" style="width: 140px;">  
				    <input type="hidden" id="hiddenNoticeid" name="noticeid" />
				    <input type="hidden" name="uploadFlg" id="uploadFlg" />
				    <input type="hidden" id="filename0" name="fileNameList[0]" />
				    <input type="file" id ="file0" name ="uploadFileList[0]" onchange="javascript:getName(this);" style="width: 350px;"/> <span id="singleFile0" style="display: none;">附件大小：<span id="singleFileSize0">0</span> M</span>
			    </td>
			  </tr>
			</table>
			</form>
			共 <span id="annexQuantity">0</span> 个附件，总大小 <span id="annexsSize">0</span> M。（附件总大小不能超过2M）
			</div>
		</filedset>
	</div>
	</td>
	</tr>
	<tr>
	<td>
	<div style="width:100%">
		<fieldset style="margin: 1px;">
			<legend>下载附件</legend>
			<div>
			<table id = "downloadfile"></table>	
			</div>
		</filedset>
	</div>

   </td>
  </tr>
 </table>
</div>


<!-- 修改通知公告表单 -->
<div id="updatenotice" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true"
			style="width: 600px; height: 450px;">
	<form id="noticeinfomodify" method="post" style="margin: 10px;">
	<input id="infoid" type="text" hidden="true" name="releaseInfo.infoid"/>
	
	<input id="createuserid" type="text" hidden="true" name="releaseInfo.createuserid"/>
	<input id="createusername" type="text" hidden="true" name="releaseInfo.createusername"/>
	<input id="orgId_hosp" type="text" hidden="true" name="releaseInfo.orgidHosp"/>
	
	<table cellspacing="15" cellpadding=5 style="margin: 10px;">
	
	<tr>
	<td width="60px">
    <select id="infotypeid" name="releaseInfo.infotypeid">   
    <option value="1">通知</option>  
    <option value="2">公告</option>  
    <option value="3">制度</option>   
    </select> 
    </td>
    <td width="50px">信息标题</td>
    <td>
    <input id ="infotitle" class="validatebox" type="text" name="releaseInfo.infotitle" style="width:350px;" placeholder="请输入标题"/>
    </td>
    </tr>
	
	<tr>
	<td colspan="3">
	<textarea id="infocontent" name="releaseInfo.infocontent" style="resize:none; width: 530px; height: 280px;">
	</textarea><br/>
	</td>
	</tr>
	
	<tr>
	<td colspan="3">
	<input id="infostatue"  type="radio" name="releaseInfo.infostatue" value="00"/>
	未发布&nbsp;&nbsp;
	<input type="radio" name="releaseInfo.infostatue" value="01"/>已发布
	</td>
	</tr>
		
	</table>
	
	<div align="center">
	<button id="submitBtn" type="button" class="btn btn-success btn-sm" onclick="javascript:update()">保存</button>
	<button id="cancelBtn" type="button" class="btn btn-danger btn-sm" onclick="javascript:closeUpdateNotice()">取消</button>
	<!-- <a id="submitBtn" class="linkbutton" data-options="iconCls:'chis-save'" href="javascript:update()">保存</a> 
	<a id="cancelBtn" class="linkbutton" data-options="iconCls:'chis-quit'" href="javascript:closeUpdateNotice()">取消</a> -->
	</div>
	
	</form>
</div>
</body>
</html>