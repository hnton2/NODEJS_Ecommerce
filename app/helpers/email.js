const nodemailer = require('nodemailer');

let sendEmail = (emailConfig, email, invoiceCode, message = 'Thank you for your purchase') => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: emailConfig.email,
			pass: emailConfig.password_email
		}
	});
	var mailOptions = {
		from: emailConfig.email,
		to: email,
		subject: message,
		text: 'Your invoice code is #' + invoiceCode
	};

	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
	});
}

module.exports = {
	sendEmail
}