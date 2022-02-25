var base = {
	gop:null,
	workcenter:null,
	type:urlParam.get("type"),
	init:function(){		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});
		base.assignLoad();
	},
	assignLoad:function(){
		var data = parent.base.targetTr.attr("Comp")?JSON.parse(parent.base.targetTr.attr("Comp")):[];
		var height = base.type=="view"?590:210;
		createForm.list.create({
			name:"Assign"
			,list:true
			,id:"assignComp"
			,listData:data
			,effect:false
			,autoScroll:false
			,bodyHeight:height
			,target:"form1"
			,columns:[
				{header:'Item',name:'item',resizable: false, width:60,type:"text",align:"center"}
				,{header:'Component',name:'component',resizable: false,type:"text"}
				,{header:'Qty',name:'qpa',resizable: false,width:60,type:"text",align:"center"}
				,{header:'UOM',name:'uom',resizable: false,width:60,type:"text",align:"center"}
				,{header:'ICT',name:'category',resizable: false,width:90,type:"text",align:"center"}
				,{header:'TV',name:'tv',resizable: false,width:90,type:"text",align:"center"}
				,{header:'Eff',name:'eff',resizable: false,width:70,type:"text",align:"center"}
				,{header:'Desc',name:'desc',resizable: false,width:250,type:"text"}
			]
		});
		if(base.type != "view"){
			base.bomLoad();
		}else{
			$.loading.del();
			$(".hideArea").hide();
			setTimeout(function(){
				$(".tui-grid-row").addClass("default");
			},200);
		}
	},
	bomLoad:function(){
		var param = {
			material:parent.$("#material").val()
			,plant:parent.$("#plant").val()
			,active_flag:"X"
			,bom:true
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/bom/read",
			data:param,
			success:function(json, status, res){
				try{
					var datas = [];
					var k = 0;
					if(json.bom){
						for(var i=0;i<json.bom.length;i++){
							if(base.checkAssign(json.bom[i])){
								datas[k++] = json.bom[i];
							}
						}
					}
					createForm.list.create({
						name:"BOM Component"
						,list:true
						,id:"bom"
						,listData:datas
						,effect:false
						,autoScroll:false
						,bodyHeight:200
						,target:"form2"
						,columns:[
							{header:'Item',name:'item',resizable: false, width:60,type:"text",align:"center"}
							,{header:'Component',name:'component',resizable: false,type:"text"}
							,{header:'Qty',name:'qpa',resizable: false,width:60,type:"text",align:"center"}
							,{header:'UOM',name:'uom',resizable: false,width:60,type:"text",align:"center"}
							,{header:'ICT',name:'category',resizable: false,width:90,type:"text",align:"center"}
							,{header:'TV',name:'tv',resizable: false,width:90,type:"text",align:"center"}
							,{header:'Eff',name:'eff',resizable: false,width:70,type:"text",align:"center"}
							,{header:'Desc',name:'desc',resizable: false,width:250,type:"text"}
						]
					});

					base.set();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	checkAssign:function(data){
		var assignData = parent.base.targetTr.attr("Comp")?JSON.parse(parent.base.targetTr.attr("Comp")):[];
		for(var i=0;i<assignData.length;i++){
			var assign = assignData[i];
			if(data.item == assign.item && data.component == assign.component){
				return false;				
			}
		}
		return true;
	},
	set:function(){		
		$.loading.del();
		setTimeout(function(){
			base.drag();
		},100);
		$("#form1").droppable({
			accept:"#form2 .tui-grid-row"
			,drop:function(event,ui){
				var data = base.getData(ui.draggable[0]);
				createForm.list.addRow(data,"form1");
				createForm.list.remove($(ui.draggable[0]).find("td").eq(0));
				base.drag();
			}
		});
		$("#form2").droppable({
			accept:"#form1 .tui-grid-row"
			,drop:function(event,ui){
				var data = base.getData(ui.draggable[0]);
				createForm.list.addRow(data,"form2");
				createForm.list.remove($(ui.draggable[0]).find("td").eq(0));
				base.drag();
			}
		});
	},
	drag:function(){
		$(".tui-grid-row").draggable({
			zIndex:100
			,revert:"invalid"
			,cursor:"move"
			,tolerance:"fit"
			,scroll: false
			,revertDuration: 100
			,start: function(event,ui){
				$(event.target).addClass("dragStart");
			}
			,stop: function(event,ui){
				$(event.target).removeClass("dragStart");
			}
			,helper: function(event,ui){
				var obj = $(event.target).closest(".tui-grid-row");
				var col = $(event.target).closest(".tui-grid-table").find("colgroup");
				var div = $("<table class='dragHelper'/>").appendTo($("body")).html("<colgroup>"+col.html()+"</colgroup><tr>"+obj.html()+"</tr>");
				return div;
			}

		});
	},
	getData:function(obj){
		var result = {};
		var td = $(obj).find("td");
		for(var i=0;i<td.length;i++){
			var key = td.eq(i).attr("data-column-name");
			var value = td.eq(i).find(".textLayer");
			result[key] = stripTags(value.html());
		}
		return result;
	},
	save:function(){
		var data = [];
		for(var i=0;i<$("#form1 .tui-grid-rside-area tr.tui-grid-row").length;i++){
			var tr = $("#form1 .tui-grid-rside-area tr.tui-grid-row").eq(i);
			data[i] = base.getData(tr);
		}
		parent.base.assign("Comp",data);
		parent.popup.close();
	}
}
$(document).ready(base.init);