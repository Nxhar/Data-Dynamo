import React, { useState } from 'react';
import './medicine.css';
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const MedicineRepo = ({ medicines, user }) => {
    const [nameSearchQuery, setNameSearchQuery] = useState('');
    const [usesSearchQuery, setUsesSearchQuery] = useState('');

    const handleNameSearchChange = (event) => {
        setNameSearchQuery(event.target.value);
    };

    const handleUsesSearchChange = (event) => {
        setUsesSearchQuery(event.target.value);
    };

    const filteredMedicines = medicines.filter((medicine) =>
        medicine['Medicine Name'].toLowerCase().includes(nameSearchQuery.toLowerCase()) &&
        medicine['Uses'].toLowerCase().includes(usesSearchQuery.toLowerCase())
    );

    return (
        <div className='chatContainer container'>
            <h2 style={{ textAlign: 'center', marginTop: '20px', fontSize: '30px' }}>Medicine Repository</h2>
            <div className="">
                <div className='search-container bottomInputBox'>
                    <input
                        className='input'
                        type="text"
                        placeholder="Search by medicine name"
                        value={nameSearchQuery}
                        onChange={handleNameSearchChange}
                    />
                    <div className='searchicon'> <SearchIcon fontSize='large' /> </div>
                </div>
                <div className='search-container bottomInputBox'>
                    <input
                        className='input'
                        type="text"
                        placeholder="Search by medicine uses"
                        value={usesSearchQuery}
                        onChange={handleUsesSearchChange}
                    />
                    <div className='searchicon'> <SearchIcon fontSize='large' /> </div>
                </div>
            </div>
            <div className='medicines'>
                {filteredMedicines.map((medicine, index) => (
                    <NavLink 
                        to={`/medicinerepo/${encodeURIComponent(medicine['Medicine Name'])}`}
                        className='medicine-link medicine '
                        key={index}
                    >
                        <div className=''>
                            <strong>{medicine['Medicine Name']}</strong> - {medicine['Uses']}
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MedicineRepo;
