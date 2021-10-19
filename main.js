const mainEl = document.querySelector('#main');
const canvas_bg = document.querySelector('#canvas-bg');
const toolboxEl = document.querySelector('#toolbox');
const canvas_panel = document.querySelector('#canvas-panel');
const block_wrap = document.querySelector('.block-wrap');
const opacity_slider = document.querySelector('#opacity-slider');
const size_sliderEl = document.querySelector('#size-slider');
const btn_toolboxEl = document.querySelector('#btn-toolbox');
const btn_add = document.querySelector('#add');
const btn_remove = document.querySelector('#remove');
const btn_brush = document.querySelector('#brush-size');
const btn_eraser = document.querySelector('#eraser');
const btn_colors = document.querySelectorAll('.btn-color')
const btn_palette = document.querySelector('#palette');
const btn_close = document.querySelector('#close');
const btn_save = document.querySelector('#save');
//畫布
const canvasEls = [];

//滑鼠物件
const mouse = {
    x: null,
    y: null,
    isPress: false,
}

const visibleGrade = {
    unVisible: 0,
    visble: 2,
    selected: 3,
}

let x1 = null;
let y1 = null;
let size = 10;
let color = 'black';
let count = 0;
let selectedCanvasId = null;
setInitColor();

//顯示工具(按鈕)
btn_toolboxEl.addEventListener('click', function (ev) {
    toolboxEl.style.transform = 'translateY(0%)';
});
//不顯示工具(按鈕)
btn_close.addEventListener('click', function (ev) {
    toolboxEl.style.transform = 'translateY(100%)';
});
// 新增畫布(按鈕)
btn_add.addEventListener('click', function (ev) {
    canvas_bg.style.background = '#fff';
    createCanvas();
    //顯示圖層工具列
    canvas_panel.style.display = 'block';
});
//移除畫布(按鈕)
btn_remove.addEventListener('click', function (ev) {
    removeCanvas();
});
//筆刷大小(按鈕)
btn_brush.addEventListener('click', function (ev) {
    size_sliderEl.classList.toggle('hidden');
});
//size-slider小物件
const sizeEl = size_sliderEl.querySelector('#size');
const sliderEl = size_sliderEl.querySelector('#slider');
sizeEl.addEventListener('change', function (ev) {
    sliderEl.value = ev.target.value;
    size = sizeEl.value;
});

sliderEl.addEventListener('change', function (ev) {
    sizeEl.value = ev.target.value;
    size = sizeEl.value
});
sliderEl.addEventListener('input', function (ev) {
    sizeEl.value = ev.target.value;
    size = sizeEl.value
});

//橡皮差(按鈕)
btn_eraser.addEventListener('click', function (ev) {
    color = 'white';
})
//調色盤
btn_colors.forEach(function (item, index) {
    item.addEventListener('click', function (ev) {
        selectColor(btn_colors, index);
    });
});
//調色盤
btn_palette.addEventListener('change', function (ev) {
    //換顏色
    btn_colors.forEach(function (item, index) {
        if (item.classList.contains('selected')) {
            item.style.backgroundColor = ev.target.value;
            changColor(item);
        }
    })
});
//存檔
btn_save.addEventListener('click', function (ev) {
    const saveImg = canvasEls[selectedCanvasId];
    const dataUrl = saveImg.toDataURL();
    // const dataUrl=saveImg.toDataURL('image/png',1.0);
    this.setAttribute('href', dataUrl);

});
//圖層透明度
opacity_slider.addEventListener('change', function (ev) {
    canvasEls.forEach(function (item) {
        if (item.id === selectedCanvasId) {
            altOpacity(item);
        }
    });
});
opacity_slider.addEventListener('input', function (ev) {
    canvasEls.forEach(function (item) {
        if (item.id === selectedCanvasId) {
            altOpacity(item);
        }
    });
});


//畫圓
function drawCircle(ctx, r) {
    if (mouse.isPress) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, r, 0, 2 * Math.PI);
        ctx.fill();
    }
}
//畫直線
function drawLine(ctx, x1, y1, x2, y2) {
    if (mouse.isPress) {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}
//畫圖
function mouseDrawing(canvasEl, ctx, event_param) {
    canvasEl.addEventListener(event_param + 'down', function (ev) {
        mouse.isPress = true;
        mouse.x = ev.offsetX;
        mouse.y = ev.offsetY;
        x1 = mouse.x;
        y1 = mouse.y;
        drawCircle(ctx, size);
    });

    canvasEl.addEventListener(event_param + 'move', function (ev) {
        mouse.x = ev.offsetX;
        mouse.y = ev.offsetY;
        drawCircle(ctx, size);

        x2 = mouse.x;
        y2 = mouse.y;
        drawLine(ctx, x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
    });
    canvasEl.addEventListener(event_param + 'up', function (ev) {
        mouse.isPress = false;
    });
}
//
function touchDrawing(canvasEl, ctx, event_param) {

    canvasEl.addEventListener(event_param + 'start', function (ev) {
        mouse.isPress = true;
        mouse.x = ev.touches[0].clientX - mainEl.offsetLeft;
        mouse.y = ev.touches[0].clientY - mainEl.offsetTop;
        x1 = mouse.x;
        y1 = mouse.y;
        drawCircle(ctx, size);
        console.log(ev);
    });

    canvasEl.addEventListener(event_param + 'move', function (ev) {
        ev.preventDefualt();
        mouse.x = ev.touches[0].clientX - mainEl.offsetLeft;
        mouse.y = ev.touches[0].clientY - mainEl.offsetTop;
        drawCircle(ctx, size);

        x2 = mouse.x;
        y2 = mouse.y;
        drawLine(ctx, x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
    },{passive:false});
    canvasEl.addEventListener(event_param + 'end', function (ev) {
        mouse.isPress = false;
    });
}

//新增Canvas
function createCanvas() {
    //取的視窗大小
    const initWidth = mainEl.offsetWidth;
    const initHeight = mainEl.offsetHeight;
    // console.log(initWidth, initHeight);
    //新建canvas
    const canvasEl = document.createElement('canvas');
    canvasEl.id = count++;
    canvasEl.width = initWidth;
    canvasEl.height = initHeight;
    canvasEl.style.opacity = 1;
    canvasEl.setAttribute('isvisible', true);
    canvasEl.style.zIndex = visibleGrade.visble;
    mainEl.appendChild(canvasEl);
    //畫圖
    const ctx = canvasEl.getContext('2d');
    //背景色
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    mouseDrawing(canvasEl, ctx, 'mouse');
    touchDrawing(canvasEl, ctx, 'touch');

    //加入陣列
    canvasEls.push(canvasEl);
    //新建圖層圖示
    const whiteBlock = document.createElement('div');
    whiteBlock.classList.add('white-block');
    whiteBlock.id = `${canvasEl.id}`;

    const btn_visible = document.createElement('div');
    btn_visible.classList.add('btn-visible');
    btn_visible.innerHTML = `
        <i class="fas fa-eye"></i>
    `;
    btn_visible.addEventListener('click', function (ev) {
        const isVisible = canvasEl.getAttribute('isvisible');
        if (isVisible === 'true') {
            canvasEl.setAttribute('isvisible', 'false');
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            //不顯示圖層
            changeCanvas(canvasEls, whiteBlock.id);
        }
        else {
            canvasEl.setAttribute('isvisible', 'true');
            this.innerHTML = '<i class="fas fa-eye"></i>';
            //顯示圖層
            changeCanvas(canvasEls, whiteBlock.id);
        }
        ev.cancelBubble = true;
    });
    whiteBlock.appendChild(btn_visible);
    //加入圖層列
    block_wrap.appendChild(whiteBlock);
    const blocks = block_wrap.querySelectorAll('.white-block');
    updateSlectedCanvas(blocks, whiteBlock.id);
    //block 選取事件
    whiteBlock.addEventListener('click', function (ev) {
        const blocks = block_wrap.querySelectorAll('.white-block');
        updateSlectedCanvas(blocks, this.id);

    })
}
//
function removeCanvas() {
    if (canvasEls.length > 0) {
        canvasEls.forEach(function (item) {
            if (item.id === selectedCanvasId) {
                //刪除dom
                mainEl.removeChild(item);
                //陣列中刪除
                canvasEls.splice(canvasEls.indexOf(item), 1);
                //更新張數
                //刪除圖層圖示
                let blocks = block_wrap.querySelectorAll('.white-block');
                blocks.forEach(function (item, idx) {
                    if (item.id === selectedCanvasId) {
                        block_wrap.removeChild(item);
                    }
                });
            }
        });
        blocks = block_wrap.querySelectorAll('.white-block');
        // console.log(blocks);
        //變更選擇的canvas
        if (blocks.length > 0) {
            //若還有兩個以上
            console.log(blocks.length);
            updateSlectedCanvas(blocks, canvasEls[canvasEls.length - 1].id);
        }
        else {
            //沒有-背景還原
            canvas_bg.style.background = 'transparent';
            selectedCanvasId = null;
        }
    }
}
//選取圖層
function updateSlectedCanvas(blocks, selected_id) {

    blocks.forEach(function (item, index) {
        if (item.id === selected_id) {
            if (item.classList.contains('selected')) {
                return;
            }
            else {
                item.classList.add('selected');
                //邊更主畫布
                changeCanvas(canvasEls, selected_id);
            }
        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }

        }
    });
    selectedCanvasId = selected_id;
    console.log('selected', selectedCanvasId);
}

//邊更畫布
function changeCanvas(canvasEls, selected_id) {
    canvasEls.forEach(function (item) {
        if (item.getAttribute('isvisible') === 'true') {
            //更新主畫布
            if (item.id === selected_id) {
                //選定主畫布
                item.style.zIndex = visibleGrade.selected;
                //更新透明度
                opacity_slider.value = item.style.opacity * 100;
                // console.log('op', item.style.opacity);
                altOpacity(item);
            }
            else {
                //一般
                if (parseInt(item.style.zIndex) >= visibleGrade.selected) {
                    item.style.zIndex = visibleGrade.visble;
                }
            }
        } else {
            item.style.zIndex = visibleGrade.unVisible;
        }


    });

}

//選顏色
function selectColor(colorEls, selected_index) {
    colorEls.forEach(function (item, index) {
        if (selected_index === index) {
            //變更顏色
            changColor(item);
            if (item.classList.contains('selected')) {
                return;
            }
            else {
                item.classList.add('selected');
            }
        }
        else {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }
        }
    });
}

//換顏色
function changColor(colorEl) {
    color = colorEl.style.backgroundColor;
}
//初始設定顏色RGB
function setInitColor() {
    btn_colors.forEach(function (item, index) {
        switch (index) {
            case 0:
                item.style.backgroundColor = 'black';
                color = item.style.backgroundColor;
                break;
            case 1:
                item.style.backgroundColor = 'red';
                break;
            case 2:
                item.style.backgroundColor = 'blue';
                break;
        }
    });
}

//更新透明度
function altOpacity(item) {
    let volume = opacity_slider.value;
    item.style.opacity = volume / 100;
    opacity_slider.setAttribute('value', '' + volume);
}



