// checkin.js

/**
 * 优雅的自动签到脚本
 * 依赖: Node.js 18+ (原生支持 fetch)
 */

// 从环境变量获取敏感信息
const TOKEN = process.env.USER_TOKEN;
const COOKIE = process.env.USER_COOKIE;

// 检查环境变量是否存在
if (!TOKEN || !COOKIE) {
  console.error("❌ 错误: 未设置 USER_TOKEN 或 USER_COOKIE 环境变量。");
  process.exit(1);
}

const runCheckIn = async () => {
  // 动态生成时间戳，避免请求被缓存
  const timestamp = Date.now();
  const url = `https://flzt.top/api/v1/user/checkIn?t=${timestamp}`;

  const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "authorization": `Bearer ${TOKEN}`, // 注入 Token
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": COOKIE, // 注入 Cookie
    "Referer": "https://flzt.top/dashboard",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
  };

  try {
    console.log(`🚀 开始签到请求: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    const result = await response.json();

    // 格式化输出结果
    if (result.status === 'success') {
      console.log("✅ 签到成功!");
      console.log(`📜 消息: ${result.message}`);
      if (result.data) {
        console.log(`🎁 获得流量: ${result.data.reward_mb} MB`);
        console.log(`📊 总签到流量: ${(result.data.total_checkin_traffic / 1024 / 1024 / 1024).toFixed(2)} GB`);
      }
    } else {
      // 虽然 HTTP 200，但业务逻辑可能返回错误（如已签到）
      console.warn("⚠️ 签到可能有误 (业务状态非 success):");
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error("❌ 签到过程发生异常:");
    console.error(error.message);
    process.exit(1); // 标记 Action 为失败
  }
};

runCheckIn();