/**
 * Created by jaboing on 2015-08-18.
 */


/* A test helper which catches errors and returns the error message.
*
* Takes method and value parameters, optional object and returns error message.
* Value can be an array of parameters normally passed to the function / method.
*/
module.exports.catchError = function(method, value, object){
    var obj = object || null;

    if (typeof value !== "object") { // is value an array or not
        value = [value]; // change a simple value into an array
    }

    if (obj) {
        try {
            object[method].apply(null, value);
        }
        catch (err) {
            return err.message;
        }
    }
    else {
        try {
            method.apply(null, value);
        }
        catch (err) {
            return err.message;
        }
    }
};