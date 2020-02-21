import axios from "axios";
export const NodeURL = "http://192.168.1.186:4000";

const client = axios.create({
  baseURL: NodeURL
});


const request = options => {
  const token = localStorage.getItem('user');
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // const header =
  // client.defaults.headers['BearerToken'] = header ? header : ''
  const onSuccess = response => {
    if (response && response.data && response.data.status === "00") {
      localStorage.clear()
    }
    // console.log(response)
    return response;
  };
  const onError = error => {
    if (error.response) {
      // Request was made but server responded with something other than 2xx
    } else {
      // Something else happened while setting up the request triggered the error
    }
    return Promise.reject(error.response || error.message);
  };
  return client(options)
    .then(onSuccess)
    .catch(onError);
};
export default request;









export const onImgLoad = (file, callback) => {
  var img = new Image();
  img.onload = () => {
    var result = { 'width': img.width, 'height': img.height };
    callback(result);
  }
  img.src = URL.createObjectURL(file);
}
