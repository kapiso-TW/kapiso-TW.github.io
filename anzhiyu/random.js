var posts=["2026/02/21/THJCC_CTF_2026/","2026/01/11/picoCTF/","2023/10/22/snail/","2026/02/09/zero_judge/","2024/02/24/japan/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };