<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>药品出入库汇总查询</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/drugstore/storegather.js"></script>
</head> 
 <body style="overflow: hidden; width:1219px;font-size: 12px;">
	<div>
		
			<fieldset style="margin-top: 5px; margin-bottom: 10px; background-color: #FFFFFF;">
				<legend></legend>
				
					
						药品名称:<input id="itemname" type="text" placeholder="输入药品名称/助记符"
							style="width: 150px;" />
						科室:<select class="combobox" id="orgname"  name="orgidService" style="width:120px" data-options="
									url: '${ctx}/purchaseManage/orgList.ajax?grade=1',
									mode:'remote',
									editable:false,
									valueField:'orgid',
									textField:'orgname',
									pagination:false,
									panelHeight:'auto'">
									
								</select>
						<font style="font-family: '宋体', Simsun;">起始日期:</font><input id="startime" class="datebox" data-options="editable:false" style="width: 120px;" />
						<font style="font-family: '宋体', Simsun;">终止日期:</font><input id="endtime" class="datebox" data-options="editable:false" style="width: 120px;" />
						
						<a id="btn" href="javascript:nocheck()" type="button" class="btn btn-success btn-sm"><font style="color: white;">统计</font></a>
				
			</fieldset>
		
		<table id="bg"></table>  
		</div>
</body>
</html> 