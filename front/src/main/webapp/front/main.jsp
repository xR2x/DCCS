<%@ page contentType="text/html; charset=utf-8" %>
<!doctype html> 
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=0.8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="robots" content="index,nofollow"/>
<title>${title}</title>
<link rel="stylesheet" href="/front/common/css/style.css">
<link rel="stylesheet" href="/front/common/css/ui.css">
<link rel="stylesheet" href="/front/common/css/font.css">
<link rel="stylesheet" href="/front/common/css/button.css">
<link rel="stylesheet" href="/front/common/css/jquery.scrollbar.css">
<link rel="stylesheet" href="/front/common/css/jquery-ui.min.css">
<link rel="stylesheet" href="/front/common/css/jquery.toast.css">
<link rel="stylesheet" href="/front/front/css/main.css">
<link rel="stylesheet" href="/front/common/css/tui-grid.css">
<link rel="stylesheet" href="/front/common/css/ui.popup.css">
<link rel="stylesheet" href="/front/common/css/ui.search.css">
<link rel="stylesheet" href="/front/common/css/jquery.paging.css">
<link rel="stylesheet" href="/front/common/css/file.css">
<link rel="stylesheet" href="/front/common/css/ui.create.css">
<script type="text/javascript" src="/front/common/js/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.ui.touch-punch.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.scrollbar.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.toast.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.scannerdetection.js"></script>
<script type="text/javascript" src="/front/common/js/tui-grid.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.paging.js"></script>
<script type="text/javascript" src="/front/common/js/ui.popup.js"></script>
<script type="text/javascript" src="/front/common/js/ui.search.js"></script>
<script type="text/javascript" src="/front/common/js/ui.form.js"></script>
<script type="text/javascript" src="/front/common/js/ui.list.js"></script>
<script type="text/javascript" src="/front/common/js/ui.create.js"></script>
<script type="text/javascript" src="/front/common/js/ui.dialog.js"></script>
<script type="text/javascript" src="/front/common/js/ui.excel.js"></script>
<script type="text/javascript" src="/front/common/js/xlsx.full.min.js"></script>
<script type="text/javascript" src="/front/common/js/FileSaver.js"></script>
<script type="text/javascript" src="/front/common/js/ui.js"></script>
<script type="text/javascript" src="/front/common/js/file.js"></script>
<script type="text/javascript" src="/front/common/js/common.js"></script>
<script type="text/javascript" src="/front/front/js/main.js"></script>
</head>
<body>
	<div id="wrap">
		<div id="leftMenuArea">
			<div class="leftMenuWrap">
				<div class="logoArea"></div>
				<div class="calendarArea" id="datepicker"></div>
				<div class="mainMenuArea arrowWrap" id="mainMenuArea">
					<h1><span class='menuName'></span><span class='arrow'></span></h1>
					<div class="menuDropDown"></div>
				</div>
				<div class="subMenuArea scrollbar-inner">
					<div class="subMenuInner"></div>
				</div>
				<div class="menuSetup">모두열기 모두닫기</div>
			</div>
		</div>
		<div id="mainContentArea">
			<div id="mainHistoryArea">
				<a class="menu-trigger">
					<span></span>
					<span></span>
					<span></span>
				</a>
				<span class='userInfo'><strong><%=session.getAttribute("name")%></strong>님 안녕하세요. <a onclick="main.logout()">로그아웃</a><!--<a onclick="main.checkLoginSession()">test</a>--></span>
			<!--
				<div class="tab"><span>a</span></div>
				<div class="tab"><span>a</span></div>
				<div class="tab on"><span>a</span></div>
				<div class="tab"><span>a</span></div>
				<div class="tab"><span>a</span></div>
				<div class="tab"><span>a</span></div>
				<div class="tab"><span>a</span></div>
			-->
			</div>
			<div id="mainTitleArea">
				<h1></h1>
			</div>
			<div id="mainContent" class="mainContent scrollbar-inner">
			</div>
		</div>
		<div id="mainStatusArea"></div>
	</div>
</body>
</html>