<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>个人信息</title> 

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/PYjm.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/personTreatmentMgr.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/treatmentMgr.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/medicalRecord.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/diagnosis.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/treatedRecord.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/outpMedRecords.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/returnVisitBook.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/prescription.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/doctorworkstation/corner.js"></script>
<style type="text/css">
.pagination span {
    font-size: 11px;
}
</style> 
</head>
<body>
	<div id="infomsg" style="font-size:15px;display:block;background:white;margin-left: 3px;">
		<fieldset>
			<legend>患者信息</legend>
			<div id="basicInfo">
				<input id="hiddenadmisSerialno" type="hidden" value=""/>
				<input id="hiddenserialno" type="hidden" value=""/>
				<input id="hiddenpatientId" type="hidden" value=""/>
				姓名：<span id="nameSpan" style="font-weight: bold;color: blue;"> </span>
				性别：<span id="sexSpan" style="font-weight: bold;color: blue;"> </span>
				年龄：<span id="ageSpan" style="font-weight: bold;color: blue;"> </span>
				移动电话：<span id="phoneSpan" style="font-weight: bold;color: blue;"> </span>
				患者身份：<span id="patientIdentitynameSpan" style="font-weight: bold;color: blue;"> </span>
				<!-- 诊断：<span id="diagnosesSpan" style="font-weight: bold;color: blue;"> </span> -->
			</div>
			<div style="position: absolute; right: 2px;top: 12px;float: right">
				<a href="javascript:loadPatientDetailInfo()" id="unfoldOrFold" style="display: none">详细信息</a>
				<a href="javascript:openDetailsDlg()" id="openDetailsDlg" style="display: none">历次就诊</a>
				
			</div>
		</fieldset>
	</div>
	<div id="tabsResize" class="tabs" style="position:relative; margin: 2px 0 0 5px;" data-options="onSelect:tabsResizeOnSelect,fit:true">
		<button type="button" id="sendToFee" class="btn btn-success btn-sm" style="position: absolute; right: 7px;top: 2px;float: right"> 发送至收费室 </button>
		<button type="button" id="saveBtn" class="btn btn-warning btn-sm" style="position: absolute; right: 110px;top: 2px;float: right"> 保存病历 </button>
		<button type="button" id="saveTemplate" class="btn btn-info btn-sm" style="position: absolute; right: 189px;top: 2px;float: right"> 收藏为病历模板 </button>
		<button type="button" id="importTemplate" class="btn btn-primary btn-sm" style="position: absolute; right: 304px;top: 2px;float: right">模 板</button>
		<!-- <a href="javascript:void(0)"  class="linkbutton" style="position: absolute; right: 7px;top: 2px;float: right" data-options="iconCls:'chis-send'" style="float: right">发送至收费室</a> 
		<a href="javascript:void(0)" id="saveBtn" class="linkbutton" style="position: absolute; right: 137px;top: 2px;float: right" data-options="iconCls:'chis-check'" style="float: right">审核</a> 
		<a href="javascript:void(0)" id="saveTemplate" class="linkbutton" style="position: absolute; right: 219px;top: 2px;float: right" data-options="iconCls:'chis-import'" style="float: right">收藏为病历模板</a> 
		<a href="javascript:importTemplate()" class="linkbutton" style="position: absolute; right: 360px;top: 2px;float: right" data-options="iconCls:'chis-template'" style="float: right">模板</a> -->
		<div  title="门诊病历" style="padding: 0; margin: 0" data-options="fit:true">
		  <form id="appendInfoForm" method="post">
			<div id="complainedAndcurrentDiseasesDiv" style="margin:10 0 10 10;height: 100px;">
				<div id="hiddenuid" style="display:none;"></div>
				<div id="hiddenadmisSerialnos" style="display:none;"></div>
				<div id="hiddenserialnos" style="display:none;"></div>
				<div id="complained1" style="width:48%;float:left;padding-right:4px;margin-left:10px;" data-options="fit:true">
					<div style="height:25px;">
						<label style="font-size:18px;font-weight:bold">主诉:</label>
					</div>
					<div>
						<textarea id="patientComplaint" name='appendInfoList[0].appendContent' value='' style='width:100%;height:80px; font-size: 12px;' onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.substr(0, 245)} else {alert('请先接诊一个患者'); this.value=''}"></textarea>
					</div>
				</div>
				<div id="currentDiseases" style="width:49%;float:left;padding-left:4px;" data-options="fit:true">
					<div style="height:25px;">
						<label style="font-size:18px;font-weight:bold">现病史:</label>
					</div>
					<div>
						<textarea id="patientHistory" name='appendInfoList[1].appendContent' value='' style="width:100%;height:80px; font-size: 12px;" onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.substr(0, 245)} else {alert('请先接诊一个患者'); this.value=''}"></textarea>
					</div>
				</div>
			</div>
			<fieldset id="physicalDiv" style="margin: 10px 5px 10px 10px;height: 80px;">
				<legend>体格检查</legend>
				<div style="height:30px">
					<div style="float:left;width:120px;height:30px">	
						<lable>体温:</lable>&nbsp;
						<input id="patientTemperature" style="border:none;border-bottom:1px solid black;width: 40px; font-size: 12px;" type="text" name="appendInfoList[2].appendContent"
							onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){if(this.value.indexOf('.')!=-1){this.value=this.value.replace(/[^\d.]/g,'').substr(0, this.value.indexOf('.')+2)}else{this.value=this.value.replace(/[^\d.]/g,'').substr(0, 2)}}else{alert('请先接诊一个患者'); this.value=''}"/><lable>(℃)</div>
					<div style="float:left;width:140px;height:30px">	
						<lable>心率:</lable>&nbsp;
						<input id="patientHeartRate" style="border:none;border-bottom:1px solid black;width: 40px; font-size: 12px;" type="text" name="appendInfoList[3].appendContent"
						onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.replace(/\D/g,'').substr(0,3)}else{alert('请先接诊一个患者'); this.value=''}"/><lable> 次/分</div>
					<div style="float:left;width:130px;height:30px; font-size: 12px;">	
						<lable>心律:</lable>
						<select id="patientRhythm" name="appendInfoList[6].appendContent">
							<option value="01">心律齐</option>
							<option value="02">心律不齐</option>
							<option value="03">绝对不齐</option>
						</select>
						<!-- <input id="patientRhythm" class="combobox" name="appendInfoList[4].appendContent" readonly="true" data-options="width:60, valueField:'id',textField:'text',data:[{id: '1',text: '心律齐'},{id: '2',text: '心律不齐'},{id: '3',text: '绝对不齐'}]" /> -->
					</div>
					<div style="float:left;width:120px;height:30px">低压/高压:&nbsp;
						<input id="patientDBP" style="border:none;border-bottom:1px solid black;width: 40px" type="text" style="width: 40px" name="appendInfoList[5].appendContent"
						onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.replace(/[^\d.]/g,'').substr(0, 3)}else{alert('请先接诊一个患者'); this.value=''}"/></div>
					<div style="float:left;width:120px;height:30px">/
						<input id="patientSBP" style="border:none;border-bottom:1px solid black;width: 40px" type="text" style="width: 40px" name="appendInfoList[4].appendContent"
						onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.replace(/[^\d.]/g,'').substr(0, 3)}else{alert('请先接诊一个患者'); this.value=''}"/>mmHg</div>
					<div style="float:left;height:30px">
						<lable>其他:</lable>
						<textarea id="other" name="appendInfoList[7].appendContent" style="width:730px;height:30px; font-size: 12px;" onkeyup="if($('#hiddenpatientId').val()!=null&&$('#hiddenpatientId').val()!=''){this.value=this.value.substr(0, 245)} else {alert('请先接诊一个患者'); this.value=''}"></textarea>
					</div>
				</div>
			</fieldset>	
			<div id="diagnosisDiv" style="height:180px;padding:1px;margin: 10px 5px 10px 10px;">
				<div style="position:relative;height:25px; font-size: 12px;">
					<label style="font-size:18px;font-weight:bold">诊断:</label>
					<label><input style="height:12px" name="selectDiagnosis" type="radio" value="00" checked="true"/>西医 </label> 
					<label><input style="height:12px" name="selectDiagnosis" type="radio" value="01" />中医 </label>
					<div style="position: absolute; right: 0;top: 0px;float: right">
						<!-- <a href='#' id="diagnosisSaveBtn" class="linkbutton" style="float: right" onclick="diagnosissave()" >保存</a> -->
				    	<!-- <a href='#' id="diagnosisAddBtn" class="linkbutton" data-options="iconCls:'chis-add'" style="float: right" onclick="diagnosisadd()" >增加</a>
						<a href='#' style="float: right" class="linkbutton" data-options="iconCls:'chis-template'" onclick="diagimportTemplate()">常用诊断</a> -->
						<button onclick="diagnosisadd()" type="button" class="btn btn-success btn-sm" style="float: right;">增 加</button>
						<button onclick="diagimportTemplate()" type="button" class="btn btn-primary btn-sm" style="float: right;margin-right:6px"> 常用诊断 </button>
					</div>
 				</div>
				<div>
					 <table id="diagnosisGrid">
					 </table>
				</div>
				<div style="float:left;height:30px; margin-top: 5px;">
					<!-- <label style="font-size:18px;font-weight:bold">回访:</label>
					<br> -->
					复诊：<input type="checkbox" id="referral" name='appendInfoList[8].appendContent'/>
					下次随访日期:<input class="datebox" id="returnVisitDate" style="height: 25px; width: 90px">
					<!-- <a href="javascript:returnTreat()" style="align: inline;">确定</a> -->
				</div>
				<div id="diagimpTemplateDlg" class="dialog" title="诊断模板" data-options="closed:true" style="width:730px;height:430px;padding:10px">
					别名检索:<input id="diagtemplatesearch" type="text" style="width: 150px;"  /> 
					<!-- <a href="javascript:void(0)" id="diagtemsearchBtn" class="linkbutton" data-options="iconCls:'chis-query'" style="" onclick="diagsearch()">查询</a>
		  	      	<a href="javascript:void(0)" id="diagtemconfirmBtn" class="linkbutton" data-options="iconCls:'chis-confirm'"  style="" onclick="diagQuoteconfirm()">确定</a>
					<a href="javascript:void(0)" id="diagtemcloseBtn" class="linkbutton" data-options="iconCls:'chis-close'" style="" onclick="diagtemclose()">关闭</a> -->
					<button type="button" class="btn btn-primary btn-sm" onclick="diagsearch()">查 询</button>
					<button type="button" class="btn btn-success btn-sm" onclick="diagQuoteconfirm()">确 定</button>
					<button type="button" class="btn btn-danger btn-sm" onclick="diagtemclose()">关 闭</button>
               		<table class="datagrid" id="diagTemplateGrid" data-options="onDblClickRow:diagTemplateGridClick,singleSelect:true," style="width:700px;height:350px;">
                		<thead>
                			<tr>
                  				<th data-options="field:'sortno',width:100,align:'center'">排序号</th>
                  				<th data-options="field:'orgid',width:190,align:'center',hidden:true">所属科室</th>
                  				<th data-options="field:'diagid',width:190,align:'center'">诊断编码</th>
                  				<th data-options="field:'diagname',width:190,align:'center'">诊断名称</th>
                  				<th data-options="field:'diagaliases',width:190,align:'center'">诊断别名</th>
                  				<!-- <th data-options="field:'inputstr',width:180,align:'center'">助记符</th> -->
                  				<th data-options="field:'diagTypeid',width:160,align:'center',hidden:true">诊断类型编码</th>
                  				<input type="hidden" id="loginLocId" value="${empBean.orgid}">
                  				<input type="hidden" id="orgidHosp" value="${empBean.orgidHosp}">
                  				<input type="hidden" id="loginId" value="${empBean.empid}">
                  				<input type="hidden" id="loginLocName" value="${empBean.orgname}">
                  				<input type="hidden" id="loginName" value="${empBean.empName}">
                			</tr>
                		</thead>
                	</table>
 				</div>
			</div>
	    </form>
		</div>
		<div title="医嘱录入" style="width: 100%; padding: 0; margin: 0" >
			<div id="historyOrderDiv" style="width: 100%; padding: 0; margin: 0" >
				<table id="historyOrder"></table>
			</div>
			<div id="tabsOrderDiv" style="width: 100%; padding: 0; margin: 0" >														  
				<div id="tabsOrder" class="tabs"  data-options="fit:true,onSelect:tabsOrderOnSelect" style="position:relative;width:100%">
					<lable style="position: absolute; right: 7px;top: 5px;text-align:center;width:40px;height:25px;line-height:25px;">未收费</lable>
					<lable style="position: absolute; right: 47px;top: 5px;background-color:#EC971F;width:25px;height:25px;"></lable>
					<lable style="position: absolute; right: 77px;top: 5px;text-align:center;width:40px;height:25px;line-height:25px;">新医嘱</lable>
					<lable style="position: absolute; right: 117px;top: 5px;background-color:#5BC0DE;width:25px;height:25px;"></lable>
					<lable style="position: absolute; right: 148px;top: 5px;text-align:center;width:40px;height:25px;line-height:25px;">已收费</lable>
					<lable style="position: absolute; right: 188px;top: 5px;background-color:#d3d3d3;width:25px;height:25px;"></lable>
					<div title="医嘱录入" id="westernMedicineDiv">
						<input id="WMedordid" name="tord.ordid" type="hidden">
						<input id="deleteUuid" name="deleteUuid" type="hidden">
						<table  id="doctorOrdersGrid1"></table>
						<div style="float:right; margin:2px 5px 0 0">
							本次医嘱总价格:<input id="totalPrice" readonly="readonly" style="width:80px">元</input>
						</div>
					</div>
					<div title="中草药医嘱" style="padding: 0; margin: 3px">
						<div id="chinaMedicineDiv">
							<input id="cMedordid" name="tord.ordid" type="hidden">
							<fieldset style="height: 30px;width:97%">
								<legend>中医用法</legend>
									<label for="cMedTQ">付数:</label>
										<input id="cMedTQ" class="combobox" name="tord.timesQuantity" data-options="onSelect:cMedTQOnSelect,width:60, valueField:'value',textField:'description',mode:'remote',url:'${ctx}/dict/getDictContentList.ajax?dictName=cMedTQ',panelHeight:'auto'" />
									<label for="cMedUsage">用法:</label>
										<input id="cMedUsagename" class="combobox" name="dto.usagename" data-options="onSelect:cMedUsagenameOnSelect,width:60, valueField:'value',textField:'description',mode:'remote',url:'${ctx}/dict/getDictContentList.ajax?dictName=cMedUsage',panelHeight:'auto'" />
										<input id="cMedUsageid"  type=hidden name="dto.usageid"  />
									<label for="cMedFrequency">频次:</label>
										<input id="cMedFrequency" class="combobox" name="dto.frequency" data-options="width:120, valueField:'value',textField:'description',mode:'remote',url:'${ctx}/dict/getDictContentList.ajax?dictName=cMedFrequency',panelHeight:'auto'" />
									<label for="name">接收科室:</label>
										<input id="cMedOrgnameExec" class="combobox" name="dto.orgnameExec" data-options="onSelect:cMedOrgnameExecOnSelect,width:100, valueField:'orgnameExec',textField:'orgnameExec',mode:'remote',url:'${ctx}/chineseMedicine/findOrgidExec.ajax',panelHeight:'auto'" />
										<input id="cMedOrgidExec"  type=hidden name="dto.orgidExec"  />
									<label>备注:</label> <input id="CMnote" style="" type="text" name="tord.note" />
									<label>总金额(￥):</label>&nbsp;<label id="totalPriceCM">0.0</label>
							</fieldset>
						</div>
						<div style="margin-top:2px">
							<table class="datagrid"
								data-options="toolbar:chinaMedicineGridToolbar,height:195,fitColumns:true,singleSelect: true"
								id="chinaMedicineGrid">
								<thead>
									<tr>
										<th data-options="field:'chinaMedicine1',width:120,align:'center',editor:{type:'combobox',options:{onSelect:chinaMedicine1OnSelect,mode:'remote',valueField:'itemname',textField:'itemname', url: '${ctx}/chineseMedicine/searchItem.ajax'}}">名称</th>
										<th data-options="field:'chinaMedicine2',width:60,align:'center',editor:{type:'numberbox',options:{onChange:changeTotalPrice}}">重量(g)</th>
										<th data-options="field:'chinaMedicine3',width:120,align:'center',editor:{type:'combobox',options:{onSelect:chinaMedicine3OnSelect,mode:'remote',valueField:'itemname',textField:'itemname', url: '${ctx}/chineseMedicine/searchItem.ajax'}}">名称</th>
										<th data-options="field:'chinaMedicine4',width:60,align:'center',editor:{type:'numberbox',options:{onChange:changeTotalPrice}}">重量(g)</th>
										<th data-options="field:'chinaMedicine5',width:120,align:'center',editor:{type:'combobox',options:{onSelect:chinaMedicine5OnSelect,mode:'remote',valueField:'itemname',textField:'itemname', url: '${ctx}/chineseMedicine/searchItem.ajax'}}">名称</th>
										<th data-options="field:'chinaMedicine6',width:60,align:'center',editor:{type:'numberbox',options:{onChange:changeTotalPrice}}">重量(g)</th>
										<th data-options="field:'chinaMedicine7',width:120,align:'center',editor:{type:'combobox',options:{onSelect:chinaMedicine7OnSelect,mode:'remote',valueField:'itemname',textField:'itemname', url: '${ctx}/chineseMedicine/searchItem.ajax'}}">名称</th>
										<th data-options="field:'chinaMedicine8',width:60,align:'center',editor:{type:'numberbox',options:{onChange:changeTotalPrice}}">重量(g)</th>
										<th data-options="field:'chinaMedicine11',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine13',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine15',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine17',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine21',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine23',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine25',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
										<th data-options="field:'chinaMedicine27',hidden:true,width:20,align:'center',editor:{type:'text'}"></th>
									</tr>
								</thead>
							</table>
						</div>
						
					</div>
					<div title="检验检查"  style="padding: 0; margin: 3px">
						<table class="datagrid" data-options="onAfterEdit:inspectionGridOnAfterEdit,toolbar:inspectionGridToolbar,height:230,fitColumns:true,singleSelect: true" id="inspectionGrid">
							<thead>
								<tr>
									<th data-options="field:'orddicid',hidden:true,width:80,editor:{type:'text'}">医嘱套编码</th>
									<th data-options="field:'ordid',hidden:true,width:80,editor:{type:'text'}">医嘱编码</th>
									<th data-options="field:'ordTypeid',hidden:true,width:80,editor:{type:'text'}">医嘱类型编码</th>
									<th data-options="field:'applyid',hidden:true,width:80,editor:{type:'text'}">医嘱申请单编码</th>
									<th data-options="field:'ordTypename',width:80,align:'center',editor:{id:'ordTypeCombobox',type:'combobox',options:{valueField:'text',textField:'text',data:[{id:'检验',text:'检验'},{id:'检查',text:'检查'},{id:'治疗',text:'治疗'}]}}">类型</th>
									<th data-options="field:'ordName',width:120,align:'center',editor:{type:'combogrid',id:'inspectionGridDetailed',options:{hasDownArrow:false,pagination: true,onClickRow:inspectionRowClick,url: '${ctx}/inspection/knOrdlist.ajax',idField: 'orddicname',textField: 'orddicname',method:'post',mode:'remote',fitColumns:true,editable:true,panelWidth: 600,panelHeight: 160,columns: [[{field:'orddicid',title:'医嘱套编码',hidden:true,width:130,align:'center'},{field:'orddicname',title:'医嘱套名称',width:130,align:'center'},{field:'ordTypeid',title:'医嘱类型编码',width:80,align:'center',hidden:true},{field:'amountTotal',title:'总金额',width:50,align:'center'},{field:'orgidDefault',title:'执行科室id',width:100,hidden:true},{field:'orgnameDefault',title:'执行科室',width:100,align:'center'}]]}}">名称</th>
									<th data-options="field:'ordNameBackup',hidden:true,width:100,align:'center',editor:{type:'text'}">名称备份</th>
									<th data-options="field:'spbody',width:120,align:'center',editor:{type:'text'}">送检物或检验部位</th>
									<th data-options="field:'amountTotal',width:50,align:'center',editor:{type:'text'}">单价</th>
									<th data-options="field:'orgnameJson',hidden:true,width:100,align:'center',editor:{type:'text'}">接收科室json</th>
									<th data-options="field:'orgidExec',hidden:true,width:100,align:'center',editor:{type:'text'}">接收科室id</th>
									<th data-options="field:'orgnameExec',width:100,align:'center',editor:{type:'combobox',options:{onSelect:cmCtlocOnSelect,valueField: 'orgidExec',textField: 'orgnameExec'}}">接收科室</th>
									<th data-options="field:'note',width:100,align:'center',editor:{type:'text'}">备注</th>
									<th data-options="field:'report',width:100,align:'center',formatter: function(value,row,index){var e ='<a href=\'#\'>查看</a>';return e;}">查看报告</th>
								</tr>
							</thead>
						</table>
					</div>
				</div>
			</div>				
		</div>
		<!-- <div title="历次就诊记录" id="treatedRecord" style="padding:0;margin:0;">  
        	<div style="margin-right:5px; width: 310px; float: left"> 
	        	<table id="historyDataGrid"></table>
			</div>
			<div style="width: 100%; margin-top: 5px;">
				<div style="margin-top: 5px;">
				<fieldset style="width: 536px;">
				<table style="font-size: 12px; height:150px;">
					<tr>
						<td colspan="1"><b>诊断:</b></td>
						<td colspan="9" height="30px;" id="DetailsDiagnoses"></td>
					</tr>
					<tr>
					<tr>
						<td colspan="10"><b>主诉:</b></td>
					</tr>
					<tr>
						<td colspan="10" height="30px;" id="DetailsComplaint"></td>
					</tr>
					<tr>
						<td colspan="10"><b>现病史:</b></td>
					</tr>
					<tr>
						<td colspan="10" height="30px;" id="DetailsHistory"></td>
					</tr>
					<tr><td colspan="10"><b>体格检查：</b></td></tr>
					<tr>
						<td width="40px;">体温：</td>
						<td id="DetailsTemperature" width="30" style="color: blue;"></td>
						<td>心率：</td>
						<td id="DetailsHeartRate" width="30" style="color: blue;"></td>
						<td>收缩压：</td>
						<td id="DetailsSBP" width="30" style="color: blue;"></td>
						<td>舒张压:</td>
						<td id="DetailsDBP" width="30" style="color: blue;"></td>
						<td>心律:</td>
						<td id="DetailsRhythm" width="60" style="color: blue;"></td>
					</tr>
					<tr>
						<td>其他：</td>
						<td  colspan="9" width="90" id="DetailsOther" style="color: blue;"></td>
					</tr>
				</table>
				</fieldset>
				</div>
				<div style="margin-top: 5px;height: 215px; overflow:auto;">
					<fieldset style="min-height:200px; width: 536px;">
					<legend>医嘱</legend>
						<table id="ordSubs" style="font-size: 12px;"></table>
					</fieldset>
				</div>
			</div>
		</div> -->
		
	</div>
	<!-- 历次就诊详细 -->
	<div id="DetailsDlg" class="window" title="就诊详细" data-options="closed:true,icon:'icon-cancel',buttons:  [{text:'关闭',id:'viewDetailsDlgBtnCancle'}]" style="padding:5px">
		<div id="DetailsDlgLeft" style="margin-right:5px; width: 40%;height:430px; float: left"> 
        	<table id="historyDataGrid"></table>
		</div>
		<div id="DetailsDlgRight" style="width: 55%; height:430px;float: left">
			<div id="DetailsDlgTop" style="height: 200px;">
				<fieldset style="width: 100%;">
					<table style="font-size: 12px; height:150px;">
						<tr>
							<td colspan="1"><b>诊断:</b></td>
							<td colspan="9" height="30px;" id="DetailsDiagnoses"></td>
						</tr>
						<tr>
						<tr>
							<td colspan="10"><b>主诉:</b></td>
						</tr>
						<tr>
							<td colspan="10" height="30px;" id="DetailsComplaint"></td>
						</tr>
						<tr>
							<td colspan="10"><b>现病史:</b></td>
						</tr>
						<tr>
							<td colspan="10" height="30px;" id="DetailsHistory"></td>
						</tr>
						<tr><td colspan="10"><b>体格检查：</b></td></tr>
						<tr>
							<td width="40px;">体温：</td>
							<td id="DetailsTemperature" width="30" style="color: blue;"></td>
							<td>心率：</td>
							<td id="DetailsHeartRate" width="30" style="color: blue;"></td>
							<td>收缩压：</td>
							<td id="DetailsSBP" width="30" style="color: blue;"></td>
							<td>舒张压:</td>
							<td id="DetailsDBP" width="30" style="color: blue;"></td>
							<td>心律:</td>
							<td id="DetailsRhythm" width="60" style="color: blue;"></td>
						</tr>
						<tr>
							<td>其他：</td>
							<td  colspan="9" width="90" id="DetailsOther" style="color: blue;"></td>
						</tr>
					</table>
				</fieldset>
			</div>
			<div id="DetailsDlgBottom" style="height: 228px;width: 100%;">
				<fieldset style="min-height:200px; width: 100%;">
				<legend>医嘱</legend>
					<table id="ordSubs" style="font-size: 12px;"></table>
				</fieldset>
			</div>
		</div>
	</div>		
	
	<div id="importTemplatedlg" class="dialog" title="Modal Window" data-options="modal:true,closed:true"style="width: 750px; height: 450px; padding: 5px; padding: 2px;top:20px;">
		<table class="tabdlg">
	 		<td style="width:240px;">
		 		<fieldset style="height: 386px; border: 1px solid #C0C0C0;">
				<legend><div align="center" style="font-size:14px;"><b>病历模板列表</b></div></legend>
				<label style="font-size:12px;">模板名称:</label>
				<input input id="templatename1" placeholder="模板名称" class="validatebox" name="dto.appendinfoTemplate.templatename" style="width: 85px;height:20px;"> 
				<a href="javascript:templateSearch()" class="linkbutton"  data-options="iconCls:'chis-query',plain:true">查询</a> 
				<table id="templagenamedg"></table>
				</fieldset>
			</td>
			<td>
				<fieldset style="height: 386px;width:460px; border-right: 1px solid #C0C0C0;margin-top:0px; border-top: 1px solid #C0C0C0; border-bottom: 1px solid #C0C0C0;">
					<legend><div align="center" style="font-size:14px;"><b>病历模板</b></div></legend>
					<form id="createTemplateForm" method="post">
					<div style="width:460px; height:114px;" >
						<div type="hidden" id="uid"></div>
						<input type="hidden" id="uuid1" name="dto.appendinfoTemplates[0].uuid">
						<input type="hidden" id="appendTypeid1" name="dto.appendinfoTemplates[0].appendTypeid" value="01">
					    <label style="font-size:12px;">主诉：</label> 
						<textarea id="patientComplaint1" name='appendInfoList[0].appendContent' value='' style='width:460px; height:94px;font-size: 12px;resize: none;'></textarea>
					</div>
					<div>
						<input type="hidden" id="uuid2" name="dto.appendinfoTemplates[1].uuid">
						<input type="hidden" id="appendTypeid2" name="dto.appendinfoTemplates[1].appendTypeid" value="02">
						 <label style="font-size:12px;">现病史:</label> 
						<textarea id="patientHistory1" name='appendInfoList[1].appendContent' value='' style='width:460px; height:94px;font-size: 12px;resize: none;margin-top:3px;margin-bottom:3px;'></textarea>
					</div>
					<div>
						<input type="hidden" id="uuid3" name="dto.appendinfoTemplates[2].uuid">
						<input type="hidden" id="appendTypeid3" name="dto.appendinfoTemplates[2].appendTypeid" value="03">
						 <label style="font-size:12px;">既往史:</label> 
						<textarea id="patientHistoryPast1" name='appendInfoList[3].appendContent' value='' style='width:460px; height:94px; font-size: 12px;resize: none;margin-bottom:3px;'></textarea> 
					</div>
					<div class="box" align="right">
					<!-- 	<a align="" href="javascript:inTemplate1()" class="linkbutton">导入使用</a>
				     	<a href="javascript:clearing()" class="linkbutton">清空</a>
				    	<a href="javascript:createOrSave()" class="linkbutton">保存</a>
				        <a href="javascript:removeTemplate1()" class="linkbutton">删除</a> -->
				        <button type="button" class="btn btn-primary btn-sm" style="padding-bottom: 3px; padding-top: 3px;" onclick="inTemplate1()">导入使用</button>
				        <button type="button" class="btn btn-info btn-sm" style="padding-bottom: 3px; padding-top: 3px;" onclick="clearing()">清&nbsp;空</button>
				        <button type="button" class="btn btn-success btn-sm" style="padding-bottom: 3px; padding-top: 3px;" onclick="createOrSave()">保&nbsp;存</button>
				        <button type="button" class="btn btn-danger btn-sm" style="padding-bottom: 3px; padding-top: 3px;" onclick="removeTemplate1()">删&nbsp;除</button>
					</div>
					</form>
				</fieldset> 
			</td>
		</table> 
	</div>
	<div id="createOrSaveDlg" class="dialog" title="保存" data-options="modal:true,closed:true,buttons:'#createOrSaveDlg-buttons'"style="width: 400px; height: 200px; top:130px;text-align: center;">
 		<form id="createOrSaveForm" method="post">
 		<div align="center">
	 		<table  style="width: 368px;margin-top:10px; height: 100px;font-size:13px;line-height:25px;">
	 			<tr>
	 				<td width="118">
					  <div align="right">模板名称:</div></td>
	 			    <td width="238">
	 			      <div align="center">
	 			        <input id="templatename"
							name="dto.appendinfoTemplate.templatename"
							type="text" class="validatebox" style="width: 150px;height:20px;"/>
		              </div></td>
	 			</tr>
	 			<tr>
	 				<td><div align="right">模板类型:
	 				</div></td>
	 			    <td>
	 			      <div align="center">
	 			        <input
							class="combobox" id="privtypeid"
							style="width: 150px;"
							name="dto.appendinfoTemplate.privtypeid"
							data-options="url:'${ctx}/dict/getDictContentList.ajax?dictName=templatePermission',mode:'remote',editable:false,valueField:'id',textField:'text',pagination:false,panelHeight:'auto',required:true" />
		              </div></td>
	 			</tr>
			</table>
 		</div>
		 <div id="createOrSaveDlg-buttons" style="text-align: center;">
	         <!-- 	<a href="javascript:saveTemplate1()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>
	        	<a href="javascript:myclose()" class="linkbutton" data-options="iconCls:'chis-close'">关闭</a> -->
	        	<button type="button" class="btn btn-success btn-sm" onclick="saveTemplate1();" style="width:80px;padding-bottom: 3px; padding-top: 3px;">保&nbsp;存</button>&nbsp;
			     <button type="button" class="btn btn-danger btn-sm" onclick="myclose();" style="width:80px;padding-bottom: 3px; padding-top: 3px;">关&nbsp;闭</button>
	        </div> 
		</form>
	 </div> 
	<div id="bookInfo" class="dialog" title="Modal Window" data-options="modal:true,closed:true" style="width:700px;height:226px;">
		<table id="doclist"></table>	
</div>
<div title="处方笺" class="dialog" id="prescriptionDlg" style="position:relative; height: 460px; width: 605px;" data-options="closed: true,modal:true,buttons:'#prescription-buttons'">
	<div id="prescription" align="center" style="margin: 0 50px; height: 610px;">
		<span id="typecor" style="font-size: 20px;border: solid 1px; float: right; position: absolute; right: 50px;top: 43px; border-radius:100px">普通</span>
		
		<p style="font-size: 20px; font-weight: bold;" align="center">云诊所</p>
		<p style="font-size: 20px; font-weight: bold;" align="center">门诊处方笺</p>
		<table width="100%">
			<tr style="border-bottom: 2px; border-bottom-style: solid;" height="30px">
				<td width="30px;" nowrap="nowrap">科别
				</td>
				<td width="40px;"><span id="division" style="font-size: 12px; text-align: center;"></span>
				</td>
				<td width="30px;" nowrap="nowrap">费别
				</td>
				<td width="60px;"><span id="feeSort" style="font-size: 12px; text-align: center;"></span>
				</td>
				<td width="40px;" nowrap="nowrap">门诊号
				</td>
				<td width="120px;" style="max-width: 120px; overflow: hidden;"><span id="outpatientNO" style="font-size: 12px; text-align: center;"></span>
				</td>
				<td width="60px;" align="right">
					<table>
						<tr>
							<td><span id="ordOfYear" style="font-size: 12px; text-align: center;"></span>
							</td>
							<td width="10px;">年
							</td>
							<td><span id="ordOfMonth" style="font-size: 12px; text-align: center;"></span>
							</td>
							<td width="10px;">月
							</td>
							<td><span id="ordOfDay" style="font-size: 12px; text-align: center;"></span>
							</td>
							<td width="10px;">日
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<table width="100%">
			<tr style="border-bottom: 1px; border-bottom-style: solid;" height="30px">
				<td width="40px;" nowrap="nowrap">姓名
				</td>
				<td width="100px;"><span id="patientName" style="font-size: 12px; text-align: right;"></span>
				</td>
				<td width="40px;" nowrap="nowrap">年龄
				</td>
				<td width="80px;"><span id="patientAge" style="font-size: 12px; text-align: right;"></span>
				</td>
				<td width="40px;" nowrap="nowrap">性别
				</td>
				<td width="80px;"><span id="patientGender" style="font-size: 12px; text-align: center;"></span>
				</td>
			</tr>
			<tr style="border-bottom: 1px; border-bottom-style: solid;" height="30px">
				<td nowrap="nowrap" width="40px;">临床诊断</td>
				<td colspan="6" nowrap="nowrap" charoff="5"><span id="clinicalDiagnosis" style="font-size: 12px;"></span>
				</td>
			</tr>
			<!-- <tr style="border-bottom: 2px; border-bottom-style: solid;">
				<td valign="top">
				</td>
				<td style="height: 350px; valign:top; font-size: 12px; " colspan="5">
					<table id="prescriptionDetail" align="left" style="valign: top;"></table>
				</td>
			</tr> -->
		</table>
		<label style="text-align: left; float: left;"><b>R</b></label>
		<div style="margin: 25px 0 0 10px; float: left; height: 350px;">
			<table id="prescriptionDetail" cellpadding="10" cellspacing="10"></table>
		</div>
		<table width="100%">
			<tr height="30px">
				<td width="40px" nowrap="nowrap">医师</td>
				<td id="docName" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;">
				</td>
				<td width="40px" nowrap="nowrap">审核</td>
				<td id="ckName" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;">
				</td>
				<td width="40px" nowrap="nowrap">药价</td>
				<td id="medicinePrice" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;">
				</td>
			</tr>
			<tr height="30px">
				<td width="40px" nowrap="nowrap">调配</td>
				<td id="allocation" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;">
				</td>
				<td width="40px" nowrap="nowrap">核对</td>
				<td id="verify" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;">
				</td>
				<td width="40px" nowrap="nowrap">发药</td>
				<td id="dispensing" align="center" style="border-bottom: 1px; border-bottom-style: solid; font-size: 12px;"><br><br></td>
			</tr>
		</table>
		 <div id="prescription-buttons" style="text-align: center;">
         	<!-- <a href="javascript:printPrescription()" class="linkbutton">打印</a>
        	<a href="javascript:closePrescription()" class="linkbutton">关闭</a> -->
        	<span id="ordid" style="display: none;"></span>
        	<button class="btn btn-sm btn-success" type="button" onclick="javascript:printPrescription()">打 印</button>
        	<button class="btn btn-sm btn-danger" type="button" onclick="javascript:closePrescription()">关 闭</button>
        </div> 
	</div>
</div>
</body>
</html>
