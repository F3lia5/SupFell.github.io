// chat.js
// -----------------------------------------------------------------------------
// Sağ taraftaki sohbet ekranını yönetir: başlık, mesaj balonları,
// mesaj gönderme ve 2 saniyede bir otomatik güncelleme kontrolü.
// Gerçek okuma/yazma işlemleri message-service.js üzerinden yapılır;
// bu dosya sadece arayüzü (DOM) yönetir.
// -----------------------------------------------------------------------------

const POLL_INTERVAL_MS = 2000;

let currentRoomId = null; // örn. "admin_felias"
let currentSender = null; // bu ekranı kullanan kişi ("admin" ya da kullanıcı adı)
let lastRenderedId = 0; // ekrana çizilmiş en yüksek mesaj id'si
let pollingTimer = null;

/**
 * Sohbet ekranının başlığını değiştirir.
 * @param {string} title
 */
function setChatTitle(title) {
  document.getElementById("chat-title").textContent = title;
}

/**
 * Belirtilen sohbet odasını açar: mesajları yükler, ekrana çizer ve
 * yeni mesajlar için otomatik kontrolü başlatır.
 * Kullanıcı girişinde (kendi odası) ve admin bir kullanıcı seçtiğinde çağrılır.
 * @param {string} roomId
 * @param {string} sender - gönderilecek mesajlarda "kimden" olarak kullanılacak kimlik
 */
async function openRoom(roomId, sender) {
  stopPolling();

  currentRoomId = roomId;
  currentSender = sender;
  lastRenderedId = 0;

  const messages = await loadMessages(roomId);
  renderAllMessages(messages);

  startPolling();
}

/**
 * Mesaj listesini baştan çizer. Oda değiştiğinde veya ilk açılışta kullanılır.
 * @param {Array} messages
 */
function renderAllMessages(messages) {
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";

  if (messages.length === 0) {
    container.innerHTML = '<p class="empty-state">Henüz mesaj bulunmuyor.</p>';
    return;
  }

  messages.forEach((message) => appendMessageBubble(message));
  lastRenderedId = Math.max(...messages.map((m) => m.id));
  scrollToBottom();
}

/**
 * Tek bir mesajı ekrana ekler (tüm ekranı yeniden çizmeden).
 * Admin mesajları sağda, kullanıcı mesajları solda gösterilir.
 * @param {Object} message
 */
function appendMessageBubble(message) {
  const container = document.getElementById("chat-messages");

  const emptyState = container.querySelector(".empty-state");
  if (emptyState) emptyState.remove();

  const isAdmin = message.sender === "admin";

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${isAdmin ? "message-admin" : "message-user"}`;

  const text = document.createElement("p");
  text.className = "message-text";
  text.textContent = message.message;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = formatTime(message.time);

  bubble.appendChild(text);
  bubble.appendChild(time);
  container.appendChild(bubble);
}

/**
 * ISO zaman damgasını "SS:DD" formatında kısa saate çevirir.
 * @param {string} isoTime
 * @returns {string}
 */
function formatTime(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Mesaj alanını en alta kaydırır.
 */
function scrollToBottom() {
  const container = document.getElementById("chat-messages");
  container.scrollTop = container.scrollHeight;
}

/**
 * Mesaj kutusu ve Gönder butonunu etkinleştirir.
 * Gönder butonu artık gerçekten mesaj oluşturur, kaydeder ve ekrana çizer.
 */
function initChatInput() {
  const sendButton = document.getElementById("send-button");
  const input = document.getElementById("message-input");

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text || !currentRoomId || !currentSender) return;

    const newMessage = await sendMessage(currentRoomId, currentSender, text);
    appendMessageBubble(newMessage);
    lastRenderedId = newMessage.id;
    scrollToBottom();

    input.value = "";
    input.focus();
  };

  sendButton.addEventListener("click", handleSend);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSend();
  });
}

/**
 * Aktif odadaki yeni mesajları belirli aralıklarla kontrol eder.
 * Sadece daha önce çizilmemiş (id'si büyük olan) mesajlar eklenir;
 * tüm ekran yeniden çizilmez.
 */
function startPolling() {
  pollingTimer = setInterval(async () => {
    if (!currentRoomId) return;

    const messages = await loadMessages(currentRoomId);
    const newMessages = messages.filter((m) => m.id > lastRenderedId);
    if (newMessages.length === 0) return;

    newMessages.forEach((message) => appendMessageBubble(message));
    lastRenderedId = Math.max(...messages.map((m) => m.id));
    scrollToBottom();
  }, POLL_INTERVAL_MS);
}

/**
 * Oda değiştirildiğinde önceki odanın kontrol döngüsünü durdurur.
 */
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}
