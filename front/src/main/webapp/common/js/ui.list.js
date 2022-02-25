var list = {
	set:function(data,option){
		search.set(list.get(data,"search"));
		var option = (option)?option:{};
		var target = (option.target)?option.target:"#mainTitleArea";
		var excelDown = (option.excel && option.excel.api)?true:false;
		$(".searchButtonArea").remove();
		var group = $("<div/>").appendTo($(target)).addClass("searchButtonArea");
		if(excelDown){
//			group.addClass("btn-group");
			var excelButton = $("<button/>").appendTo(group).addClass("btn color green middle strong").html("<img src='/front/common/img/icon/table-excel.png'>엑셀다운로드");
			excelButton.click(function(){
				excel.download(list.get(data,"excel"),option.excel);
			});
		}
		var searchButton = $("<button/>").appendTo(group).addClass("btn middle strong searchOpen").html("<img src='/front/common/img/icon/document-search-result.png'>검색설정<span class='rightArrow'></span>");
		searchButton.click(function(){
			search.open();
		});

		if(option.button){
			for(var i=0;i<option.button.length;i++){
				if(option.button[i].position || option.button[i].position == 0){
					var poitionButton = group.find("button").eq(option.button[i].position);
					poitionButton.before($("<button/>"));
					poitionButton.prev().addClass("btn "+option.button[i].cssClass).html(option.button[i].name);
					if(option.button[i].handler){
						poitionButton.prev().on("click",{handler:option.button[i].handler},function(e){
							e.data.handler.call(this);
						});
					}
				}
			}
		}
		if(group.find("button").length > 1){
			group.addClass("btn-group");
		}

	},
	get:function(datas,type){
		var result = [];
		var k=0;
		for(var i=0;i<datas.length;i++){
			var data = datas[i];
			if(type == "grid"){
				if(data.grid){
					data.grid.name = (data.grid.name)?data.grid.name:data.id;
					data.grid.header = (data.grid.header)?data.grid.header:data.title;
					result[k] = data.grid;
					k++;
				}
			}else if(type == "search"){
				if(data.search){
					data.search.id = (data.search.id)?data.search.id:data.id;
					data.search.title = (data.search.title)?data.search.title:data.title;
					result[k] = data.search;
					k++;
				}
			}else if(type == "excel"){
				if(data.excel){
					data.excel.id = (data.excel.id)?data.excel.id:data.id;
					data.excel.title = (data.excel.title)?data.excel.title:data.title;
					result[k] = data.excel;
					k++;
				}
			}
		}

		return result;
	},
	dispatch:function(type){
		try{
			for(var param_key in base.grid){
				base.grid[param_key].dispatch('setLoadingState', type);
			}
		}catch(e){
			base.grid.dispatch('setLoadingState', type);
		}
	}
};