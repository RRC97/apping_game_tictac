

function cryptoPassword(password) {
    var cryptoKey = CryptoJS.MD5('EiyqnEyvsBk9Rloc');
    return CryptoJS.enc.Base64.stringify(CryptoJS.SHA512(password, cryptoKey));
};