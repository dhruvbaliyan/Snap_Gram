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