var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"document_no",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [
			{
				title:"Document No",id:"document_no",
				grid:{resizable: false,width:220, sortable:true},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"Type",id:"document_type_name",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:300},
				search:{id:"document_type",type:"select",width:200,data:common.getCommonCode,dataParam:{"type":"document_type"}}
			},{
				title:"Project",id:"project_name",
				grid:{width:200, align:"center", sortable:true},
				excel:{width:300},
				search:{id:"project_code",type:"select",width:200,data:common.getProject}
			},{
				title:"Revision",id:"revision",
				grid:{width:120, align:"center",sortable:true,resizable:false},
				excel:{width:100},
				search:{type:"input",width:100}
			},{
				title:"Sheet",id:"sheet",
				grid:{width:100, align:"center",sortable:true,resizable:false},
				excel:{width:100},
				search:{type:"input",width:100}
			},{
				title:"문서명",id:"document_name",
				grid:{width:200,align:"center",sortable:true,resizable:false},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"Customer Revision",id:"customer_revision",
				grid:{width:150, align:"center",sortable:true,resizable:false},
				excel:{width:200},
				search:{type:"input",width:100}
			},{
				title:"만료일",id:"expiration_date",
				grid:{resizable: false,width:100, sortable:true},
				excel:{width:100},
				search:{type:"date"}
			},{
				title:"Remark",id:"remark",
				grid:{width:200,align:"center",sortable:true,resizable:false},
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
		list.set(base.columns,{excel:{api:"master/document/read",active_flag:"X",fileName:main.nowMenu.name}});
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
			url:"/master/document/read",
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
			if(data.use_count > 0) {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' document_no='"+data.document_no+"' revision='"+data.revision+"'><button class='btn xsmall' onclick='base.view(this)'>조회</button><button class='btn xsmall' onclick='base.update(this)'>수정</button><button class='btn xsmall disable' onclick='base.info(this)'>삭제</button></span>";
			}else {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' document_no='"+data.document_no+"' revision='"+data.revision+"'><button class='btn xsmall' onclick='base.view(this)'>조회</button><button class='btn xsmall' onclick='base.update(this)'>수정</button><button class='btn xsmall color red' onclick='base.remove_confirm(this)'>삭제</button></span>";
			}
		}
		return result;
	},
	info:function() {
	  	$.alert("사용중인 문서는 삭제하실수 없습니다.");
	},
	view:function(obj){
		hash.set({"service":"master/document/view&seq="+$(obj).closest("span").attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/document/update&seq="+$(obj).closest("span").attr("seq")});
	},
	remove_confirm:function(obj){
		var document_no = $(obj).closest("span").attr("document_no");
		var revision = $(obj).closest("span").attr("revision");
		popup.create({
			title:"도면 및 문서 삭제"
			,width:320
			,height:200
			,type:"confirm"
			,message:"Document : "+document_no+" <br> Revision : "+revision+" <br> 문서를 삭제하시겠습니까?"
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
			seq:$(obj).closest("span").attr("seq")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/document/delete",
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