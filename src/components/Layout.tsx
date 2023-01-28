import React, { ReactNode } from 'react';

import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className='bg-teal-50 min-h-screen'>
    <Header />
    <div className='layout xl:p-8 p-4'>{props.children}</div>
  </div>
);

export default Layout;
