import axios from 'axios'

const _axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const register = (data) => {
    return _axios.post("/v1/profile", data);
};

const login = (data) => {
    return _axios.post(`/v1/login`, data);
};

const logout = () => {
    return _axios.post(`/v1/logout?token=${window.token}`);
};

const courses = () => {
    return _axios.get(`/v1/courses?token=${window.token}`);
};

const registration = (courseID) => {
    return _axios.post(`/v1/registrations?token=${window.token}`, {
        course_id: courseID
    });
};

const registrations = () => {
    return _axios.get(`/v1/registrations?token=${window.token}`);
};

const rateCourse = (courseID, rate) => {
    return _axios.put(`/v1/registrations/${courseID}?token=${window.token}`, {
        course_rating: rate
    });
};

export {
    _axios,
    login,
    register,
    logout,
    courses,
    registration,
    registrations,
    rateCourse
};
