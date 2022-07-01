import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisCloudFunction, useMoralisFile } from 'react-moralis';
import { Web3ModalContext } from "src/context/Web3Modal";
 
export const ProfileView = (props) => {
  const { Moralis,user } = useMoralis();
  const [userDta, setUserDta] = useState();
  const web3ModalContext = React.useContext(Web3ModalContext);
  const { userAdd } = web3ModalContext;

  const { data, error, isLoading} = useMoralisCloudFunction("getUsersList");

  useEffect(async () => {
    const uData = JSON.parse(JSON.stringify(data));  
    const filterUsr = uData && uData.filter((e) => {
      if(e.address === userAdd){
        setUserDta(e); 
      }
    })  
  }, [userAdd,data,props.up]);
  
  

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
    <Card  sx={{border:'1px solid #eee'}}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={userDta &&  userDta.Avatar }
            sx={{
              height: 64,
              mb: 2,
              width: 64
            }}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            @{userDta && truncate(userDta.username)}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {userDta && userDta.email}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {userDta && userDta.bio}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {userDta && userDta.skills}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {userDta && userDta.purpose }
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
} 