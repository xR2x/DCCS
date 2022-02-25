var base = {
	init:function(){
		base.set();
	},
	set:function(){
		createForm.set({
			width:1000
			,title:"교대조 생성"
			,divisionType:null
			,service:"/master/shift/create"
			,beforeHandler:function(){

				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"master/shift/list"});
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
						,maxLength:5
						,width:200
						,dataType:"all"
						,must:true
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
	getHour:function(obj) {
		for(var i=0;i<24;i++){
			var data = (i+"").length==1?"0"+i:i+"";
			$(obj).append($("<option value='"+data+"'>"+data+"</option>"));
		}		
	},
	getMinute:function(obj) {
		for(var i=0;i<60;i++){
			var data = (i+"").length==1?"0"+i:i+"";
			$(obj).append($("<option value='"+data+"'>"+data+"</option>"));
		}		
	}
}
$(document).ready(base.init);