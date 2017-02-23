window.SliderBar = (function() {

	function getClass(dom,string) {
		return dom.getElementsByClassName(string);
	}
	//构造器
	function SliderBar(config) {
		this.sliderBar;
		this.wheelsData = config.wheels;
		this.renderSlider();
		this.trigger = document.querySelector(config.trigger);
	    this.slider = this.sliderBar.querySelector('.slider');
    	this.bar = this.sliderBar.querySelector('.bar');
    	this.panel = this.sliderBar.querySelector('.panel');
    	this.handles = getClass(this.sliderBar,'handle');
    	this.labels = getClass(this.sliderBar,'label');

	    this.ensureBtn = this.sliderBar.querySelector('.ensure');
    	this.closeBtn = this.sliderBar.querySelector('.cancel');
	    this.grayLayer = this.sliderBar.querySelector('.grayLayer');
	    this.popUp = this.sliderBar.querySelector('.content');
	    this.movesX = [];
	    this.clickStatus = false;
	    this.allWidth = this.sliderBar.offsetWidth;
	    this.realWidth = this.slider.offsetWidth;
	    this.minBoundary = parseInt((this.allWidth-this.realWidth)/2);
	    this.maxBoundary = this.allWidth - this.minBoundary;

	    this.callback = config.callback ? config.callback : function(){};
	    this.initPosition = config.position ? config.position : null;
	    this.minValue = config.minValue ? config.minValue : 0;
	    this.maxValue = config.maxValue ? config.maxValue : 100;
	    this.titleText = config.title ? config.title : '';
	    this.unit = config.unit? config.unit : '';

	    this.init(config);
	}
	
	SliderBar.prototype = {
		constructor: SliderBar,

		init: function(config){
			var _this = this; 
			_this.trigger.readOnly=true;
			_this.trigger.style.cursor='pointer';
			_this.setTitle(_this.titleText);
		    _this.setPosition(_this.initPosition); 

		    for(var i=0; i<_this.handles.length; i++){
	        	_this.handles[i].style.left = _this.getPercent(i) +'%';
	        	_this.labels[i].innerHTML = parseInt(_this.getOccupy(i) * (_this.maxValue - _this.minValue)) + _this.minValue + _this.unit;
		    }
	    	_this.bar.style.width = _this.getPercent(1) - _this.getPercent(0) +'%';
	    	_this.bar.style.left = _this.getPercent(0) +'%';


			_this.panel.addEventListener('touchmove', function () {
				_this.touch(event,'slider');
			},false);

			_this.handles[0].addEventListener('touchmove', function () {
				_this.touch(event,'handle');
			},false);

			//PC拖拽监听
			_this.panel.addEventListener('mousedown', function () {
				_this.touch(event,'slider');
			},false);
			_this.panel.addEventListener('mousemove', function () {
				_this.touch(event,'slider');
			},false);
			_this.panel.addEventListener('mouseup', function () {
				_this.touch(event,'slider');
			},false);
			_this.handles[0].addEventListener('mousedown', function () {
				_this.touch(event,'handle');
			},false);
			_this.handles[0].addEventListener('mousemove', function () {
				_this.touch(event,'handle');
			},false);
			_this.handles[0].addEventListener('mouseup', function () {
				_this.touch(event,'handle');
			},false);


			//按钮监听
		    _this.closeBtn.addEventListener('click',function(){
		    	_this.sliderBar.classList.remove('sliderBar-show');
		    });

		    _this.ensureBtn.addEventListener('click',function(){
		    	_this.sliderBar.classList.remove('sliderBar-show');
		    	var tempValue ='';
		    	for(var i=0; i<_this.labels.length; i++){
		    		i==_this.labels.length-1 ? tempValue += _this.getValue(i) : tempValue += _this.getValue(i)+'-';
		    	}
		    	_this.trigger.value = tempValue;
		    	_this.callback(_this.getValueJson());
		    });

		    _this.trigger.addEventListener('click',function(){
		    	_this.sliderBar.classList.add('sliderBar-show');
		    });

		    _this.grayLayer.addEventListener('click',function(){
		    	_this.sliderBar.classList.remove('sliderBar-show');
		    });

		    _this.popUp.addEventListener('click',function(){ //阻止冒泡
		    	event.stopPropagation(); 
		    });
		},

		renderSlider: function(wheelsData){
			var _this = this;
			_this.sliderBar = document.createElement("div");
			_this.sliderBar.className = "sliderBar";
			_this.sliderBar.innerHTML = 
		    	'<div class="grayLayer"></div>'+
		        '<div class="content">'+
		            '<div class="btnBar">'+
		                '<div class="fixWidth">'+
		                    '<div class="cancel">取消</div>'+
		                    '<div class="title"></div>'+
		                    '<div class="ensure">确定</div>'+
		                '</div>'+
		            '</div>'+
		            '<div class="panel">'+
		                '<div class="fixWidth">'+
			                '<div class="slider">'+
			                    '<div class="bar"></div>'+
			                    '<div class="handle startHandle">'+
			                    	'<div class="label">1</div>'+
			                    '</div>'+
			                    '<div class="handle endHandle">'+
			                    	'<div class="label">100</div>'+
			                    '</div>'+
			                '</div>'+
		                '</div>'+
		            '</div>'+
		        '</div>';
		    document.body.appendChild(_this.sliderBar);
		},

		getValue: function(index){
			var _this = this;
			return _this.labels[index].innerHTML;
		},

		getValueJson:function(){
			var _this = this;
			var price = {};
			price.min = _this.getValue(0);
			price.max = _this.getValue(1);
			return price;
		},

		setTitle: function(string){
			var _this = this;
			_this.titleText = string;
			_this.sliderBar.querySelector('.title').innerHTML = _this.titleText;
		},

		convertMoveX: function(num){
			var _this = this;
			return ((num - _this.minValue)/(_this.maxValue - _this.minValue)) * _this.realWidth + _this.minBoundary; 
		},

		setPosition: function(positionArr){
			var _this = this;
			if (positionArr == null) {
				_this.movesX = [_this.minBoundary, _this.maxBoundary];	
			}else{
				var temp = [];
				for(var i=0; i<positionArr.length; i++){
					temp.push(_this.convertMoveX(positionArr[i]));
				}
				_this.movesX = temp;	
			}
		},



		getOccupy: function(index){ //计算比例
	    	var _this = this;
	    	var temp = ((_this.movesX[index] - _this.minBoundary)/_this.realWidth).toFixed(4);
	    	temp>1 ? temp = 1 : temp = ((_this.movesX[index] - _this.minBoundary)/_this.realWidth).toFixed(4);
			return temp;
		},

		getPercent: function(index){ //百分比
	    	var _this = this;
			return _this.getOccupy(index)*100;
		},

		checkBoundary: function(position){
			var _this = this;
			if(position < _this.minBoundary){
				position = _this.minBoundary;
			}
	        return position;
		},

		updateMinPosition: function(){
			var _this = this;
	        _this.handles[0].style.left = _this.getPercent(0) +'%';
	    	_this.bar.style.width = _this.getPercent(1) - _this.getPercent(0) +'%';
	    	_this.bar.style.left = _this.getPercent(0) +'%';
	        _this.labels[0].innerHTML = +parseInt(_this.getOccupy(0) * (_this.maxValue - _this.minValue)) + _this.minValue + _this.unit;
		},

		updateMaxPosition: function(){
			var _this = this;
	        _this.handles[1].style.left = _this.getPercent(1) +'%';
	    	_this.bar.style.width = _this.getPercent(1) - _this.getPercent(0) +'%';
	        _this.labels[1].innerHTML = parseInt(_this.getOccupy(1) * (_this.maxValue - _this.minValue)) + _this.minValue + _this.unit;
		
		},

		updatePosition: function(tempX, index){
			var _this = this;
			if(tempX > _this.movesX[index]){
	       		_this.movesX[1] = tempX;	
				_this.updateMaxPosition();
			}else{
				_this.movesX[0] = tempX;	
				_this.updateMinPosition();
			}
		},

	    touch: function(event, dom){
	    	var _this = this;
	    	var tempX;
	    	event = event || window.event;
	    	event.preventDefault();
	    	event.stopPropagation();
	    	switch(event.type){

	    		case "touchmove":
	    			tempX = event.touches[0].clientX;
	    			tempX = _this.checkBoundary(tempX);
	    			if(dom == 'slider'){
	    				_this.updatePosition(tempX, 0);
	    			}else if(dom == 'handle'){
	    				_this.updatePosition(tempX, 1);
	    			}
	    			break;

	    		case "mousedown":
	    			_this.clickStatus = true;
	    			break;

	    		case "mousemove":
				    if (_this.clickStatus) {
		    			tempX = event.clientX;
		    			tempX = _this.checkBoundary(tempX);
		    			if(dom == 'slider'){
		    				_this.updatePosition(tempX, 0);
		    			}else if(dom == 'handle'){
	    					_this.updatePosition(tempX, 1);
		    			}
			        }
	    			break;
	    		case "mouseup":
	    			_this.clickStatus = false;
	    			break;
	    	}
	    }

	};

	return SliderBar;
})();