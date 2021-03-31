

let formatLink = (value ) => {
    if(value[1] == "/"){
		value = value.substr(1);
	}
	return value;
}

let getNameImage = (string) => {
	return string.split(',');
}

module.exports = {
	formatLink,
	getNameImage
}