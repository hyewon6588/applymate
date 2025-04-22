const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
type SignupPayload = {
  username: string;
  password_hash: string;
  email: string;
  first_name: string;
  last_name: string;
};

export async function signup(payload: SignupPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
