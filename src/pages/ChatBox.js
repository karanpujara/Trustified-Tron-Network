import { Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Page from "src/components/Page";
import { AppWeeklySales } from "src/sections/@dashboard/app";
import { makeStyles } from "@mui/styles";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useParams } from "react-router-dom";
import moment from "moment";
import { identity } from "lodash";
import ChatUserList from "src/components/chatbox/ChatUserList";
import { Web3ModalContext } from "src/context/Web3Modal";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import Autocomplete from '@mui/material/Autocomplete';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "75vh",
    backgroundColor: '#fff',
    boxShadow: "0 1px 2px 0 rgb(145 158 171 / 24%)",
    borderRight: "1px solid #e0e0e0",
    borderLeft: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    borderRadius: "16px",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "60vh",
    overflowY: "auto",
  },
  senderMsgBox: {
    borderRadius: "0px 15px 15px 20px",
    background: "#eee",
    padding: "10px",
  },
  recieveMsgBox: {
    borderRadius: "20px 15px 0 15px",
    background: "aliceblue",
    padding: "10px",
  },
});

function ChatBox() {
  const { id } = useParams();
  const classes = useStyles();
  const { Moralis, user } = useMoralis();
  const [message, setMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [udata, setData] = useState([]);
  const Msg = Moralis.Object.extend("Messages");
  const ChatHistory = Moralis.Object.extend("ChatHistory");
  const chatH = new ChatHistory();
  const chatQuery = new Moralis.Query(ChatHistory);
  const [handleId, setHandleId] = useState("");

  const web3ModalContext = React.useContext(Web3ModalContext);
  const { userAdd } = web3ModalContext;

  const ChatMsg = Moralis.Object.extend("ChatMsg");
  const chat = new ChatMsg();

  const UserProfile = Moralis.Object.extend("UserProfile");
  const userQuery = new Moralis.Query(UserProfile);


  const query = new Moralis.Query(Msg);
  const msg = new Msg();
  const { data, error, isLoading } = useMoralisCloudFunction("getUsersList");
  const [values, setValues] = useState({ username: "" });
  const [userList, setUserList] = useState();
  const [value, setValue] = React.useState(null);

  
  //add new user in chat list
  const Users = Moralis.Object.extend("User");
  const usersQuery = new Moralis.Query(Users);

  useEffect(async () => {
    // chatQuery.matches("owner",user.id);
    const uData = JSON.parse(JSON.stringify(data));
    const filterUsr = (await uData) && uData.filter((e) => e.objectId === id);
    if (filterUsr != null) {
      id !== undefined &&
        chatQuery.matches("userId", id).matches("owner", user?.id);
      const dd = await chatQuery.find();
      if (dd.length == 0 && id !== undefined) {
        chatH.set("userId", id);
        chatH.set("users", filterUsr);
        chatH.set("owner", user?.id);
        await chatH.save();
        setIsUpdate(!isUpdate);
      }
    }
    id !== undefined && setHandleId(id);
    setIsUpdate(!isUpdate);
  }, [id, isLoading]);

  useEffect(async () => {
    // chatQuery.matches("owner", user?.id);
    // const list = await chatQuery.find();
    // list.map((e) => {
    //   setAllUser(e.attributes.users[0]);
    // });
  }, [isUpdate]);

  // get messages

  // useEffect(async () => {
  //   query
  //     .matches("reciever", handleId)
  //     .matches("sender", user?.id)
  //     .ascending("updatedAt");
  //   const recieverMsg = await query.find();
  //   const rMsg = JSON.parse(JSON.stringify(recieverMsg));

  //   query
  //     .matches("reciever", user?.id)
  //     .matches("sender", handleId)
  //     .ascending("updatedAt");
  //   const senderMsg = await query.find();
  //   const sMsg = JSON.parse(JSON.stringify(senderMsg));

  //   const children = rMsg.concat(sMsg);
  //   setData(children);
  // }, [user, isUpdate, handleId]);

  const sendMessage = async () => {
    if (message && message.length > 0) {
      msg.set("sender", user);
      msg.set("text", message);
      msg.set("reciever", handleId);
      await msg.save();
      setMessage("");
      setIsUpdate(!isUpdate);
    }
  };



  const handleList = (e) => {
    setHandleId(e);
    setIsUpdate(!isUpdate);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(async () => {
    const uList = [];
    const dd = await userQuery.find().then(function (res) {
      res.map((e) => {
        uList.push({ username: e.attributes.username }); 
      })
    });
    setUserList(uList);
  }, [])

  const addNewUser = () => {
    
    userQuery.fullText("username", values.username); 
    userQuery
      .find()
      .then(function (results ) {
        results.map((e)=>{
          setUserList({username: e.attributes.username});
        }) 
        if(results != []){
          toast.success("Created New Chat")
        } else{
          toast.info(`${values.username} is not available`)

        }
      })
  }

  function truncate( str, max, sep ) {
    max = max || 15;
    var len = str.length;
    if(len > max){
        sep = sep || "...";
        var seplen = sep.length;
        if(seplen > max) { return str.substr(len - max) }

        var n = -0.5 * (max - len - seplen);
        var center = len/2;
        return str.substr(0, center - n) + sep + str.substr(len - center + n);
    }
    return str;
} 
 

  return (
    <Page title="Chat | TrustifiedNetwork">


      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogContent style={{ overflowX: "hidden" }}>
          <DialogTitle>Add New Chat</DialogTitle>
          <Stack spacing={3}>
            {/* <TextField
              fullWidth
              label="Enter User Name"
              name="username"
              id="username"
              type="username"
              required
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
              value={values.username}

            /> */}

            <Autocomplete
              id="country-select-demo"
              onChange={(event,newValue) => { 
                  setValue(newValue); 
              }}
              value={value} 
              fullWidth
              options={userList}
              autoHighlight 
              getOptionLabel={(option) => option.username}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.username}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select User"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Stack>
          <DialogActions>
            < Button
              type="button"
              variant="contained"
              // loading={formik.isSubmitting}
              // disabled={props.loading}
              onClick={addNewUser}
            >
              Add Chat
            </ Button>
            <Button onClick={handleClose} variant="contained">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>


      <Container maxWidth="xl">
        <Box sx={{ pb: 2 }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h2">Messages</Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}

          >
            Add New Chat
          </Button>
        </Box>
        <Grid container className={classes.chatSection}>
          <Grid item xs={3} className={classes.borderRight500}>
            <List>
              <ListItem button key="RemySharp">
                <ListItemIcon>
                  <Avatar
                    alt={userAdd ? truncate(userAdd) : "user"}
                    src={user ? user.attributes.Avatar?.url : "/images/lg.png"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={userAdd ? truncate(userAdd) : "username"}
                ></ListItemText>
              </ListItem>

            </List>
            <Divider />
            <Grid item xs={12} style={{ padding: "10px" }}>
              <TextField
                id="outlined-basic-email"
                label="Search"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Divider />
            <List>
              <ChatUserList
                usersList={allUser && allUser}
                handleList={handleList}
              />
            </List>
          </Grid>
          <Grid item xs={9}>
            <List className={classes.messageArea}>
              {udata &&
                handleId !== "" &&
                udata
                  .sort((a, b) => (a.updatedAt < b.updatedAt ? -1 : 1))
                  .map((msg) => {
                    return (
                      <ListItem key={msg.objectId}>
                        <Grid container>
                          <Grid item xs={12}>
                            <ListItemText
                              className={
                                handleId == msg.reciever &&
                                  user?.id == msg.sender.objectId
                                  ? classes.recieveMsgBox
                                  : classes.senderMsgBox
                              }
                              align={
                                handleId == msg.reciever &&
                                  user?.id == msg.sender.objectId
                                  ? "right"
                                  : "left"
                              }
                              primary={msg.text}
                            ></ListItemText>
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText
                              align={
                                handleId == msg.reciever &&
                                  user.id == msg.sender.objectId
                                  ? "right"
                                  : "left"
                              }
                              secondary={moment(msg.updatedAt).format(
                                "h:mm:ss a"
                              )}
                            ></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
            </List>
            <Divider />
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={11} align="left">
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                />
              </Grid>
              <Grid xs={1} align="right">
                <Fab onClick={sendMessage} color="primary" aria-label="add">
                  <Send />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default ChatBox;
