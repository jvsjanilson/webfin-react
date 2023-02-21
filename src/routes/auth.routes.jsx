import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "../pages/Signin";


export default function AuthRoute() {
    return (
        <Routes>
            <Route path="/" element={<Signin/>}/>
            <Route path="*" element={<Signin/>}/>
        </Routes>
    )
}