var handleLunchOffer = function(response) {
	response.send(' ooooooooo :fiestaparrot: :tayne: :parrotdad:')
};

module.exports = function(robot) {
	robot.hear(/up for grabs/i, handleLunchOffer);
};
