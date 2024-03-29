import React from "react";
import './styles.css';
import Input from "../Input";
import { useState } from 'react';
import Button from "../Button";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {doc,getDoc,setDoc} from 'firebase/firestore';
import { auth ,db , provider } from "../../firebase";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const SignupSignin =()=>{
    const[name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const[confirmPassword,setConfirmPassword] = useState("");
    const[loading,setLoading] = useState(false);
    const[signedUp,setSignedUp] = useState(false);
    const navigate = useNavigate();





    function googleAuth(){

        setLoading(true);
        signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    createDoc(user);
    setLoading(false);
    toast.success("User authenticated!");
    navigate("/dashboard");
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
   
    toast.error(errorMessage);
    setLoading(false);
    // ...
  });
    }
 
    function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        if(password!==confirmPassword){
            toast.error("passwords don't match!");
            setLoading(false);
            return;
        }
        createUserWithEmailAndPassword(auth,email,password).then((userCredential)=>{
            const user = userCredential.user;
            toast.success("User registered successfully");
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        createDoc(user);
        navigate("/dashboard");
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        })
       
         
    }


    function handleLogin(e){
        e.preventDefault();
        setLoading(true);


     signInWithEmailAndPassword(auth,email,password).then((userCredential)=>{
         const user = userCredential.user;
         setEmail("");
         setPassword("");
         toast.success("User Logged In!");
         setLoading(false);
         navigate("/dashboard");
     })
     .catch((error)=>{
         const errorCode = error.code;
         const errorMessage = error.message;
         toast.error(errorMessage);
         setLoading(false);
     })




    }


    async function createDoc(user){
        if(!user)return;

        const useRef = doc(db,"users",user.uid);
        const userData = await getDoc(useRef);

       if(!userData.exists()){
        try{
           await setDoc(doc(db,"users",user.uid),{
              name:user.displayName?user.displayName:name,
              email:user.email,
              createdAt:new Date(),
              photoURL:user.photoURL?user.photoURL:""
           });
        }
        catch(error){
            toast(error.message);
        }
    }
    else toast.info("User already exists!");

    }
    return (
          <>
           { !signedUp &&
        <form onSubmit={handleSubmit} className="signup-wrapper">
           <h2 style={{textAlign:"center", fontSize:"1rem"}}>SIGN UP on <span style={{color:"var(--theme)"}}>Financely.</span></h2>
           <Input type="text" state={name} setState={setName} placeholder="John Doe" label={"Full Name"}></Input>
           <Input type="email" state={email} setState={setEmail} placeholder="johndoe@gmail.com" label={"Email"}></Input>
           <Input type="password" state={password} setState={setPassword} placeholder="Example@123" label={"Password"}></Input>
           <Input type="password" state={confirmPassword} setState={setConfirmPassword} placeholder="Example@123" label={"Confirm Password"}></Input>
           <Button type="submit" disabled={loading}  text={loading?"Loading...":"SignUp with Email"}></Button>
           <p style={{textAlign:"center", fontSize:"0.8rem" }}>or</p>
           <Button onClickFn={googleAuth} disabled={loading}  text={loading?"Loading...":"SignUp with Google"} blue={true}></Button>
           <p style={{textAlign:"center", fontSize:"0.8rem" , paddingInline:"1rem"}}>Already have an account?<span onClick={()=>{setSignedUp(!signedUp)}} className="navigate-btn">click here</span> </p>
            </form>
             }
            
          { signedUp && <form onSubmit={handleLogin} className="signup-wrapper">
            <h2 style={{textAlign:"center", fontSize:"1rem"}}>Log IN to <span style={{color:"var(--theme)"}}>Financely.</span></h2>
            <Input type="email" state={email} setState={setEmail} placeholder="johndoe@gmail.com" label={"Email"}></Input>
            <Input type="password" state={password} setState={setPassword} placeholder="Example@123" label={"Password"}></Input>
            <Button type="submit" disabled={loading}  text={loading?"Loading...":"Login with Email"}></Button>
            <p style={{textAlign:"center"}}>or</p>
            <Button onClickFn={googleAuth} disabled={loading}  text={loading?"Loading...":"Login with Google"} blue={true}></Button>
            <p style={{textAlign:"center" , fontSize:"0.8rem" , paddingInline:"1rem"}}>Don't have an account?<span onClick={()=>{setSignedUp(!signedUp)}} className="navigate-btn">click here</span> </p>

             </form>
        }
            
             </>
        
        
    )
}
export default SignupSignin;