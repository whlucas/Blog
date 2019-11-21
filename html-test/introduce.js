// npm install http-server -g
// 然后把最后一个路劲加到环境变量中去
// http-server -p 8001 起这个服务


// nginx 
// 安装nginx 进入压缩后的目录
// start nginx
// C:\Users\Administrator\Desktop\nginx-1.16.1\conf\nginx.conf 修改这个文件

// 更改配置

// 这三行注释
// #location / {
//     #root html;
//     #index index.html index.htm;
// #}

// 如果匹配到了/ 那么代理到8001
// location / {
//     proxy_pass: http://localhost:8001;
// }

// 如果匹配到了/api/就代理到8000，并且把host传过去
// location /api/ {
//     proxy_pass: http://localhost:8000;
//         proxy_set_header Host $host;
// }