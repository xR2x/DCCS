var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"create_date",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"desc",
	page:(hash.get("page"))?hash.get("page"):1,
	reportTarget:null,
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
				search:{type:"select",width:100,data:common.getPlant,width:100}
			},{
				title:"Revision",id:"revision",
				grid:{width:100, align:"center", sortable:true,resizable:false},
				excel:{id:"revision",width:100},
				search:{type:"input",width:100}
			},{
				title:"Project",id:"project",
				grid:{resizable: false,width:200, sortable:true},
				excel:{id:"project_name",width:200},
				search:{type:"select",width:200,data:common.getProject}
			},{
				title:"General Note",id:"general_note",
				grid:{resizable: false, sortable:true},
				excel:{width:400},
				search:{type:"input",width:200}
			},{
				title:"공정수",id:"routing_count",
				grid:{resizable: false,width:100, sortable:true},
				excel:{width:150}
			},{
				title:"상태",id:"status_name",
				grid:{resizable: false,width:100, sortable:true},
				excel:{width:150},
				search:{id:"status", type:"select",width:200,data:common.getCommonCode,dataParam:{"type":"routing_status"}}
			},{			   														   
				title:"공정순서대로 작업",id:"sequence_operation",
				excel:{width:200},
				search:{type:"input",value:"X",switch:true}
			},{
				title:"생성자",id:"creator_name",
				grid:{resizable: false,width:100, sortable:true},
				excel:{width:150},
				search:{type:"input",width:100}
			},{
				title:"생성일",id:"create_date",
				grid:{resizable: true,width:120,minWidth:120, sortable:true},
				excel:{width:200}
			},{			   														   
				title:"생성일(시작)",id:"create_date_from",
				search:{type:"date"}
			},{			   														   
				title:"생성일(종료)",id:"create_date_to",
				search:{type:"date"}
			},{
				title:"관리",id:"manage",
				grid:{resizable:false,width:280}
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
				frozenCount: 4,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			}
		});
		base.grid.setColumns(list.get(base.columns,"grid"));
		var addSheet = {
			"item":[
				{"title":"Material","id":"material","width":"300"}
				,{"title":"Plant","id":"plant","width":"100"}
				,{"title":"Revison","id":"revision","width":"150"}
				,{"title":"OP","id":"op","width":"150"}
				,{"title":"SOP","id":"sop","width":"150"}
				,{"title":"GOP","id":"gop","width":"150"}
				,{"title":"작업장","id":"workcenter","width":"200"}
				,{"title":"Standard Text Code","id":"standard_text_code","width":"300"}
				,{"title":"Standard Text Revision","id":"standard_text_revision","width":"300"}
				,{"title":"Standard Text title","id":"standard_text_title","width":"400"}
				,{"title":"Standard Text","id":"standard_text","width":"500"}
				,{"title":"inspection_code","id":"inspection_code","width":"200"}
			]
		};
		list.set(base.columns,{excel:{api:"master/routing/read",addSheet:addSheet,active_flag:"X",standard_flag:"N",fileName:main.nowMenu.name},button:[{position:0,cssClass:"middle color blue",name:"<img src=/front/common/img/icon/reports-stack.png> 선택 Routing Report 출력",handler:base.reportSelect}]});
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
			,standard_flag:"N"
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/read",
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

			var btnView = "<button class='btn middle' onclick='base.view(this)'>조회</button>";
			var btnModify = "<button class='btn middle' onclick='base.modify(this)'>수정</button>";			
			var btnApprovalRequest = "<button class='btn middle color green' onclick='base.approvalConfirm(this)'>승인의뢰</button>";	   			
			var btnReport = "<button class='btn middle color blue' onclick='base.reportSelect(this)'>Report</button>";	   			
			var btnDelete = "<button class='btn middle color red' onclick='base.remove_confirm(this)'>삭제</button>";	   
			
			if(data.before_routing_no) {
			 	btnDelete = '<button class="btn middle disable" onclick="$.alert(\'\다른 Revision이 존재하는 <br>Routing 입니다.\'\);">삭제</button>';
			}
			if(data.routing_count == 0) {
				btnReport = '<button class="btn middle disable" onclick="$.alert(\'\공정이 없는 Routing입니다.\'\);">Report</button>';
			}		
			if(data.status == "T" || data.status == "Q") {
				btnApprovalRequest = '<button class="btn middle disable" onclick="$.alert(\'\승인이 진행중인 Routing 입니다.\'\);">승인의뢰</button>';	   			
				btnModify = '<button class="btn middle disable" onclick="$.alert(\'\승인이 진행중인 Routing 입니다.\'\);">수정</button>';
				btnDelete = '<button class="btn middle color red disable" onclick="$.alert(\'\승인이 진행중인 Routing 입니다.\'\);">삭제</button>';	   
			}    				
			if(data.status == "R") {
				btnApprovalRequest = '<button class="btn middle disable" onclick="$.alert(\'\반려된 Routing 입니다.<br>수정 후 재승인을 진행해 주세요.\'\);">승인의뢰</button>';	   			
				result[i].status_name = "<a seq='"+data.seq+"' request_no='"+data.request_no+"' onclick='base.rejectInfo(this)' style='cursor:pointer;'>"+data.status_name+"</a>";			 
			}		
			if(data.status == "A") {
				btnApprovalRequest = '<button class="btn middle disable" onclick="$.alert(\'\이미 승인된 Routing 입니다.\'\);">승인의뢰</button>';	   			
			 	btnDelete = '<button class="btn middle disable" onclick="$.alert(\'\승인된 Routing은 삭제할수 없습니다.\'\);">삭제</button>';
			}					
			var manage = "<span class='btn-group' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' revision='"+data.revision+"'>"+btnView + btnModify + btnApprovalRequest + btnReport + btnDelete+"</span>";
			result[i].manage = manage;
		}
		return result;
	},		  	
	rejectInfo:function(obj){
		var seq = $(obj).attr("seq");
		var request_no = $(obj).attr("request_no");
		popup.create({title:"반려",width:550,height:440,type:"content",href:"/front/master/routing/routingRejectInfo.html?seq="+seq+"&request_no="+request_no});

	},
	approvalConfirm:function(obj){
		var target = $(obj).closest("span"); 
		var seq = $(target).attr("seq");  
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var revision = $(target).attr("revision");
		popup.create({
			title:"Routing 승인의뢰"
			,width:320
			,height:220
			,type:"confirm"
			,message:"Material : "+material+" <br> Plant : "+plant+" <br> Revision : "+revision+" <br>Routing을 승인의뢰 하시겠습니까?"
			,button:[{
				title:"<strong>네</strong> (승인의뢰) "
					,kyeCode:15
					,handler:function(){
						base.approvalRequest(obj);
						popup.close();
					}
					,cssClass:"btn color green middle"
				},{
					title:"<strong>아니오</strong> (취소) "
					,keyCode:16
					,handler:function(){
						popup.close();
					}
					,cssClass:"btn middle"
				}						
			]
		});
	},
	approvalRequest:function(obj){
		var target = $(obj).closest("span"); 
		var seq = $(target).attr("seq");
		var param = {
			seq:seq
		};
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/approvalRequest",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
					 	$.alert(json.error);
					}else {
					 	$.info("승인요청되었습니다.");
					}
				}catch(e){
					console.log(e);
				}finally {
				 	base.load();
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	},
	reportSelect:function(obj){										
		
		base.reportTarget = obj;
		
		popup.create({title:"Routing Report",width:900,height:500,type:"content",href:"/front/master/routing/reportSelect.html"});
	},
	report:function(array){										

		var datetime = new Date();
		var fileName = datetime.getTime();
		
//		var array = Array();
//
//		if(obj) {					 			
//			var targetObj = $(obj).closest("span");			
//			array.push(targetObj.attr("seq"));																 
//		}else {
//			var list = base.grid.getCheckedRows();
//			if(list.length > 0) {			  			 	
//				for(var i=0;i<list.length;i++) {  
//					if(list[i].routing_count > 0) {
//						array.push(list[i].seq);
//					}
//				}
//			}									  
//		}			
//		if(array.length==0) {
//			$.alert("Routing Report를 출력할 항목을 선택해 주세요. ( 공정이 없는 항목은 출력할수 없습니다. )");			
//			return;
//		}
		excel.time = new Date();
	    base.grid.dispatch('setLoadingState', 'LOADING');											 
		var xhr = new XMLHttpRequest();															 
		xhr.open('POST', "/util/pdf/routing", true);											 
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if(this.status === 200) {
				var blob = this.response;
				if(blob.size == 0){
					$.alert("다운로드 받을 데이터가 없습니다.");
				}else{
					base.reportBlob = new Blob([blob],{type:"application/pdf"});													 
					base.reportBlob.fileName = fileName;
					popup.create({title:"Routing Report",width:1000,height:800,type:"content",href:"/front/common/report.html"});
				}
				base.grid.dispatch('setLoadingState', 'DONE');
			}
		};
		xhr.send("array="+JSON.stringify(array));
	}, 
	view:function(obj){	   
		hash.set({"service":"master/routing/view&seq="+$(obj).closest("span").attr("seq")});
	},
	modify:function(obj){
		hash.set({"service":"master/routing/update&seq="+$(obj).closest("span").attr("seq")});
	},
	remove_confirm:function(obj){
		var target = $(obj).closest("span"); 
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var revision = $(target).attr("revision");
		popup.create({
			title:"Routing 삭제"
			,width:320
			,height:220
			,type:"confirm"
			,message:"Material : "+material+" <br> Plant : "+plant+" <br> Revision : "+revision+" <br>Routing을 삭제하시겠습니까?"
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
			seq:$(target).attr("seq")
		};
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/delete",
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
	},
	restore:function(obj) {
		var target = $(obj).closest("span"); 
		var param = {
			seq:$(target).attr("seq")
		};
	    base.grid.dispatch('setLoadingState', 'LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/restore",
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