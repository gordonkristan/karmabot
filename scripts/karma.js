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

var handleKarmaRequest = function(subject, operation, response) {
	if (operation !== '++' && operation !== '--' && operation !== '—') {
		return;
	}

	subject = (subject || '').trim();
	var isUsername = false;
	if (subject[0] === '@') {
		subject = subject.slice(1);
		isUsername = true;
	}

	if (subject.toLowerCase() === 'gordo' && operation !== '++') {
		response.reply('How dare you?!');
		return;
	}

	insertKarma(subject.toLowerCase(), (operation === '++' ? 1 : -1), function(error, newValue) {
		if (error) {
			return;
		}

		var verb = (operation === '++' ? 'risen' : 'fallen');
		var replySubject = (isUsername ? '@' + subject : subject);
		response.send(replySubject +'\'s karma has ' + verb + ' to ' + (newValue || 0));
	});
};

module.exports = function(robot) {

	robot.hear(/(\+\+|\-\-|—)/i, function(response) {
		var message = response.message.text || '';

		var match;

		if (match = message.match(/(:\S+?:)\x20*(\+\+|\-\-|—)/i)) { // Emoji
			handleKarmaRequest(match[1], match[2], response);
		} else if (match = message.match(/(@\S+?):?\x20*(\+\+|\-\-|—)/i)) { // @Mentions
			handleKarmaRequest(match[1], match[2], response);
		} else if (match = message.match(/(\S+)\x20*(\+\+|\-\-|—)/i)) { // Everything else
			handleKarmaRequest(match[1], match[2], response);
		}
	});

};