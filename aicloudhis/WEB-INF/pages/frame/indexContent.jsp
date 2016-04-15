<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">

 <html class="aui ltr" dir="ltr" lang="zh-CN"> 
<head> 
<title>健康乐诊所系统</title> 
<meta content="initial-scale=1.0, width=device-width" name="viewport" /> 
<link href="${ctx}/css/index/main.css" rel="stylesheet" type="text/css" /> 
<link rel="stylesheet" type="text/css" href="${ctx}/css/bootstrap.min.css" />

<%@ include file="/common/meta.jsp" %>

<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/moment.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/jquery-ui.custom.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lang-all.js"></script>
<script type="text/javascript" src="${ctx}/js/index/ckeditor/ckeditor.js"></script>

<script type="text/javascript" src="${ctx}/js/index/dateUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/index/jquery.calandar.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/index-content/index-content.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/index-content/index-notice.js"></script>
<!--调用患者管理接口  -->
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/patCon/patRe.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/PYjm.js"></script>
<script type="text/javascript" 
    src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript">

</script>

<script type="text/javascript" src="${ctx}/js/bootstrap.min.js"></script>

 <style type="text/css"> 
	font{
	font-family: '宋体', Simsun;font-size:12px;
	 }
	.validatebox-text, textarea{ 
	   height:20px;
	   line-height:20px;
	   border:1px solid #dddddd;
	}
	.histab{
	 font-size:12px;
	  border:1px solid #dddddd;
	}
	.histab #tb2{
	 font-size:12px;
	  border:1px solid #FFFFFF;
	}
	.span3 a{color:#f60;}
</style> 

</head>
<body class=" yui3-skin-sam controls-hidden guest-site signed-in public-page site dockbar-split"> 
	<input type="hidden" id="curPage1" value=1>
	<input type="hidden" id="curPage2" value=1>
	<input type="hidden" id="curPage3" value=1>
	<input type="hidden" id="bookWaitingCountChart" value=0>

	<div id="wrapper2"> 
		 
    <div id="content">
    
     <div class="" id="main-content" role="main"> 
     <div class="portlet-layout row-fluid"> 
     <div class="portlet-column portlet-column-first span8" id="column-1"> 
     <div class="" id="layout-column_column-1"> 
     <div class="portlet-body">
			<div class="row-fluid dhcc-row-fluid" id=""> 
			<div class="clinicPromptTitle span2"></div> 
				<div class="span10" id=""> 
					<div class="row-fluid dhcc-row-fluid" id=""> 
						<div id="" class="span3"> 预约待诊 :<span style="color:#00a06d;font-size:15px" id="bookWaitingCount"></span> 人 </div> 
						<div id="" class="span3"> 登记待诊 :<span style="color:#00a06d;font-size:15px" id="regWaitingCount"></span> 人 </div> 
						<div id="" class="span3"> 已收费 :<span style="color:#00a06d;font-size:15px" id="chargedMoney"></span> 元 </div> 
						<div id="" class="span3"> 未收费 : <span style="color:#00a06d;font-size:15px" id="unchargeMoney"></span>  元 </div> 
						<div id="" class="span3"> 待诊中 :<span style="color:#00a06d;font-size:15px" id="treatmentingCount"></span>人 </div> 
						<!-- <div id="" class="span3"> 就诊中 :<span style="color:#00a06d;font-size:15px" id="treatmentingCount"></span> 人 </div>  -->
						<div id="" class="span3"> 已就诊 :<span style="color:#00a06d;font-size:15px" id="treatmentedCount"></span> 人 </div> 
						<!-- <div id="" class="span3"> 已开医嘱 :<span style="color:#00a06d;font-size:15px" id="docAdviceCount"></span>条 </div>
						<div id="" class="span3"> 待回访 : <span style="color:#00a06d;font-size:15px" id="visitWaitingCount"></span>人 </div>
						<div id="" class="span3"> 发药 :<span style="color:#00a06d;font-size:15px" id="dispensingCount"></span> 人 </div>  -->
					</div> 
				</div> 
			</div>
			
     </div> 
     
	<div class="portlet-borderless-container" style=""> 
     
		<div class="portlet-body"> 
			<div style="font-size: 12px" align="right">
				<lable>姓名&nbsp;&nbsp;</lable>
				<input id="patName" style="width:60px;height:25px;"/>
				<lable>手机号&nbsp;&nbsp;</lable>
				<input id="patTelephone" style="width:120px;height:25px;"/>
				<button class="btn btn-small" onclick="javascript:patientList();">
				<i class="bs-icon-search"></i>查询
				</button>
				 <button class="btn btn-small" onclick="javascript:createPatientTop()">
				<i class="bs-icon-plus"></i>新建
				</button>
			 </div> 
			<div class="bs-docs-example" > 
				<ul class="nav nav-tabs"> 
				<li class="tab-pane active"><a href="javascript:void(0)">患者列表&nbsp;</a> </li> 
				 
				</ul>
			</div>
			<div id="patIndexDg" class="tab-content"  style="height:220px"> 
				<div class="tab-pane active" style="height:180px"> 
					<div class="row-fluid"> 
						<div class="row-fluid"> 
							<div class="span12"> 
					     
								<table class="table table-striped">
						     	<thead> 
						     		<tr> 
						     			<th width="5%">姓名</th>
										<th width="3%">性别</th>
										<th width="7%">出生日期</th>
										<th width="5%">移动电话</th>
										<th width="15%">详细地址</th>
										<th width="7%">登记日期</th>
										<th width="5%">历次诊断</th>
										<th width="7%">操作</th>
									</tr> 
								</thead>
								</thead> 
								<tbody  id="pat_list"> 
								</tbody> 
								</table>  
							</div>
					</div> 
				</div> 
			</div> 
			
			<div class="bs-pagination bs-pagination-left" style="text-align: right; margin: 20px 0 0 0;" id="page_plus1"> 
											
			</div>
		</div> 
		
		
		
		</div> 
	</div>
     
     
 	<!-- <div class="portlet-body" id="">
     
		<div class="row-fluid dhcc-row-fluid" id=""> 
			<div class="outPatientEvaluationTitle span2"></div> 
			<div class="span10" id=""> 
				<div class="row-fluid dhcc-row-fluid" id=""> 
					<div id=""> 
						<div class="span3"> 门诊人次 :<span style="color:#00a06d;font-size:15px" id="outPatientNum"></span> </div>
					</div> 
					<div id=""> 
						<div class="span3"> 总收入 :<span style="color:#00a06d;font-size:15px" id="totalIncome"></span> 元 </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 次均费用 :<span style="color:#00a06d;font-size:15px" id="averageCost"></span> 元 </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 出诊次数 :<span style="color:#00a06d;font-size:15px" id="visitCount"></span> </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 预约率 :<span style="color:#00a06d;font-size:15px" id="bookRate"></span> </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 回访次数 :<span style="color:#00a06d;font-size:15px" id="returnVisitCount"></span> </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 发药 :<span style="color:#00a06d;font-size:15px" id="dispensingCount_out"></span>人 </div> 
					</div>
					<div id=""> 
						<div class="span3"> 处方数 :<span style="color:#00a06d;font-size:15px" id="prescriptionCount"></span> </div> 
					</div> 
					<div id=""> </div> 
					<div id=""> 
						<div style="width:200px" class="span3"> 高发病 :<span id="highIncidence"></span> </div> 
					</div> 
					

					<div style="float:right">
						<div style="height:30px">
							<div style="position:relative;margin:0 5px 0 0;display: inline;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
							<span style="margin-left:45px;width:18px;overflow:hidden;border-radius:6px;" id="OutPatientOutCalandarYear">
							
							</span>
							</div>
							<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
							<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;" id="OutPatientOutCalandarMonth">
							
							</span>
							</div>
							<div class="calander_left" id="" onclick="changeLastMonth('OutPatientOutCalandarYear','OutPatientOutCalandarMonth')"></div>
							<div class="calander_right" id="" onclick="changeNextMonth('OutPatientOutCalandarYear','OutPatientOutCalandarMonth')"></div>
						</div>
					</div>




				</div> 
			</div> 
		</div>
	</div>  -->
	
	<!-- <div class="portlet-body" id="">
		<div class="row-fluid dhcc-row-fluid" id=""> 
			<div class="otherEvaluationTitle span2"></div> 
			<div class="span10" id=""> 
				<div class="row-fluid dhcc-row-fluid" id=""> 
					<div id=""> 
						<div class="span3"> 应收金额 :<span style="color:#00a06d;font-size:15px" id="receivableMoney"></span> 元  </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 实收金额 :<span style="color:#00a06d;font-size:15px" id="paidMoney"></span> 元 </div> 
					</div> 
					<div id=""> 
						<div class="span3"> 欠费金额 :<span style="color:#00a06d;font-size:15px" id="arrearageMoney"></span>元</div> 
					</div> 
					<div id=""> 
						<div class="span3"> 优惠金额 :<span style="color:#00a06d;font-size:15px" id="preferentialMoney"></span>元</div> 
					</div> 
					<div id=""> 
						<div class="span3"> 现金支付 :<span style="color:#00a06d;font-size:15px" id="cashMoney"></span> 元</div> 
					</div> 
					<div id=""> 
						<div class="span3"> 其他支付 :<span style="color:#00a06d;font-size:15px" id="otherMoney"></span> 元 </div> 
					</div> 
					
					<div id=""> </div> 
					
					<div style="float:right">
						<div style="height:30px">
							<div style="position:relative;margin:0 5px 0 0;display: inline;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
							<span style="margin-left:45px;width:18px;overflow:hidden;border-radius:6px;" id="CostOutCalandarYear">
							
							</span>
							</div>
							<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
							<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;" id="CostOutCalandarMonth">
							
							</span>
							</div>
							<div class="calander_left" id="OutCalandarDay_month_last" onclick="changeLastMonth('CostOutCalandarYear','CostOutCalandarMonth')"></div>
							<div class="calander_right" id="OutCalandarDay_month_next" onclick="changeNextMonth('CostOutCalandarYear','CostOutCalandarMonth')"></div>
						</div>
					</div>


				</div> 
			</div> 
		</div>
	</div> 
	 -->
	
<div>
	<div> 
		<div class="portlet-body" style="height:300px"> 
			<div style="font-size: 12px" align="right" id="book_search">
				 姓名<input id="book_patientName" type="text" style="width:60px;height:25px;">
				移动电话<input id="book_patientTelephone"  type="text" style="width:120px;height:25px;">
				预约初始日期<input class="datebox" id="bookStartDate" style="height: 25px; width: 110px">
				预约结束日期<input class="datebox" id="bookEndDate" style="height: 25px; width: 110px">
				
				<button class="btn btn-small" onclick="javascript:bookList();">
				<i class="bs-icon-search"></i>查询
				</button>
			 </div> 
			<div class="bs-docs-example" id="_PatientPortlet_WAR_Patientportlet_myTab"> 
				<ul class="nav nav-tabs"> 
				<li class="tab-pane active" id="initPage1"><a href="javascript:void(0)" onclick="initPage(1)">预约列表</a> </li> 
				<li class="tab-pane " id="initPage2"><a href="javascript:void(0)" onclick="initPage(2)">待就诊列表&nbsp;</a> </li> 
				<li class="tab-pane " id="initPage3"><a href="javascript:void(0)" onclick="initPage(3)">已接诊列表&nbsp;</a> </li>
				</ul> 
			</div> 
			<div> 
				<div id=""> 
					<div class="row-fluid"> 
						<div class="row-fluid">
							<div class="span12" style="height:200px"> 
								<table class="table table-striped"> 
									<thead id="list_title"> 
										
									</thead>
									<tbody id="list_content"> 
									</tbody> 
								</table>
							</div> 
							<div style="margin: 0;float:right">
								<!-- <div style="height:20px"  id="pageBar">
							
									<div style="position:relative;margin:0 5px 0 0;display: inline;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
									<span style="margin-left:45px;width:18px;overflow:hidden;border-radius:6px;" id="BookOutCalandarYear">
									
									</span>
									</div>
									<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
									<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;" id="BookOutCalandarMonth">
									
									</span>
									</div>
									<div style="position:relative;float:left;height:30px;border:1px solid #a4a4a4;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;">
									<span style="margin-left:30px;width:18px;overflow:hidden;border-radius:6px;" id="BookOutCalandarDay">
									</span>
									</div>
									<div class="calander_left" id="" onclick="changeLastDay('BookOutCalandarYear','BookOutCalandarMonth','BookOutCalandarDay')"></div>
									<div class="calander_right" id="" onclick="changeNextDay('BookOutCalandarYear','BookOutCalandarMonth','BookOutCalandarDay')"></div>
								</div> -->
								<div class="bs-pagination bs-pagination-left" style="text-align: right; margin: 0;" id="page_plus2"> 
								
								</div>
							</div>
							
						 </div>
					 </div> 
					 
					 
			
				 </div> 
			 </div> 
		 </div> 
	 </div> 
 </div> 
    
      
 </div> 
 
 </div> 
 

<div class="span4" > 
	<div> 
		<div> 
		<span id=""></span> 
		<div class="portlet-borderless-container" style=""> 
		
		<div class="portlet-body" style="width:385px;height:280px"> 
		<div class="border_incq"> 
		<div> 
		<div class="scheduleTitle"></div> 
		<div class=" scheduleTitleFont" style=" padding: 8px"> 
		    	我的日程
		</div>
		<div id="my_calendar" style="padding-top:2px"></div>
		</div> 
		<div id="Scheduleportlet_calendar" style="padding-top:2px"></div>
		</div> 
		</div>
		</div>
		</div> 

   
		<div> 
			<div> 
				<div class="portlet-body"> 
					<div id="yuyuetongji">预约统计仪盘表</div> 
				</div> 
			</div> 
		</div> 
		
		<div class="portlet-borderless-container" >
				<div class="portlet-body"> 
					<div class="bs-docs-example" id="aaaa"> 
						<ul class="nav nav-tabs"> 
							<li class="active" id="initPage5"><a href="javascript:void(0)" onclick="initPage(5);">公告</a></li> 
							<li id="initPage6"><a href="javascript:void(0)" onclick="initPage(6);">通知</a></li> 
							<li id="initPage7"><a href="javascript:void(0)" onclick="initPage(7)">规章制度</a></li> 
						</ul> 
					</div> 
					<div class="tab-content">
						<div class="tab-pane active" id=""  style="height:185px"> 
							<div class="row-fluid"> 
								<div class="span12"> 
									<table id="" class="table table-striped"> 
									<thead> 
									<tr> 
										<th style='width: 65%'>标题</th> <th style='width: 35%'>时间</th> </tr> 
									</thead> 
										<tbody id="notice_list"> 
									 	
										</tbody> 
									</table>
								</div> 
								
							</div> 
						</div> 
						<div class="bs-pagination bs-pagination-left" style="text-align: right; margin: 0;" id="page_plus3"> 
									
						</div>
					</div> 
					
				</div> 
				
			</div> 
			
	</div>
	
</div> 


        
</div>
 
</div>
<div class="portlet-body" style="height:30px" align="center" id="copyright"> 
<span>Copyright &copy; 2015-2018  北京亚信软件有限公司</span> 
<span>版权所有</span>  
</div>
</div> 

</div>



<!-- 调用预约管理预约功能 begin -->
<div id="calendarDlg" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#calendarDlg-buttons'" style="width:850px;height:488px;">
	<div style="width:300px;height:300px;float:left;margin-top:5">
		<fieldset >
					<legend style="color: #0000FF;font-size:16px;">患者信息</legend>
						<form id="createbookForm" method="post">
			 				<input type="hidden" id="patientidL" name="dto.patientBook.patientid">
						<table border="0">
							<tr style="height: 35px;">
								<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名:&nbsp;&nbsp;<span id="patientNameL" ></span></td>						
							</tr>
							<tr style="height: 35px">
								<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性别:&nbsp;&nbsp;<span id="patientSexIdL"></span></td>
							</tr>
							<tr style="height: 35px">
								<td >出生日期:&nbsp;&nbsp;<span id="patientAgeL"></span></td>
							</tr>
							<tr style="height: 35px">
								<td >移动电话:&nbsp;&nbsp;<span id="patientTelephoneL"></span></td>
							</tr>
							
							<tr style="height: 35px">
								<td >详细地址:&nbsp;&nbsp;<span id="streetinfoL"></span></td>
							</tr>
							<tr style="height: 35px">
								<td>身份证号:&nbsp;&nbsp;<span id="icardL"></span></td>
							</tr>
							<tr style=" height: 40px">
								<td> <span style="color: red"><B>症状描述:</B>
									<textarea style="width: 300px;height: 73px" id="symptoms"></textarea></span></td>
							</tr>
						</table>
						</form>
					</fieldset>
	</div>
	<div id="calendar" style="width:400px;height:350px;float:right;font-size:16px"></div>
</div>
<div id="bookInfo" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#bookInfo-buttons'" style="width:700px;height:320px;">
		<table id="doclist"></table>	
</div>

<!-- 调用预约管理预约功能 end -->

<!-- 调用患者管理新增功能 begin -->
<div id="dlg" class="dialog" title="Modal Window"
		data-options="modal:true,closed:true,buttons:'#createDlg-buttons'"
		style="width: 750px; height: auto; padding: 3px;">
			<form id="createForm" method="post">
			 <input type="hidden" id="patientid" name="patientid">
			 <input type="hidden" id="inputstr" name="inputstr">
			 <input type="hidden" id="createDatetime" name="createDatetime">
				  <fieldset style="width: 710px;">
				    <legend class="font">基本信息</legend>
					  <table cellpadding="2" border="0" cellspacing="3" style="font-size:12px;width: 700px;">
					  	<tr>
					  	
						    <td align="right" style="width: 50px;"><font color="red">姓名:</font></td>
						 	<td align="center" style="width: 100px;"><input class="validatebox" type="text" id="patientName" name="patientName" style="width: 90px;" data-options="required:true" onblur="replace(this);ename();" onchange="illegalChar(this)"/></td>
						    <td align="right" style="width: 65px;"><font>姓名拼音:</font></td>
						    <td align="center" style="width: 100px;"><input class="validatebox" type="text" id="patientEname" name="patientEname" style="width: 90px;" readonly="readonly"/></td>
							<td align="center" style=" width: 65px;"><font color="red">移动电话:</font></td>
							<td align="center" style=" width: 100px;"><input class="numberbox" type="text" id="patientTelephone" name="patientTelephone" style="width: 150px;" data-options="required:true"/></td>
							<td rowspan="5" colspan="2" align="center" >
								<img src="${ctx}/images/wz.jpg" id="tp" style="width: 106px; height: 100px; border: 1px solid #dddddd;" />
							</td>
						</tr>
						<tr>
							<td align="right" style="width: 50px;"><font>民族:</font></td>
						    <td align="center" style="width: 100px;">
						           <input	class="combobox" id="nationalityid" name="nationalityid"style="width: 90px;"
										data-options=" url:'${ctx}/dict/getDictContentList.ajax?dictName=nation',
										mode:'remote',editable:false,valueField:'value',textField:'description',pagination:false,panelHeight:'auto'">
							 </td>
							 <td align="right" style="width: 65px;"><font color="red">证件类型:</font></td>
							 <td align="center" style="width: 100px;">
							     <input	class="combobox" 	
										id="idcardTypeid"
										style="width: 90px;"
										name="idcardTypeid" 
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=certificates',
										mode:'remote',
										editable:false, 
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						
							<td align="right" style="width: 65px;"><font color="red">证件号码:</font></td>
                    	    <td align="center"  colspan="1">
                    	         <input class="validatebox" type="text" id="icard" name="icard" data-options="required:true" 
                    	                onblur="upperCase()" onkeydown="javascript:if (event.keyCode==13) upperCase();" 
                    	                style="width: 150px;"/>
                    	    </td>
						</tr>
						<tr>
						    	<td align="right" style="width: 50px;"><font>性别:</font></td>
						    	<td align="center" style="width: 100px;">
						    	     <input	class="combobox" id="patientSexId" name="patientSexid"
											style="width: 90px;"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=gender',
											mode:'remote',
											onSelect:changeImg,
											valueField:'value',
											editable:false,
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
								</td>
								<input type="hidden" id="patientSename" name="patientSename"/>
								<td align="right" style="width: 65px;"><font>年龄:</font></td>
								<td align="center" style="width: 100px;">
								    <input class="numberbox" type="text" id="age" name="age" style="width: 90px;" onchange="createBirthday();"/>
								</td>
							    <td align="right" style="width: 65px;"><font color="red"><font>出生日期:</font></font></td>
							    <td align="center" style="width: 100px;">
							    	<input class="datebox" type="text" id="birthDate" name="birthDate" 
							    	       style="width: 150px;" data-options="required:true,editable:false,onSelect:checkBirthDay"/>
							    </td>
					    </tr>
						<tr>
						    <td align="right" style="width: 50px;"><font>婚否:</font></td>
						    <td align="center" style="width: 100px;">
						         <input	class="combobox" 	
										id="marriedid"
										name="marriedid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=marriage',
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto'">
							</td>
							<td align="right" style="width: 65px;"><font color="red"><font>患者类型:</font></font></td>
							<td align="center" style="width: 100px;">
							     <input	class="combobox" id="patientIdentityid"
										name="patientIdentityid" style="width: 90px;"
										data-options="valueField:'patientIdentityid',textField:'patientIdentityname',editable:false,required:true,onSelect:setIdentityname"/>
							</td>
							<input type="hidden" id="patientIdentityname" name="patientIdentityname">
							 <td align="right" style="width: 65px;"><font>职业:</font></td>
							 <td align="center" style="width: 100px;">
							     <input	class="combobox" 	
										id="occupationid"
										name="occupationid"
										style="width: 150px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=job',
										mode:'remote',
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						</tr>
					</table>
				</fieldset>
					<table  style="width:700px;font-size:12px;">
						<tr>
						    <td style="width: 233px;"></td>
							<td align="left"><font>家庭信息</font><input class="accordion-collapse accordion-expand" id="familyCheck" type="checkbox"  style="width: 20px;" value="0" ></td> 
							<td align="right"><font>联系信息</font><input  class="accordion-collapse accordion-expand"  id="contactCheck" type="checkbox"  style="width: 20px;" value="0"></td>    
						    <td style="width: 220px;"></td>
						</tr>	
					</table>
			<div id="family" style="display:none" value="0">
				 <fieldset style="width: 710px;">
				    <legend>家庭信息</legend>
					  <table cellpadding="2" border="0" cellspacing="3" style="width:700;font-size:12px;">	
						<tr>
						   	<td align="right" style="width: 65px;"><font>国家:</font></td>
						  	<td align="center" style="width: 100px;">
						  	     <input	class="combobox" id="countryid" name="countryid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=0',
										onSelect:onSelectCountry,
										mode:'remote',
										valueField:'value',
										textField:'description',
										editable:false,
										pagination:false,
										panelHeight:'auto'"></td>
					     	<td align="right" style="width: 80px;"><font>省/直辖市&nbsp;:</font></td>
					     	<td align="center" style="width: 100px;">
					     	     <input	class="combobox" 	id="provinCesid"
										name="provinCesid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=1',
										onSelect:onSelectProvice,
										editable:false,
										mode:'remote',
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
							<td align="right" style="width: 65px;"><font>市(地区):</font></td>
							<td align="center" style="width: 100px;"><input	class="combobox" 	id="cityid"
										name="cityid"
										style="width: 90px;"
										data-options="
									 	url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=2',
										onSelect:onSelectCity,
										mode:'remote',
										valueField:'value',
										editable:false,
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						
							<td align="right" style="width: 65px;"><font>县/区:</font></td>
							<td align="center" style="width: 100px;">
							     <input	class="combobox" 	id="cityaeraid"
										name="cityaeraid"
										style="width: 90px;"
										data-options="
										url:'${ctx}/dict/getDictContentList.ajax?dictName=area&grade=3',
										mode:'remote',
										valueField:'value',
										editable:false,
										textField:'description',
										pagination:false,
										panelHeight:'auto'"></td>
						</tr>
						<tr>
						 	<td align="right" style="width: 65px;"><font>详细信息:</font></td>
							<td align="center" colspan="3">
							    <input type="text" class="validatebox" style="width: 280px;" 
							           id="streetinfo" name="streetinfo" onchange="illegalChar(this)">
							</td> 
							<td align="right" style="width: 65px;"><font>邮编:</font></td>
						    <td align="center" style="width: 100px;">
							    <input class="validatebox" type="text" 
							    id="flPostcode" name="flpostcode" style="width: 90px;" />
							</td>
						
						</tr>
					</table>
				</fieldset>  
			</div>
			<div id="contact" style="display:none" value="0">
			 	<fieldset style="width: 710px;">
			      <legend>联系信息</legend>
				  <table cellpadding="1" border="0" cellspacing="1" style="width:700;font-size:12px;">
					  <!-- 	<tr>
					  	    <td align="right">工作单位:</td>
							<td colspan="2"><input type="text" class="validatebox" style="width: 180px;" id="entName" name="entName"></td>
							<td align="right">单位联系人:</td>
							<td><input class="validatebox" type="text" id="entContactor" name="entContactor" style="width: 90px;" /></td>
							<td align="right">单位联系人电话:</td>
							<td><input class="validatebox" type="text" id="entTelenum" name="entTelenum" style="width: 90px;" /></td>
						</tr>
						<tr>	
							<td align="right">单位地址:</td>
							<td colspan="2"><input class="validatebox" type="text" id="entAddr" name="entAddr" style="width: 180px;" /></td>
							<td align="right">单位邮编:</td>
				     		<td><input class="validatebox" type="text" id="entPostcode" name="entPostcode" style="width: 90px;" /></td>
							<td align="right">联系人名称:</td>
							<td><input class="validatebox" type="text"  id="ctName" name="ctName" style="width: 90px;" /></td>
						</tr> -->
						<tr style="height: 20px;">
							<td align="right" style="width: 90px;"><font>与联系人关系：</font></td>
							<td><input class="validatebox" type="text"  id="ctRoleid" name="ctRoleid" style="width: 90px;"  onchange="illegalChar(this)"/></td>
					 		<td align="right" style="width: 80px;"><font>联系人电话：</font></td>
						    <td><input class="validatebox" type="text"  id="ctElenum" name="ctElenum" style="width: 90px;" /></td>
					 		<td align="right" style="width: 80px;"><font>联系人地址：</font></td>
							<td align="left" colspan="2"><input class="validatebox" type="text"  id="ctAddr" name="ctAddr" style="width: 230px;" onchange="illegalChar(this)"/></td>
					 	</tr>
					</table>  
				</fieldset>  
				 
			</div>
			<div>
			   <fieldset style="width: 710px;">
				    <legend>备注信息</legend>
				    <font><lable style="margin-left:10px;height: 20px;"  >备注：</lable></font>
				   <!--  <input class="validatebox" type="text"  id="note" name="note" style="width: 650px;height: 20px;" /> -->
				   <textarea id="note" name="note" style="width:635px;height:35px;max-width: 635px;max-height: 35px; min-width: 635px;min-height: 35px;font-size: 12px;"></textarea>
				 </fieldset> 
			</div>
			</form>
			 <div id="createDlg-buttons" style="text-align: center;">
			    <button type="button" class="btn btn-success btn-sm" onclick="saveCreate();" style="width:70px;padding-bottom: 3px; padding-top: 3px;">保存</button>
			     <button type="button" class="btn btn-danger btn-sm" onclick="myclose();" style="width:70px;padding-bottom: 3px; padding-top: 3px;">关闭</button>
 	        </div> 
	    </div>
	        
			 
	
	<!-- 调用患者管理新增功能 end -->
	
	
	<!-- 我的日程窗口 start -->	 
	<div id="myScheduleDlg" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#myScheduleDlg-buttons'" style="width:450px;height:360px;">
	    <form id="createScheduleForm" method="post">
		<input type="hidden" id="startdate" name="startdate"/>
		<input type="hidden" id="infoid" name="infoid"/>
		<input type="hidden" id="schFlag" name="schFlag"/>
		<input type="hidden" id="startTime" name="startTime"/>
		<input type="hidden" id="endTime" name="endTime"/>
		<div>
			<table class="table table-striped" border=0>  
				<tr>
					<td>标题:</td>
					<td><input type="text"  id="title" name="title" style="width: 150px;" /></td>						
				</tr>
				<tr>
					<td>时间:
						
					</td>	
					<td><select style="width: 60px;" id="hour" name="hour">					
						</select>
						时:
						<select style="width: 60px;" id="minute" name="minute">			 
						</select>
						分</td>					
				</tr>
				<tr>
					<td >内容:</td>
					<td> <textarea style="width: 300px;height: 73px" id="contentInfo"  name="content"></textarea></td>
				</tr>
				<tr>
					<td colspan="2">是否桌面提醒: <input id="isDeskRemind" type="checkbox"  ></td> 
				</tr> 
				
		</table>		
		<div id="myScheduleDlg-buttons" style="text-align: center;">
         	<a href="javascript:saveMySchedule()" class="linkbutton">保存</a>
        	<a href="javascript:closeMyScheduleDlg()" class="linkbutton">关闭</a>
        	<a href="javascript:deleteMySchedule()" class="linkbutton" style="display:none;" id="deleteMySchedule">删除</a>
        </div> 
		</div>
		</form>
	</div>
	<!-- 我的日程窗口 end -->
		
	<!-- 通知公告表单 Start-->
   <!-- 通知公告表单 Start-->
   <div id=newnotice class="dialog" title="通知/公告/制度"
			data-options="modal:true,closed:true"
			style="width: 600px; height: 450px;">
	 <form id="noticeinfo" method="post" style="margin: 5px;">
      <table border=0 cellspacing="5" cellpadding=5 style="margin: 5px;">
	   <tr>                         
        <td>
                              信息标题&nbsp;&nbsp;<input id = "infotitle" readOnly="true" type="text" name="infotitle" 
                                                       style="width:380px;"/>
        </td>
       </tr>	
	   <tr>
	    <td colspan="15">
	     <textarea id="infocontent" name="infocontent" readOnly="true" style="resize:none; width: 500px; height: 260px;">
	     </textarea><br/>
	    </td>
	   </tr>	
	   <tr>
	    <td>
	     <div  style="width:500px">
			<table id = "downloadfile"></table>	
		  </filedset>
	    </div>
       </td>
      </tr>	
   </table>
  </form>
 </div>
  <!-- 通知公告表单 end-->

</body> 
</html>
