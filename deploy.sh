#!/bin/bash

set -e

echo "📤 EdgeOne Pages 云端构建部署"
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改"
    git status --short
    echo ""
    read -p "是否先提交更改? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "请输入提交信息: " commit_msg
        git add .
        git commit -m "$commit_msg"
    fi
fi

echo "🚀 推送到 GitHub..."
echo ""
echo "✅ EdgeOne Pages 将自动:"
echo "   1. 检测到推送"
echo "   2. 在云端执行 pnpm install"
echo "   3. 在云端执行 pnpm build"
echo "   4. 自动部署到 CDN"
echo ""
read -p "继续推送? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push
    echo ""
    echo "🎉 推送成功！"
    echo "   访问 https://guide.weilanx.com 查看更新"
    echo "   部署进度可在 EdgeOne 控制台查看"
else
    echo "已取消"
fi
