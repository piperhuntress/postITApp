import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import user from "../Images/user.png";

import {
  Col,
  Container,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
} from "reactstrap";

import { register, updateProfilePic, updateUser } from "../Features/userSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* State variable from store */
  const email = useSelector((state) => state.user.user.email);
  const name = useSelector((state) => state.user.user.name);
  const password = useSelector((state) => state.user.user.password);
  const userId = useSelector((state) => state.user.user._id);
  const profilePic = useSelector((state) => state.user.user.profilePic);
  const defaultImage = "http://localhost:3001/uploads/user.png";
  const picURL = "http://localhost:3001/uploads/" + profilePic;
  /* State variables for user input */
  const [userName, setUserName] = useState(
    useSelector((state) => state.user.user.name)
  );
  const [Email, setEmail] = useState(
    useSelector((state) => state.user.user.email)
  );
  const [Password, setPassword] = useState(
    useSelector((state) => state.user.user.password)
  );
  const [Password2, setPassword2] = useState(
    useSelector((state) => state.user.user.password)
  );
  const [profPicFileName, setprofPicFileName] = useState("");

  useEffect(() => {
    if (!email) navigate("/"); //protect the route
  }, []);

  const handleUpdate = () => {
    const userData = {
      userId: userId,
      name: userName,
      password: Password,
    };
    dispatch(updateUser(userData));
    navigate("/profile");
  };

  const handlePicSelect = (e) => {
    // Use e.target.files[0] to get the file itself
    const uploadFile = e.target.files[0];
    if (!uploadFile) alert("No file uploaded");
    else setprofPicFileName(e.target.files[0]);
  };

  const handlePicUpload = () => {
    console.log(profPicFileName);
    if (profPicFileName) {
      const formData = {
        userId: userId,
        profPic: profPicFileName,
      };

      dispatch(updateProfilePic(formData));
    } else alert("No file uploaded");
  };

  return (
    <Row>
      <Col md={{ size: 2 }} className="userInfos">
        {profilePic ? (
          <img src={picURL} className="postUserImage user" />
        ) : (
          <img src={defaultImage} className="postUserImage user" />
        )}
        <h1>{name}</h1>
        {email} <br />
        <br />
        <Form>
          <input
            type="file"
            name="profPicFileName"
            onChange={handlePicSelect}
          />
          <Button color="primary" className="button" onClick={handlePicUpload}>
            Update Photo
          </Button>
        </Form>
      </Col>
      <Col md={{ size: 8 }}>
        <Form className="div-form">
          <div className="appTitle"></div>
          Update Profile
          <FormGroup>
            <Label for="name" className="smalltext">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Name..."
              value={userName}
              type="text"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email" className="smalltext">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="Email..."
              type="email"
              value={email}
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
              value={Password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password2" className="smalltext">
              Confirm Password
            </Label>
            <Input
              id="password2"
              name="password2"
              placeholder="Confirm Password..."
              type="password"
              value={Password}
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Button color="primary" className="button" onClick={handleUpdate}>
              Update Profile
            </Button>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
};

export default Profile;
