const express = require('express');
const app = express()
const bodyParser = require('body-parser') 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// import { PrismaClient } from "@prisma/client"
const {PrismaClient} = require('@prisma/client');
const prisma =  new PrismaClient()

app.get('/get-teacher-details/:parentId', async function (req, res) {
    try {
        const {parentId}= req.params
        const Perents = await prisma.perents.findUnique({
            where: {
                id: Number(parentId),
              },
              include: {
                student: {
                    include: {
                    Std:{
                        include: {
                            stdTeacherMap:{
                                include:{
                                    teacher:true
                                },
                            }
                        }  
                    }
                }
                }
              }
        })
        console.log(Perents.student.Std.stdTeacherMap);
        res.send(Perents.student.Std.stdTeacherMap)
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.')   
    }
})
app.post('/add-teacher', async function (req, res) {
    try {
        const {stdId,teacherId}= req.body
        if(!stdId){
            res.status(400).send('stdId is required.')    
        }
        if(!teacherId){
            res.status(400).send('teacherId is required.')    
        }
        const stdTeacherMapData = await prisma.stdTeacherMap.findMany({
            where: {
                AND:[{ 
                     teacherId: Number(teacherId)},{
                    stdId:Number(stdId)}]
              }});
        console.log(stdTeacherMapData);
        if(stdTeacherMapData){
            res.status(400).send('Same teacher already added with Provided Std')  
        }
        res.send("sucess");
    }catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.')   
    }
})

app.listen(3000)