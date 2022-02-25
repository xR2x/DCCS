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
			url:"/master/project/read",
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
			,title:"Project 조회"
			,makeType:"view"
			,divisionType:null
			,service:"/master/project/create"
			,formData:formData
			,beforeHandler:function(){
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"master/project/list"});
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"Project"
						,id:"project_code"
						,type:"input"
						,width:200
						,dataType:"all"
						,must:true
					},
					{
						title:"Name"
						,id:"project_name"
						,type:"input"
						,width:760
						,dataType:"all"
						,must:true
					}
				]]
			}
		]});
	}	
}
$(document).ready(base.init);