var base = {
	gridData:null,
	init:function(){
		base.set();
		base.load();
	},
	set:function(){
		base.columns = [
			{header:'Material',name:'material', width:200, align:"center"}
			,{header:'Plant',name:'plant',width:100,minWidth:100}
			,{header:'Revision',name:'revision', resizable: false, width:100}
			,{header:'상태',name:'status_name' ,width:100}
			,{header:'처리자',name:'creator_name', width:100}
			,{header:'처리일',name:'create_date', width:120}
			,{header:'Remark',name:'remark', resizable: false, minWidth:100}
		];
		base.grid = new tui.Grid({
			el: document.getElementById('grid'),
			bodyHeight: 470,
			afterLoad:true,
			rowHeight:45,
			scrollX: true,
			scrollY: true,
			columns:[],
			columnOptions: {
				frozenCount: 0,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			},
			copyOptions: {
				customValue: function(value, rowAttrs, column){
					return strip_tags(value);
				}
			}
		});
		base.grid.setColumns(base.columns);
	},
	load:function() {
	    base.grid.dispatch('setLoadingState', 'LOADING');
		var param = {
			seq:urlParam.get("seq")
			,material:urlParam.get("material")
			,plant:urlParam.get("plant")
		};
		base.ajax = $.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routingApproval/routingHistory",
			data:param,
			success:function(json, status, res){
				try{
					base.gridData = base.makeData(json.data);
					base.grid.resetData(base.gridData);
				}catch(e){
					console.log(e);
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

		}
		return result;
	}
}

$(document).ready(base.init);
