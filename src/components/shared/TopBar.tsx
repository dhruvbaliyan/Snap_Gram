import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";


const TopBar = () => {
const {mutateAsync: signOutAccount , isSuccess} = useSignOutAccount();
const navigate = useNavigate();
const {user} = useUserContext();

useEffect(()=>{
    if(isSuccess){
        navigate('/sign-in');
    }
},[isSuccess]);
    
  return (
    <section  className='topbar'>
        <div className="flex-between py-4 px-5">
            <Link to='/' className='flex gap-3 items-center'>
                <img 
                src='/assets/images/logo.svg' 
                height={325}
                width={130}
                alt="logo" />
            </Link>

            <div className="flex gap-1">
                <Button onClick={()=>signOutAccount()} variant='ghost' className="shad-button">
                    <img 
                    src="/assets/icons/logout.svg" 
                    alt="log-out"
                     />
                </Button>

                <Link className="flex-center gap-3" to={`/profile/${user.id}`}>
                    <img 
                    className="h-8 w-8 rounded-full"
                    src={`${user.imageUrl}`} 
                    alt="userImage" />
                </Link>
            </div>
        </div>

    </section>
  )
}

export default TopBar