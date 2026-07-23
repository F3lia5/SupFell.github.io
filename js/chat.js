// chat.js
// -----------------------------------------------------------------------------
// Sağ taraftaki sohbet ekranını yönetir: başlık, mesaj alanı ve mesaj kutusu.
// Bu aşamada gerçek mesaj gönderme/alma YOKTUR.
// Gönder butonu şimdilik sadece console.log("Hazır") yazdırır.
// Gerçek mesajlaşma sistemi Day 3'te bu dosyanın üzerine eklenecek.
// -----------------------------------------------------------------------------

/**
 * Sohbet ekranının başlığını değiştirir.
 * @param {string} title
 */
function setChatTitle(title) {
  document.getElementById("chat-title").textContent = title;
}

/**
 * Mesaj alanını "Henüz mesaj bulunmuyor." durumuna sıfırlar.
 * Kullanıcı değiştirildiğinde çağrılır.
 */
function resetChatMessages() {
  const messagesArea = document.getElementById("chat-messages");
  messagesArea.innerHTML = '<p class="empty-state">Henüz mesaj bulunmuyor.</p>';
}

/**
 * Mesaj kutusu ve Gönder butonunu etkinleştirir.
 * Şimdilik gerçek gönderim yapmaz, sadece hazır olduğunu loglar.
 */
function initChatInput() {
  const sendButton = document.getElementById("send-button");

  sendButton.addEventListener("click", () => {
    // Gerçek mesaj gönderme sistemi henüz yok (Day 3'te eklenecek).
    console.log("Hazır");
  });
}
