import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api";

export async function addAnouncement(title, description) {
  return await http.post(apiEndpoint + "/admin/anouncements/add", {
    title: title,
    description: description,
  });
}

export async function editComplain(comp_id, title, description) {
  return await http.post(apiEndpoint + "/user/complains/edit/" + comp_id, {
    title: title,
    description: description,
  });
}

export async function viewAnouncements() {
  return await http.get(apiEndpoint + "/admin/anouncements/view");
}
export async function removeAnounce(id) {
  console.log("Delete function", id);

  return await http.delete(apiEndpoint + "/admin/anouncements/remove/" + id);
}

export async function getAnounceCount() {
  return await http.get(apiEndpoint + "/admin/anouncements/count");
}
