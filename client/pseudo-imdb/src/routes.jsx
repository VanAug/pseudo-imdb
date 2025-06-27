import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Movie from "./components/Movies/Movie"
import Favorites from "./components/Favorites/Favorites"
import Profile from "./components/Profile/Profile"
import MovieInformation from "./components/Movies/MovieInformation"
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

const AppRoutes = () => {
  return (
    <Routes>
        <Route 
          path='/'
          element={<Movie />}
        />
        <Route 
          path='favorites'
          element={<Favorites />}
        />
        <Route 
          path='profile/:id'
          element={<Profile />}
        />
        <Route 
          path='movie/:id'
          element={<MovieInformation />}
        />
        <Route
          path='/signIn'
          element={<SignIn />}
        />
        <Route
          path='/signUp'
          element={<SignUp />}
        />
    </Routes>
  )
}

export default AppRoutes