import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Signin from "../pages/Signin";


export default function AuthRoute() {
    return (
        <Routes>
            <Route path="/" element={<Signin/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="*" element={<Signin/>}/>
        </Routes>
    )
}