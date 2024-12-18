function navigateTo(url) {
    // 更新網址
    window.history.pushState({}, '', url);

    // 更新頁面內容（模擬路由切換）
    const content = document.getElementById('content');
    if (url === '/about') {
        content.innerHTML = `
            <p>about</p>
        `;
        history.pushState({page: 1}, "New Page", "/about");
    } else if(url === '/archive') {
        content.innerHTML = `
            <p>archive</p>
        `;
        history.pushState({page: 1}, "New Page", "/archive");
    } else if(url === '/'){
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

window.addEventListener("DOMContentLoaded", () => {
    // 解析原始路徑
    const originalPath = new URLSearchParams(window.location.search).get('/');
    navigateTo(originalPath);
    if (pathname.startsWith('/?')) {
        const newPath = pathname.substring(2)
    }
  });
  