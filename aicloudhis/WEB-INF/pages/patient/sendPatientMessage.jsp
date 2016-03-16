<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

 <html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>患者通知</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/patCon/sendPatientMessage.js"></script>    
</head>
<body>
  <input id="loginHosName" type="text" hidden="true" value="云诊所"/>
  <div id="tb" style="height: auto;">
               患者姓名
	     <select id="patientName" class="combogrid"  style="width:140px;" name="patientName"  
					       data-options="    
					           panelWidth:320, 
					           panelHeight:340,   
					           idField:'patientName',    
					           textField:'patientName',   
					           mode:'remote',
					           method:'post', 
					           pagination:true,
					           onClickRow:patientListClick, 
					           url:'${ctx}/patientMessage/getPatientList.ajax',    
					           columns:[[    
					               {field:'patientName',title:'患者名称',width:160},    
					               {field:'patientTelephone',title:'电话号码',width:130}  
					           ]]    
					       "></select>    
     <button onclick="javascript:findData()"  class="btn btn-primary btn-sm" 
                            type="button" style="height: 25px">&nbsp;查&nbsp;询&nbsp;</button>&nbsp;  
     <button onclick="javascript:sendMessage()"  class="btn btn-success btn-sm" 
                            type="button" style="height: 25px">发送消息</button>&nbsp;        
  </div>
  <table id="message"></table>
  <div id="messageDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#messageDlg-buttons'"
		style="width: 355px; height: auto; padding: 15px;top:50px;vertical-align:bottom;">
	<form id="messageForm" method="post">
	  <table> 
		<tr>
		  <td align="right">
		   <input id="name"  class="validatebox" type="text" style="width: 215px;height:25px;" readOnly="true"/> 
		   <input id="phone"  class="validatebox" type="text" style="display: none;"/> 
		   <input id="patientId"  class="validatebox" type="text" style="display: none;"/>
		   
		  </td>
		  <td align="right" style="width: 85px;height:25px;margin-top:2px;">
		   <button onclick="javascript:selectPatient()"  class="btn btn-primary btn-sm" 
                            type="button" style="width: 80px;height:25px;">选择患者</button>&nbsp;
          </td>
		</tr>
		<tr>
		  <td rowspan="5" align="right">
		    <textarea id="messageInfo" class="text" name="messageInfo"
		        style="width:215px;height:80px;max-width: 215px;max-height: 80px; min-width: 215px;min-height: 80px;font-size: 12px;">
		    </textarea>	
		  </td>
		  <td align="right" style="width: 85px;height:40px;padding-top:50px;">
		    <button onclick="javascript:sendData()"  class="btn btn-success btn-sm" id="send"
                            type="button" style="width: 85px;height:40px;">&nbsp;发&nbsp;送&nbsp;</button>&nbsp;
		  </td>
		</tr>
	   </table>
	</form>
  </div>
  <div id="patientDlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#patientDlg-buttons'"
		style="width: 500px; height: auto; padding: 10px;top:140px; ">
		<form id="patientForm" method="post"> 
		 
	      	       姓名 <input class="combobox" id="patientNameT" type="text" style="height: 25px; width: 100px; "
	      	               data-options="
							url:'${ctx}/patientMessage/getPatientList.ajax?page=1&rows=10',
							mode:'remote',
							editable:true,
							valueField:'patientid',
							onClickRow:patientListClickT, 
							textField:'patientName',
							pagination:false,
							panelHeight:'auto'">&nbsp;&nbsp;&nbsp;
	             <button onclick="javascript:findPatient()"  class="btn btn-primary btn-sm" type="button">&nbsp;查&nbsp;询&nbsp;</button>&nbsp;  
	         <!--    <button onclick="javascript:determinePatient()"  class="btn btn-success btn-sm" type="button">&nbsp;确&nbsp;定&nbsp;</button>&nbsp;  -->     
	             <table id="patientdg"></table> 
		</form> 
	</div>
</body>
</html>
