import React from 'react';
import { Outlet} from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
    const data = useLoaderData();
    return (
        <div>
            {data}
            <Header></Header>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;