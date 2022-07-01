// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
//
import Iconify from '../../../components/Iconify';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3ModalContext } from "src/context/Web3Modal";
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.main
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1723315;

export default function AppItemOrders() { 
  const [agree,setAgree]= useState();  
  const web3Modal = React.useContext(Web3ModalContext);
  const { userAdd } = web3Modal;

  useEffect(async()=>{  
    var balance = await tronWeb.trx.getBalance(userAdd);
    balance = balance / (10 ** 6);
    setAgree(balance);   
       
   
  },[]);
  
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="gridicons:multiple-users" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3"  color="#000">{agree && agree.toFixed(2)} TRX</Typography>
      <Typography variant="subtitle2"  color="#000" sx={{ opacity: 0.72 }}>
       Your Current Balance
      </Typography>
    </RootStyle>
  );
}
