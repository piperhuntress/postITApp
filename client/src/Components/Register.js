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
import { registerUser } from "../Features/userSlice";
import { userSchemaValidation } from "../Validations/UserValidation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { localeData } from "moment";

const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //For form validation using react-hook-form
  const {
    register,
    handleSubmit: submitForm, //submitForm will be called when the form is submitted
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  const handleSubmit = (data) => {
    // 'data' is an object that contains the form data collected by react-hook-form
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    dispatch(registerUser(userData));
    navigate("/");
    console.log(data);
  };

  return (
    <Container fluid>
      <Row className="appTitle">
        <Col md="12"></Col>
      </Row>
      <Row className="formrow">
        <Col className="columndiv1" lg="6">
          {/* Execute first the submitForm function and if validation is good execute the handleSubmit function */}
          <form className="div-form">
            <div className="appTitle">
              <img src={Logo} />
            </div>
            <section className="form">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name..."
                  {...register("name", {
                    value: name,
                    onChange: (e) => setname(e.target.value),
                  })}
                />
                <p className="error">{errors.name?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email..."
                  {...register("email", {
                    value: name,
                    onChange: (e) => setemail(e.target.value),
                  })}
                />
                <p className="error">{errors.email?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password", {
                    value: name,
                    onChange: (e) => setpassword(e.target.value),
                  })}
                />
                <p className="error">{errors.password?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password..."
                  {...register("confirmPassword", {
                    value: name,
                    onChange: (e) => setconfirmPassword(e.target.value),
                  })}
                />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
              <Button
                color="primary"
                className="button"
                onClick={submitForm(handleSubmit)}
              >
                Register
              </Button>
            </section>
          </form>
        </Col>
        <Col className="columndiv2" lg="6">
          <img src={image1} className="loginImage" />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
