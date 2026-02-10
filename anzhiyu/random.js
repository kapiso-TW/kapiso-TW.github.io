var posts=["2023/10/22/snail/","2024/02/24/japan/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };