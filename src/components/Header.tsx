import clsx from 'clsx';
import { Button, Dropdown, Navbar } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { useIntl } from 'react-intl';

import HeaderLink from './HeaderLink';
import Search from './Search';
const Header: React.FC = () => {
  const router = useRouter();
  const { asPath, locale } = router;
  const { data: session } = useSession();
  const { formatMessage: t } = useIntl();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;
  const isRoot = isActive('/');

  const flags: Record<string, React.ReactNode> = {
    en: <Image alt='UK flag' className='rounded-md' height={30} src='/images/en.svg' width={50} />,
    da: (
      <Image
        alt='Denmark flag'
        className='rounded-md'
        height={30}
        src='/images/da.svg'
        width={39}
      />
    )
  };

  return (
    <Navbar fluid={true} rounded={true}>
      <div className='w-full grid grid-cols-12 gap-2  items-center'>
        <Navbar.Brand className='flex-1 col-span-3 order-1 row-start-1'>
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
        <div className='md:hidden col-span-3 order-3 row-start-1 justify-self-end'>
          <Navbar.Toggle />
        </div>
        <div
          className={clsx('col-span-12 md:row-start-auto row-start-3', {
            'md:col-span-2': !isRoot,
            'md:col-span-6': isRoot
          })}>
          <Navbar.Collapse className='md:mt-0 -mt-4'>
            <HeaderLink href='/' isActive={isActive('/')}>
              {t({ id: 'header.link.home' })}
            </HeaderLink>
          </Navbar.Collapse>
        </div>
        {!isRoot && (
          <div className='md:col-span-4 col-span-12 pt-4 md:pt-0'>
            <Search size='sm' />
          </div>
        )}
        <div className='md:col-span-3 col-span-6 flex md:order-4 order-2 md:row-start-auto row-start-1 md:justify-self-end justify-self-center items-center gap-4'>
          {!session && (
            <Button onClick={() => router.push('/api/auth/signin')}>
              {t({ id: 'common.signIn' })}
            </Button>
          )}
          {session && <Button onClick={() => signOut()}>{t({ id: 'common.signOut' })}</Button>}
          <Dropdown inline={true} label={flags[locale ?? 'en']}>
            <Dropdown.Item>
              <Link href={asPath} locale='en'>
                <span className='flex items-center gap-2 justify-between'>EN{flags['en']}</span>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link href={asPath} locale='da'>
                <span className='flex items-center gap-2 justify-between'>DA{flags['da']}</span>
              </Link>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
