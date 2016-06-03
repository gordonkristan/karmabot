var handleLunchOffer = function(response) {
	response.send(' ooooooooo :fiestaparrot: :tayne: :parrotdad: :donkeysauce: :chompy:')
};

module.exports = function(robot) {
	robot.hear(/up for grabs/i, handleLunchOffer);
	robot.hear(/you can have/i, handleLunchOffer);
	robot.hear(/out sick/i, handleLunchOffer);
	robot.hear(/WFH/i, handleLunchOffer);
};
