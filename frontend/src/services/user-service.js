import api from "./api";

class UserService {
  getUserBoard() {
    return api.get("/test/user");
  }

  getAdminBoard() {
    return api.get("/test/admin");
  }
}

export default new UserService();