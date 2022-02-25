var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"material",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			var columns = [{
					title:"Material",id:"material",
					grid:{width:200,align:"center",sortable:true},
					search:{width:200,type:"input"}
				},{
					title:"Plant",id:"plant",
					grid:{width:80,sortable:true,resizable:false},
					search:{width:100,type:"select",data:common.getPlant}
				},{
					title:"자재구분",	id:"material_type",
					grid:{name:"material_type_name",resizable:true,width:200,minWidth:150,sortable:true},
					search:{width:200,type:"select",data:common.getCommonCode,dataParam:{"type":"material_type"}}
				},{
					title:"Description",id:"description",
					grid:{minWidth:100,sortable:true,resizable:true},
					search:{type:"input",width:200}
				},{
					title:"Spec",id:"spec",
					grid:{resizable:true,minWidth:100,sortable:true},
					search:{type:"input",width:200}
				},{
					title:"UOM",id:"uom",
					grid:{resizable:false,width:80,sortable:true},
					search:{type:"select",width:100,data:common.getUomCode}
				},{
					title:"생성자",id:"creator_name",
					grid:{resizable:false,width:100, sortable:true},
					search:{type:"input"}
				},{
					title:"생성일",id:"create_date",
					grid:{resizable:false,width:120, sortable:true}

				},{
					title:"생성일(시작)",id:"create_date_from",
					search:{type:"date"}
				},{
					title:"생성일(종료)",id:"create_date_to",
					search:{type:"date"}
				}
			];
			base.search = [
				{title:"Material",id:"material",type:"input",width:200}
				,{title:"Plant",id:"plant",type:"select",width:100,data:common.getPlant}
				,{title:"자재구분",id:"material_type",type:"select",width:200,data:common.getCommonCode,dataParam:{"type":"material_type"}}
				,{title:"Description",id:"description",type:"input",width:200}
				,{title:"Spec",id:"spec",type:"input",width:200}
				,{title:"UOM",id:"uom",type:"select",width:100,data:common.getUomCode}
				,{title:"생성자",id:"creator_name",type:"input"}
				,{title:"생성일(시작)",id:"create_date_from",type:"date"}
				,{title:"생성일(종료)",id:"create_date_to",type:"date"}
			];

			base.columns = [
				{header:'Material',name:'material', width:200, align:"center", sortable:true}
				,{header:'Plant',name:'plant',resizable:false,width:80, sortable:true}
				,{header:'자재구분',name:'material_type_name',resizable:true,width:200,minWidth:150, sortable:true}
				,{header:'UOM',name:'uom',resizable:false,width:80, sortable:true}
				,{header:'Description',name:'description',resizable:true,minWidth:100, sortable:true}
				,{header:'Spec',name:'spec', resizable:true,minWidth:100, sortable:true}
				,{header:'생성자',name:'creator_name',resizable:false,width:100, sortable:true}
				,{header:'생성일',name:'create_date',resizable:false,width:120, sortable:true}
				,{header:'관리',name:'manage',resizable:false,width:150}
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
			base.grid.setColumns(base.columns);
			search.set(base.search);
			base.load();
		}catch(e){
			log(e);
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