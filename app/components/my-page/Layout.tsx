import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className='flex flex-col items-center justify-center mt-3.5'>
            {children}
        </div>
        
    );
};

export default Layout;