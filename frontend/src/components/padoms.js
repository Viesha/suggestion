import axios from 'axios';

class PadomsDataService{
  

  getAll(token){      
    axios.defaults.headers.common["Authorization"] = "Token " + token;      
    return axios.get('http://localhost:8000/api/padoms/');
  }   

  createPadoms(data, token){
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("http://localhost:8000/api/padoms/", data);
  }
   
  updatePadoms(id, data, token){
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`http://localhost:8000/api/padoms/${id}`, data);
  }

  deletePadoms(id, token){
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`http://localhost:8000/api/padoms/${id}`);
  }   

  completePadoms(id, token){
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`http://localhost:8000/api/padoms/${id}/complete`);    
  }   

   
}

export default new PadomsDataService();