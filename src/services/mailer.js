import sgMail from '@sendgrid/mail';

module.exports = {
    /*
     * Send email with sendgrid
     */
    send(email) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email.to,
            from: process.env.FROM_EMAIL_ADDRESS,
            subject: email.subject,
            text: email.content,
            html: email.content,
        };
        return sgMail.send(msg);
    }
}
