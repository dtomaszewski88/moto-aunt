import { Button, Navbar } from 'flowbite-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

import HeaderLink from './HeaderLink';
import Search from './Search';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const isRoot = isActive('/');
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand className='flex-1'>
        <Image
          alt='Flowbite Logo'
          className='mr-3 h-6 sm:h-9'
          height={40}
          src='https://flowbite.com/docs/images/logo.svg'
          width={40}
        />
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
          MotoAunt
        </span>
      </Navbar.Brand>
      <div className='flex justify-center flex-1'>
        <Navbar.Collapse>
          <HeaderLink href='/' isActive={isActive('/')}>
            Home
          </HeaderLink>
        </Navbar.Collapse>
      </div>
      {!isRoot && (
        <div className='flex-2'>
          <Search size='sm' />
        </div>
      )}
      {!isRoot && <div className='flex-1'></div>}
      <div className='flex md:order-2 flex-1 justify-end'>
        {!session && <Button onClick={() => router.push('/api/auth/signin')}>Sign In</Button>}
        {session && <Button onClick={() => signOut()}>Sign Out</Button>}
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default Header;
