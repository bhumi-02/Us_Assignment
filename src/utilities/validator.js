
function isString(data) {
    let stringRegex = /^[A-Za-z]{1}[A-Za-z]{1,1000}$/
     return stringRegex.test(data);
}
function isEmail(data) {
    let EmailRegex = /^[A-Za-z1-9]{1}[A-Za-z0-9._]{1,}@[A-Za-z1-9]{2,15}[.]{1}[A-Za-z.]{2,15}$/
     return EmailRegex.test(data);
}
function isPin(data) {
    let pinRegex = /^[1-9]{1}[0-9]{5}$/
     return pinRegex.test(data);
}
function ismobile(data) {
    let mobileRegex = /^[6-9]{1}[0-9]{9}$/
    return mobileRegex.test(data);
}
function isStreet(data) {
    let streetRegex = /^[A-Za-z1-9]{1}[A-Za-z0-9./ ,-]{1,10000}$/
    return streetRegex.test(data);
}
function isPassword(data) {
    let passwordRegex = /^[A-Z0-9a-z]{1}[A-Za-z0-9.@#$&]{7,14}$/
    return passwordRegex.test(data);
}
module.exports={isString, isEmail, isPin, ismobile, isStreet, isPassword}