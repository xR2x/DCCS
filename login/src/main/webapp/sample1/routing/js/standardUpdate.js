var base = {
	revision:null,
	leadTimeData:{},
	leadTimeEquipmentData:{},
	assignData:null,
	targetTr:null,
	init:function(){ 
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
			,routing:true
			,leadTime:true
			,assign:true
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/read",
			data:param,
			success:function(json, status, res){
				try{
					base.assignData = json.assign;
					base.set(json);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	set:function(data){
		var formData = data.data;			 
		base.revision = formData[0].revision;
		var listData = data.routing;
		base.setValue("gop", base.leadTimeData, data.leadTime);
		base.setListValue("gop", base.leadTimeEquipmentData, data.leadTimeEquipment);
		createForm.set({
			width:1100
			,title:"참조 Routing 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
				,active_flag:"X"
				,standard_flag:"X"
			}
			,service:"/master/routing/update"
			,formData:formData
			,beforeHandler:function(form){
				if(!$("#revision").attr("disabled")) {
					if($("#revision").val() == base.revision) {
						$.alert("변경할 Routing Revision을 입력해 주세요.");
						$("#revision").focus();
						return false;
					}										   
				}					 				
				if(base.gopCheck() == false) {
					$.alert("같은 GOP를 여러 범위에서 사용할 수 없습니다.");
					return false;
				}
				form.append("leadTimeData",JSON.stringify(base.leadTimeData));
				form.append("leadTimeEquipmentData",JSON.stringify(base.leadTimeEquipmentData));
				form.set("listData",JSON.stringify(base.getAllData()));							
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.add({"seq":json.seq});
				},500);
			},
			data:[{
				name:"참조 Routing 기본정보"
				,data:
				[[
					{
						title:"참조 Routing 이름"
						,id:"material"
						,type:"input"
						,width:425
						,dataType:"all"
						,disable:true
						,must:true
					},{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:220
						,data:common.getProject
						,dataType:"all"
						,must:true
					},{
						title:"공정순서대로 작업"
						,id:"sequence_operation"
						,type:"input"
						,value:"X"
						,checked:(formData[0].sequence_operation == "X")?true:false
						,switch:true
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
						,dataType:"all"
						,disable:true
						,must:true
					},{
						title:"Rev 변경"
						,id:"changeRevision"
						,type:"input"
						,width:70
						,dataType:"all"
						,titleAlign:"center"
						,switch:true
						,onChange:function(obj){
							base.revisionChange();
							form.make.must($("#newRevision"),$(this).prop("checked"));
						}
					},{
						title:"변경할 Revision"
						,id:"newRevision"
						,type:"input"
						,width:100
						,dataType:"all"
						,disable:true
					}
				],[
					{
						title:"General Note"
						,id:"general_note"
						,type:"textarea"
						,width:1070
						,height:100
						,dataType:"all"
					}
				]]
			},{
				name:"공정정보"
				,list:true
				,id:"routing"
				,listData:listData
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:[
					{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\' list_seq='+formData[0].seq+'>',name:'_checked', width:30,resizable: false}
					,{header:'OP',name:'op', width:70,resizable: false,type:"input",must:true,maxLength:4,dataType:"int",autoIncrement:10,zeroFill:4,textAlign:"center"}
					,{header:'SOP',name:'sop', width:70,resizable: false, align:"center",type:"input",must:true,maxLength:4,dataType:"int",zeroFill:4,textAlign:"center"}
					,{header:'GOP',name:'gop', width:70,resizable: false, align:"center",type:"input",must:true,textAlign:"center",onInput:function() {base.dataCheck();}}
					,{header:'작업장',name:'workcenter',resizable: false,width:130,type:"select",must:true,data:common.getWorkCenter,focus:true,onChange:function(){base.dataCheck(this);}}
//					,{header:'Standard Text Title',name:'standard_text_title',resizable: false,type:"input", disable:true,attribute:true,attributeParam:{"standard_text_code":"standard_text_code","standard_text":"standard_text","standard_text_revision":"standard_text_revision"}}
					,{header:'Standard Text Title',name:'standard_text_title',resizable: false,type:"customize",html:"<input type='text' name='standard_text_title' autocomplete='off' title='Standard Text Title' disabled='' class='grid-input' style='width:85%'><button class='btn middle' onclick='base.standardText(this)' style='margin-left:2px;margin-top:-5px;'>검색</button>",attribute:true,attributeParam:{"standard_text_code":"standard_text_code","standard_text":"standard_text","standard_text_revision":"standard_text_revision"}}
					,{header:'검사코드',name:'inspection_code',resizable: false,width:70,type:"select",data:common.getCommonCode,dataParam:{"type":"inspection_code","viewType":"value"}}
					,{header:'S/T관리',name:'lt_manage',resizable: false,width:85,type:"customize",html:"<button class='btn middle' onclick='base.leadTime(this)'>S/T 관리</button>"}
					,{header:'Assign',name:'assign',resizable: false,width:100,type:"customize",html:"<div class='asignHeader'><span></span><span></span><span></span></div><div class='assignBody'><span type='Comp' onclick=\"base.assignPop(this)\"></span><span type='Tool' onclick=\"base.assignPop(this)\"></span><span type='Doc' onclick=\"base.assignPop(this)\"></span></div>"}
					,{header:'삭제',name:'manage',resizable: false,width:60,type:"customize",html:"<button class='btn middle color red' onclick='base.remove(this)'>삭제</button>"}
				]
			}
		]});		
		setTimeout(base.make,100);
	},
	revisionChange:function(){
		if($("#changeRevision").prop("checked") == true){
			$("#newRevision").prop("disabled",false);
		}else{
			$("#newRevision").prop("disabled",true);
		}
	},
	assignPop:function(obj){
		var type = $(obj).attr("type");
		base.targetTr = $(obj).closest("tr");
		var title = {Comp:"Component",Tool:"Tool",Doc:"Document"};
		popup.create({title:title[type]+" 관리",width:950,height:750,type:"content",href:"/front/master/routing/assign"+type+".html"});
	},
	assign:function(target,array,tr){
		var tr = tr?tr:base.targetTr;
		if(array.length == 0){
			tr.removeAttr(target);
			tr.find(".assignBody span[type="+target+"]").removeClass("on");
		}else{
			tr.attr(target,JSON.stringify(array));
			tr.find(".assignBody span[type="+target+"]").addClass("on");
		}
	},
	getAllData:function(){
		var listData = {};
		for(var i=0;i<$(".listForm").length;i++){
			var listId = $(".listForm").eq(i).attr("listId");
			var tableObj = $(".listForm").eq(i); 
			listData[listId] = [];
			var assignType = ["Comp","Tool","Doc"];
			for(var j=0;j<tableObj.find(".tui-grid-rside-area tr.tui-grid-row").length;j++){
				var rside = tableObj.find(".tui-grid-rside-area tr.tui-grid-row").eq(j);
				var lside = tableObj.find(".tui-grid-lside-area tr.tui-grid-row").eq(j);		   
				var param = rside.serialize(lside.serialize({},{type:"hashmap"}),{type:"hashmap"});
				if(rside.find("input[name=standard_text_title]").attr("standard_text_code")) {
				 	if(rside.find("input[name=standard_text_title]").attr("standard_text_code")!="") {
						param["standard_text_code"] = rside.find("input[name=standard_text_title]").attr("standard_text_code");
						param["standard_text_revision"] = rside.find("input[name=standard_text_title]").attr("standard_text_revision");
					}
				}
				if(rside.find("input[name=standard_text_title]").attr("standard_text")) {
					param["standard_text"] = rside.find("input[name=standard_text_title]").attr("standard_text");
				}
				param["assign"] = new Array();
				for(var k=0;k<assignType.length;k++){
					if(rside.attr(assignType[k])){
						param["assign"].push({type:assignType[k],data:rside.attr(assignType[k])});
					}
				}
				listData[listId].push(param);
			}
		}
		return listData;
	},
	gopCheck:function() {		
		var returnCheck = true;
		var check = [];
		$("tr input[name=gop]").each(function(index, obj) {	 	
			var op = $("tr input[name=op]").eq(index).val();
			var sop = $("tr input[name=sop]").eq(index).val();
			var gop = $("tr input[name=gop]").eq(index).val();	
			var data ={
			 	"op":op
				,"sop":sop
				,"gop":gop
			};			   
			check.push(data);
		});	   		
		check.sort(function(a, b) {
			return a.sop < b.sop ? -1 : a.sop > b.sop ? 1 : 0;			
		});
		check.sort(function(a, b) {
			return a.op < b.op ? -1 : a.op > b.op ? 1 : 0;			
		});
		var gopCheck = {};
		var prevGop = "";
		for(var i=0; i<check.length; i++) {
		 	var data = check[i];
			if(prevGop != data.gop) {
				if(gopCheck[data.gop]) {
					returnCheck = false;
					break;					
				}else {
					gopCheck[data.gop] = "X";
					prevGop = data.gop;
				}
			}
		}
		return returnCheck;
	},
	dataCheck:function(targetObj) {
		var check = {};
		$("tr input[name=gop]").each(function(index, obj) {	 	
			if(!check[$(obj).val()]){	  
				$("tr select[name=workcenter]").eq(index).attr("disabled",false);					 
				$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",false);	
				check[$(obj).val()] = $("tr select[name=workcenter]").eq(index).val();
			}else {
				$("tr select[name=workcenter]").eq(index).val(check[$(obj).val()]);		 
				$("tr select[name=workcenter]").eq(index).attr("disabled",true);					
				$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",true);	
			}
		}); 

		if(targetObj) {
			var gop = $(targetObj).closest("tr").find("input[name=gop]").val();
			delete base.leadTimeEquipmentData[gop];	
		}
	},
	remove:function(obj){
		createForm.list.remove(obj);
		base.dataCheck();			
	},
	setValue:function(key, target, data){ 
		for(var i=0; i<data.length; i++) {
			target[data[i][key]] = data[i];
		}
	},
	setListValue:function(key, target, data){ 		
		var prevGop = "";	 		
		for(var i=0; i<data.length; i++) {	  
			var gop = data[i].gop;			  			 	
			if(prevGop != gop) {
				target[gop] = [];
				prevGop = gop;	 
			}		  			
			target[gop].push(data[i]);			
		}
	},
	standardText:function(obj) {				 
		base.targetTr = $(obj).closest("tr");
		popup.create({title:"Standard Text 관리",width:700,height:650,type:"content",href:"/front/master/routing/standardText.html"});
	},
	leadTime:function(obj) {				 
		base.targetTr = $(obj).closest("tr");
		popup.create({title:"L/T 관리",width:700,height:650,type:"content",href:"/front/master/routing/leadTime.html"});
	},
	make:function(){
		for(var i=0;i<$(".tui-grid-rside-area tr.tui-grid-row").length;i++){
			var tr = $(".tui-grid-rside-area tr.tui-grid-row").eq(i);
			var op = tr.find("input[name=op]").val();
			var sop = tr.find("input[name=sop]").val();
			for(var j=0;j<base.assignData.length;j++){
				if(parseInt(op,10) == base.assignData[j].op && parseInt(sop,10) == base.assignData[j].sop){
					base.assign(base.assignData[j].assign_key, JSON.parse(base.assignData[j].assign_value.value), tr);
				}
			}
		}
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("공정추가");
		add.click(function(){
			createForm.list.addRow(null,"form1");
			var op = $("tr input[name=op]").eq(($("tr input[name=op]").length -1)).val();
			$("tr input[name=gop]").eq(($("tr input[name=gop]").length -1)).val(parseInt(op,10));
		});
						 
		var prevGop = "";
		$("tr input[name=gop]").each(function(index, obj){	
			if($(obj).val() != prevGop) { 
				prevGop = $(obj).val();
			}else {
				$("tr select[name=workcenter]").eq(index).attr("disabled",true);					
				$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",true);					
			}																									
		}); 
	}
}
$(document).ready(base.init);