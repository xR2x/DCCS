var base = {
	init:function(){
		base.set();
	},
	set:function(){
		createForm.set({
			width:1000
			,title:"가동시간 생성"
			,divisionType:null
			,service:"/master/workType/create"
			,beforeHandler:function(){

				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"master/calendar/workTypeList"});
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"가동코드"
						,id:"work_type"
						,type:"input"
						,width:200
						,dataType:"all"
						,must:true
						,maxLength:1
					},
					{
						title:"Name"
						,id:"remark"
						,type:"input"
						,width:760
						,dataType:"all"
						,must:true
					}  
				],[
					{
						title:"시작(시간) "
						,id:"time_from1"
						,type:"select"
						,width:240
						,data:base.getHour
						,dataType:"all"
						,must:true
					},
					{
						title:"시작(분)"
						,id:"time_from2"
						,type:"select"
						,width:230
						,data:base.getMinute
						,dataType:"all"
						,must:true
					},
					{
						title:"종료(시간)"
						,id:"time_to1"
						,type:"select"
						,width:240
						,data:base.getHour
						,dataType:"all"
						,must:true
					},
					{
						title:"종료(분)"
						,id:"time_to2"
						,type:"select"
						,width:230
						,data:base.getMinute
						,dataType:"all"
						,must:true
					} 

				]]
			},{
				name:"Break Time 정보"
				,list:true
				,id:"breakType"
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:[
					{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
					,{header:'Name',name:'remark',resizable: false, type:"input",must:true,focus:true}
					,{header:'시작(시간)',name:'time_from1', width:100,resizable: false, type:"select",must:true,data:base.getHour}
					,{header:'시작(분)',name:'time_from2', width:100, resizable: false,type:"select",must:true,data:base.getMinute}
					,{header:'종료(시간)',name:'time_to1',resizable: false,width:100,type:"select",must:true,data:base.getHour}
					,{header:'종료(분)',name:'time_to2',resizable: false,width:100,must:true,type:"select",data:base.getMinute}
					,{header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='createForm.list.remove(this)'>삭제</button>"}
				]
			}
		]});
		base.make();
	},
	make:function(){
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("추가");
		add.click(function(){
			createForm.list.addRow(null,"form1");
		});
	},
	getHour:function(obj) {
		for(var i=0;i<33;i++){
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