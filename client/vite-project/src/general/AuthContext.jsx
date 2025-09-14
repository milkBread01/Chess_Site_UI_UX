import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const Auth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('Auth Err');        
    }
    return context;
}

export const AuthProvider = ({}=>{
    
    useEffect(()=>{
        async function chechAuthStatus(){
            
        }
    })
})