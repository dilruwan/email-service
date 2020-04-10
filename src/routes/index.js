import { email as emailController } from '../controllers';

module.exports = (app) => {
    app.get('/', (req, res) => res.status(200).send({
        message: 'Welcome to email service.',
    }));

    app.post('/v1/emails', emailController.create);
    app.get('/v1/emails/:id', emailController.findByUid);
    app.delete('/v1/emails/:id', emailController.destroy);
};