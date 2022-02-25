var base = {
	init:function(){																																							
		var parentObj = $(parent.base.targetTr).find("input[name=standard_text_title]");
		$("#standard_title").val(parentObj.val());
		$("#standard_text_code").val(parentObj.attr("standard_text_code"));
		$("#standard_revision").val(parentObj.attr("standard_text_revision"));
		$("#standard_text").val(parentObj.attr("standard_text"));  						
	}
}
$(document).ready(base.init);