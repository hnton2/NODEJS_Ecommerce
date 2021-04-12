

let formatLink = (value ) => {
    if(value[1] == "/"){
		value = value.substr(1);
	}
	return value;
}

let getNameImage = (string) => {
	return string.split(',');
}

let generateCode = (length) => {
	var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

module.exports = {
	formatLink,
	getNameImage,
	generateCode
}