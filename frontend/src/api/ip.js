let base_addr = process.env.VUE_APP_IP || 'http://172.30.91.84:5000'

base_addr = `${base_addr}/api`
let api_addr = `${base_addr}/subjects`

export default api_addr
