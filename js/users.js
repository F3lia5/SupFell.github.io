// users.js
// -----------------------------------------------------------------------------
// Şimdilik kullanıcılar kod içinde sabit olarak tutuluyor.
// İleride bu dosyanın yerini Cloudflare Worker + veritabanı alacak.
// -----------------------------------------------------------------------------

const USERS = [
  { username: "admin", password: "123456" },
  { username: "felias", password: "123456" },
  { username: "mali", password: "123456" },
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
