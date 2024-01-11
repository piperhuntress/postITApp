import { Col, Container, Row } from "reactstrap";
import User from "./User";
import SharePosts from "./SharePost";
import Departments from "./Dept";
import Posts from "./Posts";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.user.email);

  useEffect(() => {
    if (!email) navigate("/"); //protect the route
  }, []);
  return (
    <>
      <Row>
        <Col md="3">
          <User />
        </Col>
        <Col md="9">
          <SharePosts />
        </Col>
      </Row>
      <Row>
        <Col md="3">
          {/*           <Departments />
           */}{" "}
        </Col>
        <Col md="9">
          <Posts />
        </Col>
      </Row>
    </>
  );
};

export default Home;
