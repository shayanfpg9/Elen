function getNest(object, path) {
    const keys = path.split(".");
    let value = object;

    for (const key of keys) {
        if (value && key in value) {
            value = value[key];
        } else {
            return null;
        }
    }
    return value;
}

module.exports = getNest