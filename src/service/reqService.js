import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api";

export async function sendRequest(
  title,
  assetTitle,
  issueDate,
  returnDate,
  description
) {
  return await http.post(apiEndpoint + "/user/requests/send", {
    title: title,
    assetTitle: assetTitle,
    issueDate: issueDate,
    returnDate: returnDate,
    description: description,
  });
}

export async function editRequest(
  req_id,
  title,
  assetTitle,
  issueDate,
  returnDate,
  description
) {
  return await http.post(apiEndpoint + "/user/requests/edit/" + req_id, {
    title: title,
    assetTitle: assetTitle,
    issueDate: issueDate,
    returnDate: returnDate,
    description: description,
  });
}

export async function deleteReq(id) {
  console.log("Request Delete function", id);

  return await http.delete(apiEndpoint + "/user/requests/delete/" + id);
}

export async function getInfo(req_id) {
  return await http.get(apiEndpoint + "/admin/requests/view/" + req_id);
}

export async function viewRequests() {
  return await http.get(apiEndpoint + "/admin/requests/view",);
}
export async function getUserRequests() {
  return await http.get(apiEndpoint + "/user/requests/userRequests");
}

export async function getReqCount() {
  return await http.get(apiEndpoint + "/admin/requests/requestCount");
}

export async function getPendingReq() {
  return await http.get(apiEndpoint + "/admin/requests/pendingRequestsCount");
}

export async function getUserReqCount() {
  return await http.get(apiEndpoint + "/user/requests/requestsCount");
}

export async function getReqsReport(month) {
  return await http.get(apiEndpoint + "/admin/requests/requestsReport/"+month);
}


export async function UpdateStatus(req_id, req_status) {
  console.log("In Request Service", req_status);
  return await http.post(
    apiEndpoint + "/admin/requests/updateStatus/" + req_id,
    {
      status: req_status,
    }
  );
}
