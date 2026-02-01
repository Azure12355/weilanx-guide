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

# 询问是否部署
read -p "📤 是否部署到 EdgeOne? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 正在部署到 EdgeOne..."

    # 使用 EdgeOne CLI 部署
    # 注意: 需要先安装 edgeone-cli: pnpm add -D edgeone-cli
    # 并配置好环境变量或 .env 文件
    if command -v edgeone &> /dev/null; then
        edgeone deploy vuepress-hope/.vuepress/dist
    else
        echo "❌ 未找到 edgeone-cli"
        echo "💡 请安装: pnpm add -D edgeone-cli"
        echo "   或使用: npm install -g edgeone-cli"
        exit 1
    fi

    echo ""
    echo "🎉 部署完成！"
    echo "   访问 https://guide.weilanx.com 查看更新"
else
    echo ""
    echo "⏸️  构建完成，但未部署"
    echo "💡 本地预览命令:"
    echo "   pnpm serve"
    echo ""
    echo "📤 稍后部署命令:"
    echo "   edgeone deploy vuepress-hope/.vuepress/dist"
fi
