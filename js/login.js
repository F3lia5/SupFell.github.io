// login.js
// -----------------------------------------------------------------------------
// Login sayfasındaki forma özel davranışları yönetir:
// - Zaten giriş yapılmışsa direkt index.html'e gönderir.
// - Form gönderildiğinde kullanıcı bilgilerini doğrular.
// - Doğruysa oturum açar ve index.html'e yönlendirir.
// - Yanlışsa hata mesajı gösterir.
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Kullanıcı zaten giriş yapmışsa login ekranını göstermeye gerek yok.
  if (getSessionUser()) {
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (isValidUser(username, password)) {
      setSession(username);
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Kullanıcı adı veya şifre hatalı.";
      errorMessage.classList.add("visible");
    }
  });
});
