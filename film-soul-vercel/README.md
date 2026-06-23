# 寻找你的影视原型

一个可部署到 Vercel 的影视人格测试 H5。

## 功能
- 36题 × 4选项
- 24个影视人格原型
- 长篇结果页
- Canvas 电影海报生成
- 邀请码分享
- 数据统计后台 `/admin`
- Vercel KV 统计存储，可选；未配置时前端仍可运行

## 本地运行
```bash
npm install
npm run dev
```

## 部署到 Vercel
1. 把整个项目上传到 GitHub
2. 在 Vercel 导入仓库
3. 点击 Deploy
4. 访问首页即可测试
5. 访问 `/admin` 查看统计

## 开启云端统计
在 Vercel 项目里添加 Vercel KV 数据库，自动生成 KV 环境变量后重新部署。

## AI 长文结果
当前项目内置“模板化 AI 风格长文生成”，无需 API Key。
如果之后要接入真正的大模型，可以替换 `app/api/result/route.ts` 里的生成逻辑。
