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
                        <p>
                            也沒為什麼，單純無聊的時候慢慢寫出來的小小 Blog，因為也沒有人會聽我五四三我的經歷，所以想說寫成一個網站在裡面自嗨 (?，或許之後自我介紹只需要給這個網站就好了 :>。
                        </p>
                    </div>
                    <div>
                        <h2>關於我</h2>
                        <p>
                            嗨嗨嗨嗨嗨，我是 Hong ，一個就讀於彰化高中的高三生，對於資訊領域有很大的興趣。
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
            content.innerHTML = `
            <div class="TaiwanHolyYoung illustrate-div">
                <h3 class="illustrate-text"><span style="color:#1F2833">123</span>
                    你該不會期待我會說什麼有趣的心得吧，想太多了 :DD，我甚至連照片都找不到，還差一點拿不到證書...(主辦方的疏失 = =
                </h3>

                <h3><span style="color:#1F2833">123</span>
                    我參加完只覺得我太菜了，老師上課講什麼 ISO 證照，說什麼那只是去英文閱讀測驗，完全聽不懂，上課教了 windows 古老漏洞「永恆之藍」的應用操作，確實是很好玩，能夠親手把病毒放到自己的電腦裡面看著他把系統炸掉誰不覺得好玩??
                </h3>

                <h3 class="illustrate-text"><span style="color:#1F2833">123</span>
                    還是有學到許多拉，畢竟都參加了，不學一點東西的話總感覺哪裡怪怪的 :>，阿要說學到什麼可能就是怎麼把電腦炸掉吧 (XXX ，還有一些 SQL injection 的操作以及相關證照的知識，如果沒有參加這個營隊我可能都不知道原來還有這麼多相關證照可以考取，也相當的貴 ><。
                </h3>
            </div>
            `;
            history.pushState({ page: 1 }, "New Page", `/archive?id=1`);
        } else if (id && id === '2') {
            content.innerHTML = `
            <div class="chsh illustrate-div">
                <img alt="志工照片" src="/icon/cheer.JPG" style="max-width:95%; display:block; margin:auto; padding:10px 0 0 0;"></img>
                <h3><span style="color:#1F2833">123</span>
                    很高興能在我高二時回到學校擔任新生始業輔導志工(以下簡稱蚯蚓)，帶領學弟們融入我們，過程很有趣也有很多不為人知的辛苦前置作業。
                </h3>
                <h3><span style="color:#1F2833">123</span>
                    我們新訓前一天就在學校裡面度過了一天，不只練習了今年專屬得舞步，也在學習如何更好的帶領一個團隊，同時當晚也住在學校內待命了。
                </h3>
                <h3><span style="color:#1F2833">123</span>
                    我這次擔任蚯蚓不僅僅是為了帶領新生而已，更是為了彌補我自己還是新生時因為班上剛好有人確診而被迫全班回家，導致我沒有看到新生專屬的營火晚會、火鳥以及火舞表演，也是高中生活中的唯一一個機會能夠看到如此壯觀的活動在學校內舉辦。
                </h3>
                <img alt="營火照片" src="/icon/campfire.JPG" style="max-width:95%; display:block; margin:auto;"></img>
                <h3><span style="color:#1F2833">123</span>
                    很開心能夠和一群新生代們開心的過了完整的兩天，或許我們的帶領能力不是一流的，但還是很感謝你們的配合，不是你們的配合整個活動也不會如此順利。
                </h3>
                <img alt="噴火照片" src="/icon/fire.JPG" style="max-width:95%; display:block; margin:auto;"></img>
                <h3><span style="color:#1F2833">123</span>
                    在擔任蚯蚓的過程中，我不僅學到了透過簡潔明瞭的肯定句能夠更加有效的帶領一群人，避免了許多的誤解，我也讓自己在面對群眾時能夠更加自信的展現自己，畢竟每個人都會有屬於自己的第一次，不必過度緊張，適度的對自己更加自信能夠增加自己的穩定性。
                </h3>
                <img alt="歡慶結束照片" src="/icon/cheer.jpeg" style="max-width:95%; display:block; margin:auto;"></img>
            </div>
            `;
            history.pushState({ page: 1 }, "New Page", `/archive?id=2`);
        } else {
            content.innerHTML = `
            <div class="timeline">
                    <div class="timeline-item">
                        <div class="year">2024</div>
                        <div class="line"></div>
                        <div class="months">
                            <div class="month" data-month="1"></div>
                            <div class="month" data-month="2"></div>
                            <div class="month" data-month="3"></div>
                            <div class="month" data-month="4"></div>
                            <div class="month" data-month="5"></div>
                            <p class="event">
                                TaiwanHolyYoung Training CTF
                            </p>
                            <div class="month" data-month="6"></div>
                            <div class="month" data-month="7"></div>
                            <div class="month" data-month="8"></div>
                            <p class="event">
                                新生始業輔導志工
                            </p>
                            <div class="month" data-month="9"></div>
                            <div class="month" data-month="10"></div>
                            <div class="month" data-month="11"></div>
                            <div class="month" data-month="12"></div>
                        </div>
                    </div>
                </div>
            `;
            history.pushState({ page: 1 }, "New Page", "/archive");
            ;
        }

    } else if (pathname === '/') {
        content.innerHTML = `
            <div class="pp">
                <a onclick="navigateTo('/archive?id=1')">
                    <div style="display: flex;">
                    <div>
                        <img src="/icon/ISIP_LOGO_80-99.png" class="logo" alt="教育部資訊安全人才培育計畫 Logo" srcset="https://isip.moe.edu.tw/wordpress/wp-content/uploads/2019/01/ISIP_LOGO_160-198.png 2x">
                    </div>
                    <div style="max-width:100%;">
                        <h1 class="logo-text">TaiwanHolyYoung Training CTF</h1>
                    </div>
                    </div>
                    <hr style="width:90%; border: 2px solid #C5C6C7; border-radius: 50%;">
                    <p class="logo-inline">看到簡章蠻有趣的就去參加的小營隊</p>
                    <p>Data : 2024/05/18<span style="color:#1F2833">123</span></p>
                </a>
            </div>
            <div class="pp">
                <a onclick="navigateTo('/archive?id=2')">
                    <div style="display: flex;">
                    <div>
                        <img alt="chsh logo"  src="/icon/CHSH_Logo.png" style="height:60px; width:60px; padding:0 10px 0 0;">
                    </div>
                    <div style="max-width:100%;">
                        <h1 class="logo-text">新生始業輔導志工</h1>
                    </div>
                    </div>
                    <hr style="width:90%; border: 2px solid #C5C6C7; border-radius: 50%;">
                    <p class="logo-inline">彰化高中蚯蚓</p>
                    <p>Data : 2023/08/25<span style="color:#1F2833">123</span></p>
                </a>
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
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');

    let id = null;
    if (redirectUrl) {
        const match = redirectUrl.match(/id=(\d+)/); // 用正則表達式解析 `id`
        id = match ? match[1] : null;
        console.log(redirectUrl + "  " + id);
        navigateTo(redirectUrl);
    } else {
        console.log('No redirected path');
        navigateTo('/');
    }
});