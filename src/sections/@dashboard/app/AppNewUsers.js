// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import { useMoralis } from 'react-moralis';
import React, { useEffect, useState } from 'react';
import { AgreementAvaxAddress, AgreementBscAddress, AgreementMumbaiAddress, AgreementRopestenAddress } from "src/contracts/contract";
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
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1352831;

export default function AppNewUsers() {
  const { Moralis, user } = useMoralis();
  const [agree, setAgree] = useState();
  const web3Modal = React.useContext(Web3ModalContext);
  const { userAdd } = web3Modal;


  useEffect(async () => {
    const block = tronWeb.trx.getBlock('').then(result => {
      console.log(result.transactions.length, "res"); 
      setAgree(result.transactions.length); 
    }); 
  }, []);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="ant-design:transaction-outlined" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3" color="#000">{fShortenNumber(agree)}</Typography>
      <Typography variant="subtitle2" color="#000" sx={{ opacity: 0.72 }}>
        Crypto Transactions
      </Typography>
    </RootStyle>
  );
}
