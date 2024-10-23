
exports.checkEmptyArray = (val) => {
    if(val && Array.isArray(val) && val.length > 0) return true;
    return false;
}
