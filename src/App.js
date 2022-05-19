import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/navbar.component";
import Welcome from "./components/welcome/welcome.component";
import Register from "./components/register/register.component";
import Home from "./components/home/home.component";
import Login from "./components/login/login.component";
import AddJournal from "./components/addJournal/addJournal.component";
import EditJournal from "./components/editJournal/editJournal.component";
import ViewJournal from "./components/viewJournal/viewJournal.component";
import AddBackground from "./components/addBackground/addBackground.component";
import AddProfileImg from "./components/addProfileImg/addProfileImg.component";

function App() {
	return (
		<Router>
            <Navbar server={process.env.REACT_APP_SERVER}/>
			<div style={{width: "80%", margin: "auto"}}>
				<div className="container-fluid">
				<br />
				<Routes>
					<Route path="/" exact element={<Welcome server={process.env.REACT_APP_SERVER}/>} />
                    <Route path="/register" element={<Register server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/home" element={<Home server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/login" element={<Login server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/addJournal" element={<AddJournal server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/editJournal" element={<EditJournal server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/viewJournal" element={<ViewJournal server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/addBackground" element={<AddBackground server={process.env.REACT_APP_SERVER}/>} />
					<Route path="/addProfileImg" element={<AddProfileImg server={process.env.REACT_APP_SERVER}/>} />
				</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
