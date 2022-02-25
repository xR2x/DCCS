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
			,title:"Standard Text 조회"
			,makeType:"view"
			,divisionType:null
			,defaultValue:{
				seq:hash.get("seq")				
			}
			,service:"/master/standardText/update"
			,formData:formData
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
						title:"Standard Text Code"
						,id:"code"
						,type:"input"
						,width:150
						,must:true
					},{
						title:"Standard Text Title"
						,id:"title"
						,type:"input"
						,width:490
						,must:true
					},{
						title:"검사코드"
						,id:"inspection_code"
						,type:"select"
						,width:100
						,data:common.getCommonCode
						,dataParam:{"type":"inspection_code","viewType":"name"}
					},{
						title:"Revision"
						,id:"revision"
						,type:"input"
						,width:100
						,value:"-"
						,must:true
					},{
						title:"변경이력"
						,id:"history"
						,type:"customize"
						,html:"<button class='btn large changeHistory' onclick='base.revision()'>이력보기</button>"
						,width:80
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
	revision:function(){
		popup.create({title:"변경 이력",width:950,height:750,type:"content",href:"/front/master/standardText/revision.html"});
	}
}
$(document).ready(base.init);