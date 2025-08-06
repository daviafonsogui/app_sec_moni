import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma/client.js'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET


router.get("/listar-usuarios", async (req, res)=>{
    try {
        const users = await prisma.user.findMany()

        res.status(200).json({menssage:"Usuarios listados com sucesso", users})
    } catch (err) {
        res.status(500).json({menssage:"Erro interno do servidor"})
    }
})

router.post('/state_of_detectores', async (req, res)=>{
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


        //verique o estado do detector e a diferença de datas
        user.detectores.forEach( async (value, index)=>{
            const date_now = new Date()
            const date_of_last_life = value.split(" ")[1]

            const dif = Number.parseInt(date_now.getTime()) - Number.parseInt(date_of_last_life)

            if(dif > 5000){
                const userDetectores = [...user.detectores]
                userDetectores[index] = "caido"
                await prisma.user.update({where:{email:userInfo.email}, data:{detectores:userDetectores}})
            }
            console.log(date_now.getTime(), value)

        })


        // Atualiza o estado da maquina 
        // const userDetectores = [...user.detectores]
        // userDetectores[Number.parseInt(userInfo.whoiam)] = "Vivo"

        // await prisma.user.update({where:{email:userInfo.email}, data:{detectores:userDetectores}})
        
        

        res.status(200).json({detectoresstates:user.detectores})


    } catch (err) {
        return res.status(500).json({menssage:"Erro interno"})
    }
})

export default router