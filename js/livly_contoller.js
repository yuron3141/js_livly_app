//キャラクター本体の取得
const chara = document.getElementById("livly");

//キャラの描画フレームを取得
const standing = document.getElementById("standing");
const walking = document.getElementById("walking");
const gripped = document.getElementById("gripped");
const sleeping = document.getElementById("sleeping");

//キャラを描画する関数
function drawing_chara(state){
    //キャラクターがたってる状態ならば
    if(state == 0){
        standing.className = "disp";
        walking.className = "none";
        gripped.className = "none";
        sleeping.className = "none";
    //キャラクターが歩いてる状態なら
    }else if(state == 1){
        standing.className = "none";
        walking.className = "disp";
        gripped.className = "none";
        sleeping.className = "none";
    //キャラクターがクリックされてるならば
    }else if(state == 2){
        standing.className = "none";
        walking.className = "none";
        gripped.className = "disp";
        sleeping.className = "none";
    //キャラクターが寝てるならば
    }else{
        standing.className = "none";
        walking.className = "none";
        gripped.className = "none";
        sleeping.className = "disp";
    }
}

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

//ランダム位置を取得する関数
function rand_posi(){
    const maxY= window.innerHeight -200;
    const maxX = window.innerWidth -200;
    const min = 200;

    let randomx = Math.floor( Math.random() * (maxX - min + 1)) + min;
    let randomy = Math.floor( Math.random() * (maxY - min + 1)) + min;

    return [randomx, randomy];
}

class Chara {
    constructor(){
        //目標座標
        this.aimX = 0;
        this.aimY = 0;

        //計算用座標
        this.calcX = 0;
        this.calcY = 0;

        //前(現在)の座標
        this.nowX = 0;
        this.nowY = 0;

        //キャラの状態
        this.state = 0;

        //キャラのクリック状態
        this.clicked = 0;

        //キャラが到着したかどうか(0到着,1歩き, 2アイドル)
        this.arrived = 0;

        //キャラの立ち時間
        this.idletime = 500;

        //キャラの歩行時間
        this.walkingtime = 0;

        //立時間処理時間
        this.time = 0;
    };

    //クリック状態を変える関数
    clicke(val, val2){
        this.clicked = val;
        this.state = val2;
        drawing_chara(this.state);
    }
    //arriveを変える関数
    arrive(val){
        this.arrived = val;
        this.idletime = 120;
    }

    //キャラクターの向きを移動方向に対して反転する関数
    directchara(x, x2){
        const diff_x = x - x2

        if(diff_x < 0){
            chara.className= "svg-right";
        }else{
            chara.className= "svg-left";
        }
    };

    //リヴリーの位置を取得する関数
    get_posi(){
        this.nowX = chara.getBoundingClientRect().left;
        this.nowY = chara.getBoundingClientRect().top;

    };

    //キャラクターを移動させる関数
    movechara(){
        console.log(this.clicked, this.arrived, this.state);
        //掴まれていなれば
        if(this.clicked == 0){
            //到着していなければ
            if(this.arrived == 0){   
                this.walkingtime = 0;         
                let random = rand_posi();
                this.aimX = random[0];
                this.aimY = random[1];

                this.get_posi();

                chara.style.left = this.nowX + 'px';
                chara.style.top = this.nowY + 'px';

                this.directchara(this.nowX, this.aimX);

                this.state = 1;
                this.arrived = 1;

                drawing_chara(this.state);
            //進行中
            }else if(this.arrived == 1){

                this.walkingtime -= 2;

                let output = calc(this.nowX, this.nowY, this.aimX, this.aimY, this.walkingtime);

                chara.style.left = output[1][0] + 'px';
                chara.style.top = output[1][1] + 'px';

                if(this.aimX == parseInt(output[1][0])){
                    this.arrived = 2;
                    this.walkingtime = 0

                    let whichstate = Math.floor(Math.random() * 100);
                    if(whichstate < 20){
                        this.state = 3;
                        //アイドル時間をランダムで取得
                        const myArray = [300, 700, 1100];
                        let rand = Math.floor(Math.random()*myArray.length);
                        this.idletime = myArray[rand];
                    }else{
                        this.state = 0;
                        //アイドル時間をランダムで取得
                        const myArray = [40, 80, 100, 120];
                        let rand = Math.floor(Math.random()*myArray.length);
                        this.idletime = myArray[rand];
                    }

                    drawing_chara(this.state);
                    this.time = 0;
                }
            //停止中
            }else{
                if(this.time > this.idletime){
                    drawing_chara(this.state);
                    this.arrived = 0;
                }else{
                    this.time += 1;
                }
            }
        //掴まれてなければ  
        }else{

        }
    };

    //繰り返し動く処理
    loop(){
        setInterval(this.movechara.bind(this), 30);
    }
}

const livly = new Chara();
livly.loop();

//マウスで触れるようにする処理
chara.onmousedown = function(event) {

    livly.clicke(1, 2);
    
    let shiftX = event.clientX - chara.getBoundingClientRect().left;
    let shiftY = event.clientY - chara.getBoundingClientRect().top;
    
    chara.style.position = 'absolute';
    chara.style.zIndex = 1000;
    //document.body.append(chara);
    
    moveAt(event.pageX, event.pageY);
    
    //座標の中心に置く
    function moveAt(pageX, pageY) {
    chara.style.left = pageX - shiftX + 'px';
    chara.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    }
    
    // (3) mousemove で移動する
    document.addEventListener('mousemove', onMouseMove);
    
    // (4) ドロップする。不要なハンドラを削除する
    chara.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        chara.onmouseup = null;
        livly.clicke(0, 0);
        livly.arrive(2);
    };
    
};

chara.ondragstart = function() {

    return false;
};