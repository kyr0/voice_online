/**
 * Created by jaboing on 2015-08-18.
 */


// Takes method and value parameters, optional object and returns error message.
// Value can be an array of parameters normally passed to the function / method.
module.exports.catchFunc = function(method, value, object){
    var obj = object || null;
    if (obj) {
        if (typeof value === "object") {
            try {
                object[method].apply(null, value);
            }
            catch (err) {
                return err.message;
            }
        }
        else {
            try {
                object[method](value);
            }
            catch (err) {
                return err.message;
            }
        }
    }
    else if (typeof value === "object") {
        try {
            method.apply(null, value);
        }
        catch (err) {
            return err.message;
        }
    }
    else {
        try {
            method(value);
        }
        catch (err) {
            return err.message;
        }
    }
};