// 柱状图组件对象
var H5ComponentBar = function(name,cfg){
	var component = new H5ComponentBase(name,cfg);

	$.each(cfg.data,function(index,item){
		// console.log(item);

		var line = $('<div class="line">');
		var name = $('<div class="name">');
		var rate = $('<div class="rate">');
		var per = $('<div class="per">');

		var width = item[1] * 80 + '%';
		var realWidth = item[1] * 100 + '%';

		var bgStyle = '';
		if(item[2]){
			bgStyle = 'style="background-color:' + item[2] + '"';
		}
		name.text(item[0]);
		rate.html('<div class="bg" '+''+'></div>');
		rate.css('width',width);
		// rate.css('background-color',cfg.data[0][2]);

		per.text(realWidth);
		line.append(name).append(rate).append(per);

		component.append(line);
	});
	$('.bg').css('background-color',cfg.data[0][2]);

	return component;
}