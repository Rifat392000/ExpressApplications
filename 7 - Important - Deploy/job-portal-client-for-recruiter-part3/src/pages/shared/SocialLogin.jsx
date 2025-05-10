import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SocialLogin = ({from}) => {
    const { singInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        singInWithGoogle()
            .then(result => {
                console.log(result.user)
                navigate(from);
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    return (
        <div className='m-4'>
              <div className="divider">OR</div>

            <button onClick={handleGoogleSignIn} className='btn'>Google</button>
        </div>
    );
};

export default SocialLogin;