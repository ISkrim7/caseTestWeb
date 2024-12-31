const { chromium } = require('playwright'); // 导入 Playwright 库
const fs = require('fs'); // 导入文件系统模块

// 函数：记录请求和响应
async function recordRequestsAndResponses() {
  // 启动 Chromium 浏览器
  const browser = await chromium.launch({ headless: false }); // 设置 headless: false 可以看到浏览器界面
  const context = await browser.newContext(); // 创建浏览器上下文
  const page = await context.newPage(); // 创建新页面

  // 用于保存请求和响应日志的文件
  const logFile = 'requests_responses.log';

  // 捕获并记录每个请求的信息
  page.on('request', (request) => {
    const logData = {
      type: 'request',
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      timestamp: new Date().toISOString(),
    };
    fs.appendFileSync(logFile, JSON.stringify(logData) + '\n'); // 将请求信息写入日志文件
    console.log(`Request made to: ${request.url()}`);
  });

  // 捕获并记录每个响应的信息
  page.on('response', async (response) => {
    const logData = {
      type: 'response',
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      timestamp: new Date().toISOString(),
    };
    fs.appendFileSync(logFile, JSON.stringify(logData) + '\n'); // 将响应信息写入日志文件
    console.log(`Response received from: ${response.url()}`);
  });

  // 捕获请求失败的情况（例如 4xx 或 5xx 错误）
  page.on('response', async (response) => {
    if (response.status() >= 400) {
      const logData = {
        type: 'error_response',
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date().toISOString(),
      };
      fs.appendFileSync(logFile, JSON.stringify(logData) + '\n'); // 记录错误响应
      console.error(
        `Error response from: ${response.url()} with status: ${response.status()}`,
      );
    }
  });

  // 打开一个页面并进行导航（可以替换成你希望访问的 URL）
  await page.goto('https://example.com'); // 访问目标 URL

  // 等待页面加载完成（根据需要调整等待时间）
  await page.waitForTimeout(5000); // 等待 5 秒钟，确保所有请求/响应记录

  // 关闭浏览器
  await browser.close();
}

// 运行代码并捕获错误
recordRequestsAndResponses().catch(console.error);
