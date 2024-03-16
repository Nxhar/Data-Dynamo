import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';

function AvailableAppointments() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorsCollection = collection(db, 'doctors');
      const doctorsSnapshot = await getDocs(doctorsCollection);

      const doctorsData = [];
      doctorsSnapshot.forEach((doc) => {
        const { name, field, study, url_pattern } = doc.data();
        doctorsData.push({ name, field, study, url_pattern });
      });

      setDoctors(doctorsData);
    };

    fetchDoctors();
  }, []);

  return (
    <div className='chatContainer'>
      <h2 className='pageHeading'>Available Appointments</h2>
      <ul className='center '>
        {doctors.map((doctor) => (
          <li className='doc' key={doctor.url_pattern}>
            <NavLink to={`/bookappointments/${doctor.url_pattern}`}>
              {doctor.name} - {doctor.field}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AvailableAppointments;
