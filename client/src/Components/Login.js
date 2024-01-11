import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import LoginImage from "../Images/loginImage.jpg";
import Logo from "../Images/logo-t.png";
import image1 from "../Images/image1.jpg";
import Register from "./Register";
import { Link } from "react-router-dom";
import { login } from "../Features/userSlice";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);

  const handleLogin = () => {
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (isSuccess) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [user, isError, isSuccess]);

  return (
    <Container fluid>
      <Row className="appTitle">
        <Col md="12"></Col>
      </Row>
      <Row className="formrow">
        <Col className="columndiv1" md="6">
          <Form className="div-form">
            <div className="appTitle">
              <img src={Logo} />
            </div>
            Login
            <FormGroup>
              <Label for="email" className="smalltext">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                type="email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password" className="smalltext">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="Password..."
                type="password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
              />
            </FormGroup>
            <FormGroup>
              <div className="side">
                <Input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="checkbox"
                />
                <Label for="remember" className="smalltext">
                  Remember Me
                </Label>
              </div>
              <div className="smalltext side">
                <a href="">Forgot Password</a>
              </div>
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="button" onClick={handleLogin}>
                Sign in
              </Button>
            </FormGroup>
            <p className="smalltext">
              No Account?
              <Link to="/register" element={<Register />}>
                Sign Up now.
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
