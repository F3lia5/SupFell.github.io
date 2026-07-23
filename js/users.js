// users.js
// -----------------------------------------------------------------------------
// Şimdilik kullanıcılar kod içinde sabit olarak tutuluyor.
// İleride bu dosyanın yerini Cloudflare Worker + veritabanı alacak.
// -----------------------------------------------------------------------------

const USERS = [
  { username: "admin", password: "123456", role: "admin" },
  { username: "felias", password: "123456", role: "user" },
  { username: "mali", password: "123456", role: "user" },
  { username: "ahmet", password: "123456", role: "user" },
];

/**
 * Kullanıcı adı ve şifreyi USERS listesiyle karşılaştırır.
 * @param {string} username
 * @param {string} password
 * @returns {boolean} Bilgiler doğruysa true, değilse false döner.
 */
function isValidUser(username, password) {
  return USERS.some(
    (user) => user.username === username && user.password === password
  );
}

/**
 * Verilen kullanıcı adının rolünü döner ("admin" | "user").
 * Kullanıcı bulunamazsa null döner.
 * @param {string} username
 * @returns {string|null}
 */
function getUserRole(username) {
  const user = USERS.find((u) => u.username === username);
  return user ? user.role : null;
}

/**
 * Admin dışındaki tüm kullanıcıları döner.
 * Admin panelindeki "Kullanıcılar" listesini doldurmak için kullanılır.
 * @returns {Array<{username: string, password: string, role: string}>}
 */
function getRegularUsers() {
  return USERS.filter((u) => u.role === "user");
}
