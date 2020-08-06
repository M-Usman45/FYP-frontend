import jwtDecode from "jwt-decode";
import http from "./httpService";

//import { apiUrl } from "../config.json";
//const apiEndpoint = apiUrl + "/auth";
const apiEndpoint = "http://localhost:4000/api";
const tokenKey = "token";

http.setJwt(getJwt());

export async function AdminLogin(email, password) {
  return await http.post(apiEndpoint + "/admin/login", { email, password });
}

export async function UserLogin(email, password) {
  return await http.post(apiEndpoint + "/user/login", { email, password });
}

export async function UserSignUp(
  firstname,
  lastname,
  email,
  password,
  department,
  contactno
) {
  console.log(
    "in auth service ",
    firstname,
    lastname,
    email,
    password,
    department,
    contactno
  );
  return await http.post(apiEndpoint + "/user/signUp", {
    firstname,
    lastname,
    email,
    password,
    department,
    contactno,
  });
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function isAdmin() {
  // const jwt = localStorage.getItem(tokenKey);
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt).isAdmin;
  } catch (ex) {
    return null;
  }

  // return token.isAdmin;
}
export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  AdminLogin,
  UserLogin,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  isAdmin,
};
