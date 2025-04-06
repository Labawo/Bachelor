import Users from './Users';
import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";

const Admin = () => {
    return (
        <>
            <NavBarNew />
            <section>  
                <div className='content-holder-div' style={{marginTop: "10px"}}>
                    <Users />
                </div>           
            </section>
            <Footer />
        </>
        
    )
}

export default Admin