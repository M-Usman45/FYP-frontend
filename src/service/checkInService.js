import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api/admin/checkIns";

export async function viewCheckIns() {
  return await http.get(apiEndpoint + "/view");
}


export async function setChecked(id , assetTitle) {

  return await http.post(apiEndpoint + "/checked/"+id , {assetTitle});
}