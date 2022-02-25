var dialog = {
	cnt:0,
	make:function(option){
		var option = option?option:{};
		var backLayer = $("<div class='backLayer' id='backLayer"+this.cnt+"'/>").appendTo($("body"));
//		$("#uiDialogConfirm").remove();
//		var target = $("<div/>").appendTo($("body")).attr({"id":"uiDialogConfirm"});
//		var wrap = $("<div/>").appendTo($("body")).addClass("dialogBody");
//		wrap.animate({"opacity":".6","margin-top":["-30px","easeOutQuad"]},200).animate({"opacity":"1","margin-top":["0px","easeInQuad"]},100);
//		wrap.slideUp(200,'swing');
//		var title = $("<div/>").appendTo(wrap).addClass("dialogTitle");
//		wrap.draggable({handle:".dialogTitle"});
	}
}