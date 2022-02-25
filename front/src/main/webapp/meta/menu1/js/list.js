var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"material",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"Material",id:"material",
				grid:{width:250, align:"center", sortable:true},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"Plant",id:"plant",
				grid:{width:100, align:"center", sortable:true},
				excel:{width:120},
				search:{type:"select",width:100,data:common.getPlant}
			},{
				title:"Revision",id:"revision",
				grid:{resizable: false,width:100,minWidth:100, sortable:true},
				excel:{width:150},
				search:{type:"input",width:50}
			},{
				title:"Project",id:"project_name",
				grid:{resizable: false,width:250,minWidth:200, sortable:true},
				excel:{width:300},
				search:{type:"select",width:200,data:common.getProject}
			},{
				title:"하위자재수",id:"component_count",
				grid:{resizable: false,width:100,minWidth:100, sortable:true},
				excel:{width:100}
			},{
				title:"Head Text",id:"description",
				grid:{resizable: false,minWidth:300, sortable:true},
				excel:{width:350},
				search:{type:"input",width:200}
			},{
				title:"생성자",id:"creator_name",
				grid:{resizable: true,width:100,minWidth:100, sortable:true},
				excel:{width:200},
				search:{type:"input"}
			},{
				title:"하위자재",id:"component",
				search:{type:"input",width:200}
			},{
				title:"생성일",id:"create_date",
				grid:{resizable: true,width:120,minWidth:120, sortable:true},
				excel:{width:200}
			},{
				title:"생성일(시작)",id:"create_date_from",
				search:{type:"date"}
			},{
				title:"생성일(종료)",id:"create_date_to",
				search:{type:"date"}
			},{
				title:"관리",id:"manage",
				grid:{resizable: false,width:150, sortable:false}
			}
		];
		base.grid = new tui.Grid({
			el: document.getElementById('grid'),
			bodyHeight: windowHeight-200,
			afterLoad:true,
			rowHeaders: ['checkbox'],
			rowHeight:main.rowHeight,
			minRowHeight:main.rowHeight,
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
		var addSheet = {
			"item":[
				{"title":"Material","id":"material","width":"300"}
				,{"title":"Plant","id":"plant","width":"100"}
				,{"title":"Revison","id":"revision","width":"150"}
				,{"title":"Item","id":"item","width":"200"}
				,{"title":"Category","id":"category","width":"200"}
				,{"title":"Component","id":"component","width":"300"}
				,{"title":"소요량","id":"qpa","width":"200"}
				,{"title":"UOM","id":"uom","width":"150"}
			]
		};
		list.set(base.columns,{excel:{api:"master/bom/read",addSheet:addSheet,active_flag:"X",fileName:main.nowMenu.name}});
		base.load();
	},
	load:function(){
		var param = {
			paging:true
			,page:base.page
			,pageSize:base.pageSize
			,sort:base.sort
			,sortType:base.sortType
			,active_flag:"X"
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/bom/read",
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
			result[i].manage = "<span class='btn-group'><button class='btn xsmall' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn xsmall' seq='"+data.seq+"' onclick='base.update(this)'>수정</button><button class='btn xsmall color red' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},
	view:function(obj){
		hash.set({"service":"master/bom/view&seq="+$(obj).attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/bom/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var material = $(obj).attr("material");
		var plant = $(obj).attr("plant");
		popup.create({
			title:"BOM 삭제"
			,width:320
			,height:200
			,type:"confirm"
			,message:"Material : "+material+" <br> Plant : "+plant+" <br>BOM을 삭제하시겠습니까?"
			,button:[{
				title:"<strong>네</strong> (삭제)"
					,kyeCode:15
					,handler:function(){
						base.remove(obj);
						popup.close();
					}
					,cssClass:"btn color red middle"
				},{
					title:"<strong>아니오</strong> (취소)"
					,keyCode:16
					,handler:function(){
						popup.close();
					}
					,cssClass:"btn middle"
				}						
			]
		});
	},
	remove:function(obj){
		var param = {
			seq:$(obj).attr("seq")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/bom/delete",
			data:param,
			success:function(json, jsonStatus, res){
				try{
					if(!json.error){
						$.info("삭제되었습니다.");
						setTimeout(function(){
							location.reload();
						},500);
					}else{
						$.alert(json.error);
					}
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