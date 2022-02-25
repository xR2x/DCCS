var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"material",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	te_auth:false,
	qa_auth:false,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [
			{
				title:"구분",id:"standard_flag",
				grid:{width:80, align:"center", sortable:true}
			},{
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
				title:"상태",id:"status_name",
				grid:{resizable: false, sortable:true},
				excel:{width:150},
				search:{id:"status", type:"select",width:200,data:base.getRoutingStatus,dataParam:{"type":"routing_status"},value:"W"}
			},{
				title:"승인요청자",id:"request_user_name",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"input",width:100}
			},{
				title:"승인요청일",id:"request_date",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"date"}
			},{
				title:"품질승인자",id:"qa_user_name",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"input",width:100}
			},{
				title:"품질요청일",id:"qa_date",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"date"}
			},{
				title:"기술승인자",id:"app_user_name",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"input",width:100}
			},{
				title:"기술승인일",id:"app_date",
				grid:{resizable: false, width:120, sortable:true},
				excel:{width:200},
				search:{type:"date"}
			},{
				title:"관리",id:"manage",
				grid:{resizable:false,width:230}
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
		list.set(base.columns,{excel:{api:"master/routingApproval/read",fileName:main.nowMenu.name},button:[{position:0,cssClass:"middle color blue",name:"<img src=/front/common/img/icon/reports-stack.png> 선택 Routing Report 출력",handler:base.report}]});
		setTimeout(base.load,100);
	},
	getRoutingStatus:function(obj,dataParam){
		var param = common.makeParam(dataParam);
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routingApproval/getRoutingStatus",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).html("<option value=''></option>");
					$(obj).append($("<option value='W' title='승인대기'>승인대기</option>"));
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$(obj).append($("<option value='"+data.code+"' title='"+(data.code_name?data.code_name:"")+"'>"+data.code_name+"</option>"));
					}
					if(param.value){
						setTimeout(function(){
							$(obj).val(param.value);
						},10);
					}
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
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
			url:"/master/routingApproval/read",
			data:param,
			success:function(json, status, res){
				try{									 
					if(json.qa_auth) base.qa_auth = true;
					if(json.te_auth) base.te_auth = true;
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

			var btnQualityApproval = "";
			var btnTechnicalApproval = "";

			if(!base.qa_auth) btnQualityApproval = "disabled";
			if(!base.te_auth) btnTechnicalApproval = "disabled";

			if(data.standard_flag == "X") {
				result[i].standard_flag = "표준";
			}else {
				result[i].standard_flag = "일반";
			}
	
			if(data.status == "Q") {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' revision='"+data.revision+"' request_no='"+data.request_no+"' status='"+data.status+"'><button class='btn middle' onclick='base.view(this)'>조회</button><button class='btn middle color blue' onclick='base.qualityApproval(this)' "+btnQualityApproval+">품질승인</button><button class='btn middle color red' onclick='base.reject(this)' "+btnQualityApproval+">반려</button><button class='btn middle' onclick='base.historyInfo(this)'>이력</button></span>";
			}else if(data.status == "T") {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' revision='"+data.revision+"' request_no='"+data.request_no+"' status='"+data.status+"'><button class='btn middle' onclick='base.view(this)'>조회</button><button class='btn middle color blue' onclick='base.technicalApproval(this)' "+btnTechnicalApproval+">기술승인</button><button class='btn middle color red' onclick='base.reject(this)' "+btnTechnicalApproval+">반려</button><button class='btn middle' onclick='base.historyInfo(this)'>이력</button></span>";
			}else if(data.status == "A") {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' revision='"+data.revision+"' request_no='"+data.request_no+"'><button class='btn middle' onclick='base.view(this)'>조회</button><button class='btn middle color blue' disabled>기술승인</button><button class='btn middle color red' disabled>반려</button><button class='btn middle' onclick='base.historyInfo(this)'>이력</button></span>";
			}else {
				result[i].manage = "<span class='btn-group' seq='"+data.seq+"' material='"+data.material+"' plant='"+data.plant+"' revision='"+data.revision+"' request_no='"+data.request_no+"'><button class='btn middle' onclick='base.view(this)'>조회</button><button class='btn middle color blue' disabled>승인반려</button><button class='btn middle color red' disabled>반려</button><button class='btn middle' onclick='base.historyInfo(this)'>이력</button></span>";
			}
		}

		return result;
	},
	qualityApproval:function(obj) {
		var target = $(obj).closest("span");
		var seq = $(target).attr("seq");
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var revision = $(target).attr("revision");
		var request_no = $(target).attr("request_no");
		var status = $(target).attr("status");
		popup.create({title:"품질승인",width:550,height:370,type:"content",href:"/front/master/routing/qualityApproval.html?seq="+seq+"&material="+material+"&plant="+plant+"&revision="+revision+"&request_no="+request_no+"&status="+status});
	},       
	technicalApproval:function(obj) {
		var target = $(obj).closest("span");
		var seq = $(target).attr("seq");
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var revision = $(target).attr("revision");
		var request_no = $(target).attr("request_no");
		var status = $(target).attr("status");
		popup.create({title:"기술승인",width:550,height:370,type:"content",href:"/front/master/routing/technicalApproval.html?seq="+seq+"&material="+material+"&plant="+plant+"&revision="+revision+"&request_no="+request_no+"&status="+status});
	},
	reject:function(obj) {
		var target = $(obj).closest("span");
		var seq = $(target).attr("seq");
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");
		var revision = $(target).attr("revision");
		var request_no = $(target).attr("request_no");
		var status = $(target).attr("status");
		popup.create({title:"반려",width:550,height:370,type:"content",href:"/front/master/routing/routingReject.html?seq="+seq+"&material="+material+"&plant="+plant+"&revision="+revision+"&request_no="+request_no+"&status="+status});
	},
	historyInfo:function(obj) {	
		var target = $(obj).closest("span");
		var seq = $(target).attr("seq");
		var material = $(target).attr("material");
		var plant = $(target).attr("plant");																															
		popup.create({title:"이력 조회",width:1000,height:547,type:"content",href:"/front/master/routing/routingHistory.html?seq="+seq+"&material="+material+"&plant="+plant});
	},	
	report:function(obj){

		var datetime = new Date();
		var fileName = datetime.getTime();
		
		var array = Array();

		if(obj) {					 
			var seq = $(obj).attr("seq");
			array.push(seq);
		}else {
			var list = base.grid.getCheckedRows();
			if(list.length > 0) {
				var cnt=0;
				for(var i=0;i<list.length;i++) {  
					if(list[i].routing_count > 0) {
						array[cnt] = {
							seq:list[i].seq
							,material:list[i].material
							,revision:list[i].plant
						}
						cnt++;
					}
				}
			}									  
		}			
		if(array.length==0) {
			$.alert("Routing Report를 출력할 항목을 선택해 주세요. ( 공정이 없는 항목은 출력할수 없습니다. )");			
			return;
		}
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
	}
}
$(document).ready(base.init);
$(window).resize(function(){
	if(base.grid){
		var windowHeight = document.documentElement.offsetHeight;
		base.grid.setBodyHeight(windowHeight-200);
	}
});