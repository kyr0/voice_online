/**
 * Created by jaboing on 2015-08-18.
 */


/* A test helper which catches errors and returns the error message.
*
* Takes method and value parameters, optional object and returns error message.
* Value can be an array of parameters normally passed to the function / method.
*/
module.exports.catchFunc = function(method, value, object){
    var obj = object || null;
    if (obj) {
        if (typeof value === "object") { // arrays are objects too
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