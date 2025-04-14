import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Badges from "./Badges";
import logo from "./badges-image.png";


const BadgesPage = () => {

    return (
        <>
            <NavBarNew />
            <section style={{marginTop: '0', color:"black", overflow:'auto', maxHeight:'85vh'}}>  
                <img src={logo} alt="Logo" width='100%' height='200px'/>              
                <div>
                    <Badges />
                </div>
            </section>
            <Footer />
        </>
        
    )
}

export default BadgesPage