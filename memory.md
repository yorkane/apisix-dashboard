# APISIX Dashboard 架构总结与代码指南 (Memory)

## 项目概述
本仓库 (`apisix-dashboard`) 是 Apache APISIX 的控制面板。该项目采用前后端分离架构，主要包括前端界面 (`web`) 和后端管理服务 (`manager-api`，存放于 `api` 目录)。
近期项目经过了精简，移除了原 Apache 软件基金会的开源治理文件，重构了构建配置，并引入了 Github Actions 实现向 GHCR (Github Container Registry) 的自动发布。

## 目录结构
- `/api/`: 后端 Go 服务 (manager-api)。
- `/web/`: 前端 React 项目。
- `/Dockerfile`: 统一的多阶段构建配置文件。
- `/.github/workflows/docker-build.yml`: 自动化构建与发布的 Github Actions 工作流。

## 技术栈与架构说明

### 1. 后端 (`/api/`)
- **语言/版本**: Go 1.19
- **核心框架**: Gin (`github.com/gin-gonic/gin`) - 负责 HTTP 路由和请求处理。
- **存储与配置中心**: etcd (`go.etcd.io/etcd/client/v3`) - 后端不使用关系型数据库，而是直接与 APISIX 共享底层 `etcd` 存储引擎，实现配置的下发和同步。
- **依赖库**: 
  - `shiningrush/droplet`: 用于接口请求与响应的统一包装。
  - `spf13/viper` & `spf13/cobra`: 配置文件解析及 CLI 命令行驱动。
  - `uber-go/zap`: 高性能日志组件。
- **架构流转**: 
  - 编译入口: `api/build.sh` 和 `api/cmd/`。
  - 核心业务逻辑存放在 `api/internal/` 目录，分为 `core` (核心引擎), `handler` (路由控制层), `service` (业务逻辑), `filter` (拦截器) 等模块。

### 2. 前端 (`/web/`)
- **语言**: React + TypeScript + Less
- **框架体系**: UmiJS v3 (`umi`)
- **UI 组件库**: Ant Design v4 (`antd`) 以及高级组件库 ProComponents (`@ant-design/pro-layout`, `@ant-design/pro-table`)。
- **代码规范**: ESLint, Stylelint, Prettier。
- **包管理器**: Yarn
- **架构流转**: 
  - 前端路由及数据流由 Umi 框架接管。
  - 主要页面和通用组件集中在 `src/pages` 和 `src/components`。
  - 通过 Umi 的请求库向后端 (manager-api) 发起 RESTful 请求，进行 APISIX 路由、上游、插件等实体的可视化管理。

## CI/CD 与容器化部署 (GHCR)
- 项目采用 **Github Actions** 作为 CI/CD 引擎，监听 `master` 分支的提交。
- 工作流文件位于 `.github/workflows/docker-build.yml`。
- **构建策略 (Dockerfile)**:
  1. `api-builder`: 基于 `golang:1.19` 编译 Go 后端。
  2. `fe-builder`: 基于 `node:16-alpine` 安装依赖并构建前端静态资源。
  3. 最终产物：基于轻量级的 `alpine:latest`，将后端二进制文件和前端静态资源汇总。启动命令为执行 `./manager-api`，默认暴露端口 `9000`。
- **镜像发布**: 构建完成后，容器镜像将被自动打上 `latest` 标签，并推送到 `ghcr.io/yorkane/apisix-admin:latest`。

## AI Agent 后续开发指北
为了保持代码的稳定性与一致性，后续接手的 Agent 需遵循以下准则：

1. **后端开发**:
   - 所有的 API 接口修改必须在 `/api/internal/` 下寻找对应的 `handler`。
   - 数据结构的增删改查必须通过 `etcd` 客户端进行，不要尝试引入 MySQL 等关系型数据库。
   - 遵循 `droplet` 的 Request/Response 结构封装接口。

2. **前端开发**:
   - 页面样式优先使用 `antd` 和 `ProComponents` 提供的内置组件和 tokens，少写原生 CSS/Less。
   - 保证 TypeScript 的类型安全，新增组件尽量提供类型定义。

3. **基础设施变更**:
   - 如果需要修改镜像内容（如安装新的系统级命令），请在 `/Dockerfile` 中的最后一个 `prod` 阶段使用 `apk add --no-cache`。
   - **全局约束（USER RULE）**: 任何涉及到系统设计、使用方式、或配置环境变量的变更，都**必须同步更新**根目录的 `README.md`。

---
*Document created for Context Memory.*
