var pg = require('pg');

var insertKarma = function(subject, amount, callback) {
	pg.connect(process.env.DATABASE_URL, function(error, client, done) {
		if (error) {
			console.log(7);
			callback(error);
			done();
		} else {
			console.log(8);
			client.query('INSERT INTO karma VALUES ($1, $2)', [subject, amount], function(error, result) {
				if (error) {
					console.log(9);
					callback(error);
					done();
				} else {
					console.log(10);
					client.query('SELECT COALESCE(SUM(karma_change), 0) as total_karma FROM karma WHERE subject = $1', [subject], function(error, result) {
						if (error) {
							console.log(11);
							callback(error);
							done();
						} else {
							console.log(12);
							callback(null, result.rows[0].total_karma);
							done();
						}
					});
				}
			});
		}
	});
};

module.exports = function(robot) {

	robot.hear(/(\S+)(:\s?)?(\+\+|\-\-)/i, function(response) {
		console.log(1);
		var operation = response.match[2];
		if (operation !== '++' && operation !== '--') {
			console.log(2);
			return;
		}

		var subject = (response.match[1] || '').trim().toLowerCase();
		var isUsername = false;
		if (subject[0] === '@') {
			subject = subject.slice(1);
			isUsername = true;
		}

		console.log(3);

		insertKarma(subject, (operation === '++' ? 1 : -1), function(error, newValue) {
			if (error) {
				console.log(4);
				return;
			}

			console.log(5);
			var verb = (operation === '++' ? 'risen' : 'fallen');
			var replySubject = (isUsername = '@' ? subject : subject);
			response.send(replySubject +'\'s karma has ' + verb + ' to ' + (newValue || 0));
			console.log(6);
		});
	});

};