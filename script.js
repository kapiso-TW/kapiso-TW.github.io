function navigateTo(url) {
    // 更新網址
    window.history.pushState({}, '', url);

    // 更新頁面內容（模擬路由切換）
    const content = document.getElementById('content');
    if (url === '/about') {
        content.innerHTML = `
            <h1>關於我們</h1>
            <button onclick="navigateTo('/')">返回首頁</button>
        `;
        history.pushState({page: 1}, "New Page", "/about");
    } else if(url === '/archive') {
        content.innerHTML = `
            <h1>首頁</h1>
            <button onclick="navigateTo('/about')">跳轉到關於我們</button>
        `;
        history.pushState({page: 1}, "New Page", "/archive");
    } else if(url === '..'){
        content.innerHTML = `
            <div class="pp">
                    <p>test1------------------------------------------------------------------------------------ </p>
                </div>

                <div class="pp">
                    <p>test2</p>
                </div>

                <div class="pp">
                    <p>test3</p>
                </div class="pp">

                <div class="pp">
                    <p>test4</p>
                </div class="pp">

                <div class="pp">
                    <p>test5</p>
                </div>
        `;
        history.pushState({page: 1}, "New Page", "/");
    }
}

// 處理瀏覽器的回退事件
window.onpopstate = function () {
    navigateTo(window.location.pathname);
};