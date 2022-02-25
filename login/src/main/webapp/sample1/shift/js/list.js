var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"code",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"Shift",id:"code",
					grid:{resizable: false,width:250, sortable:true},
					excel:{width:250},
					search:{type:"input",width:200}
				},{
					title:"Name",id:"name",
					grid:{width:400, align:"center", sortable:true},
					excel:{width:300},
					search:{type:"input",width:200}
				},{
					title:"시작시간",id:"start_time",
					grid:{align:"center", sortable:true,resizable:false},
					excel:{width:300}
				},{
					title:"종료시간",id:"end_time",
					grid:{align:"center", sortable:true,resizable:false},
					excel:{width:300}
				},{
					title:"생성자",id:"creator_name",
					grid:{resizable: false,width:150, sortable:true},
					excel:{width:150},
					search:{type:"input",width:150}
				},{
					title:"생성일",id:"create_date",
					grid:{resizable: false,width:150, sortable:true},
					excel:{width:150}
				},{
					title:"관리",id:"manage",
					grid:{resizable:false,width:150}
				},{
					title:"생성일(시작)",id:"create_date_from",
					search:{type:"date"}
				},{
					title:"생성일(종료)",id:"create_date_to",
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
					frozenCount: 1,
					frozenBorderWidth: 1,
					virtualScrolling: true,
					resizable: true
				}
			});
			base.grid.setColumns(list.get(base.columns,"grid"));
			list.set(base.columns,{excel:{api:"master/shift/read",fileName:main.nowMenu.name}});
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
			url:"/master/shift/read",
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
			result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.update(this)'>수정</button><button class='btn middle color red' seq='"+data.seq+"' code='"+data.code+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},
	
	view:function(obj){
		hash.set({"service":"master/shift/view&seq="+$(obj).attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/shift/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var code = $(obj).attr("code");
		popup.create({
			title:"교대조 삭제"
			,width:350
			,height:160
			,type:"confirm"
			,message:"교대조 : "+code+"을(를) 삭제하시겠습니까?"
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
			,code:$(obj).attr("code")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/shift/delete",
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