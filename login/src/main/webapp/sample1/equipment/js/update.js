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
			url:"/master/equipment/read",
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
			,title:"장비 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
			}
			,service:"/master/equipment/update"
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
						title:"장비코드"
						,id:"equipment_code"
						,type:"input"
						,width:250
						,maxLength:10
						,must:true
						,disable:true
					},{
						title:"장비명"
						,id:"equipment_name"
						,type:"input"
						,width:550
						,maxLength:40
						,must:true
					},{
						title:"Spindle 수"
						,id:"spindle"
						,type:"input"
						,width:150
						,dataType:"int"
						,must:true
					}
				],[
					{
						title:"Remark"
						,id:"remark"
						,type:"textarea"
						,width:970
						,height:100
					}
				]]
			}
		]});
	}
}
$(document).ready(base.init);