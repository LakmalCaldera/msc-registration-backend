//const joi = require('joi');

// TODO :- 
// Validate body info in incoming request before processing...
//
// module.exports = {
//     validateParam: (schema, name) => {
//         return (req, res, next) => {
//             const result = joi.validate({ param: req['params']['name'] }, schema);
//             if (result.error) {
//                 return next({status: 400, messages:result.error.details, err: result.error});
//             }else{
//                 if (!req.value)
//                     req.value = {};

//                 if (!req.value['params'])
//                     req.value['params'] = {}

//                 req.value['params'][name] = result.value.param;
//                 next();
//             }
//         }
//     },
//     validateBody: (schema) => {
//         return (req, res, next) => {
//             const result = joi.validate(req.body, schema);

//             if(result.error){
//                 return next({status: 400, messages:result.error.details, err: result.error});
//             }else{
//                 if(!req.value)
//                     req.value = {};

//                 if(!req.value['body'])
//                     req.value.body = {};

//                 req.value['body'] = result.value;
//                 next();
//             }
//         }
//     },
//     schemas: {
//         id: joi.object().keys({
//             param: joi.string().regex(/^[0-9a-zA-Z]{24}$/).required()
//         }),
//        userBody: joi.object().keys({
//            username: joi.string().required()
//        }) 
//     }
// }