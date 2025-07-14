"use client";

import { useForm } from "react-hook-form"
import api from "@/lib/api";
import { useRouter } from "next/navigation"
import { Button, TextField } from "@mui/material";

export default function CreateTask() {

    const router = useRouter();

    type taskFormInputs = {
        title: string,
        description: string,
    }
    
    const {
        register,
        handleSubmit,
    } = useForm<taskFormInputs>()

    const onSubmit = async (data: taskFormInputs) => {
        const response = await api.post('/tasks', data)
        if(response.data){
            router.push('/tasks')
        }
    }

    return(
        <div style={{textAlign: "center"}}>
            <h1>Create New Task</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            <label>Name </label><br></br>
            <TextField 
            {...register('title', {required: 'Name is required'})}
            ></TextField>
            <br></br>
            <br></br>
            <label>Description </label><br></br>
            <TextField {...register('description', {required: 'Description is required'})}>
            </TextField>
            <br></br>
            <br></br>
            <Button variant="contained" type="submit">Create</Button>
            </form>
        </div>
    )
}