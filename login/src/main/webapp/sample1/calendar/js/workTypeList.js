var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"work_type",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"가동코드",id:"work_type",
					grid:{width:250, align:"center", sortable:true},
					excel:{width:250},
					search:{type:"input",width:200}
				},{
					title:"명칭",id:"remark",
					grid:{width:400, align:"center", sortable:true},
					excel:{width:300},
					search:{type:"input",width:200}
				},{
					title:"시작시간",id:"time_from",
					grid:{resizable: false,sortable:true},
					excel:{width:300},
				},{
					title:"종료시간",id:"time_to",
					grid:{resizable: false,sortable:true},
					excel:{width:300},
				},{
					title:"생성자",id:"creator_name",
					grid:{width:150, align:"center", sortable:true},
					excel:{width:150},
					search:{type:"input",width:200}
				},{
					title:"생성일",id:"create_date",
					grid:{resizable: true,width:120,minWidth:150, sortable:true},
					excel:{width:150}
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
					frozenCount: 1,
					frozenBorderWidth: 1,
					virtualScrolling: true,
					resizable: true
				}
			});
			base.grid.setColumns(list.get(base.columns,"grid"));
			list.set(base.columns,{excel:{api:"master/workType/read",fileName:main.nowMenu.name}});
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
			url:"/master/workType/read",
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
			result[i].manage = "<span class='btn-group'><button class='btn xsmall' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn xsmall' seq='"+data.seq+"' onclick='base.update(this)'>수정</button><button class='btn xsmall color red' seq='"+data.seq+"' work_type='"+data.work_type+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},
	
	view:function(obj){
		hash.set({"service":"master/calendar/workTypeView&seq="+$(obj).attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/calendar/workTypeUpdate&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var work_type = $(obj).attr("work_type");
		popup.create({
			title:"Work Type 삭제"
			,width:350
			,height:160
			,type:"confirm"
			,message:"Work Type : "+work_type+"을(를) 삭제하시겠습니까?"
			,button:[{
				title:"<strong>네</strong> (계속진행)"
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
			,work_type:$(obj).attr("work_type")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workType/delete",
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