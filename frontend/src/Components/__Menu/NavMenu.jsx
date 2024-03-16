import './navmenu.css';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';
import MessageIcon from '@mui/icons-material/Message';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';import { NavLink } from 'react-router-dom';
import { auth } from '../../Firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import SummarizeIcon from '@mui/icons-material/Summarize';


function NavMenu({ user }) {
  const userIcon = user.photoURL;

  const handleLogOut = () => {
    signOut(auth)
  }

  return (
    <div className="sidebar">
      <div style={{textAlign:'center'}} className="title">HealthMD</div>


      <NavLink
        to="/analytics"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <AssessmentIcon />
        Profile
      </NavLink>


      <NavLink
        to="/community"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <MessageIcon />
        Community
      </NavLink>

      <NavLink
        to="/healthstatus"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <AnalyticsIcon />
        Health Status
      </NavLink>

      <NavLink
        to="/bookappointment"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <PostAddIcon />
        Appointment
      </NavLink>

      <NavLink
        to="/analyzer"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <AddchartIcon />
        Analyzer
      </NavLink>

      <NavLink
        to="/calorietracker"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <EmojiFoodBeverageIcon />
        Calorie Tracker
      </NavLink>

      <NavLink
        to="/medicinerepo"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'activeLink option' : 'option'
        }
      >
        <SummarizeIcon />
        Medicine Repo
      </NavLink>

      

      

      <div className="option" style={{cursor:'pointer'}} onClick={handleLogOut}>
        <LogoutIcon /> 
        Logout
      </div>

      <div className="profile">
        <img className="profile-iconHere" src={userIcon} alt="" />
        <div className="textIn">
          <div className="name">{user.displayName}</div>
          <div className="email">{user.email}</div>
        </div>
      </div>
    </div>
  );
}

export default NavMenu;
