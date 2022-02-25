var base = {
	init:function(){
		base.set(); 
	},
	set:function(){
		createForm.set({
			width:1000
			,title:"작업자 SHIFT 일괄 변경"
			,createBtnName:"일괄변경"  
			,divisionType:null
			,service:"/master/worker/shiftUpdate"
			,defaultValue:{
			}
			,beforeHandler:function(form){		  				
				if(!base.listCheck()) {
					return false;
				}
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"master/worker/list"});
				},500);
			},
			data:[{
			
			},{
				name:"변경 항목"
				,list:true
				,id:"shift"
				,bodyHeight:document.documentElement.offsetHeight-320
				,target:"form1"
				,columns:[
					{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
					,{header:'기존 Shift',name:'fromShift', width:150, resizable: false, type:"select",textAlign:"center",data:common.getShiftCode, must:true}
					,{header:'변경 Shift',name:'toShift', width:150, resizable: false, type:"select",textAlign:"center",data:common.getShiftCode, must:true}
					,{header:'기준 부서',name:'department', resizable: false, type:"select",textAlign:"center",data:common.getDepartment}
					,{header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='base.remove(this);'>삭제</button>"}
				]
			}
		]});
		base.make();
	},
	listCheck:function() {

		var check = true;

		var tableObj = $(".listForm").eq(0); 

		var data = {};

		for(var j=0;j<tableObj.find(".tui-grid-rside-area tr.tui-grid-row").length;j++){
			var rside = tableObj.find(".tui-grid-rside-area tr.tui-grid-row").eq(j);
			var lside = tableObj.find(".tui-grid-lside-area tr.tui-grid-row").eq(j);
			var tmp = (rside.serialize(lside.serialize({},{type:"hashmap"}),{type:"hashmap"}));				

			if(tmp.fromShift == tmp.toShift) {
				check = false;						   
				$.alert("변경될 Shift정보가 기존정보와 동일할 수 없습니다.");				
				rside.find("select[name=toShift]").focus();
			}  												  

			if(data[tmp.fromShift+"_"+tmp.department]) {	
				check = false;						   
				$.alert("해당 변경정보는 이미 등록되어 있습니다.");				
				rside.find("select[name=fromShift]").focus();
			}else  {
				data[tmp.fromShift+"_"+tmp.department] = "X";
			}												 			
		}

		return check;
	},
	remove:function(obj){
		createForm.list.remove(obj);
	},
	make:function(){
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("추가");
		add.click(function(){
			createForm.list.addRow(null,"form1");													 
		});
	}
}
$(document).ready(base.init);