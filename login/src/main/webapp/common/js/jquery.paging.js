!function($){
	'use strict';
	//default properties.
	var a=/a/i,defs={
		item:'a',next:'다음',prev:'이전',format:'{0}',
		itemClass:'paging-item',sideClass:'paging-side',className:'jquery-paging',
		itemCurrent:'selected',length:10,max:1,current:1,total:1,append:false
		,href:"javascript:hash.add({'page':{0}});",event:true,first:'처음',last:'맨뒤'
	},format=function(str){
		var arg=arguments;
		return str.replace(/\{(\d+)}/g,function(m,d){
			if(+d<0) return m;
			else return arg[+d+1]||"";
		});
	},item,make=function(op,page,cls,str,href){
		item=document.createElement(op.item);
		item.className=cls;
		item.innerHTML=format(str,page,op.length,op.start,op.end,op.start-1,op.end+1,op.max);
		if(a.test(op.item)) {
			if(href == false){
				item.href="javascript:;";
			}else{
				item.href=format(op.href,page);
			}
		}
		if(op.event){
			$(item).bind('click',function(e){
				var fired=true;
				if($.isFunction(op.onclick)) fired=op.onclick.call(item,e,page,op);
				if(fired==undefined||fired)
					$(op.origin).paging({current:page});
				return fired;
			}).appendTo(op.origin);
			//bind event for each elements.
			var ev='on';
			switch(str){
				case op.prev:ev+='prev';break;
				case op.next:ev+='next';break;
				case op.first:ev+='first';break;
				case op.last:ev+='last';break;
				default:ev+='item';break;
			}
			if($.isFunction(op[ev])) op[ev].call(item,page,op);
		}
		return item;
	};

	$.fn.paging=function(op){
		$(this).each(function(){
			if(this.__JQ_PAGING){
				if(op === 'destroy'){
					$(this).removeClass(this.__JQ_PAGING.className).empty();
					delete this.__JQ_PAGING;
					return true;
				}else if(op in this.__JQ_PAGING){
					return this.__JQ_PAGING[op];
				}
				op=$.extend(this.__JQ_PAGING,op||{});$(this).empty();
			}else if(op instanceof String || typeof op === 'string') return false;
			else{
				op=$.extend({origin:this},defs,op||{});
				$(this).addClass(op.className).empty();
			}
			op.max = Math.ceil(op.total/op.pageSize);
			op.current = op.page;
			if(op.max<1) op.max=1; if(op.current<1) op.current=1;
			op.start=~~((op.current-1)/op.length)*op.length+1;
			op.end=op.start-1+op.length;
			if(op.end>op.max) op.end=op.max;
			if(op.current>op.length){
				if(op.first!==false) {
					make(op,1,"first",op.first);//first button
				}else{
					make(op,1,"first disable",op.first,false);//first button
				}
				make(op,op.start-1,"prev",op.prev);//prev button
			}else{
				make(op,1,"first disable",op.first,false);//first button
				make(op,op.start-1,"prev disable",op.prev,false);//prev button
			}
			//pages button
			for(var i=op.start;i<=op.end;i++)
				make(op,i,op.itemClass+(i==op.current?' '+op.itemCurrent:''),op.format);

			if(op.current/op.length<op.max/op.length){
				if(op.end<op.max){
					make(op,op.end+1,"next",op.next);//next button
				}else{
					make(op,op.end+1,"next disable",op.next,false);//next button
				}
				if(op.last!==false){
					make(op,op.max,"last",op.last);//last button
				}else{
					make(op,op.max,"last disable",op.last,false);//last button
				}
			}else{
				make(op,op.end+1,"next disable",op.next,false);//next button
				make(op,op.max,"last disable",op.last,false);//last button
			}
			this.__JQ_PAGING=op;
		});
		var info = "";
		if($(".listCountInfo").length > 0){
			info = $(".listCountInfo")
		}else{
			info = $("<span/>").appendTo($("#mainTitleArea h1")).addClass("listCountInfo")
		}
		info.html("총 <strong>"+Comma(op.total)+"</strong>개 / <strong>"+Comma(op.max)+"</strong>페이지의 데이터가 있습니다.");
	};
}(jQuery);