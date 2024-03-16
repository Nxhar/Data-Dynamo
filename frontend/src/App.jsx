import { useState, useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './Firebase/firebaseConfig.js';
import NavMenu from './Components/__Menu/NavMenu.jsx';
import CMain from './Components/CommunityForum/CMain.jsx';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Post from './Components/CommunityForum/Post/Post.jsx';
import HealthStatus from './Components/HealthPage/HealthStatus.jsx';
import Analytics from './Components/Analytics/AnalyticsDashboard.jsx';
import BookAppointment from './Components/Appointment/BookAppointment.jsx';
import Analyzer from './Components/Analyzer/Analyzer.jsx';
import CalorieTracker from './Components/CalorieTracker/CalorieTracker.jsx';
import AvailableAppointments from './Components/Appointment/AvailableAppointments.jsx';
import MedicineRepo from './Components/MedicineRepo/MedicineRepo.jsx';
import Medicine from './Components/MedicineRepo/Medicine.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [userPresent, setUserPresent] = useState(false);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://65e87e8e8776700094233644--celadon-cassata-cdd599.netlify.app/medicines');
        const result = await response.json();

        setMedicines(result.medicines);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setUserPresent(true);
      } else {
        setUser(null);
        setUserPresent(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!userPresent ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className='btn' onClick={handleGoogleAuth}>
            Sign In With Google
          </div>
        </div>
      ) : (
        <div className='appContainer'>
          <div className='MenuDivider'>
            <NavMenu user={user} />
          </div>

          <Routes>
            <Route path='/community' element={<CMain user={user} />} />
            <Route path='/community/:id' element={<Post user={user} />} />
            <Route path='/healthstatus' element={<HealthStatus user={user} />} />
            <Route path='/analytics' element={<Analytics user={user} />} />
            <Route path='/bookappointment' element={<AvailableAppointments user={user} />} />
            <Route path='/bookappointments/:id' element={<BookAppointment user={user} />} />
            <Route path='/analyzer' element={<Analyzer user={user} />} />
            <Route path='/calorietracker' element={<CalorieTracker user={user} />} />
            <Route path='/medicinerepo' element={<MedicineRepo medicines={medicines} user={user} />} />
            <Route path='/medicinerepo/:id' element={<Medicine medicines={medicines} user={user} />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
