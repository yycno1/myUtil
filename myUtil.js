//伪数组转换成数组
//伪数组：
//......1.function内的arguments
//......2.HTMLCollection,nodeList等
//......3.特殊写法的对象，如jquery对象
function toArray(obj){
	try{
		return Array.prototype.slice.call(obj);
	}catch(e){ //..for IE..
	    var value,i=0,result=[];
	    while(value=obj[i]){
	    	result[i]=value;
	    }
	    return result;
	}
}

//数组转换成伪数组
function toArrLike(arr){
	var res={};
    Array.prototype.push.apply(res,arr);
    return res;
}

//递归遍历对象，查找元素
function find(obj,prop,value){
	var result = _res = null;
	if(obj instanceof Array){
		for(var i=0;i<obj.length;i++){
			_res = find(obj[i],prop,value);
			if(_res){
				result = _res;
			}
		}
	}else{
		if(obj[prop]){
			if(value === undefined || obj[prop] === value){
				result = obj;
			}
		}else{
			for(var key in obj){
				if(obj[key] instanceof Object || obj[key] instanceof Array){
					_res = find(obj[key],prop,value);
					if(_res){
						result = _res;
					}
				}
			}
		}
	}
	return result;
}

//判断对象是否包含可读属性
function isEmptyObj(obj){
	for(var key in obj){
		return false;
	}
	return true;
}




// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element,siblingNode){
	return(element.parentNode===siblingNode.parentNode);
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element){
	var curLeft = element.offsetLeft,
	    curTop = element.offsetTop,
	    curEle = element.offsetParent;
	while(curEle!==null){
		curLeft += curEle.offsetLeft;
		curTop += curEle.offsetTop;
		curEle = curEle.offsetParent;
	}
	return{
		x : curLeft,
		y : curTop,
	};
}

// 实现一个简单的Query
function $(selector,content){
	var con = content || document;
	if(!/\s/.test(selector)){
		if(/^#[a-z_][\w-]*$/.test(selector)){
		   	return con.getElementById(selector.substring(1));
	    }
	    if(/^[a-z_][\w-]*$/.test(selector)){
		   	return con.getElementsByTagName(selector);
	    }
	    if(/^\.([a-z_][\w-]*)$/.test(selector)){
	    	if(con.getElementsByClassName){
	    		return con.getElementsByClassName(selector.substring(1));
	    	}else{
	    		var nodes = con.getElementsByTagName('*'),
	    		    res = {};
	    		    res.length = 0;
	    		for(var i=0,len=nodes.length;i<len;i++){
	    			if(isContain(nodes[i].className.split(" "),RegExp.$1)){
	    				res[res.length] = nodes[i];
	    				res.length++;
	    			}
	    		}
	    		return res;
	    	}
	    }
	    if(/^\[(\S+)\]$/.test(selector)){
		    var attr = RegExp.$1,
		        res = {};
		        res.length = 0;
		    if(!/(=)/.test(attr)){
		    	var nodes = con.getElementsByTagName('*');
	    		for(var i=0,len=nodes.length;i<len;i++){
	    			if(nodes[i].getAttribute(attr)){
	    				res[res.length] = nodes[i];
	    				res.length++;
	    			}
	    		}
		    }else{
		    	var attrName = RegExp.leftContext,
		    	    attrValue = RegExp.rightContext;
		    	var nodes = con.getElementsByTagName('*');
	    		for(var i=0,len=nodes.length;i<len;i++){
	    			if(nodes[i].getAttribute(attrName)===attrValue){
			    		res[res.length] = nodes[i];
	    				res.length++;
	    			}
	    		}
		    }
		    return res;
	    }
	}
}

$.addClassName = function(element,newClassName){
	if(!element.className){
		element.className=newClassName;
	}else if(element.className.indexOf(newClassName)===-1){
        element.className+=" "+newClassName; 
    }
}

$.removeClassName = function(element,oldClassName){
	if(element&&element.className.indexOf(oldClassName)!==-1){
		var classname=element.className;
		if(classname===oldClassName){
			element.className="";
		}else if(classname.indexOf(oldClassName)===0){
			element.className=classname.replace(oldClassName+" ","");
		}else{
			element.className=classname.replace(" "+oldClassName,"");
		}
	}
}
$.getPreSibling = function(ele){
    var res = ele.previousSibling;
    while(res&&res.nodeType !== 1){
    	res = res.previousSibling;
    }
    return res;
};
$.getNextSibling = function(ele){
    var res = ele.nextSibling;
    while(res&&res.nodeType !== 1){
    	res = res.nextSibling;
    }
    return res;
};
$.getAncestor = function(ele,tag){
    var res = ele.parentNode;
    while(res && res.tagName.toLowerCase() !== tag){
    	res = res.parentNode;
    }
    return res;
};
$.getTextContent = function(ele){
    return (typeof ele.textContent === "string")?ele.textContent:ele.innerText;
};

//文本框定位光标的位置
$.setCursorPos = function(pos){
	if(typeof titleInput.selectionStart === "number"){ //非ie
	    titleInput.selectionStart = pos;
	}else{
		var range = titleInput.creatTextRange();
		range.move("character",pos);
		range.select();
	}
};
$.on = function(element,type,listener){
    if(element.addEventListener){
    	element.addEventListener(type,listener,false);
    }else if(element.attachEvent){
    	element.attachEvent("on"+type,listener);
    }else{
    	element["on"+type]=listener;
    }
};

$.un = function(element,type,listener){
	if(element.removeEventListener){
	    element.removeEventListener(type,listener,false);
	}else if(element.detachEvent){
		element.detachEvent("on"+type,listener);
	}else{
		element["on"+type]=null;
	}
};

$.click = function(element,listener){
	this.on(element,'click',listener);
};

$.enter = function(element,listener){
	this.on(element,'keydown',function(e){
	    e=e||window.event;
	    if(e.keyCode===13){
	    	listener();
	    }
	});
};

$.delegate = function(element,tgt,type,listener){
	var self = this;
	$.on(element,type,function(e){
		var e = self.getEvent(e);
		var target = self.getTarget(e);
		if(target.tagName.toLowerCase()===tgt||$.isContain(target.className.split(" "),tgt.substring(1))||$(tgt)===target){
			listener.call(this,e,target);
		}
	});
};
$.isContain = function(arr,item){
	if(arr.indexOf){
	    if(arr.indexOf(item)>-1){
	    	return true;
	    }
	}else{
		for(var i=0;i<arr.length;i++){
		    if(arr[i]===item){
		    	return true;
		    }
		}
	}
	return false;
};
$.getEvent = function(event){
	return event?event:window.event;
};

$.getTarget = function(event){
    return event.target?event.target:event.srcElement;
};

$.preventDefault = function(event){
    if(event.preventDefault){
    	event.preventDefault();
    }else{
    	event.returnValue = false;
    }
};

$.stopPropagation = function(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
};

//判断对象是否包含可读属性
$.isEmptyObj = function(obj){
	for(var key in obj){
		return false;
	}
	return true;
};
