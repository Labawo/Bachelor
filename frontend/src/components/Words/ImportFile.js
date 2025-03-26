import React, { useState } from 'react';
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";

const ImportFile = ({ levelId }) => {

    const [file, setFile] = useState();
    const [array, setArray] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    
        const array = csvRows.map(i => {
          const values = i.split(",");
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
    
        setArray(array);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (file && file.type === "application/vnd.ms-excel") {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };

            fileReader.readAsText(file);
            
        } else {
            alert("Prašome pasirinkti csv failą.");
        }

        try {
            if(array.length > 0) {
                const response = await axiosPrivate.post(`/levels/${levelId}/words/array`, array);
      
                setSuccessMessage("Klausimai sukurti sėkmingai!" + response.data);
            }

        } catch (error) {
            console.error("Įvyko klaida kuriant klausimus:", error);
            setErrorMessage("Įvyko klaida kuriant klausimus.");
        }
    };

    const headerKeys = Object.keys(Object.assign({}, ...array));

    return (               
        <div className='import-file-div'>
            <form>
                <input
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleOnChange}
                />

                <button
                className="create-button"
                id='file-bth'
                onClick={(e) => {
                    e.persist();
                    handleOnSubmit(e);
                }}
                >
                Įkelti iš failo
                </button>
            </form>

            <br />

            {/*<table>
                <thead>
                <tr key={"header"}>
                    {headerKeys.map((key) => (
                    <th>{key}</th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {array.map((item) => (
                    <tr key={item.id}>
                    {Object.values(item).map((val) => (
                        <td>{val}</td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>*/}
        <SuccessSelectModal
          show={successMessage !== ""}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
        <ErrorModal
          show={errorMessage !== ""}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
        </div>
        
    )
}

export default ImportFile