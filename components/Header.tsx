import { Button, Navbar } from 'flowbite-react';
import Image from 'next/image';
import Router from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  console.log(session, status);
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href='https://flowbite.com/'>
        <Image
          alt='Flowbite Logo'
          className='mr-3 h-6 sm:h-9'
          height={40}
          src='https://flowbite.com/docs/images/logo.svg'
          width={40}
        />
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          NextJS
        </span>
      </Navbar.Brand>
      <div className='flex md:order-2'>
        <Button onClick={() => Router.push('/api/auth/signin')}>Sign In</Button>
        <Button onClick={() => signOut()}>Sign Out</Button>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default Header;
