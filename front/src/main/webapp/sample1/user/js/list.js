var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"user_id",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"ID",id:"user_id",
				grid:{resizable: false,width:150, sortable:true},
				excel:{width:250},
				search:{id:"id", type:"input",width:150}
			},{
				title:"이름",id:"name",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"부서",id:"department",
				grid:{align:"center", sortable:true,resizable:false},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"직급",id:"position",
				grid:{align:"center", width:130, sortable:true,resizable:false},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"연락처",id:"tel",
				grid:{align:"center", width:130, sortable:true,resizable:false},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"핸드폰",id:"mobile",
				grid:{align:"center", width:130, sortable:true,resizable:false},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"E-MAIL",id:"email",
				grid:{align:"center", sortable:true,resizable:false},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"상태",id:"status_name",
				grid:{align:"center", width:90,sortable:true,resizable:false},
				excel:{width:200},
				search:{id:"status",type:"select",width:100,data:common.getCommonCode,dataParam:{"type":"user_status","viewType":"name"}}
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
			rowHeight: main.rowHeight,
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
		list.set(base.columns,{excel:{api:"master/user/read",fileName:main.nowMenu.name}});
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
			url:"/master/user/read",
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
			result[i].manage = "<span class='btn-group'><button class='btn xsmall' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn xsmall' seq='"+data.seq+"' onclick='base.update(this)'>수정</button><button class='btn xsmall color red' seq='"+data.seq+"' user_id='"+data.user_id+"' name='"+data.name+"' onclick='base.remove_confirm(this)'>퇴사</button></span>";
		}
		return result;
	},
	view:function(obj){
		hash.set({"service":"master/user/view&seq="+$(obj).attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/user/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var user_name = $(obj).attr("name");
		popup.create({
			title:"사용자 퇴사"
			,width:380
			,height:180
			,type:"confirm"
			,message:"사용자 : "+user_name+"을(를) 퇴사처리 하시겠습니까? <br> (사용자의 데이터는 삭제되지 않고 퇴사상태로 변경됩니다.)"
			,button:[{
				title:"<strong>네</strong> (계속 진행)"
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
			,id:$(obj).attr("user_id")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/user/delete",
			data:param,
			success:function(json, jsonStatus, res){
				try{
					if(!json.error){
						$.info("퇴사처리가 완료되었습니다.");
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