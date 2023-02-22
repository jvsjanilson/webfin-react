import React, {useState, createContext, useContext} from "react";
import api from "../config/api";
import { redirect } from "react-router-dom";


const defaultValue = {
    logado: false,
    nomeLogin: '',
    msgError: '',
    signIn: (email, password) => {},
    sigOut: () => {}
}

const AuthContext = createContext(defaultValue)

const AuthProvider = ({children}) => {
    const [logado, setLogado] = useState(() => {
        const isLogado =  localStorage.getItem('webfin:isLogado')
        
        return !!isLogado
    })

    const [nomeLogin, setNomeLogin] = useState('')
    const [msgError, setMsgError] = useState('')

    const signIn = async (email, password) => {
        
        await api.get('/sanctum/csrf-cookie')
        await api.post('/api/login',{
            email,
            password
        }).then((res) => {
            setMsgError('')
            setNomeLogin(res.data.name)
            setLogado(true)
            localStorage.setItem('webfin:isLogado', true)
        }).catch((e) => {
            setLogado(false)
            setMsgError(e.response.data.message)
            localStorage.removeItem('webfin:isLogado')
        })
    }

    const sigOut = async () => {
       const logout =  await api.post('/api/logout').then(() => {
            setLogado(false)
            localStorage.removeItem('webfin:isLogado')
            return redirect("/")
       })
    }

    return (<AuthContext.Provider value={{logado, nomeLogin, msgError, signIn, sigOut }}>{children}</AuthContext.Provider> )
}

function useAuth() {
    const context = useContext(AuthContext)
    return context
}

export {AuthProvider, useAuth }