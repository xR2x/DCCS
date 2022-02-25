var base = {
	init:function(){
		$("#order_number").val(parent.base.lastObj.attr("order_number"));
		$("#gop").val(parent.base.lastObj.attr("gop"));
		$("#remark").focus();
	},
	save:function(){
		if($("#remark").val().replace(/ /g,"") == ""){
			parent.$.alert("중지사유는 필수입니다.");
			$("#remark").focus();
			return false;
		}
		parent.base.makeWorkStop($("#remark").val());
		parent.popup.close();
	}
}
$(document).ready(base.init);