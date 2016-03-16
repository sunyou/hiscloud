<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD H TML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>排班报表</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css"></style>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/scheduleReports/scheduleReports.js"></script>
</head>
<body style="overflow: hidden; background-color: white; height:500px" >
 
	 <div class="container-fluid">
		<div class="row-fluid">
			<div class="span12">
			<div class="thumbnail">
				<div id="toolbar">
				
		<div> 
			<input id="orgidHosp" type="hidden" class="validatebox" style="width: 90px;"/> 
		    <input id="orgnameHosp" type="hidden"	class="validatebox" style="width: 90px;" />
		</div>
				
				<form id="searchSch">
				选择日期:<input style="width: 90px" class="datebox" data-options="editable:false" id="selectDate"></input>&nbsp;&nbsp;&nbsp;
				科室:<select class="combobox" id="orgid" name="dto.scheduleReportsVo.orgid" style="width:90px;height: 25px;"
				data-options="editable:false">
					</select>&nbsp;&nbsp;&nbsp;
					<!-- <a href="javascript:searchSchedulereports()"   type="button" class="btn btn-info btn-sm">查询</a> -->
					<button onclick="javascript:searchSchedulereports()"   type="button" class="btn btn-primary btn-sm">查询</button>
				</form>
				
				</div>
				<div>
				
				<table style="width:100%; height: 70px; align:center;"  border="1"  id ="html">
					<tr hidden="true">
					<td>所属诊所：</td>
					<td><select id="orgidHosp" class="combobox" style="width: 118px;height:22px" name="dto.scheduleReportsVo.orgidHosp">
					</td>
					</tr>
				</table> 
				
				</div>
			</div>
			</div>
		</div>
	</div>
	<div id="mydatetime" style="display: none"></div>
</body>
</html>