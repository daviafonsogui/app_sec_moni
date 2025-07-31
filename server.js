import express from 'express'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'
import cors from  'cors'

const app = express()
app.use(express.json())
app.use(cors())
app.use('', publicRoutes)
app.use('', auth, privateRoutes)

const port = process.env.PORT || 3000

// usuario dagalphonse
// senha XExabl2tBpx9UjlE
// mongodb+srv://dagalphonse:XExabl2tBpx9UjlE@appdatab.8v4l0oo.mongodb.net/?retryWrites=true&w=majority&appName=appdatab
app.listen(3000, console.log("Servidor rodando 2"))