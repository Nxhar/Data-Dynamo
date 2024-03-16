// HealthPage.js

import React, { useState, useEffect } from 'react';
import './healthstatus.css'
import RightPane from '../CommunityForum/RightPane/RightPane';
import { collection, getDoc, doc, setDoc,  } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';

const HealthStatus = ({ user }) => {
    const userId = user.uid;
    const [healthData, setHealthData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState('')

    useEffect(() => {
        const fetchHealthData = async () => {
            const encodedUserId = encodeURIComponent(userId);
            const userDocRef = doc(db, 'healthstatus', encodedUserId);

            try {
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data() || {};
                    const healthDataArray = userData.data || [];

                    // Update the state with the retrieved health data
                    setHealthData(healthDataArray);
                } else {
                    console.log('User document does not exist in Firestore.');
                }
            } catch (error) {
                console.error('Error fetching health data:', error);
            }
        };

        fetchHealthData();
    }, [userId]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const [formData, setFormData] = useState({
        heartRate: '',
        bodyTemperature: '',
        caloricIntake: '',
        medications: '',
        symptoms: '',
        sleepDuration: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentDate = new Date().toLocaleDateString();
        ;
        const encodedUserId = encodeURIComponent(userId);
        const userDocRef = doc(db, 'healthstatus', encodedUserId);

        
        try {
            const docSnapshot = await getDoc(userDocRef);
            const existingData = docSnapshot.exists() ? docSnapshot.data().data || [] : [];

            // Find the index of the current date in the array
            const index = existingData.findIndex(entry => entry.date === currentDate);

            if (index !== -1) {
                // If the date exists, update the entry
                existingData[index] = {
                    date: currentDate,
                    heartRate: formData.heartRate,
                    bodyTemperature: formData.bodyTemperature,
                    caloricIntake: formData.caloricIntake,
                    medications: formData.medications,
                    symptoms: formData.symptoms,
                    sleepDuration: formData.sleepDuration,
                };
            } else {

                existingData.push({
                    date: currentDate,
                    heartRate: formData.heartRate,
                    bodyTemperature: formData.bodyTemperature,
                    caloricIntake: formData.caloricIntake,
                    medications: formData.medications,
                    symptoms: formData.symptoms,
                    sleepDuration: formData.sleepDuration,
                });
            }

            console.log('Submit called')


            // Update the document with the modified array
            await setDoc(userDocRef, { data: existingData });
            setHealthData(existingData); // Update the state with the modified array
        } catch (error) {
            console.error('Error fetching/updating health data:', error);
        }
    };

    const renderAnalytics = () => {
        const sortedHealthData = healthData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    
        return sortedHealthData.map((entry, index) => (
            <div className='card' key={index}>
                <h1>Analytics on {entry.date}</h1>
                <p>Heart Rate: <span> {entry.heartRate} </span></p>
                <p>Body Temperature: <span> {entry.bodyTemperature} </span></p>
                <p>Caloric Intake: <span> {entry.caloricIntake} cal.</span> </p>
                <p>Medications: <span> {entry.medications} </span></p>
                <p>Symptoms: <span> {entry.symptoms} </span></p>
                <p>Sleep Duration: <span> {entry.sleepDuration} hours</span></p>
            </div>
        ));
    };
    

    return (
        <>
            <div className='rightbg'>
                <h1 style={{textAlign:'center', marginTop:'10px', marginBottom:'20px'}}>Health Status Repo</h1>
                <div className="center">
                    <div className='butn' onClick={openModal}>Add Today's Health Status</div>
                </div>
                {/* Display Analytics for the past 7 days */}
                <div className='center' style={{marginTop:'10px'}}>
                    <h2>Analytics for the Past 7 Days</h2>
                    {renderAnalytics()}
                </div>

                {/* Modal for adding today's health status */}
                {modalOpen && (
                    <div className='modal '>
                        <div className="overlay" ></div>
                        <div className="modal-content">
                            <div className="" style={{ display: 'flex', gap: '20px', 'justifyContent': 'center', alignItems: 'center' }}>Add Today's Status <div className="butn" style={{ padding: '2px 10px' }} onClick={closeModal}>X</div></div>

                            <form onSubmit={handleSubmit} className='myForm'>

                                <label>
                                    Heart Rate:
                                    <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} />
                                </label>

                                <label>
                                    Body Temperature:
                                    <input type="number" name="bodyTemperature" value={formData.bodyTemperature} onChange={handleChange} />
                                </label>

                                <label>
                                    Caloric Intake:
                                    <input type="number" name="caloricIntake" value={formData.caloricIntake} onChange={handleChange} />
                                </label>

                                <label>
                                    Medications:
                                    <input type="text" name="medications" value={formData.medications} onChange={handleChange} />
                                </label>

                                <label>
                                    Symptoms:
                                    <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} />
                                </label>

                                <label>
                                    Sleep Duration(hours):
                                    <input type="number" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} />
                                </label>

                                <div className='butn' onClick={handleSubmit} type="submit">Submit</div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <RightPane user={user} context={healthData.toString() + ' Analyze these reports and infer from it, any suggestions/predictions on what could happen to health'} />
        </>
    );
};


export default HealthStatus;
