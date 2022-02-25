var base = {
	init:function(){

		$("input[num=true]").each(function(){			
			$(this).on("input",function(){
				$(this).val($(this).val().replace(/[^0-9]/g,''));
			});								 
		});		

		base.load();
	},
	load:function() {
		var param = {
			change_no:parent.base.change_no
		};		
		$.loading.make({ment:"데이터를 불러오는 중입니다."}); 			
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/changeNumber/read",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {				  
						var data = json.data[0];		
						$("#material").val(data.material);
						common.getPlant($("#plant"),{value:data.plant});
						common.getTypeVersion($("#tv"),{value:data.tv});
						$("#eff_from").val(data.eff_from);
						$("#eff_to").val(data.eff_to);
						$("#remark").val(data.remark);
						if(data.eff_to == 99999) {
							base.lastEffChange();
						}
					}
				}catch(e){
					console.log(e);
				}finally{
				  	$.loading.del();
				}
			},
			error:function(e){
				console.log(e);
			}   
		});
	},
	lastEffChange:function() {
		if($("#last_flag").attr("checked")) {
			$("#last_flag").removeAttr("checked");
			$("#eff_to").val("");
			$("#eff_to").attr("disabled", false);
		}else {
			$("#last_flag").attr("checked",true);
			$("#eff_to").val("99999");
			$("#eff_to").attr("disabled", true);
		}
	},
	modify:function(){	  		                            

		if($("#tv").val().trim() == "") {
			parent.$.alert("Type Version을 선택해 주세요.");
			$("#tv").focus();
			return false;											
		}			

		if($("#eff_from").val().trim() == "") {
			parent.$.alert("Eff(From)을 입력해 주세요.");
			$("#eff_from").focus();
			return false;											
		}	
		
		if($("#eff_to").val().trim() == "") {
			parent.$.alert("Eff(To)을 입력해 주세요.");
			$("#eff_to").focus();
			return false;											
		}

		var param = {
			change_no:parent.base.change_no 
			,material:$("#material").val().trim()
			,plant:$("#plant").val().trim()
			,tv:$("#tv").val().trim()
			,eff_from:$("#eff_from").val().trim()
			,eff_to:$("#eff_to").val().trim()
			,remark:$("#remark").val().trim()
		};	  
		$.loading.make({ment:"처리중입니다."}); 			
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/changeNumber/update",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {
						parent.$.info("수정되었습니다.");	
						parent.base.load();
						parent.popup.close();
					}
				}catch(e){
					console.log(e);
				}finally{
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