function navigateTo(url) {
    window.history.pushState({}, '', url);

    const content = document.getElementById('content');
    content.innerHTML = `
        <br><br><br>
        <div class="loader container">loading...</div>
`;
    if (url === '/about') {
        content.innerHTML = `
            <div class="about">
                    <div class="about-text">
                        <h1>About</h1>

                        <div>
                            <h2>為什麼會弄這個網站</h2>
                            <p style="color: #bcb9b9;">
                                也沒為什麼，單純無聊的時候慢慢寫出來的
                                Blog，或許之後自我介紹只需要給這個網站就好了 :>
                            </p>
                        </div>

                        <div>
                            <h2>關於我</h2>
                            <p style="color: #bcb9b9;">
                                嗨嗨嗨嗨嗨，我是 kapiso ，一個就讀於彰化高中的
                                高三牲，對於資訊領域有很大的興趣。
                            </p>
                        </div>

                        <div>
                            <h2>活動參與</h2>
                            <li>SecurityFocus Online 2023</li>
                            <li>TAIWAN HolyYoung Training</li>
                            <li>Happy Hacking Day</li>
                            <li></li>
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
                            <li></li>
                        </div>

                    </div>
                </div>
        `;
        history.pushState({ page: 1 }, "New Page", "/about");
    } else if (url === '/archive') {
        content.innerHTML = `
            <p>archive</p>
        `;
        history.pushState({ page: 1 }, "New Page", "/archive");
    } else if (url === '/') {
        content.innerHTML = `
            <div class="pp">
                    <a >

                    </a>
                </div>

                <div class="pp">
                    <p>Devloping...</p>
                </div>

                <div class="pp">
                    <p>Devloping...</p>
                </div class="pp">

                <div class="pp">
                    <p>Devloping...</p>
                </div class="pp">

                <div class="pp">
                    <p>Devloping...</p>
                </div>
        `;
        history.pushState({ page: 1 }, "New Page", "/");
    } else{
        location.href = 'https://kapiso-tw.github.io/';
    }
    document.getElementById("hamburger-toggle").checked = false;
}

window.onpopstate = function () {
    navigateTo(window.location.pathname);
};

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedPath = urlParams.get('redirect');
    if (redirectedPath && redirectedPath.trim() !== '') {
        console.log(redirectedPath);
        navigateTo(redirectedPath);
    } else {
        console.log('No redirected path');
        navigateTo('/')
    }

});
