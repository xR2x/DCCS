var base = {
	gop:null,
	workcenter:null,
	init:function(){		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});
		base.set();
		base.load();
	},
	set:function(){
		$("#code").val(parent.$("#code").val());
		$("#title").val(parent.$("#title").val());
	},
	load:function(){
		var param = {
			code:$("#code").val()
			,sort:"create_date"
			,sortType:"ASC"
		};						  
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/read",
			data:param,
			success:function(json, status, res){
				try{
					createForm.list.create({
						name:"변경 이력"
						,list:true
						,effect:false
						,autoScroll:false
						,id:"history"
						,bodyHeight:460
						,listData:json.data
						,target:"form1"
						,columns:[
							{header:'Revision',name:'revision',resizable: false,width:100,type:"text"}
							,{header:'변경자',name:'creator_name',resizable: false,width:120,type:"text"}
							,{header:'변경일',name:'create_date',resizable: false,width:150,type:"text"}
							,{header:'Remark',name:'remark',resizable: false,type:"text"}
							,{header:'Active',name:'active',resizable: false,width:80,type:"input",switch:true,switchWidth:60,onChange:function(){base.active(this)},attr:["seq","active_flag","revision"]}
							,{header:'조회',name:'view',resizable: false,width:70,type:"customize",html:"<button class='btn middle' onclick='base.view(this)'>조회</button>",attr:["seq"]}
							,{header:'삭제',name:'delete',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='base.del(this)' disabled>삭제</button>",attr:["seq","active_flag","revision","use_count"]}
						]
					});
					setTimeout(function(){
						base.make();
						$.loading.del();
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
	make:function(){
		 $(".tui-grid-cell[data-column-name=delete][use_count=0] button").each(
			function(index, obj) {		 
				$(obj).prop("disabled",false); 				 
			}
		 );
		var active = $(".tui-grid-cell[data-column-name=active][active_flag=X]");
		active.find("input").prop("checked",true);	 
		$("#activeRevision").val(active.attr("revision"));
		$(".tui-grid-cell[data-column-name=delete][active_flag=X] button").prop("disabled",true);
	},
	view:function(obj){
		parent.hash.add({"seq":$(obj).closest(".tui-grid-cell").attr("seq")});
		parent.popup.close();
	},
	del:function(obj){
		parent.popup.create({
			title:"Revision ["+$(obj).closest(".tui-grid-cell").attr("revision")+"] 삭제"
			,width:350
			,height:150
			,type:"confirm"
			,message:"Revision을 삭제하시겠습니까?"
			,button:[{
				title:"<strong>네</strong> (삭제)"
					,kyeCode:15
					,handler:function(){
						var param = {
							seq:$(obj).closest(".tui-grid-cell").attr("seq")
							,revisionDelete:"X"
						};
						$.ajax({ 
							type:"POST",
							dataType:"json",
							url:"/master/standardText/delete",
							data:param,
							success:function(json, status, res){
								try{
									parent.$.info("정상적으로 삭제되었습니다.");
									parent.popup.close();
									document.location.reload();
								}catch(e){
									console.log(e);
								}
							},
							error:function(e){
								console.log(e);
							}   
						});
					}
					,cssClass:"btn color red middle"
				},{
					title:"<strong>아니오</strong> (취소)"
					,keyCode:16
					,handler:function(){
						parent.popup.close();
					}
					,cssClass:"btn middle"
				}						
			]
		});
	},
	active:function(obj){
		if($(obj).prop("checked") == false){
			$(obj).prop("checked",true);
			return;
		}else{
			$(obj).prop("checked",false);
		}
		parent.popup.create({
			title:"Active Revision 변경"
			,width:350
			,height:230
			,type:"confirm"
			,message:"활성 Revision을 변경하시겠습니까?<br><br>변경 Revision : <strong>"+$("#activeRevision").val()+" -> "+$(obj).closest(".tui-grid-cell").attr("revision")+"</strong><br><br> ※ 이후 변경된 Revision에 따라 동작합니다."
			,button:[{
				title:"<strong>네</strong> (변경)"
					,kyeCode:15
					,handler:function(){
						$(".tui-grid-cell").attr("active_flag",null);
						$(".tui-grid-cell[data-column-name=active] input").prop("checked",false);
						$(".tui-grid-cell[data-column-name=delete][use_count=0] button").prop("disabled",false);
						base.activeChange(obj);
						parent.popup.close();
					}
					,cssClass:"btn color red middle"
				},{
					title:"<strong>아니오</strong> (취소)"
					,keyCode:16
					,handler:function(){
						parent.popup.close();
					}
					,cssClass:"btn middle"
				}						
			]
		});
	},
	activeChange:function(obj){
		var param = {
			code:$("#code").val()
			,revision:$("#activeRevision").val()
			,activeRevision:$(obj).closest(".tui-grid-cell").attr("revision")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/activeRevision",
			data:param,
			success:function(json, status, res){
				try{
					$(obj).prop("checked",true);
					$(".tui-grid-cell[revision="+$(obj).closest(".tui-grid-cell").attr("revision")+"]").attr("active_flag","X");
					$(".tui-grid-cell[data-column-name=delete][active_flag=X] button").prop("disabled",true);
					$("#activeRevision").val($(obj).closest(".tui-grid-cell").attr("revision"));
					parent.$.info("정상적으로 변경되었습니다.");
					parent.hash.add({"seq":$(obj).closest(".tui-grid-cell").attr("seq")});
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   
		});


	},
	select:function(obj){
		var lossSeq = $(obj).closest("td").attr("seq");
		parent.base.workerLossStart(urlParam.get("worker"),lossSeq);
		parent.popup.close();
	}
}
$(document).ready(base.init);