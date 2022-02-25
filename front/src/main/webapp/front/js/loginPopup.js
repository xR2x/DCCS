var base = {
	init:function(){
		if($.cookie("rememberId") != null){
			$("#rememberId").prop("checked",true);
			$("#user_id").val($.cookie("rememberId"));
		}
		if($.cookie("rememberId") != null){
			$("#password").focus();
		}else{
			$("#user_id").focus();
		}
		$(".inputArea").keypress(function(e){
			if(e.which == "13"){
				base.login();
			}
		});
	},
	login:function(){
		var param = {
			user_id:$("#user_id").val()
			,password:$("#password").val()
		};
		$(".loginBtn").html("<div class='loading'><div class='lds-dual-ring'></div>로그인 중입니다.</div>").prop("disabled",true);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/front/login",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error){
						$("#loginWrap").effect("shake",{direction:"left",distance:"5"},250,function(){
							parent.$.alert("아이디 또는 비밀번호를 다시 확인하세요.");
							$("#user_id").focus();
							$(".loginBtn").html("LOGIN").prop("disabled",false);
						});
						return false;
					}else{
						if($("#rememberId").prop("checked") == true){
							$.cookie("rememberId",$("#user_id").val(),{ expires: 365, path: '/', secure: false});
						}else{
							$.cookie("rememberId",null,{ expires: -1, path: '/'});
						}
						$("#login").delay(400).animate({opacity:1},200,function(){
							parent.$.info("정상적으로 로그인 되었습니다.");
							parent.popup.close();
						});
					}
				}catch(e){
					console.log(e);
				}finally{
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	}
}
$(document).ready(base.init);