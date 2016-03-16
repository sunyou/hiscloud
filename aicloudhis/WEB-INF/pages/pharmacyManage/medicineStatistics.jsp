<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>药房统计</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/pharmacy/medicineStatistics.js"></script>
</head>

<body style="overflow: hidden">
<input type="text" id="printFlag" hidden="true" value=0>
 <!--   <table border=0  style="height: 335px;width: 100%">
   <tr>
     <td>
       <div id="statistics">
	                 <!--  <form id="selectForm" method="post">  </form>              
                                                            起始时间：<input class="datebox" id="preTime" style="width:100px;height:20px">     
                                                            终止时间： <input class="datebox" id="endTime" style="width:100px;height:20px"> 
           <a class="linkbutton" data-options="iconCls:'icon-search'" onclick="javascript:selectClick()">查询</a> 
           <a id="printBtn" href="#" target="_blank" class="linkbutton"  onclick='print();'>打印当前页</a>  
       </div>   
       <div>
		  <fieldset style="margin: 0px; padding: 0px 10px 3px 10px;">
		      <legend>药房发药统计</legend>
			   <div style="border: 1px solid #D4D4D4">
					<table id="show"></table>
			   </div>
		  </filedset>
       </div>
     </td>
   </tr> 
 </table>-->
     <div id="statistics">
		<form id="aa">
			  起始时间：<input class="datebox" id="preTime" style="width:100px;height:25px" data-options="editable:false">     
                                      终止时间： <input class="datebox" id="endTime" style="width:100px;height:25px" data-options="editable:false">&nbsp;&nbsp;&nbsp;
                                      发药<input   type="radio" style="width: 30px;height:15px;" name="radio" value="1">
		              退药<input   type="radio" style="width: 30px;height:15px;" name="radio" value="0">&nbsp;&nbsp;                          
            <!--<a class="linkbutton" data-options="iconCls:'chis-query'" onclick="javascript:selectClick()">查询</a>&nbsp; 
            <a id="printBtn" href="#" target="_blank" data-options="iconCls:'chis-print'" 
                                                                  class="linkbutton" onclick='print();'>打印当前页</a>    
              -->  
           <button class="btn btn-primary btn-sm" type="button" onclick="javascript:selectClick()">查&nbsp;询</button>&nbsp; 
           <button id="printBtn" href="#" target="_blank" type="button" 
                                                       class="btn btn-info btn-sm" onclick='print();'>打印当前页</button>                                                                               
		</form>
	</div>
	<table id="show"></table>
</body>
</html>