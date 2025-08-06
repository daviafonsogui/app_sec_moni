import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({menssage:"Acesso Negado"})
    }
    try {
        const decode = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET)

    } catch (err) {
        return res.status(401).json({menssage:"Token Invalido"})
    }
    next()
}

export default auth