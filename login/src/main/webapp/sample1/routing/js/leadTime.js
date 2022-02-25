var base = {
	gop:null,
	workcenter:null,
	init:function(){
		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});

		$("#material").val(parent.$("#material").val());

		base.gop = parent.$("tr input[name=gop]").eq(parent.base.targetTr.index()).val();

		$("#gop").val(base.gop);

		base.workcenter = parent.$("tr select[name=workcenter]").eq(parent.base.targetTr.index()).val();

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

		base.onlyNum();
		base.set();

	},
	onlyNum:function() {	
		$("input[num=true]").each(function(){			
			$(this).on("input",function(){
				$(this).val($(this).val().replace(/[^0-9]/g,''));
			});								 
		});					
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
				{header:'장비',name:'equipment_seq',resizable: false,type:"select",data:base.getEquipment,dataParam:{"workcenter":base.workcenter,"wc_spindle":true},focus:true,onChange:function(){$(this).closest("tr").find("input[name=spindle]").val($(this).find("option:selected").attr('wc_spindle'));}}
				,{header:'Setup(분)',name:'setup',resizable: false,width:90,maxLength:6,type:"input",dataType:"decimal",point:3}
				,{header:'Run(분)',name:'run',resizable: false,width:90,maxLength:6,type:"input",dataType:"decimal",point:3}
				,{header:'Remove(분)',name:'remove',resizable: false,width:90,maxLength:6,type:"input",dataType:"decimal",point:3}
				,{header:'Spindle 수',name:'spindle',resizable: false,width:90,maxLength:4,type:"input",dataType:"int"}
				,{header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='createForm.list.remove(this)'>삭제</button>"}
			]
		});		
		base.make();
		$.loading.del();
	},	
	getEquipment:function(obj,dataParam,handler){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/equipment/read",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var selected = "";
						$(obj).append("<option value='"+data.seq+"' "+selected+" spindle='"+data.spindle+"' wc_spindle='"+data.wc_equipment_spindle+"'>"+(data.equipment_name?data.equipment_name:"")+"</option>");
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
					if(handler){
						handler.call(this);
					}
				}catch(e){
					console.log(e);
				}finally{
				}
			},
			error:function(e){
				console.log(e);
			}  
		});
	},

	make:function(){			   		
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("장비추가");
		add.click(function(){
			createForm.list.addRow(null,"form1");
		});          
	},
	save:function(){	  
		var spaceCheck = false;	  
		$("tr select[name=equipment_seq]").each(function() {
			if($(this).val()=="") {
				spaceCheck = true;
				return false;											
			}
		});                      
		
		if(spaceCheck == true) {
			$.alert("장비를 선택해 주세요.");
			return false;											
		}

		var valueCheck = false;	  
		$("tr input").each(function() {
			if($(this).val()=="") {
				valueCheck = true;
				return false;											
			}
		});                      
		
		if(valueCheck == true) {
			$.alert("추가한 장비의 Setup/Run/Remove/Spindle 수 <br>항목을 입력해 주세요.");
			return false;											
		}

		if(base.equipmentCheck() == false) {
			$.alert("동일한 장비가 등록되어 있습니다. 수정해 주세요.");
			return false;
		}

		delete parent.base.leadTimeData[base.gop+"|"+base.workcenter];

		parent.base.leadTimeData[base.gop+"|"+base.workcenter] = {
		 	material:$("#material").val()
			,gop:$("#gop").val()
			,workcenter:$("#workcenter").val()
			,setup:$("#setup").val()
			,run:$("#run").val()
			,remove:$("#remove").val()			
		}					  

		delete parent.base.leadTimeEquipmentData[base.gop+"|"+base.workcenter];		

		parent.base.leadTimeEquipmentData[base.gop+"|"+base.workcenter] = [];

		for(var i=0;i<$(".tui-grid-rside-area tr.tui-grid-row").length;i++){

			var index = $(".tui-grid-rside-area tr.tui-grid-row").eq(i).index();

			var equipment_seq	= $("tr select[name=equipment_seq]").eq(index).val();
			var setup			= $("tr input[name=setup]").eq(index).val();
			var run				= $("tr input[name=run]").eq(index).val();
			var remove			= $("tr input[name=remove]").eq(index).val();
			var spindle			= $("tr input[name=spindle]").eq(index).val();

			var data = {
				equipment_seq:equipment_seq
				,setup:setup
				,run:run
				,remove:remove
				,spindle:spindle
			}													   
			parent.base.leadTimeEquipmentData[base.gop+"|"+base.workcenter].push(data);
		}

		parent.popup.close();
	},
	equipmentCheck:function(){	   
		var check = true;		   
		var array = new Array();   
		for(var i=0;i<$("select[name=equipment_seq]").length;i++ ) {
			array.push($("select[name=equipment_seq]").eq(i).val());
		}
		const set = new Set(array);
		if(set.size != array.length) {
			check = false;			  
		}		  
		return check;
	}
}
$(document).ready(base.init);