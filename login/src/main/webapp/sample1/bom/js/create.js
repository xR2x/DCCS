var base = {
	change_no:null,
	init:function(){
		base.set();
	},
	set:function(){
		createForm.set({
			width:1100
			,title:"BOM 신규생성"
			,divisionType:null
			,service:"/master/bom/create"
			,defaultValue:{
				status:"C"
				,active_flag:"X"
			}
			,beforeHandler:function(form){
				if(base.change_no){
					form.append("change_no",base.change_no);
				}
				return true;
			}
			,afterMessageDisplay:false
			,afterHandler:function(json){
				if(json.tvEff && json.tvEff == "X"){
					popup.create({title:"호기 선택",width:700,height:650,type:"content",href:"/front/master/changeNumber/select.html?material="+$("#material").val()+"&plant="+$("#plant").val()});
					return;
				}
				setTimeout(function(){					
					$.info("정상적으로 저장되었습니다.");
					hash.set({"service":"master/bom/list"});
				},500);
			},
			data:[{
				name:"BOM 기본정보"
				,data:
				[[
					{
						title:"Material"
						,id:"material"
						,type:"input"
						,width:450
						,dataType:"all"
						,must:true
					},{
						title:"Plant"
						,id:"plant"
						,type:"select"
						,width:170
						,data:common.getPlant
						,dataType:"all"
						,must:true
					},{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:320
						,data:common.getProject
						,dataType:"all"
						,must:true
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
						,dataType:"all"
						,must:true
						,disable:true
					}
				],[
					{
						title:"Head Text"
						,id:"description"
						,type:"textarea"
						,width:1070
						,height:100
						,dataType:"all"
					}
				]]
			},{
				name:"하위자재 정보"
				,list:true
				,id:"bom"
				,bodyHeight:document.documentElement.offsetHeight-560
				,target:"form1"
				,columns:[
					{header:'<input type=\'checkbox\' onclick=\'createForm.checkAll()\'>',name:'_checked', width:30,resizable: false}
					,{header:'Item',name:'item', width:80,resizable: false,type:"input",must:true,maxLength:4,dataType:"int",autoIncrement:10,zeroFill:0,textAlign:"center"}
					,{header:'Category',name:'category', width:130,resizable: false, type:"select",must:true,data:common.getCommonCode,dataParam:{"type":"bom_category","viewType":"name"},focus:true}
					,{header:'Component',name:'component',resizable: false,type:"input",must:true}
					,{header:'Quantity',name:'qpa',resizable: false,width:100,type:"input",must:true,maxLength:15,dataType:"decimal",point:3}
//					,{header:'Unit',name:'uom',resizable: false,width:70,must:true,type:"select",data:common.getUomCode}
					,{header:'삭제',name:'manage',resizable: false,width:70,type:"customize",html:"<button class='btn middle color red' onclick='createForm.list.remove(this)'>삭제</button>"}
				]
			}
		]});
		base.make();
	},
	changeNoSelect:function(change_no){
		base.change_no = change_no;
		createForm.submit();
	},
	make:function(){
		var add = $("<button/>").appendTo($(".divisionTitle[target=form1]")).addClass("btn middle addBtn").html("하위자재추가");
		add.click(function(){
			createForm.list.addRow(null,"form1");
		});
	}
}
$(document).ready(base.init);