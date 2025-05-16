import React from 'react';
import { useLoaderData } from 'react-router-dom';

const UserDetail = () => {
    const user = useLoaderData();
    console.log(user);
    return (
        <div>
            <p>{user._id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    );
};

export default UserDetail;