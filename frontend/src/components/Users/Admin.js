import Users from './Users';
import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";

const Admin = () => {
    return (
        <>
            <NavBarNew />
            <section className='admin-section'>  
                <Users />           
            </section>
            <Footer />
        </>
        
    )
}

export default Admin