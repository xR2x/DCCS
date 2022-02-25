var base = {
	gop:null,
	workcenter:null,
	init:function(){
	
		base.headerLoad();

		base.set();
	},
	set:function(){
		base.columns = [
			{header:'기준일',name:'target_date', width:120, align:"center"}
			,{header:'장비코드',name:'equipment_code', width:120, align:"center"}
			,{header:'장비',name:'equipment_name',width:100,minWidth:100}
			,{header:'분류',name:'type_name',width:100,minWidth:100}
			,{header:'SO',name:'order_number',width:100,minWidth:100}
			,{header:'GOP',name:'gop', width:60}
			,{header:'작업장',name:'workcenter',width:100}									  
			,{header:'작업공수(분)',name:'working_time', resizable: false, width:110}
			,{header:'셋업공수(분)',name:'setup_time', resizable: false, width:110}
			,{header:'비가동공수(분)',name:'loss_time', resizable: false, width:110}
			,{header:'시작시간',name:'start_date', resizable: false, width:120}
			,{header:'종료시간',name:'end_date', resizable: false, width:120}				 	
			,{header:'Material',name:'material', resizable: false, width:200}
			,{header:'Plant',name:'plant',width:80}							 
			,{header:'Description',name:'description', resizable: false, minWidth:200}		 			
		];
		base.grid = new tui.Grid({
			el: document.getElementById('grid'),
			bodyHeight: 430,
			afterLoad:true,
			rowHeight:45,
			scrollX: true,
			scrollY: true,
			columns:[],
			columnOptions: {
				frozenCount: 3,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			}
		});
		base.grid.setColumns(base.columns);
		base.load(); 
	},  
	headerLoad:function(){
		var param = {
			seq:urlParam.get("seq")			
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/closingEquipment/read",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
					 	var data = json.data[0];
						$("#target_date").val(data.target_date);
						$("#equipment_code").val(data.equipment_code);
						$("#equipment_name").val(data.equipment_name);
						$("#working_time").val(data.working_time);
						$("#setup_time").val(data.setup_time);
						$("#loss_time").val(data.loss_time);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			} 
		});
	},
	load:function(){
		var param = {
			equipment_seq:urlParam.get("equipment_seq")	
			,target_date:urlParam.get("target_date")	
			,sort:"start_date"
			,sortType:"asc"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/closingEquipment/detailRead",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
						base.gridData = base.makeData(json.data);
						base.grid.resetData(base.gridData);
					}
				}catch(e){
					console.log(e);
				}finally {
					$.loading.del();
				}
			},
			error:function(e){
				console.log(e);
			} 
		});
	},
	makeData:function(json){
		var result = [];
		for(var i=0;i<json.length;i++){
			result[i] = json[i];

			if(result[i].type != "O"){
				result[i]._attributes = {
					className : {row:['loss']}
				}
			}
		}
		return result;
	}
}
$(document).ready(base.init);