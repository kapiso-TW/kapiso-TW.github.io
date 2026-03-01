var posts=["2024/02/24/japan/","2026/01/11/picoCTF/","2026/02/09/zero_judge/","2023/10/22/snail/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };