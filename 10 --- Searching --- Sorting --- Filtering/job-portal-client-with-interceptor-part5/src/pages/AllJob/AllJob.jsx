import React, { useState } from 'react'
import useJobs from '../../hooks/useJobs'
import HotJobCard from '../Home/HotJobCard';
function AllJob() {
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState('');
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
    const {loading, jobs} = useJobs(sort,search,minSalary,maxSalary);
    if(loading){
        return <h2>Still Loading......</h2>
    }
  return (
     <div>
        <h2 className='text-center font-medium text-5xl py-8'>All jobs</h2>
        <div className="flex flex-wrap gap-3 p-4 bg-base-200 rounded-lg shadow-sm">
      <button 
        onClick={() => setSort(!sort)} 
        className={`btn btn-sm ${sort ? "btn-success" : "btn-neutral"}`}
      >
        {sort ? "Sorted" : "Sort by Salary"}
      </button>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search by location" 
          className="input input-bordered input-sm w-full max-w-xs" 
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Min salary" 
          className="input input-bordered input-sm w-24" 
          onChange={(e) => setMinSalary(e.target.value)}
          value={minSalary}
        />
        <input 
          type="text" 
          placeholder="Max salary" 
          className="input input-bordered input-sm w-24" 
          onChange={(e) => setMaxSalary(e.target.value)}
          value={maxSalary}
        />
      </div>
    </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {
                    jobs.map(job => <HotJobCard key={job._id} job={job}></HotJobCard>)
                }
            </div>
        </div>
  )
}

export default AllJob