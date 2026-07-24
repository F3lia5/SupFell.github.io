// index.js
// -----------------------------------------------------------------------------
// index.html sayfasının ana orkestratörüdür (page bootstrap).
// Kendi başına arayüz oluşturmaz; role göre hangi modüllerin devreye
// gireceğine karar verir ve ortak elemanları (başlık, çıkış butonu) bağlar.
//
// - Giriş yapılmamışsa login.html'e geri gönderir. (auth.js)
// - Kullanıcının rolünü users.js'ten okur.
// - admin  -> admin-panel.js devreye girer (sol kullanıcı listesi).
// - user   -> sadece sohbet ekranı görünür, başlık "Admin ile Sohbet" olur.
// - Çıkış Yap butonuna basılınca oturumu temizler. (auth.js)
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Giriş yapılmamışsa bu sayfada durulmaz.
  requireLogin();

  const username = getSessionUser();
  if (!username) return; // requireLogin zaten yönlendirdi, güvenlik için ek kontrol.

  const role = getUserRole(username);

  // Karşılama metni (üst bilgi alanında küçük bir alt başlık olarak kalır).
  document.getElementById("welcome-text").textContent = `Hoş geldin, ${username}`;

  if (role === "admin") {
    renderAdminPanel();
    setChatTitle("Bir kullanıcı seçin");
  } else {
    // Normal kullanıcı: sol panel hiç render edilmez.
    // Kendi odası (admin_<username>) otomatik olarak açılır.
    setChatTitle("Admin ile Sohbet");
    openRoom(getRoomId(username), username);
  }

  initChatInput();

  document.getElementById("logout-button").addEventListener("click", () => {
    clearSession();
    window.location.href = "login.html";
  });
});
