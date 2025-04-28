import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostFormValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

type PostFormProps ={
    post?: Models.Document,
    action: "update" | "create";
}

const PostForm= ({post,action} : PostFormProps)=> {
    const navigate=useNavigate();
    const {user} = useUserContext();
    // 1. Define your form.
    const form = useForm<z.infer<typeof PostFormValidation>>({
      resolver: zodResolver(PostFormValidation),
      defaultValues: {
        caption:post?post?.caption:"",
        file:[],
        location:post?post?.location:"",
        tags:post?post?.tags.join(','):""
      },
    })
   const
    {mutateAsync:CreatePost, isPending:isLoadingCreate} = useCreatePost();

    const
    {mutateAsync:updatePost, isPending:isLoadingUpdate} = useUpdatePost()
    // 2. Define a submit handler.
    
    async function onSubmit(values: z.infer<typeof PostFormValidation>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      // console.log("hello");
      if(post && action=='update'){
        const updatedPost = await updatePost({
          ...values,
          postId:post.$id,
          imageId:post?.imageId,
          imageUrl:post?.imageUrl

        })

        if(!updatedPost){
          return toast({
            title:"Updation Failed"
          })
        }

        return navigate(`/posts/${post.$id}`);
      }
      const newPost = await CreatePost({
        ...values,
        userId:user.id
      })
      
      

      if(!newPost){
        return toast({
            title:'Plz Try Again'
        })
      }
      navigate('/')
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                  className="shad-form_label">  Caption</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                  className="shad-form_label">  Add Photos</FormLabel>
                  <FormControl>
                    <FileUploader 
                    fieldChange={field.onChange}
                    mediaUrl = {post?.imageURL}/>
                  </FormControl>
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                  className="shad-form_label">  Add Location</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field}/>
                  </FormControl>
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />      
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                  className="shad-form_label">  Add Tags (seprated by commas ",")</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" placeholder="JS, React , TypeScript" {...field}/>
                  </FormControl>
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />      
                       
            <div className="flex gap-4 items-center justify-end">
                <Button 
                className="shad-button_dark_4"
                type="button"
                onClick={()=>navigate('/')}>
                Cancel</Button>
                <Button
                className="shad-button_primary whitespace-nowrap" 
                type="submit" 
                disabled={isLoadingCreate || isLoadingUpdate}>Submit</Button>
            </div>
          </form>
        </Form>
      )
    }

export default PostForm;