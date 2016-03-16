<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>医嘱模板</title>

	<script type="text/javascript"
		src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/common.js"></script>
	<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
	<script type="text/javascript"
		src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
	<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
	<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
	<style type="text/css">
.leftSide {
	text-align: right;
	width: 100px;
}

.bs-pagination {
	margin: 3px 0;
}

a:link {
	color: #333333;
}

.div {
	border: 1px solid #c0c0c0;
}
</style>
	<script type="text/javascript"
		src="${ctx}/js/dhcc/chis/clinictemplate/clinicTemplate.js">
	
</script>

	<script type="text/javascript"
		src="${ctx}/js/dhcc/chis/common/makePy.js">
	
</script>
	</head>
	<body>
		<div id="leftSide" style="width: 20%; height: 100%; float: left">
			<fieldset style="margin: 0 0 1px 0; padding-bottom: 1px;">
				<div id="toolbarLeft">
					<table>
						<tr>
							<td>
								<a href="javascript:newAddOrdTemplateCate()" id="newCateBtn"
									style="float: left" class="btn btn-success btn-de">新建</a>
							</td>
							<td>
								<a href="javascript:ordTemplateCateUpdate()" id="updateCateBtn"
									style="float: left" class="btn btn-info btn-de">修改</a>
							</td>
							<td>
								<a href="javascript:ordTemplateCateDelete()" id="deleteCateBtn"
									style="float: left" class="btn btn-danger btn-de">删除</a>
							</td>
							<td>
								<a href="javascript:ordTemplateRefresh()" id="refreshCateBtn"
									style="float: left" class="btn btn-warning btn-de">刷新</a>
							</td>
						</tr>
					</table>
				</div>
			</fieldset>

			<div id="ordTemplateCate" class="div"
				style="margin-right: 0px; height: 510px;">
				<ul id="ordTemplateCateTree" class="tree">
				</ul>
			</div>

			<!-- <div  id="ordSysTemplateCate" class = "div" style="margin-right: 0px;height: 335px;" >
	      <ul id="ordSysTemplateCateTree" class="tree">
		  </ul>
	 </div> -->
		</div>

		<div id="rightSide" title="医嘱字典"
			style="width: 79%; margin-left: 1px; float: left">
			<div id="toolbarRight" style="height: 25px;">
				<label style="height: auto;">
					字典名称:&nbsp
				</label>
				<input class="validatebox" id="ordDicNameQueryInputStr" type="text"
					style="height: auto; width: 160px; font-size: 14px;">
				<button id="ordDicSearch" type="button"
					class="btn btn-primary btn-sm" onclick="javascript:ordDicquery()">查询
				</button>
				<button id="ordDicSave" type="button" class="btn btn-success btn-sm" onclick="javascript:ordDicSave();">保存</button>
			</div>
			<div style="height: 240px">
				<table id="ordDicList"></table>
			</div>
			<div style="height: 340px">
				<div id="tabsOrder" class="tabs" data-options="fit:true"
					style="height: 70%; width: 100%">
					<div title="临床医嘱字典"
						style="padding: 0; margin: 0px; overflow: hidden">
						<fieldset id="ordDicInput"
							style="margin: 0 0 0 0; padding-bottom: 5px;">
							<div style="height: 45px">
								<table border=0 style="width: 100%;">
									<tr align="right">
										<td>
											<label>
												医嘱类型:
											</label>
											<input class="combobox" id="ordTypeId" style="width: 100px;"
												name="ordTypeId"
												data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=ordType&grade=1',
											mode:'remote',
											editable:false,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
										</td>
										<td>
											<label>
												医嘱名称:
											</label>
											<input id="orddicname" class="validatebox"
												style="width: 250px;" type="text" name="orddicname" />
										</td>
										<td>
											<label>
												输入串:
											</label>
											<input id="orddicinputstr" class="validatebox"
												style="width: 200px;" type="text" name="orddicinputstr" />
										</td>
										<td>
											<label>
												默认显示:
											</label>
											<select id="isdisplay" class="combobox"
												style="text-align: center; width: 80px;"
												name="isdisplay">
												<option value="0" selected="selected">否</option>
												<option value="1">是</option>
											</select>
										</td>
									</tr>
									<tr align="right">
										<td>
											<label>
												停用标志:
											</label>
											<select id="isstop" class="combobox"
												style="text-align: center; width: 100px;" name="isstop">
												<option value="0" selected="selected">否</option>
												<option value="1">是</option>
											</select>
											 
		             </select> 
		             
		             
										</td>
										<td>
											<label>
												备注:
											</label>
											<input id="notedes" class="validatebox" style="width: 250px"
												type="text" name="notedes" />
										</td>
								</table>
							</div>
						</fieldset>
						<div title="医嘱字典明细" style="height:482px">
							<input id="deleteUuid" name="deleteUuid" type="hidden">
							<div id="Wmedicine" class="div" style="height:202px">
								<table id="detailTable"></table>
							</div>
							<div id="Cmedicine" class="div" style="padding: 0;">
								<div id="chinaMedicineDiv">
									<input id="cMedordid" name="tord.ordid" type="hidden">
									<fieldset style="height: 30px; width: 97%">
										<legend>
											中医用法
										</legend>
										<label for="cMedTQ">
											付数:
										</label>										
										 <input class="combobox" 	
											id="cMedTQ"
											style="width: 60px;"
											name="timesquantity"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=cMedTQ',
											mode:'remote',
											editable:false,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
										<label for="cMedUsage">
											用法:
										</label>										 
										<input class="combobox" 	
											id="cMedUsagename"
											style="width: 60px;"
											name="usagename"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=odUsage',
											mode:'remote',
											editable:false,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
										<label for="cMedFrequency">
											频次:
										</label> 
										<input class="combobox" 	
											id="cMedFrequency"
											style="width: 60px;"
											name="frequency"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=cMedFrequency',
											mode:'remote',
											editable:false,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'">	
									</fieldset>
								</div>
								
							</div>
							<div style="margin-top: 2px" >
									<table id="chinaMedicineGrid"  class="datagrid"
								data-options="height:155,fitColumns:true,singleSelect: true"></table>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="ordTemplateCateDialog" class="dialog" title="Modal Window"
			data-options="modal:true,closed:true,buttons:'#dialogButtons'"
			style="width: 300px; height: 330px">
			<form id="ordTemplateCateContent" method="post">
				<table border="0" cellspacing="15" cellpadding=5
					style="margin: 10px;">
					<tr>
						<td align="right">
							<label style="font-size: 18px;">
								上级名称:
							</label>
						</td>

						<td>
							<input id="upname" style="text-align: center; width: 100%"
								readonly="readonly" />
						</td>
					</tr>
					<tr>
						<td align="right">
							<label style="font-size: 18px;">
								分类名称:
							</label>
						</td>
						<td>
							<input class="validatebox" id="dtordgrname" type="text"
								style="width: 100%" name="ordgrname" />
						</td>
					</tr>
					<tr>
						<td align="right">
							<label style="font-size: 18px;">
								输入串:
							</label>
						</td>
						<td>
							<input class="validatebox" id="inputstr" type="text"
								style="width: 100%" name="inputstr" />
						</td>
					</tr>
					<tr>
						<td align="right">
							<label style="font-size: 18px;">
								分类类别:
							</label>
						</td>
						<td>
							<select id="grpflag" class="combobox" style="width: 100%"
								name="grpflag">
								<option value="0" selected="selected">医嘱字典</option>
								<option value="1">医嘱组套</option>
							</select>
						</td>
					</tr>
					<tr>
						<td align="right">
							<label style="font-size: 18px;">叶子节点:</label>
						</td>
						<td>
							<select id="leaf" class="combobox" data-options="panelHeight:46"
								style="width: 100%" name="leaf">
								<option value="0" selected="selected">否</option>
								<option value="1">是</option>
							</select>
						</td>
					</tr>
					<tr>
						<td align="right">
							<label style="font-size: 18px;">
								描述:
							</label>
						</td>
						<td>
							<textarea id="ordgrdes"
								style='width: 100%; height: 60px; font-size: 12px; resize: none'
								name='ordgrdes'></textarea>
						</td>
					</tr>
				</table>
				<input class="validatebox" id="upid" type="hidden"
					style="text-align: center; width: 100%"
					name="upid" />
				<input class="validatebox" id="grade" type="hidden"
					style="text-align: center; width: 100%"
					name="grade" />
				<input class="validatebox" id="dtordgrid" type="hidden"
					style="text-align: center; width: 100%"
					name="dtordgrid" />
				<input class="validatebox" id="privtypeid" type="hidden"
					style="text-align: center; width: 100%"
					name="privtypeid" />
			</form>
		</div>
		<div id="dialogButtons" style="text-align: center;"> 
		 <button type="button" class="btn btn-success btn-sm" onclick="javascript:ordTemplateCateSave()">保存</button>
	<button type="button" class="btn btn-danger btn-sm" onclick="javascript:ordTemplateCateCancel()">关闭</button>
		</div>
	</body>
</html>
