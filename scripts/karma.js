var pg = require('pg');

var insertKarma = function(subject, amount, callback) {
	pg.connect(process.env.DATABASE_URL, function(error, client, done) {
		if (error) {
			callback(error);
			done();
		} else {
			client.query('INSERT INTO karma VALUES ($1, $2)', [subject, amount], function(error, result) {
				if (error) {
					callback(error);
					done();
				} else {
					client.query('SELECT COALESCE(SUM(karma_change), 0) as total_karma FROM karma WHERE subject = $1', [subject], function(error, result) {
						if (error) {
							callback(error);
							done();
						} else {
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
		var operation = response.match[2];
		if (operation !== '++' && operation !== '--') {
			return;
		}

		var subject = (response.match[1] || '').trim().toLowerCase();
		var isUsername = false;
		if (subject[0] === '@') {
			subject = subject.slice(1);
			isUsername = true;
		}

		insertKarma(subject, (operation === '++' ? 1 : -1), function(error, newValue) {
			if (error) {
				return;
			}

			var verb = (operation === '++' ? 'risen' : 'fallen');
			var replySubject = (isUsername = '@' + subject : subject);
			response.send(replySubject +'\'s karma has ' + verb + ' to ' + (newValue || 0));
		});
	});

};