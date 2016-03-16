<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>医嘱模板</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
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
body{background:url("../../images/index/bg.png") repeat scroll 0 0;}
</style>
<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/ordTemplate/ordTemplate.js">
</script>

<script type="text/javascript"
	src="${ctx}/js/dhcc/chis/common/makePy.js">
</script>
</head>
<body>
<div id="leftSide" style="width: 20%; height: 100%; float: left">
   <!-- 左侧新建、修改、删除、刷新按钮 -->
   <fieldset style="margin:0 0 1px 0; padding-bottom: 5px;">     
	 <div id="toolbarLeft">
	    <table>
	       <tr>
	         <td><a href="javascript:newAddOrdTemplateCate()" id="newCateBtn" style="float: left" class="btn btn-success btn-de">新建</a></td>
	         <td><a href="javascript:ordTemplateCateUpdate()" id="updateCateBtn" style="float: left" class="btn btn-info btn-de">修改</a></td>
	         <td><a href="javascript:ordTemplateCateDelete()" id="deleteCateBtn" style="float: left" class="btn btn-danger btn-de">删除</a></td>
	         <td><a href="javascript:ordTemplateRefresh()" id="refreshCateBtn" style="float: left" class="btn btn-warning btn-de">刷新</a></td>
	       </tr>
	    </table>
	   </div>
    </fieldset>
    <!-- 左侧医嘱分类树 -->
    <fieldset style="margin:0 0 1px 0;">   
     <div id="ordTemplateCate" style="height: 506px;">
		<ul id="ordTemplateCateTree" class="tree" animate="true">
		</ul>
	 </div>
	
	</fieldset>
</div>

<div id="rightSide" title="医嘱字典" style="width: 79%;margin-left: 1px;float: left">
	   <!-- 右上查询、保存按钮 -->
	   <div id="toolbarRight" style  ="height: 25px;">
			<label style="height: auto;">字典名称:&nbsp</label> 
			    <input class="validatebox" id="ordDicNameInputStr" type="text" style="height: auto; width: 160px; font-size: 14px;"> 
				<button id="ordDicSearch" type="button" class="btn btn-primary btn-sm" onclick="javascript:ordDicquery()">查询</button>
				<button id="ordDicSave" type="button" class="btn btn-success btn-sm" onclick="javascript:ordDicSave()">保存</button>
				 
	   </div>
	   <!-- 右上dialog -->	
       <div style="height:240px">
		<table id="ordDicList"></table>
	   </div>
       <!-- 右中医嘱字典信息 -->
       <fieldset id="ordDicInput">   
			<div style="height: 40px">
			<table style="width: 100%;border:0">
				<tr align="right">
				   <td>医嘱类型: 
				    <input class="combobox" 	
											id="ordTypeId"
											style="width: 100px;"
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
				   <td>医嘱名称:
				   <input id="orddicname"  class="validatebox"  style="width: 200px;" type="text" name="orddicname" />
				   </td>
				   <td>医嘱子类:
				   <input class="combobox" 	
											id="ordCateid"
											style="width: 100px;"
											name="ordCateid"
											data-options="
											url:'${ctx}/dict/getDictContentList.ajax?dictName=ordType&grade=2',
											mode:'remote',
											editable:false,
											valueField:'value',
											textField:'description',
											pagination:false,
											panelHeight:'auto'">
				   </td>
				   <td>输入串:
				    <input id="orddicinputstr" class="validatebox"  style="width: 100px;" type="text" name="orddicinputstr" />
				   </td>
				</tr>
				<tr align="right">
					<td>停用标志:
					 <select id="isstop" class="combobox"  style="width: 100px;" name="isstop">  
		                       <option value="0" selected="selected">否</option>  
		                       <option value="1">是</option>  
		             </select> 
					</td>
					<td>备注:
					 <input id="notedes" class="validatebox"  style="width:200px" type="text" name="notedes" />
					</td>
				</tr>
			</table>
		  </div>
          </fieldset> 
            <!-- 右下医嘱字典明细datagrid -->    
			<div title="医嘱字典明细" style="height:222px">
		    <table id='ordDicGridList'  ></table>
			</div>
		
</div>
<!-- 左侧新建弹出dialog -->
<div id="ordTemplateCateDialog" class = "dialog" title="Modal Window" data-options="modal:true,closed:true,buttons:'#dialogButtons'" style="width: 540px; height: 270px">
 <form id="ordTemplateCateContent" method="post">
  <table border="0" cellpadding="5">
      <tr>
        <td align="right">
            <label style="font-size:18px;">上级名称:</label>
        </td>
        <td>
        <input id="upname"  style="text-align:center; width: 100%" readonly="readonly"/>
        </td>
        <td align="right">
            <label style="font-size:18px;">分类名称:</label>
        </td>
        <td>
          <input class="validatebox" id="dtordgrname" type="text" style="width: 100%" name="ordgrname" />
        </td>
      </tr>
      <tr>
        <td align="right">
         <label style="font-size:18px;">输入串:</label>
        </td>
        <td>
         <input class="validatebox" id="inputstr"  type="text" style="width: 100%" name="inputstr" />
        </td>
        <td align="right">
         <label style="font-size:18px;">叶子节点:</label>
        </td>
        <td>
          <select id="leaf" class="combobox" data-options="panelHeight:46" style="text-align:center; width: 100%" name="leaf">  
            <option value="0" selected="selected">否</option>  
            <option value="1">是</option>  
         </select> 
        </td>
      </tr>
      <tr>
      <td align="right"> 
       <label style="font-size:18px;">描述:</label>
      </td>
      <td  colspan="3">
      <textarea id="ordgrdes"  style="width: 100%;height: 100px;font-size: 12px;resize:none;" name='ordgrdes' ></textarea>
      </td>
      </tr>
  </table>
   <input class="validatebox" id="upid"  type="hidden" style="text-align:center; width: 100%" name="upid" />
   <input class="validatebox" id="grade"  type="hidden" style="text-align:center; width: 100%" name="grade" />
   <input class="validatebox" id="dtordgrid"  type="hidden" style="text-align:center; width: 100%" name="dtordgrid" />
  </form>
</div>
<div id="dialogButtons" style="text-align: center;">
	<button type="button" class="btn btn-success btn-sm" onclick="javascript:ordTemplateCateSave()">保存</button>
	<button type="button" class="btn btn-danger btn-sm" onclick="javascript:ordTemplateCateCancel()">关闭</button>
</div>
</body>
</html>
