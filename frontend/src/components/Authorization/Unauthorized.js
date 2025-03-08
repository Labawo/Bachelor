import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className='log-reg-sec'>
            <div className='login-full-div'>
                <h1 style={{color: "red"}}>Unauthorized</h1>
                <br />
                <p>You do not have access to the requested page.</p>
                <div className="flexGrow">
                    <button onClick={goBack}>Go Back</button>
                </div>
            </div>
            
        </section>
    )
}

export default Unauthorized