import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from 'components/Main';
import Details from 'components/Details';
import NotFound from 'components/NotFound';

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/details/:gameId" element={<Details />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}