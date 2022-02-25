var base = {
	init:function(){
		$("#date").val(urlParam.get("date"));
		$("#date_from").val(urlParam.get("date"));
		$("#workType").html("<option value=''></option>");
		var data;
		for(var i=0;i<parent.base.workType.length;i++){
			data = parent.base.workType[i];
			$("#workType").append($("<option value='"+data.work_type+"' title='"+(data.remark?data.remark:"")+"' workTypeSeq='"+data.seq+"' total_time='"+data.total_time+"' remark='"+data.remark+"' time_from='"+data.time_from+"' time_to='"+data.time_to+"'>"+data.work_type+" - "+data.remark+"</option>"));
		}
		var data = parent.base.finalData[urlParam.get("date").replace(/\//g,"-")];

		if(!data.work_flag){
			$("#workCategory").val("N");
			base.categoryChange($("#workCategory"));
		}else{
			$("#workType").val(data.work_type);
			base.getBreakType();
		}
		$("#remark").val(data.remark);
		$("#workTypeFactor").val(data.work_type_factor);

		if(urlParam.get("type") == 'view') {
			$("#after_save").css("display","none");
			$("#remark").prop("disabled",true);
			$("#workType").prop("disabled",true);
			$("#workTypeFactor").prop("disabled",true);
			$("#workCategory").prop("disabled",true);
			$("#workCategory").prop("disabled",true);
			$("#save_button").css("display","none");
		}
		$("#date_from").datepicker({
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			numberOfMonths: 1,
			changeMonth: true,
			changeYear: true
		});
		$("#date_from").on("dblclick",function(){
			$(this).val("");
		});
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
	categoryChange:function(obj){
		if($(obj).val() == "N"){
			$(".workType.must").hide();
			$(".workTypeFactor.must").hide();
			$("#workType").prop("disabled",true).val("");
			$("#workTypeFactor").prop("disabled",true).val("");
			$("#breakType").html("");
			$("#workTypeTime").val("");
		}else{
			$(".workType.must").show();
			$(".workTypeFactor.must").show();
			$("#workType").prop("disabled",false);
			$("#workTypeFactor").prop("disabled",false).val("100");
		}
	},	
	getBreakType:function(obj){
		$("#breakType").html("");
		$("#workTypeTime").val($("#workType option:selected").attr("remark")+" "+$("#workType option:selected").attr("time_from").replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ":")+" ~ "+$("#workType option:selected").attr("time_to").replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ":") + " ("+parseFloat($("#workType option:selected").attr("total_time")).toFixed(2)+" h)");
		var workTypeSeq = $("#workType option:selected").attr("workTypeSeq");
		var data;
		for(var i=0;i<parent.base.breakType.length;i++){
			data = parent.base.breakType[i];
			if(data.work_type_seq == workTypeSeq){
				$("<div/>").appendTo($("#breakType")).addClass("list").html("<span class='title'>"+data.remark+"</span><span class='time'>"+data.time_from.replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ":")+" ~ "+data.time_to.replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ":")+"</span>");
			}
		}
	},
	save:function(){
		if($("#workCategory").val() != "N"){
			if(!$("#workType").val()){
				parent.$.alert("가동코드는 필수 입니다.");
				$("#workType").focus();
				return false;
			}
			if($("#workTypeFactor").val().replace(/ /g,"") == ""){
				parent.$.alert("Factor는 필수 입니다.");
				$("#workTypeFactor").focus();
				return false;
			}
		}

		if($("#multi_save_flag").prop("checked")) {
			if($("#date_from").val().replace(/ /g,"") == ""){
				parent.$.alert("반영기간(From)을 입력해주세요.");
				$("#date_from").focus();
				return false;
			}
			if($("#date_to").val().replace(/ /g,"") == ""){
				parent.$.alert("반영기간(To)을 입력해주세요.");
				$("#date_to").focus();
				return false;
			}
		}

		var param = {
			work_flag:$("#workCategory").val() == "W" || $("#workCategory").val() == "T"?"X":""
			,holiday_work_flag:$("#workCategory").val() == "T"?"X":""
			,work_type:$("#workType").val()
			,work_type_factor:$("#workTypeFactor").val()
			,remark:$("#remark").val()
			,date:$("#date").val()
			,multi_save_flag:$("#multi_save_flag").prop("checked")?"X":""
			,multi_save_holiday_flag:$("#multi_save_holiday_flag").prop("checked")?"X":""
			,date_from:$("#date_from").val()
			,date_to:$("#date_to").val()
		};
		if(parent.$("#workcenter").val() && parent.$("#equipment").val()){
			param["calendar_type"] = "workcenter";
			param["calendar_key"] =  parent.$("#workcenter").val();
			param["equipment_seq"] =  parent.$("#equipment option:selected").attr("equipment_seq");
		}
		$.loading.make({ment:"저장중입니다."});
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/factoryCalendar/update",
			data:param,
			success:function(json, status, res){
				try{
					parent.$.info("정상적으로 수정하였습니다.");
					parent.base.load();
					parent.popup.close();
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}
		});

	}
}
$(document).ready(base.init);