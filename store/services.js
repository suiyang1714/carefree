import axios from 'axios'
const baseUrl = '';
/*const apiUrl = 'http://rapapi.org/mockjsdata/29997';*/

class Services {
  fetchUsers (url) {
    return axios.get(`${baseUrl}/admin/userList`)
  }
  fetchProblems (url) {
    return axios.get(`${baseUrl}/admin/problemList`)
  }
  fetchProblemReply (){
    return axios.get(`${baseUrl}/admin/replyList`)
  }
}
export default new Services()
