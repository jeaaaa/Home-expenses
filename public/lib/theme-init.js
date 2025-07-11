// 主题初始化脚本
(function () {
  // 检查用户之前设置的主题偏好
  const storedTheme = localStorage.getItem("theme");
  // 检查系统主题偏好
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // 确定应该使用的主题
  const theme = storedTheme || (prefersDark ? "dark" : "light");

  // 应用主题
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
})();
