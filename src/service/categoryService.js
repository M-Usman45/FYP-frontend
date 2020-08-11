import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api/admin/categories";

export async function addCategory(name) {
  return await http.post(apiEndpoint + "/add", {
    name: name
  });
}

export async function viewCategories() {
  return await http.get(apiEndpoint + "/view");
}
