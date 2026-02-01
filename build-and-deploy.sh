#!/bin/bash

set -e

echo "🔨 开始本地构建..."
echo "   使用 8GB 内存限制"

# 清理旧的构建产物
echo "🧹 清理旧文件..."
rm -rf vuepress-hope/.vuepress/.temp
rm -rf vuepress-hope/.vuepress/dist

# 本地构建（使用足够的内存）
echo "📦 正在构建项目..."
NODE_OPTIONS=--max-old-space-size=8192 pnpm build

echo ""
echo "✅ 构建成功！"
echo ""

# 提交并推送
read -p "📤 是否推送到 EdgeOne? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "正在提交并推送..."

    # 添加构建产物和配置文件
    git add edgeone.json
    git add vuepress-hope/.vuepress/dist
    git add .gitignore

    # 提交
    git commit -m "chore: 更新构建产物 $(date '+%Y-%m-%d %H:%M:%S')

    # 推送
    git push

    echo ""
    echo "🚀 部署完成！"
    echo "   EdgeOne 将自动检测 edgeone.json 配置"
    echo "   并直接使用预构建的静态文件，无需在云端构建"
else
    echo ""
    echo "⏸️  构建完成，但未推送到远程"
    echo "💡 手动推送命令:"
    echo "   git add edgeone.json vuepress-hope/.vuepress/dist .gitignore"
    echo "   git commit -m 'chore: 更新构建产物'"
    echo "   git push"
fi