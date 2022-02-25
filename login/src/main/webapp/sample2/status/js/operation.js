var base = {
	pageSize:15,
	sort:(hash.get("sort"))?hash.get("sort"):"create_date",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"DESC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		base.set();
	},
	set:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"SO",id:"order_number",
				grid:{width:150, align:"center",resizable:false},					
				excel:{width:150},
				search:{type:"input",width:200,paste:true}
			},{
				title:"Material",id:"material",
				grid:{width:250, align:"center",resizable:false},
				excel:{width:200},
				search:{type:"input",width:200,paste:true}
			},{
				title:"Plant",id:"plant",
				grid:{width:80, align:"center",resizable:false},
				excel:{width:100},
				search:{type:"select",data:common.getPlant,width:100}
			},{
				title:"수량",id:"qty",
				grid:{resizable: false,width:70},
				excel:{width:100}
			},{
				title:"UOM",id:"uom",
				grid:{resizable: false,width:70},
				excel:{width:100}
			},{
				title:"긴급도",id:"emergency",
				grid:{resizable: false,width:70},
				excel:{width:100},
				search:{type:"select",data:common.getCommonCode,dataParam:{"type":"order_emergency"},width:100}
			},{
				title:"Project",id:"project_name",
				grid:{resizable: false},
				excel:{width:200},
				search:{id:"project_code",type:"select",data:common.getProject,width:200}
			},{
				title:"Category",id:"order_category",
				excel:{width:200},
				search:{type:"select",data:common.getOrderCategory,dataParam:{"type":"SO"},width:200}
			},{
				title:"시작일",id:"start_date",
				excel:{width:150},
				search:{type:"date"}
			},{
				title:"완료일",id:"end_date",
				excel:{width:150},
				search:{type:"date"}
			},{
				title:"공정순서대로 작업",id:"sequence_operation",
				search:{type:"input",value:"X",switch:true}
			},{
				title:"상태",id:"status_name",
				grid:{resizable: false,width:80},
				excel:{width:100},
				search:{id:"status",type:"select",data:common.getCommonCode,dataParam:{"type":"shop_order_status"},width:100}
			},{
				title:"현재공정",id:"current_gop",
				excel:{width:100},
				grid:{resizable: false,width:100},
				search:{type:"input",width:200}
			},{
				title:"현재작업장",id:"current_workcenter",
				grid:{resizable: false,width:150},
				excel:{width:150},
				search:{type:"select",width:200,data:common.getWorkCenter,dataParam:{"sort":"ccr_flag","sortType":"ASC","sort2":"workcenter","sortType2":"ASC"}}
			},{
				title:"현재작업장명",id:"current_workcenter_name",
				grid:{resizable: false,width:150},
				excel:{width:150}
			}
		];
		createForm.list.create({
			name:"List"
			,list:true
			,id:"list"
			,listData:[]
			,effect:false
			,autoScroll:false
			,bodyHeight:windowHeight-200
			,target:"grid"
			,columns:list.get(base.columns,"grid")
		});
		list.set(base.columns,{excel:{api:"product/order/read",fileName:main.nowMenu.name}});
		setTimeout(base.load,300);
	},
	load:function(){
		var param = {
			paging:true
			,page:base.page
			,pageSize:base.pageSize
			,sort:base.sort
			,sortType:base.sortType
			,status:"I"
		};
		param = Object.assign(param,hash.array());
	    base.grid["list"].dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/product/order/read",
			data:param,
			success:function(json, status, res){
				try{
					for(var i=0;i<json.data.length;i++){
						base.makeData(json.data[i]);
					}
					if(json.data.length == 0){
						setTimeout(function(){
							base.grid["list"].dispatch('setLoadingState', 'EMPTY');
						},400);
					}
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
	makeData:function(data){
		for(var i=0;i<$("#grid .tui-grid-body-area .tui-grid-table").length;i++){
			var target = $("#grid .tui-grid-body-area .tui-grid-table").eq(i);
			var targetTr = $("<tr/>").appendTo(target).addClass("tui-grid-row operationArea");
			targetTr.hover(
				function(){
					$(this).addClass("hover");
				},
				function(){
					$(this).removeClass("hover");
				}
			);
			var targetTd = $("<td/>").appendTo(targetTr).attr("colspan",target.find("col").length).addClass("tui-grid-cell tui-grid-cell-has-input");
			var table = $("<div/>").appendTo(targetTd);
			var infoTr = $("<div/>").appendTo(table).addClass("infoTr");
			for(var j=0;j<target.find("col").length;j++){
				var col = target.find("col").eq(j);
				var key = col.attr("data-column-name");
				var td = $("<div/>").appendTo(infoTr).addClass("infoColumn").attr({"data-column-name":key}).width(parseInt(col.width(),10)).html(createForm.list.getValue(key,data));

			}
			var area = $("<div/>").appendTo(table).addClass("operationDiv").width(table.width());
			var inner = $("<div/>").appendTo(area).addClass("operationInner scrollbar-inner").attr("order_number",data.order_number);
		}
		$('.scrollbar-inner').scrollbar();
		base.getOperation(data);
	},
	infoResize:function(){
		for(var i=0;i<$(".tui-grid-table col").length;i++){
			var col = $(".tui-grid-table col").eq(i);
			$(".infoColumn[data-column-name="+col.attr("data-column-name")+"]").width(parseInt(col.width(),10));
		}
	},
	getOperation:function(data){
		var target = $(".scroll-content[order_number="+data.order_number+"]");
		var param = {
			order_number:data.order_number
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/product/order/operationStatus",
			data:param,
			success:function(json, status, res){
				try{
					if(json.data.length == 0){
						$("<div/>").appendTo(target).addClass("noOperation").html("<div>등록된 공정이 없습니다.</div>");

					}
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						var ccr = data.ccr_flag == "X"?"ccr":"";
						var startDate = "-";
						var endDate = "-";
						if(data.status == "P" || data.status == "E"){
							startDate = "시작 : "+(data.start_date?data.start_date:"-");
							endDate = "종료 : "+(data.complete_date?data.complete_date:"-");
						}else{
							startDate = "계획 : "+(data.wc_start_date?data.wc_start_date:"-");
							endDate = "계획 : "+(data.wc_end_date?data.wc_end_date:"-");
						}					
						var box = $("<button/>").appendTo(target).addClass("operationBox "+data.status).html("<div class='operationGop'>"+data.gop+"</div><div class='operationWorkCenter'><span class='"+ccr+"'></span>"+data.workcenter+"</div><div class='operationWorkCenterName'>"+data.workcenter_name+"</div><div class='oprationDate'>"+startDate+"</div><div class='oprationDate'>"+endDate+"</div>");
						var status = $("<div/>").appendTo(box).addClass("operationStatus "+data.status);
					}
					setTimeout(function(){
						base.grid["list"].dispatch('setLoadingState', 'DONE');
					},400);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			} 
		});
	}
};
$(document).ready(base.init);
$(window).resize(function(){
	try{
		setTimeout(function(){
			base.infoResize();
			$('.scrollbar-inner').scrollbar();
			$(".operationDiv").width(parseInt($("#mainTitleArea").width(),10)-20);
		},300);
	}catch(e){
	}
});