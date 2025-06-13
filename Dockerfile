# 使用官方nginx镜像作为基础
FROM nginx:alpine

# 复制构建好的前端文件到nginx目录
COPY dist/ /usr/share/nginx/html/

# 复制自定义nginx配置
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露7777端口
EXPOSE 10888

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
