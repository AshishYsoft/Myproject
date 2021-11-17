import api from "./api";
import TokenService from "./Tokenservice";

class AuthService {
  login(username, password) {
    return api.post("/auth/signin", {
      username,
      password
    })
    .then(response => {
      if(response.data.accessToken) {
        TokenService.setUser(response.data);
      }
      return response.data;
    })
  }

  logout() {
    TokenService.removeUser();
  }

  register(username, email, password) {
    return api.post("/auth/signup", {
      username,
      email,
      password
    })
  }

  getCurrentUser() {
    return TokenService.getUser();
  }

  verifyUser(code) {
    return api.get("/auth/confirm/" + code)
    .then(response => {
      return response.data;
    })
  }
}

export default new AuthService();