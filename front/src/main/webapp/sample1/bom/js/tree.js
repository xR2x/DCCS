var base = {
	tvEff:false,
	init:function(){
		base.set();
	},
	set:function(){
		createForm.set({
			width:1100
			,title:"BOM 구조"
			,divisionType:null
			,createButtonView:false
			,service:"/master/bom/create"
			,defaultValue:{
				status:"C"
				,active_flag:"X"
			},
			data:[{
				data:
				[[
					{
						title:"전개방식"
						,id:"viewType"
						,type:"customize"
						,width:160
						,html:"<div class='switchTab'><label><input type='radio' class='switch_radio' name='treeType' value='explosion' checked><span>정전개</span></label><label><input type='radio' class='switch_radio' name='treeType' value='implosion'><span>역전개</span></label></div>"
					},{
						title:"Material"
						,id:"material"
						,type:"input"
						,width:250
						,dataType:"all"
					},{
						title:"Plant"
						,id:"plant"
						,type:"select"
						,width:100
						,data:common.getPlant
						,dataType:"all"
					},{
						title:"TV"
						,id:"tv"
						,type:"select"
						,width:150
						,data:common.getTypeVersion
						,dataType:"all"
					},{
						title:"Eff."
						,id:"eff"
						,type:"input"
						,width:120
						,dataType:"int"
					},{
						title:"필요수량"
						,id:"qty"
						,type:"input"
						,width:120
						,value:1
						,dataType:"int"
					},{
						title:"&nbsp;"
						,id:"searchBtn"
						,type:"customize"
						,width:110
						,html:"<button class='btn middle color blue' style='height:34px;width:110px' onclick='base.load()'>BOM 조회하기</button>"
					}
				]]
			},{
				name:"BOM 구조"
				,list:true
				,id:"bomTree"
				,bodyHeight:document.documentElement.offsetHeight-400
				,target:"form1"
				,columns:[
					{header:'Item',name:'item', width:60,resizable: false}
					,{header:'Level',name:'bom_level', width:60,resizable: false}
					,{header:'Component',name:'component',resizable: false}
					,{header:'TV',name:'tv',width:120,resizable: false}
					,{header:'Eff',name:'eff',width:100,resizable: false}
					,{header:'Quantity',name:'qpa',width:80,resizable: false}
					,{header:'Category',name:'category_name', width:120,resizable: false}
				]
			}
		]});

		$('input[type=radio][name=treeType]').change(function(){
			if($(".switch_radio[name=treeType]:checked").val()=="explosion") {
				$(".divisionTitle[target=form1] button").css("display", "inline-block");
			}else {
				$(".divisionTitle[target=form1] button").css("display", "none");
			}			
		});

		$("#form0 .inputArea").keypress(function(e){
			if(e.which == 13){
				base.load();
			}
		});

		$("<div/>").appendTo($("#form1")).addClass("beforeLoad").html("<div>조회할 BOM의 Material/Plant를 입력해주세요.</div>");
		var summary = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("Summarized BOM");
		summary.click(function(){
			base.summary();
		});
	},
	summary:function(){

		if($("#material").val().replace(/ /g,"") == ""){
			$.alert("조회할 Material을 입력해주세요");
			$("#material").focus();
			return;
		}
		if($("#plant").val().replace(/ /g,"") == ""){
			$.alert("조회할 Plant를 입력해주세요");
			$("#plant").focus();
			return;
		}
		if($("#qty").val().replace(/ /g,"") == ""){
			$.alert("조회할 Plant를 입력해주세요");
			$("#qty").focus();
			return;
		}
		if($("#tv").val() && $("#eff").val().replace(/ /g,"") == ""){
			$.alert("호기를 입력해주세요.");
			$("#eff").focus();
			return;
		} 
		if(!$("#tv").val() && $("#eff").val().replace(/ /g,"") != ""){
			$.alert("Type Version을 입력해주세요.");
			$("#tv").focus();
			return;
		}
		var param = {
			material:$("#material").val()
			,plant:$("#plant").val()
			,treeType:$(".switch_radio[name=treeType]:checked").val()
		};
		if($("#tv").val()){
			param.tv = $("#tv").val();
			param.eff = $("#eff").val();
		}
		base.grid["bomTree"].dispatch('setLoadingState','LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/bom/readBomTreeSummary",
			data:param,
			success:function(json, status, res){
				try{

					if($(".switch_radio[name=treeType]:checked").val() == "explosion") {
						if(json.data.length == 0){
							$.alert("존재하지 않는 BOM입니다.");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');
							$(".tui-grid-rside-area .tui-grid-body-area").html("<div class='treeArea'></div>");
							$("<div/>").appendTo($("#form1")).addClass("beforeLoad").html("<div>조회할 BOM의 Material/Plant를 입력해주세요.</div>");
						}else{
							$(".beforeLoad").remove();
							$(".tui-grid-rside-area .tui-grid-body-area").html("<div class='treeArea' ></div>");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');
							base.makeLine({item:"-",bom_level:0,component:$("#material").val(),qpa:1,category:"-",child_count:json.data.length,target:"0"});
							var lastLevel = 0;
							var lastTarget = $(".treeArea");
							var array = new Array();
							for(var i=0;i<json.data.length;i++){
								var data = json.data[i];
								base.makeLine(data);
							}
						}
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
	load:function(){

		if($("#material").val().replace(/ /g,"") == ""){
			$.alert("조회할 Material을 입력해주세요");
			$("#material").focus();
			return;
		}
		if($("#plant").val().replace(/ /g,"") == ""){
			$.alert("조회할 Plant를 입력해주세요");
			$("#plant").focus();
			return;
		}
		if($("#qty").val().replace(/ /g,"") == ""){
			$.alert("조회할 Plant를 입력해주세요");
			$("#qty").focus();
			return;
		}
		if($("#tv").val() && $("#eff").val().replace(/ /g,"") == ""){
			$.alert("호기를 입력해주세요.");
			$("#eff").focus();
			return;
		}

		if(!$("#tv").val() && $("#eff").val().replace(/ /g,"") != ""){
			$.alert("Type Version을 입력해주세요.");
			$("#tv").focus();
			return;
		}
		var param = {
			material:$("#material").val()
			,plant:$("#plant").val()
			,treeType:$(".switch_radio[name=treeType]:checked").val()
		};
		if($("#tv").val()){
			param.tv = $("#tv").val();
			param.eff = $("#eff").val();
		}

		base.grid["bomTree"].dispatch('setLoadingState','LOADING');
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/bom/readBomTree",
			data:param,
			success:function(json, status, res){
				try{

					if($(".switch_radio[name=treeType]:checked").val() == "explosion") {

						if(json.data.length == 0){
							$.alert("존재하지 않는 BOM입니다.");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');
							$(".tui-grid-rside-area .tui-grid-body-area").html("<div class='treeArea'></div>");
							$("<div/>").appendTo($("#form1")).addClass("beforeLoad").html("<div>조회할 BOM의 Material/Plant를 입력해주세요.</div>");
						}else{
							$(".beforeLoad").remove();
							$(".tui-grid-rside-area .tui-grid-body-area").html("<div class='treeArea' ></div>");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');
							base.makeLine({item:"-",bom_level:0,component:$("#material").val(),qpa:1,category:"-",child_count:json.data.length,target:"0"});
							var lastLevel = 0;
							var lastTarget = $(".treeArea");
							for(var i=0;i<json.data.length;i++){
								var data = json.data[i];
								base.makeLine(data);
							}
		 
							for(var i=0;i<$(".treeArea .childArea").length;i++){
								var area = $(".treeArea .childArea").eq(i);
								var child = area.find(".line[parent="+area.attr("parent")+"]");
								for(var j=0;j<child.length;j++){
									if(j == child.length-1){
										child.eq(j).addClass("lastChild");
									}
								}
							}
							$(".treeArea  .childArea .line").each(function(i){
								var border = $(this).find(".border");
								border.each(function(j){
									if(i > 0){
										var position = $(".treeArea  .childArea .line").eq(i-1).find(".border").eq(j).css("background-position");
										if(position == "-25px 0px" || position == "-75px 0px"){
											$(this).css("background-position","-75px 0px");
										}
									}
								});
							});
						}
					}else {

						if(json.header.length == 0) {
							$.alert("존재하지 않는 BOM입니다.");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');
							$(".tui-grid-rside-area .tui-grid-body-area").html("<div class='treeArea'></div>");
							$("<div/>").appendTo($("#form1")).addClass("beforeLoad").html("<div>조회할 BOM의 Material/Plant를 입력해주세요.</div>");
						}else {
							$(".beforeLoad").remove();
							$(".tui-grid-rside-area .tui-grid-body-area").html("");
							base.grid["bomTree"].dispatch('setLoadingState','DONE');							
							for(var i=0;i<json.header.length;i++) {											   
								var header = json.header[i];			

								var list = eval("json.data"+header.seq);

								$(".tui-grid-rside-area .tui-grid-body-area").append("<div class='treeArea' id='"+header.seq+"'></div>");		
								base.makeLine({item:"-",bom_level:0,component:header.material,qpa:1,category:"-",child_count:list.length,seq:header.seq});
								for(var j=0;j<list.length;j++){
									var data = list[j];
									base.makeLine(data);
								}

								for(var j=0;j<$("#"+header.seq).find(".childArea").length;j++){
									var area = $("#"+header.seq).find(".childArea").eq(j);
									var child = area.find(".line[parent="+area.attr("parent")+"]");
									for(var k=0;k<child.length;k++){
										if(k == child.length-1){
											child.eq(k).addClass("lastChild");
										}
									}
								}			

								$("#"+header.seq).find(".childArea .line").each(function(j){
									var border = $(this).find(".border");
									border.each(function(k){
										if(j > 0){
											var position = $("#"+header.seq).find(".childArea .line").eq(j-1).find(".border").eq(k).css("background-position");
											if(position == "-25px 0px" || position == "-75px 0px"){
												$(this).css("background-position","-75px 0px");
											}
										}
									});
								});			
							}
						}		  
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
	makeLine:function(data){
		var target = ($(".childArea[parent="+data.parent_material+"]").length > 0)?$(".childArea[parent="+data.parent_material+"]").eq(-1):$(".treeArea").eq(-1);
		var line = $("<div/>").appendTo(target).addClass("line level"+data.bom_level).attr({"parent":data.parent_material,"child":data.child_count,"component":data.component,"level":data.bom_level});
		if($(".switch_radio[name=treeType]:checked").val() == "implosion") {
			if($("#material").val() == data.component) {
				line.addClass("implosion");
			}
		}								   
		var item = $("<span/>").appendTo(line).addClass("item").width($("th[data-column-name=item]").width()+12).html(data.item);
		var level = $("<span/>").appendTo(line).addClass("level").width($("th[data-column-name=bom_level]").width()+12).html(data.bom_level);
		var component = $("<span/>").appendTo(line).addClass("component").width($("th[data-column-name=component]").width()+12);
		for(var i=0;i<data.bom_level+1;i++){
			var depth = $("<u/>").appendTo(component).addClass("depth");
			if(i == data.bom_level){
				var icon = $("<icon/>").appendTo(depth);
				if(data.child_count == 0){
					icon.addClass("noChild");
				}else{
					icon.click(function(){
						base.childSpread(this);
					});
				}
			}else if(i == data.bom_level-1){
				depth.addClass("border near");
			}else{
				depth.addClass("border");
			}
		}
		$("<label/>").appendTo(component).html(data.component);
		var tv = $("<span/>").appendTo(line).addClass("tv").width($("th[data-column-name=tv]").width()+12).html(data.tv);
		var eff = $("<span/>").appendTo(line).addClass("eff").width($("th[data-column-name=eff]").width()+12).html(data.eff);
		var qpa = $("<span/>").appendTo(line).addClass("qpa").width($("th[data-column-name=qpa]").width()+12).html(data.qpa*parseInt($("#qty").val()));
		var category = $("<span/>").appendTo(line).addClass("category").width($("th[data-column-name=category_name]").width()+12).html(data.category_name);
		if(data.child_count > 0){
			$("<div/>").appendTo(target).addClass("childArea level"+data.bom_level).attr("parent",data.component);
		}
	},
	childSpread:function(obj){
		$(obj).closest(".line").disableSelection();
		var component = $(obj).closest(".line").attr("component");
		if($(".childArea[parent="+component+"]").css("display") == "block"){
			$(obj).addClass("open");
			$(".childArea[parent="+component+"]").slideUp({duration:300,easing:"easeInOutQuart"});
		}else{
			$(obj).removeClass("open");
			$(".childArea[parent="+component+"]").slideDown({duration:300,easing:"easeInOutQuart"});
		}
		setTimeout(function(){
			$(obj).closest(".line").enableSelection();
		},300);
	}
}
$(document).ready(base.init);