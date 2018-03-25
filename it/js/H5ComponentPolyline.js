// 柱状图组件对象
var H5ComponentPolyline = function(name,cfg){
	var component = new H5ComponentBase(name,cfg);

	//	绘制网格线
	var w = cfg.width;
	var h = cfg.height;

	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	//	水平网格线  100份 -> 10 份
	var step = 10;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#aaa";


	window.ctx = ctx;

	for( var i = 0;i <= step ; i++){
		var y = (h/step) * i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}

	//	垂直网格
	step = cfg.data.length + 1;
	var text_w = w/step;
	for( var i = 0 ; i <= step ; i++){
		var x = (w/step) * i;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		if(cfg.data[i]){
			var text = $('<div class="text">')
			text.text(cfg.data[i][0]);
			text.css('width',text_w/2).css('left',x/2 + text_w/4);
			component.append(text);
		}
	}
	ctx.stroke();

	//	绘制折线数据
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	/**
	 * 绘制折线一集对应的数据和阴影
	 * @param  {float} per
	 * @return {DOM} component 元素
	 */
	var draw = function(per){
		//	清空画布
		ctx.clearRect(0,0,w,h);

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ff8878";

		var x = 0;
		var y = 0;

		var row_w = (w/(cfg.data.length + 1));
		var pointArr = [];
		//	画出数据坐标点
		for( i in cfg.data){
			var item = cfg.data[i];
			x = row_w * (parseInt(i) + 1);
			y = (1 - item[1]*per) * h;
			// y = h - (item[1]*h*per);
			pointArr.push([x,y]);
			ctx.moveTo(x, y);
			ctx.arc(x,y,5,0,2*Math.PI);
		}

		ctx.moveTo(pointArr[0][0],pointArr[0][1]);
		for (var i = 0 ; i< pointArr.length - 1; i++){
			ctx.lineTo(pointArr[i+1][0],pointArr[i+1][1]);
		}
		ctx.stroke();

		//	绘制阴影
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255,136,120,0)';;
		ctx.lineTo(pointArr[pointArr.length-1][0],h);
		ctx.lineTo(pointArr[0][0],h);
		ctx.fillStyle = 'rgba(255,136,120,0.2)';
		ctx.fill();

		//	写数据
		for( i in cfg.data){
			var item = cfg.data[i];
			x = row_w * (parseInt(i) + 1);
			y = (1 - item[1]*per) * h;
			ctx.fillStyle = item[2] ? item[2] : '#595959';
			ctx.fillText( (item[1]*100 + '%'),x-8,y-12);
		}

		ctx.stroke();
	}

	component.on('onLoad',function(){
		//	折线图生长动画
		var s = 0;
		var timer = null;
		for(var i =0 ; i< 100 ; i++){
			setTimeout(function(){
				s += 0.01;
				draw(s);
			},i*10+500)
		}
	});

	component.on('onLeave',function(){
		//	折线图退场动画
		var s = 1;
		for(var i =0 ; i< 100 ; i++){
			setTimeout(function(){
				s -= 0.01;
				draw(s);
			},i*10)
		}
	});

	return component;
}