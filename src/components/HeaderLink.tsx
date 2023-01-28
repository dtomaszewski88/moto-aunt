import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import React from 'react';

type HeaderLinkProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  isActive?: boolean;
} & LinkProps;

const HeaderLink: React.FC<HeaderLinkProps> = ({
  children,
  className,
  href,
  isActive,
  ...rest
}) => {
  return (
    <Link
      {...rest}
      className={clsx(className, 'block py-2 pl-3 pr-4', {
        'text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent':
          !isActive,
        'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white':
          isActive
      })}
      href={href}>
      {children}
    </Link>
  );
};

export default HeaderLink;
