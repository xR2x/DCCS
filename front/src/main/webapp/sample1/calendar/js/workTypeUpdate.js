var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq"),
			breakType:true
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workType/read",
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
		var listData = data.breakType;
		createForm.set({
			width:1000
			,title:"가동시간 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
			}
			,service:"/master/workType/update"
			,formData:formData
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
						title:"가동코드"
						,id:"work_type"
						,type:"input"
						,width:200
						,dataType:"all"
						,must:true
						,disable:true
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
				,listData:listData
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
	getHour:function(obj,dataParam) {
		var param = common.makeParam(dataParam);
		for(var i=0;i<33;i++){
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