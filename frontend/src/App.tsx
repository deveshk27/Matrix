import "./App.css";
import { Signin } from "./components/Signin";
import { useEffect } from "react";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";


function App() {
  useEffect(() => {
    onAuthStateChanged(auth, function (user) {
      if(user) {
        console.log("This is the user : ", user)
      } else {
        console.log("No logged in user.")
      }
    })
  },[])
  return (
    <>
      <div>
        <Signin />
      </div> 
    </>
  );
}

export default App;
