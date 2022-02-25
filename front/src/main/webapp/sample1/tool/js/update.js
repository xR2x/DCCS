var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
			,attach:true
			,attachTargetSeq:hash.get("seq")
			,attachTargetName:"/master/tool/attach"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/tool/read",
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
		var attachData = data.files;
		createForm.set({
			width:1000
			,title:"치공구/Tool 마스터 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,service:"/master/tool/update"
			,defaultValue:{
				seq:hash.get("seq")
				,attachDelete:"delete" // "delete = forever delete,update = deletion_flag = 'X'"
			}
			,formData:formData
			,attachData:attachData
			,beforeHandler:function(){
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					location.reload();
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"Tool no"
						,id:"tool_no"
						,type:"input"
						,width:300
						,dataType:"all"
						,maxLength:50
						,must:true
						,disable:true
					},
					{
						title:"S/N"
						,id:"tool_sn"
						,type:"input"
						,width:250
						,dataType:"all"
						,maxLength:50
						,must:true
						,disable:true
					},
					{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,dataType:"all"
						,maxLength:10
						,must:true
						,disable:true
						,upper:true
						,notKor:true  
					},
					{
						title:"Tool Code"
						,id:"tool_code"
						,type:"select"
						,width:290
						,dataType:"all"
						,data:common.getCommonCode
						,dataParam:{"type":"tool_code"}
						,must:true
					}
				],[
					{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:300
						,dataType:"all"
						,data:common.getProject
						,must:true
					},
					{
						title:"Class"
						,id:"tool_class"
						,type:"select"
						,width:180
						,dataType:"all"
						,data:common.getCommonCode
						,dataParam:{"type":"tool_class"}
					},
					{
						title:"검사주기"
						,id:"inspection_cycle"
						,type:"input"
						,width:140
						,dataType:"int"
					},
					{
						title:"주기기준"
						,id:"inspection_cycle_unit"
						,type:"select"
						,width:100
						,dataType:"all"
						,data:common.getCommonCode
						,dataParam:{"type":"inspection_cycle_unit"}
					},
					{
						title:"Location"
						,id:"location"
						,type:"input"
						,width:210
						,maxLength:400
						,dataType:"all"
					}
				],[				
					{
						title:"Spec"
						,id:"spec"
						,type:"input"
						,width:480
						,maxLength:500
						,dataType:"all"
						,must:true
					},
					{
						title:"Description"
						,id:"description"
						,type:"input"
						,width:480
						,maxLength:300
						,dataType:"all"
						,must:true
					}
				],[
					{
						title:"Remark"
						,id:"remark"
						,type:"input"
						,width:970
						,dataType:"all"
					}
				],[
					{
						title:"첨부파일"
						,id:"attach"
						,type:"attach"
						,width:970
						,height:180
						,multiple:true
						,immediate:false
						,row:4
						,path:"/master/tool/"
						,targetName:"/master/tool/attach"
						,accept:"*.*"
					}
				]]
			}
		]});
	}	
}
$(document).ready(base.init);