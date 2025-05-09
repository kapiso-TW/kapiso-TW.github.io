const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let stfi = 0;

// 自適應螢幕大小
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置 transform
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Firework {
  constructor(startX, targetY, color) {
    this.x = startX;
    this.y = window.innerHeight;
    this.targetY = targetY;
    this.color = color;
    this.speedY = Math.random()*(-8)-14;
    this.exploded = false;
    this.particles = [];
    this.trail = [];
  }

  update() {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 10) this.trail.shift();

      this.y += this.speedY;
      this.speedY += 0.4; // 重力稍微小一點（比較自然）

      if (this.speedY >= 0) {
        this.explode();
      }
    } else {
      this.particles.forEach((p, index) => {
        p.update();
        if (p.alpha <= 0) {
          this.particles.splice(index, 1);
        }
      });
    }
  }


  draw(ctx) {
    if (!this.exploded) {
      // 畫尾焰
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
      ctx.restore();

      // 畫飛行中的火花
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      this.particles.forEach(p => p.draw(ctx));
    }
  }

  explode() {
    this.exploded = true;
    const colors = ['#ff3f81', '#ffdd00', '#00cfff', '#9d00ff', '#ff6600'];
    for (let i = 0; i < 100; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(this.x, this.y, color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = Math.random() * 6 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.size = Math.random() * 2 + 1;
    this.alpha = 1;
    this.gravity = 0.05;
    this.friction = 0.98;
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.01;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const fireworks = [];

function launchFirework(x) {
  const targetY = Math.random() * (window.innerHeight / 2);
  const color = '#ffffff'; // 發射時白色尾焰
  fireworks.push(new Firework(x, targetY, color));
}

function animate() {  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);


  fireworks.forEach((fw, index) => {
    fw.update();
    fw.draw(ctx);
    if (fw.exploded && fw.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });
  requestAnimationFrame(animate);
}

// 觸控與點擊支援
function handleLaunch(event) {
  let x;
  if (event.type.startsWith('touch')) {
    x = event.touches[0].clientX;
  } else {
    x = event.clientX;
  }
  launchFirework(x);
}

canvas.addEventListener('click', handleLaunch);
canvas.addEventListener('touchstart', handleLaunch);

window.addEventListener('load', () => {
    setInterval(() => {
      if(stfi==1){
        launchFirework(Math.random() * window.innerWidth);
      }
    }, 1500); // 每1.5秒放一個煙火
});

animate();

function cube() {
  const cc = document.getElementById('cube');
  const ca = document.getElementById('card')
  
  // 觸發動畫
  cc.style.pointerEvents = 'none';
  cc.style.transform = 'scale(100)';
  cc.style.opacity = '0';

  // 動畫完成後隱藏
  setTimeout(() => {
    stfi = 1;
    ca.style.opacity = '1';  // 顯示卡片，設定為可見
    ca.style.visibility = 'visible';  // 顯示卡片
    cc.style.display = 'none';
  }, 1000);
}

function reco(wh){
  if(wh=='dc'){
    window.location.href = 'https://discord.com/users/678225775648047114';
  }else if(wh=='ig'){
    window.location.href = 'https://www.instagram.com/numb_kapiso?igsh=YTQ1dW5jNWZ0bXN0&utm_source=qr';
  }else{
    location=location;
  }
}
