var base = {
	leadTimeData:{},
	leadTimeEquipmentData:{},
	targetTr:null,
	assignData:null,
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
		var listData = data.routing;
		base.setValue("gop", base.leadTimeData, data.leadTime);
		base.setListValue("gop", base.leadTimeEquipmentData, data.leadTimeEquipment);
		createForm.set({
			width:1100
			,title:"참조 Routing 조회"
			,makeType:"view"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
				,equipment_seq:0
			}
			,service:"/master/routing/update"
			,formData:formData
			,beforeHandler:function(){
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					location.reload();
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
						,width:460
						,dataType:"all"
						,must:true
					},{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:280
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
						,must:true
					},{
						title:"변경이력"
						,id:"history"
						,type:"customize"
						,html:"<button class='btn large changeHistory' onclick='base.revision()'>이력보기</button>"
						,width:80
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
					{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
					,{header:'OP',name:'op', width:70,resizable: false,type:"input",must:true,maxLength:4,dataType:"int",autoIncrement:10,zeroFill:4,textAlign:"center"}
					,{header:'SOP',name:'sop', width:70,resizable: false, align:"center",type:"input",must:true,maxLength:4,dataType:"int",zeroFill:4,textAlign:"center"}
					,{header:'GOP',name:'gop', width:70,resizable: false, align:"center",type:"input",must:true,textAlign:"center"}
					,{header:'작업장',name:'workcenter',resizable: false,width:150,type:"input",must:true,makeType:"view"}
					//,{header:'Standard Text Title',name:'standard_text_title',resizable: false,type:"input",attribute:true,attributeParam:{"standard_text_code":"standard_text_code","standard_text":"standard_text","standard_text_revision":"standard_text_revision"}}
					,{header:'Standard Text Title',name:'standard_text_title',resizable: false,type:"customize",html:"<input type='text' name='standard_text_title' autocomplete='off' title='Standard Text Title'  class='grid-input' style='width:85%'><button class='btn middle' onclick='base.standardText(this)' style='margin-left:2px;margin-top:-5px;'>조회</button>",attribute:true,attributeParam:{"standard_text_code":"standard_text_code","standard_text":"standard_text","standard_text_revision":"standard_text_revision"}}
					,{header:'검사코드',name:'inspection_code',resizable: false,width:70,type:"input"}
					,{header:'Assign',name:'assign',resizable: false,width:100,type:"customize",html:"<div class='asignHeader'><span></span><span></span><span></span></div><div class='assignBody'><span type='Comp' onclick=\"base.assignPop(this)\"></span><span type='Tool' onclick=\"base.assignPop(this)\"></span><span type='Doc' onclick=\"base.assignPop(this)\"></span></div>"}
					,{header:'L/T조회',name:'lt_manage',resizable: false,width:85,type:"customize",html:"<button class='btn middle' onclick='base.leadTime(this)'>L/T 조회</button>"}
				]
			}
		]});
		setTimeout(base.make,100);
	},
	revision:function(){
		popup.create({title:"변경 이력",width:950,height:750,type:"content",href:"/front/master/routing/revision.html"});
	},
	assignPop:function(obj){
		var type = $(obj).attr("type");
		base.targetTr = $(obj).closest("tr");
		var title = {Comp:"Component",Tool:"Tool",Doc:"Document"};
		popup.create({title:title[type]+" 관리",width:950,height:750,type:"content",href:"/front/master/routing/assign"+type+".html?type=view"});
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
		popup.create({title:"Standard Text 조회",width:700,height:650,type:"content",href:"/front/master/routing/standardTextView.html"});
	},        
	leadTime:function(obj) {				 
		base.targetTr = $(obj).closest("tr");
		popup.create({title:"L/T 조회",width:700,height:650,type:"content",href:"/front/master/routing/leadTimeView.html"});
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
		var prevGop = "";
		$("tr input[name=gop]").each(function(index, obj){	
			if($(obj).val() != prevGop) { 
				prevGop = $(obj).val();
			}else {
				$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",true);					
			}																									
		}); 
	}              
}
$(document).ready(base.init);