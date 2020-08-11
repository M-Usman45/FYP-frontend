import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api";

export async function sendComplain(title, description) {
  return await http.post(apiEndpoint + "/user/complains/send", {
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

export async function getCompsReport(month) {
  return await http.get(apiEndpoint + "/admin/complains/complainsReport/"+month);
}

export async function viewComplains() {
  return await http.get(apiEndpoint + "/admin/complains/view");
}
export async function getInfo(comp_id) {
  return await http.get(apiEndpoint + "/admin/complains/getInfo/" + comp_id);
}

export async function getCompCount() {
  return await http.get(apiEndpoint + "/admin/complains/complainsCount");
}

export async function getPendingComp() {
  return await http.get(apiEndpoint + "/admin/complains/pendingComplains");
}

export async function getUserComplains() {
  return await http.get(apiEndpoint + "/user/complains/userComplains");
}

export async function deleteComp(id) {
  console.log("Delete function", id);

  return await http.delete(apiEndpoint + "/user/complains/delete/" + id);
}

export async function UpdateStatus(comp_id, comp_status) {
  return await http.post(
    apiEndpoint + "/admin/complains/updateStatus/" + comp_id,
    {
      status: comp_status,
    }
  );
}

export async function getUserCompCount() {
  return await http.get(apiEndpoint + "/user/complains/complainsCount");
}

export async function getUserPendingComp() {
  return await http.get(apiEndpoint + "/user/complains/pendingComplainsCount");
}

export async function getUserApprovedComp() {
  return await http.get(apiEndpoint + "/user/complains/approvedComplainsCount");
}
