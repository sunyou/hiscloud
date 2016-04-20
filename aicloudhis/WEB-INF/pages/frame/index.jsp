<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>
<%@ include file="/common/meta.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content="All" name="Robots" />
<meta name="Generator" content="Notepad" />
<meta name="Copyright" content="" />
<meta name="Description" content="" />
<meta name="Keywords" content="" />
<title>亚信咸阳市秦都区安虹路利民云诊所系统</title>
<link href="${ctx}/css/home.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/css/index/dhcc_common.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/css/index/mySchedule.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="${ctx}/js/jquery/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${ctx}/js/bootstrap.min.js"></script>
<script language="javascript" src="${ctx}/js/jquery.placeholder.min.js" ></script>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="http://apps.bdimg.com/libs/html5shiv/3.7/html5shiv.min.js"></script>
    <script src="http://apps.bdimg.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script type="text/javascript">
        $(function () {
            // Invoke the plugin
            $('input, textarea').placeholder();
        });
    </script>
    <!--[if IE 6]>
    <script src="js/iepng.js" type="text/javascript"></script>
    <script type="text/javascript">
        EvPNG.fix('div, ul, img, li, input');
    </script>
    <![endif]-->
</head>

<body>
<div class="wrap home">
    <div class="logo"><a href=""><img src="${ctx}/images/logo2.png" /> </a></div>
    <div class="h-menu">
        <ul>
            <li id="schedual">
                <a href="#"><img src="${ctx}/images/h-icon1.png" width="69" height="69" /><br />我的日程 </a>
            </li>
            <li id="notice">
                <a href="#"><img src="${ctx}/images/h-icon2.png" width="69" height="69" /><br/>公 告</a>
            </li>
            <li id="message">
                <a href="#"><img src="${ctx}/images/h-icon3.png" width="69" height="69" /><br />通 知</a>
            </li>
            <li id="system">
                <a href="${ctx }/frame/mainFrame.html"><img src="${ctx}/images/h-icon5.png" width="69" height="69" /><br />患者管理</a>
            </li>
            <div class="clear"></div>
            </br> </br>
            <li id="system">
                <a href="${ctx }/frame/mainFrame.html?id=4"><img src="${ctx}/images/h-icon6.png" width="69" height="69" /><br />预约管理</a>
            </li>
            <li id="system">
                <a href="${ctx }/frame/mainFrame.html?id=5"><img src="${ctx}/images/h-icon7.png" width="69" height="69" /><br />诊疗管理</a>
            </li>
            <li id="system">
                <a href="${ctx }/frame/mainFrame.html?id=6"><img src="${ctx}/images/h-icon9.png" width="69" height="69" /><br />收费管理</a>
            </li>
            <li id="system">
                <a href="${ctx }/frame/mainFrame.html"><img src="${ctx}/images/h-icon4.png" width="69" height="69" /><br />进入系统</a>
            </li>
        </ul>
    </div>
    <div id="noticeDiv" class="floatWindow hidden">
         <h5>公 告</h5>
         <ol>
             <li><a href="#">· 习近平:走出符合国情文物保护利用之路</a> </li>
             <li><a href="#">· 营改增试点将推行 百万房价少交税2400元</a> </li>
             <li><a href="#">· 揭秘联合国秘书长8名候选人:7人曾访华</a> </li>
             <li><a href="#">· 中国海警船解救被印尼扣押渔船细节曝光</a> </li>
             <li><a href="#">· 媒体:是台湾自己丢掉亚投行 并非"矮化"</a> </li>
         </ol>
     </div>
     		<input type="hidden" id="startTime" name="startTime"/>
		<input type="hidden" id="endTime" name="endTime"/>
     <div id="schedualDiv" class="floatWindow hidden">
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
</div>




<!--copyright begin-->
<div class="wrap copyright"><i class="asiaLogo"></i> ©2015 北京亚信融创科技有限公司. All rights reserved.</div>
<!--copyright end-->
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/moment.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lib/jquery-ui.custom.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.min.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/fullcalendar.js"></script>
<script type="text/javascript" src="${ctx}/js/index/fullcalendar-2.0.2/lang-all.js"></script>
<script type="text/javascript" src="${ctx}/js/index/dateUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/index/jquery.calandar.js"></script>
<%--<script type="text/javascript" src="${ctx}/js/dhcc/chis/index-content/index-content.js"></script>
--%><script type="text/javascript" src="${ctx }/js/dhcc/chis/home/home.js"></script>
</body>
</html>

