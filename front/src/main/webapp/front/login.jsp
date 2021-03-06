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
<link rel="stylesheet" href="/front/front/css/login.css">
<script type="text/javascript" src="/front/common/js/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery-ui.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.scrollbar.min.js"></script>
<script type="text/javascript" src="/front/common/js/jquery.toast.js"></script>
<script type="text/javascript" src="/front/common/js/ui.js"></script>
<script type="text/javascript" src="/front/common/js/common.js"></script>
<script type="text/javascript" src="/front/front/js/login.js"></script>
</head>
<body>
	<div id="wrap">
		<div id="login">
			<div id="loginWrap">
				<div class="logoArea"></div>
				<div class="loginArea">
					<div class="mentArea"></div>
					<div class="inputArea">
						<div><input type="text" id="user_id" placeholder="USER ID" oninput="base.keyInput(this)" autocomplete="off"></div>
						<div><input type="password" id="password" placeholder="PASSWORD"></div>
					</div>
					<div class="rememberArea">
						<label class="switch">
							<input type="checkbox" class="switch-input" id="rememberId">
							<span class="switch-label" data-on="On" data-off="Off"></span>
							<span class="switch-handle"></span>
						</label>
						<label class="rememberMent" for="rememberId">????????? ????????????</label>
					</div>
					<div class="btnArea">
						<button type="submit" onclick="base.login()" class="loginBtn">LOGIN</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>