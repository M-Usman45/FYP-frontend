import http from "./httpService"

const apiEndpoint = "http://localhost:4000/api/admin/admins"

export async function viewAdmins() {

    return await http.get(apiEndpoint + "/viewAdmins")

}

export async function removeAdmin(id) {

    return await http.delete(apiEndpoint + "/removeAdmin/" + id)

}

export async function getAdminCount() {

    return await http.get(apiEndpoint + "/adminCount")
}

export async function getAdminInfo(id) {

    return await http.get(apiEndpoint + "/adminInfo/" + id)
}

export async function addAdmin(fname, lname, email, dep) {

    return await http.post("http://localhost:4000/api/admin/register", {

        firstname: fname,
        lastname: lname,
        email: email,
        department: dep

    })
}
