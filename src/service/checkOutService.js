import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api/admin/checkOuts";

export async function viewCheckOuts() {
  return await http.get(apiEndpoint + "/view");
}
