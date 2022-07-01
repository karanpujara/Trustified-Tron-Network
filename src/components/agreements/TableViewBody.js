import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ethers } from "ethers";
import { TRON } from "../../network/Network";
import { AgreementAbi } from "../../contracts/config";
import Label from "../Label";
import TableRowView from "./TableRowView";
import { ToastContainer, toast } from "react-toastify";
import { NotificationContext } from "../../context/Notification";
import Web3 from "web3";

function TableViewBody(props) {
  const [contractState, setContractState] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [canloading, setCanLoading] = React.useState(false);
  const [chainId, setChainId]= useState();
  const [update, setUpdate]= useState(false);

  useEffect(()=>{ 
  },[update,contractState])

  const notificationContext = React.useContext(NotificationContext);
  const { sendNotifications } = notificationContext;

  const isBuyer = contractState
    ? tronWeb.address.fromHex(props.currentAccount).toLowerCase() === tronWeb.address.fromHex(contractState.buyer).toLowerCase()
    : null;
  const isLocked = contractState
    ? contractState.buyerStake && contractState.sellerStake
    : null;
  const noCancel = contractState
    ? !contractState.buyerCancel && !contractState.sellerCancel
    : null;

  const getStatus = () => {
    if (contractState.active && isLocked) return "Active";
    else if (contractState.active && !isLocked) return "Unlocked";
    else if (contractState.cancelled) return "Cancelled";
    return "Completed";
  };

  const isStaked = () => {
    if (isBuyer && contractState.buyerStake) return true;
    if (!isBuyer && contractState.sellerStake) return true;
    return false;
  };

  const isCancelled = () => {
    if (isBuyer && contractState.buyerCancel) return true;
    if (!isBuyer && contractState.sellerCancel) return true;
    return false;
  };

  const btnConfirm = contractState && isBuyer && isLocked && noCancel;
  const btnStake = contractState && !isLocked && !isStaked();
  const btnRevokeStake = contractState && !isLocked && isStaked();
  const btnCancel = contractState && isLocked && !isCancelled();
  const btnRevokeCancel = contractState && isLocked && isCancelled();

   

  let instance =  tronWeb.contract(AgreementAbi, props.contractAddress);

  const stake = async () => {
    setLoading(true);
    let txn;
    try {
      let per;
      let stake = Number(contractState.price);
      if (isBuyer) {
        per = Number(contractState.statePercent);
      } else {
        per = Number(contractState.sellerPercent);
      }
      stake = (stake * per) / 100;
      const formattedPrice =tronWeb.toSun(stake.toString());  
      txn = await instance.stake().send({
        feeLimit: 10000000000,
        callValue:formattedPrice 
      });  
      // const data = {
      //   to: props.currentAccount,
      //   message: `You stacked ${stake} Successfully!`,
      // };
      // await sendNotifications(data);
      toast.success("Successfully stake amount!", { position: "top-right" });

      setLoading(false);
      setUpdate(!update);
    } catch (err) {
      console.log(err,"stake")
      toast.error(err, { position: "top-right" });
      setLoading(false);
    } 
  };

  const withdrawStake = async () => {
    setLoading(true);
    let txn;
    try {
      txn = await instance.revokeStake().send({
        feeLimit: 10000000000,
        callValue:0,
        
      });  
      console.log(txn,"txn");
      // const data = {
      //   to: props.currentAccount,
      //   message: `Withdraw your stake amount!`,
      // };
      // await sendNotifications(data);
      toast.success("Successfully withdraw your stake amount!", {
        position: "bottom-right",
      });
      setLoading(false);
      setUpdate(!update);
    } catch (err) {
      setLoading(false);

      toast.error(err, { position: "bottom-right" });
      console.log(err,"withdrw");
    }
  };

  const cancel = async () => {
    setCanLoading(true);
    let txn;

    try {
      txn = await instance.cancel().send({
        feeLimit: 10000000000,
        callValue:0,
        
      });   
      toast.success("Successfully cancel your agreement", {
        position: "bottom-right",
      });
      setCanLoading(false);
      setUpdate(!update);
    } catch (err) {
      setCanLoading(false);
      toast.error(err, { position: "top-right" });
    }
  };

  const revokeCancel = async () => {
    setLoading(true);
    let txn;

    try {
      txn = await instance.revokeCancellation().send({
        feeLimit: 10000000000,
        callValue:0,
        
      });  
      toast.success("successfully revoke your stake!", {
        position: "bottom-right",
      });
      setLoading(false);
      setUpdate(!update);
    } catch (err) {
      toast.error(err, { position: "top-right" });
      setLoading(false);
      console.log(err);
    }
  };

  const confirm = async () => {
    setLoading(true);
    let txn;

    try {
      txn = await instance.confirm().send({
        feeLimit: 10000000000,
        callValue:0,
        
      }); 
      toast.success(" Successfully confirm your contract", {
        position: "bottom-right",
      });
      setLoading(false);
      setUpdate(!update);
    } catch (err) {
      toast.error(err, { position: "top-right" });
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(async() => { 
    // const networkId = window.ethereum.networkVersion;
    // setChainId(networkId);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const agreementContract = new ethers.Contract(
    //   props.contractAddress,
    //   AgreementAbi,
    //   signer
    // );

    let instance = await tronWeb.contract(AgreementAbi, props.contractAddress); 

    const cleanAgreement = (agreementDetails) => {
      let cleanAgreement = {
        active: agreementDetails.active,
        cancelled: agreementDetails.cancelled,
        buyer: agreementDetails.buyer,
        seller: agreementDetails.seller,
        buyerCancel: agreementDetails.buyerCancel,
        sellerCancel: agreementDetails.sellerCancel,
        buyerStake: agreementDetails.buyerStake,
        sellerStake: agreementDetails.sellerStake,
        address: agreementDetails.agreAddress,
        statePercent: agreementDetails.statePercent,
        sellerPercent: agreementDetails.sellerPercent,
        price: tronWeb.fromSun(agreementDetails.salePrice),
        title: agreementDetails.title,
        description: agreementDetails.description,
      };
      return cleanAgreement;
    };

    const getLatestData = async () => {
      let agreementDetails = await instance.getStatus().call(); 
      setContractState(cleanAgreement(agreementDetails));
    };

    getLatestData();

    // agreementContract.on("AgreementStateChanged", (buyer, seller, state) => {
    //   setContractState(cleanAgreement(state));
    // });
  }, [props.contractAddress,update, contractState]);

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

  if (contractState != null) {
    return (
      <TableBody>
        <ToastContainer />
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {contractState.title.slice(0, 20)}
          </TableCell>
          <TableCell>{truncate(tronWeb.address.fromHex(contractState.buyer))}</TableCell>
          <TableCell>{truncate(tronWeb.address.fromHex(contractState.seller ))}</TableCell>
          <TableCell>
            <Label
              variant="ghost"
              color={
                (getStatus() === "Cancelled" && "error") ||
                (getStatus() === "Active" && "success") ||
                (getStatus() === "Unlocked" && "warning") ||
                (getStatus() === "Completed" && "info")
              }
            >
              {getStatus()}
            </Label>
          </TableCell>
          <TableCell>
            <a
              href={`${TRON.blockExplorerUrls[0]}/?_ga=2.69625744.1224446107.1655814202-102138659.1655814202#/contract/${tronWeb.address.fromHex(contractState.address)}/internal-transactions`}
              target="_blank"
              rel="noreferrer"
            >
              <OpenInNewIcon />
            </a>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Stack>
                  <Typography variant="h4" gutterBottom component="h2">
                    Agreement Details
                  </Typography>{" "}
                  <Typography variant="h6" gutterBottom component="h2">
                    {contractState.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom component="h2">
                    {contractState.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom component="h2">
                    Total Amount: {contractState.price} TRX 
                  </Typography>
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 3 }}
                  justifyContent="flex-start"
                >
                  <TableRowView
                    title="Buyer"
                    address={contractState.buyer}
                    percent={contractState.statePercent}
                    amount={contractState.price}
                    staked={contractState.buyerStake}
                    currentAdd={props.currentAccount}
                  />
                  <TableRowView
                    title="Seller"
                    address={contractState.seller}
                    percent={contractState.sellerPercent}
                    amount={contractState.price}
                    staked={contractState.sellerStake}
                    currentAdd={props.currentAccount}
                  />
                </Stack>

                <Stack sx={{ "& button": { my: 2 } }}>
                  {contractState.active && (
                    <div className="action-button-container">
                      {btnStake && (
                        <LoadingButton
                          size="large"
                          loading={loading}
                          variant="contained"
                          loadingIndicator={
                            <CircularProgress color="primary" size={24} />
                          }
                          onClick={stake}
                        >
                          Stake
                        </LoadingButton>
                      )}
                      {btnRevokeStake && (
                        <LoadingButton
                          size="large"
                          loading={loading}
                          variant="contained"
                          loadingIndicator={
                            <CircularProgress color="primary" size={24} />
                          }
                          onClick={withdrawStake}
                        >
                          Withdraw Stake
                        </LoadingButton>
                      )}
                      {btnCancel && (
                        <LoadingButton
                          size="large"
                          style={{ margin: "0 10px" }}
                          loading={canloading}
                          variant="contained"
                          loadingIndicator={
                            <CircularProgress color="primary" size={24} />
                          }
                          onClick={cancel}
                        >
                          Cancel
                        </LoadingButton>
                      )}
                      {btnRevokeCancel && (
                        <LoadingButton
                          size="large"
                          loading={loading}
                          variant="contained"
                          loadingIndicator={
                            <CircularProgress color="primary" size={24} />
                          }
                          onClick={revokeCancel}
                        >
                          Revoke Cancel
                        </LoadingButton>
                      )}
                      {btnConfirm && (
                        <LoadingButton
                          size="large"
                          style={{ margin: "10px" }}
                          loading={loading}
                          variant="contained"
                          loadingIndicator={
                            <CircularProgress color="primary" size={24} />
                          }
                          onClick={confirm}
                        >
                          Finish
                        </LoadingButton>
                      )}
                    </div>
                  )}
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    return "";
  }
}

export default TableViewBody;
