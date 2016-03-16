
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>菜单管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script type="text/javascript" src="${ctx}/js/dhcc/chis/funcManagement/funcManagement.js"></script>
</head>
<body>
     <div id="funcManagement">
		<form id="aa">
			    菜单名称<input class="validatebox" id="funcName" type="text" style="height: 20px; width: 100px">&nbsp;&nbsp;                          
                                        上级菜单<input class="combobox" id="parentSeq" style="height: 25px; width: 100px"
		            data-options="
							url:'${ctx}/privilege/menuList.ajax',
							mode:'remote',
							editable:false,
							valueField:'funcId',
							textField:'funcName',
							pagination:false,
							panelHeight:'auto'"> &nbsp;&nbsp;
           <button class="btn btn-primary btn-sm" type="button" onclick="javascript:query()">查&nbsp;询</button>&nbsp;   
           <button onclick="addFunc()" class="btn btn-success btn-sm" type="button">新&nbsp;增</button>&nbsp;   
           <button onclick="updateFunc()" class="btn btn-info btn-sm" type="button">修&nbsp;改</button>&nbsp;
         <!--   <button onclick="deleteFunc()" class="btn btn-danger btn-sm" type="button">删&nbsp;除</button>     -->                                                                      
		</form>
	</div>
	<table id="func"></table>
	<div id="funcDlg" class="dialog" data-options="closed:true"
	     style="height:auto;width:300px;padding:10px;top:50px;">
	     <form id="funcForm" method="post">
	         <input id="seq"  style="display: none;"/>
	         <table cellpadding="2" border="1" cellspacing="0"  bordercolor="#0099FF" style="width:260;font-size:12px;">
	            <tr>
	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">菜单名称：</td>
	                <td align="center" style="width: 160px;">
				            <input class="validatebox" type="text" id="funcNameT" name="funcName" style="width: 160px;height:20px;"
				                    data-options="required:true"/>
				    </td>
	            </tr>	            
	            <tr>
	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">排序：</td>
	                <td align="center" style="width: 160px;">
				            <input class="validatebox" type="text" id="menuSeq" name="funcOrder" style="width: 160px;height:20px;"
				                    data-options="required:true"/>
				    </td>
	            </tr>
	            <!-- 
	            <tr>
	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">级次：</td>
				        <td align="center" style="width: 160px;">
				            <input class="combobox" type="text" name="dto.func.grade" style="width: 160px;height:20px;"
				                 id="grade"
				                 data-options="
										url:'${ctx}/funcManagement/funcManagementCtrl.htm?BLHMI=dictionaryList&dto.type=grade',
										mode:'remote',
										editable:false,
										valueField:'value',
										textField:'description',
										pagination:false,
										panelHeight:'auto',
										required:true"/>
				     </td>
	            </tr>
	             -->
	            <tr>
	                 <td bgcolor="#D7D7D7" align="right" style="width: 100px;">是否子节点：</td>
				     <td align="center" style="width: 160px;">
				                        是<input type="checkbox" id="leafY" name="isLeaf" value='1'  
				             style="width: 60px;height:20px;"/>
				                       否<input type="checkbox" id="leafN" name="isLeaf" value='0'  
				             style="width: 60px;height:20px;"/>
				     </td>
	            </tr>
	            <tr>
	                <td bgcolor="#D7D7D7" align="right" style="width: 100px;">上级菜单：</td>
				        <td align="center" style="width: 160px;">
				            <input class="combobox" type="text" name="parentSeq" style="width: 160px;height:20px;"
				                 id="parentSeqT"
				                 data-options="
										url:'${ctx}/privilege/menuList.ajax',
										mode:'remote',
										editable:false,
										valueField:'funcId',
										textField:'funcName',
										pagination:false,
										panelHeight:'auto',
										required:true"/>
				     </td>
	            </tr>
	            <tr>
	                 <td bgcolor="#D7D7D7" align="right" style="width: 100px;">访问地址：</td>
	                 <td align="center" style="width: 160px;">
				            <input class="validatebox" type="text" id="securityUrl" name="securityUrl" style="width: 160px;height:20px;" />
				     </td>	            
	            </tr>
	            <tr>
	                 <td bgcolor="#D7D7D7" align="right" style="width: 100px;">使用状态：</td>
				     <td align="center" style="width: 160px;">
				          <select class="combobox" type="text" id="useState" name="isstop" data-options="required:true" 
				                                   style="width: 160px;height:20px;">
				                   <option value='0'>公用菜单</option>
				                   <option value='2'>管理菜单</option>
				                   <option value='1'>停用</option>
				          </select>
				     </td>
	            </tr>
	         </table>
	     </form>
	     <div id="funcDlg-buttons" style="text-align: center;">
	             <button onclick="javascript:clearFunc()"  id="clear" class="btn btn-warning btn-sm" type="button">清空</button>
			     <button onclick="javascript:save()"  id="save" class="btn btn-success btn-sm" type="button">保存</button>
	             <button onclick="javascript:update()" id="update" class="btn btn-success btn-sm"  type="button">保存</button>
	             <button onclick="javascript:myclose()" id="close" class="btn btn-danger btn-sm" type="button">关闭</button>
	     </div>
	</div>
</body>
</html>
