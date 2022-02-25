var base = {
	selectWorkcenter:null,
	selectEquipment:null,
	workcenterData:null,
	oldEquipment:null,
	lastObj:null,
	ajaxCheck:false,
	status:{"W":"대기","S":"예정","P":"진행","E":"완료","N":"중지","-":"신규"},
	init:function(){
		base.checkBarcode();
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [
			{header:'SO',name:'order_number',resizable: false,width:200}
			,{header:'GOP',name:'gop',resizable: false,width:100}
			,{header:'Material',name:'material',resizable: false, align:"center"}
			,{header:'Plant',name:'plant',resizable: true,width:100}
			,{header:'Qty',name:'qty',resizable: false,width:50}
			,{header:'시작일',name:'history_date',resizable: false,width:120}
			,{header:'예상종료일',name:'wc_end_date',resizable: false,width:100}
		];
		$("#createWrap").height(windowHeight-130);
		$("span.reload").attr("title","새로고침").click(function(e){
			e.stopPropagation();
			e.preventDefault();
			base.reload($(this).parent().attr("status"));
		});
		$("span.info").attr("title","컬럼정보").click(function(e){
			e.stopPropagation();
			e.preventDefault();
			if($(this).parent().next(".header").css("display") == "block"){
				$(this).parent().next(".header").stop(true,true).slideUp(200,'swing');
			}else{
				$(this).parent().next(".header").stop(true,true).slideDown(200,'swing');
			}

		});
		$(".soSearch input").change(function(){
			base.getDispatch();
		});
		setTimeout(function(){
			base.grid = new tui.Grid({
				el: document.getElementById('gridArea'),
				bodyHeight: $(".reportMiddle")[0].offsetHeight-39,
				message:{noData:"등록된 SO가 없습니다."},
				scrollX: true,
				scrollY: true,
				columns:[],
				columnOptions: {
					frozenCount: 0,
					frozenBorderWidth: 1,
					virtualScrolling: true,
					resizable: true
				}
			});
			base.grid.setColumns(base.columns);
		},100);
		$('.scrollbar-inner').scrollbar();
		base.getWorkCenterList();
		base.makeDrop();

	},
	getWorkCenterList:function(){
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/read",
			data:{
				sort:"ccr_flag"
				,sortType:"ASC"
				,sort2:"workcenter"
				,sortType2:"ASC"
			},
			success:function(json, status, res){
				try{
					base.workcenterData = json;
					base.makeWorkCenterList();
					$("#workcenter").on("change",function(){
						base.makeWorkCenterList($("#workcenter").val());
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
	makeWorkCenterList:function(search){
		$(".workCenterList .scroll-content").html("");
		if($(".workCenterList .scroll-content").length == 0){
			$('.scrollbar-inner').scrollbar();
			base.makeWorkCenterList();
		}else{
			var json = base.workcenterData;
			var keyword = (search)?search.toLowerCase():null;
			for(var i=0;i<json.data.length;i++){
				var data = json.data[i];
				if(data.workcenter.toLowerCase().indexOf(keyword) > -1 || keyword == null || data.name.toLowerCase().indexOf(keyword) > -1){
					var ccr = data.ccr_flag == "X"?"ccr":"";
					var list = $("<ul/>").appendTo($(".workCenterList .scroll-content")).html("<strong class='"+ccr+"'>"+data.workcenter+"</strong><br>"+data.name).attr({"workcenter":data.workcenter,"seq":data.seq,"name":data.name});
					list.click(function(){
						base.getWorkCenter($(this).attr("seq"),this);
					});
				}
			}
		}
	},
	getWorkCenter:function(seq,obj,equipmentSeq){
		$(".soListArea.scroll-content").html("");
		$(".tui-grid-row").remove();
		base.grid.dispatch('setLoadingState','EMPTY');
		base.selectEquipment = null;
		base.selectWorkcenter = null;
		$(".workCenterList ul.active").removeClass("active");
		$(obj).addClass("active");
		if($(".alertArea").css("display") == "block"){
			$(".workCenterArea").animate({"width":"200"},200,function(){
				$(".alertArea").hide();
				base.grid.refreshLayout();
			});
		}

		$.loading.make({target:$(".reportArea")});
		$(".equipmentArea").html("");
		var param = {
			seq:seq
			,equipment:true
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/read",
			data:param,
			success:function(json, status, res){
				try{
					base.selectWorkcenter = json.data[0].workcenter;
					if(json.equipment.length > 0){
						var btn = null;
						if(json.equipment.length > 1){
							btn = $("<button/>").appendTo($(".equipmentArea")).addClass("tab").html("전체");
							btn.click(function(){
								base.tabChange(this);
							});
						}
						for(var i=0;i<json.equipment.length;i++){
							btn = $("<button/>").appendTo($(".equipmentArea")).addClass("tab equipment").html(json.equipment[i].equipment_name).attr("equipment_seq",json.equipment[i].equipment_seq);
							if(!equipmentSeq){
								if(i == 0){
									base.selectEquipment = json.equipment[i].equipment_seq;
									btn.addClass("on");
								}
							}else{
								if(json.equipment[i].equipment_seq == equipmentSeq){
									base.selectEquipment = json.equipment[i].equipment_seq;
									btn.addClass("on");
								}
							}
							btn.click(function(){
								base.tabChange(this);
							});
						}
						$(".equipmentArea").show();
						$(".reportMiddle").addClass("equipment");
					}else{
						$(".equipmentArea").hide();
						$(".reportMiddle").removeClass("equipment");
					}
					base.load();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	tabChange:function(obj){
		$(".equipmentArea button.tab").removeClass("on");
		$(obj).addClass("on");
		if($(obj).attr("equipment_seq")){
			base.selectEquipment = $(obj).attr("equipment_seq");
			$("#order_number").prop("disabled",false);
			$("#gop").prop("disabled",false);
			$("#worker").prop("disabled",false);
		}else{
			base.selectEquipment = null;
			$("#order_number").prop("disabled",true);
			$("#gop").prop("disabled",true);
			$("#worker").prop("disabled",true);
		}
		base.load();
	},
	reload:function(status){
		if(status == "S"){
			base.getDispatch();
		}else{
			base.getOrder(status);
		}
		base.makeGraph([
			$(".countArea.S").html()
			,$(".countArea.W").html()
			,$(".countArea.P").html()
			,$(".countArea.E").html()
			,$(".countArea.N").html()
		]);
	},
	load:function(){
		try{
			base.grid.setHeight($(".reportMiddle")[0].offsetHeight-31);
			base.getDispatch();
			base.getOrder("W");
			base.getOrder("P");
			base.getOrder("E");
			base.getOrder("N");
			base.getWorker();
		}catch(e){
			console.log(e);
		}
	},
	getDispatch:function(){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:base.selectEquipment
			,status:"S"
			,targetDate:$(".soSearch input[name=soSearch]:checked").val()
		};
		$(".mainArea.S .scroll-content").html("");
		$(".mainArea.S .scroll-content").html("<div class='loading'></div>");
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/getDispatch",
			data:param,
			success:function(json, status, res){
				try{
					var str = [], h =-1;
					for(var i=0;i<json.data.length;i++){
						var line = base.makeLine(json.data[i],"S");
						base.makeDrag(line);
					}
					base.noData($(".mainArea.S .scroll-content"),"S");
					base.getCount();
					setTimeout(function(){
						$.loading.del();
						$(".mainArea.S .scroll-content .loading").remove();
					},100);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	getOrder:function(status){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:base.selectEquipment
			,status:status
		};
		$(".mainArea."+status+" .scroll-content").html("");
		$(".mainArea."+status+" .scroll-content").html("<div class='loading'></div>");
		if(status == "P"){
		    base.grid.dispatch('setLoadingState', 'LOADING');
		}
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/getOrder",
			data:param,
			success:function(json, jsonStatus, res){
				try{
					if(status == "P"){
						$(".tui-grid-row").remove();
						for(var i=0;i<json.data.length;i++){
							var line = base.addRow(json.data[i]);
							base.makeDrag(line);
						}
						if(json.data.length == 0){
							base.grid.dispatch('setLoadingState', 'EMPTY');
						}
					}else{
						$(".mainArea."+status+" .scroll-content").html("");
						for(var i=0;i<json.data.length;i++){
							var line = base.makeLine(json.data[i],status);
							base.makeDrag(line);
						}
						base.noData($(".mainArea."+status+" .scroll-content"),status);
					}
					base.getCount();
					setTimeout(function(){
						$.loading.del();
						$(".mainArea."+status+" .scroll-content .loading").remove();
					},100);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	getCount:function(){
		$(".mainArea").each(function(){
			var status = $(this).find(".areaTitle").attr("status");
			$(this).find(".countArea").html($(this).find(".line").length);
		});
		$(".reportMiddle .countArea").html($(".tui-grid-rside-area .tui-grid-row.line").length);
		base.makeGraph([
			$(".countArea.S").html()
			,$(".countArea.W").html()
			,$(".countArea.P").html()
			,$(".countArea.E").html()
			,$(".countArea.N").html()
		]);
	},
	getWorker:function(){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
		};
		$(".workerList .scroll-content").html("");
		$(".workerList .scroll-content").html("<div class='loading'></div>");
		$("#worker").on("keydown",function(e){
			if(e.keyCode == 13){
				e.stopPropagation();
				base.workerCreate();
			}
		});
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/getWorker",
			data:param,
			success:function(json, status, res){
				try{
					var line,photo,info,btn;
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						line = $("<div/>").appendTo($(".workerList .scroll-content")).addClass("list");
						photo = $("<div/>").appendTo(line).addClass("photo");
						info = $("<div/>").appendTo(line).addClass("workerInfo").html("<div class='userInfo'><strong>"+data.worker_name+"</strong> ("+data.worker_department+")</div>");
						if(data.status == "P"){
							btn = $("<div/>").appendTo(info).addClass("workerBtn").html("<div class='btn-group' worker='"+data.worker+"' workerInfo='"+data.worker_name+" ("+data.worker_department+")'><button class='btn middle report color gray' onclick='base.workerEnd(this)'>작업보고</button><button class='btn middle color red loss' onclick='base.workerLossPop(this)'>비가동</button><button class='btn middle del' onclick='base.workerDelete(this)'></button></div>");
						}else if(data.status == "W"){
							btn = $("<div/>").appendTo(info).addClass("workerBtn").html("<div class='btn-group' worker='"+data.worker+"' workerInfo='"+data.worker_name+" ("+data.worker_department+")'><button class='btn middle report color blue' onclick='base.workerStart(this)'>작업시작</button><button class='btn middle color red loss' onclick='base.workerLossPop(this)'>비가동</button><button class='btn middle del' onclick='base.workerDelete(this)'></button></div>");
						}else if(data.status == "L"){
							btn = $("<div/>").appendTo(info).addClass("workerBtn").html("<div class='btn-group' worker='"+data.worker+"' workerInfo='"+data.worker_name+" ("+data.worker_department+")'><button class='btn middle lossEnd color gray' onclick='base.workerLossEnd(this)'>비가동 종료</button><button class='btn middle del' onclick='base.workerDelete(this)'></button></div>");
							line.addClass("loss");
							var lossArea = $("<div/>").appendTo(line).addClass("lossArea")
							for(var j=0;j<json.loss.length;j++){
								var loss = json.loss[j];
								if(data.worker == loss.worker){
									lossArea.html("<span class='marquee'>[<strong>"+loss.loss_name+"</strong>] - "+loss.start_date+"</span>");
								}
							}
						}
					}
					$(".countArea.worker").html(json.data.length);
					if(json.data.length == 0){
						$(".workerList .scroll-content").html("<div class='noData'>등록된 작업자가 없습니다.</div>");
					}
					$(".workerList .scroll-content .loading").remove();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerCreate:function(){
		if(base.ajaxCheck == true) return;
		base.ajaxCheck = true;
		if($("#worker").val().replace(/ /g,"") == ""){
			$.alert("작업자를 입력해주세요.");
			$("#worker").focus();
			return;
		}
		var worker = $("#worker").val().indexOf(":") == 1?$("#worker").val().split(":")[1]:$("#worker").val();
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,worker:worker
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/workerCreate",
			data:param,
			success:function(json, status, res){
				try{
					if(!json.error){
						$("#worker").val("");
						base.getWorker();
						$.info("정상적으로 등록되었습니다.");
					}else{
						$("#worker").val("");
						$.alert(json.error);
					}
				}catch(e){
					console.log(e);
				}finally{
					base.ajaxCheck = false;
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerStart:function(obj){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,worker:$(obj).parent().attr("worker")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/workerStart",
			data:param,
			success:function(json, status, res){
				try{
					$.info("정상적으로 시작되었습니다.");
					base.getWorker();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerEnd:function(obj){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,worker:$(obj).parent().attr("worker")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/workerEnd",
			data:param,
			success:function(json, status, res){
				try{
					$.info("정상적으로 시작되었습니다.");
					base.getWorker();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerDelete:function(obj){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,worker:$(obj).parent().attr("worker")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/workerDelete",
			data:param,
			success:function(json, status, res){
				try{
					$.info("정상적으로 삭제되었습니다.");
					base.getWorker();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerLossPop:function(obj){
		popup.create({title:"작업자 비가동 선택",width:700,height:600,type:"content",href:"/front/pop/report/workerLoss.html?worker="+$(obj).parent().attr("worker")});
	},
	workerLossStart:function(worker,lossSeq){
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,loss_seq:lossSeq
			,worker:worker
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/lossStart",
			data:param,
			success:function(json, status, res){
				try{
					$.info("정상적으로 비가동이 시작되었습니다.");
					base.getWorker();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	workerLossEnd:function(obj){
		var worker = $(obj).parent().attr("worker");
		var param = {
			workcenter:base.selectWorkcenter
			,equipment_seq:(base.selectEquipment)?base.selectEquipment:0
			,worker:worker
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/lossEnd",
			data:param,
			success:function(json, status, res){
				try{
					$.info("정상적으로 비가동이 종료되었습니다.");
					base.getWorker();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	addRow:function(data){
		base.grid.dispatch('setLoadingState', 'DONE');
		var line = null;
		for(var i=0;i<$(".tui-grid-body-area .tui-grid-table").length;i++){
			var table = $(".tui-grid-body-area .tui-grid-table").eq(i);
			var tr = $("<tr/>").appendTo(table).addClass("tui-grid-row line P").attr({"order_number":data.order_number,"gop":data.gop,"material":data.material,"plant":data.plant,"qty":data.qty,"uom":data.uom,"wc_start_date":data.wc_start_date,"wc_end_date":data.wc_end_date,"status":"P"});
			for(var j=0;j<table.find("col").length;j++){
				var col = table.find("col").eq(j);
				var key = col.attr("data-column-name");
				var td = $("<td/>").appendTo(tr).addClass("tui-grid-cell tui-grid-cell-has-input").attr({"data-column-name":key}).html(data[key]?data[key]:"-");
			}
			tr.mouseenter(function(){
				for(var i=0;i<$(".tui-grid-body-area .tui-grid-table").length;i++){
					$(".tui-grid-body-area .tui-grid-table").eq(i).find("tr").eq($(this).index()).addClass("hover");
				}
			}).mouseleave(function(){
				for(var i=0;i<$(".tui-grid-body-area .tui-grid-table").length;i++){
					$(".tui-grid-body-area .tui-grid-table").eq(i).find("tr").eq($(this).index()).removeClass("hover");
				}
			});
			line = tr;
		}
		return tr;
	},
	makeLine:function(data,status){
		var date = data.wc_start_date;
		if(status == "E" || status == "N"){
			date = data.history_date;
		}
		var line = $("<div/>").appendTo($(".mainArea."+status+" .soListArea .scroll-content")).addClass("line "+status).attr({"order_number":data.order_number,"gop":data.gop,"material":data.material,"plant":data.plant,"qty":data.qty,"uom":data.uom,"wc_start_date":data.wc_start_date,"wc_end_date":data.wc_end_date,"status":status});
		$("<span/>").appendTo(line).addClass("so").html(data.order_number);
		$("<span/>").appendTo(line).addClass("gop").html(data.gop);
		$("<span/>").appendTo(line).addClass("material").html(data.material);
		if(status == "W"){
			$("<span/>").appendTo(line).addClass("standardText").html(data.standard_text).attr("title",data.standard_text);
		}
		if(status != "S"){
			$("<span/>").appendTo(line).addClass("qty").html(data.qty+""+data.uom);
		}
		$("<span/>").appendTo(line).addClass("date").html(date?date:"-");
		return line;
	},
	noData:function(target,status){
		$(".mainArea."+status+" .scroll-content .noData").remove();
		if($(target).find(".line").length == 0){
			if(status == "P"){
				base.grid.dispatch('setLoadingState', 'EMPTY');
			}else{
				$(".mainArea."+status+" .scroll-content").html("<div class='noData'>등록된 SO가 없습니다.</div>");
			}
		}
	},
	makeDrag:function(obj,option){
		$(obj).draggable({
			zIndex:100
			,revert:"invalid"
			,cursor:"move"
			,cursorAt: {
				left:100,
				top:30
			}
			,tolerance:"fit"
			,start: function(event,ui){
				$(event.target).addClass("dragStart");
			}
			,stop: function(event,ui){
				$(event.target).removeClass("dragStart");
			}
			,revertDuration: 100
			,helper: function(event,ui){
				var obj = $(event.target).parent();
				var div = $("<div class='dragHelper'/ style='margin-left:100px;margin-top:30px'>").appendTo($("body")).html(base.status[obj.attr("status")]+"상태에서 이동<br> SO : <strong>"+obj.attr("order_number")+"</strong> , 공정 : <strong>"+obj.attr("gop")+"</strong>");
				return div;
			}
			,containment1:".reportArea"
			,scroll: false
		}).dblclick(function(e){
			selectText(e.target);
//			$(e.target).children().select();
		}).click(function(e){
			unSelectText();
		});
		$(".equipmentArea .tab.equipment").droppable({
			over:function(event,ui){
				if(base.oldEquipment == null){
					base.oldEquipment = base.selectEquipment;
				}
				base.tabChange($(event.target));
				base.makeDrop();
			}
		});
	},
	makeDrop:function(){
		$(".mainArea.S").droppable({
			drop:function(event,ui){
				base.oldEquipment = null;
				base.lastObj = $(ui.draggable[0]);
				popup.create({
					title:"상태변경확인"
					,width:350
					,height:190
					,type:"confirm"
					,message:"대기/진행/완료된 오더를 예정으로 변경하면 작업했던 모든 내역이 사라집니다.<br>예정으로 변경하시겠습니까?"
					,button:[{
							title:"<strong>네</strong> (계속진행)"
							,keyCode:13
							,handler:function(){
								base.create(base.lastObj,"S");
								popup.close();
							}
							,cssClass:"btn color red middle"
						},{
							title:"<strong>아니오</strong> (취소)"
							,keyCode:27
							,handler:function(){
								popup.close();
							}
							,cssClass:"btn middle"
						}						
					]
				});
//				base.create($(ui.draggable[0]),"S");
			}
		});

		$(".mainArea.W").droppable({
			drop:function(event,ui){
				base.create($(ui.draggable[0]),"W");
				base.oldEquipment = null;
			}
		});

		$(".reportMiddle").droppable({
			drop:function(event,ui){
				base.create($(ui.draggable[0]),"P");
				base.oldEquipment = null;
			}
		});

		$(".mainArea.N").droppable({
			drop:function(event,ui){
				$(".jq-toast-single").remove();
				base.lastObj = $(ui.draggable[0]);
				popup.create({title:"중지사유 입력",width:400,height:305,type:"content",href:"/front/pop/report/workStop.html"});
				base.oldEquipment = null;
			}
		});

		$(".mainArea.E").droppable({
			drop:function(event,ui){
				base.create($(ui.draggable[0]),"E");
				base.oldEquipment = null;
			}
		});
	},
	makeAcceptLine:function(status){
		return;
		var result = "";
		switch(status){
			case "S" :
				result = ".line.W, .line.P, .line.E";
				if(base.oldEquipment != base.selectEquipment){
				}
			break;
			case "W" :
				result = ".line.S, .line.P, .line.N, .line.E";
				if(base.oldEquipment != base.selectEquipment){
					result = ".line.W, .line.P, .line.N, .line.E";
				}
			break;
			case "P" :
				result = ".line.S, .line.W, .line.N, .line.E";
			break;
			case "N" :
				result = ".line.P, .line.W, .line.E";
			break;
			case "E" :
				result = ".line.P, .line.W, .line.N";
			break;
		}
		return result;
	},
	makeWorkStop:function(remark){
		base.create(base.lastObj,"N","사유 : "+remark);
	},
	go:function(param){
		$("#workcenter").val("");
		base.makeWorkCenterList($("#workcenter").val());
		var workCenterObj = $(".scroll-content ul[workcenter="+param.workcenter+"]");
		$(".workCenterList.scroll-content").scrollTop(workCenterObj.offset().top-160);
		base.getWorkCenter(workCenterObj.attr("seq"),workCenterObj,param.equipmentSeq);
		setTimeout(function(){
			base.findOrder(param);
		},300);
	},
	findOrder:function(param){
		if(param.equipmentSeq){
		}
		var target = (param.status == "P")?" td":"";
		target = $(".line[order_number="+param.orderNumber+"][gop="+param.gop+"]"+target);
		target.parent().scrollTop(target.offset().top-170);
		$.lineEffect({target:target,color:"#ee8672",speed:300});
	},
	create:function(obj,status,addRemark){
		if(obj){
			if(obj.attr("status") == status && base.oldEquipment == null) return;
		}
		var remark = base.status[obj.attr("status")]+"에서 "+base.status[status]+""+(isEndWithConsonant(base.status[status])?"으로":"로")+" 상태변경";
		if(addRemark){
			remark += " ["+addRemark+"]";
		}
		var param = attrToArray(obj);
		param["workcenter"] = base.selectWorkcenter;
		param["equipment_seq"] = base.selectEquipment;
		param["previous_status"] = obj.attr("status");
		param["status"] = status;
		param["remark"] = remark;
		if(base.oldEquipment != null){
			param["equipmentChange"] = true;
		}
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/so/orderCreate",
			data:param,
			success:function(json, jsonStatus, res){
				try{
					if(json.error){
						if(json.error.code == "E01"){
							var equipment = (json.error.data.equipment_seq)?"<br>장비 : "+json.error.data.equipment_name:"";
							$.alert("이전 공정이 완료되지 않았습니다.<strong><br>작업장 : "+json.error.data.workcenter+""+equipment+"<br>GOP : "+json.error.data.gop+"</strong><br><button class='btn middle' onclick=\"base.go({orderNumber:'"+json.error.data.order_number+"',gop:'"+json.error.data.gop+"',status:'"+json.error.data.status+"',workcenter:'"+json.error.data.workcenter+"',equipmentSeq:'"+json.error.data.equipment_seq+"'})\">해당 위치로 이동하기</button>",{time:10000});
						}else if(json.error.code == "E02"){
							$("#order_number").focus();
							$.alert(json.error.message);
							var target = (json.error.data[0].status == "P")?" td":"";
							$.lineEffect({target:$(".line[order_number="+json.error.data[0].order_number+"][gop="+json.error.data[0].gop+"]"+target),color:"#ee8672",speed:300});
						}else if(json.error.code == "E03"){
							$.alert(json.error.message);
						}else if(json.error.code == "E04"){
							var equipment = json.error.data;
							var equipments = "";
							for(var i=0;i<equipment.length;i++){
								equipments += equipment[i].equipment_name+",";
							}
							$.alert("해당 공정은 <strong>["+equipments.replace(/,\s*$/, "")+"]</strong>에서만 작업가능합니다.");
							base.tabChange($(".equipmentArea button[equipment_seq="+equipment[0].equipment_seq+"]"));
						}
					}else{
						var line = null;
						base.load();
						var previousParent = obj.parent();
						var previousStatus = obj.attr("status");
						obj.remove();
						base.noData(previousParent,previousStatus);
						$.info("상태가 정상적으로 변경되었습니다.");
						base.lastObj = null;
					}
					base.ois = false;
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	},
	insertOrder:function(){
		if(base.ois == true) return;
		base.ois = true;
		if($("#order_number").val().replace(/ /g,"") == ""){
			$.alert("SO를 입력해주세요.");
			$("#order_number").focus();
			return false;
		}
		if($("#gop").val().replace(/ /g,"") == ""){
			$.alert("GOP를 입력해주세요.");
			$("#gop").focus();
			return false;
		}
		var param = {
			order_number:$("#order_number").val().replace(/ /g,"")
			,gop:$("#gop").val().replace(/ /g,"")
			,status:$("input[name=orderStatus]:checked").val()
		}
		param["workcenter"] = base.selectWorkcenter;
		param["equipment_seq"] = base.selectEquipment;
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"/pop/so/orderCheck",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error){
						if(json.error.code == "E01"){
							var equipment = (json.error.data.equipment_seq)?"<br>장비 : "+json.error.data.equipment_name:"";
							$.alert("이전 공정이 완료되지 않았습니다.<strong><br>작업장 : "+json.error.data.workcenter+""+equipment+"<br>GOP : "+json.error.data.gop+"</strong><br><button class='btn middle' onclick=\"base.go({orderNumber:'"+json.error.data.order_number+"',gop:'"+json.error.data.gop+"',status:'"+json.error.data.status+"',workcenter:'"+json.error.data.workcenter+"',equipmentSeq:'"+json.error.data.equipment_seq+"'})\">해당 위치로 이동하기</button>",{time:10000});
						}else if(json.error.code == "E02"){
							$("#order_number").focus();
							$.alert(json.error.message);
							var target = (json.error.data[0].status == "P")?" td":"";
							$.lineEffect({target:$(".line[order_number="+json.error.data[0].order_number+"][gop="+json.error.data[0].gop+"]"+target),color:"#ee8672",speed:300});
						}else if(json.error.code == "E03"){
							$.alert(json.error.message);
						}else if(json.error.code == "E04"){
							var equipment = json.error.data;
							var equipments = "";
							for(var i=0;i<equipment.length;i++){
								equipments += equipment[i].equipment_name+",";
							}
							$.alert("해당 공정은 <strong>["+equipments.replace(/,\s*$/, "")+"]</strong>에서만 작업가능합니다.");
							base.tabChange($(".equipmentArea button[equipment_seq="+equipment[0].equipment_seq+"]"));
						}
						base.ois = false;
						return;
					}else if(json.change){
//						base.getOrder(json.change[0].status);
//						base.getOrder($("input[name=orderStatus]:checked").val());
						data = json.change[0];
						$("#order_number").val("");
						$("#gop").val("");
						var tmp = $("<div/>").appendTo($(".soInput")).attr({material:data.material,order_number:data.order_number,plant:data.plant,gop:data.gop,qty:data.qty,uom:data.uom,"wc_start_date":data.wc_start_date,"wc_end_date":data.wc_end_date,status:"-"});
						base.create(tmp,$("input[name=orderStatus]:checked").val());

//						$.info("정상적으로 등록되었습니다.");
						base.ois = false;
					}else{
						if(json.data.length > 0){
							var data = json.data[0];
							if(data.workcenter != base.selectWorkcenter){
								$.alert("해당 SO의 GOP는 작업장 <strong>["+data.workcenter+"]</strong>에서 진행해야합니다.");
								$("#order_number").focus();
								base.ois = false;
							}else{
								$("#order_number").val("");
								$("#gop").val("");
								var tmp = $("<div/>").appendTo($(".soInput")).attr({material:data.material,order_number:data.order_number,plant:data.plant,gop:data.gop,qty:data.qty,uom:data.uom,"wc_start_date":data.wc_start_date,"wc_end_date":data.wc_end_date,status:"-"});
								base.create(tmp,$("input[name=orderStatus]:checked").val());
								base.ois = false;
								return;
							}
						}else{
							$.alert("SO / GOP가 존재하지 않습니다.");
							$("#order_number").focus();
							base.ois = false;
							return;
						}
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
	makeBarcodeResult:function(data){
		var focusObj = $("input:focus")[0];

		if(data.indexOf("::") > -1){
			if(focusObj){
				focusObj.value = "";
			}
			var datas = data.split("::");
			if(datas[0] == "w"){
				var workCenterObj = $(".scroll-content ul[workcenter="+(datas[1])+"]");
				if(workCenterObj.length == 0){
					$.alert("작업장 [<strong>"+datas[1]+"</strong>]가 없습니다.");
					return false;
				}else{
					base.getWorkCenter(workCenterObj.attr("seq"),workCenterObj);
				}
			}else if(datas[0] == "u"){
				if($(".alertArea").css("display") == "block"){
					$.alert("먼저 작업장을 선택해주세요.");
					return false;
				}
				$("#worker").val(datas[1]);
				base.workerCreate();
			}else{
				if($(".alertArea").css("display") == "block"){
					$.alert("먼저 작업장을 선택해주세요.");
					return false;
				}
				$("#order_number").val(datas[0]);
				$("#gop").val(datas[1]);
				base.insertOrder();
				$("#order_number").val("");
				$("#gop").val("");

			}
			if(focusObj){
				focusObj.blur();
			}
		}else{			
			if(focusObj){
				if(focusObj.id == "workcenter"){
					base.makeWorkCenterList($("#workcenter").val());
				}
				if(focusObj.id == "order_number"){
					$("#order_number").keydown(function(e){
						if(e.which == 13){
							$("#gop").focus();
						}
					});
				}
				if(focusObj.id == "gop"){
					$("#gop").keydown(function(e){
						if(e.which == 13){
							base.insertOrder();
						}
					});
				}
			}
		}
	},
	checkBarcode:function(){
		var barObj = null;
		$(document).scannerDetection({
			preventDefault:false,
			ignoreIfFocusOn:false,
			onKeyDetect:function(e){
//				$("#bacodeFocus").focus();
			},
			onReceive:function(e){
				barObj = e;
			},
			onError: function(data, qty,obj) {
				base.makeBarcodeResult(data);
			},
			onComplete:function(data,qty){
				base.makeBarcodeResult(data);

			}
		});
	},
	makeGraph:function(data){
		return;
		if(base.chart){
			base.chart.destroy();
		}
		var ctx = document.getElementById('canvas').getContext('2d');
		base.chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['예정', '대기', '진행', '완료', '중지'],
				borderWidth: 1,
				datasets: [{
					data: data,
					backgroundColor: [
						'rgba(100, 100, 100, .3)',
						'rgba(54, 162, 235, .7)',
						'rgba(15, 129, 0, .7)',
						'rgba(30, 30, 30, .7)',
						'rgba(129, 0, 0, .7)',
					]
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: {
						top:10
					}
				},
				legend: {
					display:false
				},
				scales: {
					xAxes: [{
						ticks: {
							fontSize: 11,
							fontFamily: "돋움",
							stepSize: 1,
							beginAtZero: true
						}
					}],
					yAxes: [{
						display:false,										
						ticks: {
							fontColor: "purple",
							min:0
						}
					}]
				},
				plugins: {
					datalabels: {
						clamping:true,
						align: 'end',
						anchor: 'end',
						formatter: function(value,data) {
							return value;
						},
						font: {
							size:10,
							family:"tahoma"
						}
					}
				}
			}
		});
	}
}
$(document).ready(base.init);