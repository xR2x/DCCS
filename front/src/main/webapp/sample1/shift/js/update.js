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
			url:"/master/shift/read",
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
			,title:"교대조 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,service:"/master/shift/update"
			,formData:formData
			,defaultValue:{
				seq:hash.get("seq")
			}
			,beforeHandler:function(form){
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
						title:"Shift"
						,id:"code"
						,type:"input"
						,width:200
						,dataType:"all"
						,maxLength:5
						,must:true
						,disable:true
					},
					{
						title:"Name"
						,id:"name"
						,type:"input"
						,maxLength:50
						,width:760
						,dataType:"all"
						,must:true
					}      
				],[
					{
						title:"시작(시간) "
						,id:"start_time1"
						,type:"select"
						,width:240
						,data:base.getHour
						,dataType:"all"
						,must:true
					},
					{
						title:"시작(분)"
						,id:"start_time2"
						,type:"select"
						,width:230
						,data:base.getMinute
						,dataType:"all"
						,must:true
					},
					{
						title:"종료(시간)"
						,id:"end_time1"
						,type:"select"
						,width:240
						,data:base.getHour
						,dataType:"all"
						,must:true
					},
					{
						title:"종료(분)"
						,id:"end_time2"
						,type:"select"
						,width:230
						,data:base.getMinute
						,dataType:"all"
						,must:true
					} 

				]]
			}
		]});
	},
	getHour:function(obj,dataParam) {
		var param = common.makeParam(dataParam);
		for(var i=0;i<24;i++){
			var data = (i+"").length==1?"0"+i:i+"";
			$(obj).append($("<option value='"+data+"'>"+data+"</option>"));
		}
		if(param.value){
			setTimeout(function(){
				$(obj).val(param.value);
			},10);
		}		
	},
	getMinute:function(obj,dataParam) {
		var param = common.makeParam(dataParam);
		for(var i=0;i<60;i++){
			var data = (i+"").length==1?"0"+i:i+"";
			$(obj).append($("<option value='"+data+"'>"+data+"</option>"));
		}
		if(param.value){
			setTimeout(function(){
				$(obj).val(param.value);
			},10);
		}		
	}
}
$(document).ready(base.init);