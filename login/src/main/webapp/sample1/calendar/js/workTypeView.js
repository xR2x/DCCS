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
			,title:"가동시간 조회"
			,makeType:"view"
			,divisionType:null
			,service:"/master/workType/read"
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
					{header:'Name',name:'remark',resizable: false, type:"input"}
					,{header:'시작(시간)',name:'time_from1', width:100,resizable: false, type:"input"}
					,{header:'시작(분)',name:'time_from2', width:100, resizable: false,type:"input"}
					,{header:'종료(시간)',name:'time_to1',resizable: false,width:100,type:"input"}
					,{header:'종료(분)',name:'time_to2',resizable: false,width:100,type:"input"}
				]
			}
		]});
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