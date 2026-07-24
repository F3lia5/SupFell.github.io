// admin-panel.js
// -----------------------------------------------------------------------------
// Sadece "admin" rolündeki kullanıcı için çalışır.
// Sol taraftaki kullanıcı listesini oluşturur ve bir kullanıcı seçildiğinde
// sağ taraftaki sohbet başlığını günceller (chat.js üzerinden).
// Henüz gerçek mesajlaşma yok; sadece arayüz davranışı var.
// -----------------------------------------------------------------------------

/**
 * Admin panelini (sol sütun) görünür yapar ve kullanıcı listesini doldurur.
 */
function renderAdminPanel() {
  const sidebar = document.getElementById("sidebar");
  const userList = document.getElementById("user-list");

  sidebar.hidden = false;
  userList.innerHTML = "";

  getRegularUsers().forEach((user) => {
    const item = document.createElement("li");
    item.className = "user-list-item";
    item.textContent = capitalizeFirstLetter(user.username);
    item.dataset.username = user.username;

    item.addEventListener("click", () => handleUserSelect(item, user.username));

    userList.appendChild(item);
  });
}

/**
 * Bir kullanıcı seçildiğinde çalışır: seçili öğeyi işaretler,
 * sohbet başlığını günceller ve o kullanıcıyla admin arasındaki
 * gerçek sohbet odasını açar (mesajları yükler + otomatik kontrolü başlatır).
 * @param {HTMLElement} selectedItem
 * @param {string} username
 */
function handleUserSelect(selectedItem, username) {
  document
    .querySelectorAll(".user-list-item")
    .forEach((item) => item.classList.remove("active"));

  selectedItem.classList.add("active");

  setChatTitle(`${capitalizeFirstLetter(username)} ile Sohbet`);
  openRoom(getRoomId(username), "admin");
}

/**
 * Bir metnin ilk harfini büyütür (kullanıcı adlarını okunaklı göstermek için).
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
