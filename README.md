# sliderBar.js    

移动端范围选择器，移动端滑动条，适用于区间之间的范围选择

##Features

- 原生js移动端选择控件，不依赖任何库  
- 选择成功后，提供自定义回调函数  

##Demo


![Image text](http://p1.bqimg.com/4851/23a3ee52cb4503bb.gif)

##Installation

```html
    <link rel="stylesheet" type="text/css" href="css/sliderBar.css">
    <script src="js/sliderBar.js" type="text/javascript"></script>
```

##Getting Started


```html
<input type="text" id="trigger">

<script type="text/javascript">
    var sliderBar1 = new SliderBar({
        trigger: '#trigger',
        title: '标题标题',
        minValue: 0, //最小值
        maxValue: 5000, //最大值
        unit:'元', //单位 可选填
        position:[0, 4000], //设置初始位置 可选填 注意要在 minValue—maxValue的区间内
        callback:function(data){
            console.log(data); //返回选中的数值
        }
    });
</script>
```
####callback 返回选中的数值：
![Image text](http://p1.bqimg.com/567571/484866b6cc613582.png)


