var base = {
	pageSize:25,
	sort:(hash.get("sort"))?hash.get("sort"):"workcenter",
	sortType:(hash.get("sortType"))?hash.get("sortType"):"ASC",
	page:(hash.get("page"))?hash.get("page"):1,
	init:function(){
		try{
			var windowHeight = document.documentElement.offsetHeight;
			base.columns = [{
					title:"작업장코드",id:"workcenter",
					grid:{resizable: false,width:180, sortable:true},
					excel:{width:250},
					search:{type:"input",width:200}
				},{
					title:"작업장명",id:"name",
					grid:{width:200, align:"center", sortable:true},
					excel:{width:300},
					search:{type:"input",width:200}
				},{
					title:"Category",id:"category_name",
					grid:{width:120, align:"center", sortable:true},
					excel:{width:150},
					search:{id:"category",type:"select",width:200,data:common.getCommonCode,dataParam:{"type":"workcenter_category"}}
				},{
					title:"CCR",id:"ccr_flag",
					grid:{width:80, align:"center", sortable:true},
					excel:{width:100},
					search:{type:"input",switch:true,value:"X"}
				},{
					title:"L/T(일)",id:"lead_time",
					grid:{width:100, align:"center", sortable:true},
					excel:{width:140},
					search:{type:"input",width:200,dataType:"int"}
				},{
					title:"Factor (%)",id:"worktime_factor",
					grid:{width:100, align:"center", sortable:true},
					excel:{title:"Factor",width:140},
					search:{type:"input",width:200,dataType:"int"}
				},{
					title:"Grouping 기간(일)",id:"grouping_period",
					grid:{width:150, align:"center", sortable:true},
					excel:{width:160}
				},{
					title:"자원수(장비)",id:"multi_work_count",
					grid:{width:120, align:"center", sortable:true},
					excel:{width:150}
				},{
					title:"장비",id:"equipment_seq",
					search:{type:"select",width:200,data:common.getEquipment}
				},{
					title:"Remark",id:"remark",
					grid:{align:"center", sortable:true},
					excel:{width:300},
					search:{type:"input",width:200}
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
			list.set(base.columns,{excel:{api:"master/workcenter/read",fileName:main.nowMenu.name}});
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
		};
		param = Object.assign(param,hash.array());
	    base.grid.dispatch('setLoadingState', 'LOADING');		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/read",
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
			
			result[i].ccr_flag = (result[i].ccr_flag == "X")?"<img src='/front/common/img/icon/ccr_icon.png'>":"";

			if(Number(data.use_count)>0){
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red disable' title='사용중인 작업장은 삭제할 수 없습니다.' onclick=base.use_info()>삭제</button></span>";
			}else{
				result[i].manage = "<span class='btn-group'><button class='btn middle' seq='"+data.seq+"' onclick='base.view(this)'>조회</button><button class='btn middle' seq='"+data.seq+"' onclick='base.modify(this)'>수정</button><button class='btn middle color red' seq='"+data.seq+"' workcenter='"+data.workcenter+"' onclick='base.remove_confirm(this)'>삭제</button></span>";	
			}
		}
		return result;
	},
	use_info:function(){
		$.alert("사용중인 작업장은 <br>삭제할 수 없습니다.");
	},
	view:function(obj){
		hash.set({"service":"master/workcenter/view&seq="+$(obj).attr("seq")});
	},
	modify:function(obj){
		hash.set({"service":"master/workcenter/update&seq="+$(obj).attr("seq")});
	},
	remove_confirm:function(obj){
		var workcenter = $(obj).attr("workcenter");
		popup.create({
			title:"작업장 삭제"
			,width:320
			,height:160
			,type:"confirm"
			,message:"작업장 : "+workcenter+"을(를) 삭제하시겠습니까?"
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
			,workcenter:$(obj).attr("workcenter")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/delete",
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