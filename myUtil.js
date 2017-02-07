var $ = {};

//获取计算后的样式信息
$.getStyle = function(obj, attr) {
    if (obj.currentStyle) {
    	return obj.currentStyle(attr);
    } else if (getComputedStyle) {
    	return getComputedStyle(obj, false)[attr];
    }
};

//添加类名
$.addClassName = function(element, newClassName) {
	if (element.classList) {
		element.classList.add(newClassName);
		return;
	}
	var classNameList = element.className.split(' ');
	if (classNameList.indexOf(newClassName) === -1) {
		return;
	}
	classNameList.push(newClassName);
	element.className = classNameList.join(' ');
};

//移除类名
$.removeClassName = function(element, oldClassName) {
	if (element.classList) {
		element.classList.remove(oldClassName);
		return;
	}
	var classNameList = element.className.split(' ');
	var i = classNameList.indexOf(oldClassName);
	if (i === -1) {
		return;
	}
	classNameList.splice(i, 1);
	element.className = classNameList.join(' ');
};

//获取前一个兄弟元素
$.getPreSibling = function(ele){
    var res = ele.previousSibling;
    while (res && res.nodeType !== 1){
    	res = res.previousSibling;
    }
    return res;
};

//获取后一个兄弟元素
$.getNextSibling = function(ele){
    var res = ele.nextSibling;
    while (res && res.nodeType !== 1) {
    	res = res.nextSibling;
    }
    return res;
};

//获取第一个符合给定tagName的祖先元素
$.getAncestorByTagName = function(ele, tag){
    var res = ele.parentNode;
    while(res && res.tagName.toLowerCase() !== tag){
    	res = res.parentNode;
    }
    return res;
};

//获取元素的文本内容
$.getText = function(ele){
    return (typeof ele.textContent === "string") ? ele.textContent : ele.innerText;
};

// 判断siblingNode和element是否为同一个父元素下的同一级的元素
$.isSiblingNode = function(element, siblingNode) {
	return (element.parentNode === siblingNode.parentNode);
};

//文本框定位光标的位置
$.setCursorPos = function(inputEle, pos) {
	if (typeof inputEle.selectionStart === "number") { //非ie
	    inputEle.selectionStart = pos;
	}else{
		var range = inputEle.creatTextRange();
		range.move("character", pos);
		range.select();
	}
};

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
$.getPosition = function(element) {
	var curLeft = element.offsetLeft,
	    curTop = element.offsetTop,
	    curEle = element.offsetParent;
	while (curEle !== null) {
		curLeft += curEle.offsetLeft;
		curTop += curEle.offsetTop;
		curEle = curEle.offsetParent;
	}
	return {
		x : curLeft,
		y : curTop,
	};
};

//DOM2级事件绑定
$.on = function(element, type, listener) {
    if (element.addEventListener) {
    	element.addEventListener(type, listener, false);
    } else if (element.attachEvent) {
    	element.attachEvent("on" + type,listener);
    } else {
    	element["on" + type] = listener;
    }
};

//DOM2级事件移除
$.un = function(element, type, listener){
	if (element.removeEventListener) {
	    element.removeEventListener(type, listener, false);
	} else if(element.detachEvent) {
		element.detachEvent("on" + type, listener);
	} else {
		element["on" + type] = null;
	}
};

//动画
$.move = function() {
	var flag = {};
	return function animate(obj, option, fn) {
	    clearTimeout(obj.timer);
	    obj.timer = setTimeout(function() {
	    	for (var attr in option) {
		    	//计算当前值
		    	var icur = 0;
		    	if (attr === "opacity") {
		    		icur = Math.round(parseFloat($.getStyle(obj, attr)) * 100);
		    	} else {
		    		icur = parseInt($.getStyle(obj, attr));
		    	}

			    //目标值
			    var itar = option[attr];
			    
		    	//计算速度
		    	var speed = (itar - icur) / 50;
		    	speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

		    	//判断是否已达到目标值
		    	if ((speed > 0 && icur < itar) || (speed < 0 && icur > itar)) {
		    		//未达到目标
		    		if (attr === "opacity") {
		    			obj.style.opacity = (icur + itar) / 100;
		    			obj.style.filter = "alpha(opacity" + icur + speed + ")"; //for ie6,7,8
		    		} else {
		    			obj.style[attr] = icur + speed + "px";
		    		}
		    		//做上标记
		    		if(flag[attr] === undefined){
		    			flag[attr] = true;  
		    		}
		    		animate(obj, option, fn);
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
$.isContain = function(arr, item){
    if (arr.indexOf(item) > -1) {
    	return true;
    }
	return false;
};

//判断对象是否包含可读属性
$.isEmptyObj = function(obj) {
	for(var key in obj){
		return false;
	}
	return true;
};

//伪数组转换成数组
$.toArray = function(obj) {
	try {
		return Array.prototype.slice.call(obj);
	} catch (e) { //..for IE..
	    var value, i = 0, result = [];
	    while(value = obj[i]) {
	    	result[i] = value;
	    }
	    return result;
	}
};

//数组转换成伪数组
$.toArrLike= function(arr){
	var res = {};
    Array.prototype.push.apply(res, arr);
    return res;
};

//throttle
$.throttle = function(action, delay) {
    var context = null;
    var argsCache = null;
    var previous = new Date().getTime();
    var timer = null;

    function timeout() {
        previous = new Date().getTime();
        timer = null;
        action.apply(context, argsCache);
        if (!timer) {
            context = argsCache = null;
        }
    }

    function throttleFunc() {
        var now = getNow;
        var rest = delay - (now - previous);
        context = this;
        argsCache = arguments;
        if (rest <= 0 || rest > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
        	action.apply(context, argsCache);
        	if (!timer) {
          		context = argsCache = null;
        	}
        } else if (!timer) {
        	timer = setTimeout(timeout, delay);
      	}
    }
    return throttleFunc;
};

$.type = function(obj) {
    return Object.prototype.toString.call(obj).substring(8).replace(']', '').toLowerCase();
};

$.serialize = function(formData) {
	var res = [];
	Object.keys(formData).forEach(function(key) {
		if (formData[key] instanceof Array) {
			formData[key].forEach(function(value) {
				res.push(key + '=' + window.encodeURIComponent(value));
			});
      	} else {
        	res.push(key + '=' + formData[key]);
      	}
	})
    return res.join('&');
};
