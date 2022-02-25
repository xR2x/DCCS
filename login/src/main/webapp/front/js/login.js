var base = {
	init:function(){
		if($.cookie("rememberId") != null){
			$("#rememberId").prop("checked",true);
			$("#user_id").val($.cookie("rememberId"));
		}
		$("#loginWrap").slideDown(200,'swing',function(){
			if($.cookie("rememberId") != null){
				$("#password").focus();
			}else{
				$("#user_id").focus();
			}
		});
		$(".inputArea").keypress(function(e){
			if(e.which == "13"){
				base.login();
			}
		});
	},
	keyInput:function(obj){
		if(obj.value.search(/[^a-zA-Z0-9]/g, '') == 0){
			$.alert("한글은 입력하실 수 없습니다.");
		}
		obj.value = obj.value.replace(/[^a-zA-Z0-9]/g, '').replace(/(\..*)\./g, '$1');
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
							$.alert("아이디 또는 비밀번호를 다시 확인하세요.");
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
						$("#loginWrap").animate({"margin-top":-330},300).animate({top:-500},200);
						$("#login").delay(400).animate({width:270},200,function(){
							location.href = "/";
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