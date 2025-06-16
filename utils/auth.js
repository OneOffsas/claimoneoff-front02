// utils/auth.js

export function saveUser(userObj) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(userObj));
  }
}

export function getUser() {
  if (typeof window !== "undefined") {
    const u = localStorage.getItem("user");
    if (u) {
      try {
        return JSON.parse(u);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}
