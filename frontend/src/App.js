import React from "react";
import { Routes, Route} from "react-router-dom";

import Chat from "./pages/Chat.jsx";
import SignIn from "./pages/SignInPage.jsx";
import SignUp from "./pages/SignUpPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Chat />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App;