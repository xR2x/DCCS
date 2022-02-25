var createForm = {
	data:null,
	formData:null,
	attachData:null,
	option:null,
	listColumns:null,
	_this:this,
	set:function(option){
		option = (option)?option:{};
		this.data = option.data;
		this.formData = option.formData;
		this.attachData = option.attachData;
		if(option.formData){
			$.loading.make({target:$("#mainContent")});
		}
		this.option = option;
		var windowHeight = document.documentElement.offsetHeight;
		var target = (option.target)?option.target:"#createWrap";
		var main = $("<div/>").appendTo($(target)).addClass("createForm").height(windowHeight-150);
		if(option.width){
			main.css("width",option.width);
		}
		var titleArea = $("<div/>").appendTo(main).addClass("createTitle");
		var title = $("<h1/>").appendTo(titleArea).html(option.title);
		if(option.makeType != "view" && option.createButtonView != false){
			var btnArea = $("<div/>").appendTo(titleArea).addClass("btn-group");
			var clear = $("<button/>").appendTo(btnArea).addClass("btn xlarge clear").html("초기화");
			var createBtnName = (option.createBtnName)?option.createBtnName:"생성하기";
			var create = $("<button/>").appendTo(btnArea).addClass("btn xlarge color blue create").html(createBtnName).attr({id:"createButton"});
			clear.click(function(){
				createForm.formReset();
			});
			create.click(function(){
				createForm.submit();
			});
		}
		var formArea = $("<div/>").appendTo(main).addClass("formArea scrollbar-inner");
		$('.scrollbar-inner').scrollbar();
		if(option.divisionType == "tab"){
			createForm.makeTab();
			$(".formArea").addClass("tab");
		}else{
			createForm.makeNormal();
		}
		if(option.formData){
			setTimeout(function(){
				$.loading.del();
			},100);
		}

	},
	formReset:function(){
		$(".createForm").remove();
		createForm.set(createForm.option);
		try{
			base.make();
		}catch(e){
		}
	},
	makeBase:function(datas,target){
		if(datas.list == true){
			createForm.list.create(datas);
		}
		if(!datas.data) return;
		for(var i=0;i<datas.data.length;i++){
			var line = $("<div/>").appendTo(target).addClass("createLine");
			for(var j=0;j<datas.data[i].length;j++){
				var data = datas.data[i][j];
				if(createForm.option.makeType == "view"){
					data.makeType = "view";
					data.readonly = true;
				}
				var inputArea = $("<span/>").appendTo(line).addClass("inputArea").width(data.width).height(data.height);
				var must = (data.must == true && createForm.option.makeType != "view")?"<span class='must'>*</span>":"";
				var title = $("<label/>").appendTo(inputArea).addClass("inputTitle "+data.id).html(must+""+data.title);
				if(data.titleAlign){
					title.css("text-align",data.titleAlign);
				}
				var inputWrap = $("<div/>").appendTo(inputArea).addClass("inputWrap");
				var input = null;
				switch(data.type){
					case "input" :
						if(data.checkbox == true || data.radio == true || data.switch == true){
							inputArea.addClass("checkbox");
						}
						input = form.make.input(inputWrap,data);
						if(input != null && this.formData != null){
							if(createForm.getValue(data)){
								input.val(createForm.getValue(data));
							}
						}
					break;
					case "textarea" :
						input = form.make.textarea(inputWrap,data);
						if(input != null && this.formData != null){
							if(createForm.getValue(data)){
								input.val(createForm.getValue(data));
							}
						}
					break;
					case "select" :
						if(this.formData != null){
							var dataParam = (data.dataParam)?data.dataParam:{};
							dataParam["value"] = createForm.getValue(data);
							data.dataParam = dataParam;
						}
						input = form.make.select(inputWrap,data);
					break;
					case "date" :
						input = form.make.date(inputWrap,data);
						if(input != null && this.formData != null){
							if(createForm.getValue(data)){
								input.val(createForm.getValue(data));
							}
						}
					break;
					case "customize" :
						form.make.customize(inputWrap,data);
					break;
					case "attach" :
						form.make.attach(inputWrap,data);
						if(this.attachData){
							file.view(data,this.attachData);
						}
					break;
				}
				if(input != null){
					if(data.readonly == true){
						input.prop("readonly",true).addClass("readonly");
					}
					if(data.border == false){
						input.addClass("noBorder");
					}
				}
			}

		}
	},
	getValue:function(datas){
		for(var i=0;i<this.formData.length;i++){
			var formData = this.formData[i];
			if(formData[datas.id]){
				return formData[datas.id];
			}
		}
	},
	reset:function(){
		if(createForm.option){
			var target = (createForm.option.target)?createForm.option.target:"#createWrap";
			$(target).find(".createForm").remove();
		}
	},
	list:{
		create:function(datas){
			try{
				if($(".tabArea button.tab").length > 0){
					$("#"+datas.target).show().css("margin-top","-1000px");
				}
				$("#"+datas.target).attr("listId",datas.id).addClass("listForm");
				if(!base.grid){
					base.grid = [];
				}
				base.grid[datas.id] = new tui.Grid({
					el: document.getElementById(datas.target),
					bodyHeight: datas.bodyHeight,
					afterLoad:true,
					headerSelect:false,
					rowHeight:45,
					scrollX: true,
					scrollY: true,
					columns:[],
					columnOptions: {
						frozenCount: datas.frozenCount,
						frozenBorderWidth: 1,
						resizable: true
					}
				});
				if(!base.listColumns){
					base.listColumns = [];
				}
				base.listColumns[datas.id] = datas.columns;
				base.grid[datas.id].setColumns(datas.columns);
				setTimeout(function(){
					for(var i=0;i<datas.columns.length;i++){
						if(datas.columns[i].must == true){
							var column = $(".tui-grid-cell-header[data-column-name="+datas.columns[i].name+"]").eq(0);
							column.html("<strong class='must'>*</strong>"+column.html());
						}
					}
					if(datas.listData){
						for(var i=0;i<datas.listData.length;i++){
							createForm.list.addRow(datas.listData[i],datas.target,datas);
						}
//						base.grid.resetData(datas.listData);
					}
					if($(".tabArea button.tab").length > 0){
						$("#"+datas.target).hide().css("margin-top","0px");
					}
					if(datas.buttonArea){
						var buttonArea = null;
						if(datas.buttonArea.position == "top"){
							buttonArea = $("<div/>").prependTo($("#"+datas.target)).addClass("listButtonArea");
						}else if(datas.buttonArea.position == "bottom"){
							buttonArea = $("<div/>").appendTo($("#"+datas.target)).addClass("listButtonArea bottom");
						}
						if(datas.buttonArea.height){
							buttonArea.height(datas.buttonArea.height);
						}
					}

				},100);

			}catch(e){
				setTimeout(createForm.list.create,100,datas);
			}
		},
		remove:function(obj){
			var table = $(obj).closest(".listForm");
			var target = table.attr("id");
			var id = table.attr("listid");
			var index = $(obj).parents(".tui-grid-row").index();
			for(var i=0;i<$("#"+target+" .tui-grid-body-area .tui-grid-table").length;i++){
				$("#"+target+" .tui-grid-body-area .tui-grid-table").eq(i).find("tr").eq(index).remove();
			}
			if($("#"+target+" .tui-grid-rside-area .tui-grid-row").length == 0){
				base.grid[id].dispatch('setLoadingState', 'EMPTY');
			}

		},
		getAllData:function(){
			var listData = {};
			for(var i=0;i<$(".listForm").length;i++){
				var listId = $(".listForm").eq(i).attr("listId");
				var tableObj = $(".listForm").eq(i); 
				listData[listId] = [];
				for(var j=0;j<tableObj.find(".tui-grid-rside-area tr.tui-grid-row").length;j++){
					var rside = tableObj.find(".tui-grid-rside-area tr.tui-grid-row").eq(j);
					var lside = tableObj.find(".tui-grid-lside-area tr.tui-grid-row").eq(j);
					listData[listId].push(rside.serialize(lside.serialize({},{type:"hashmap"}),{type:"hashmap"}));
				}
			}
			return listData;
		},
		getCount:function(){
			return $(".listForm tr.tui-grid-row").length/2;
		},
		reset:function(target){
			$("#"+target+" .tui-grid-body-area .tui-grid-table tr").remove();
		},
		addRow:function(values,target,mainOption){
			var mainOption = mainOption?mainOption:[];
			try{
				var id = $("#"+target).attr("listid");
				base.grid[id].dispatch('setLoadingState', 'DONE');
				var trArray = new Array();
				for(var i=0;i<$("#"+target+" .tui-grid-body-area .tui-grid-table").length;i++){
					var table = $("#"+target+" .tui-grid-body-area .tui-grid-table").eq(i);
					var tr = $("<tr/>").appendTo(table).addClass("tui-grid-row");
					trArray.push(tr);
					tr.mouseenter(function(){
						for(var i=0;i<$("#"+target+" .tui-grid-body-area .tui-grid-table").length;i++){
							$("#"+target+" .tui-grid-body-area .tui-grid-table").eq(i).find("tr").eq($(this).index()).addClass("hover");
						}
					}).mouseleave(function(){
						for(var i=0;i<$("#"+target+" .tui-grid-body-area .tui-grid-table").length;i++){
							$("#"+target+" .tui-grid-body-area .tui-grid-table").eq(i).find("tr").eq($(this).index()).removeClass("hover");
						}
					});
					if(mainOption.attr){
						if(mainOption.attr.target == "tr"){
							for(var j=0;j<mainOption.attr.attr.length;j++){
								tr.attr(mainOption.attr.attr[j],createForm.list.getValue(mainOption.attr.attr[j],values));
							}
						}
					}
					for(var j=0;j<table.find("col").length;j++){
						var col = table.find("col").eq(j);
						var key = col.attr("data-column-name");
						var td = $("<td/>").appendTo(tr).addClass("tui-grid-cell tui-grid-cell-has-input").attr({"data-column-name":key});
						var option = createForm.list.getOptions(key,id);
						option.title = option.header;
						option.value = createForm.list.getValue(key,values);
						if(option.attr){
							for(var a=0;a<option.attr.length;a++){
								td.attr(option.attr[a],createForm.list.getValue(option.attr[a],values));
							}
						}
						if(createForm.option) {
							if(createForm.option.makeType == "view"){
								option.readonly = true;
								option.makeType = createForm.option.makeType;
							}
						}
						if(key == "_checked"){
							var wrap = $("<div/>").appendTo(td).addClass("tui-grid-row-header-checkbox");
							wrap.html("<input type='checkbox' name='_checked'>");
						}else{
							var wrap = $("<div/>").appendTo(td).addClass("tui-grid-cell-content");
						}

						if(option.type == "input"){
							var input = form.make.input(wrap,option);
							input.addClass("grid-input").css("text-align",option.textAlign);
							var value = null;
							if(option.autoIncrement){
								var identity = createForm.list.autoIncrement(option);
								value = identity;
								input.attr("identity",identity);
							}
							if(option.zeroFill){
								value = (option.value)?option.value:value;
								value = createForm.list.zeroFill(option.zeroFill,value);
							}
							if(value){
								input.val(value);
							}
							if(option.attribute) {
								if(option.attributeParam) {
									createForm.list.setAttributeAll(option.attributeParam,values,input);
								}				 
							}
						}else if(option.type == "text"){
							var input = form.make.text(wrap,option);
						}else if(option.type == "select"){
							var input = form.make.select(wrap,option);
						}else if(option.type == "customize"){
							form.make.customize(wrap,option);
							var input = wrap.find("input");
							if(input.attr("name")) {
								input.val(createForm.list.getValue(key,values));
								if(option.attribute) {
									if(option.attributeParam) {
										createForm.list.setAttributeAll(option.attributeParam,values,input);
									}				 
								}
							}
						}else if(option.type == "textarea"){
							var input = form.make.textarea(wrap,option);
						}
						if(option.focus == true){
							input.focus();
						}
						if(input != null){
							if(option.readonly == true){
								input.prop("readonly",true).addClass("readonly");
							}
							if(option.border == false){
								input.addClass("noBorder");
							}
							if(option.align){
								input.css("text-align",option.align);
							}
						}
						if(mainOption.effect != false){
							$.lineEffect({target:td});
						}
					}
				}
				if(mainOption.autoScroll != false){
					$("#"+target+" .tui-grid-body-area").scrollTop(30000);
				}
				return trArray;
			}catch(e){
				log(e);
			}
		},
		setAttributeAll:function(attrParam,values,input) {
			if(values) {
				for(var key in attrParam) {
					input.attr(key,values[attrParam[key]]);	   
				}
			}
		},
		getOptions:function(key,id){
			var result = [];
			for(var i=0;i<base.listColumns[id].length;i++){
				if(base.listColumns[id][i].name == key){
					result = base.listColumns[id][i];
					break;
				}
			}
			return result;
		},
		getValue:function(key,values){
			for(var param_key in values){
				if(param_key == key){
					return values[param_key];
				}
			}
		},
		autoIncrement:function(option){
			var target = $(".grid-input[name="+option.name+"]");
			var identity = (target.eq(target.length-2).attr("identity"))?target.eq(target.length-2).attr("identity"):0;
			identity = parseInt(identity,10)+option.autoIncrement;
			return identity;			
		},
		zeroFill:function(point,value){
			value = (value)?value:0;
			var width = (value+"").length;
			return width >= point ? value:new Array(point-width+1).join('0')+value;
		},
		checkAll:function(){
		}
	},
	submit:function(){
		var fileCount = 0;
		var form = new FormData();
		if($(".listForm").length > 0){
			form.append("listData",JSON.stringify(createForm.list.getAllData()));
		}

		if(!createForm.mustCheck()){
			return;
		}
		var param = $(".createForm").serialize();
		for(var i=0;i<param.length;i++){
			form.append(Object.keys(param[i]),Object.values(param[i]));
		}
		for(var i=0;i<file.fileArray.length;i++){
			for(var j=0;j<file.fileArray[i].length;j++){
				form.append("file"+fileCount,file.fileArray[i][j].file);
				form.append("path"+fileCount,file.fileArray[i][j].option.path);
				form.append("targetName"+fileCount,file.fileArray[i][j].option.targetName);
				fileCount++;
			}
		}
		if(file.delFileArray.length > 0){
			form.append("delFiles",JSON.stringify(file.delFileArray));
		}
		form.append('fileCount',fileCount);
		var defaultValue = createForm.option.defaultValue;
		if(defaultValue){
			for(var i=0;i<Object.keys(defaultValue).length;i++){
				form.append(Object.keys(defaultValue)[i],Object.values(defaultValue)[i]);
			}
		}
		if(createForm.option.beforeHandler){
			if(!createForm.option.beforeHandler.call(this,form)){
				return false;
			}
		}

		$.loading.make({progress:(fileCount > 0)?true:false,ment:"데이터를 저장하는 중입니다."});
		$.ajax({ 
			xhr: function(){
				var xhrobj = $.ajaxSettings.xhr();
				if(xhrobj.upload){
					if(form.get("fileCount") > 0){
						xhrobj.upload.addEventListener('progress', function(event) {
							var percent = 0;
							var position = event.loaded || event.position;
							var total = event.total;
							if(event.lengthComputable){
								percent = Math.ceil(position / total * 100);
								$("#mainLoadingArea .progressInner").animate({"background-size":percent+"%"},100,function(){
									$(this).html(percent+"%");
								});
							}
						}, false);
					}
				}
				return xhrobj;
			},
			type:"POST",
			dataType:"json",
			processData:false,
			contentType:false,
			cache: false,
			url:createForm.option.service,
			data:form,
			success:function(json, status, res){
				try{
					if(json.error){
						$.alert(json.error);
					}else{
						if(createForm.option.afterMessageDisplay != false){
							$.info("정상적으로 저장되었습니다.");
						}
						if(createForm.option.afterHandler){
							createForm.option.afterHandler.call(this,json);
						}
					}
					$.loading.del();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	mustCheck:function(){
		var isValid = true;
		$(".createForm").find("input,textarea,select").each(function(i){
			if($(this).attr("must") == "true"){
				var value = ($(this).val())?$(this).val():"";
				if(value.replace(/ /g,"") == ""){
					$.alert("<strong>["+$(this).attr("title")+"]</strong> 필수 입력값입니다.");
					$(this).focus();
					isValid = false;
					return false;
				}
			}
		});
		return isValid;
	},
	tabChange:function(obj){
		$(".tabForm").removeClass("on");
		$(".tabArea .tab").removeClass("on");
		$(obj).addClass("on");
		$("#"+$(obj).attr("target")).addClass("on");
	},
	makeTab:function(){
		var tabArea = $("<div/>").insertAfter($(".createTitle")).addClass("tabArea");
		for(var i=0;i<createForm.data.length;i++){
			var data = createForm.data[i];
			var tab = $("<button/>").appendTo(tabArea).addClass("tab").html(data.name).attr({"target":"form"+i});
			tab.click(function(){
				createForm.tabChange(this);
			});
			var area = $("<div/>").appendTo($(".formArea").eq(1)).addClass("mainForm tabForm").attr({"id":"form"+i});
			createForm.makeBase(data,area);
			if(i == 0){
				tab.addClass("on");
				area.addClass("on");
			}
		}
		setTimeout(function(){
			createForm.tabChange($(".tabArea button[target=form0]"));
		},100);
	},
	makeNormal:function(){
		for(var i=0;i<createForm.data.length;i++){
			var data = createForm.data[i];
			if(data.name){
				var title = $("<h1/>").appendTo($(".formArea").eq(1)).html(data.name).addClass("divisionTitle").attr({"target":"form"+i});
			}
			var area = $("<div/>").appendTo($(".formArea").eq(1)).addClass("mainForm").attr({"id":"form"+i});
			createForm.makeBase(data,area);
		}
	}
}

$(window).resize(function(){
	var windowHeight = document.documentElement.offsetHeight;
	$(".createForm").height(windowHeight-150);
});