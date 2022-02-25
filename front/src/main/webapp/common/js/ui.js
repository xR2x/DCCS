$.alert = function(str,option){
	var option = (option)?option:{};
	var hideAfter = (option.time)?option.time:2000;
	var stack = (option.stack)?option.stack:1;
	var showHideTransition = (option.transition)?option.transition:"fade";
	var position = (option.position)?option.position:"bottom-right";
	$.toast({
		heading: "ERROR",
		text: str,
		showHideTransition: showHideTransition,
		hideAfter:hideAfter,
		stack: stack,
		position: position,
		icon: "error"
	});
	if(option.focus){
		$.lineEffect({target:option.focus});
	}
	if(option.handler){
		option.handler.call(this);
	}
}

$.info = function(str,option){
	// transition : fade,plain,slide
	var option = (option)?option:{};
	var hideAfter = (option.time)?option.time:2000;
	var stack = (option.stack)?option.stack:1;
	var showHideTransition = (option.transition)?option.transition:"fade";
	var position = (option.position)?option.position:"bottom-right";
	$.toast({
		heading: "Information",
		text: str,
		showHideTransition: showHideTransition,
		hideAfter:hideAfter,
		stack: stack,
		position: position,
		icon: "info"
	});
}

$.lineEffect = function(option){
	$(option.target).effect("highlight",{color:(option.color?option.color:"#AAAAAA")},(option.speed?option.speed:100),function(){
		try{
			if(option.handler){
				option.handler.call(this);
			}else{
				$(this).focus();
			}				
		}catch(e){
		}
	});
}

$.loading = {
	make:function(option){
		option = (option)?option:{};
		var target = option.target?option.target:$("body");
		var ment = (option.ment)?option.ment:"데이터를 불러오는 중입니다.";
		var str = "<div class='loadingIcon'></div><div class='loadingMent'>"+ment+"</div>";
		if(option.progress == true){
			str = "<div class='progressBar'><div class='progressInner'></div></div><div class='loadingMent'><strong>파일을 업로드 중입니다</strong>.<br>용량이 클 경우 다소 시간이 걸릴 수 있습니다.</div>";
		}
		var area = $("<div/>").appendTo(target).addClass("mainLoadingArea").attr({"id":"mainLoadingArea"}).html(str);

	},
	del:function(){
		$("#mainLoadingArea").remove();
	}
}

$.dialog = {
	make:function(option){
		var option = option?option:{};
		$("#uiDialogConfirm").remove();
		var target = $("<div/>").appendTo($("body")).attr({"id":"uiDialogConfirm"});
		var wrap = $("<div/>").appendTo($("body")).addClass("dialogBody");
		wrap.animate({"opacity":".6","margin-top":["-30px","easeOutQuad"]},300).animate({"opacity":"1","margin-top":["0px","easeInQuad"]},200);
		var titleArea = $("<div/>").appendTo(wrap).addClass("dialogTitle").html(option.title);
		wrap.draggable({handle:".dialogTitle"});

		return;
		var option = option?option:{};
		if($("#uiDialogConfirm").length == 0){
			target = $("<div/>").appendTo($("body")).attr({"id":"uiDialogConfirm"});
		}
		target.attr("title",option.title);
		$("#uiDialogConfirm").dialog({
			resizable: false,
			height: "auto",
			width: 400,
			modal: true,
			buttons: {
				"계속 생성": function() {
					$( this ).dialog( "close" );
				},
				"조회": function() {
					$( this ).dialog( "close" );
				},
				"리스트": function() {
					$( this ).dialog( "close" );
				}
			}
		});

	}
}