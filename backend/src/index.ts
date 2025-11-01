import express from "express";
import * as bip39 from "bip39";
import { HDNodeWallet } from "ethers";

import { client } from "./db";
client.connect();

const app = express();
app.use(express.json());

app.post('/signup',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    await client.query('BEGIN');
    const result = await client.query(`INSERT INTO userInfo (username,password,depositAddress,privateKey,balance)
        VALUES($1,$2,$3,$4,$5) RETURNING id`,[username,password,"","",0]);

    const userId = result.rows[0].id;

    const MNEUMONICS = bip39.generateMnemonic();
    console.log(MNEUMONICS);
    // console.log(bip39.generateMnemonic);
    const SEED = bip39.mnemonicToSeedSync(MNEUMONICS);

    const hdNode = HDNodeWallet.fromSeed(SEED);
    const child = hdNode.derivePath(`m/44'/60'/${userId}'/0`);

    await client.query(`UPDATE userInfo SET depositAddress=$1 , privateKey=$2 WHERE id=$3`,[child.address , child.privateKey , userId]);
    await client.query('COMMIT');
    
    console.log("Private Key: ",child.privateKey);
    console.log("Public Key: ",child.publicKey);
    console.log("Address: ",child.address);
    res.json({userId});
})

app.post('/depositAddress/:userId',(req,res)=>{

})

app.listen(3000);