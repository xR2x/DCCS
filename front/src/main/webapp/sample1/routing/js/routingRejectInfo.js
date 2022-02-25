var base = {
	init:function(){	
		base.load();		
	},
	load:function(){	
		var param = {
			seq:urlParam.get("seq")
			,request_no:urlParam.get("request_no")
		};
		$.loading.make({ment:"데이터를 불러오는 중입니다."});		
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/routingApproval/rejectInfo",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
					 	parent.$.alert(json.error);
					}else {
						$("#material").val(json.data[0].material);
						$("#plant").val(json.data[0].plant);
						$("#revision").val(json.data[0].revision);
						$("#remark").val(json.data[0].remark);					 	
						$("#creator_name").val(json.data[0].creator_name);					 	
						$("#create_date").val(json.data[0].create_date);					 	
					}
				}catch(e){
					console.log(e);
				}finally {
					$.loading.del();
				}
			},
			error:function(e){
				console.log(e);
			} 
		});   		 
	}	
}
$(document).ready(base.init);