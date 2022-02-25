var base = {
	nowYear:new Date().getFullYear(),
	holidays:null,
	datas:null,
	workType:null,
	breakType:null,
	workdayCount:0,
	holidayCount:0,
	finalData:null,
	init:function(){
		$(".yearArea .year").html(base.nowYear+"년");
		base.load();
		common.getWorkCenter($("#workcenter"),{ccr_flag:"X",sort:"workcenter",sortType:"ASC"});
		$("#workcenter").change(function(){
			if($("#workcenter").val()){
				$.ajax({ 
					type:"POST",
					dataType:"json",
					url:"/master/workcenter/read",
					data:{
						equipment:"X",
						seq:$("#workcenter option:selected").attr("seq")
					},
					success:function(json, status, res){
						try{
							$("#equipment").show().html("");
							for(var i=0;i<json.equipment.length;i++){
								var data = json.equipment[i];
								$("#equipment").append("<option value='"+data.seq+"' equipment_seq='"+data.equipment_seq+"' spindle='"+data.spindle+"'>"+(data.equipment_name?data.equipment_name:"")+"</option>");
							}
							base.load();
							$("#equipment").change(function(){
								base.load();
							});
						}catch(e){
							console.log(e);
						}
					},
					error:function(e){
						console.log(e);
					}
				});
			}else{
				$("#equipment").hide().html("");
				base.load();
			}
		});
	},
	set:function(type){
		$("#factoryCalendar").datepicker({
			inline:true
			,showOtherMonths: true
			,yearSuffix:""
			,minDate1:0
			,defaultDate:base.nowYear+"/01/01"
			,numberOfMonths:[3,4]
			,onSelect:function(date,obj){
				var today = new Date();
				var selectDay = new Date(date);
				if($.datepicker.formatDate("yy-mm-dd",selectDay)  < $.datepicker.formatDate("yy-mm-dd",today)) {
					popup.create({title:date+" 조회",width:400,height:490,type:"content",href:"/front/master/calendar/remark.html?date="+date+"&type=view"});
				} else {
					popup.create({title:date+" 수정",width:400,height:690,type:"content",href:"/front/master/calendar/remark.html?date="+date});
				}
				
			}
			,beforeShowDay:function(day){
				var today = new Date();

				var day_holiday = "day-holiday";
				var day_workday = "day-workday";

				if($.datepicker.formatDate("yy-mm-dd",day) < $.datepicker.formatDate("yy-mm-dd",today)) {
					day_holiday = "day-holiday disabled";
					day_workday = "day-workday disabled";
				}

				var result;
				for(var i=0;i<base.holidays.length;i++){
					var holiday = base.holidays[i].date;
					if(holiday == $.datepicker.formatDate("yy-mm-dd",day)){
						result = [true,day_holiday,base.holidays[i].remark];
						base.finalData[$.datepicker.formatDate("yy-mm-dd",day)] = {date:$.datepicker.formatDate("yy-mm-dd",day),remark:base.holidays[i].remark};
					}
				}

				if(base.datas.length > 0){
					if(!result){
						result = [true,day_workday];
					}
				}else{
					if(!result){
						if(day.getFullYear() == base.nowYear){
							switch(day.getDay()){
								case 0:
									result = [true,day_holiday,"일요일"];
									base.finalData[$.datepicker.formatDate("yy-mm-dd",day)] = {date:$.datepicker.formatDate("yy-mm-dd",day),remark:"일요일"};
									break;
								case 6:
									result = [true,day_holiday,"토요일"];
									base.finalData[$.datepicker.formatDate("yy-mm-dd",day)] = {date:$.datepicker.formatDate("yy-mm-dd",day),remark:"토요일"};
									break;
								default:
									result = [true,day_workday];
									base.finalData[$.datepicker.formatDate("yy-mm-dd",day)] = {date:$.datepicker.formatDate("yy-mm-dd",day),work_flag:"X"};
									break;
							}
						}else{
							result = [true];
						}
					}
				}
				return result;
			}
		});
		$(".workDayInfo").html("근무일 : <strong>"+$(".day-workday[data-year="+base.nowYear+"]").length+"</strong>일 | 휴일 : <strong>"+$(".day-holiday[data-year="+base.nowYear+"]").length+"</strong>일");
		if(type == "save"){
			base.save();
		}
	},
	changeYear:function(number){
		var date = new Date(base.nowYear, 1, 1);
		date.setFullYear(date.getFullYear() + number);
		base.nowYear = date.getFullYear();
		$(".yearArea .year").html(base.nowYear+"년");
		base.load();
	},
	load:function(){
		var param = {
			year:base.nowYear
			,calendar_type:null
		};
		if($("#workcenter").val() && $("#equipment").val()){
			param["calendar_type"] = "workcenter";
			param["calendar_key"] = $("#workcenter").val();
			param["equipment_seq"] = $("#equipment option:selected").attr("equipment_seq");
		}
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/factoryCalendar/read",
			data:param,
			success:function(json, status, res){
				try{
					$("#factoryCalendar").datepicker("destroy");
					base.datas = json.data;
					base.workType = json.dataWorkType;
					base.breakType = json.dataBreakType;
					base.workdayCount = 0;
					base.holidayCount = 0;
					if(base.datas.length > 0){
						base.holidays = new Array();
						base.finalData = new Array();
						for(var i=0;i<base.datas.length;i++){
							base.finalData[base.datas[i].date] = base.datas[i];
							if(base.datas[i].work_flag != "X"){
								base.holidays.push(base.datas[i]);
							}
						}
						if($("#workcenter").val() && $("#equipment").val() && json.extend == 0){
							base.set("save");
						}else{
							base.set();
						}
					}else{
						base.holidays = json.dataSpecialRule;
						base.finalData = new Array();
						base.set("save");
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
	save:function(){
		var finalData = [];
		for(var param_key in base.finalData){
			finalData.push(base.finalData[param_key]);
		}
		var param = {
			year:base.nowYear
			,data:JSON.stringify(finalData)
		};
		if($("#workcenter").val() && $("#equipment").val()){
			param["calendar_type"] = "workcenter";
			param["calendar_key"] = $("#workcenter").val();
			param["equipment_seq"] = $("#equipment option:selected").attr("equipment_seq");
		}
		$.loading.make({ment:"생성중입니다."});
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/factoryCalendar/create",
			data:param,
			success:function(json, status, res){
				try{
					$.loading.del();
					$.info(""+base.nowYear+"년 Factory Calendar를 정상적으로 생성하였습니다.");
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