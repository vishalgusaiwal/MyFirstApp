const getUniqueErrorMessage = (err) => {
    let output;
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + 'already exists';
    } catch (ex) {
        output = 'Unique field already exists';
    }
    return output;
}
const getErrorMessage = (err) => {
    let message = 'No Change';
    if (err.code) {
        switch (err.code) {
            case 11000:
                message = "11000";
                break;
            case 11001:
                message = getUniqueErrorMessage(err)+"11001";
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message + err;
}

export default { getUniqueErrorMessage, getErrorMessage };