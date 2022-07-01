import axios from "axios";
import { ethers } from "ethers";
import React, { useState, createContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import { AgreementAddress, AgreementContractAbi } from "src/contracts/contract";
import Web3 from "web3";
import { NotificationContext } from "./Notification";
export const AgreementContext = createContext();

export const AgreementContextProvider = (props) => {

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [userAdd, setUserAdd] = useState(null);
    const [update, setUpdate] = useState(false);

    const { Moralis, user } = useMoralis();

    const notificationContext = React.useContext(NotificationContext);
    const { sendNotifications } = notificationContext;

    const [labelInfo, setlabelInfo] = useState({
        formData: {
            title: "",
            chain: "tron",
            description: "",
            buyerAddress: "",
            sellerAddress: "",
            buyer: "buyer",
            price: "",
            stakePercentBuyer: "",
            stakePercentSeller: "",
        }
    });

    const setFormdata = (prop) => (event) => {
        setlabelInfo({ ...labelInfo, formData: { ...labelInfo.formData, [prop]: event.target.value } });
    };

    const steps = [
        { title: "Select Chain" },
        { title: "Escrow Details" },
        { title: "Create Agreement" }
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }


    useEffect(async () => {
        const tronWeb = window.tronWeb;
        var currentaddress = await tronWeb.address.fromHex((await tronWeb.trx.getAccount()).address.toString());
        setUserAdd(currentaddress);
    }, [])

    const createAgreement = async () => {
        const bAddress = labelInfo.formData.buyer == 'buyer' ? userAdd : labelInfo.formData.buyerAddress;
        const sAddress = labelInfo.formData.buyer == 'seller' ? userAdd : labelInfo.formData.sellerAddress;

        setLoading(true);
        // const formattedPrice = Web3.utils.toWei(labelInfo.formData.price.toString());
        try {
            const balance = tronWeb.toSun(labelInfo.formData.price.toString());
            let instance = await tronWeb.contract(AgreementContractAbi, AgreementAddress);
            const res = await instance.agreementCreate(
                bAddress,
                sAddress,
                balance,
                labelInfo.formData.stakePercentBuyer.toString(),
                labelInfo.formData.stakePercentSeller.toString(),
                labelInfo.formData.title,
                labelInfo.formData.description
            ).send({
                feeLimit: 10000000000,
                callValue: 0
            });
            toast.success("successfully agreement created!");
            setLoading(false);
            handleClose();
            setUpdate(!update);
        } catch (err) {
            setLoading(false);
            handleClose();
            setUpdate(!update);
        } 


    };

    return (
        <AgreementContext.Provider
            value={{
                page,
                open,
                handleClickOpen,
                handleClose,
                steps,
                update,
                labelInfo,
                setFormdata,
                loading,
                createAgreement
            }}
        >
            {props.children}
        </AgreementContext.Provider>
    );
};
