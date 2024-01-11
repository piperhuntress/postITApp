import {
  Button,
  Col,
  Label,
  Container,
  Row,
  FormGroup,
  Input,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getPosts, savePost } from "../Features/postSlice";
import bannerImg from "../Images/banner.jpg";

const SharePosts = () => {
  const [postMsg, setpostMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user.user.email);

  const handlePost = async () => {
    const postData = {
      postMsg: postMsg,
      email: email,
    };
    if (postData.postMsg) {
      dispatch(savePost(postData));
      dispatch(getPosts());
      navigate("/home");
      setpostMsg("");
    }
  };

  return (
    <Container className="sharePosts">
      <Row>
        <img src={bannerImg} className="bannerImg" />
      </Row>
      <Row>
        <Col>
          <h1>Share.Connect.</h1>
          <div className="input-button-container">
            <Input
              id="share"
              name="share"
              placeholder="Share your thoughts..."
              type="textarea"
              className="inputPost form-control"
              value={postMsg}
              onChange={(e) => {
                setpostMsg(e.target.value);
              }}
            />
            <Button className="postButton" onClick={handlePost}>
              PostIT
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SharePosts;
