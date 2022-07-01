import React, { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableViewBody from "./TableViewBody";
import { ethers } from "ethers";
import CircularProgress from "@mui/material/CircularProgress";
import { AgreementContractAbi } from "../../contracts/config";
import { AgreementAddress } from "../../contracts/contract";
import { Web3ModalContext } from "../../context/Web3Modal";
import {  AgreementContext } from "../../context/AgreementContext";
import { instanceOf } from "prop-types";

function TableView(props) {
  const [contractAddressList, setContractAddressList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const web3ModalContext = React.useContext(Web3ModalContext);
  const { userAdd } = web3ModalContext;

  const agreementContext = React.useContext(AgreementContext);
  const { update } = agreementContext;

  // Get data for all the user's contracts
  const getAllContracts = useCallback(
    async (userAdd) => {
      setIsLoading(true); 

      let instance = await tronWeb.contract(AgreementContractAbi, AgreementAddress); 
      const res = instance.getAgreementByParties(userAdd).call();
      
      res.then(data => { 
         setContractAddressList(data.slice().reverse());
        });


      let eventCon = await tronWeb.contract().at(AgreementAddress);  
      eventCon.CreateAgreement().watch((err, eventResult) => {
        if (err) {
          return console.error('Error with "method" event:', err);
        }
        if (eventResult) { 
          if (
                  props.currentAccount.toLowerCase() === eventResult.result.buyer.toLowerCase() ||
                  props.currentAccount.toLowerCase() === eventResult.result.seller.toLowerCase()
                ) {
                  setContractAddressList((prevState) => {
                    if (!prevState.includes(eventResult.result.agreementAddress)) return [eventResult.result.agreementAddress, ...prevState];
                    return prevState;
                  });
                }
        }
      });

       
       



      // Set up event listener for factory contract
      // const dd = await instance.agreementCreate.call("CreateAgreement", (buyer, seller, price, address, title, description) => {
      //     console.log(address,"address");
      //     if (
      //       props.currentAccount.toLowerCase() === buyer.toLowerCase() ||
      //       props.currentAccount.toLowerCase() === seller.toLowerCase()
      //     ) {
      //       setContractAddressList((prevState) => {
      //         if (!prevState.includes(address)) return [address, ...prevState];
      //         return prevState;
      //       });
      //     }
      //   });   


      setIsLoading(false);
    },
    [props.currentAccount, update]
  );

  // Load contract data when component loads
  useEffect(() => {
    getAllContracts(props.currentAccount);
  }, [props.currentAccount, getAllContracts]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center"># </TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Seller</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Explore</TableCell>
          </TableRow>
        </TableHead>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        )}
        {contractAddressList && contractAddressList.length == 0 && (
          <TableRow>
            <TableCell colSpan={6} sx={{ textAlign: "center" }}>
              <h5>No contract available</h5>
            </TableCell>
          </TableRow>
        )}

        {/* <TableBody> */}
        {contractAddressList &&
          contractAddressList.map((list) => {
            return (
              <TableViewBody
                key={list}
                contractAddress={list}
                currentAccount={props.currentAccount}
              />
            );
          })}

        {/* </TableBody> */}
      </Table>
    </TableContainer>
  );
}

export default TableView;
