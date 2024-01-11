import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Register from "./Components/Register";
import Home from "./Components/Home";
import { Container, Row } from "reactstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Components/Profile";
import { useSelector, useDispatch } from "react-redux";
import Banner from "./Components/Banner";

const App = () => {
  const email = useSelector((state) => state.user.user.email);
  return (
    <Container fluid>
      <Router>
        {/* First Row */}
        <Row>
          {email ? (
            <>
              <Header />
            </>
          ) : null}
        </Row>

        {/* Second Row */}
        <Row className="main">
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Router>
    </Container>
  );
};

export default App;
