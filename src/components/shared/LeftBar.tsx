
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation"
import { sidebarLinks } from "@/constants"
import { INavLink } from "@/types"
import { Button } from "../ui/button"
import { useEffect } from "react"

const LeftBar = () => {
  const {user} = useUserContext();
  const {pathname} = useLocation();
  const {mutateAsync: signOutAccount , isSuccess} = useSignOutAccount();
  const navigate = useNavigate();
  useEffect(()=>{
    if(isSuccess) navigate('/sign-in');
  },[isSuccess])


  return (
    <nav className="leftsidebar ">
      <div className="flex flex-col gap-11">
        <Link to={'/'} className="flex gap-3 items-center">
          <img 
          src="/assets/images/logo.svg" 
          alt="logo"
          width={170}
          height={36} />
        </Link>

        <Link 
            className="flex gap-3 items-center" 
            to={`/profiles/${user.id}`}>
            <img 
            className="w-14 h-14 rounded-full"
            src={user.imageUrl}
            alt="profile" 
            />
            <div className="flex flex-col">
              <p className="bold-bold">
                {user.name}
              </p>
              <p className="small-regular text-light-3">
                @{user.username}
              </p>
            </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {
            sidebarLinks.map((link : INavLink)=>{
              const isActive = pathname === link.route; 
              return(
                <li className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                  <NavLink  to={link.route} 
                  className='flex gap-4 items-center p-4'>
                    <img src={link.imgURL} alt="imgURL" className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                      {link.label}
                  </NavLink>
                </li>
              )
            })
          }
        </ul>
      </div>

      <Button onClick={()=>signOutAccount()} variant='ghost' className="shad-button justify-start">
        <img 
        src="/assets/icons/logout.svg" 
        alt="log-out"
          />
          <p className="small-medium lg:base-medium ">LogOut</p>
      </Button>
      <p className="items-center small-regular text-light-3">@vite v6.2.5</p>
    </nav>
  )
}

export default LeftBar