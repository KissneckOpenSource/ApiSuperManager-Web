export default {
    bind(el, binding, vnode, oldVnode) {
      let resizeEvent = new CustomEvent('drag-resize',{detail:'尺寸变化',bubbles:false});
      //初始化不最大化
      el.fullscreen = false;
      //弹框可拉伸最小宽高
      let minWidth = 400;
      let minHeight = 300;
      //当前宽高
      let nowWidth = minWidth;
      let nowHight = minHeight;
      //当前顶部高度
      let nowMarginTop = 0;
      //获取弹框头部（这部分可双击全屏）
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      let hasSetBodyHight = false;
      //弹窗
      const dragDom = el.querySelector('.el-dialog');
      dragDom.className += ' el-drag-dialog';
      //清除选择头部文字效果
      dialogHeaderEl.onselectstart = new Function("return false");
      //头部加上可拖动cursor
      dialogHeaderEl.style.cursor = 'move';
  
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
  
      //头部插入最大化最小化元素
      let maxMin = document.createElement("button");
      maxMin.className += ' el-dialog__headerbtn el-dialog__minmax';
      maxMin.style.right = '70px';
      maxMin.style.color = '#909399';
      maxMin.title = el.fullscreen ? '还原' : '最大化';
      maxMin.innerHTML = '<i class=' + (el.fullscreen ? '"el-icon-crop"' : '"el-icon-full-screen"') + ' onMouseOver="this.style.color=\'#409EFF\'" onMouseOut="this.style.color=\'#909399\'"></i>';
      dialogHeaderEl.insertBefore(maxMin, dialogHeaderEl.childNodes[1]);
      let moveDown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;
  
        // 获取到的值带px 正则匹配替换
        let styL, styT;
  
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        }
        ;
  
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX;
          const t = e.clientY - disY;
  
          // 移动当前元素
          dragDom.style.left = `${l + styL}px`;
          dragDom.style.top = `${t + styT}px`;
  
          //将此时的位置传出去
          //binding.value({x:e.pageX,y:e.pageY})
        };
  
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
      dialogHeaderEl.onmousedown = moveDown;
      let bodyHeight = 'auto';
  
      function setMaxMin() {
        if (el.fullscreen) {
          let i = maxMin.querySelector('.el-icon-crop');
          i.classList.remove('el-icon-crop');
          i.classList.add('el-icon-full-screen');
          maxMin.innerHTML = '<i class="el-icon-full-screen"></i>';
          maxMin.title = '最大化';
          dragDom.style.height = "auto";
          dragDom.style.width = nowWidth + 'px';
          dragDom.style.marginTop = nowMarginTop;
          el.fullscreen = false;
          dialogHeaderEl.style.cursor = 'move';
          dialogHeaderEl.onmousedown = moveDown;
          dragDom.querySelector('.el-dialog__body').style.height = bodyHeight;
          hasSetBodyHight = false;
        } else {
          let i = maxMin.querySelector('.el-icon-full-screen');
          i.classList.remove('el-icon-full-screen');
          i.classList.add('el-icon-crop');
          maxMin.title = '还原';
          bodyHeight = dragDom.querySelector('.el-dialog__body').offsetHeight + 'px';
          nowHight = dragDom.clientHeight;
          nowWidth = dragDom.clientWidth;
          nowMarginTop = dragDom.style.marginTop;
          dragDom.style.left = 0;
          dragDom.style.top = 0;
          dragDom.style.height = "100VH";
          dragDom.style.width = "100VW";
          dragDom.style.marginTop = 0;
          el.fullscreen = true;
          dialogHeaderEl.style.cursor = 'initial';
          dialogHeaderEl.onmousedown = null;
          if (!hasSetBodyHight) {
            let footerHeight = dragDom.querySelector('.el-dialog__footer') && dragDom.querySelector('.el-dialog__footer').offsetHeight;
            dragDom.querySelector('.el-dialog__body').style.height = 'calc(100% - ' + (dialogHeaderEl.offsetHeight + footerHeight) + 'px)';
            hasSetBodyHight = true;
          }
        }
        el.dispatchEvent(resizeEvent);
      }
  
      //点击放大缩小效果
      maxMin.onclick = setMaxMin;
      //双击头部效果
      dialogHeaderEl.ondblclick = setMaxMin;
      //拉伸
      let resizeEl = document.createElement("div");
      dragDom.appendChild(resizeEl);
      //在弹窗右下角加上一个10-10px的控制块
      resizeEl.style.cursor = 'se-resize';
      resizeEl.style.position = 'absolute';
      resizeEl.style.height = '10px';
      resizeEl.style.width = '10px';
      resizeEl.style.right = '0px';
      resizeEl.style.bottom = '0px';
      //鼠标拉伸弹窗
      resizeEl.onmousedown = (e) => {
        // 记录初始x位置
        const clientX = e.clientX;
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - resizeEl.offsetLeft;
        const disY = e.clientY - resizeEl.offsetTop;
        document.onmousemove = function (e) {
          e.preventDefault(); // 移动时禁用默认事件
          // 通过事件委托，计算移动的距离
          const x = e.clientX - disX + (e.clientX - clientX);//这里 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
          const y = e.clientY - disY;
          //比较是否小于最小宽高
          dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
          dragDom.style.height = y > minHeight ? `${y}px` :   'fit-content';
          if (!hasSetBodyHight) {
            let footerHeight = dragDom.querySelector('.el-dialog__footer') && dragDom.querySelector('.el-dialog__footer').offsetHeight;
            dragDom.querySelector('.el-dialog__body').style.height = 'calc(100% - ' + (dialogHeaderEl.offsetHeight + footerHeight) + 'px)';
            hasSetBodyHight = true;
          }
        };
        //拉伸结束
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          el.dispatchEvent(resizeEvent);
        };
      }
    }
  }