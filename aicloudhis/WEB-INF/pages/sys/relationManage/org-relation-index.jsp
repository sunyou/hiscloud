
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>机构关系</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/organizationRelationship/organizationRelationship.js"> 
</script>
<style type="text/css">
   /*  .datagrid-body td{
		border-right:1px dotted transparent;
		border-bottom:1px dotted transparent;
	} */
</style>
</head>
<body>
<div  class="layout" style="width:100%;height:480px;">   
    <div data-options="region:'west',title:'机构关系类型',split:true" style="width:200px;">
    	<table class="datagrid" id="orgRelTypeDatagrid" data-options="onClickRow:orgRelTypeClickRow,showHeader:false,fit:true,fitColumns:true,singleSelect:true,scrollbarSize:0">
    		<thead>
				<tr>
					<th data-options="field:'orgreltypeid',width:50,hidden:true">机构关系类型编码</th>
					<th data-options="field:'orgreltypename',width:130">机构关系类型名称</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1001</td>
					<td>药房与开立科室的关系</td>
				</tr>
				<tr>
					<td>1002</td>
					<td>检验检查与执行科室的关系</td>
				</tr>
			</tbody>
    	</table>
    </div>
    <div data-options="region:'center',title:'机构关系'" style="width:800px">
    	<table class="datagrid" id="orgRelDatagrid" data-options="
    	onClickRow:orgRelClickRow,fit:true,fitColumns:true,singleSelect:true,scrollbarSize:0,toolbar: '#tb'">
    		<thead>
				<tr>
					<th data-options="field:'orgRelid',width:50,hidden:true">机构关系编码</th>
					<th data-options="field:'orgRelatename',width:100">机构关系名称</th>
					<th data-options="field:'inputstr',width:40">输入串</th>
					<th data-options="field:'notedes',width:40">描述</th>
					<th data-options="field:'controlElement',width:100,hidden:true">医嘱子类集合</th>
					<th data-options="field:'controlElementname',width:300">医嘱子类集合名称</th>
					<th data-options="field:'orgreltypeid',width:50,hidden:true">机构关系类型编码</th>
					<th data-options="field:'orgidHosp',width:20,hidden:true">所属诊所编码</th>
				</tr>
			</thead>
			<div id="tb" style="margin-bottom:5px">
				<!-- <a href="javascript:newOrgRel()" class="linkbutton" iconCls="chis-add" >新增</a>
				<a href="javascript:updateOrgRel()" class="linkbutton" iconCls="chis-edit" >修改</a>
				<a href="javascript:deleteOrgRel()" class="linkbutton" iconCls="chis-wrong">删除</a> -->
				<button onclick="javascript:newOrgRel()" type="button" class="btn btn-success  btn-sm">新增</button>
				<button onclick="javascript:updateOrgRel()" type="button" class="btn btn-info btn-sm">修改</button>
				<button onclick="javascript:deleteOrgRel()" type="button" class="btn btn-danger btn-sm">删除</button>
			</div>
    	</table>
    </div>    
    <div data-options="region:'east',title:'机构关系子类',split:true" style="width:200px;">
    	<table class="datagrid" id="orgRelSubDatagrid" data-options="
    	fit:true,fitColumns:true,singleSelect:true,scrollbarSize:0,toolbar: '#tb1'">
    		<thead>
				<tr>
					<th data-options="field:'uuid',width:100,hidden:true">唯一编码</th>
					<th data-options="field:'orgRelid',width:100,hidden:true">机构关系编码</th>
					<th data-options="field:'orgid',width:100,hidden:true">机构编码</th>
					<th data-options="field:'orgname',width:100">机构名称</th>
					<th data-options="field:'orgRelRoleid',width:100,formatter:function(value,row,index){
								if(row.orgRelRoleid == '00'){
									return '开立科室';
								}else if(row.orgRelRoleid == '01'){
									return '执行科室';
								}
	    		    	}">机构角色</th>
					<th data-options="field:'orgidHosp',width:100,hidden:true">所属诊所</th>
				</tr>
			</thead>
			<div id="tb1" style="margin-bottom:5px">
				<!-- <a href="javascript:newOrgRelSub()" class="linkbutton" iconCls="chis-add">新增</a>
				<a href="javascript:updateOrgRelSub()" class="linkbutton" iconCls="chis-edit">修改</a>
				<a href="javascript:deleteOrgRelSub()" class="linkbutton" iconCls="chis-wrong">删除</a> -->
				<button onclick="javascript:newOrgRelSub()" type="button" class="btn btn-success btn-sm">新增</button>
				<button onclick="javascript:updateOrgRelSub()" type="button" class="btn btn-info btn-sm">修改</button>
				<button onclick="javascript:deleteOrgRelSub()" type="button" class="btn btn-danger btn-sm">删除</button>
			</div>
    	</table>
    </div>   
</div>  
<div id="newOrgRelDlg" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#newOrgRelDlg-buttons'" style="width:380px;height:230px;">
	<form id="orgRelForm" action="post">
		<input type="hidden" id="orgRelid" name="orgRelid"> 
		<input type="hidden" id="orgreltypeid" name="orgreltypeid"> 
		<table border="0" cellspacing="15" cellpadding=5 style="margin: 10px;">
			<!-- <tr align="right">	
				<td>机构关系类型名称:</td>
				<td><input	class="validatebox" type="text" id="orgreltypename" readonly="readonly" style="width: 240px;height:20px"></td>
			</tr> -->
			<tr align="right">
			    <td>机构关系名称:</td>
			    <td><input class="validatebox" type="text" id="orgRelatename" name="orgRelatename" style="width: 240px;height:20px" /></td>
			</tr>
			<tr align="right">
			    <td>医嘱子类集合:</td>
			    <td>
			        <select class="combogrid" id="controlElement" name="controlElement" style="width:244px" data-options="
						panelWidth: 440,
						panelHeight:340,
						multiple: true,
						idField: 'ordCateid',
						textField: 'ordCatename',
					<!-- 	url: '${ctx}/organizationRelationship/organizationRelationshipCtrl.htm?BLHMI=ordCategorylist', -->
						method:'get',
						editable:false,
						pagination:true,
						mode:'remote',
						toolbar:'#tb3',
						columns: [[
							{field:'ck',checkbox:true},
							{field:'ordCateid',title:'医嘱分类编码',width:80},
							{field:'ordCatename',title:'医嘱分类名称',width:100},
							{field:'upcode',title:'医嘱分类上级编码',width:110,align:'right'},
							{field:'note',title:'备注',width:60,align:'center'}
						]],
						fitColumns: true
				   ">
					</select>
					<div id="tb3" >
						<a href="javascript:ok()" class="linkbutton"   iconCls="icon-ok" plain="true">确定</a>
					</div>
				</td>
			</tr>
			<tr align="right">	
				<td>输入串:</td>
				<td><input class="validatebox" type="text" id="inputstr" name="inputstr" style="width: 240px;height:20px" /></td>
			</tr>
			<tr align="right">	
				<td>描述:</td>
				<td><input class="validatebox" type="text" id="notedes"  name="notedes" style="width: 240px;height:20px" /></td>
			</tr>
		</table>
	</form> 
	 <div id="newOrgRelDlg-buttons" style="text-align: center;">
   		<!-- <a href="javascript:save()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>
   		<a href="javascript:void(0)" class="linkbutton" onclick="javascript:$('#newOrgRelDlg').dialog('close')" data-options="iconCls:'chis-close'">关闭</a> -->
   		<button onclick="javascript:save()"  type="button" class="btn btn-success btn-sm">保存</button>
   		<button onclick="javascript:$('#newOrgRelDlg').dialog('close')" type="button" class="btn btn-danger btn-sm">关闭</button>
	 </div>  
</div>
<div id="newOrgRelSubDlg" class="dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#newOrgRelSubDlg-buttons'" style="width:300px;height:160px;">
	<form id="orgRelSubForm" action="post">
		<input type="hidden" id="uuid" name="uuid">
		<input type="hidden" id="orgRelid2" name="orgRelid">
		<table border="0" cellspacing="15" cellpadding=5 style="margin: 10px;">
			<!-- <tr align="right">
			    <td>机构关系名称:</td>
			    <td><input class="validatebox" type="text" id="orgRelatename2" readonly="readonly" style="width: 180px;height:20px" /></td>
			</tr> -->
			<tr align="right">	
				<td>机构名称:</td>
				<td><select class="combogrid" id="orgid" name="orgid" style="width:184px" data-options="
						panelWidth: 440,
						panelHeight:340,
						idField: 'orgid',
						textField: 'orgname',
						url: '${ctx}/relation/queryOrgList.ajax?grade=1',
						method:'get',
						editable:false,
						pagination:true,
						columns: [[
							{field:'orgid',title:'科室编码',width:80},
							{field:'orgname',title:'科室名称',width:100},
							{field:'orgtypeId',title:'科室类型',width:110},
							{field:'orgaddress',title:'科室地址',width:60}
						]],
						fitColumns: true
				   ">
					</select>
				</td>
			</tr>
			<tr align="right">	
				<td>机构角色:</td>
				<td><input class="combobox" id="orgRelRoleid" style="width: 184px;height:20px" name="orgRelRoleid"  data-options="
						valueField: 'label',textField: 'value',data: [{label: '00',value: '开立科室'},{label: '01',value: '执行科室'}]" />
				</td>
			</tr> 
		</table>
	</form> 
	 <div id="newOrgRelSubDlg-buttons" style="text-align: center;">
   		<!-- <a href="javascript:saveOrgRelSub()" class="linkbutton" data-options="iconCls:'chis-save'">保存</a>
   		<a href="javascript:void(0)" class="linkbutton" onclick="javascript:$('#newOrgRelSubDlg').dialog('close')" data-options="iconCls:'chis-close'">关闭</a> -->
   		<a onclick="javascript:saveOrgRelSub()"type="button" class="btn btn-success btn-sm">保存</a>
   		<a onclick="javascript:$('#newOrgRelSubDlg').dialog('close')" type="button" class="btn btn-danger btn-sm">关闭</a>
	 </div>  
</div>
</body>
</html>
