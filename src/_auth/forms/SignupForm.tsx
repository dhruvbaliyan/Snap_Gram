import { SignUpFormValiadtion } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {z } from 'zod'
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutation.ts"
import { useUserContext } from "@/context/AuthContext"


const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const 
      {checkAuthUser , isLoading: isUserLoading} = useUserContext();
  

// 1. Define your form.
  const form = useForm<z.infer<typeof SignUpFormValiadtion>>({
    resolver: zodResolver(SignUpFormValiadtion),
    defaultValues: {
      username: "",
      name:"",
      email:"",
      password:""
    },
  });

  const 
    { mutateAsync :createUserAccount ,
    isPending : isCreatingAccount }  = useCreateUserAccount();

  const 
    { mutateAsync :signInAccount ,
      isPending : isSigningIn }  = useSignInAccount();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpFormValiadtion>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
        const newUser = await createUserAccount(values);
        
        if(!newUser ){
          return toast({
            title: "Sign-Up Failed",
            description: "Plz try again later",
            variant: "destructive"
          })
        }
        const session = await signInAccount({
          email:values.email,
          password:values.password
        });
        console.log(session);
        
        if(!session){
          toast({
            title: "Sign-Up Failed",
            description: "Plz try again later",
            variant: "destructive"
          })
          navigate("/sign-in");
          return;
        }
        
        const isLoggedIn = await checkAuthUser();
        if(isLoggedIn){
          form.reset();
          navigate('/')
        }else{
          toast({
            title:"Sign In Failed"
          })
          return ;
        }
    } catch (err) {
      console.log(err);
    }
    
  }
  return (
  <Form {...form}>
    <div className="flex-center flex-col sm:w-420">
      <img src="/assets/images/logo.svg" alt="logo"  />
      <h3 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Create a new account
      </h3>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use SnapGram Enter Your Details
      </p>
    

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input"   {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        < FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input"   {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input"   {...field} />
              </FormControl>
              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="shad-button_primary" type="submit">
          {isCreatingAccount  ?
            (
              <div className="flex-center gap-2">
                <Loader/>Loading...
              </div>
            )
          :(
            "Sign-up"
          )}
        </Button>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account 
        <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
        </p>
      </form>
    </div>
  </Form>
  )
}

export default SignupForm