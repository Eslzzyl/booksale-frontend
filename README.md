## booksale-frontend

数据库课程设计 网上书城项目 前端

###

技术：Vue 3 + View UI Plus

这是合肥工业大学2023《数据库系统课程设计》项目的前端部分。后端部分在[这里](https://github.com/katsss188/BookSellerSystem)。

这个项目是仓促写完的，Vue属于速成，因此不建议作为参考。

## 使用

在使用之前，确保你安装了 [Node.js](https://nodejs.org/) 18 LTS 或者更新的版本。推荐使用的包管理器是 [pnpm](https://www.pnpm.cn/)。

首先clone仓库

```bash
git clone https://github.com/Eslzzyl/booksale-frontend.git
```

然后执行

```bash
cd booksale-frontend
pnpm install
pnpm dev
```

启动项目。开发版项目将默认运行在 localhost 的5173端口。后端地址是 `localhost:8888`。

## 服务端部署

简单介绍一下如何将本项目（前端+后端）部署到云服务器。前端和后端可以分离，即部署到不同的服务器。当然，你也可以将前后端部署到同一台服务器。但一定要清楚，前端的代码实际上是在访问者的浏览器上运行的，而不是在服务器上运行的。

### 软件准备

- 服务器中应该预先装好 Nginx 并配置好防火墙规则。在下面介绍的反向代理式部署中，只需要开放 HTTP/HTTPS 的端口即可，无需开放其他特殊端口。
- 为了运行后端程序，需要安装Java 17，在Ubuntu中的包名是`openjdk-17-jre-headless`，当然`openjdk-17-jdk-headless`也是可以的。
- 数据库使用MySQL，需要安装`mysql-server`并配置好一个具有相应权限的用户。
  - 在使用`systemd`的系统中，可以使用`sudo systemctl status mysql`来查询 MySQL 的运行状态。你应该能看到类似`active(running)`的文字。
- 服务器**无需**安装 Node.js。前端代码在本地打包好之后上传。

### 构建

#### 前端

1. 首先确定后端的请求URL。在下面的例子中，使用`https://example.com/db/api/`作为例子。如果服务器不支持 HTTPS 访问，则需使用 HTTP。
2. 修改前端项目的`axiosInstance.js`文件，将`baseURL`改为后端的请求URL，如`https://example.com/db/api/`。
3. 在前端的项目目录中，使用
    ```bash
    pnpm run build
    ```
    进行构建。构建之后会在项目目录中生成一个`dist`文件夹。

#### 后端

将项目打包位为一个`jar`，同时将数据库导出成SQL文件。具体细节我也不是很清楚，因为后端不是我做的。

### 部署文件

#### 前端

前端可以部署到云服务器，或者任何其他的在线托管平台。以云服务器为例，使用 FileZilla 之类的工具将上一步构建产生的`dist`文件夹整体上传到服务器，假设文件夹的位置是`/home/eslzzyl/workspace/dist`。

编辑 `/etc/nginx/nginx.conf` 文件，在`http`的`server`块中添加一个`location`：
```
location /db {
    alias /home/eslzzyl/workspace/dist/;
    index index.html;
    try_files $uri $uri/ ./index.html;
}
```
然后执行
```bash
sudo nginx -s reload
```
假设前端部署的服务器是`example2.com`，那么你现在可以通过`https://example2.com/db/`来访问前端了。

#### 后端

将打包好的`jar`和SQL文件上传到服务器，位置可以随意选择。手动建立数据库，然后通过SQL文件将表及其他数据库对象导入数据库。然后使用`java -jar xxx.jar`命令运行后端。为了确保用户断开 SSH 连接后，后端仍能保持运行，可以使用`screen`或者`tmux`之类的工具。在下面的说明中，使用`localhost:8888`作为后端的监听地址。

### 配置反向代理

这一步实际上就是将前端对目标服务器的请求（`https://example.com/db/api/`）转发到服务器内网的 `8888` 端口。

编辑 `/etc/nginx/nginx.conf` 文件，在`http`的`server`块中添加一个`location`：
```
location /db/api {
    proxy_ssl_server_name on;
    rewrite ^/db/api(.*)$ $1 break;
    proxy_pass http://127.0.0.1:8888;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
然后执行
```bash
sudo nginx -s reload
```
如果一切正常的话，现在你可以在前端正常访问后端服务了。