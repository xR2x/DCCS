var base = {
	init:function(){								 		
		$("#material").val(urlParam.get("material"));
		$("#plant").val(urlParam.get("plant"));
		$("#revision").val(urlParam.get("revision"));
	},
	reject:function(){

		if($("#remark").val().trim() == "") {
			parent.$.alert("반려사유를 입력해 주세요.");
			$("#remark").focus();
			return false;
		}	  
		var param = {
			material:$("#material").val()
			,plant:$("#plant").val()
			,revision:$("#revision").val()
			,seq:urlParam.get("seq")
			,request_no:urlParam.get("request_no")
			,remark:$("#remark").val()
			,status:urlParam.get("status")
		};
		$.loading.make({ment:"처리중입니다."});		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routingApproval/reject",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
					 	parent.$.alert(json.error);
					}else {
					 	parent.$.info("처리되었습니다.");
					}
				}catch(e){
					console.log(e);
				}finally{
					parent.base.load();
					parent.popup.close();
				}
			},
			error:function(e){
				console.log(e);
			} 
		});   		 
	}
}
$(document).ready(base.init);