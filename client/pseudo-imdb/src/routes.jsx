import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Movie from "./components/Movies/Movie"
import Favorites from "./components/Favorites/Favorites"
import Profile from "./components/Profile/Profile"
import MovieInformation from "./components/Movies/MovieInformation"

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
          path='profile'
          element={<Profile />}
        />
        <Route 
          path='movie/:name'
          element={<MovieInformation />}
        />
    </Routes>
  )
}

export default AppRoutes