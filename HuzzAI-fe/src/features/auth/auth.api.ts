import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // change to your Django URL
});

// LOGIN
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await API.post("/token/", { email, password });
  return { accessToken: res.data.access };
}

// REGISTER
export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await API.post("/auth/register/", { email, password });
  return { accessToken: res.data.access };
}
