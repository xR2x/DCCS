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
				excel:{width:80},
				search:{type:"select",width:100,data:common.getPlant}
			},{
				title:"TV",id:"tv",
				grid:{width:250, align:"center", sortable:true,resizable:false},
				excel:{id:"TV",width:250},
				search:{type:"select",width:200,data:common.getTypeVersion}
			},{
				title:"Eff (From)",id:"eff_from",
				grid:{resizable: false,width:150, sortable:true},
				excel:{width:150}
			},{
				title:"Eff (To)",id:"eff_to",
				grid:{resizable: false,width:150, sortable:true},
				excel:{width:150}
			},{
				title:"Remark",id:"remark",
				grid:{resizable: false, sortable:true},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"생성자",id:"creator_name",
				grid:{resizable: false,width:100, sortable:true},
				excel:{width:150},
				search:{type:"input",width:100}
			},{
				title:"생성일",id:"create_date",
				grid:{resizable: false,width:150, sortable:true},
				excel:{width:150}
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
		list.set(base.columns,{excel:{api:"master/changeNumber/read",fileName:main.nowMenu.name}});
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
			url:"/master/changeNumber/read",
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
			result[i].manage = "<span class='btn-group' change_no='"+data.change_no+"' material='"+data.material+"' plant='"+data.plant+"' tv='"+data.tv+"' eff_from='"+data.eff_from+"' eff_to='"+data.eff_to+"'><button class='btn xsmall' onclick='base.view(this)'>조회</button><button class='btn xsmall' onclick='base.modify(this)'>수정</button><button class='btn xsmall color red' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},		  	
	view:function(obj){	   
		base.change_no = $(obj).closest("span").attr("change_no");
		popup.create({title:"호기관리 조회",width:600,height:400,type:"content",href:"/front/master/changeNumber/view.html"});
	},
	modify:function(obj){
		base.change_no = $(obj).closest("span").attr("change_no");
		popup.create({title:"호기관리 수정",width:600,height:400,type:"content",href:"/front/master/changeNumber/update.html"});
	},
	remove_confirm:function(obj){
		var target = $(obj).closest("span"); 
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var tv = $(target).attr("tv");
		var eff_from = $(target).attr("eff_from");
		var eff_to = $(target).attr("eff_to");
		popup.create({
			title:"호기관리 삭제"
			,width:320
			,height:250
			,type:"confirm"
			,message:"Material : "+material+" <br> Plant : "+plant+" <br> TV : "+tv+" <br> Eff : "+eff_from+"~"+eff_to+" <br>을 삭제하시겠습니까?"
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
	remove:function(obj) {
		var target = $(obj).closest("span"); 
		var param = {
			change_no:$(target).attr("change_no")
		};
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/changeNumber/delete",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
					 	$.alert(json.error);
					}else {
				 		$.info("처리되었습니다.");
					}
				}catch(e){
					console.log(e);
				}finally{
				 	base.load();
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