var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
			,attach:true
			,attachTargetSeq:hash.get("seq")
			,attachTargetName:"/master/document/attach,/master/document/photo"
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/document/read",
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
			,title:"문서 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,service:"/master/document/update"
			,defaultValue:{
				seq:hash.get("seq")
				,attachDelete:"delete" // "delete = forever delete,update = deletion_flag = 'X'"
			}
			,formData:formData
			,attachData:attachData
			,beforeHandler:function(){
				if($("#changeRevision").prop("checked") == true){
					if($("#revision").val().trim() == $("#newRevision").val().trim()) {
						$.alert("변경전 Revision과 다른정보를 입력해 주세요.");
						$("#newRevision").focus();
						return false;                                 
					}
				}
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					if(json.seq) {
						hash.add({"seq":json.seq});
					}else {
						location.reload();
					}
				},500);
			},
			data:[{
				name:"기본정보"
				,data:
				[[
					{
						title:"Document No"
						,id:"document_no"
						,type:"input"
						,width:300
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Type"
						,id:"document_type"
						,type:"select"
						,width:180
						,data:common.getCommonCode
						,dataParam:{"type":"document_type"}
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Sheet"
						,id:"sheet"
						,type:"input"
						,width:140
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,dataType:"all"
						,must:true
						,disable:true
					},{
						title:"Rev 변경"
						,id:"changeRevision"
						,type:"input"
						,width:70
						,dataType:"all"
						,titleAlign:"center"
						,switch:true
						,onChange:function(obj){
							base.revisionChange();
							form.make.must($("#newRevision"),$(this).prop("checked"));
						}
					},{
						title:"변경할 Revision"
						,id:"newRevision"
						,type:"input"
						,width:130
						,dataType:"all"
						,maxLength:10
						,disable:true
						,upper:true
						,notKor:true   
					}							
				],[
					{
						title:"Project"
						,id:"project_code"
						,type:"select"
						,width:580
						,data:common.getProject
						,dataType:"all"
						,must:true
					},{
						title:"Customer Revision"
						,id:"customer_revision"
						,type:"input"
						,width:200
						,maxLength:50
						,dataType:"all"
					},{
						title:"만료일"
						,id:"expiration_date"
						,type:"date"
						,dataType:"date"
						,format:"yy/mm/dd"
					}  
				],[
					{
						title:"Name"
						,id:"document_name"
						,type:"input"
						,width:970
						,maxLength:300
						,dataType:"all"
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
						,path:"/master/document/"
						,targetName:"/master/document/attach"
						,accept:"*.*"
					}
				]]
			}
		]});
	},
	revisionChange:function(){
		if($("#changeRevision").prop("checked") == true){
			$("#newRevision").prop("disabled",false);
		}else{
			$("#newRevision").prop("disabled",true);
			$("#newRevision").val("");						
		}
	}   
}
$(document).ready(base.init);