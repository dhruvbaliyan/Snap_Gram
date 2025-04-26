import { PassThrough } from 'stream'
import * as z from 'zod'


export const SignUpFormValiadtion = z.object({
    name: z.string().min(2,{message:"Too Short"}),
    username: z.string().min(2, {message:"Too Short"}),
    email: z.string().email(),
    password: z.string().min(8,{message:"Password should be atleast 8 characters"})
  })

  export const SigninFormValiadtion = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message:"Password should be atleast 8 characters"})
  })

  export const PostFormValidation = z.object({
    
    caption:z.string().min(1,{
        message:"Caption is missing"
    }).max(2000,{
        message:"Caption is too long"
    }),
    file:z.custom<File[]>(),
    location:z.string().min(3).max(100),
    tags:z.string()

  })