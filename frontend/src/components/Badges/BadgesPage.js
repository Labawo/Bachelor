import NavBarNew from "../Main/NavBarNew";
import Footer from "../Main/Footer";
import Badges from "./Badges"


const BadgesPage = () => {

    return (
        <>
            <NavBarNew />
            <section>                
                <div className='content-holder-div' style={{marginTop: "10px"}}>
                    <Badges />
                </div>
            </section>
            
            <Footer />
        </>
        
    )
}

export default BadgesPage