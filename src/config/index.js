// In order to create a local config for dev purposes
// create a file with the following
// DEFAULT CONFIG
// module.exports = {
//     // Indicates this builds environement
//     // Can be one in ['prod' , 'dev']
//     ENV: 'dev',
// 
//     // LOCAL HOST FOR DEV
//     HOST: 'http://localhost/thegame-backend/web'
// 
// }

var config = require('./default.js')
try {
    config = require('./local.js')
    console.warn('USING LOCAL CONFIGURATION')
}catch(err) {}
export default  config

