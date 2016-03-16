// 我的工具集
// 实现一个简单的Query
function $(selector,content){
	var con = content || document;
    if(con.querySelectorAll){
    	if(/^#[a-z_][\w-]*$/.test(selector)){
    		return con.querySelectorAll(selector)[0];
    	}
		return con.querySelectorAll(selector);
	}
	if(!/\s/.test(selector)){

		//by #Id
		if(/^#[a-z_][\w-]*$/.test(selector)){
		   	return con.getElementById(selector.substring(1));
	    }

	    //by tagName
	    if(/^[a-z_][\w-]*$/.test(selector)){
		   	return con.getElementsByTagName(selector);
	    }

	    //by .className
	    if(/^\.([a-z_][\w-]*)$/.test(selector)){
	    	if(con.getElementsByClassName){
	    		return con.getElementsByClassName(selector.substring(1));
	    	}else{
	    		var nodes = con.getElementsByTagName('*'),
	    		    res = {};
	    		    res.length = 0;
	    		for(var i=0,len=nodes.length;i<len;i++){
	    			if($.isContain(nodes[i].className.split(" "),RegExp.$1)){
	    				res[res.length] = nodes[i];
	    				res.length++;
	    			}
	    		}
	    		return res;
	    	}
	    }

    	//by attribute
	    if(/^\[(\S+)\]$/.test(selector)){
		    var attr = RegExp.$1,
		        res = {};
		        res.length = 0;
		    if(!/(=)/.test(attr)){
                
                //by [attributeName]
		    	var nodes = con.getElementsByTagName('*');
	    		for(var i=0,len=nodes.length;i<len;i++){
	    			if(nodes[i].getAttribute(attr)){
	    				res[res.length] = nodes[i];
	    				res.length++;
	    			}
	    		}
		    }else{

		    	//by [attributeName = value]
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

//获取计算后的样式信息
$.getStyle = function(obj,attr){
    if(obj.currentStyle){
    	return obj.currentStyle(attr);
    }else if(getComputedStyle){
    	return getComputedStyle(obj,false)[attr];
    }
}

//添加类名
$.addClassName = function(element,newClassName){
	if(!element.className){
		element.className=newClassName;
	}else if(element.className.indexOf(newClassName)===-1){
        element.className+=" "+newClassName; 
    }
};

//移除类名
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

//获取前一个兄弟元素
$.getPreSibling = function(ele){
    var res = ele.previousSibling;
    while(res&&res.nodeType !== 1){
    	res = res.previousSibling;
    }
    return res;
};

//获取后一个兄弟元素
$.getNextSibling = function(ele){
    var res = ele.nextSibling;
    while(res&&res.nodeType !== 1){
    	res = res.nextSibling;
    }
    return res;
};

//获取第一个符合给定tagName的祖先元素
$.getAncestor = function(ele,tag){
    var res = ele.parentNode;
    while(res && res.tagName.toLowerCase() !== tag){
    	res = res.parentNode;
    }
    return res;
};

//获取元素的文本内容
$.getTextContent = function(ele){
    return (typeof ele.textContent === "string")?ele.textContent:ele.innerText;
};

// 判断siblingNode和element是否为同一个父元素下的同一级的元素
$.isSiblingNode = function(element,siblingNode){
	return(element.parentNode===siblingNode.parentNode);
};

//文本框定位光标的位置
$.setCursorPos = function(inputEle,pos){
	if(typeof inputEle.selectionStart === "number"){ //非ie
	    inputEle.selectionStart = pos;
	}else{
		var range = inputEle.creatTextRange();
		range.move("character",pos);
		range.select();
	}
};

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
$.getPosition = function(element){
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
};

//DOM2级事件绑定
$.on = function(element,type,listener){
    if(element.addEventListener){
    	element.addEventListener(type,listener,false);
    }else if(element.attachEvent){
    	element.attachEvent("on"+type,listener);
    }else{
    	element["on"+type]=listener;
    }
};

//DOM2级事件移除
$.un = function(element,type,listener){
	if(element.removeEventListener){
	    element.removeEventListener(type,listener,false);
	}else if(element.detachEvent){
		element.detachEvent("on"+type,listener);
	}else{
		element["on"+type]=null;
	}
};

//绑定点击事件
$.click = function(element,listener){
	this.on(element,'click',listener);
};

//绑定回车事件
$.enter = function(element,listener){
	this.on(element,'keydown',function(e){
	    e=e||window.event;
	    if(e.keyCode===13){
	    	listener();
	    }
	});
};

//事件代理
//tgt可以是className或者tagName
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

//获取事件对象
$.getEvent = function(event){
	return event?event:window.event;
};

//获取事件发生元素
$.getTarget = function(event){
    return event.target?event.target:event.srcElement;
};

//禁用默认行为
$.preventDefault = function(event){
    if(event.preventDefault){
    	event.preventDefault();
    }else{
    	event.returnValue = false;
    }
};

//禁止事件冒泡
$.stopPropagation = function(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
};

//动画
$.move = function(){
	var flag = {};
	return function animate(obj,option,fn){
	    clearTimeout(obj.timer);
	    obj.timer = setTimeout(function(){
	    	for(var attr in option){
		    	//计算当前值
		    	var icur = 0;
		    	if(attr === "opacity"){
		    		icur = Math.round(parseFloat($.getStyle(obj,attr))*100);
		    	}else{
		    		icur = parseInt($.getStyle(obj,attr));
		    	}

			    //目标值
			    var itar = option[attr];
			    
		    	//计算速度
		    	var speed = (itar-icur)/50;
		    	speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

		    	//判断是否已达到目标值
		    	if((speed > 0 && icur < itar) || (speed < 0 && icur > itar)){
		    		//未达到目标
		    		if(attr === "opacity"){
		    			obj.style.opacity = (icur + itar)/100;
		    			obj.style.filter = "alpha(opacity"+ icur + speed + ")"; //for ie6,7,8
		    		}else{
		    			obj.style[attr] = icur + speed + "px";
		    		}
		    		//做上标记
		    		if(flag[attr] === undefined){
		    			flag[attr] = true;  
		    		}
		    		animate(obj,option,fn);
		    	}else{
		    		//已达到目标
		    		//删除标记
		    		if(flag[attr]){
			    		delete flag[attr];
		    		}
		    	}
		    }
		    //回调
    		for(var i in flag){
    			return;
    		}
		    if(typeof fn === "function"){
		    	fn();
		    }
	    },20);
	}
}();



//判断数组是否包含某个item
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
//判断对象是否包含可读属性
$.isEmptyObj = function(obj){
	for(var key in obj){
		return false;
	}
	return true;
};

//递归遍历对象，查找元素
$.find = function(obj,prop,value){
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
};

//伪数组转换成数组
//伪数组：
//......1.function内的arguments
//......2.HTMLCollection,nodeList等
//......3.特殊写法的对象，如jquery对象
$.toArray = function(obj){
	try{
		return Array.prototype.slice.call(obj);
	}catch(e){ //..for IE..
	    var value,i=0,result=[];
	    while(value=obj[i]){
	    	result[i]=value;
	    }
	    return result;
	}
};

//数组转换成伪数组
$.toArrLike= function(arr){
	var res={};
    Array.prototype.push.apply(res,arr);
    return res;
};
