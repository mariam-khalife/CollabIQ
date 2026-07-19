import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";

import Layout from "./components/Layout";
import AITeamMatching from "./pages/AiMatching";
import TeamManagement from "./pages/TeamManagement";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication pages */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />


        {/* Pages with Sidebar + Navbar */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />


        <Route
          path="/profile"
          element={
            <Layout>
              <MyProfile />
            </Layout>
          }
        />

         <Route
          path="/aimathcing"
          element={
            <Layout>
              <AITeamMatching />
            </Layout>
          }
        />

        <Route
          path="/team-management"
          element={
            <Layout>
              <TeamManagement />
            </Layout>
          }
        />



      </Routes>

    </BrowserRouter>

  );

}


export default App;