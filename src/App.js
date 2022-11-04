import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Homepage from './views/home/Homepage'
import CreateGroupbuyForm from './views/createGroupbuy/createGroupbuyForm'
import GroupbuyDetails from './views/groupbuy/GroupbuyDetails'
import ChatScreen from './views/chat/ChatScreen'
import Login from './views/login/Login'
import Signup from './views/signup/Signup'
<<<<<<< HEAD
import Profile from './views/profile/Profile'

=======
import GroupbuyManagement from './views/groupbuymanagement/GroupbuyManagement'
import GroupbuyOrderListing from './views/groupbuymanagement/GroupbuyOrderListing'
>>>>>>> 14cc206d1b5d85c94a0107960515cfa8df2512fc
import './style/main.scss'

function App() {
  const { authIsReady, user } = useAuthContext()
  console.log(user)
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={user ? <Homepage /> : <Navigate to="/login" /> }/> */}
            <Route path="/" element={<Homepage />}/>
            {/* <Route path="/createGroupbuy" element={user ? <CreateGroupbuyForm /> : <Navigate to="/login" />}/> */}
            <Route path="/createGroupbuy" element={<CreateGroupbuyForm />}/>
            {/* <Route path="/groupbuys/:id" element={user ? <GroupbuyDetails /> : <Navigate to="/login" /> }/> */}
            <Route path="/groupbuys/:id" element={<GroupbuyDetails />}/>
            <Route path="/chat" element={<ChatScreen />}/>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />}/>
<<<<<<< HEAD
            <Route path="/profile" element={<Profile/>}/>
=======
            <Route path="/order" element={typeof(user)==='undefined'  ? <Navigate to="/login" /> : <GroupbuyManagement />}/>
            <Route path="/order/:id" element={<GroupbuyOrderListing />}/>
            {/* <Route path="/order" element={<GroupbuyManagement />}/> */}
>>>>>>> 14cc206d1b5d85c94a0107960515cfa8df2512fc
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App