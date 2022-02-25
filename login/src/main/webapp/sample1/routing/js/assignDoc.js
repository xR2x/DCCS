var base = {
	gop:null,
	workcenter:null,
	type:urlParam.get("type"),
	init:function(){		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});
		base.assignLoad();
	},
	assignLoad:function(){
		var data = parent.base.targetTr.attr("Doc")?JSON.parse(parent.base.targetTr.attr("Doc")):[];
		var height = base.type=="view"?590:210;
		createForm.list.create({
			name:"Assign"
			,list:true
			,id:"assignTool"
			,listData:data
			,effect:false
			,autoScroll:false
			,bodyHeight:height
			,target:"form1"
			,columns:[
				{header:'Document No.',name:'document_no',resizable: true, minWidth:100, width:200,type:"text",align:"center"}
				,{header:'Type',name:'document_type',resizable: true,minWidth:100, type:"text"}
				,{header:'Project',name:'project_name',resizable: true,minWidth:100, type:"text"}
				,{header:'Revision',name:'revision',resizable: false,width:70,type:"text",align:"center"}
				,{header:'Sheet',name:'sheet',resizable: false,width:70,type:"text",align:"center"}
			]
		});
		if(base.type != "view"){
			base.docLoad();
		}else{
			$.loading.del();
			$(".hideArea").hide();
			setTimeout(function(){
				$(".tui-grid-row").addClass("default");
			},200);
		}
	},
	docLoad:function(){
		var param = {
			sort:"document_no"
			,sortType:"ASC"
			,active_flag:"X"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/document/read",
			data:param,
			success:function(json, status, res){
				try{
					var datas = [];
					var k = 0;
					for(var i=0;i<json.data.length;i++){
						if(base.checkAssign(json.data[i])){
							datas[k++] = json.data[i];
						}
					}
					createForm.list.create({
						name:"Doc Master"
						,list:true
						,id:"document"
						,listData:datas
						,effect:false
						,autoScroll:false
						,bodyHeight:200
						,target:"form2"
						,columns:[
							{header:'Document No.',name:'document_no',resizable: true, minWidth:100, width:200,type:"text",align:"center"}
							,{header:'Type',name:'document_type',resizable: true,minWidth:100, type:"text"}
							,{header:'Project',name:'project_name',resizable: true,minWidth:100, type:"text"}
							,{header:'Revision',name:'revision',resizable: false,width:70,type:"text",align:"center"}
							,{header:'Sheet',name:'sheet',resizable: false,width:70,type:"text",align:"center"}
						]
					});
					$.loading.del();
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
		var assignData = parent.base.targetTr.attr("Doc")?JSON.parse(parent.base.targetTr.attr("Doc")):[];
		for(var i=0;i<assignData.length;i++){
			var assign = assignData[i];
			if(data.document_no == assign.document_no && data.revision == assign.revision && data.sub_revision == assign.sub_revision && data.sheet == assign.sheet){
				return false;				
			}
		}
		return true;
	},
	set:function(){		
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
		parent.base.assign("Doc",data);
		parent.popup.close();
	}
}
$(document).ready(base.init);