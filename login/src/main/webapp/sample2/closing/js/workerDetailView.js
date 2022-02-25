var base = {
	gop:null,
	workcenter:null,
	init:function(){
	
//		$.loading.make({ment:"데이터를 불러오는 중입니다."});

		base.headerLoad();

		base.set();
	},
	set:function(){
		base.columns = [
			{header:'기준일',name:'target_date', width:120, align:"center"}
			,{header:'작업자',name:'worker_name', width:120, align:"center"}
			,{header:'구분',name:'type_name',width:100,minWidth:100}
			,{header:'SO',name:'order_number',width:100,minWidth:100}
			,{header:'GOP',name:'gop', width:60}
			,{header:'작업장',name:'workcenter',width:100}
			,{header:'장비',name:'equipment_name',width:150}
			,{header:'작업공수(분)',name:'working_time', resizable: false, width:110}
			,{header:'잔업작업공수(분)',name:'over_working_time', resizable: false, width:110}
			,{header:'비가동공수(분)',name:'loss_time', resizable: false, width:110}
			,{header:'잔업비가동공수(분)',name:'over_loss_time', resizable: false, width:110} 
			,{header:'제외공수(분)',name:'except_time', resizable: false, width:110}
			,{header:'잔업제외공수(분)',name:'over_except_time', resizable: false, width:110}
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
			url:"/pop/closingWorker/read",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
					 	var data = json.data[0];
						$("#target_date").val(data.target_date);
						$("#worker_name").val(data.worker_name);
						$("#working_time").val(data.working_time);
						$("#over_working_time").val(data.over_working_time);
						$("#loss_time").val(data.loss_time);
						$("#over_loss_time").val(data.over_loss_time);
						$("#except_time").val(data.except_time);
						$("#over_except_time").val(data.over_except_time);
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
			worker:urlParam.get("worker")	
			,target_date:urlParam.get("target_date")	
			,sort:"start_date"
			,sortType:"asc"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/closingWorker/detailRead",
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