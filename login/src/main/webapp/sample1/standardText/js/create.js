var base = {
	init:function(){
		base.set();
	},
	set:function(){
		createForm.set({
			width:1000
			,title:"Standard Text 생성"
			,divisionType:null
			,service:"/master/standardText/create"
			,beforeHandler:function(){
				return true;
			}
			,afterHandler:function(json){
				setTimeout(function(){
					hash.set({"service":"master/standardText/list"});
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
					},{
						title:"Standard Text Title"
						,id:"title"
						,type:"input"
						,width:590
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
	}
}
$(document).ready(base.init);