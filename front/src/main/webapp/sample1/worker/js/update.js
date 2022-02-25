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
			url:"/master/worker/read",
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
			,title:"작업자 및 자격 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,service:"/master/worker/update"
			,formData:formData
			,beforeHandler:function(){
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
						title:"작업자 ID"
						,id:"worker"
						,type:"input"
						,width:480
						,maxLength:16
						,dataType:"all"
						,must:true
						,disable:true
					},
					{
						title:"Shift"
						,id:"shift"
						,type:"select"
						,width:480
						,dataType:"all"
						,data:common.getShiftCode
						,must:true
					}
				],[
					{
						title:"Remark"
						,id:"remark"
						,type:"input"
						,width:970
						,dataType:"all"
						,must:true
					}
				]]
			}
		]});
	}	
}
$(document).ready(base.init);