import axios from 'axios';
import { useEffect, useState } from 'react';

const profileControllerAPI = 'http://localhost:8080/api/v1/profile/';
const professionalDetailsControllerAPI = 'http://localhost:8080/api/v1/professionalDetails/';
const registrationAPI = 'http://localhost:8080/api/v1/auth/';
const resetPasswordAPI = 'http://localhost:8080/api/v1/password/';

const useUserAuth = () => {
  const [token, setToken] = useState('');
  const [user_id, setUserId] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user != null) {
      const parsedUser = JSON.parse(user);
      setToken(parsedUser.token);
      setUserId(parsedUser.user_id);
    }
  }, []);

  return { token, user_id };
};

class ProfileSettings {
  constructor() {
    const user = localStorage.getItem('user');
    if (user != null) {
      const parsedUser = JSON.parse(user);
      this.token = parsedUser.token;
      this.user_id = parsedUser.user_id;
    } else {
      this.token = '';
      this.user_id = '';
    }
  }

  createUser(userData) {
    return axios.post(registrationAPI + 'register', userData);
  }

  findUserProfileById(user_id) {
    return axios.get(profileControllerAPI + 'getProfile/' + user_id);
  }

  changePassword(changePassword, user_id) {
    return axios.post(resetPasswordAPI + user_id, changePassword);
  }

  uploadProfileImage(profileImage, token, user_id) {
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    return axios.post(profileControllerAPI + 'profileImage/' + user_id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateProfileDetails(profileDetails, user_id) {
    return axios.post(`${profileControllerAPI}${user_id}`, profileDetails);
  }

  updateProfessionalDetails(profileDetails, user_id) {
    return axios.post(`${professionalDetailsControllerAPI}${user_id}`, profileDetails);
  }

  requestVerifyAccount(degree_certificate, user_id) {
    return axios.post(`${professionalDetailsControllerAPI}verify/${user_id}`, degree_certificate);
  }
}

export const useUserProfile = useUserAuth;

const userProfileHandleService = new ProfileSettings();

export default userProfileHandleService;
