import { useEffect, useState } from "react";
import { Button, Divider, Spin, Modal, message } from "antd";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { useAuth } from "../../utils/hooks/useAuth";
import {
  deleteUserFromFirestore,
  getUserFromFirestore,
  updateProfileName,
} from "../../utils/firebase";
import "../Dashboard/dashboard.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  GithubOutlined,
  GoogleOutlined,
  Loading3QuartersOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@ant-design/icons";

const DashboardMain = () => {
  const { currentUser } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [isNameChanging, setIsNameChanging] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  let accountCreateDate;

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?.uid) {
        const userData = await getUserFromFirestore(currentUser.uid);
        setFirestoreUser(userData);
        setEditNameValue(userData?.displayName || "");
      }
    };
    fetchUser();
  }, [currentUser]);

  const clickHandler = () => setIsNameChanging((prev) => !prev);

  const editNameHandler = async () => {
    try {
      await updateProfileName(editNameValue);
      const updatedUser = await getUserFromFirestore(currentUser.uid);
      setFirestoreUser(updatedUser);
      setIsNameChanging(false);
      message.success("Profile name updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update name.");
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Are you sure you want to delete your account?",
      content: (
        <>
          This action cannot be undone. Your account will be permanently
          deleted.
          <br />
          <br />
          <span style={{ fontStyle: "italic", opacity: 0.8 }}>— Garvit</span>
        </>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          setIsDeleting(true);
          await deleteUserFromFirestore();
          message.success("Account deleted successfully!");
          setTimeout(() => {
            navigate("/"); // ✅ Proper navigation
          }, 1000);
        } catch (error) {
          console.error(error);
          message.error("Error deleting account. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  if (!firestoreUser) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Format Firestore Timestamp
  const timestamp = firestoreUser.createdAt;
  if (timestamp?.seconds) {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
    );
    accountCreateDate = {
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  }

  return (
    <main className="dashboard">
      <h1>This is Dashboard</h1>

      <div className="userCard">
        <h2>User Details</h2>
        <Divider style={{ margin: "10px 0" }} />

        <div className="user-head">
          <div className="profile-container">
            <img
              src={
                firestoreUser.photoURL ||
                "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
              }
              alt="user profile"
            />
          </div>

          <div className="user-name">
            <div className="name-input-container">
              {!isNameChanging ? (
                <p>
                  <b>
                    {firestoreUser.displayName || (
                      <Loading3QuartersOutlined spin />
                    )}
                  </b>
                </p>
              ) : (
                <input
                  onChange={(e) => setEditNameValue(e.target.value)}
                  value={editNameValue}
                />
              )}
            </div>

            <div className="edit-btns-container">
              {isNameChanging && (
                <Button type="text" onClick={editNameHandler}>
                  Save
                </Button>
              )}

              <Button
                icon={!isNameChanging ? <EditOutlined /> : <CloseOutlined />}
                className="edit-btn"
                type="text"
                onClick={clickHandler}
              />
            </div>
          </div>
        </div>

        <p>{firestoreUser.email}</p>

        <Button
          className="logout"
          type="text"
          onClick={() => signOut(auth)}
          icon={<LogoutOutlined />}
        >
          Log Out
        </Button>

        <div className="info">
          <div className="date">
            <p>
              <b>Created at:</b>
            </p>
            <p>
              <CalendarOutlined /> &nbsp;
              {accountCreateDate.date} &nbsp;&nbsp;
              <ClockCircleOutlined /> &nbsp;
              {accountCreateDate.time}
            </p>
          </div>

          <div className="provider">
            <p>
              <b>Provider:</b>
            </p>
            <p>
              {firestoreUser.provider === "google" ? (
                <GoogleOutlined style={{ color: "#DB4437" }} />
              ) : firestoreUser.provider === "github" ? (
                <GithubOutlined style={{ color: "#000" }} />
              ) : (
                <MailOutlined style={{ color: "#1677ff" }} />
              )}
              &nbsp;
              {firestoreUser.provider.charAt(0).toUpperCase() +
                firestoreUser.provider.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <Button
        className="delete"
        onClick={handleDeleteAccount}
        icon={<DeleteOutlined />}
        loading={isDeleting}
      >
        Delete Account
      </Button>
    </main>
  );
};

export default DashboardMain;
