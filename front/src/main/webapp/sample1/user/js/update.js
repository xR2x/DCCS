var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/user/read",
			data:param,
			success:function(json, status, res){
				try{
					base.set(json);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	},
	set:function(data){
		var formData = data.data;
		createForm.set({
			width:1000
			,title:"사용자 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,service:"/master/user/update"
			,formData:formData
			,beforeHandler:function(){
				if($("#password").val() != $("#password_check").val()) {
					$.alert("입력한 비밀번호가 다릅니다.");
					return false;
				}		   
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					location.reload();
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"ID"
						,id:"id"
						,type:"input"
						,width:180
						,must:true
						,disable:true
					},
					{
						title:"성명"
						,id:"name"
						,type:"input"
						,width:280
						,maxLength:50
						,must:true
					},
					{
						title:"비밀번호"
						,id:"password"
						,type:"input"
						,password:true
						,width:240
						,maxLength:200
//						,must:true
					},
					{
						title:"비밀번호확인"
						,id:"password_check"
						,type:"input"
						,password:true
						,width:240
						,maxLength:200
//						,must:true
					}
				],[						
					{
						title:"부서"
						,id:"department"
						,type:"input"
						,width:560
						,maxLength:50
						,must:true
					},
					{
						title:"직급"
						,id:"position"
						,type:"input"
						,width:400
						,maxLength:50
						,must:true
					}                      
				],[
					{
						title:"Tel"
						,id:"tel"
						,type:"input"
						,width:220
						,maxLength:50
						,must:true
					},
					{
						title:"Mobile"
						,id:"mobile"
						,type:"input"
						,width:220
						,maxLength:100
						,must:true
					},
					{
						title:"Email"
						,id:"email"
						,type:"input"
						,maxLength:100
						,width:510
						,must:true
					}                          
				]]
			}
		]});
	}	
}
$(document).ready(base.init);