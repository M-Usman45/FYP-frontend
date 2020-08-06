import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api/admin";
const UserapiEndpoint = "http://localhost:4000/api/user";

export async function viewUsers() {
  return await http.get(apiEndpoint + "/users/viewUsers");
}

export async function register() {
  return await http.get(apiEndpoint + "/users/userCount");
}

export async function getUserCount() {
  return await http.get(apiEndpoint + "/users/userCount");
}

export async function getevents() {
  return await http.get(apiEndpoint + "/users/events/view");
}

export async function getUsersRequest() {
  return await http.get(apiEndpoint + "/users/usersRequest");
}

export async function getUserInfo(_id) {
  return await http.get(apiEndpoint + "/users/getUser/" + _id);
}

export async function addEvent(title, start, end, url) {
  return await http.post(apiEndpoint + "/users/events/add", {
    title,
    start,
    end,
    url,
  });
}

export async function editProfile(id, fname, lname, contact) {
  return await http.post(apiEndpoint + "/editProfile/"+id, {
    fname,
    lname,
    contact,
  });
}

export async function ApproveUser(_id) {
  return await http.get(apiEndpoint + "/users/approve/" + _id);
}

export async function resetPassword(email) {
  return await http.put(UserapiEndpoint + "/rp", { email: email });
}

// eslint-disable-next-line
export async function validateCodeViaEmail(email, code) {
  return await http.put(UserapiEndpoint + "/validateCodeViaEmail", {
    email: email,
    code: code,
  });
}

export async function resetPassFinal(email, password) {
  return await http.put(UserapiEndpoint + "/resetPassword1", {
    email: email,
    password: password,
  });
}
