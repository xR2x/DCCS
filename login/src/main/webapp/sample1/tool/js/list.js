var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"tool_no",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		var windowHeight = document.documentElement.offsetHeight;
		base.columns = [{
				title:"Tool No",id:"tool_no",
				grid:{width:200, resizable: false, sortable:true},
				excel:{width:250},
				search:{type:"input",width:200}
			},{
				title:"S/N",id:"tool_sn",
				grid:{width:150, align:"center", sortable:true},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"Revision",id:"revision",
				grid:{width:80, align:"center", sortable:true,resizable:false},
				excel:{width:150},
				search:{type:"input",width:100}
			},{
				title:"Tool Code",id:"tool_code_name",
				grid:{width:200, align:"center", sortable:true,resizable:false},
				excel:{width:150},
				search:{id:"tool_code",type:"select",width:200,data:common.getCommonCode,dataParam:{"type":"tool_code"}}
			},{
				title:"Class",id:"tool_class",
				grid:{width:80, align:"center", sortable:true,resizable:false},
				excel:{width:150},
				search:{type:"select",width:100,data:common.getCommonCode,dataParam:{"type":"tool_class"}}
			},{
				title:"검사주기",id:"inspection_cycle",
				grid:{width:80, align:"center", sortable:true,resizable:false},
				excel:{width:150},
				search:{type:"input",width:100,dataType:"int"}
			},{
				title:"주기기준",id:"inspection_cycle_unit_name",
				grid:{width:80, align:"center", sortable:true,resizable:false},
				excel:{width:150},
				search:{id:"inspection_cycle_unit",type:"select",width:100,data:common.getCommonCode,dataParam:{"type":"inspection_cycle_unit"}}
			},{
				title:"Spec",id:"spec",
				grid:{width:300, align:"center", sortable:true,resizable:false},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"Description",id:"description",
				grid:{width:300, align:"center", sortable:true,resizable:false},
				excel:{width:300},
				search:{type:"input",width:200}
			},{
				title:"Project",id:"project_name",
				grid:{width:200, align:"center", sortable:true,resizable:false},
				excel:{width:200},
				search:{id:"project_code", type:"select",width:100,data:common.getProject}
			},{
				title:"Location",id:"location",
				grid:{width:200, align:"center", sortable:true,resizable:false},
				excel:{width:200},
				search:{type:"input",width:200}
			},{
				title:"Remark",id:"remark",
				grid:{width:200, align:"center", sortable:true,resizable:false},
				excel:{width:200}
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
				frozenCount: 3,
				frozenBorderWidth: 1,
				virtualScrolling: true,
				resizable: true
			}
		});
		base.grid.setColumns(list.get(base.columns,"grid"));
		list.set(base.columns,{excel:{api:"master/tool/read",fileName:(main.nowMenu.name).replaceAll("/","-")}});
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
			url:"/master/tool/read",
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
		for(var i=0;i<json.length;i++){
			data = json[i];
			result[i] = data;
			result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.update(this)'>수정</button><button class='btn middle color red' seq='"+data.seq+"' tool_no='"+data.tool_no+"' tool_sn='"+data.tool_sn+"' revision='"+data.revision+"' onclick='base.remove_confirm(this)'>삭제</button></span>";
		}
		return result;
	},
	view:function(obj){
		hash.set({"service":"master/tool/view&seq="+$(obj).attr("seq")});
	},
	update:function(obj){
		hash.set({"service":"master/tool/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var tool_no = $(obj).attr("tool_no");
		var tool_sn = $(obj).attr("tool_sn");
		var revision = $(obj).attr("revision");
		popup.create({
			title:"치공구/Tool 마스터 삭제"
			,width:320
			,height:220
			,type:"confirm"
//			,message:"TOOL No : "+tool_no+" / Serial No : "+tool_sn+" / Revision :  "+revision+" <br>Tool을 삭제하시겠습니까?"
			,message:"Tool No : "+tool_no+" <br> Serial No : "+tool_sn+" <br> Revision :  "+revision+" <br>Tool을 삭제하시겠습니까?"
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
			,tool_no: $(obj).attr("tool_no")
			,tool_sn: $(obj).attr("tool_sn")
			,revision: $(obj).attr("revision")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/tool/delete",
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