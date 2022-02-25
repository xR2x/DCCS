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
					if(json.data[0].tv_eff_flag){
						if(json.data[0].tv_eff_flag == "X" && !base.change_no){
							base.changeNoPop(json.data[0].material,json.data[0].plant);
							return;
						}
					}
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
		var listColumns = [
				{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
				,{header:'Item',name:'item', width:80,resizable: false,type:"input",maxLength:4,dataType:"int",textAlign:"center"}
				,{header:'Category',name:'category_name', width:130,resizable: false, type:"input",makeType:"view"}
				,{header:'Component',name:'component',resizable: false,type:"input"}
				,{header:'Quantity',name:'qpa',resizable: false,width:100,type:"input",maxLength:15,dataType:"decimal",point:3}
				,{header:'Unit',name:'uom',resizable: false,width:70,type:"input",makeType:"view"}
		];
		if(data.data[0].tv_eff_flag == "X"){
			listColumns[6] = {header:'호기정보',name:'tvEff',resizable: false,width:100,type:"view",attr:["tv","eff_from","eff_to","change_no"]};
		}
		createForm.set({
			width:1100
			,title:"BOM 조회"
			,makeType:"view"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
			}
			,service:"/master/bom/update"
			,formData:formData
			,beforeHandler:function(form){
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					location.reload();
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
						,width:350
						,dataType:"all"
					},{
						title:"Plant"
						,id:"plant"
						,type:"select"
						,width:170
						,data:common.getPlant
						,dataType:"all"
					},{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:320
						,data:common.getProject
						,dataType:"all"
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
						,dataType:"all"
						,disable:true
					},{
						title:"변경이력"
						,id:"history"
						,type:"customize"
						,html:"<button class='btn large changeHistory' onclick='base.revision()'>이력보기</button>"
						,width:80
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
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:listColumns
			}
		]});
		base.make(data);
	},
	revision:function(){
		popup.create({title:"변경 이력",width:950,height:750,type:"content",href:"/front/master/bom/revision.html"});
	},
	make:function(data){
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
					effTd.find(".tui-grid-cell-content").html("<strong>"+effTd.attr("tv")+"</strong><span>"+effTd.attr("eff_from")+" ~ "+effTd.attr("eff_to")+"</span>");
					if(effTd.attr("change_no") == base.change_no){
						effTd.addClass("changeNoActive");
					}
				}
			},300);
		}
	}
}
$(document).ready(base.init);