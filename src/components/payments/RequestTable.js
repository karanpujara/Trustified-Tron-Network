
import react, { useEffect } from "react";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useMoralis, useWeb3Transfer, useMoralisCloudFunction } from "react-moralis";
import React, { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Web3ModalContext } from "src/context/Web3Modal";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

function RequestTable({ requestData }) {
  const web3Modal = React.useContext(Web3ModalContext);
  const { userAdd } = web3Modal;

  const { user, Moralis } = useMoralis();
  const [userAddress, setUserAddress] = useState('');
  const [reqFrom, setReqform] = useState('');
  const { data, isLoading } = useMoralisCloudFunction("getAllUser");
  const [loading, setLoading]= useState(false);

  function truncate(str, max, sep) {
    max = max || 12;
    var len = str.length;
    if (len > max) {
      sep = sep || "...";
      var seplen = sep.length;
      if (seplen > max) { return str.substr(len - max) }

      var n = -0.5 * (max - len - seplen);
      var center = len / 2;
      return str.substr(0, center - n) + sep + str.substr(len - center + n);
    }
    return str;
  }

  useState(()=>{

  },[requestData,loading])

  const handleSendPayment = async (add) => { 
    setLoading(true);
    var amount = tronWeb.toSun(add.amount); 
    const dd = await  tronWeb.trx.sendTransaction(add.from, amount);  
    setLoading(false);
    toast.success("Payment success!"); 
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requestData && requestData.length == 0 && (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                <h5>No payment requests yet!</h5>
              </TableCell>
            </TableRow>
          )}

          {requestData &&
            requestData.map((request) => (
              <TableRow>
                <TableCell>{truncate(request.from)}</TableCell>
                <TableCell>{truncate(request.to)}</TableCell>
                <TableCell>{request.token}</TableCell>
                <TableCell>{request.amount}</TableCell>
                <TableCell>{request.message}</TableCell>
                <TableCell>
                  {request.status == 0 ? "Pending" : "Completed"}
                </TableCell>
                <TableCell>
                  {request.to == userAdd ? (
                     
                      <LoadingButton
                        size="large"
                        loading={loading}
                        variant="contained"
                        loadingIndicator={
                          <CircularProgress color="primary" size={24} />
                        }
                        onClick={() => handleSendPayment(request)}
                      >
                        Pay
                      </LoadingButton>
                   
                    // <Button
                    //   //   color="primary"
                    //   size="large"
                    //   //   type="submit"
                    //   variant="contained"
                    //   onClick={() => handleSendPayment(request)}
                    //   style={{ marginTop: "30px" }}
                    // >
                    //   Pay
                    // </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RequestTable;
