var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"target_date",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"DESC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"기준일",id:"target_date",
				grid:{width:120, align:"center", sortable:true},					
				excel:{width:150}
			},{
				title:"장비코드",id:"equipment_code",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"장비",id:"equipment_name",
				grid:{width:300, align:"center", sortable:true},
				excel:{width:250},
				search:{id:"equipment_seq",type:"select",width:200,data:common.getEquipment,dataParam:{"sort":"equipment_name","sortType":"ASC"}}
			},{
				title:"기준일(시작)",id:"target_date_from",
				search:{type:"date"}
			},{
				title:"기준일(종료)",id:"target_date_to",
				search:{type:"date"}
			},{
				title:"작업공수(분)",id:"working_time",
				grid:{align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"셋업공수(분)",id:"setup_time",
				grid:{align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"비가동공수(분)",id:"loss_time",
				grid:{align:"center", sortable:true},
				excel:{width:120}
			},{
				title:"마감처리자",id:"creator_name",
				grid:{width:120,resizable: false, sortable:true},
				excel:{width:200}
			},{
				title:"마감시간",id:"create_date",
				grid:{width:150,resizable: false, sortable:true},
				excel:{width:200}
			},{
				title:"관리",id:"manage",
				grid:{resizable:false,width:100}
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
				frozenCount: 3,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			}
		});
		base.grid.setColumns(list.get(base.columns,"grid"));
		list.set(base.columns,{excel:{api:"pop/closingEquipment/read",fileName:main.nowMenu.name}});
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
			url:"/pop/closingEquipment/read",
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

			result[i].manage = "<button class='btn middle' seq='"+data.seq+"' target_date='"+data.target_date+"' equipment_seq='"+data.equipment_seq+"' onclick='base.detailView(this)'>현황 조회</button>";
		}
		return result;
	},
	detailView:function(obj){	 
		var seq = $(obj).attr("seq");
		var target_date = $(obj).attr("target_date");
		var equipment_seq = $(obj).attr("equipment_seq");
		popup.create({title:"현황 조회",width:1200,height:700,type:"content",href:"/front/pop/closing/equipmentDetailView.html?seq="+seq+"&target_date="+target_date+"&equipment_seq="+equipment_seq});
	}

}
$(document).ready(base.init);
$(window).resize(function(){
	if(base.grid){
		var windowHeight = document.documentElement.offsetHeight;
		base.grid.setBodyHeight(windowHeight-200);
	}
});