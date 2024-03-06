import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Headers from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FooterComponent from './components/FooterComponent';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path='/search' element={<Search />} />
        {/* Using PrivateRoute to protect the dashboard route */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-post' element={<CreatePost />} />
        </Route>
        {/* Using AdminPrivateRoute to protect the create route */}
        <Route element={<AdminPrivateRoute />}>
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
};

export default App;
