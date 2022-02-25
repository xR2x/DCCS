var base = {
	gop:null,
	workcenter:null,
	init:function(){		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});
		base.set();
		base.load();
	},
	set:function(){
		$("#workcenter").val(parent.base.selectWorkcenter+" - "+parent.$(".workCenterList ul[workcenter="+parent.base.selectWorkcenter+"]").attr("name"));
		$("#equipment").val(parent.$(".equipmentArea button[equipment_seq="+parent.base.selectEquipment+"]").html());
		$("#worker").val(parent.$(".workerInfo .btn-group[worker="+urlParam.get("worker")+"]").attr("workerInfo"));
	},
	load:function(){
		var param = {
			sort:"name"
			,sortType:"ASC"
			,use_check:true
			,type:"M"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/loss/read",
			data:param,
			success:function(json, status, res){
				try{
					createForm.list.create({
						name:"비가동"
						,list:true
						,effect:false
						,autoScroll:false
						,id:"workerLoss"
						,bodyHeight:310
						,listData:json.data
						,target:"form1"
						,columns:[
							{header:'비가동 명칭',name:'name',resizable: false,type:"text"}
							,{header:'설명',name:'remark',resizable: false,type:"text"}
							,{header:'선택',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color blue' onclick='base.select(this)'>선택</button>",attr:["seq"]}
						]
					});
					$.loading.del();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}  
		});
	},	
	select:function(obj){
		var lossSeq = $(obj).closest("td").attr("seq");
		parent.base.workerLossStart(urlParam.get("worker"),lossSeq);
		parent.popup.close();
	}
}
$(document).ready(base.init);