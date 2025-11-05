import { Button, Divider, Spin } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useAuth } from "../../utils/hooks/useAuth";
import "../Dashboard/dashboard.css";
import { Loading3QuartersOutlined, LogoutOutlined } from "@ant-design/icons";

const DashboardMain = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  if (!currentUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="dashboard">
      <h1>This is Dashboard</h1>

      <div className="userCard">
        <h2>User Details</h2>
        <Divider style={{ margin: "10px 0" }} />

        <div className="user-head">
          <img
            src={
              currentUser.photoURL ||
              "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
            }
            alt="user profile"
          />
          <p>
            <b>
              {currentUser.displayName || <Loading3QuartersOutlined spin />}
            </b>
          </p>
        </div>

        <p>{currentUser.email}</p>

        <Button danger onClick={() => signOut(auth)} icon={<LogoutOutlined />}>
          Log Out
        </Button>
      </div>
    </main>
  );
};

export default DashboardMain;
