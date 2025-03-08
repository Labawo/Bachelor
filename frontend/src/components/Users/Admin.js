import Users from './Users';
import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";

const Admin = () => {
    return (
        <>
            <Title />
            <NavBar />
            <section>  
                <div className='content-holder-div'>
                    <Users />
                </div>           
            </section>
            <Footer />
        </>
        
    )
}

export default Admin