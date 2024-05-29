import React, { useState } from "react";
import "./Login.css";
import {Typography,Button} from "@mui/material";
import {Link} from "react-router-dom";


const Login = () => {

     const [email, setEmail] = useState("");
     const [password, setpassword] = useState("");

   const loginHandler = (e) =>{
      e.preventDefault();

      console.log(email,password);
   };


     return (
        <div className="login">
           <form  className="loginForm" onSubmit={loginHandler}>
                <Typography variant = "h4"  style={{padding: "1vmax"}}>
                     Social Media App
                     </Typography>

                 <input type="email" name='email' placeholder='E-mail...' required value={email} onChange={(e) =>setEmail(e.target.value)} />

                 <input type="password" name='pwd' placeholder='Password...'  required value={password} onChange={(e) =>setpassword(e.target.value)}/>

                 <Link to = "/forgot/password">
                    <Typography>Forgot Password ?</Typography>
                 </Link>

                 <Button type="submit">Login</Button>

                 <Link to = "/register">
                    <Typography>Don't have account ?  Sign Up</Typography>
                 </Link>

           </form>
        </div>
     );
};


export default Login;