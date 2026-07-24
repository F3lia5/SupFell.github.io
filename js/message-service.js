// message-service.js
// -----------------------------------------------------------------------------
// Mesaj okuma/yazma işlemlerinin TEK geçtiği yer burasıdır.
//
// ÖNEMLİ NOT:
// Bu proje şu an sadece statik bir GitHub Pages sitesi (backend yok).
// Tarayıcıdan doğrudan data/messages/*.json dosyalarına YAZMAK teknik
// olarak mümkün değildir (bunun için bir sunucu/API ve yetkilendirme gerekir).
// Bu yüzden:
//   - İlk açılışta oda, data/messages/{room}.json dosyasından OKUNUR (fetch).
//   - Gönderilen yeni mesajlar, aynı tarayıcıda kaybolmaması için
//     localStorage'a yazılır (JSON dosyasıyla birebir aynı veri yapısında).
// Cloudflare Worker devreye girdiğinde SADECE bu dosyanın içi değişecek;
// chat.js ve admin-panel.js hiç dokunulmadan çalışmaya devam edecek.
// -----------------------------------------------------------------------------

const MESSAGES_FOLDER = "data/messages";
const STORAGE_PREFIX = "chat_";

/**
 * Kullanıcı adına göre sohbet odası kimliğini üretir.
 * Mimari gereği her odanın diğer ucu admin'dir: "admin_<username>"
 * @param {string} username
 * @returns {string}
 */
function getRoomId(username) {
  return `admin_${username}`;
}

/**
 * Bir odanın güncel mesaj listesini döner.
 * Bu tarayıcıda daha önce yüklenmişse localStorage'dan,
 * ilk seferse data/messages/{room}.json dosyasından okur.
 * @param {string} roomId
 * @returns {Promise<Array>}
 */
async function loadMessages(roomId) {
  const cached = readFromStorage(roomId);
  if (cached) return cached;

  const seedMessages = await fetchSeedMessages(roomId);
  writeToStorage(roomId, seedMessages);
  return seedMessages;
}

/**
 * data/messages/{room}.json dosyasını okur.
 * Dosya bulunamazsa veya okunamazsa (örn. sunucusuz/yerel açılışta) boş dizi döner.
 * @param {string} roomId
 * @returns {Promise<Array>}
 */
async function fetchSeedMessages(roomId) {
  try {
    const response = await fetch(`${MESSAGES_FOLDER}/${roomId}.json`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Mesaj dosyası okunamadı (${roomId}.json):`, error);
    return [];
  }
}

/**
 * Yeni bir mesaj oluşturur, odaya ekler ve kalıcı hale getirir.
 * @param {string} roomId
 * @param {string} sender - "admin" ya da kullanıcı adı
 * @param {string} text
 * @returns {Promise<Object>} eklenen mesaj nesnesi
 */
async function sendMessage(roomId, sender, text) {
  const messages = await loadMessages(roomId);

  const newMessage = {
    id: getNextId(messages),
    sender,
    type: "text",
    message: text,
    time: new Date().toISOString(),
  };

  messages.push(newMessage);
  writeToStorage(roomId, messages);

  return newMessage;
}

/**
 * Mevcut mesajlardaki en yüksek id'den bir fazlasını hesaplar.
 * @param {Array} messages
 * @returns {number}
 */
function getNextId(messages) {
  if (messages.length === 0) return 1;
  return Math.max(...messages.map((m) => m.id)) + 1;
}

/**
 * localStorage'daki güncel mesaj listesini döner (kayıt yoksa null).
 * @param {string} roomId
 * @returns {Array|null}
 */
function readFromStorage(roomId) {
  const raw = localStorage.getItem(STORAGE_PREFIX + roomId);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Mesaj verisi bozuk, sıfırlanıyor (${roomId}):`, error);
    return null;
  }
}

/**
 * Mesaj listesini localStorage'a yazar.
 * @param {string} roomId
 * @param {Array} messages
 */
function writeToStorage(roomId, messages) {
  localStorage.setItem(STORAGE_PREFIX + roomId, JSON.stringify(messages));
}
