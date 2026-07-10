import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ChangePassword from "../pages/Profile/ChangePassword";
import CreatePost from "../pages/CreatePost/CreatePost";
import EditPost from "../pages/EditPost/EditPost";
import PostDetail from "../pages/PostDetail/PostDetail";
import MyBookmarks from "../pages/MyBookmarks/MyBookmarks";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
   <Routes>


  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />


  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/posts/:slug" element={<PostDetail />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
    <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
    <Route path="/posts/:slug/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
    <Route path="/my-bookmarks" element={<ProtectedRoute><MyBookmarks /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Route>

</Routes>
  );
}

export default AppRoutes;