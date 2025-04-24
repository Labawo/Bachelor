import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Badges from "./Badges";
import logo from "./badges-image.png";
import './background.css';

const BadgesPage = () => {

    return (
        <>
            <NavBarNew />
            <section style={{marginTop: '0', color:"black", overflow:'auto', maxHeight:'85vh'}}>  
                <div className='container'>
                    
                </div>
                              
                <div>
                    <Badges />
                </div>
            </section>
            <Footer />
        </>
        
    )
}

export default BadgesPage