# Auto Test Hub 部署指南

## 1. 镜像导入
```bash
docker load -i auto-test-hub-2.0.tar
```

## 2. 多环境部署
```bash
docker build --no-cache -t auto-test-web:2.2 .
```
### 生产环境部署
```bash
docker-compose up -d web
```
### 构建前端版本
```bash
npm run build
```

### 开发环境部署
```bash
docker-compose up -d web-dev
```

### 测试环境部署
```bash
docker-compose up -d web-test
```

## 3. 环境变量配置

可以通过修改docker-compose.yml中的`environment`部分来配置不同环境:
```yaml
environment:
  - NODE_ENV=production  # 可选: production/development/testing
  - DB_HOST=your_db_host
  - DB_PORT=3306
```

## 4. 常用命令

- 启动服务: `docker-compose up -d [service_name]`
- 停止服务: `docker-compose stop [service_name]`
- 查看日志: `docker-compose logs -f [service_name]`
- 删除服务: `docker-compose down [service_name]`
