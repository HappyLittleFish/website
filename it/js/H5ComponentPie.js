// 饼图组件对象
var H5ComponentPie = function(name,cfg){
  var component = new H5ComponentBase(name,cfg);

  //  绘制网格线
  var w = cfg.width;
  var h = cfg.height;

  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',1);
  component.append(cns);

  var r = w/2;
  var step = cfg.data.length;

  // 加入一个底图层
  ctx.beginPath();
  ctx.fillStyle = '#eee';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  ctx.arc(r,r,r,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();

  //  绘制一个数据层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',2);
  component.append(cns);

  var colors = [ 'red','green','blue','orange','gray'];

  var sAngle = 1.5 * Math.PI; //设置开始的角度在 12 点位置
  var eAngle = 0; //设置结束的角度
  var aAngle = Math.PI*2;

  var step = cfg.data.length;
  for( var i=0; i< step; i++){
    var item = cfg.data[i];
    var color = item[2] || ( item[2] = colors.pop());

    eAngle = sAngle + item[1] * aAngle;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = .1;

    ctx.moveTo(r,r);
    ctx.arc(r,r,r,sAngle,eAngle);
    ctx.fill();
    ctx.stroke();
    // 如果是单圆环，就不用变更
    if(step != 1){
      sAngle = eAngle;
    }
    //  加入所有的项目文以及百分比

    var text = $('<div class="text">');
    text.text(cfg.data[i][0]);
    var per = $('<div class="per">');
    per.text(cfg.data[i][1]*100 + '%');
    text.append(per);

    var x = r + Math.sin( .5 * Math.PI - sAngle) * r;
    var y = r + Math.cos( .5 * Math.PI - sAngle) * r;

    text.css('left', x/2).css('top', y/2);

    if(x > w/2){
      text.css('right', (w-x)/2);
    }else{
      text.css('left', x/2 - 34);
    }

    if(y > h/2){
      text.css('bottom',(h-y)/2);
    }else{
      text.css('top',y/2 - 34);
    }

    if(cfg.data[i][2]){
      text.css('color',cfg.data[i][2]);
    }
    text.css('opacity',0);
    component.append(text);

  }

  //  加入一个蒙板层
  var cns = document.createElement('canvas');
  var ctx = cns.getContext('2d');
  cns.width = ctx.width = w;
  cns.height = ctx.height = h;
  $(cns).css('zIndex',3);
  component.append(cns);

  ctx.fillStyle = '#eee';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;


  var draw = function( per ){

    ctx.clearRect(0,0,w,h);

    ctx.beginPath();
    ctx.moveTo(r,r);
    if(per <= 0){
      ctx.arc(r,r,r,0,2*Math.PI);
      component.find('.text').css('opacity',0);
    }else{
      ctx.arc(r,r,r,sAngle,sAngle+2*Math.PI * per,true);
    }

    ctx.fill();
    ctx.stroke();

    if( per >= 1){
      H5ComponentPie.resortPie(component.find('.text'));
      component.find('.text').css('opacity',1);
      ctx.clearRect(0,0,w,h);
    }

  }

  draw(0);

  component.on('onLoad',function(){
    //  饼图生长动画
    var s = 0;
    var timer = null;
    for(var i =0 ; i< 100 ; i++){
      setTimeout(function(){
        s += 0.01;
        draw(s);
      },i*10+300)
    }
  });

  component.on('onLeave',function(){
    //  饼图退场动画
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

//  重排项目文本元素
H5ComponentPie.resortPie = function( list){
  //  1.检测是否相交
  var compare = function( domA, domB){

    //  计算机domA、domB的x轴、y轴的投影
    var offsetA = $(domA).offset();
    var offsetB = $(domB).offset();

    var shadowA_x = [offsetA.left,offsetA.left + $(domA).width()];
    var shadowA_y = [offsetA.top,offsetA.top + $(domA).height()];

    var shadowB_x = [offsetB.left,offsetB.left + $(domB).width()];
    var shadowB_y = [offsetB.top,offsetB.top + $(domB).height()];

    var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1])
                      || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1])

    var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1])
                      || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1])

    return intersect_x && intersect_y;
  }

  //  2.错开重排
  var reset = function(domA,domB){
    if( $(domA).css('top') != 'auto'){
      $(domA).css('top',parseInt($(domA).css('top')) + $(domB).height() );
    }

    if( $(domA).css('bottom') != 'auto'){
      $(domA).css('bottom',parseInt($(domA).css('bottom')) + $(domB).height() );
    }

  }

  //  定义将要重排的元素
  var willReset = [list[0]];

  $.each(list,function(i,domTarget){

    if( compare(willReset[willReset.length-1],domTarget)){
      willReset.push(domTarget);
    }

    if(willReset.length > 1){
      $.each(willReset,function(i,domA){

        if(willReset[i+1]){
          reset(domA,willReset)
        }
      });
      H5ComponentPie.resortPie( willReset);
    }
  });
}



