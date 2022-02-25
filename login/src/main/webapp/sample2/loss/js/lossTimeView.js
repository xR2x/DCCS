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
			url:"/pop/lossTime/read",
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
			,title:"정기 비가동 조회"
			,makeType:"view"
			,divisionType:null
			,service:"/pop/lossTime/create"
			,formData:formData
			,beforeHandler:function(){
				var from  = new Date("2021", "01", "01", $("#start_time1").val(), $("#start_time2").val());
				var to  = new Date("2021", "01", "01", $("#end_time1").val(), $("#end_time2").val());
				if(from.getTime() >= to.getTime()) {
					$.alert("정상적인 시간을 입력해 주세요. (시작시간은 종료시간과 같거나 클수 없습니다.)");
					$("#start_time1").focus();
					return false;
				}		
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"pop/loss/lossTimeList"});
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"Type"
						,id:"type_name"
						,type:"input"
						,width:200
						,dataType:"all"
						,must:true
					},
					{
						title:"Name"
						,id:"name"
						,type:"input"
						,width:640
						,dataType:"all"
						,must:true
					},{
						title:"휴일"
						,id:"holiday_flag"
						,type:"input"
						,titleAlign:"center"
						,checked:(formData[0].holiday_flag == "X")?true:false
						,switch:true
						,value:"X"
						,margin:"0 20px"
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