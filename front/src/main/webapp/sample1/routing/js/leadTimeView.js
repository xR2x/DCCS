var base = {
	gop:null,
	workcenter:null,
	init:function(){
		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});

		createForm.option = {makeType:"view"};

		$("#material").val(parent.$("#material").val());

		base.gop = parent.$("tr input[name=gop]").eq(parent.base.targetTr.index()).val();

		$("#gop").val(base.gop);

		base.workcenter = (parent.$("tr select[name=workcenter]").eq(parent.base.targetTr.index()).length > 0)?parent.$("tr select[name=workcenter]").eq(parent.base.targetTr.index()).val():parent.$("tr input[name=workcenter]").eq(parent.base.targetTr.index()).val();

		$("#workcenter").val(base.workcenter);

		if(parent.base.leadTimeData[base.gop+"|"+base.workcenter]) {			 
			var data = parent.base.leadTimeData[base.gop+"|"+base.workcenter];
			$("#setup").val(data["setup"]);
			$("#run").val(data["run"]);
			$("#remove").val(data["remove"]);
		}else {
			$("#setup").val("0");
			$("#run").val("0");
			$("#remove").val("0");
		}
		base.set();
	},			   
	set:function(){		
		var listData = parent.base.leadTimeEquipmentData[base.gop+"|"+base.workcenter];
		createForm.list.create({
			name:"공정정보"
			,list:true
			,id:"routing"
			,listData:listData
			,bodyHeight:280
			,target:"form1"
			,columns:[
				{header:'장비',name:'equipment_name',resizable: false,type:"input",focus:true}
				,{header:'Setup(분)',name:'setup',resizable: false,width:90,maxLength:4,type:"input",dataType:"int"}
				,{header:'Run(분)',name:'run',resizable: false,width:90,maxLength:4,type:"input",dataType:"int"}
				,{header:'Remove(분)',name:'remove',resizable: false,width:90,maxLength:4,type:"input",dataType:"int"}
				,{header:'Spindle 수',name:'spindle',resizable: false,width:90,maxLength:4,type:"input",dataType:"int"}				
			]
		});		
		$.loading.del();
	}
}
$(document).ready(base.init);