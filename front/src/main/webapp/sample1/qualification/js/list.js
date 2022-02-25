var base = {
	pageSize:15,
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.search = [
			{title:"작업자",id:"worker_name",type:"input",dataType:"all"}
			,{title:"자격분류",id:"type",type:"input",dataType:"all"}
			,{title:"Remark",id:"remark",type:"input",dataType:"all"}
			,{title:"만료일",id:"expiration_date",type:"date",dataType:"date",format:"yy/mm/dd"}
		];
		base.columns = [
			{header:'작업자',name:'worker_name', width:150, align:"center"}
			,{header:'작업자 ID',name:'worker', width:100, align:"center"}
			,{header:'자격코드',name:'type',resizable: false,width:100,minWidth:100}
			,{header:'자격명',name:'type_name',resizable: false,width:250,minWidth:200}
			,{header:'No',name:'no',resizable: false,width:180,minWidth:120}
			,{header:'만료일',name:'expiration_date',resizable: false,width:150,minWidth:150}
			,{header:'remark',name:'remark',resizable: false,minWidth:300}	
			,{header:'생성자',name:'creator_name',resizable: true,width:150,minWidth:100}
			,{header:'생성일',name:'create_date', resizable: true,width:200,minWidth:120}
		];
		base.grid = new tui.Grid({
			el: document.getElementById('grid'),
			bodyHeight: windowHeight-200,
			afterLoad:true,
			rowHeaders: ['checkbox'],
			rowHeight:20,
			scrollX: true,
			scrollY: true,
			columns:[],
			columnOptions: {
				frozenCount: 2,
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
		search.setForm(base.search);
		base.load();
	},
	load:function(){
		var param = {
			paging:true
			,page:base.page
			,pageSize:base.pageSize
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/qualification/list",
			data:param,
			success:function(json, status, res){
				try{
					base.grid.resetData(json.data);
					$("#pageArea").paging({
						total:json.total
						,pageSize:base.pageSize
						,page:base.page
					});
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	}
}
$(document).ready(base.init);
$(window).resize(function(){
	if(base.grid){
		var windowHeight = document.documentElement.offsetHeight;
		base.grid.setBodyHeight(windowHeight-200);
	}
});