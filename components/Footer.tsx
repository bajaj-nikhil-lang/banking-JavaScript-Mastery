import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  // const handleLogOut = async () => {
  //   const loggedOut = await logoutAccount();

  //   if(loggedOut) router.push('/sign-in');
  // }

  // const handleLogOut = async () => {
  //   try {
  //     const res = await fetch('/api/logout');
  //     const data = await res.json();

  //     if (data.success) {
  //       router.push('/sign-in'); // redirect after successful logout
  //     } else {
  //       console.error('Logout failed on server');
  //     }
  //   } catch (err) {
  //     console.error('Logout request failed:', err);
  //   }
  // };

  // chatgpt code
  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/logout");
      const data = await res.json();

      if (data.success) {
        router.push("/sign-in"); // redirect after logout
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };


  return (
    <footer className='footer'>
        <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
          <p className='text-xl font-bold text-gray-700'>
            {user?.name[0]}
          </p>
        </div>

        <div  className={type === 'mobile' ? 'footer_email-mobile' : 'email'}>
          <h1 className='text-14 truncate text-gray-700 font-semibold'>
            {user?.name}
          </h1>
          <p className="text-14 truncate font-normal text-gray-600">
            {user?.email}
          </p>
        </div>

        <div className="footer_image" onClick={handleLogOut}>
          <Image 
            src="/icons/logout.svg" fill alt='jsm'
          />
        </div>
    </footer>
  )
}

export default Footer