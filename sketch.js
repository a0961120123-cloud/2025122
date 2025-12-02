let spritesheet_walk; // 走路的精靈圖檔
let spritesheet_run; // 跑步的精靈圖檔
let spritesheet_jump; // 跳躍的精靈圖檔
let spritesheet_attack1; // 攻擊動畫1的精靈圖檔
let spritesheet_attack2; // 攻擊動畫2 (投射物) 的精靈圖檔
let spritesheet_newChar; // 新增角色的精靈圖檔
let spritesheet_newChar_laugh; // 新增角色(笑)的精靈圖檔
let spritesheet_newChar_hit; // 新增角色(被擊中)的精靈圖檔

let animation_walk = []; // 儲存走路動畫的每一格
let animation_run = []; // 儲存跑步動畫的每一格
let animation_jump = []; // 儲存跳躍動畫的每一格
let animation_attack1 = []; // 儲存攻擊動畫1的每一格
let animation_attack2 = []; // 儲存攻擊動畫2的每一格
let animation_newChar = []; // 儲存新角色的動畫
let animation_newChar_laugh = []; // 儲存新角色(笑)的動畫
let animation_newChar_hit = []; // 儲存新角色(被擊中)的動畫


// 走路動畫的參數
const spriteWidth_walk = 1246;
const spriteHeight_walk = 198;
const numFrames_walk = 9;
const frameWidth_walk = spriteWidth_walk / numFrames_walk;

// 跑步動畫的參數
const spriteWidth_run = 2323;
const spriteHeight_run = 168;
const numFrames_run = 12;
const frameWidth_run = spriteWidth_run / numFrames_run;

// 跳躍動畫的參數
const spriteWidth_jump = 829;
const spriteHeight_jump = 172;
const numFrames_jump = 6;
const frameWidth_jump = spriteWidth_jump / numFrames_jump;

// 攻擊動畫1的參數
const spriteWidth_attack1 = 1039;
const spriteHeight_attack1 = 146;
const numFrames_attack1 = 4;
const frameWidth_attack1 = spriteWidth_attack1 / numFrames_attack1;

// 攻擊動畫2 (投射物) 的參數
const spriteWidth_attack2 = 740;
const spriteHeight_attack2 = 19;
const numFrames_attack2 = 5;
const frameWidth_attack2 = spriteWidth_attack2 / numFrames_attack2;

// 新增角色的參數
const spriteWidth_newChar = 699;
const spriteHeight_newChar = 190;
const numFrames_newChar = 8;
const frameWidth_newChar = spriteWidth_newChar / numFrames_newChar;

// 新增角色(笑)的參數
const spriteWidth_newChar_laugh = 585;
const spriteHeight_newChar_laugh = 183;
const numFrames_newChar_laugh = 5;
const frameWidth_newChar_laugh = spriteWidth_newChar_laugh / numFrames_newChar_laugh;

// 新增角色(被擊中)的參數
const spriteWidth_newChar_hit = 2959;
const spriteHeight_newChar_hit = 156;
const numFrames_newChar_hit = 11;
const frameWidth_newChar_hit = spriteWidth_newChar_hit / numFrames_newChar_hit;


let animationSpeed = 0.1; // 動畫播放速度

// 角色的屬性
let characterX;
let characterY;
let characterSpeed = 5; // 角色移動速度

// 新角色的屬性
let newCharX;
let newCharY;
let newCharDirection = 1; // 新角色的方向: 1=向右, -1=向左
let isNewCharLaughing = false; // 新角色是否正在笑
let newCharLaughFrameCount = 0; // 新角色笑的動畫計數器
let isNewCharHit = false; // 新角色是否被擊中
let newCharHitFrameCount = 0; // 新角色被擊中動畫的計數器
const proximityThreshold = 150; // 觸發笑的距離閾值

// 對話系統屬性
let nameInput; // 玩家輸入框
let playerName = ""; // 儲存玩家輸入的名字
let dialogueState = 0; // 0: 無對話, 1: 提問中, 2: 顯示歡迎詞
let newCharSpeech = ""; // 角色2的對話內容

// 角色狀態
let characterDirection = 1; // 角色方向: 1=向右, -1=向左
let isAttacking = false; // 角色是否正在攻擊
let attackFrameCount = 0; // 用於追蹤攻擊動畫的幀數

// 跳躍相關的物理屬性
let isJumping = false; // 角色是否正在跳躍
let velocityY = 0; // Y軸上的速度
const gravity = 0.6; // 重力加速度
const jumpForce = -15; // 向上跳躍的初始力量
let groundY; // 地面的Y座標

// 投射物管理
let projectiles = []; // 儲存所有投射物的陣列

// 在 setup() 執行前預先載入圖片資源
function preload() {
  // 載入走路和跑步的圖片
  spritesheet_walk = loadImage('走路/ALL1246198.png');
  spritesheet_run = loadImage('RUN/ALL2323168.png');
  spritesheet_jump = loadImage('跳/all829172.png');
  spritesheet_attack1 = loadImage('攻擊/ALL1039146.png');
  spritesheet_attack2 = loadImage('攻擊2/ALL74019.png');
  spritesheet_newChar = loadImage('../4/STOP/ALL699190.png');
  spritesheet_newChar_laugh = loadImage('../4/笑/ALL5851830006.png'); // 請確保這個路徑是正確的
  spritesheet_newChar_hit = loadImage('../4/倒/ALL2959156.png');
}

function setup() {
  // 創建一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  characterX = width / 2;
  characterY = height / 2;
  groundY = height / 2; // 設定地面高度為初始高度

  // 初始化新角色位置在原本角色的左邊
  newCharX = characterX - 200;
  newCharY = groundY;

  // 建立輸入框並隱藏
  nameInput = createInput();
  nameInput.hide();
  // 綁定事件：當輸入框內容改變 (通常是按下Enter) 時，呼叫 handleNameSubmit 函式
  nameInput.changed(handleNameSubmit);

  // 切割走路的 spritesheet
  for (let i = 0; i < numFrames_walk; i++) {
    let frame = spritesheet_walk.get(i * frameWidth_walk, 0, frameWidth_walk, spriteHeight_walk);
    animation_walk.push(frame);
  }

  // 切割跑步的 spritesheet
  for (let i = 0; i < numFrames_run; i++) {
    let frame = spritesheet_run.get(i * frameWidth_run, 0, frameWidth_run, spriteHeight_run);
    animation_run.push(frame);
  }

  // 切割跳躍的 spritesheet
  for (let i = 0; i < numFrames_jump; i++) {
    let frame = spritesheet_jump.get(i * frameWidth_jump, 0, frameWidth_jump, spriteHeight_jump);
    animation_jump.push(frame);
  }

  // 切割攻擊的 spritesheet
  for (let i = 0; i < numFrames_attack1; i++) {
    let frame = spritesheet_attack1.get(i * frameWidth_attack1, 0, frameWidth_attack1, spriteHeight_attack1);
    animation_attack1.push(frame);
  }

  // 切割投射物的 spritesheet
  for (let i = 0; i < numFrames_attack2; i++) {
    let frame = spritesheet_attack2.get(i * frameWidth_attack2, 0, frameWidth_attack2, spriteHeight_attack2);
    animation_attack2.push(frame);
  }

  // 切割新角色的 spritesheet
  for (let i = 0; i < numFrames_newChar; i++) {
    let frame = spritesheet_newChar.get(i * frameWidth_newChar, 0, frameWidth_newChar, spriteHeight_newChar);
    animation_newChar.push(frame);
  }

  // 切割新角色(笑)的 spritesheet
  for (let i = 0; i < numFrames_newChar_laugh; i++) {
    let frame = spritesheet_newChar_laugh.get(i * frameWidth_newChar_laugh, 0, frameWidth_newChar_laugh, spriteHeight_newChar_laugh);
    animation_newChar_laugh.push(frame);
  }

  // 切割新角色(被擊中)的 spritesheet
  for (let i = 0; i < numFrames_newChar_hit; i++) {
    let frame = spritesheet_newChar_hit.get(i * frameWidth_newChar_hit, 0, frameWidth_newChar_hit, spriteHeight_newChar_hit);
    animation_newChar_hit.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#9a031e');

  // --- 更新和繪製投射物 ---
  // 只有在角色2沒被擊倒時才更新和繪製投射物
  handleProjectiles();
  
  // --- 判斷新角色的朝向 ---
  // 只有在角色2沒被擊倒時才更新朝向和互動
  if (!isNewCharHit) { 
    // 如果主要角色在它的左邊，就面向左邊
    if (characterX < newCharX) {
      newCharDirection = -1;
    } else { // 否則 (在右邊或重疊)，就面向右邊
      newCharDirection = 1;
    }

    // --- 判斷是否觸發笑的動畫 ---
    let distance = dist(characterX, characterY, newCharX, newCharY);
    // 當靠近且對話未開始時，觸發提問
    if (distance < proximityThreshold && !isNewCharLaughing && dialogueState === 0) {
      isNewCharLaughing = true;
      newCharLaughFrameCount = 0; // 重置動畫計數器
      dialogueState = 1; // 進入提問狀態
    }
  }

  // --- 繪製新增的角色 ---
  push();
  translate(newCharX, newCharY);

  // 1. 最高優先級：如果被擊中，播放倒下動畫
  if (isNewCharHit) {
    scale(newCharDirection, 1); // 根據被擊中時的方向翻轉
    let frameIndex = floor(newCharHitFrameCount); // 計算當前幀

    image(animation_newChar_hit[frameIndex], -frameWidth_newChar_hit / 2, -spriteHeight_newChar_hit / 2);
    
    // 更新動畫幀，直到最後
    if (newCharHitFrameCount < numFrames_newChar_hit - 1) { // 播放到倒數第二幀
      newCharHitFrameCount += animationSpeed * 1.5; // 讓倒下動畫快一點
    } else {
      // 動畫播放完畢，恢復原本狀態
      isNewCharHit = false;
      newCharHitFrameCount = 0;
    }
  }
  // 2. 如果沒被擊中，才判斷是否在笑
  else if (isNewCharLaughing) {
    scale(newCharDirection, 1); // 根據方向進行翻轉
    // 播放笑的動畫
    let frameIndex = floor(newCharLaughFrameCount);
    image(animation_newChar_laugh[frameIndex], -frameWidth_newChar_laugh / 2, -spriteHeight_newChar_laugh / 2);

    // --- 在頭上方生成對話框 ---
    if (dialogueState === 1) {
      newCharSpeech = "你叫甚麼名字";
      // 顯示輸入框在角色1頭上
      nameInput.show();
      nameInput.position(characterX - nameInput.width / 2, characterY - spriteHeight_walk / 2 - 40);
    } else if (dialogueState === 2) {
      newCharSpeech = playerName + ", 歡迎你.";
      nameInput.hide(); // 隱藏輸入框
    }

    if (dialogueState > 0) {
      // 為了讓文字和對話框不受角色翻轉影響，我們需要一個新的繪圖狀態
      push();
      let bubblePadding = 10;
      textSize(16);
      let bubbleWidth = textWidth(newCharSpeech) + bubblePadding * 2;
      let bubbleHeight = 30;
      let bubbleY = -spriteHeight_newChar_laugh / 2 - bubbleHeight - 20;
      let bubbleX = -bubbleWidth / 2;
      scale(newCharDirection, 1);
      fill(255);
      stroke(0);
      rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 15);
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(newCharSpeech, 0, bubbleY + bubbleHeight / 2);
      pop();
    }

    // 更新動畫幀
    newCharLaughFrameCount += animationSpeed;

    // 如果動畫播放完畢，則恢復待機狀態
    if (newCharLaughFrameCount >= numFrames_newChar_laugh) {
      isNewCharLaughing = false;
      newCharLaughFrameCount = 0;
      if (dialogueState === 1) {
        dialogueState = 0;
        nameInput.hide();
      }
    }
  }
  // 3. 如果也沒在笑，就播放待機動畫
  else {
    scale(newCharDirection, 1); // 根據方向進行翻轉
    // 播放原本的待機動畫
    let frameIndex_newChar = floor(frameCount * animationSpeed) % numFrames_newChar;
    image(animation_newChar[frameIndex_newChar], -frameWidth_newChar / 2, -spriteHeight_newChar / 2);
  }

  pop();

  // 決定繪圖順序和狀態
  let currentAnimation;

  // --- 跳躍物理更新 ---
  // 如果角色正在跳躍，就更新他的垂直位置
  if (isJumping) {
    velocityY += gravity; // 速度受重力影響
    characterY += velocityY; // 位置受速度影響

    // 如果角色落回或低於地面
    if (characterY >= groundY) {
      characterY = groundY; // 將角色固定在地面上
      isJumping = false; // 結束跳躍狀態
      velocityY = 0; // 重設垂直速度
    }
  }

  // --- 狀態控制與動畫選擇 ---

  // 1. 攻擊狀態優先
  if (isAttacking) {
    // 播放攻擊動畫
    let frameIndex = floor(attackFrameCount);
    
    // 根據角色方向翻轉圖片
    push();
    translate(characterX, characterY);
    scale(characterDirection, 1);
    image(animation_attack1[frameIndex], -frameWidth_attack1 / 2, -spriteHeight_attack1 / 2);
    pop();

    // 更新攻擊動畫幀
    attackFrameCount += animationSpeed * 2; // 讓攻擊動畫快一點

    // 攻擊動畫結束
    if (attackFrameCount >= numFrames_attack1) {
      isAttacking = false;
      attackFrameCount = 0;
      // 產生一個新的投射物
      createProjectile();
    }
  }
  // 2. 如果不在攻擊中，才處理移動和跳躍
  else if (keyIsDown(RIGHT_ARROW)) {
    characterDirection = 1; // 更新方向為右
    // 更新角色X座標，使其向右移動
    characterX += characterSpeed;

    // 如果角色完全移出右邊界，就讓他從左邊界重新出現
    if (characterX - frameWidth_run / 2 > width) { characterX = -frameWidth_run / 2; }

    // 根據是否在跳躍選擇動畫
    if (isJumping) {
      let frameIndex = floor(frameCount * animationSpeed) % numFrames_jump;
      image(animation_jump[frameIndex], characterX - frameWidth_jump / 2, characterY - spriteHeight_jump / 2);
    } else {
      let frameIndex = floor(frameCount * animationSpeed) % numFrames_run;
      image(animation_run[frameIndex], characterX - frameWidth_run / 2, characterY - spriteHeight_run / 2);
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    characterDirection = -1; // 更新方向為左
    // 更新角色X座標，使其向左移動
    characterX -= characterSpeed;

    // 如果角色完全移出左邊界，就讓他從右邊界重新出現
    if (characterX + frameWidth_run / 2 < 0) { characterX = width + frameWidth_run / 2; }

    // 根據是否在跳躍選擇動畫並翻轉
    push();
    translate(characterX, characterY);
    scale(-1, 1);
    if (isJumping) {
        let frameIndex = floor(frameCount * animationSpeed) % numFrames_jump;
        image(animation_jump[frameIndex], -frameWidth_jump / 2, -spriteHeight_jump / 2);
    } else {
        let frameIndex = floor(frameCount * animationSpeed) % numFrames_run;
        image(animation_run[frameIndex], -frameWidth_run / 2, -spriteHeight_run / 2);
    }
    pop();
  } else if (isJumping) {
    // 原地跳躍
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_jump;
    push();
    translate(characterX, characterY);
    scale(characterDirection, 1); // 根據最後的方向決定跳躍時的朝向
    image(animation_jump[frameIndex], -frameWidth_jump / 2, -spriteHeight_jump / 2);
    pop();
  }
  else {
    // 3. 若無任何操作，則播放走路動畫 (待機)
    let frameIndex = floor(frameCount * animationSpeed) % numFrames_walk;
    push();
    translate(characterX, characterY);
    scale(characterDirection, 1); // 根據最後的方向決定待機時的朝向
    image(animation_walk[frameIndex], -frameWidth_walk / 2, -spriteHeight_walk / 2);
    pop();
  }
}

// // 禁用右鍵選單，這樣在畫布上按右鍵才不會跳出瀏覽器的選單 (已改為鍵盤控制，此行可選)
// document.oncontextmenu = function() {
//   return false;
// }

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 監聽鍵盤按下事件 (只觸發一次)
function keyPressed() {
  // 如果按下向上鍵且角色不在跳躍中
  if (keyCode === UP_ARROW && !isJumping && !isAttacking) {
    isJumping = true; // 開始跳躍
    velocityY = jumpForce; // 給予向上的初始力量
  }

  // 如果按下空白鍵且角色不在跳躍或攻擊中
  if (keyCode === 32 && !isJumping && !isAttacking) { // 32 是空白鍵的 keycode
    isAttacking = true;
    attackFrameCount = 0; // 重置攻擊動畫計數器
  }
}

// 建立一個新的投射物
function createProjectile() {
  let projectile = {
    x: characterX,
    y: characterY,
    direction: characterDirection,
    speed: characterSpeed * 2, // 投射物速度是角色兩倍
    frameCount: 0,
    active: true
  };
  projectiles.push(projectile);
}

// 更新和繪製所有投射物
function handleProjectiles() {
  // 從後往前遍歷陣列，這樣刪除元素時才不會出錯
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];

    // 更新位置
    p.x += p.speed * p.direction;

    // --- 碰撞偵測 (只有在角色2還沒被擊中時才進行) ---
    if (!isNewCharHit) {
      // 建立一個簡易的碰撞偵測，檢查投射物是否進入角色2的身體範圍
      let hit = (p.x > newCharX - frameWidth_newChar / 2) && (p.x < newCharX + frameWidth_newChar / 2);
      if (hit) {
        isNewCharHit = true; // 觸發角色2的被擊中狀態
        nameInput.hide(); // 隱藏可能存在的輸入框
        dialogueState = 0; // 結束對話
        isNewCharLaughing = false; // 停止笑
        newCharHitFrameCount = 0; // 重置倒下動畫的計數器
        projectiles.splice(i, 1); // 移除這個投射物
        continue; // 繼續下一個迴圈，因為當前投射物已被移除
      }
    }

    // 如果投射物飛出畫面，也將其移除
    if (p.x > width || p.x < 0) {
      projectiles.splice(i, 1);
      continue;
    }

    // 繪製投射物
    let frameIndex = floor(p.frameCount) % numFrames_attack2;
    push();
    translate(p.x, p.y);
    scale(p.direction, 1);
    image(animation_attack2[frameIndex], -frameWidth_attack2 / 2, -spriteHeight_attack2 / 2);
    pop();

    // 更新動畫幀
    p.frameCount += animationSpeed * 1.5;

    // 如果動畫播放完畢，則標記為非活動，下次迴圈將其移除
    if (p.frameCount >= numFrames_attack2) {
      projectiles.splice(i, 1); // 直接從陣列中移除
    }
  }
}

// 當玩家在輸入框按下Enter後觸發
function handleNameSubmit() {
  playerName = nameInput.value(); // 獲取輸入框的內容
  dialogueState = 2; // 切換到歡迎狀態
  nameInput.value(''); // 清空輸入框
}
