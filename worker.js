export default {
  async fetch(request) {
    try {
      // 从 GitHub 自动拉取最新 index.html
      const response = await fetch(
        "https://raw.githubusercontent.com/Xucheng04028/AirCargoCalculator/main/index.html"
      );
      const html = await response.text();

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    } catch (err) {
      return new Response("Service Error", { status: 500 });
    }
  },
};