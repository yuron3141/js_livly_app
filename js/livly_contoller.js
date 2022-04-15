
//リヴリーの取得
const ball = document.getElementById("livly");
//リヴリーsvgの取得
const pigmy = document.getElementById('main');

//移動のためのパラメータ設定
//目的地座標
let aimX = 0;
let aimY = 0;
//計算用の目的位置
let calcX = 0;
let calcY = 0;
//アイドル時間
let idletime = 1000;//(1秒)
//現在地座標
let nowX = 0;
let nowY = 0;
//角度
let angle = 0;
//状態bool
let state = 1; //1:つかまれてない,2:つかまれている
//到着bool
let arrived = 0; //0:到着していない,1進行中,2:到着した
//経過時間
let elapsedTime = 0;
//時間本体
let t = 0;

//マウスで触れるようにする処理
ball.onmousedown = function(event) {

state = 2;
pigmy.setAttribute('src', 'pigmys/pigmy_02.html');

let shiftX = event.clientX - ball.getBoundingClientRect().left;
let shiftY = event.clientY - ball.getBoundingClientRect().top;

ball.style.position = 'absolute';
ball.style.zIndex = 1000;
document.body.append(ball);

moveAt(event.pageX, event.pageY);

// ボールを（pageX、pageY）座標の中心に置く
function moveAt(pageX, pageY) {
ball.style.left = pageX - shiftX + 'px';
ball.style.top = pageY - shiftY + 'px';
}

function onMouseMove(event) {
moveAt(event.pageX, event.pageY);
}

// (3) mousemove でボールを移動する
document.addEventListener('mousemove', onMouseMove);

// (4) ボールをドロップする。不要なハンドラを削除する
ball.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    ball.onmouseup = null;
    state = 1;
    arrived = 2;
    pigmy.setAttribute('src', 'pigmys/pigmy_00.html');
};

};

ball.ondragstart = function() {

    return false;
};

//ページが読み込まれたら、リヴリーの位置をウィンドウサイズに合わせて最初にランダム配置する関数
window.onload = function(e) {
    const maxY= window.innerHeight -200;
    const maxX = window.innerWidth -200;
    const min = 200;

    let shiftX = e.clientX - ball.getBoundingClientRect().left;
    let shiftY = e.clientY - ball.getBoundingClientRect().top; 

    let randomx = Math.floor( Math.random() * (maxX - min + 1)) + min;
    let randomy = Math.floor( Math.random() * (maxY - min + 1)) + min;

    console.log()
    // ボールを（pageX、pageY）座標の中心に置く
    function moveAt(pageX, pageY) {
        ball.style.left = pageX + 'px';
        ball.style.top = pageY + 'px';

    }
    moveAt(randomx, randomy);
};

//ランダム位置を取得する関数
function rand_posi(){
    const maxY= window.innerHeight -200;
    const maxX = window.innerWidth -200;
    const min = 200;

    let randomx = Math.floor( Math.random() * (maxX - min + 1)) + min;
    let randomy = Math.floor( Math.random() * (maxY - min + 1)) + min;

    return [randomx, randomy];
}



//リヴリーの位置を取得する関数
function get_posi(e){
    let shiftX = ball.getBoundingClientRect().left;
    let shiftY = ball.getBoundingClientRect().top;

    return [shiftX, shiftY];
};

//点と点の移動関数any[1][0,1]に移動量の格納
function calc(fx, fy, tx, ty, move){
    fx = parseFloat(fx);
    fy = parseFloat(fy);
    tx = parseFloat(tx);
    ty = parseFloat(ty);
    move = parseFloat(move);
    if(isNaN(fx) || isNaN(fy) || isNaN(tx) || isNaN(ty) || isNaN(move)){
        return false;
    }
    move = Math.abs(move);
    let dx = tx - fx;
    let dy = ty - fy;
    let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if(length == 0) return false;
    let per = move / length;
    if(per == 0) return false;
    let mx = dx * per;
    if(mx == 0) return false;
    let my = dy * per;
    if(my == 0) return false;
    let ary = [];
    let cx = fx;
    let cy = fy;
    while(true){
        if((dx > 0 && cx > tx)
        || (dx < 0 && cx < tx)){
            cx = tx;
        }
        if((dy > 0 && cy > ty)
        || (dy < 0 && cy < ty)){
            cy = ty;
        }
        ary.push([cx, cy]);
        if(cx == tx && cy == ty) break;
        cx += mx;
        cy += my;
    }
    return ary;
}
//リヴリーの向きを調整する関数
function directmain(x, x2){
    const diff_x = x-x2;

    if(diff_x < 0){
        pigmy.className= "svg-icon";
    }else{
        pigmy.className= "svg-icon2";
    }
};

//リヴリーが移動する関数
function movemain(){
    //掴まれてなければ
    if(state == 1){
        //到着していなければ
        if(arrived == 0){
            elapsedTime = 0;

            let Now = get_posi();
            let Random = rand_posi();

            aimX = Random[0];
            aimY = Random[1];

            nowX = Now[0];
            nowY = Now[1];
            angle = (aimY - nowY)/(aimX - nowX);

            ball.style.left = nowX + 'px';
            ball.style.top = nowY + 'px';

            directmain(nowX, aimX);

            arrived = 1;
        //進行中
        }else if(arrived == 1){
            t -= 2;

            let output = calc(nowX, nowY, aimX , aimY, t);

            ball.style.left = (output[1][0]) + 'px';
            ball.style.top = (output[1][1]) + 'px';

            //console.log("now:"+ output[1][0], output[1][1]);

            //目的座標についたら到着処理
            if(aimX == parseInt(output[1][0])){
                pigmy.setAttribute('src', 'pigmys/pigmy_00.html');
                arrived = 2;

                //アイドル時間の設定
                const myArray = [40, 80, 100, 120];
                let rand = Math.floor(Math.random()*myArray.length);

                idletime = myArray[rand];
            }
        //停止中
        }else{
            if(elapsedTime >= idletime){
                pigmy.setAttribute('src', 'pigmys/pigmy_01.html');
                arrived = 0;
            }else{
                t=0;
                elapsedTime += 1;
                //console.log(elapsedTime);
            }
        }
    //掴まれていれば
    }else{
        
    }
}

setInterval(movemain, 30);