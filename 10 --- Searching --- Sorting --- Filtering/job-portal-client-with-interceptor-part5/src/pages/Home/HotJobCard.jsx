import { FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultImg from '../../assets/jobs-logo.png'

const HotJobCard = ({ job }) => {
    const { _id, title, company, company_logo, requirements, description, location, salaryRange } = job;
    return (
        <div className="card card-compact bg-base-100 shadow-xl">
            <div className='flex gap-2 m-2'>
                <figure>
                    <img
                        className='w-16'
                        src={company_logo? company_logo : defaultImg }
                        alt="Shoes" />
                </figure>
                <div>
                    <h4 className="text-2xl">{company? company : "Demo"}</h4>
                    <p className='flex gap-1 items-center'> <FaMapMarkerAlt></FaMapMarkerAlt> {location? location : "USA"}</p>
                </div>
            </div>
            <div className="card-body">
                <h2 className="card-title">{title}
                    <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>{description ? description : "Working very hard to make country" }</p>
                <div className='flex gap-2 flex-wrap'>
                    {
                        requirements?.map((skill, index) => <p
                            key={index}
                            className='border rounded-md text-center px-2 hover:text-purple-600 hover:bg-gray-400'
                        >{skill}</p>)
                    }
                </div>
                <div className="card-actions justify-end items-center mt-4">

                    <p className='flex items-center'>Salary: <FaDollarSign></FaDollarSign> {salaryRange?.min} - {salaryRange?.max} {salaryRange?.currency}</p>

                    <Link to={`/jobs/${_id}`}>
                        <button className="btn btn-primary">Apply</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HotJobCard;