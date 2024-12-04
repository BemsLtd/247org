import Cookies from "js-cookie";

async function hashUserId(userId) {
  const encoder = new TextEncoder();
  const data = encoder.encode(userId);
  const hash = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function storeUserIdInCookies(userId) {
  const hashedUserId = await hashUserId(userId);
  Cookies.set("UserId", hashedUserId, { expires: 7 });
}
export default storeUserIdInCookies;
