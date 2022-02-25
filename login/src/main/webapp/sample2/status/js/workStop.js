var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"seq",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"DESC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [
				{
					title:"SO",id:"order_number",
					grid:{width:150, align:"center",resizable:false, sortable:true},
					excel:{width:200},
					search:{type:"input",width:200}
				},{
					title:"GOP",id:"gop",
					grid:{width:80, align:"center",resizable:false, sortable:true},
					excel:{width:100},
					search:{type:"input",width:150}
				},{
					title:"작업장",id:"workcenter",
					grid:{width:120, sortable:true},
					excel:{width:100},
					search:{type:"select",width:200,data:common.getWorkCenter,dataParam:{"sort":"ccr_flag","sortType":"ASC","sort2":"workcenter","sortType2":"ASC"}}
				},{
					title:"장비",id:"equipment_name",
					grid:{width:120, sortable:true},
					excel:{width:100},
					search:{type:"select",width:200,data:common.getEquipment,dataParam:{"sort":"equipment_name","sortType":"ASC"}}				
				},{
					title:"Material",id:"material",
					grid:{align:"center", sortable:true},
					excel:{width:200},
					search:{type:"input",width:200}
				},{
					title:"Plant",id:"plant",
					grid:{width:80, resizable:false, sortable:true},
					excel:{width:80},
					search:{width:100,type:"select",data:common.getPlant}
				},{
					title:"수량",id:"qty",
					grid:{width:80, resizable:false, sortable:true},
					excel:{width:200}
				},{
					title:"사유",id:"remark",
					grid:{align:"center",width:300, sortable:true},
					excel:{width:500}
				},{
					title:"발행자",id:"creator_name",
					grid:{width:100, align:"center", sortable:true,resizable:false},
					excel:{width:130},
					search:{type:"input",width:200}
				},{
					title:"발행일",id:"create_date",
					grid:{width:150, align:"center", sortable:true,resizable:false},
					excel:{width:200}
				},{
					title:"발행일(시작)",id:"create_date_from",
					search:{type:"date"}
				},{
					title:"발행일(종료)",id:"create_date_to",
					search:{type:"date"}
				}
			];  
			base.grid = new tui.Grid({
				el: document.getElementById('grid'),
				bodyHeight: windowHeight-200,
				afterLoad:true,
				rowHeaders: ['checkbox'],
				rowHeight:45,
				scrollX: true,
				scrollY: true,
				columns:[],
				sortDefault:[base.sort,base.sortType],
				sortHandler:function(data){
					if(data[0].columnName != "sortKey"){
						hash.add({"sort":data[0].columnName,"sortType":data[0].ascending==true?"ASC":"DESC"});
					}
				},
				columnOptions: {
					frozenCount: 2,
					frozenBorderWidth: 1,
					virtualScrolling: true,
					resizable: true
				}
			});
			base.grid.setColumns(list.get(base.columns,"grid"));
			list.set(base.columns,{excel:{api:"pop/workStop/read",fileName:main.nowMenu.name}});
			base.load();
		}catch(e){
			setTimeout(base.init,100);
		}
	},
	load:function(){
		var param = {
			paging:true
			,page:base.page
			,pageSize:base.pageSize
			,sort:base.sort
			,sortType:base.sortType
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/workStop/read",
			data:param,
			success:function(json, status, res){
				try{
					base.grid.resetData(base.makeData(json.data));
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
	},	   	
	makeData:function(json){
		var result = [];
		for(var i=0;i<json.length;i++){
			data = json[i];
			result[i] = data;

			data.status = (!data.closer)?"진행":"완료";
		}
		return result;
	}
}
$(document).ready(base.init);
$(window).resize(function(){
	if(base.grid){
		var windowHeight = document.documentElement.offsetHeight;
		base.grid.setBodyHeight(windowHeight-200);
	}
});