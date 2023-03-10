import React, {useState, createContext, useContext} from "react";
import api from "../config/api";

const defaultValue = {
    logado: false,
    nomeLogin: '',
    msgError: '',
    isLogged: () => {},
    signIn: (email, password) => {},
    signOut: () => {},
    xCsrfToken: () => {},
}

const AuthContext = createContext(defaultValue)

const AuthProvider = ({children}) => {
    const [logado, setLogado] = useState(() => {
        const isLog =  localStorage.getItem('webfin:isLogado')
        
        return !!isLog
    })

    const [nomeLogin, setNomeLogin] = useState('')
    const [msgError, setMsgError] = useState('')

    const isLogged = async () => {
        const result =  await api.get('/api/user')
            .then((res) => {
                setNomeLogin(res.data.name)
                return true
            })
            .catch(() => false)
        setLogado(result)
    }

    const signIn = async (email, password) => {
        // await api.get('/sanctum/csrf-cookie').then(async response => {
        //         await api.post('/api/login',{
        //         email,
        //         password
        //     }).then((res) => {
        //         setMsgError('')
        //         setNomeLogin(res.data.name)
        //         setLogado(true)
        //         localStorage.setItem('webfin:isLogado', true)
        //     }).catch((e) => {
        //         setLogado(false)
        //         setMsgError(e.response.data.message)
        //         localStorage.removeItem('webfin:isLogado')
        //     }) 
        // })

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

    const xCsrfToken = async () => {
        
        await api.get('/sanctum/csrf-cookie').then(res => console.log(res)) 
    }

    const signOut = async () => {
       const logout =  await api.post('/api/logout').then(() => {
            setLogado(false)
            localStorage.removeItem('webfin:isLogado')
            //return redirect("/")
       })
    }

    return (<AuthContext.Provider value={{logado, nomeLogin, msgError, signIn, signOut, isLogged, xCsrfToken }}>{children}</AuthContext.Provider> )
}

function useAuth() {
    const context = useContext(AuthContext)
    return context
}

export {AuthProvider, useAuth }