var yyy=document.getElementById('xxx');

autoSetCanvasSize(yyy);

//

var context = yyy.getContext('2d');
//上面的这两句是为了便于理解写的，其实可以简化成：var context = xxx.getContext('2d');

//在加下面这几句之前，特意将id命名为red,green等，为什么不对class进行操作
red.onclick=function(){
  context.strokeStyle='red'
  context.fillStyle='red'
  red.classList.add('active');
  green.classList.remove('active');
  yellow.classList.remove('active');
}
green.onclick=function(){
  context.strokeStyle='green'
  context.fillStyle='green'
  green.classList.add('active');
  red.classList.remove('active');
  yellow.classList.remove('active');
}
yellow.onclick=function(){
  context.strokeStyle='yellow'
  context.fillStyle='yellow'
  yellow.classList.add('active');
  green.classList.remove('active');
  red.classList.remove('active');
}


context.fillStyle = 'blue';
context.beginPath();
context.moveTo(240, 240);
context.lineTo(300, 240);
context.lineTo(300, 300);
context.fill();
//以最近一次设置的fillStyle为样式进行填充

context.beginPath();
context.arc(150,150,20,0,Math.PI,true);
//圆心横纵坐标，半径，起始角度，终止角度，是否逆时针
context.fill();
//fill是自动填充，若开始点是A，结束点是B，此时图形没有闭合，添加fill()之后，在AB之间连直线，并填充所形成的图形
//fill改成stroke，是描边
//默认是顺时针，true是逆时针



//
listenToUser(yyy);


var eraserEnabled=false
pen.onclick=function(){
  eraserEnabled=false;
  pen.classList.add('active');
  eraser.classList.remove('active');
}
eraser.onclick=function(){
  eraserEnabled=true;
  eraser.classList.add('active');
  pen.classList.remove('active');
}
//onclick兼容两种设备



//
function autoSetCanvasSize(canvas){
  function setCanvasSize(){
    var pageWidth=document.documentElement.clientWidth;
    var pageHeight=document.documentElement.clientHeight;
    canvas.width=pageWidth;
    canvas.height=pageHeight;
  }
  //由css里的注释可知，不能用css定义宽高等于当前页面的宽高（因为坐标会等比例放大），用JS方法（上面的这几行代码）可以。
  //这几行代码会扩展宽高，且不是等比例放大
  //这几句定义的是属性，而不是样式

  setCanvasSize();
  //若用户调整了Output界面的大小，则需要重新定义宽高
  window.onresize=function(){
    setCanvasSize();
  }
}

//
function listenToUser(canvas){
  var using=false;
  //using=true 表示鼠标在点击过程中，在画或是在清除
  var lastPoint={x:undefined,y:undefined}

  //特性检测，不是设备检测
  if(document.body.ontouchstart !== undefined){
    //触屏设备
    //触屏设备，则应该等于null，而不是undefined
    //这个判断语句还可以有另一种写法，即 "ontouchstart" in document.body
    //因为ontouchstart是hash里的一个key（属性）
    canvas.ontouchstart=function(aaa){
      var x=aaa.touches[0].clientX;
      var y=aaa.touches[0].clientY;
      //因为触屏是支持多点同时接触的，所以接触信息存放在aaa的touches属性里，0是指第一个接触点
      console.log(x,y);
      using=true;
      if(eraserEnabled){
        context.clearRect(x-5,y-5,10,10);
      }else{
        //drawCircle(x,y,5);
        lastPoint={'x':x,'y':y}
      }
    }
    canvas.ontouchmove=function(aaa){
      console.log('边摸边动')
      var x=aaa.touches[0].clientX;
      var y=aaa.touches[0].clientY;
      //drawCircle(x,y,1);
      if(!using){
        return;
      }
      if(eraserEnabled){
        context.clearRect(x-5,y-5,10,10);
        //clearRect是以正方形形式清除，鼠标在正方形的左上角，所以x,y均应该减5，mdn里的说法不太严谨
      }else{
        var newPoint={'x':x,'y':y}
        drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
        lastPoint=newPoint;
      }
    }
    canvas.ontouchend=function(){
      console.log('摸完了')
      using=false;
    }

  }else{
    //非触屏设备
    canvas.onmousedown=function(aaa){
      var x=aaa.clientX;
      var y=aaa.clientY;
      using=true;
      if(eraserEnabled){
        context.clearRect(x-5,y-5,10,10);
      }else{
        //drawCircle(x,y,5);
        lastPoint={'x':x,'y':y}
      }
    }
    //canvas默认是绝对定位了，所以无需再用position
    //会出现一个bug，因为clientX和clientY是相对于html的坐标，不能直接给x,y，即canvas的坐标
    //此时有两种解决方法，但是先只讲了一种，margin:0;
    //drawCircle(x,y,1);不加y也可以，不影响效果，故删去
  
    canvas.onmousemove=function(aaa){
      var x=aaa.clientX;
      var y=aaa.clientY;
      //drawCircle(x,y,1);
      if(!using){
        return;
      }
      if(eraserEnabled){
        context.clearRect(x-5,y-5,10,10);
        //clearRect是以正方形形式清除，鼠标在正方形的左上角，所以x,y均应该减5，mdn里的说法不太严谨
      }else{
        var newPoint={'x':x,'y':y}
        drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
        lastPoint=newPoint;
      }
    }
    canvas.onmouseup=function(){
      using=false;
    }
  }
}

//
function drawCircle(x,y,radius){
 context.beginPath();
 context.arc(x,y,radius,0,Math.PI*2);
 //与clearRect()不同，画弧的时候鼠标的位置即是圆心的位置，因此无需进行x-5,y-5的操作
 context.fill();
}

//
function drawLine(x1,y1,x2,y2){
  context.beginPath();
  context.moveTo(x1,y1);
  context.lineWidth=5;
  //一定要先定义线的宽度，再画线
  context.lineTo(x2,y2);
  context.stroke();
  context.closePath();
}