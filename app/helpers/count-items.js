
let countItems = async (model) => {
    let total = Number();
    await model.count({}, function( err, count){
        total = count;
    });
    return total;
}

module.exports = {
    countItems
}