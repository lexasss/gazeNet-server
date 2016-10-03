let roles = {
	none: 0,
	receiver: 1,
	sender: 2,
	both: 3
};

for (let key in roles) {
	roles[ roles[ key ] ] = key;
}

module.exports = roles;