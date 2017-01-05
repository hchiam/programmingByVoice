function uniqueList(arr) {
    // refactored version of: http://stackoverflow.com/questions/11688692/most-elegant-way-to-create-a-list-of-unique-items-in-javascript
    var uniqueDictionary = {};
    var uniqueArray = [];
    var arrayLength = arr.length;
    for (var i=0; i<arrayLength; i++) {
        // find unique items in arr
        if(uniqueDictionary.hasOwnProperty(arr[i]) === false) {
            // save name of unique item in dictionary (used for quick checking of uniqueness)
            uniqueDictionary[arr[i]] = 1;
            // save new array of unique items (used for returning an array, not a dictionary)
            uniqueArray.push(arr[i]);
        }
    }
    return uniqueArray;
}