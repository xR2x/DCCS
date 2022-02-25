var base = {
	init:function(){
		base.load();
	},
	load:function(){
		var param = {
			seq:hash.get("seq")
		};
		$.ajax({ 
			type:"POST",
			dataType:"json",
			url:"/master/standardText/read",
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
		createForm.set({
			width:1000
			,title:"Standard Text 수정"
			,createBtnName:"수정하기"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")
			}
			,service:"/master/standardText/update"
			,formData:formData
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
						title:"Standard Text Code"
						,id:"code"
						,type:"input"
						,width:150
						,maxLength:20
						,must:true
						,disable:true
					},{
						title:"Standard Text Title"
						,id:"title"
						,type:"input"
						,width:400
						,maxLength:400
						,must:true
					},{
						title:"검사코드"
						,id:"inspection_code"
						,type:"select"
						,width:100
						,data:common.getCommonCode
						,dataParam:{"type":"inspection_code","viewType":"value"}
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
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
						,width:100
						,dataType:"all"
						,maxLength:10
						,disable:true
						,upper:true
						,notKor:true   
					}
				],[
					{
						title:"Standard Text"
						,id:"standard_text"
						,type:"textarea"
						,width:970
						,height:600
						,must:true
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