import user from "../Images/user.png";
import { useSelector, useDispatch } from "react-redux";

const User = () => {
  const email = useSelector((state) => state.user.user.email);
  const name = useSelector((state) => state.user.user.name);
  const profilePic = useSelector((state) => state.user.user.profilePic);
  const defaultImage = "http://localhost:3001/uploads/user.png";
  const picURL = "http://localhost:3001/uploads/" + profilePic;

  return (
    <div className="userInfos">
      <div>
        {profilePic ? (
          <img src={picURL} className="userImage" />
        ) : (
          <img src={defaultImage} className="userImage" />
        )}
        <p className="userName">{name}</p>
      </div>
    </div>
  );
};

export default User;
