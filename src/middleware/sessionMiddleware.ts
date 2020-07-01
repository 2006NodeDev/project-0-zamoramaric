import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret',
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}


// this pattern is where we provide some configuration
export const sessionMiddleware = session(sessionConfig)//session is a factory function, config is the options
// it returns a function in the form of ( req, res, next ) => {
// it attaches a session object to the request where each uniqie connection to the server has a unique session
// and then
// next()
//}