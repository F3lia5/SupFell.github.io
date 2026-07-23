// index.js
// -----------------------------------------------------------------------------
// index.html sayfasına özel davranışları yönetir:
// - Giriş yapılmamışsa login.html'e geri gönderir.
// - Kullanıcı adını ekranda gösterir.
// - Çıkış Yap butonuna basılınca oturumu temizler.
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Giriş yapılmamışsa bu sayfada durulmaz.
  requireLogin();

  const username = getSessionUser();
  if (!username) return; // requireLogin zaten yönlendirdi, güvenlik için ek kontrol.

  const welcomeText = document.getElementById("welcome-text");
  welcomeText.textContent = `Hoş geldin, ${username}`;

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", () => {
    clearSession();
    window.location.href = "login.html";
  });
});
