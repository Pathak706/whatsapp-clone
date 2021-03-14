import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "./Firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import { storage } from "./Firebase";

import { connect } from "react-redux";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import VideoCall from "./VideoCall";
import Modal from '@material-ui/core/Modal';

function Chat({ user }) {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  //   const [{ user }, dispatch] = useStateValue();

  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const [videoCall, setVideoCall] = useState(false);
  const [open, setOpen] = React.useState(false);

  let inputElement = useRef();

  console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
          setOpen(false);
      }
    );
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);


  const handleFileUpload = () => {

    return (
      <div className="fileUpload">
        <form onSubmit={handleFireBaseUpload}>
        <input
            type="file"
            onChange={handleImageAsFile}
          />
          <button>upload to firebase</button>
        </form>
      </div>
    )


  }


  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>>>>>", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };
  console.log("imageAsUrl >>>", imageAsUrl);
  return videoCall ? (
    <VideoCall setVideoCall={setVideoCall} />
  ) : roomId ? (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat_headerRight">
          <Tooltip title="Video call">
            <IconButton
              aria-label="Video call"
              onClick={() => setVideoCall(true)}
            >
              <VideocamOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Audio call">
            <IconButton aria-label="Audio call">
              <CallOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_receiver"
            } `}
            key={message.id}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton onClick={() => setOpen(true)}>
          <AttachFileIcon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <input
            type="file"
            onChange={handleImageAsFile}
            style={{ display: "none" }}
            ref={input => inputElement = input}
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        {/* <form onSubmit={handleFireBaseUpload}>
          <button>upload to firebase</button>
        </form> */}
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="fileUpload">
        <form onSubmit={handleFireBaseUpload}>
        <input
            type="file"
            onChange={handleImageAsFile}
          />
          <button>upload to firebase</button>
        </form>
      </div>
      </Modal>


    </div>
  ) : (
    <div className="chat">
      <p>Please select room to start conversation</p>
    </div>
  );
}

const mapStateToProps = ({ userReducer }) => {
  return {
    user: userReducer.user,
  };
};

export default connect(mapStateToProps)(Chat);
