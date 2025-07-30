import "./App.css";
import { Signin } from "./components/Signin";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "./store/atoms/user";
import { initializeApp } from "firebase/app";
import { Topbar } from "./components/Topbar";
import { Card } from "./components/Card";
import { Leaderboard } from "./components/Leaderboard";
// import { SubmissionActivity } from "./components/SubmissionActivity";
import { SubmissionActivityList } from "./components/SubmissionActivityList";
import { ProblemList } from "./components/ProblemsList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./components/Landing";
import SubmissionActivity from "./components/SubmissionActivity";
import { About } from "./components/About";

const firebaseConfig = {
  apiKey: "AIzaSyAAEubKiRqY5KkJfwL6wHZnOjl8m5Swy68",
  authDomain: "matrix-f2b76.firebaseapp.com",
  projectId: "matrix-f2b76",
  storageBucket: "matrix-f2b76.firebasestorage.app",
  messagingSenderId: "1009173630547",
  appId: "1:1009173630547:web:537a4f3d1429fa851380a6",
  measurementId: "G-BNZ5SY00ZR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function App() {
  return (
    <RecoilRoot>
      <StoreApp />
    </RecoilRoot>
  );
}

function StoreApp() {
  const [user, setUser] = useRecoilState(userAtom);
  const problemList = [
    { id: "1", problemName: "Two Sum", tags: ["Array", "Hash Table"] },
    { id: "2", problemName: "Reverse String", tags: ["String"] },
    { id: "3", problemName: "Palindrome Check", tags: ["String"] },
    { id: "4", problemName: "Merge Intervals", tags: ["Array", "Sorting"] },
  ];

  useEffect(() => {
    onAuthStateChanged(auth, function (user) {
      if (user && user.email) {
        setUser({
          loading: false,
          user: {
            email: user.email,
          },
        });
      } else {
        setUser({
          loading: false,
        });
        console.log("No logged in user.");
      }
    });
  }, []);

  if (user.loading) {
    return <div>loading...</div>;
  }

  if (!user.user) {
    return (
      <div>
        <Signin />
      </div>
    );
  }

  return (
    <div className="place-items-center grid">
      <div className="max-w-screen-lg w-full">
        <BrowserRouter>
          <Topbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/activity" element={<SubmissionActivityList />} />
            <Route
              path="/problems"
              element={<ProblemList problemList={problemList} />}
            />
            <Route path="leaderboard" element={<Leaderboard />}/>
          </Routes>
        </BrowserRouter>
        {/* <Card>Hi there </Card> */}
        {/* <Leaderboard /> */}
        {/* <SubmissionActivityList /> */}
        {/* <ProblemList problemList={problems}/> */}
      </div>
    </div>
  );
}

export default App;
