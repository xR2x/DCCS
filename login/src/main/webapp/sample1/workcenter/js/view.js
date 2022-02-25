var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
			,equipment:true
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/workcenter/read",
			data:param,
			success:function(json, status, res){
				try{
					base.set(json);
				}catch(e){
					console.log(e);
				}
			},
			error:function(e){
				console.log(e);
			}   

		});
	},
	set:function(data){
		var formData = data.data;
		var listData = data.equipment;
		createForm.set({
			width:1000
			,title:"작업장 조회"
			,makeType:"view"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
				,equipment_seq:0
			}
			,service:"/master/workcenter/update"
			,formData:formData
			,beforeHandler:function(){
				if($("#ccr_flag").prop("checked") == true && createForm.list.getCount() == 0){
					$.alert("CCR일 경우 장비는 반드시 1대 이상 등록되어야 합니다.");
					$.lineEffect({target:$(".tui-grid-layer-state"),color:"#a94442",speed:300});
					return false;
				}
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					location.reload();
//					hash.set({"service":"master/workcenter/list"});
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"Category"
						,id:"category"
						,type:"select"
						,width:200
						,data:common.getCommonCode
						,dataParam:{"type":"workcenter_category"}
					},{
						title:"작업장코드"
						,id:"workcenter"
						,type:"input"
						,width:200
						,must:true
					},{
						title:"작업장명"
						,id:"name"
						,type:"input"
						,width:550
						,must:true
					}
				],[
					{
						title:"L/T (일)"
						,id:"lead_time"
						,type:"input"
						,width:150
						,value:1
						,dataType:"decimal"
						,point:3
						,maxLength:4
					},{
						title:"CCR"
						,id:"ccr_flag"
						,type:"input"
						,titleAlign:"center"
						,switch:true
						,checked:(formData[0].ccr_flag == "X")?true:false
						,value:"X"
						,margin:"0 20px"
						,onChange:function(obj){
							form.make.must($("#worktime_factor"),$(this).prop("checked"));
							form.make.must($("#grouping_period"),$(this).prop("checked"));
						}
					},{
						title:"Worktime Factor(%)"
						,id:"worktime_factor"
						,type:"input"
						,width:150
						,value:"100"
						,dataType:"decimal"
						,point:3    
						,maxLength:4
					},{
						title:"APS Grouping 기간(일)"
						,id:"grouping_period"
						,type:"input"
						,width:150
						,dataType:"int"
						,maxLength:4
					}
				],[
					{
						title:"Remark"
						,id:"remark"
						,type:"textarea"
						,width:970
						,height:100
					}
				]]
			},{
				name:"소속장비 관리"
				,list:true
				,id:"equipment"
				,frozenCount:4
				,listData:listData
				,bodyHeight:document.documentElement.offsetHeight-650
				,target:"form1"
				,columns:[
					{header:'장비명',name:'equipment_name',resizable: false,type:"input",maxLength:50,focus:true,makeType:"view"}
					,{header:'Spindle 수',name:'spindle',resizable: false,width:90,type:"input",dataType:"int",maxLength:2,makeType:"view"}
				]
			}
		]});
	}
}
$(document).ready(base.init);