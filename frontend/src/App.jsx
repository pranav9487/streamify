import React from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/pageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import FriendsPage from "./pages/FriendsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;
  // console.log("isAuthenticated : ", isAuthenticated);
  // console.log("isOnboarded : ", isOnBoarded);
  // console.log(authData)

  const {theme} = useThemeStore();
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className=" h-screen " data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
              <HomePage />
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        {/* <Route path="/onboarding" element={isAuthenticated ?<OnboardingPage />:<Navigate to="/login"/>} /> */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              isOnBoarded ? (
                <Navigate to="/" />
              ) : (
                <OnboardingPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnBoarded ?
            <CallPage/> 
             : <Navigate to={isAuthenticated?"/onboarding" : "/login"} />}
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated && isOnBoarded ?
            <Layout showSidebar={false}>
              <ChatPage />
               </Layout>
             : <Navigate to={isAuthenticated?"/onboarding" : "/login"} />}
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
            <NotificationsPage />
            </Layout>
          ) : <Navigate to={isAuthenticated? "/onboarding":"/login"} />
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
             <FriendsPage />
            </Layout>
          ) : <Navigate to={isAuthenticated? "/onboarding":"/login"} />
          }
        />
        <Route
          path="/search"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar={true}>
             <SearchPage />
            </Layout>
          ) : <Navigate to={isAuthenticated? "/onboarding":"/login"} />
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
