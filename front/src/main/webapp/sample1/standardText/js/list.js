var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"code",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"Standard Text Code",id:"code",
					grid:{resizable: false,width:250, sortable:true},
					excel:{width:250},
					search:{title:"Code",type:"input",width:200}
				},{
					title:"Revision",id:"revision",
					grid:{width:120, align:"center", sortable:true},
					excel:{width:200},
					search:{type:"input",width:100}
				},{
					title:"Standard Text Title",id:"title",
					grid:{width:300, align:"center", sortable:true},
					excel:{width:300},
					search:{title:"Title",type:"input",width:200}
				},{
					title:"Standard Text",id:"standard_text",
					grid:{align:"center", sortable:true,resizable:false},
					excel:{width:400}
				},{
					title:"검사코드",id:"inspection_code_name",
					grid:{width:150, align:"center", sortable:true,resizable:false},
					excel:{width:400},
					search:{id:"inspection_code",type:"select",width:150,data:common.getCommonCode,dataParam:{"type":"inspection_code"}}
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
					frozenCount: 2,
					frozenBorderWidth: 1,
					virtualScrolling: true,
					resizable: true
				}
			});
			base.grid.setColumns(list.get(base.columns,"grid"));
			list.set(base.columns,{excel:{api:"master/standardText/read",active_flag:"X",fileName:main.nowMenu.name}});
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
			,use_check:true
			,active_flag:"X"
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/read",
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
			if(Number(data.use_count)>0){
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red disable' onclick=base.use_info()>삭제</button></span>";	
			}else{
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red' seq='"+data.seq+"' code='"+data.code+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
			}
		}
		return result;
	},
	use_info:function(){
		$.alert("사용중인 Standard Text는 <br>삭제할 수 없습니다.");
	},
	view:function(obj){
		hash.set({"service":"master/standardText/view&seq="+$(obj).attr("seq")});
	},
	modify:function(obj){
		hash.set({"service":"master/standardText/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var code = $(obj).attr("code");
		popup.create({
			title:"Standard Text 삭제"
			,width:320
			,height:160
			,type:"confirm"
			,message:"Standard Text : "+code+"을(를) 삭제하시겠습니까?"
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
			,code:$(obj).attr("code")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/delete",
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