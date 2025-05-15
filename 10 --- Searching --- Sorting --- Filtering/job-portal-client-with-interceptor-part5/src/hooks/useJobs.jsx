import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useJobs = (sort,search,minSalary,maxSalary) => {
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_urlLink}/jobs?sort=${sort}&search=${search}&minSalary=${minSalary}&maxSalary=${maxSalary}`)
        .then(res =>{
            
            setLoading(false);
            setJobs(res.data);
            
            })
        
    }, [sort,search,minSalary,maxSalary])

    return {loading, jobs}

};

export default useJobs;