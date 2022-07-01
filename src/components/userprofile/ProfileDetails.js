import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useMoralis, useMoralisCloudFunction, useMoralisFile } from 'react-moralis';
import { toast, ToastContainer } from 'react-toastify';
import { Web3ModalContext } from "src/context/Web3Modal";
import { create } from 'ipfs-http-client'


const states = [
  {
    value: 'individual',
    label: 'Individual'
  },
  {
    value: 'componey',
    label: 'Componey'
  },
  {
    value: 'both',
    label: 'Both'
  }
];

const Input = styled('input')({
  display: 'none',
});


export const ProfileDetails = (props) => {
  const { Moralis } = useMoralis();
  const [avatar, setAvatar] = useState('');
  const [userDta, setUserDta] = useState({});
  const [update, setIsUpdate] = useState(false);
  const web3ModalContext = React.useContext(Web3ModalContext);
  const { userAdd } = web3ModalContext;

  const UserProfile = Moralis.Object.extend("UserProfile");
  const userProfile = new UserProfile();
  const usersQuery = new Moralis.Query(UserProfile);


  const { data, error, isLoading, isFetching } = useMoralisCloudFunction("getUsersList");

  useEffect(async () => {
    const uData = JSON.parse(JSON.stringify(data));
    const filterUsr = await uData && uData.filter((e) => {
      if (e.address === userAdd) {
        setUserDta(e);
      }
    })
  }, [userAdd, data, update, isLoading, isFetching]);

  const client = create('https://ipfs.infura.io:5001/api/v0') 
  const [values, setValues] = useState(
    {
      username: "",
      email: "",
      bio: "",
      skills: "",
      purpose: ""
    }
  );

  useEffect(() => {
     setValues({
      username: userDta.username,
      email: userDta.email,
      bio: userDta.bio,
      skills: userDta.skills,
      purpose: userDta.purpose
    });
    setAvatar(userDta.Avatar);
  },[userDta])

   

  async function onChangeAvatar(e) {
    const file = e.target.files[0];
    const added = await client.add(file)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    if (url) {
      setAvatar(url);
    } else {
      setAvatar(userDta.Avatar);
    }
    // setAvatar(user.attributes.Avatar._url);

  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    usersQuery.equalTo("address", userAdd);
    const results = await usersQuery.first(); 

    if (results) {
      results.set('username', values.username);
      results.set('address', userAdd);
      results.set('Avatar', avatar)
      results.set('email', values.email)
      results.set('bio', values.bio)
      results.set('skills', values.skills)
      results.set('purpose', values.purpose)
      await results.save();
      props.isUp(!props.up);
      toast.success("Successfully update the profile!");
    } else {
      userProfile.set('username', values.username);
      userProfile.set('address', userAdd);
      userProfile.set('Avatar', avatar)
      userProfile.set('email', values.email)
      userProfile.set('bio', values.bio)
      userProfile.set('skills', values.skills)
      userProfile.set('purpose', values.purpose)
      await userProfile.save();
      props.isUp(!props.up);
      toast.success("Successfully create the profile!");
    }
  }

  return (
    <Card   >
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <ToastContainer />
      <Stack direction="row" spacing={3} style={{ justifyContent: 'center', display: 'flex',paddingTop:'20px' }} >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <label htmlFor="icon-button-file">
              <Input accept="image/*" id="icon-button-file" type="file" onChange={onChangeAvatar} />
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          }
        >
          <Avatar sx={{ width: 100, height: 100 }} src={avatar ? avatar : "/images/log.png"} />
        </Badge>

      </Stack>
      
        <CardContent>

          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="@username"
                name="username"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                onChange={handleChange}
                type="text"
                value={values.bio}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Skills"
                name="skills"
                onChange={handleChange}
                required
                type="text"
                value={values.skills}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Purpose of "
                name="purpose"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.purpose}
                variant="outlined"
              >
                {states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            Save details
          </Button>
        </Box> 
    </form>
    </Card>
  );
};
