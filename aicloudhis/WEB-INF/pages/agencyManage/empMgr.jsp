<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>




<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
<!-- 公共查询人员信息页面 -->
<title>人员管理</title>

<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/common.js"></script>
<script type="text/javascript" src="${ctx}/js/commonUI.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/comUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/commonValidate.js"></script>
<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<style type="text/css">
/* a:link {
	color: #333333;
} */
</style>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/empMgr/empMgr.js"></script>
<script type="text/javascript" src="${ctx}/js/dhcc/chis/common/PYjm.js"></script>

</head>
<body style="overflow: hidden;">
	<table border=0 style="width: 1199px;">
		<tr>
			<td>
				<div>
					<fieldset style="margin: 0px; padding: 0px 10px 3px 10px;">
						<legend>人员列表</legend>
						<div style="height: 340px;">
							<table id="empDg"></table>
						</div>
					</filedset>
				</div>

				<div>
					<fieldset style="margin: 0px; padding: 0px 10px 3px 10px;">
						<legend>基本信息</legend>
						<div style="height: 105px; background-color: #FFFFFF; border: 1px solid #D4D4D4;">
							<form id="empForm" method="post">
								<input id="clickFlag" type="hidden">
								<table border=0 style="width: 100%;">
									<tr>
									<td colspan="8" align="center">
										<!-- <a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'chis-add'" onclick="addEmp(); return false;">新增</a> 
										<a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'chis-edit'" onclick="updateEmp(); return false;">修改</a> 
										<a href="javascript:void(0)" class="linkbutton" data-options="iconCls:'chis-subtract'" onclick="clearEmpForm(); return false;">清空</a> -->
										<button type="button" class="btn btn-success btn-sm" onclick="addEmp();">新    增</button>
										<button type="button" class="btn btn-info btn-sm" onclick="updateEmp();">修    改</button>
										<button type="button" class="btn btn-danger btn-sm" onclick="clearEmpForm();">清    空</button>
									</td>
									</tr>
									<tr>
										<!-- 人员编号： --><input id="empidT" type="hidden" style="width: 105px;" name="emp.empid">
										<!-- 登陆账户表id： --><input id="loginAccountidT" type="hidden" style="width: 105px;" name="loginAccount.accountId">
										<td align="right"><font style="font-family: '宋体', Simsun;">姓名：</font></td>
										<td><input id="empnameT" type="text"  class="validatebox" style="width: 105px;" name="emp.empName" data-options="required:true" /></td> 
										<td align="right">姓名字符：</td>
										<td><input id="inputstrT" type="text" style="width: 105px;" name="emp.inputstr" /></td>
									   	<td align="right"><font style="font-family: '宋体', Simsun;">登陆名：</font></td>
									   	<td><input id="loginNameT" type="text"  class="validatebox" style="width: 105px;" name="emp.loginName" onblur="loginNameIsRepeat()"
									   		onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\@\._~-]/g,'')"  data-options="required:true">  <!-- 不能输入中文 -->
									   	<span id="loginNameFlag" style="font-size: 12px; color: #FF0000; display: none;" >*此登录名已存在</span></td>
										<td align="right">登陆密码：</td>
										<td><input id="empPwdT" type="password" class="validatebox" style="width: 105px;" name="emp.empPwd" 
														onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\@\.]/g,'')" data-options="required:true"/> 
											<!-- 显示<input id="changCkb" type="checkbox" style="margin-bottom: 4px;" onclick="changeType()"> -->
										</td>
									</tr>
									<tr>
										<td align="right">联系电话：</td>
										<td><input id="empTelenumT" type="text" style="width: 105px;" name="emp.empTelenum" onkeyup="value=value.replace(/[\D]/g,'')"/> </td>
										<td align="right"><font style="font-family: '宋体', Simsun;">类型：</font></td>
										<td><input class="combobox" id="empTypeidT" style="width: 105px;" name="emp.empTypeid" />
										</td>
										<td align="right"><font style="font-family: '宋体', Simsun;">职称：</font></td>
										<td><input class="combobox" id="empTitleidT"  style="width: 105px;" name="emp.empTitleid" />
										</td>
										<td align="right">所属科室：</td>
										<td><input id="orgidT" class="combobox"  style="width: 105px;" name="emp.orgid"/>
										<!-- 科室名称 -->	<input id="orgnameT" type="hidden" name="emp.orgname"/>
									</tr>
									<tr>
									<td align="right">详细地址：</td>
									<td colspan="3"><input id="userAddrT" type="text" style="width: 492px;" name="emp.empAddr" /></td>
									<td align="right">是否停止：</td>
									<td><select id="stopflagT" style="width: 40px; margin-bottom: 0px; padding: 0px;" name="stopflag">
												<option value="1">是</option>
												<option value="0" selected="selected">否</option>
										</select>
									</td>
									</tr>
								</table>
							</form>
						</div>
					</filedset>
				</div>
<!-- 
				<div>
					<fieldset style="margin: 0px; padding: 0px 10px 10px 10px;">
						<legend>人员权限</legend>
						<div style="height: 50px; background-color: #FFFFFF; border: 1px solid #D4D4D4;">
							暂未开发
						</div>
					</filedset>
				</div> -->
			</td>
		</tr>
	</table>
	<div id="empDgToolbar">
		诊所：<select id="hospSelect" class="combobox" style="width: 170px;">
				<option value="demo" selected="selected">云诊所</option>
			</select>
		科室：<input id="orgSelect" />
		<button type="button" class="btn btn-success btn-sm" onclick="queryEmp();">查 询</button>
	</div>
</body>
</html>
