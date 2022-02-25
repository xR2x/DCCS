var search = {
	clipboard:null,
	search:function(){
		var param = [];
		param["service"] = hash.get("service");
		param["searchAction"] = "X";
		param = $(".searchBody").serialize(param,{type:"hashmap"});
		var multi = {};
		var k=0;
		for(var key in search.paste.datas) {
			multi[key] = search.paste.datas[key];
			delete param[key];
			k++;
		}
		if(k > 0){
			param["multiSearch"] = JSON.stringify(multi);
		}
		if(hash.set(param) == false){
		}
		search.close();
	},
	open:function(){
		$("#searchArea").show("slide", { direction: "right"}, 100,function(){
			$("body").addClass("search");
			$("#searchArea input").eq(0).focus();
			$("body.search").keypress(function(e){
				if(e.which == 13){
					if($(e.target).attr("paste") == "true"){
						search.paste.add($(e.target));
					}else{
						search.search();
					}
				}
			});
		});
	},
	close:function(){
		$("#searchArea").hide("slide", { direction: "right" }, 100,function(){
			$("body").removeClass("search");
		});
	},
	set:function(data,option){
		$("#searchArea").remove();
		search.paste.datas = [];
		var option = (option)?option:{};
		var target = (option.target)?option.target:"#mainTitleArea";
		var excel = (option.excel == false)?false:true;
		var area = $("<div/>").appendTo($("#mainContentArea")).addClass("searchArea").attr({"id":"searchArea"});
		var head = $("<div/>").appendTo(area).addClass("searchHeader").html("검색설정<span class='close-btn'></span>");
		var btnArea = $("<div/>").appendTo(area).addClass("searchBtn").html("<div class='btn-group'></div>");
		var body = $("<div/>").appendTo(area).addClass("searchBody scrollbar-inner");

		var clear = $("<button/>").appendTo(btnArea.children()).addClass("btn large clear").html("초기화");
		var searchBtn = $("<button/>").appendTo(btnArea.children()).addClass("btn large search").html("검색하기");
		head.click(function(){
			search.close();
		});
		$(document).click(function(e){
			if($(e.target).closest(".wrap_"+$(".pasteWrap").attr("pasteId")).length == 0){
				search.paste.close();
			}
			if($(e.target).attr("paste") == "true"){
				search.paste.focus($(e.target));
			}
			return;
			if($(e.target).parents("#searchArea").length == 0 && e.target.className.indexOf("searchOpen") < 0){			
				$("#searchArea").hide("slide", { direction: "right" }, 100);
			}
		});
		clear.click(function(){
			$(".searchBody input,.searchBody select").each(function(){
				$(this).val("");
			});
		});
		searchBtn.click(function(){
			search.search();
		});
		$('.scrollbar-inner').scrollbar();
		for(var i=0;i<data.length;i++){
			var line = $("<div/>").appendTo(body).addClass("searchLine");
			var title = $("<span/>").appendTo(line).html(data[i].title).addClass("title");
			var inputArea = $("<span/>").appendTo(line).addClass("input");
			$("<span/>").appendTo(inputArea).addClass("remove");
			var area = $("<span/>").appendTo(inputArea).css({"position":"relative","display":"inline-block","vertical-align":"middle"}).addClass("wrap_"+data[i].id);
			if(hash.get("searchAction") == "X"){
				if(data[i].switch == true){
					data[i].checked = null;
				}else{
					data[i].value = null;
				}
			}
			if(hash.get(data[i].id)){
				data[i].value = hash.get(data[i].id);
			}
			var input = null;
			switch(data[i].type){
				case "input" :
					if(data[i].checkbox == true || data[i].radio == true || data[i].switch == true){						
						inputArea.addClass("checkbox");
						if(data[i].switch == true){
							if(hash.get(data[i].id)){
								data[i].checked = true;
							}
						}
					}
					input = form.make.input(area,data[i]);
					if(data[i].paste == true){
						input.on("paste",function(e){
							e.stopPropagation();
							e.preventDefault();
							var pastedData = e.originalEvent.clipboardData.getData('text');
							search.paste.make(pastedData,this);
							$(this).val("");
						});
					}
				break;
				case "textarea" :
					input = form.make.textarea(area,data[i]);
				break;
				case "select" :
					input = form.make.select(area,data[i]);
				break;
				case "date" :
					input = form.make.date(area,data[i]);
				break;
				case "customize" :
					form.make.customize(area,data[i]);
				break;
				default:
					console.log("[Error] "+data[i].id+" Input Type이 없습니다.");
				break;
			}
			if(data[i].data){
				data[i].data.call(this,input,data[i].dataParam);
			}
			if(data[i].width){
				if(data[i].type == "date"){
					input.css("width",(data[i].width-31));
				}else{
					if(data[i].paste == true){
						input.css("width",data[i].width-30).attr("paste",true);
						var btn = $("<button/>").appendTo(input.parent().parent()).addClass("btn multiBtn").attr("title","추가하기").css("left",data[i].width-30).html("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyRUU1QkM1NjZEMzMxMUVDOEFENThDODdBN0Q2Qjk5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyRUU1QkM1NzZEMzMxMUVDOEFENThDODdBN0Q2Qjk5NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJFRTVCQzU0NkQzMzExRUM4QUQ1OEM4N0E3RDZCOTk1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjJFRTVCQzU1NkQzMzExRUM4QUQ1OEM4N0E3RDZCOTk1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fTXxYgAAAIFJREFUeNpi/P//PwMy6O3trQdSDVBuQ3FxcSOyPAtQAQM+gC7PxEAioL0GFiBOBGI5JDEHHGwQeATScACI9wOxPBYDHZA0PQRiR5CT7oMYUAFc4CFUzX2YH/BpgitG9/R9qPUPkMQeQMXu4wqlB1DTHqCxUUKJAYcmBnTFIAAQYAC0EyKRFObH4gAAAABJRU5ErkJggg=='>");
						btn.on("click",{input:input},function(e){
							search.paste.add(e.data.input);
						});
						input.on("focus",function(){
							search.paste.focus(this);
						});
					}else{
						input.css("width",data[i].width);
					}
				}
			}
		}
		$(".searchButtonArea").remove();
		var group = $("<div/>").appendTo($(target)).addClass("searchButtonArea");
		if(excel){
			group.addClass("btn-group");
			var excelButton = $("<button/>").appendTo(group).addClass("btn color green middle strong").html("<img src='/front/common/img/icon/table-excel.png'>엑셀다운로드");
			excelButton.click(function(){
				$.info("업데이트 예정입니다.");
			});
		}
		var searchButton = $("<button/>").appendTo(group).addClass("btn middle strong searchOpen").html("<img src='/front/common/img/icon/document-search-result.png'>검색설정<span class='rightArrow'></span>");
		searchButton.click(function(){
			search.open();
		});
		if(hash.get("multiSearch").length > 0){
			var multiSearch = JSON.parse(hash.get("multiSearch"));
			for(var key in multiSearch){
				search.paste.datas[key] = multiSearch[key];
				search.paste.target = $("#"+key);
				search.paste.close();
			}
		}
	},
	paste:{
		data:new Array(),
		datas:[],
		target:null,
		focus:function(obj){
			var data = search.paste.datas[$(obj).attr("id")];			
			search.paste.target = obj;
			if(data && data.length > 0){
				search.paste.area(obj);
				$(obj).val("");
			}
		},
		add:function(obj){
			if(!search.paste.datas[$(obj).attr("id")]){
				search.paste.datas[$(obj).attr("id")] = new Array();
			}
			var data = search.paste.datas[$(obj).attr("id")];
			search.paste.target = obj;
			if($(obj).val().indexOf("+)") > -1){
				$(obj).val("");
			}
			if($(obj).val().replace(/ /g,"") == ""){
				$(obj).val("").focus();
				return;
			}
			for(var i=0;i<data.length;i++){
				if(data[i] == $(obj).val()){
					$(obj).val("").focus();
					return;
				}
			}
			if($(".pasteWrap").length == 0){
				search.paste.area(obj);
			}
			var line = $("<div/>").appendTo($(".pasteArea.scroll-content")).html("<span class='del' onclick=\"search.paste.del(this)\"></span>"+$(obj).val()).addClass("pasteLine").attr("value",$(obj).val());
			data.push($(obj).val());
			$(obj).val("").focus();
		},
		area:function(obj){
			if($(".pasteWrap").length > 0){
				return;
			}
			var data = search.paste.datas[$(obj).attr("id")];
			var pasteWrap = $("<div/>").appendTo($(obj).parent()).addClass("pasteWrap").attr("pasteId",$(obj).attr("id"));
			var pasteArea = $("<div/>").appendTo(pasteWrap).addClass("pasteArea scrollbar-inner");
			for(var i=0;i<data.length;i++){
				var line = $("<div/>").appendTo(pasteArea).html("<span class='del' onclick=\"search.paste.del(this)\"></span>"+data[i]).addClass("pasteLine").attr("value",data[i]);
			}
			var pasteArea = $("<div/>").appendTo(pasteWrap).addClass("pasteAction").html("<span onclick='search.paste.del()'>모두삭제</span> | <span onclick='search.paste.close()'>닫기</span>");
			$('.pasteArea.scrollbar-inner').scrollbar();
		},
		make:function(str,obj){
			if(!search.paste.datas[$(obj).attr("id")]){
				search.paste.datas[$(obj).attr("id")] = new Array();
			}
			var data = search.paste.datas[$(obj).attr("id")];
			search.paste.target = obj;
			var lineData = str.split("\r\n");
			$.each(lineData,function(i,value){
				if(data.indexOf(value) == -1 ) {
					if(value){
						data.push(value);
					}
				}
			});

			if(data.length == 1){
				setTimeout(function(){
					$(obj).val(lineData[0]);
				},10);
			}else if(data.length > 1){
				if($(".pasteWrap").length == 0){
					search.paste.area(obj);
				}
			}
		},
		del:function(obj){
			var data = search.paste.datas[$(search.paste.target).attr("id")];
			if(obj){
				for(var i=0;i<data.length;i++){
					if(data[i] == $(obj).parent().attr("value")){
						$(obj).parent().remove();
						data.splice(i,1);
					}
				}
			}else{
				$(".pasteLine").remove();
				delete search.paste.datas[$(search.paste.target).attr("id")];
				search.paste.close();
			}
		},
		close:function(){
			var data = search.paste.datas[$(search.paste.target).attr("id")];
			if(data){
				if(data.length == 1){
					$(search.paste.target).val(data[0]);
				}else if(data.length > 1){
					$(search.paste.target).val(data[0]+" ("+(data.length-1)+"+)");
				}
			}
			$(".pasteWrap").remove();
		}
	}
}