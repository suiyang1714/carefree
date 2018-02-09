import axios from 'axios'
const baseUrl = '';
/*const apiUrl = 'http://rapapi.org/mockjsdata/29997';*/

class Services {
  fetchUsers (url) {
    return axios.get(`${baseUrl}/admin/userList`)
  }
  fetchEmails (url) {
    return axios.get(`${baseUrl}/admin/emailList`)
  }
}
export default new Services()
