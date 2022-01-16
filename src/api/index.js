import axios from "axios";
const compareFileData = (parmas) => {
  return axios
    .post("/api/compareFile", parmas)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export { compareFileData };
