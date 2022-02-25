var base = {
	change_no:null,
	allEff:true,
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
			,bom:true
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
			url:"/master/bom/read",
			data:param,
			success:function(json, status, res){
				try{
					if(json.data.length == 0){
						$.alert("존재하지 않는 BOM입니다.");
					}else{
						if(json.data[0].tv_eff_flag){
							if(json.data[0].tv_eff_flag == "X" && !base.change_no){
								base.changeNoPop(json.data[0].material,json.data[0].plant);
								return;
							}
						}
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
		var listData = data.bom;
		var autoIncrement = (data.data[0].tv_eff_flag == "X")?0:10;
		var listColumns = [
				{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
				,{header:'Item',name:'item', width:80,resizable: false,type:"input",must:true,maxLength:4,autoIncrement:autoIncrement,dataType:"int",textAlign:"center"}
				,{header:'Category',name:'category', width:130,resizable: false, type:"select",must:true,data:common.getCommonCode,dataParam:{"type":"bom_category","viewType":"name"},focus:true}
				,{header:'Component',name:'component',resizable: false,type:"input",must:true}
				,{header:'Quantity',name:'qpa',resizable: false,width:100,type:"input",must:true,maxLength:15,dataType:"decimal",point:3}
				,{header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='createForm.list.remove(this)'>삭제</button>"}
		];
		var trAttr = {};
		if(data.data[0].tv_eff_flag == "X"){
			listColumns[5] = {header:'호기정보',name:'tvEff',resizable: false,width:100,type:"view",attr:["tv","eff_from","eff_to","change_no"]};
			listColumns[6] = {header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='createForm.list.remove(this)'>삭제</button>"};
			trAttr = {target:"tr",attr:["tv","eff_from","eff_to","change_no"]};
		}
		createForm.set({
			width:1100
			,title:"BOM 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
			}
			,service:"/master/bom/update"
			,formData:formData
			,beforeHandler:function(form){
				if(base.change_no){
					form.append("header_change_no",base.change_no);
				}
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.add({"seq":json.seq});
				},500);
			},
			data:[{
				name:"BOM 기본정보"
				,data:
				[[
					{
						title:"Material"
						,id:"material"
						,type:"input"
						,width:390
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Plant"
						,id:"plant"
						,type:"select"
						,width:140
						,data:common.getPlant
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:220
						,data:common.getProject
						,dataType:"all"
						,must:true
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
						,dataType:"all"
						,must:true
						,disable:true
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
						,maxLength:5
						,upper:true
						,notKor:true   
					}
				],[
					{
						title:"Head Text"
						,id:"description"
						,type:"textarea"
						,width:1070
						,height:100
						,dataType:"all"
					}
				]]
			},{
				name:"하위자재 정보"
				,list:true
				,id:"bom"
				,listData:listData
				,attr:trAttr
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:listColumns
			}
		]});
		base.make(data);
	},
	revisionChange:function(){
		if($("#changeRevision").prop("checked") == true){
			$("#newRevision").prop("disabled",false);
		}else{
			$("#newRevision").prop("disabled",true);
		}
	},
	make:function(data){
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("하위자재추가");
		add.click(function(){
			var tr = createForm.list.addRow(null,"form1");
			if(base.change_no){
				var effTd = tr[1].find(".tui-grid-cell[data-column-name=tvEff]");
				effTd.addClass("changeNoActive").attr({tv:data.changeNo[0].tv,eff_from:data.changeNo[0].eff_from,eff_to:data.changeNo[0].eff_to,change_no:data.changeNo[0].change_no});
				effTd.html("<div class='tui-grid-cell-content'><input type='hidden' name='change_no' value='"+effTd.attr("change_no")+"'><strong>"+effTd.attr("tv")+"</strong><span>"+effTd.attr("eff_from")+" ~ "+effTd.attr("eff_to")+"</span></div>");
				tr[1].attr({"tv":data.changeNo[0].tv,"eff_from":data.changeNo[0].eff_from,"eff_to":data.changeNo[0].eff_to,"change_no":data.changeNo[0].change_no});
				base.autoIncrement(tr[1],base.change_no);
			}
		});
		if(base.change_no){
			$(".inputArea .description").parent().width(800);
			var changeNoArea = $("<span/>").appendTo($(".inputArea .description").closest(".createLine")).addClass("inputArea");
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
	},
	autoIncrement:function(tr,change_no){
		var target = $(".tui-grid-row[change_no="+change_no+"] input[name=item]");
		var lastItem = 0;
		for(var i=0;i<target.length;i++){
			if(target.eq(i).val()){
				lastItem = parseInt(target.eq(i).val(),10);
			}
		}
		tr.find("input[name=item]").val(lastItem+10);
	}

}
$(document).ready(base.init);