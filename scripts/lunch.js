var messageConfidenceHash = {
	'up for grabs' : .8,
	'you can have' : .6,
	'out sick'     : .5,
	'wfh'		   : .3 
}

var shouldRobotRespond = function(message) {
	var confidenceLevel = messageConfidenceHash[message.toLowerCase()];
	if (!confidenceLevel) {
		return false;
	}
	var random = Math.random();
	return confidenceLevel <= random; 
}

var handleLunchOffer = function(response) {
	response.send(' ooooooooo :fiestaparrot: :tayne: :parrotdad: :donkeysauce: :chompy:')
};

module.exports = function(robot) {
	robot.listen(shouldRobotRespond, handleLunchOffer);
};
