import { Navbar } from 'flowbite-react';
import Image from 'next/image';
import React from 'react';

const Header: React.FC = () => {
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
    </Navbar>
  );
};

export default Header;
