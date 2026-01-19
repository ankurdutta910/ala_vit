import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Team from "./components/Team";
import About from "./components/About";
import Gallery from "./components/Gallery";
import ALAEvents from "./components/ALAEvents";
import Blogs from "./components/Blogs";
import ViewBlog from "./components/ViewBlog";
import AboutAssam from "./components/Assam";
import Advisors from "./components/Advisors";

import Anthem from "./components/Assam/Anthem";
import Symbols from "./components/Assam/Symbols";
import History from "./components/Assam/History";
import Culture from "./components/Assam/Culture";
import Parks from "./components/Assam/Parks";

import Admin from "./components/Admin/components/Home";
import Login from "./components/Admin/components/Login";
// import Signup from "./components/Admin/components/Signup";

import Header from "./components/Admin/Header";
import Header2 from "./components/Admin/Header2";

import AddGallery from "./components/Admin/Gallery/AddGallery";
import AGallery from "./components/Admin/Gallery/Gallery";

import Board from "./components/Admin/Board/Board";

import AssamVideos from "./components/Assam/AssamVideos";
import EventDetails from "./components/EventDetails";
import AddBoard from "./components/Admin/Board/AddBoard";
import EditBoard from "./components/Admin/Board/EditBoard";
import EditGallery from "./components/Admin/Gallery/EditGallery";
import AddBlog from "./components/Admin/Blogs/AddBlog";
import EditBlog from "./components/Admin/Blogs/EditBlog";
import Blog from "./components/Admin/Blogs/Blog";
import Events from "./components/Admin/Events/Events";
import AddEvents from "./components/Admin/Events/AddEvents";
import EditEvent from "./components/Admin/Events/EditEvent";
import Forgotpassword from "./components/Admin/components/Forgotpassword";
import UpdatePassword from "./components/Admin/components/UpdatePassword";
import ChangePassword from "./components/Admin/components/ChangePassword";
import Privacy from "./components/Policies/Privacy";

function App() {
  return (
    <div className="enajori">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Advisors />
              <Footer />
            </>
          }
        />
        <Route
          path="/team"
          element={
            <>
              <Navbar />

              <Team />
              <Footer />
            </>
          }
        />
        <Route
          path="/contactus"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Navbar />
              <Gallery />
              <Footer />
            </>
          }
        />
        <Route
          path="/ala_events"
          element={
            <>
              <Navbar />
              <ALAEvents />
              <Footer />
            </>
          }
        />
        <Route
          path="/events/:id"
          element={
            <>
              <Navbar />
              <EventDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs"
          element={
            <>
              <Navbar />
              <Blogs />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <>
              <Navbar />
              <ViewBlog />
              <Footer />
            </>
          }
        />
        <Route
          path="/aboutassam"
          element={
            <>
              <Navbar />
              <AboutAssam />
              <Footer />
            </>
          }
        />
        <Route
          path="/stateanthem"
          element={
            <>
              <Navbar />
              <Anthem />
              <Footer />
            </>
          }
        />
        <Route
          path="/statesymbols"
          element={
            <>
              <Navbar />
              <Symbols />
              <Footer />
            </>
          }
        />
        <Route
          path="/assamhistory"
          element={
            <>
              <Navbar />
              <History />
              <Footer />
            </>
          }
        />
        <Route
          path="/assamparks"
          element={
            <>
              <Navbar />
              <Parks />
              <Footer />
            </>
          }
        />
        <Route
          path="/assamculture"
          element={
            <>
              <Navbar />
              <Culture />
              <Footer />
            </>
          }
        />
        <Route
          path="/assamvideogallery"
          element={
            <>
              <Navbar />
              <AssamVideos />
              <Footer />
            </>
          }
        />
        // Policies
        <Route
          path="/privacypolicy"
          element={
            <>
              <Navbar />
              <Privacy />
            </>
          }
        />
        // Portal Login start here
        <Route
          path="/portal"
          element={
            <>
              <Header />
              <Admin />
            </>
          }
        />
        <Route
          path="/galleryview"
          element={
            <>
              <Header />
              <AGallery />
            </>
          }
        />
        <Route
          path="/add-image"
          element={
            <>
              <Header />
              <AddGallery />
            </>
          }
        />
        <Route
          path="/edit-image/:id"
          element={
            <>
              <Header />
              <EditGallery />
            </>
          }
        />
        <Route
          path="/boardview"
          element={
            <>
              <Header />
              <Board />
            </>
          }
        />
        <Route
          path="/add-board-member"
          element={
            <>
              <Header />
              <AddBoard />
            </>
          }
        />
        <Route
          path="/edit-board-member/:id"
          element={
            <>
              <Header />
              <EditBoard />
            </>
          }
        />
        <Route
          path="/view-blogs"
          element={
            <>
              <Header />
              <Blog />
            </>
          }
        />
        <Route
          path="/add-new-blog"
          element={
            <>
              <Header />
              <AddBlog />
            </>
          }
        />
        <Route
          path="/edit-blog/:id"
          element={
            <>
              <Header />
              <EditBlog />
            </>
          }
        />
        <Route
          path="/admin-events"
          element={
            <>
              <Header />
              <Events />
            </>
          }
        />
        <Route
          path="/add-event"
          element={
            <>
              <Header />
              <AddEvents />
            </>
          }
        />
        <Route
          path="/edit-event/:id"
          element={
            <>
              <Header />
              <EditEvent />
            </>
          }
        />
        <Route
          path="/signin"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <Forgotpassword />
            </>
          }
        />
        <Route
          path="/update-password"
          element={
            <>
              <UpdatePassword />
            </>
          }
        />
        <Route
          path="/change-password"
          element={
            <>
              <Header />
              <ChangePassword />
            </>
          }
        />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </div>
  );
}

export default App;
