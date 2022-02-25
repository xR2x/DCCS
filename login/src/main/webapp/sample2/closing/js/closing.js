var base = {
	init:function(){	
		base.set();	
		base.load();
	},
	set:function() {
		$("#date_to").datepicker({
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			numberOfMonths: 1,
			changeMonth: true,
			changeYear: true
		});
		$("#date_to").on("dblclick",function(){
			$(this).val("");
		});
		$("img.calendarIcon").click(function(){
			$("#"+$(this).attr("target")).focus();
		});    
	},
	load:function(){
		var param = {};
		$.loading.make({ment:"데이터를 불러오는 중입니다."});
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/closing/getClosingStartDate",
			data:param,
			success:function(json, status, res){
				try{
					if(json.error) {
						parent.$.alert(json.error);
					}else {								   
						$("#date_from").val(json.startDate);
						$("#date_to").val(json.startDate);
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

	},      
	closing:function(){
		
		if($("#date_from").val().replace(/ /g,"") == ""){
			parent.$.alert("생산마감일(From)은 필수 입니다.");
			$("#date_from").focus();
			return false;
		}

		if($("#date_to").val().replace(/ /g,"") == ""){
			parent.$.alert("생산마감일(To)은 필수 입니다.");
			$("#date_to").focus();
			return false;
		}                

		var now = new Date(common.getToday(4));
		var start = new Date($("#date_from").val());
		var end = new Date($("#date_to").val());


		if(start > end) {
			parent.$.alert("생산마감일(To)은 생산마감일(From)보다 작을수 없습니다.");
			return false;
		}

		if(start >= now) {
			parent.$.alert("생산마감일(From)은 오늘날짜보다 <br>크거나 같을수 없습니다.");
			return false;
		}

		if(end >= now) {
			parent.$.alert("생산마감일(To)은 오늘날짜보다 <br>크거나 같을수 없습니다.");
			return false;
		}

		var param = {
			date_from:$("#date_from").val()
			,date_to:$("#date_to").val()
			,remark:$("#remark").val()
		};
		
		$.loading.make({ment:"마감중입니다."});
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/pop/closing/closingStart",
			data:param,
			success:function(json, status, res){
				try{

					if(json.error) {
						parent.$.alert(json.error);
					}else {								   
						parent.$.info("처리되었습니다.");
					}
					parent.popup.close();
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