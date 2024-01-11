import user from "../Images/user.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  deletePost,
  getPosts,
  likePost,
  updatePost,
} from "../Features/postSlice";

import moment from "moment";
import { FaUser, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

const Posts = () => {
  const posts = useSelector((state) => state.post.posts);
  const email = useSelector((state) => state.user.user.email);
  const userId = useSelector((state) => state.user.user._id);
  const profilePic = useSelector((state) => state.user.user.profilePic);
  const defaultImage = "http://localhost:3001/uploads/user.png";

  const picURL = "http://localhost:3001/uploads/";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [postMsg, setpostMsg] = useState("");
  const [postId, setpostId] = useState();

  const toggle = (msg, id) => {
    setModal(!modal);
    setpostMsg(msg);
    setpostId(id);
  };

  useEffect(() => {
    console.log("getpost");
    dispatch(getPosts());
  }, []);

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
    navigate("/home");
  };

  const handleUpdate = async () => {
    const postData = {
      id: postId,
      postMsg: postMsg,
      email: email,
    };
    dispatch(updatePost(postData));
    dispatch(getPosts());
    navigate("/home");
  };

  const handleLikePost = (postId) => {
    const postData = {
      postId: postId,
      userId: userId,
    };
    dispatch(likePost(postData));
    navigate("/home");
  };
  return (
    <div className="postsContainer">
      <table className="table table-striped">
        <tbody>
          {posts.map((post) => (
            <tr>
              <td className="col-user-post">
                {post.user &&
                  post.user.length > 0 &&
                  post.user.map((user) => (
                    <div key={user._id} className="userContainer">
                      <img
                        src={
                          user.profilePic
                            ? picURL + user.profilePic
                            : defaultImage
                        }
                        className="postUserImage user"
                        alt="User Profile"
                      />
                      <p className="postByName">{user.name}</p>
                    </div>
                  ))}

                <br />
              </td>
              <td>
                <span className="postDate small">
                  {moment(post.createdAt).fromNow()}
                  {email === post.email ? (
                    <>
                      <a
                        href="#"
                        onClick={() => toggle(post.postMsg, post._id)}
                      >
                        <FaPencilAlt />
                      </a>
                      <a href="#">
                        <FaTrashAlt onClick={() => handleDelete(post._id)} />
                      </a>
                    </>
                  ) : null}
                </span>
                <div className="postMsg">{post.postMsg}</div>
                <div>
                  <a
                    href="#"
                    onClick={() => handleLikePost(post._id)}
                    className="likes"
                  >
                    Likes
                  </a>
                  {post.likes.count}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal  */}
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>PostIT</ModalHeader>
        <ModalBody>
          <Input
            id="share"
            name="share"
            type="textarea"
            className="inputPost form-control"
            value={postMsg}
            onChange={(e) => {
              setpostMsg(e.target.value);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              handleUpdate();
              toggle();
            }}
          >
            Update Post
          </Button>
        </ModalFooter>
      </Modal>
    </div> /* End of posts */
  );
};

export default Posts;
