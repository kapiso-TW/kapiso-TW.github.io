const publicHash = "2f1987bf98c09d2f5d2a23a6ae29fa53b9aec8f07ed1330bd439122f5a1a2c2c"; // 示例哈希
const reusableHash = "a7a39b72f29718e653e73503210fbb597057b7a1c77d1fe321a1afcff041d4e1"; // 示例哈希
const numStars = 100;
const stars = [];
let speedMultiplier = 1;
let animationStarted = false; // 控制动画是否开始的标志

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.getElementById("unlock-button").addEventListener("click", async () => {
    const passwordInput = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    const hashedPassword = await hashPassword(passwordInput);

    if (hashedPassword === reusableHash || hashedPassword === publicHash) {
        $(".lock, .stars").fadeOut(400, async function() {
            document.getElementById("lock-screen").classList.remove("active");
            animationStarted = true; // 开始动画
            startAnimation(); // 启动星星动画
            await delay(2300); // 延迟2秒
            $("#content").fadeIn(400); // 显示内容
        });
    } else {
        errorMessage.style.display = "block"; // 显示错误信息
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMeteor() {
    const meteor = document.createElement('div');
    meteor.classList.add('meteor');
    meteor.style.left = `${Math.random() * window.innerWidth}px`;
    meteor.style.top = `${Math.random() * window.innerHeight / 2}px`;
    meteor.style.animationDelay = `${Math.random() * 5}s`;
    document.body.appendChild(meteor);

    setTimeout(() => {
        meteor.remove();
    }, 3000);
}

setInterval(createMeteor, 500);

function createStar() {
    if (!animationStarted) return; // 如果动画未开始，返回
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = star.style.height = Math.random() * 3 + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(star);
    stars.push(star);
}

function startAnimation() {
    let starCount = 0;
    const starInterval = setInterval(() => {
        if (starCount < numStars) {
            createStar();
            starCount++;
        } else {
            clearInterval(starInterval);
            animateStars();
        }
    }, 10);
}

function animateStars() {
    stars.forEach(star => {
        star.style.transition = 'opacity 1s';
        star.style.opacity = 1;
    });

    function moveStars() {
        stars.forEach(star => {
            let speed = (Math.random() * 2 + 1) * speedMultiplier;
            let x = parseFloat(star.style.left);
            let y = parseFloat(star.style.top);

            x += (x - window.innerWidth / 2) * speed / 100;
            y += (y - window.innerHeight / 2) * speed / 100;

            if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
                star.style.top = Math.random() * window.innerHeight + 'px';
                star.style.left = Math.random() * window.innerWidth + 'px';
            } else {
                star.style.left = x + 'px';
                star.style.top = y + 'px';
            }
        });

        speedMultiplier *= 1.03; // 逐渐加快速度

        if (speedMultiplier < 25) {
            requestAnimationFrame(moveStars);
        } else {
            document.body.style.transition = 'background-color 0.2s';
            document.body.style.backgroundColor = '#e3e3e3';
            setTimeout(() => {
                document.body.style.transition = 'background-color 0.5s';
                document.body.style.backgroundColor = 'black';
                clearStars(); // 清除星星
            }, 200); // 缩短白色闪现的时间
        }
    }

    moveStars();
}

function clearStars() {
    stars.forEach(star => star.remove());
}

// 初始化时将内容隐藏
document.getElementById("content").style.display = "none"; // 确保内容最初是隐藏的
