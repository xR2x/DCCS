var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"material",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"Material",id:"material",
					grid:{width:200,align:"center",sortable:true},
					excel:{width:300},
					search:{width:200,type:"input",paste:true}
				},{
					title:"Plant",id:"plant",
					grid:{width:80,sortable:true,resizable:false},
					excel:{width:80},
					search:{width:100,type:"select",data:common.getPlant}
				},{
					title:"자재구분",	id:"material_type",
					grid:{name:"material_type_name",resizable:true,width:200,minWidth:150,sortable:true},
					excel:{id:"material_type_name",width:200},
					search:{width:200,type:"select",data:common.getCommonCode,dataParam:{"type":"material_type"}}
				},{
					title:"UOM",id:"uom",
					grid:{resizable:false,width:80,sortable:true},
					excel:{width:80},
					search:{type:"select",width:100,data:common.getUomCode}
				},{
					title:"Description",id:"description",
					grid:{minWidth:100,sortable:true,resizable:true},
					excel:{width:400},
					search:{type:"input",width:200}
				},{
					title:"Spec",id:"spec",
					grid:{resizable:true,minWidth:100,sortable:true},
					excel:{width:400},
					search:{type:"input",width:200}
				},{
					title:"생성자",id:"creator_name",
					grid:{resizable:false,width:100, sortable:true},
					excel:{width:150},
					search:{type:"input"}
				},{
					title:"생성일",id:"create_date",
					excel:{width:200},
					grid:{resizable:false,width:120, sortable:true}
				},{
					title:"생성일(시작)",id:"create_date_from",
					search:{type:"date"}
				},{
					title:"생성일(종료)",id:"create_date_to",
					search:{type:"date"}
				},{
					title:"관리",id:"manage",
					grid:{resizable:false,width:150}
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
					virtualScrolling: false,
					sortable:true,
					resizable: true
				}
			});
			base.grid.setColumns(list.get(base.columns,"grid"));
			list.set(base.columns,{excel:{api:"master/material/read",fileName:main.nowMenu.name}});
			base.load();
		}catch(e){
			log(e);
			setTimeout(base.init,100);
		}
	},
	load:function(page){
		var param = {
			paging:true
			,page:base.page
			,pageSize:base.pageSize
			,sort:base.sort
			,sortType:base.sortType
			,use_check:true
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/material/read",
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
	use_info:function(){
		$.alert("사용중인 자재는 <br>삭제할 수 없습니다.");
	},
	makeData:function(json){
		var result = [];
		var data = null;
		for(var i=0;i<json.length;i++){
			data = json[i];
			result[i] = data;
			if(Number(data.use_count)>0){
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red disable' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' onclick=base.use_info()>삭제</button></span>";	
			}else{
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
			}
		}
		return result;
	},
	view:function(obj){
		hash.set({"service":"master/material/view&seq="+$(obj).attr("seq")});
	},
	modify:function(obj){
		hash.set({"service":"master/material/update&seq="+$(obj).attr("seq")});
	},
	
	remove_confirm:function(obj){
		var material = $(obj).attr("material");
		var plant = $(obj).attr("plant");

		popup.create({
			title:"자재 삭제"
			,width:320
			,height:200
			,type:"confirm"
			,message:"Material : "+material+" <br> Plant : "+plant+"<br> 자재를 삭제하시겠습니까?"
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
			,material:$(obj).attr("material")
			,plant:$(obj).attr("plant")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/material/delete",
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