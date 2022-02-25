var base = {
	leadTimeData:{},
	leadTimeEquipmentData:{},
	targetTr:null,
	assignData:null,
	change_no:null,
	allEff:true,     
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
		if(base.change_no){
			param["change_no"] = base.change_no;
		}	 
		if(base.allEff){
			param["allEff"] = "X";
		}
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routing/read",
			data:param,
			success:function(json, status, res){
				try{
					if(json.data.length == 0){
						$.alert("존재하지 않는 Routing입니다.");
						window.history.back();
					}else{
						if(json.data[0].tv_eff_flag){
							if(json.data[0].tv_eff_flag == "X" && !base.change_no){
								base.changeNoPop(json.data[0].material,json.data[0].plant);
								return;
							}
						}
						base.assignData = json.assign;
						base.set(json);
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
	changeNoPop:function(material,plant){
		popup.create({title:"호기 선택",width:700,height:650,type:"content",href:"/front/master/changeNumber/select.html?material="+material+"&plant="+plant});
	},
	changeNoSelect:function(change_no){
		base.change_no = change_no;
		base.load();
	},                 
	set:function(data){
		createForm.reset();
		var formData = data.data;
		var listData = data.routing;	
		var listColumns = [
			{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\' list_seq='+formData[0].seq+'>',name:'_checked', width:30,resizable: false}
			,{header:'OP',name:'op', width:70,resizable: false,type:"input",must:true,maxLength:4,dataType:"int",zeroFill:4,textAlign:"center"}
			,{header:'SOP',name:'sop', width:70,resizable: false, align:"center",type:"input",must:true,maxLength:4,dataType:"int",zeroFill:4,textAlign:"center"}
			,{header:'GOP',name:'gop', width:70,resizable: false, align:"center",type:"input",must:true,textAlign:"center"}
			,{header:'작업장',name:'workcenter',resizable: false,width:150,type:"input",must:true,makeType:"view"}
			,{header:'Standard Text Title',name:'standard_text_title',resizable: false,type:"customize",html:"<input type='text' name='standard_text_title' autocomplete='off' title='Standard Text Title'  class='grid-input' style='width:83%'><button class='btn middle' onclick='base.standardText(this)' style='margin-left:2px;margin-top:-5px;'>조회</button>",attribute:true,attributeParam:{"standard_text_code":"standard_text_code","standard_text":"standard_text","standard_text_revision":"standard_text_revision"}}
			,{header:'검사코드',name:'inspection_code',resizable: false,width:70,type:"input"}
			,{header:'S/T관리',name:'lt_manage',resizable: false,width:85,type:"customize",html:"<button class='btn middle lt_manage_btn' onclick='base.leadTime(this)'>S/T 조회</button>"}
			,{header:'Assign',name:'assign',resizable: false,width:100,type:"customize",html:"<div class='asignHeader'><span></span><span></span><span></span></div><div class='assignBody'><span type='Comp' onclick=\"base.assignPop(this)\"></span><span type='Tool' onclick=\"base.assignPop(this)\"></span><span type='Doc' onclick=\"base.assignPop(this)\"></span></div>"}
		];
		var trAttr = {};
		if(data.data[0].tv_eff_flag == "X"){
			listColumns[9] = {header:'호기정보',name:'tvEff',resizable: false,width:90,type:"view",attr:["tv","eff_from","eff_to","change_no"]};
			trAttr = {target:"tr",attr:["tv","eff_from","eff_to","change_no","seq"]};
		}else {
			trAttr = {target:"tr",attr:["seq"]};
		}
		base.setValue(base.leadTimeData, data.leadTime);
		base.setListValue(base.leadTimeEquipmentData, data.leadTimeEquipment);
		createForm.set({
			width:1100
			,title:"Routing 조회"
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
				name:"Routing 기본정보"
				,data:
				[[
					{
						title:"Material"
						,id:"material"
						,type:"input"
						,width:360
						,dataType:"all"
						,must:true
					},{
						title:"Plant"
						,id:"plant"
						,type:"select"
						,width:100
						,data:common.getPlant
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
				,attr:trAttr
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:listColumns
			}
		]});
		setTimeout(function(){
			base.make(data)
		},100);
	},
	revision:function(){
		popup.create({title:"변경 이력",width:950,height:750,type:"content",href:"/front/master/routing/revision.html"});
	},
	assignPop:function(obj){
		var type = $(obj).attr("type");
		if(type == "Comp"){
			if($("#material").val().replace(/ /g,"") == "" || !$("#plant").val()){
				$.alert("Material / Plant를 입력해주세요.");
				return;
			}
		}
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
	setValue:function(target, data){ 
		for(var i=0; i<data.length; i++) {
			target[data[i]["gop"]+"|"+data[i]["workcenter"]] = data[i];
		}
	},
	setListValue:function(target, data){ 		
		var prevGop = "";	 
		for(var i=0; i<data.length; i++) {	  										
			var gop = data[i].gop+"|"+data[i].workcenter;			  			 	
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
		popup.create({title:"S/T 조회",width:700,height:650,type:"content",href:"/front/master/routing/leadTimeView.html"});
	},
	make:function(data){
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
//			if($(obj).val() != prevGop) { 
//				prevGop = $(obj).val();
//			}else {
//				$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",true);					
//			}		
			if($(obj).closest(".tui-grid-row").attr("change_no") == base.change_no){
				if($(obj).val() != prevGop) { 
					prevGop = $(obj).val();
				}else {
					$("tr select[name=workcenter]").eq(index).attr("disabled",true);					
					$("tr td[data-column-name=lt_manage]").eq(index).find("button").attr("disabled",true);					
				}
			}			
		}); 

		if(base.change_no){
			$("#general_note").closest(".inputArea").width(800);
			var changeNoArea = $("<span/>").appendTo($("#general_note").closest(".createLine")).addClass("inputArea");
			changeNoArea.html("<label class='inputTitle changeNo'>호기정보</label><div class='inputWrap'><div class='changeNoWrap'><div class='line'><span>TV</span>"+data.changeNo[0].tv+"<button class='btn' onclick=\"base.changeNoPop('"+data.data[0].material+"','"+data.data[0].plant+"')\">호기변경</button></div><div class='line'><span>Effectivity</span>"+data.changeNo[0].eff_from+" ~ "+data.changeNo[0].eff_to+"</div></div></div>");
			$("<div/>").appendTo($(".divisionTitle[target=form1]")).addClass("allEffArea").html('<span class="title">모든 호기 보기</span><div class="inputWrap"><label class="switchWrap"><input type="checkbox" id="allEff" name="allEff" class="switchInput" title="모든 호기 보기" value="X"><span class="switchLabel" dataon="ON" dataoff="OFF"></span><span class="switchHandle"></span></label></div>');
			if(base.allEff){
				$("#allEff").prop("checked",true);
			}
			$("#allEff").change(function(){
				if($(this).prop("checked") == true){
					base.allEff = true;
				}else{
					base.allEff = false;
				}
				base.load();
			});
			setTimeout(function(){
				for(var i=0;i<$(".tui-grid-cell[data-column-name=tvEff]").length;i++){
					var effTd = $(".tui-grid-cell[data-column-name=tvEff]").eq(i);
					effTd.find(".tui-grid-cell-content").html("<input type='hidden' name='change_no' value='"+effTd.attr("change_no")+"'><strong>"+effTd.attr("tv")+"</strong><span>"+effTd.attr("eff_from")+" ~ "+effTd.attr("eff_to")+"</span>");
					if(effTd.attr("change_no") == base.change_no){
						effTd.addClass("changeNoActive");
					}else{
						effTd.closest(".tui-grid-row").find("input,select").prop("disabled",true);
						effTd.closest(".tui-grid-row").find("button.standard_text_btn").html("조회");
						effTd.closest(".tui-grid-row").find("button.lt_manage_btn").html("S/T 조회");
						effTd.closest(".tui-grid-row").find("td[data-column-name=manage] .btn").addClass("disabled").removeAttr("onclick").click(function(e){
							e.stopPropagation();
							e.preventDefault();
							$.alert("다른 호기의 Item은 삭제하실 수 없습니다.");
							return false;
						});
					}
				}
			},300);
		}
	}              
}
$(document).ready(base.init);