<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>云诊所平台登录</title>

<%@ include file="/common/meta.jsp" %>

<link rel="stylesheet" type="text/css" href="${ctx}/css/style.css" />
<script src="${ctx}/js/security/aes.js"></script>
<script src="${ctx}/js/security/login.js"></script>
<link href="${ctx}/css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div class="cloud_hole">
    	<div class="cloud_wbk">
        	<div class="cloud_top"><img src="${ctx}/images/logo.png"></div>
            <div class="cloud_main">
            	<div class="cloud_main_left"><img src="${ctx}/images/login_tp01.png"></div>
                <div class="cloud_main_right">
                	<div class="cloud_loginTop"><p>登 录</p></div>
                    <div class="cloud_center">
                    	<div class="cloud_inwk">
                        	<i class="login_icon1"></i>
            					<input id="idNumber" type="text" class="log_user" placeholder="请输入用户名"/>
                        </div>
                        <div class="cloud_inwk">
                        	<i class="login_icon2"></i>
                            <input id="password" type="password" class="log_pswd" placeholder="请输入密码"/>
                        </div>
                        <div class="cloud_duigou">
                        	<a href="javascript:void(0)">
                                <!--<i class="cloud_check_no"></i>-->
                                <i class="cloud_check_ok" id="log_check" onclick="chectPwd()"></i>
                                <span class="cloud_span01" onclick="chectPwd()">记住密码</span>
                            </a>
                            <a href="javascript:void(0)" class="cloud_forget">忘记密码？</a>
                        </div>
                        <div class="cloud_button"><a href="javascript:void(0)" onclick="checkuser()">登 录</a></div>
                    </div>
                </div>
            </div>
            <div class="cloud_bottom">技术支持：亚信软件</div>
        </div>
    </div>
</body>
</html>
