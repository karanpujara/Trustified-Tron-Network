import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'

function TableRowView(props) {
    const chainId = window.ethereum.networkVersion; 
    let per = Number(props.percent); 
    let stakeAmount = props.amount * per / 100;

    const boolToText = (x) => {
        if (x) return 'Yes';
        return 'No';
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
        <Card style={{ backgroundColor: 'aliceblue' }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.title} {tronWeb.address.fromHex(props.address).toLowerCase() === tronWeb.address.fromHex(props.currentAdd).toLowerCase() && '(You)'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {truncate(tronWeb.address.fromHex(props.address))}
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                    Stake Amount
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" >
                    {stakeAmount.toFixed(4)}  ({per}% of {props.amount} TRX )
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                    Stake
                </Typography>
                <Typography gutterBottom variant="body2" color={boolToText(props.staked) == 'No' ? 'text.danger' : 'text.success'}>
                    {boolToText(props.staked)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TableRowView