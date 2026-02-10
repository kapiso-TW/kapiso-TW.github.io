var posts=["2024/02/24/japan/","2023/10/22/snail/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };