import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute/ProtectedRoute";
import { AuthRedirect } from "./routes/AuthRedirect/AuthRedirect";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MovieSearchPage from "./pages/MovieSearchPage/MovieSearchPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import NavBar from "./components/NavBar/NavBar";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import DirectorPage from "./pages/DirectorPage/DirectorPage";
import Layout from "./components/Layout/Layout";
import MoviePage from "./pages/MoviePage/MoviePage";
import HomePage from "./pages/HomePage/HomePage";
import GroupPage from "./pages/GroupPage/GroupPage";
import SocialPage from "./pages/SocialPage/SocialPage";

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<AuthRedirect />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/movies" element={<MovieSearchPage />} />
            <Route path="/movies/:movieID" element={<MoviePage />} />
            <Route path="/directors/:directorID" element={<DirectorPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
