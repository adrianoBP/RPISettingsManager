function IsNullOrEmpty(val) {
    if (Array.isArray(val))
        if (val.length == 0)
            return true;
    return val === undefined || val === null || val === "";
};