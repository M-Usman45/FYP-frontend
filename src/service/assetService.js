import http from "./httpService";

const apiEndpoint = "http://localhost:4000/api";

export async function addAssets(title, brand, price, quantity,image, purchase ,category ) {
  console.log("Asset Service " , purchase , image)
  return await http.post(apiEndpoint + "/admin/assets/add", {
    title: title,
    brand: brand,
    quantity: quantity,
    price: price,
    purchaseDate: purchase,
    assetImage: image, 
    category: category 
  });
}

export async function getAssetInfo(id) {
  return await http.get(apiEndpoint + "/admin/assets/getAsset/" +id);
}

export async function viewAssets() {
  return await http.get(apiEndpoint + "/admin/assets/view");
}

export async function getAssetCount() {
  return await http.get(apiEndpoint + "/admin/assets/assetCount");
}

export async function OrganizationAssets() {
  return await http.get(apiEndpoint + "/user/assets/organizationAssets/view");
}

export async function inUsedAssets() {
  return await http.get(apiEndpoint + "/user/assets/inUsedAssets/view");
}

export async function getInUsedAssetCount() {
  return await http.get(apiEndpoint + "/user/assets/inUsedAssets/count");
}

export async function getAssetsReport(month) {
  return await http.get(apiEndpoint + "/admin/assets/assetsReport/"+month);
}

export async function returnAsset(id) {
  console.log("Retuen Asset Service", id);
  return await http.get(apiEndpoint + "/user/assets/inUsedAssets/return/" + id);
}

export async function getAssetTitles() {
  return await http.get(apiEndpoint + "/admin/assets/view/assetTitles");
}

export async function findAsset(title) {
  return await http.post(apiEndpoint + "/user/assets/findAsset", {
    title: title,
  });
}

export async function assignAsset(title, user_id, issueDate, returnDate, id) {
  console.log("Asset Service request id", id);
  return await http.post(apiEndpoint + "/admin/assets/assignAsset", {
    assetTitle: title,
    user_id: user_id,
    issueDate: issueDate,
    returnDate: returnDate,
    Id: id,
  });
}

export async function editAsset(id , price , quantity , purchaseDate){ 
  return await http.post(apiEndpoint + "/user/assets/edit/" + id, {  price, quantity, purchaseDate});
}
