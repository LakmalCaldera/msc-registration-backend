const moment = require('moment');

module.exports = {
    getInfo: async (req, res, next) => {

        try {

            res.status(200).json({
                registration_open_from: process.env.OPENING_DATE,
                registration_open_to: process.env.CLOSING_DATE,
                payment_redirect_url: `${process.env.PGW_PROTOCOL}://${process.env.PGW_HOST}:${process.env.PGW_PORT}`
            });
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    }
}