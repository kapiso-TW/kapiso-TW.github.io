function navigateTo(url) {
    window.history.pushState({}, '', url);

    const content = document.getElementById('content');
    content.innerHTML = `
        <br><br><br>
        <div class="loader container">loading...</div>
    `;

    // 取得路徑部分與 query string
    const pathname = window.location.pathname; // 例如 "/about"
    const queryString = window.location.search;  // 例如 "?id=1"
    const params = new URLSearchParams(queryString);
    const id = params.get('id'); // 取得 id 的值

    if (pathname === '/about') {
        content.innerHTML = `
            <div class="about">
                <div class="about-text">
                    <h1>About</h1>
                    <div>
                        <h2>為什麼會弄這個網站</h2>
                        <p style="color: #bcb9b9;">
                            也沒為什麼，單純無聊的時候慢慢寫出來的 Blog，
                            或許之後自我介紹只需要給這個網站就好了 :>
                        </p>
                    </div>
                    <div>
                        <h2>關於我</h2>
                        <p style="color: #bcb9b9;">
                            嗨嗨嗨嗨嗨，我是 kapiso ，一個就讀於彰化高中的
                            高三生，對於資訊領域有很大的興趣。
                        </p>
                    </div>
                    <div>
                        <h2>活動參與</h2>
                        <li>SecurityFocus Online 2023</li>
                        <li>TAIWAN HolyYoung Training</li>
                        <li>Happy Hacking Day</li>
                    </div>
                    <div>
                        <h2>競賽</h2>
                        <li>第四屆中學生黑克松海選入圍</li>
                        <li>Still efforting...</li>
                    </div>
                    <div>
                        <h2>證照</h2>
                        <li>APCS 4/3</li>
                        <li>Still efforting...</li>
                    </div>
                    <div>
                        <h2>其他</h2>
                        <li>112學年度彰化高中始業輔導蚯蚓</li>
                        <li>CHSH TKD-3rd 教學</li>
                    </div>
                    <br>
                </div>
            </div>
        `;
        history.pushState({ page: 1 }, "New Page", "/about");
    } else if (pathname === '/archive') {
        if (id && id === '1') {
            content.innerHTML = `<p>TEST</p>`;
            history.pushState({ page: 1 }, "New Page", `/archive${queryString}`);
        } else {
            content.innerHTML = `
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5wjg6GlIFDuM3pNw5dEKwN?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            <p>聽聽音樂等我開發吧 >.< </p>`
            history.pushState({ page: 1 }, "New Page", "/archive");
        ;
        }
        
    } else if (pathname === '/') {
        content.innerHTML = `
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5wjg6GlIFDuM3pNw5dEKwN?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            <p>聽聽音樂等我開發吧 >.< </p>
            <div class="pp">
                <a onclick="navigateTo('/archive?id=1')">abc</a>
            </div>
        `;
        history.pushState({ page: 1 }, "New Page", "/");
    } else {
        location.href = 'https://kapiso-tw.github.io/';
    }
    document.getElementById("hamburger-toggle").checked = false;
}

window.onpopstate = function () {
    navigateTo(window.location.pathname + window.location.search);
};

window.addEventListener("DOMContentLoaded", () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const redirectUrl = params.get("redirect");
    const id = redirectUrl.get('id');
    console.log(redirectUrl + "  " + id);
    if (redirectUrl && redirectUrl != '') {
        navigateTo(redirectUrl);
    } else {
        console.log('No redirected path');
        navigateTo('/');
    }
});

