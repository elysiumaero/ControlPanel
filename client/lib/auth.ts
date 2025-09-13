export type ElysiumUser = {
  name: "Prerit Roshan" | "Raghav Jindal";
};

const STORAGE_KEY = "elysium_user";

function normalizeName(input: string) {
  return input.trim().toLowerCase();
}

export function login(name: string, password: string): ElysiumUser | null {
  const n = normalizeName(name);
  const validPrerit = n === "prerit roshan" && password === "980752";
  const validRaghav = n === "raghav jindal" && password === "13579";
  if (validPrerit) {
    const user: ElysiumUser = { name: "Prerit Roshan" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  if (validRaghav) {
    const user: ElysiumUser = { name: "Raghav Jindal" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getUser(): ElysiumUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ElysiumUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
