import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Badges from "./Badges"


const BadgesPage = () => {

    return (
        <>
            <NavBarNew />
            <section>                
                <div style={{marginTop: "20px", color:"black", overflow:'auto', maxHeight:'85vh'}}>
                    <Badges />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default BadgesPage