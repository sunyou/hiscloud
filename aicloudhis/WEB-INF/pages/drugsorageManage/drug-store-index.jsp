<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

<html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>药品库存</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="/chis/css/style.css" />
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/drugstore/meStCur.js"></script>
</head>
<body>
	<div id="tb">
		<!-- <input type="checkbox" style=""/>药品批次查询&nbsp;&nbsp; -->
		<form id="selectForm">
			<!-- <span id="code" style="position:relative;top:2.5px;"></span> -->
			
			药品：<input id="name" class="validatebox" name="itemid" style="width: 120px" />&nbsp;
			
			生产厂商：
			
			
			<input	class="combobox" style="width: 150px" 	
										id="produce"
										name="entidProducer"
										data-options="
										url:'${ctx}/purchaseManage/businessmanCtrl.ajax?isproducer=1',
										mode:'remote',
										valueField:'entid',
										textField:'entname',
										pagination:false,
										panelHeight:'auto',
										panelWidth: 240
							">&nbsp;
			药品分类：<input id="category" class="combobox" style="width:90px;"
							data-options="
							url:'${ctx}/purchaseManage/cateList.ajax',
							mode:'remote',
							editable:false,
							valueField:'ordCateid',
							textField:'ordCatename',
							pagination:false,
							panelHeight:'auto'">&nbsp;
			科室：<select id="org" class="combobox" name="orgid" style="width:100px;"data-options="
							url: '${ctx}/purchaseManage/orgList.ajax',
							mode:'remote',
							editable:false,
							valueField:'orgid',
							textField:'orgname',
							pagination:false,
							panelHeight:'auto'">
				  </select>&nbsp;
		   	是否按批次：<input type="radio" id="1" name="radio" value="1"  />&nbsp;是&nbsp;
		             <input type="radio" id="2" name="radio" value="2" checked="checked" />&nbsp;否&nbsp; 
			<label id="bacth" style="display: none;">批次：<input id='number' class='validatebox' name='dto.meStCurListVo.batchcode' style="width: 120px" /></label>&nbsp;
			<a class="btn btn-success btn-sm" type="button" onclick="javascript:selectClick()" >查询</a>&nbsp;&nbsp;
		</form>
	</div>
	<table id="show">
	</table>
</body>
</html>
