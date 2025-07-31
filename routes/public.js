import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma/client.js'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

router.post('/cadastro_api', async (req, res)=>{
    try{
        const user = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)

        const userDB = await prisma.user.create({
            data:{
                email:user.email,
                name:user.name,
                password: hashPassword,
                detectores:["caido", "caido", "caido"]
            }
        })
        res.status(201).json(userDB)
    } catch(err){
        res.status(500).json({menssage: err})
    }
})
router.post('/login_api', async (req, res)=>{
    try{
        const userInfo = req.body 
        const user = await prisma.user.findUnique({
            where:{
                email:userInfo.email
            }
        })
        // Verifica a existencia do usuario
        if(!user){
            return res.status(404).json({menssage:"Usuario não encontrado"})
        }

        // Compara a senha do banco com a que o usuario digitou
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if(!isMatch){
            return res.status(404).json({menssage:"Senha errada"})
        }

        // Gerar token
        const token = jwt.sign({id:user.id}, JWT_SECRET, {expiresIn:"7d"})
        res.status(200).json(token)

    } catch(err){
        res.status(500).json({menssage: err})
    }
})




// Comunicação IOT 
router.post('/iamlife', async (req, res)=>{
    try{
        const userInfo = req.body 
        const user = await prisma.user.findUnique({
            where:{
                email:userInfo.email
            }
        })
        // Verifica a existencia do usuario
        if(!user){
            return res.status(404).json({menssage:"Usuario não encontrado"})
        }

        // Atualiza o estado da maquina 
        const userDetectores = [...user.detectores]
        const horas = new Date()
        userDetectores[Number.parseInt(userInfo.whoiam)] = "Vivo " + horas.getTime()

        await prisma.user.update({where:{email:userInfo.email}, data:{detectores:userDetectores}})
        
        

        res.status(200).json({menssage:"Listado como vivo", userInfo, user, userDetectores})


    } catch (err) {
        return res.status(500).json({menssage:"Erro interno", err})
    }
})

export default router