var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"seq",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"DESC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"Type",id:"type_name",
					grid:{resizable: false,width:200, sortable:true},
					excel:{width:250},
					search:{id:"type", type:"select",width:150,data:common.getCommonCode,dataParam:{"type":"loss_time"}}
				},{
					title:"Name",id:"name",
					grid:{width:200, align:"center", sortable:true},
					excel:{width:300},
					search:{type:"input",width:200}
				},{
					title:"Remark",id:"remark",
					grid:{align:"center", sortable:true,resizable:false},
					excel:{width:300},
					search:{type:"input",width:200}
				},{
					title:"휴일",id:"holiday_flag",
					grid:{width:100, align:"center", sortable:true,resizable:false},
					excel:{width:100},
					search:{type:"input",switch:true,value:"X"}
				},{
					title:"시작시간",id:"start_time",
					grid:{width:150, align:"center", sortable:true,resizable:false},
					excel:{width:200}
				},{
					title:"종료시간",id:"end_time",
					grid:{width:150,align:"center", sortable:true,resizable:false},
					excel:{width:200}
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
			list.set(base.columns,{excel:{api:"pop/lossTime/read",fileName:main.nowMenu.name}});
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
			url:"/pop/lossTime/read",
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

			if(data.holiday_flag == "X") {
				result[i].holiday_flag = "휴일";
			}else {
				result[i].holiday_flag = "일반";
			}
			result[i].manage = "<span class='btn-group' seq='"+data.seq+"' name='"+data.name+"'><button class='btn middle' onclick='base.view(this)'>조회</button><button class='btn middle' onclick='base.update(this)'>수정</button><button class='btn middle color red' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},
	
	view:function(obj){
		hash.set({"service":"pop/loss/lossTimeView&seq="+$(obj).closest("span.btn-group").attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"pop/loss/lossTimeUpdate&seq="+$(obj).closest("span.btn-group").attr("seq")});
	},
	remove_confirm:function(obj){
		var name = $(obj).closest("span.btn-group").attr("name");
		popup.create({
			title:"정기 비가동 삭제"
			,width:350
			,height:160
			,type:"confirm"
			,message:name+"을(를) 삭제하시겠습니까?"
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
			seq:$(obj).closest("span.btn-group").attr("seq")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/lossTime/delete",
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