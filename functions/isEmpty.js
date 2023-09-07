function isEmpty(value) {
    if (value == null) {
        return true;
    }

    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return Object.keys(value).length === 0;
        }
    } else if (typeof value === "string" && value.length <= 0) {
        return true
    }

    return false;
}


module.exports = isEmpty