function navigateTo(url) {
    window.history.pushState({}, '', url);

    const content = document.getElementById('content');
    if (url === '/about') {
        content.innerHTML = `
            <p>about</p>
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
                    <p>test1---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- </p>
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
        history.pushState({ page: 1 }, "New Page", "/");
    }
}

window.onpopstate = function () {
    navigateTo(window.location.pathname);
};

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedPath = urlParams.get('redirect'); 
    console.log(redirectedPath);
    navigateTo(redirectedPath);
});
