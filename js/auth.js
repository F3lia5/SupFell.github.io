// auth.js
// -----------------------------------------------------------------------------
// Oturum (session) yönetimiyle ilgili ortak fonksiyonlar burada toplanır.
// localStorage üzerinden basit bir "giriş yapıldı mı?" kontrolü sağlar.
// -----------------------------------------------------------------------------

const SESSION_KEY = "loggedInUser";

/**
 * Kullanıcıyı oturum açmış olarak işaretler.
 * @param {string} username
 */
function setSession(username) {
  localStorage.setItem(SESSION_KEY, username);
}

/**
 * Şu an oturum açmış kullanıcının adını döner.
 * Oturum yoksa null döner.
 * @returns {string|null}
 */
function getSessionUser() {
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Oturumu tamamen temizler (çıkış yap).
 */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Kullanıcı giriş yapmamışsa login.html sayfasına yönlendirir.
 * index.html gibi korumalı sayfaların en başında çağrılmalıdır.
 */
function requireLogin() {
  if (!getSessionUser()) {
    window.location.href = "login.html";
  }
}
