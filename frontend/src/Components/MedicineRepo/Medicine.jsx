import React from 'react';

const Medicine = ({ medicines }) => {
    const medicineName = window.location.pathname.split('/').pop();
    const decodedMedicineName = decodeURIComponent(medicineName);
    const medicine = medicines.find(medicine => medicine['Medicine Name'] === decodedMedicineName);



    if (!medicine) {
        return <div className='rightbg'>Medicine not found!</div>;
    }

    return (
        <div className='medicine-details rightbg'>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px', fontSize: '30px' }}>{medicine['Medicine Name']}</h2>
    
            <div className="center">
                <img src={medicine['Image URL']} style={{ height: '300px', marginBottom: '50px' }} alt="" />
            </div>
            <div className="items">
                <div className="item">
                    <h3>Composition : </h3>
                    <p>{medicine['Composition']}</p>
                </div>
    
                <div className="item">
                    <h3>Uses : </h3>
                    <p>
                        {medicine['Uses'].split(/\s(?=[A-Z])/).map((word, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <br />}
                                {word}
                            </React.Fragment>
                        ))}
                    </p>
                </div>
    
                <div className="item">
                    <h3>Side Effects : </h3>
                    <p>{medicine['Side_effects']}</p>
                </div>
    
                <div className="item">
                    <h3>Manufacturer : </h3>
                    <p>{medicine['Manufacturer']}</p>
                </div>
    
                <div className="item">
                    <h3>Excellent Review % : {medicine['Excellent Review %']}</h3>
                    <h3>Average Review % : {medicine['Average Review %']}</h3>
                    <h3>Poor Review % : {medicine['Poor Review %']}</h3>
                </div>
            </div>
        </div>
    );
    
    
    
};

export default Medicine;
