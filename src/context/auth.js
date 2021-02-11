import React, {useReducer,createContext} from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
    user:null
}

if(localStorage.getItem('jwt-token')){
    const decodedToken = jwtDecode(localStorage.getItem('jwt-token'));

    if(decodedToken.exp * 1000 < Date.now())
    {
        localStorage.removeItem('jwt-token');
    }else{
        initialState.user=decodedToken;
    }
}

const AuthContext = createContext({
    user:null,
    login: (data)=>{},
    logout: ()=>{}
})

function authReducer(state,action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user:action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state,dispatch] = useReducer(authReducer,initialState);

    function login(data){
        localStorage.setItem('jwt-token',data.token);
        dispatch({
            type:'LOGIN',
            payload:data
        })
    }

    function logout(){
        localStorage.removeItem('jwt-token');
        dispatch({
            type:'LOGOUT'
        })
    }

    return(
        <AuthContext.Provider
        value={{user:state.user,login,logout}}
        {...props}
        />
    )
}

export {AuthContext,AuthProvider}