var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"target_date",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"DESC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"기준일",id:"target_date",
				grid:{width:100, align:"center", sortable:true},					
				excel:{width:150}
			},{
				title:"SO",id:"order_number",
				search:{type:"input",width:200}
			},{
				title:"GOP",id:"gop",
				search:{type:"input",width:100}
			},{
				title:"장비코드",id:"equipment_code",
				grid:{width:100, align:"center", sortable:true},
				excel:{width:100}
			},{
				title:"장비",id:"equipment_name",
				grid:{width:150, align:"center", sortable:true},
				excel:{width:150},
				search:{id:"equipment_seq",type:"select",width:200,data:common.getEquipment,dataParam:{"sort":"equipment_name","sortType":"ASC"}}
			},{
				title:"기준일(시작)",id:"target_date_from",
				search:{type:"date"}
			},{
				title:"기준일(종료)",id:"target_date_to",
				search:{type:"date"}
			},{
				title:"분류",id:"type_name",
				grid:{width:150, align:"center", sortable:true},
				excel:{width:200},
				search:{id:"type",width:150,type:"select",data:common.getCommonCode,dataParam:{"type":"closing_equipment_status"}}
			},{
				title:"SO",id:"order_number",
				grid:{width:100, align:"center", sortable:true},
				excel:{width:150}
			},{
				title:"GOP",id:"gop",
				grid:{width:80, align:"center", sortable:true},
				excel:{width:80}
			},{
				title:"작업장",id:"workcenter",
				grid:{width:120, align:"center", sortable:true},
				excel:{width:120},
				search:{type:"select",width:200,data:common.getWorkCenter,dataParam:{"sort":"ccr_flag","sortType":"ASC","sort2":"workcenter","sortType2":"ASC"}}
			},{
				title:"수량",id:"qty",
				excel:{width:100}
			},{
				title:"작업공수(분)",id:"working_time",
				grid:{width:120, align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"셋업공수(분)",id:"setup_time",
				grid:{width:120, align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"비가동공수(분)",id:"loss_time",
				grid:{width:120, align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"시작시간",id:"start_date",
				grid:{width:150,resizable: false, sortable:true},
				excel:{width:200}
			},{
				title:"종료시간",id:"end_date",
				grid:{width:150,resizable: false, sortable:true},
				excel:{width:200}
			},{
				title:"Material",id:"material",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"Plant",id:"plant",
				grid:{width:80, align:"center", sortable:true,resizable:false},
				excel:{width:100},
				search:{type:"select",data:common.getPlant,width:100}
			},{
				title:"Description",id:"description",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:200}
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
				frozenCount: 4,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			}
		});
		base.grid.setColumns(list.get(base.columns,"grid"));
		list.set(base.columns,{excel:{api:"pop/closingEquipment/detailRead",fileName:main.nowMenu.name}});
		base.load();
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
			url:"/pop/closingEquipment/detailRead",
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
		var data = null;
		for(var i=0;i<json.length;i++){
			data = json[i];
			result[i] = data;
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