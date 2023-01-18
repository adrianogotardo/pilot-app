import axios from 'axios';
import Config from "../pilot-app.config";

const { serverBaseURL: URL } = Config;

const EmployeesService = {
    getAllEmployees: () => axios.get(`${URL}/employees`),
    deleteEmployee: (id) => axios.delete(`${URL}/employees?id=${id}`),
    registerEmployee: (newEmployee) => axios.post(`${URL}/employees`, newEmployee),
    searchEmployeeByName: (employeeName) => axios.get(`${URL}/employees?name=${employeeName}`),
}

const StoresService = {
    getAllStores: () => axios.get(`${URL}/stores`),
    updateStore: (updateData) => axios.put(`${URL}/stores`, updateData),
    deleteStore: (id) => axios.delete(`${URL}/stores?id=${id}`),
    registerStore: (newStore) => axios.post(`${URL}/stores`, newStore),
    searchStoreByName: (storeName) => axios.get(`${URL}/stores?name=${storeName}`),
}

const ClientsService = {
    getAllClients: () => axios.get(`${URL}/clients`),
    deleteClient: (id) => axios.delete(`${URL}/clients?id=${id}`),
    registerClient: (newClient) => axios.post(`${URL}/clients`, newClient),
    searchClient: (searchSettings) => {
        if(searchSettings.initialDate && searchSettings.endDate){
           return axios.get(`${URL}/clients?name=${searchSettings.name}&initialDate=${searchSettings.initialDate}&endDate=${searchSettings.endDate}&includeArchived=${searchSettings.includeArchived}`)
        }
        return axios.get(`${URL}/clients?name=${searchSettings.name}&includeArchived=${searchSettings.includeArchived}`)
    },
    updateClient: (updateData) => axios.put(`${URL}/clients`, updateData),
    getClientsBalance: (searchSettings) => {
        if(searchSettings.initialDate && searchSettings.endDate){
            return axios.get(`${URL}/clients/balance?initialDate=${searchSettings.initialDate}&endDate=${searchSettings.endDate}`)
        }
        return axios.get(`${URL}/clients/balance`)
    }
}

const OrdersService = {
    getAllOrders: () => axios.get(`${URL}/orders`),
    filterOrders: (searchSettings) => axios.get(`${URL}/orders?initialDate=${searchSettings.initialDate}&endDate=${searchSettings.endDate}&store=${searchSettings.store}&client=${searchSettings.client}`),
    addOrder: (orderData) => axios.post(`${URL}/orders`, orderData),
    deleteOrder: (id) => axios.delete(`${URL}/orders?id=${id}`)
}

const AuthService = {
    register: (registrationData) => axios.post(`${URL}/users/register`, registrationData),
    login: (loginData) => axios.post(`${URL}/users/login`, loginData)
}

const IncomesService = {
    getAllIncomes: () => axios.get(`${URL}/incomes`),
    filterIncomes: (searchSettings) => axios.get(`${URL}/incomes?initialDate=${searchSettings.initialDate}&endDate=${searchSettings.endDate}&client=${searchSettings.client}`),
    addIncome: (incomeData) => axios.post(`${URL}/incomes`, incomeData),
    deleteIncome: (id) => axios.delete(`${URL}/incomes?id=${id}`)
}

export {
    EmployeesService,
    StoresService,
    ClientsService,
    OrdersService,
    AuthService,
    IncomesService,
}