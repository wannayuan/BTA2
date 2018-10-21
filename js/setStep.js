/**
 * Created by changwang.song on 2017/12/26.
 */
function extend(obj1,obj2){
    for(var attr in obj2){
        obj1[attr] =  obj2[attr];
    }
}
function SetStep(arg){
    this.body=document.body;
    this.opt = {
        show:true,
        content:'.stepCont', //菜单及分页容器
        pageCont:'.pageCont', //分页容器
        imgWidth:20,  
        stepContainerMar:20,
        nextBtn:'.nextBtn',
        prevBtn:'.prevBtn',
        steps:['发起','募捐','进行','结束','庆祝'],
        titles:['step1','step2','step3','step4','step5'],
        stepCounts:5,//步骤总数
        curStep:1,//当前为哪一步
        animating:false, 
        showBtn:true,//是否显示切换步骤按钮
        clickAble:true,//点击节点能否切换步骤
        onLoad: function(){

        }
    }
    this.init(arg)
}
//原型函数
SetStep.prototype.init=function(arg){
    var _that=this;
   //替换默认值 
    extend(this.opt,arg);
    //获取步骤总数 
    this.opt.stepCounts=this.opt.steps.length;
    // 容器
    this.content=$(this.opt.content);
    // 分页容器
    this.pageCont=this.content.find(this.opt.pageCont)
    // 获取容器的宽度
    var w_con=$(this.content).width();
    var w_li=(w_con-this.opt.stepContainerMar*2)/this.opt.stepCounts/2;
    var stepContainer=this.content.find('.ystep-container');
    this.stepContainer=stepContainer;
    // 菜单导航显示
    var stepsHtml=$("<ul class='ystep-container-steps'></ul>");
    // 每个步骤，默认未进行
    var stepDisc = "<li class='ystep-step ystep-step-undone'></li>";
    var radius="<div class='radius'></div>"
    var titelDisc="<p class='step-title'></p>";
    var arrow="<p class='arrow'></p>";
    // 步骤条，默认进度为0
    var stepP=$("<div class='ystep-progress'>"+
                "<p class='ystep-progress-bar'><span class='ystep-progress-highlight' style='width:0%'></span></p>"+
            "</div>");
    // 步骤切换按钮
    var stepButtonHtml =$( "<div class='step_button'>"
                        +"<input type='button' class='nextBtn' id='logout'  value='logout'>"
                        +"<input type='submit' class='nextBtn' id='submit'  value='Submit'>"
                        +"<input type='button' class='nextBtn' id='nextBtn' value='Next >>'>"
                        +"<input  type='button' class='prevBtn' id='prevBtn' value='<< Back'></div>");
    // stepP.css('width',w_li*2*(this.opt.stepCounts-1));
    // stepP.find('.ystep-progress-bar').css('width',w_li*2*(this.opt.stepCounts-1))
    // 给每个步骤填充文本内容
    for(var i=0;i<this.opt.stepCounts;i++){
        var _t=$(titelDisc).text(this.opt.titles[i]);
        var _r=$(radius).text(i+1);
        if(i==0){
            // i=0,为第一步，添加活动类，显示为当前步骤
            // var _s=$(stepDisc).text(this.opt.steps[i]).addClass('');
            var _s=$(stepDisc).text(this.opt.steps[i]).addClass('ystep-step-active');
        }else{
            var _s=$(stepDisc).text(this.opt.steps[i]);
        }
        _s.append(_r).append(_t).append(arrow);
        //将所有步骤的li添加到步骤容器ul中 
        stepsHtml.append(_s);
    }
    // 默认的样式是步骤组件的宽度，margin设置
    // 定义每个步骤的宽，margin-right为步骤间距的长度
    stepsHtml.find('li').css('width','40px').css('marginRight',w_li*2-40);
    stepsHtml.find('li:last-child').css('marginRight',0)
    stepP.css('width',(this.opt.stepCounts-1)*w_li*2);
    stepP.find('.ystep-progress-bar').css('width',(this.opt.stepCounts-1)*w_li*2)
    stepContainer.append(stepsHtml).append(stepP);
    
    // stepContainer.css('left',(w_con-30-stepP.width()-this.opt.imgWidth-10-this.opt.stepContainerMar*2)/2)
    stepContainer.css({"width":(this.opt.stepCounts-1)*w_li*2+40,"marginLeft":"50%","transform":"translatex(-50%)"})
    // 展开侧边栏时，触发resize()事件
     $('.stepCont').resize(function(){
        // 当调整浏览器窗口的大小时，会触发resize事件
        var w_con=$(_that.content).width();
        var w_li=w_con/_that.opt.stepCounts/2;
        stepP.css('width',w_li*2*(_that.opt.stepCounts-1));
        stepP.find('.ystep-progress-bar').css('width',w_li*2*(_that.opt.stepCounts-1))
        stepsHtml.find('li').css('width','40px').css('marginRight',w_li*2-40)
        stepsHtml.find('li:last-child').css('marginRight',0);
        stepContainer.css({"width":(this.opt.stepCounts-1)*w_li*2+60,"marginLeft":"50%","transform":"translatex(-50%)"})

   })
    this.content.css('overflow','hidden');
    this.setProgress(this.stepContainer,this.opt.curStep,this.opt.stepCounts);
    //如果显示切换按钮
    if(this.opt.showBtn){
        // this.content.append(stepButtonHtml);
        $('#Step_form').append(stepButtonHtml);
        // this.prevBtn=this.content.find(this.opt.prevBtn);
        // this.nextBtn=this.content.find(this.opt.nextBtn);
        this.prevBtn=$('#Step_form').find(this.opt.prevBtn);
        this.nextBtn=$('#Step_form').find(this.opt.nextBtn);
        this.prevBtn.on('click',function(){
            // if($(this).hasClass('handleAble')){
            if($(_that).attr('disabled')||_that.opt.animating){
                return false;
            }else{
                _that.opt.animating=true;
                _that.opt.curStep--;
                _that.setProgress(_that.stepContainer,_that.opt.curStep,_that.opt.stepCounts)
            }
        });
        this.nextBtn.on('click',function(){
            // if($(this).hasClass('handleAble')){
            if($(_that).attr('disabled')||_that.opt.animating){
                return false;
            }else{
                _that.opt.animating=true;
                _that.opt.curStep++;
                _that.setProgress(_that.stepContainer,_that.opt.curStep,_that.opt.stepCounts)
            }
        })
    }
    //如果可以点击节点切换
    if(this.opt.clickAble){
        stepsHtml.find('li').on('click',function(){
          // li的索引从0开始，要切换到第几步
            _that.opt.curStep=$(this).index()+1;
            _that.setProgress(_that.stepContainer,_that.opt.curStep,_that.opt.stepCounts);
        })
    }
}
// 
SetStep.prototype.setProgress=function(n,curIndex,stepsLen){
      var _that=this;
      console.log('当前为第'+curIndex+"步");
        //获取所有步骤的li
        var $steps = $(n).find("li");
        var $progress =$(n).find(".ystep-progress-highlight");
        //容错处理
        if(1<=curIndex && curIndex<=$steps.length){
          //计算高亮步骤条的显示百分比
          var scale = "%";
          scale = Math.round((curIndex-1)*100/($steps.length-1))+scale;
          $progress.animate({
            width: scale
          },{
            speed: 1000,
            done: function() {
              //判断每个li在当前步骤下的状态
              $steps.each(function(j,m){
                var _$m = $(m);
                var _j = j+1;
                if(_j < curIndex){
                  _$m.attr("class","ystep-step-done");
                }else if(_j === curIndex){
                  _$m.attr("class","ystep-step-active");
                }else if(_j > curIndex){
                  _$m.attr("class","ystep-step-undone");
                }
              })
              // 为切换按钮设置禁用状态
              if(_that.opt.showBtn){
                  if(curIndex==1){
                      // _that.prevBtn.attr('disabled','true')
                      _that.prevBtn.hide();
                      _that.nextBtn.text('Next >>');
                      _that.nextBtn.removeAttr('disabled')
                  }else if(curIndex==stepsLen){
                      _that.prevBtn.removeAttr('disabled')
                      // _that.nextBtn.attr('disabled','true')
                       _that.nextBtn.text('logout');
                  }else if(curIndex==stepsLen-1){
                      _that.prevBtn.removeAttr('disabled')
                      _that.nextBtn.text('submit')
                  }else if(1<curIndex<stepsLen){
                      _that.prevBtn.show();
                      _that.prevBtn.text('<< Back')
                      _that.prevBtn.removeAttr('disabled')
                      _that.nextBtn.text('Next >>')
                      _that.nextBtn.removeAttr('disabled')
                  }
              }
               _that.checkPage(_that.pageCont,_that.opt.curStep,_that.opt.stepCounts)
               _that.opt.animating=false;
            }
          });  
        }else{
            return false;
        }
}
// 分页容器的内容
SetStep.prototype.checkPage=function(pageCont,curStep,steps){
    for(var i = 1; i <= steps; i++){
      if(curStep===steps){
       pageCont.find('#page'+i).css("display","block");
       //如果到当前完成的那一步
       $('#logout').css('display','block');
       $('#prevBtn').css('display','block');
       $('#nextBtn').css('display','none');
       $('#submit').css('display','none');
      }else{
       if(i === curStep){
            pageCont.find('#page'+i).css("display","block");
          }else{
            pageCont.find('#page'+i).css("display","none");
          }
          //如果在提交的那一步
      if(curStep==steps-1){
       $('#nextBtn').css('display','none');
       $('#submit').css('display','block');
       $('#logout').css('display','none');
       $('#prevBtn').css('display','block');
      }
      if(curStep<steps-1){
       $('#nextBtn').css('display','block');
       $('#submit').css('display','none');
       $('#logout').css('display','none');
       $('#prevBtn').css('display','block');
      }
    }
  }
}