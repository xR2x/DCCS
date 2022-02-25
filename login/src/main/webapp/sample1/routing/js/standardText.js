var base = {
	init:function(){		
		$.loading.make({ment:"데이터를 불러오는 중입니다."});		
		var parentObj = $(parent.base.targetTr).find("input[name=standard_text_title]");
		base.getStandardText(parentObj.attr("standard_text_code"));
		$("#standard_title").val(parentObj.val());
		$("#standard_revision").val(parentObj.attr("standard_text_revision"));
		$("#standard_text").val(parentObj.attr("standard_text"));  
		if(parentObj.attr("standard_text_code")) {
			$("#standard_title").attr("disabled", true);
			$("#standard_text").attr("disabled", true);
		}
		$.loading.del();
	},
	getStandardText:function(value){
		var param = {
			sort:"code"
			,sortType:"asc"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/read",
			data:param,
			success:function(json, status, res){
				try{
					$("#standard_text_code").html("<option value='' seq=''>직접입력</option>");
					for(var i=0;i<json.data.length;i++){
						var data = json.data[i];
						$("#standard_text_code").append($("<option value='"+data.code+"' seq='"+data.seq+"' standard_title='"+data.title+"' standard_text='"+data.standard_text+"' standard_revision='"+data.revision+"' inspection_code='"+data.inspection_code+"' title='"+data.code+"'>"+data.code+" ("+data.revision+")"+((data.active_flag)?" - Active":"")+"</option>"));
					}		
					if(value){
						setTimeout(function(){
							$("#standard_text_code").val(value);
						},10);
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
	standardTextChange:function(obj) {
		if($(obj).val()=="") {	  
			$("#standard_revision").val("");
			$("#standard_title").val("");
			$("#standard_text").val("");				
			$("#standard_text").attr("disabled", false);
			$("#standard_title").attr("disabled", false);
		}else {							
			var selectObj = $("#standard_text_code option:selected");
			$("#standard_title").val(selectObj.attr("standard_title"));
			$("#standard_revision").val(selectObj.attr("standard_revision"));
			$("#standard_text").val(selectObj.attr("standard_text"));
			$("#standard_title").attr("disabled", true);
			$("#standard_text").attr("disabled", true);
		}
	},
	save:function(){									   		
		if($("#standard_text").val().trim().length > 0) {
			if($("#standard_title").val().trim() == "") {
				$.alert("Standard Text를 입력할시 Standard Text Title은 필수로 입력하셔야 합니다.");
				return false;
			}
		}        		
		var seq = $("#standard_text_code option:selected").attr("seq");
		$(parent.base.targetTr).find("input[name=standard_text_title]").val($("#standard_title").val());						   
		$(parent.base.targetTr).find("input[name=standard_text_title]").attr("standard_seq", seq);								   
		$(parent.base.targetTr).find("input[name=standard_text_title]").attr("standard_text_code", $("#standard_text_code").val());
		$(parent.base.targetTr).find("input[name=standard_text_title]").attr("standard_text_revision", $("#standard_revision").val());
		$(parent.base.targetTr).find("input[name=standard_text_title]").attr("standard_text", $("#standard_text").val());
		if($("#standard_text_code option:selected").attr("inspection_code")) {
			$(parent.base.targetTr).find("select[name=inspection_code]").val($("#standard_text_code option:selected").attr("inspection_code"));
		}
		parent.popup.close();
	}
}
$(document).ready(base.init);