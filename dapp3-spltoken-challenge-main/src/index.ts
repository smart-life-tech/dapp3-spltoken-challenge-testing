import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda,

} from "@metaplex-foundation/js";
import * as anchor from "@project-serum/anchor";
import { UpdateMetadataAccountV2InstructionArgs, UpdateMetadataAccountV2InstructionAccounts } from "@metaplex-foundation/mpl-token-metadata"
const { Wallet, web3, connection } = require("@project-serum/anchor");
const {
  Data,
  Creator,
  METADATA_PROGRAM_ID,
  PublicKey,
} = require("@metaplex/js");

import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction,
  UpdateMetadataAccountArgsV2,
  CreateMetadataAccountArgsV3
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";
import { AccountLayout, } from "@solana/spl-token";
import { clusterApiUrl } from "@solana/web3.js";

import { initializeKeypair } from "./initializeKeypair";
import * as token from "@solana/spl-token";
import * as solana from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintToChecked, setAuthority, Account, transfer, createMintToInstruction } from "@solana/spl-token";

const quicknodeEndpoint = 'https://example.solana-devnet.quiknode.pro/0123456/';
//const connection = new Connection(quicknodeEndpoint, "confirmed");

// async function createTokenWithMetaplex(){
//   // Variables
//   const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
//   const user = await initializeKeypair(connection);
//   const payer = user
//   const mintAuthority = user.publicKey
//   const freezeAuthority = user.publicKey
//   const decimals = 4
//   const owner = user.publicKey

//   // Instructions
//   // Create Token
//   const tokenMint = await token.createMint(
//     connection,
//     payer,
//     mintAuthority,
//     freezeAuthority,
//     decimals
//   );

//    // metaplex setup
//    const metaplex = Metaplex.make(connection)
//    .use(keypairIdentity(user))
//    .use(
//      bundlrStorage({
//        address: "https://devnet.bundlr.network",
//        providerUrl: "https://api.devnet.solana.com",
//        timeout: 60000,
//      })
//    );

//    // file to buffer
//   const buffer = fs.readFileSync("assets/emekcoinV2-logo.png");

//   // buffer to metaplex file
//   const file = toMetaplexFile(buffer, "emekcoinV2-logo.png");

//   // upload image and get image uri
//   const imageUri = await metaplex.storage().upload(file);
//   console.log("image uri:", imageUri);

//   // upload metadata and get metadata uri (off chain metadata)
//   const { uri } = await metaplex.nfts().uploadMetadata({
//     name: "EmekV2",
//     description: "for all workers of the world",
//     image: imageUri,
//   });

//   console.log("metadata uri:", uri);

//   // get metadata account address
//   const metadataPDA = await findMetadataPda(tokenMint);

//   // onchain metadata format
//   const tokenMetadata = {
//     name: "EmekV2",
//     symbol: "EME",
//     uri: uri,
//     sellerFeeBasisPoints: 0,
//     creators: null,
//     collection: null,
//     uses: null,
//   } as DataV2;

//   // transaction to create metadata account
//   const transaction = new web3.Transaction().add(
//     createCreateMetadataAccountV2Instruction(
//       {
//         metadata: metadataPDA,
//         mint: tokenMint,
//         mintAuthority: user.publicKey,
//         payer: user.publicKey,
//         updateAuthority: user.publicKey,
//       },
//       {
//         createMetadataAccountArgsV2: {
//           data: tokenMetadata,
//           isMutable: true,
//         },
//       }
//     )
//   );

//   // Create Token Account
//   const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
//     connection,
//     payer,
//     tokenMint,
//     owner
//   );

//   // Mint Token
//   const mintInfo = await token.getMint(connection, tokenMint);

//   const transactionSignature = await token.mintTo(
//     connection,
//     payer,
//     tokenMint,
//     tokenAccount.address,
//     user,
//     200 * 10 ** mintInfo.decimals
//   );

// }

async function main() {
  // Variables
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const user = await initializeKeypair(connection);
  const payer = user;
  const mintAuthority = user.publicKey;
  const freezeAuthority = user.publicKey;
  const decimals = 4;
  const owner = user.publicKey;
  const myaddress = new web3.PublicKey("AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT");
  // Instructions
  // Create Token
  const tokenMint = await token.createMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    decimals
  );
  console.log("TOKENMINT BİLGİLERİ:");
  console.log(`The token mint account address is ${tokenMint}`);
  console.log(
    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
  );

  // Create Token Account
  const tokenAccount = await token.getAssociatedTokenAddress(
    myaddress,
    user.publicKey,
    true
  );
  console.log("token account created sucess")
  // Mint Token
  //const mintInfo = await token.getMint(connection, tokenAccount);
  //console.log(mintInfo)
  const transactionSignature = await token.mintTo(
    connection,
    payer,
    tokenMint,
    myaddress,
    user,
    300 * 10 ** 4
  );
  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
  // end mint token

  // metaplex setup
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // file to buffer
  const buffer = fs.readFileSync("assets/emekcoinV2-logo.png");

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, "emekcoinV2-logo.png");

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "EmekV2",
    description: "for all workers of the world",
    image: imageUri,
  });

  console.log("metadata uri:", uri);

  // get metadata account address
  const metadataPDA = await findMetadataPda(tokenMint);
  console.log(`GET METADATA ACCOUNT ADDRESS is : ${metadataPDA}`);

  // onchain metadata format
  const tokenMetadata = {
    name: "EmekV2",
    symbol: "EME",
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  console.log("=============================");
  console.log("CREATING TRANSACTION");
  console.log("=============================");
  // transaction to create metadata account
  const transaction = new web3.Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMint,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
    )
  );

  console.log(`METADATA TRANSACTİON : ${transaction}`);
  console.log("=============================");
  console.log("BEGIN SENDANDCONFIRMTRANSACTION");
  // send transaction
  const transactionSignature2 = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  console.log(
    `Create Metadata Account: https://explorer.solana.com/tx/${transactionSignature2}?cluster=devnet`
  );
  console.log("PublicKey:", user.publicKey.toBase58());
}
async function testing() {
  const web3 = require('@solana/web3.js');
  const splToken = require('@solana/spl-token');

  //create connection to devnet
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

  //generate keypair and airdrop 1000000000 Lamports (1 SOL)
  const myKeypair = web3.Keypair.generate();
  await connection.requestAirdrop(myKeypair.publicKey, 1000000000);

  console.log('solana public address: ' + myKeypair.publicKey.toBase58());

  //set timeout to account for airdrop finalization
  let mint;
  var myToken

  //create mint
  mint = await splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)

  console.log('mint public address: ' + mint.publicKey.toBase58());

  //get the token accont of this solana address, if it does not exist, create it
  myToken = await mint.getOrCreateAssociatedAccountInfo(
    myKeypair.publicKey
  )

  console.log('token public address: ' + myToken.address.toBase58());

  //minting 100 new tokens to the token address we just created
  await mint.mintTo(myToken.address, myKeypair.publicKey, [], 1000000000);

  console.log('done');
}

async function testing2() {
  // import * as web3 from '@solana/web3.js';
  // import * as splToken from '@solana/spl-token';
  // const web3 = require('@solana/web3.js');
  const splToken = require('@solana/spl-token');
  /*const getProvider = async () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        console.log("Is Phantom installed?  ", provider.isPhantom);
        return provider;
      }
    } else {
      window.open("https://www.phantom.app/", "_blank");
    }
  };*/

  //const mintingTest = async () => {
  // const phantomProvider = await getProvider();
  //  const mintRequester = await phantomProvider.publicKey;
  const mintRequester = new web3.PublicKey("AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT");
  console.log("Public key of the mint Requester: ", mintRequester.toString());

  //To connect to the mainnet, write mainnet-beta instead of devnet
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  //This fromWallet is your minting wallet, that will actually mint the tokens
  var fromWallet = web3.Keypair.generate();

  // Associate the mintRequester with this wallet's publicKey and privateKey
  // This is basically the credentials that the mintRequester (creator) would require whenever they want to mint some more tokens
  // Testing the parameters of the minting wallet

  console.log("Creator's Minting wallet public key: ", fromWallet.publicKey.toString());
  console.log(fromWallet.secretKey.toString());

  // Airdrop 1 SOL to the minting wallet to handle the minting charges
  // var fromAirDropSignature = await connection.requestAirdrop(
  //   fromWallet.publicKey,
  //  web3.LAMPORTS_PER_SOL,
  //);

  //await connection.confirmTransaction(fromAirDropSignature);
  console.log("Airdropped (transferred) 1 SOL to the fromWallet to carry out minting operations");

  // This createMint function returns a Promise <Token>
  let mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    6, // Number of decimal places in your token
    undefined,
    {},
    splToken.TOKEN_PROGRAM_ID,
  );
  console.log("mint:", mint);
  // getting or creating (if doens't exist) the token address in the fromWallet address
  // fromTokenAccount is essentially the account *inside* the fromWallet that will be able to handle the              new token that we just minted
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  // getting or creating (if doens't exist) the token address in the toWallet address
  // toWallet is the creator: the og mintRequester
  // toTokenAmount is essentially the account *inside* the mintRequester's (creator's) wallet that will be able to handle the new token that we just minted
  let toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    mintRequester,
  );

  // // Minting 1 token
  await mint.mintTo(
    fromTokenAccount.address,
    fromWallet.publicKey,
    [],
    1000000 // 1 followed by decimals number of 0s // You'll ask the creator ki how many decimals he wants in his token. If he says 4, then 1 token will be represented as 10000
  );

  console.log("Initial mint successful");


  // This transaction is sending of the creator tokens(tokens you just created) from their minting wallet to their Phantom Wallet
  var transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1000000, // This is transferring 1 token, not 1000000 tokens
    ),
  );

  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    { commitment: 'confirmed' },
  );

  const creatorTokenAddress = mint.publicKey;
  const creatorTokenAddressString = mint.publicKey.toString();

  console.log("SIGNATURE: ", signature); //Signature is basically like the paying party signs a transaction with their key.
  console.log("Creator Token Address: ", creatorTokenAddressString);
  console.log("Creator Minting Wallet Address: ", mint.payer.publicKey.toString());

  let creatorTokenBalance = await toTokenAccount.amount;
  console.log("Creator's Token Balance: ", creatorTokenBalance);

}

async function testing3() {
  const splToken = require('@solana/spl-token');
  const web3 = require('@solana/web3.js');
  const { Token } = require('@solana/spl-token');

  const TOKEN_PROGRAM_ID = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

  // Connect to the Solana network
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));

  // Create a new wallet account to hold the minted tokens
  //const fromWallet = web3.Keypair.generate();
  const fromWallet = await initializeKeypair(connection);
  //const fromWallet = new web3.PublicKey("AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT");
  // Define the number of decimal places for your token
  const decimals = 4;
  const options = {
    decimals: decimals,
    programId: TOKEN_PROGRAM_ID,
    freezeAuthority: null,
    initialSupply: 0,
    name: "My Custom Token",
    symbol: "MCT",
    iconUrl: "https://example.com/token-icon.png",
  };

  const tokenMint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    decimals,
    TOKEN_PROGRAM_ID,
    null,
    0,
    "My Custom Token",
    "MCT",
    "https://ehttps://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcambriadesign.ca%2Fwp-content%2Fuploads%2F2019%2F04%2F1533811010766.107178_tempImage.jpeg&f=1&nofb=1&ipt=970e0cd42113232077fd32198a53613f6d5b00a22ab0d18a63a2529efcc82dd5&ipo=imagesxample.com/token-icon.png");

  // Create the mint for your custom token
  //const tokenMint = await splToken.Token.createMint( connection,fromWallet, fromWallet.publicKey, null,decimals,TOKEN_PROGRAM_ID);
  console.log("mint", tokenMint)
  // Create a new account to hold the newly minted tokens
  const toWallet = await initializeKeypair(connection);

  // Mint 1000 tokens and transfer them to the new account
  const amountToMint = 9000 * Math.pow(10, decimals);
  const recipientAddress = toWallet.publicKey;
  console.log(recipientAddress)

  const mintAuthority = fromWallet.publicKey;
  const instructions = [
    TOKEN_PROGRAM_ID,
    tokenMint.publicKey,
    recipientAddress,
    mintAuthority,
    [],
    amountToMint

  ];

  // Sign and send the transaction
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWallet.publicKey,
      lamports: 5000,
    }),
  );
  //console.log(transaction)
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    { commitment: 'singleGossip', preflightCommitment: 'singleGossip' }
  );

  console.log('Transaction signature:', signature);

  const tokenMinting = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    decimals,
    TOKEN_PROGRAM_ID,
  );
  console.log(tokenMinting)
  // Create a new account to hold the newly minted tokens
  //const toWallet = await initializeKeypair(connection);
  const mint = await splToken.Token.createMint(connection, fromWallet.publicKey, fromWallet.publicKey, null, 0);
  await splToken.mintTo(
    connection,
    fromWallet.publicKey,
    mint,
    recipientAddress,
    fromWallet.publicKey,
    1,
  );
  console.log("minted")
  // Mint 1000 tokens and transfer them to the new account
  //const amountToMint = 1000 * Math.pow(10, decimals);
  const recipientAddress2 = new web3.PublicKey("4xLRwPCYRTtGjzFR7j57EZboLyBTPBMBseZfUioyVjvq");
  //const mintAuthority = fromWallet.publicKey;

  // Mint tokens to the recipient's wallet
  await tokenMinting.mintTo(recipientAddress, mintAuthority, [], amountToMint);

  // Send the tokens to another wallet
  const transferAuthority = fromWallet;
  const destinationAddress = recipientAddress2 // The address of the wallet to send the tokens to
  const transferAmount = 20 // The amount of tokens to send
  await splToken.Token.createTransfer(
    connection,
    tokenMinting,
    recipientAddress,
    destinationAddress,
    transferAuthority,
    [],
    transferAmount
  );
  console.log('Transfer complete');
}

async function moralis() {

  // const secret = [0...0]; // Replace with your secret key
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const fromWallet = await initializeKeypair(connection);
  const authority = new web3.PublicKey("BYoZMWpvLzVBkjZmQdq7EaLNcALc8xc5V3GdHmMaVkcZ")// mint authrity for this token 

  const TOKEN_PROGRAM_ID = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

  const myaddress = new web3.PublicKey("A6Dan8qVGq1ugyYnCvyxQ6xnf5CCLoLkgAviPufrsgH1");// frlc

  const myaddress2 = new web3.PublicKey("DMEEpTxDJURpo3tgqFeoQRShdRoYJCwrnH3ZUVDzkNkV");//hrlc
  const mintAcc = new web3.PublicKey("4uQeXLaeHC67jSNKxcFrnTr31J8mMrU3pBm7GjAcpSn");

  const myaddress3 = new web3.PublicKey("4xLRwPCYRTtGjzFR7j57EZboLyBTPBMBseZfUioyVjvq");//solana address of the receiver
  // Create a new token 
  const mint = await createMint(
    connection,
    fromWallet,            // Payer of the transaction
    fromWallet.publicKey,  // Account that will control the minting 
    null,                  // Account that will control the freezing of the token 
    0,                      // Location of the decimal place 
    undefined,
    undefined,
    TOKEN_PROGRAM_ID
  );
  //console.log("mint informations ", mint)
  //console.log("mint informations ", myaddress)
  //console.log(TOKEN_PROGRAM_ID)
  // Get the token account of the fromWallet Solana address. If it does not exist, create it.
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    myaddress2,
    fromWallet.publicKey
  );
  // console.log(mint)
  console.log("wallet key", fromWallet.publicKey)
  console.log("from token account ", fromTokenAccount)
  // Generate a new wallet to receive the newly minted token
  const toWallet = await initializeKeypair(connection);

  // Get the token account of the toWallet Solana address. If it does not exist, create it.
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,// payer
    myaddress2,// the address of the token we are minting 
    myaddress3// receiver account address
  );
  console.log("receiver address created", toTokenAccount.address)

  const toAccountInfo = await connection.getAccountInfo(fromWallet.publicKey);
  console.log(toAccountInfo)
  // const toTokenAccounts = new splToken.Account(toAccountInfo.data);
  //const authoritySigner = web3.Keypair.fromSecretKey(authorityWallet.secretKey);
  const tokenAccountPubkey = myaddress2;

  // Get the mint account of the token being minted
  const tokenAccountInfo = await connection.getAccountInfo(tokenAccountPubkey);
  if (!tokenAccountInfo) {
    throw new Error(`Token account not found: ${tokenAccountPubkey.toBase58()}`);
  }

  const mintPubkey = new web3.PublicKey(tokenAccountInfo.data.slice(0, 32));
  console.log(`Mint account: ${mintPubkey.toBase58()}`);
  // Minting 10 new token to the "fromTokenAccount" account we just returned/created.
  let signature = await mintToChecked(
    connection,
    fromWallet,               // Payer of the transaction fees 
    myaddress2,                     // Mint for the account 
    fromTokenAccount.address,     // Address of the account to mint to 
    fromWallet,     // Minting authority
    1000,                         // Amount to mint 
    4
  );

  console.log("minted coins", signature)
  /* await setAuthority(
    connection,
    fromWallet,            // Payer of the transaction fees
    myaddress,                  // Account 
    fromWallet.publicKey,  // Current authority 
    0,                     // Authority type: "0" represents Mint Tokens 
    null                   // Setting the new Authority to null
  );
*/
  signature = await transfer(
    connection,
    fromWallet,               // Payer of the transaction fees 
    fromTokenAccount.address, // Source account 
    toTokenAccount.address,   // Destination account 
    fromWallet.publicKey,     // Owner of the source account 
    10000                         // Number of tokens to transfer 
  );

  console.log("SIGNATURE", signature);
}

async function minting() {

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const fromWallet = await initializeKeypair(connection);
  let [checkBalanceOf, mintTokenAmount, sendTokenAddress] = ["", "", "DMEEpTxDJURpo3tgqFeoQRShdRoYJCwrnH3ZUVDzkNkV"];
  let tokenAccountInfo;
  const message = "Default Token Address";
  let mint: anchor.web3.PublicKey;
  let fromTokenAccount: Account;
  const toWallet = new web3.PublicKey("DMEEpTxDJURpo3tgqFeoQRShdRoYJCwrnH3ZUVDzkNkV");

  //8M785VdWLu8dwYPWizJbnbAaJxJGWoA9wGHwyFUfAy35
  // const createToken = async () => {
  //const fromAirDropSignature = await connection.requestAirdrop(
  //  fromWallet.publicKey,
  //   web3.LAMPORTS_PER_SOL
  // ); // Request a SOL airdrop to the creator account
  // await connection.confirmTransaction(fromAirDropSignature);

  mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    4 // means 1 unit = 10^-9 tokens i.e 1 token is divisible upto 9 dec places
  );
  console.log(`Create token: ${mint.toBase58()}`);

  fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    toWallet,
    fromWallet.publicKey
  );
  console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
  console.log(`Create Token Account ownner: ${fromTokenAccount.owner.toBase58()}`);
  console.log(`to wallet  Token Account: ${toWallet.toBase58()}`);
  console.log(`from wallet  Token Account add: ${fromWallet.publicKey.toBase58()}`);
  //};


  const txSignature = await token.mintTo(
    connection,
    fromWallet,
    toWallet,
    fromTokenAccount.address,
    fromWallet.publicKey,
    (Number(mintTokenAmount) || 10) * 1000000000
  );
  console.log(`Mint Tx Signature: ${txSignature}`);


  const checkBalance = async () => {
    //Getting total supply of tokens minter into existance
    const mintInfo = await token.getMint(connection, mint);
    console.log(`Total Supply: ${mintInfo.supply}`);

    // Get the amount of tokens left in the creator account
    tokenAccountInfo = await token.getAccount(connection, fromTokenAccount.address);
    console.log(checkBalanceOf);
    console.log(`Associated Token Account Balance: ${tokenAccountInfo.amount}`);
    alert(
      `Total Supply: ${Number(mintInfo.supply) / web3.LAMPORTS_PER_SOL
      } tokens\n\nAssociated Token Account Balance: ${Number(tokenAccountInfo.amount) / web3.LAMPORTS_PER_SOL
      } tokens\n\nOpen browser console to copy hash`
    );
  };

  const sendToken = async () => {
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet
    );

    const txSignature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      5000000000 // 5billion
    );

    console.log(`Transaction successful with signature: ${txSignature}`);
    alert(
      `Transaction successful with signature: (${txSignature}).\n\nTokens sent to (${!sendTokenAddress ? message : sendTokenAddress
      })\n\nOpen browser console to copy hash`
    );
  };
}

async function mintings() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const toWallet = new web3.PublicKey("9wz6BbdQg5sgb7wpERsz6SFTTnxtnVBLzVoYcKJYh1aq");
  const payer = await initializeKeypair(connection);
  //console.log(Keypair.generate())
  //console.log(payer)
  const toWallets = new web3.PublicKey("BYoZMWpvLzVBkjZmQdq7EaLNcALc8xc5V3GdHmMaVkcZ");
  const mintAdd = new web3.PublicKey("3ZXStcZALjgxp5NPa2XXpwkRF2xqDhh1Ymmg2pkcrxSg");
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey('AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT'),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  let mint = toWallet


  const payers = payer;//Keypair.generate();
  const mintAuthority = payer;//Keypair.generate();
  const freezeAuthority = payer;// Keypair.generate();
  /*const mints = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
  );*/
  const mints = toWallet;

  console.log("mint address: ", mints);
  const mintInfos = await token.getMint(
    connection,
    mints
  )

  console.log("supply ", mintInfos);
  // 0

  const tokenAccount1 = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mints,
    payer.publicKey
  )

  console.log("token1 account ", tokenAccount1.address.toBase58());
  // 7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi
  await token.mintTo(
    connection,
    payer,
    mints,
    tokenAccount1.address,
    mintAuthority,
    100000000000 // because decimals for the mint are set to 9 
  )
  console.log("minted coins now")
  const mintInfoss = await token.getMint(
    connection,
    mints
  )

  console.log(mintInfoss.supply);
  // 100


  const mintInfo = await token.getMint(
    connection,
    mint
  )

  console.log(mintInfo.address);
  // 0

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  )
  console.log(tokenAccount.address.toBase58());

  const tokenAccountInfo = await token.getAccount(
    connection,
    tokenAccount.address
  )
  console.log(tokenAccountInfo.amount);


  await token.mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    10000000,// because decimals for the mint are set to 4
    [],
    undefined,
    TOKEN_PROGRAM_ID
  )
  console.log("minted")

  console.log("Token                                         Balance");
  console.log("------------------------------------------------------------");
  tokenAccounts.value.forEach((tokenAccount) => {
    const accountData = AccountLayout.decode(tokenAccount.account.data);
    console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
  })
  const txSignature = await transfer(
    connection,
    payer,
    tokenAccount.address,
    payer.publicKey,
    payer.publicKey,
    5000000000 // 5billion
  );

  console.log(`Transaction successful with signature: ${txSignature}`);
  /*
  Token                                         Balance
  ------------------------------------------------------------
  7e2X5oeAAJyUTi4PfSGXFLGhyPw2H8oELm1mx87ZCgwF  84
  AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  100
  AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  0
  AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM  1
  */
  // metaplex setup
  const user = payer;
  const mintKeypair = payer;
  const tokenMint = mints;
  const decimals = 4;
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );
  //   // rent for token mint
  const lamports = await token.getMinimumBalanceForRentExemptMint(connection)

  //   // keypair for new token mint
  //   const mintKeypair = Keypair.generate()

  //   // get metadata PDA for token mint
  //   const metadataPDA = await findMetadataPda(mintKeypair.publicKey)

  //   // get associated token account address for use
  const tokenATA = await token.getAssociatedTokenAddress(
    mintKeypair.publicKey,
    user.publicKey
  )
  // file to buffer
  const buffer = fs.readFileSync("assets/emekcoinV2-logo.png");

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, "emekcoinV2-logo.png");

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "EmekV2",
    description: "for all workers of the world",
    image: imageUri,
  });

  console.log("metadata uri:", uri);

  // get metadata account address
  const metadataPDA = await findMetadataPda(tokenMint);
  console.log(`GET METADATA ACCOUNT ADDRESS is : ${metadataPDA}`);

  // onchain metadata format
  const tokenMetadata = {
    name: "EmekV299",
    symbol: "EME",
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  console.log("=============================");
  console.log("CREATING TRANSACTION");
  console.log("=============================");
  // transaction to create metadata account
  const transaction = new web3.Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: tokenMint,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
    )
  );
  console.log("=============================");
  console.log("CREATED TRANSACTION");
  console.log("=============================");
  //   // transaction to create metadata account
  /* const transactions = new web3.Transaction().add(
     //     // create new account
      web3.SystemProgram.createAccount({
        fromPubkey: user.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: token.MINT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      // create new token mint
      token.createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        user.publicKey,
        user.publicKey,
        TOKEN_PROGRAM_ID
      ),
     //      create metadata account
     createUpdateMetadataAccountV2Instruction(
       {
         metadata: metadataPDA,
         mint: mintKeypair.publicKey,
         mintAuthority: user.publicKey,
         payer: user.publicKey,
         updateAuthority: user.publicKey,
       },
       {
         createMetadataAccountArgsV2: {
           data: tokenMetadata,
           isMutable: true,
         },
       }
     )
   )*/

  //   // instruction to create ATA
  /* const createTokenAccountInstruction = token.createAssociatedTokenAccountInstruction(
     user.publicKey,//payer
     tokenATA, //token address
     user.publicKey, //token owner
     mintKeypair.publicKey  //token mint
   )
 
   //   let tokenAccount: Account
   try {
     //check if token account already exists
     const tokenAccount2 = await token.getAccount(
       connection, //connection
       tokenATA // token address
     )
   } catch (error: unknown) {
     if (
       error instanceof token.TokenAccountNotFoundError ||
       error instanceof token.TokenInvalidAccountOwnerError
     ) {
       try {
         //  add instruction to create token account if one does not exist
         //transaction.add(createTokenAccountInstruction)
       } catch (error: unknown) { }
     } else {
       throw error
     }
   }
 
   transactions.add(
     //  mint tokens to token account
     createMintToInstruction(
       mintKeypair.publicKey,
       tokenATA,
       user.publicKey,
       400 * Math.pow(10, decimals)
     )
   )*/
  console.log("=============================");
  console.log("SENDING TRANSACTION");
  console.log("=============================");
  // Update the metadata account with the new metadata

  //send transaction
  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user, mintKeypair]
  )

  console.log(
    `Transaction: https:explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )

  console.log(`METADATA TRANSACTİON : ${transaction}`);
  console.log("=============================");
  console.log("BEGIN SEND AND CONFIRM TRANSACTION");


  // send transaction
  const transactionSignature2 = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  console.log(
    `Create Metadata Account: https://explorer.solana.com/tx/${transactionSignature2}?cluster=devnet`
  );
  console.log("PublicKey:", user.publicKey.toBase58());
}

async function metaedit() {

  const fs = require("fs");
  // This is the Update Authority Secret Key
  //const secretKey = fs.readFileSync(
  //  "/Users/pratiksaria/.config/solana/id.json",
  //  "utf8"
  //);
  const connections = new web3.Connection(web3.clusterApiUrl("devnet"));
  // const secretKey = (await initializeKeypair(connections)).secretKey
  const keypair = await initializeKeypair(connections)
  //Buffer.from(JSON.parse(secretKey));
  const endpoint = "https://metaplex.devnet.rpcpool.com/";
  const connection = new anchor.web3.Connection(endpoint);
 // You have to enter your NFT Mint address Over Here
 const mintKey = new anchor.web3.PublicKey("9wz6BbdQg5sgb7wpERsz6SFTTnxtnVBLzVoYcKJYh1aq");
 const toWallet = new web3.PublicKey("9wz6BbdQg5sgb7wpERsz6SFTTnxtnVBLzVoYcKJYh1aq");
  const wallet = new Wallet(keypair);
  console.log("Connected Wallet", wallet.publicKey.toString());

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
 // const [metadataAddress] = await PublicKey.findProgramAddress(
 //   [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintKey.toBuffer()],
  //  METADATA_PROGRAM_ID
  //);
  // BTW DeGods is my FAV collection although i cant afford one 🥲
  const updated_data: DataV2 = {
    name: "DeGods",
    symbol: "DG",
    uri: "https://metadata.degods.com/g/4924.json",
    sellerFeeBasisPoints: 1000,
    creators: [
      {
        address: new solana.PublicKey(
          "AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT"
        ),
        verified: false,
        share: 0,
      },
      {
        address: wallet.publicKey,
        verified: false,
        share: 100,
      },
    ],
    collection: null,
    uses: null,
  };

  const updated_datas: CreateMetadataAccountArgsV3 = {
    data: updated_data,
    isMutable: true,
    collectionDetails: null
  };
  console.log("metadata updated",updated_datas)
 /* 
  // BTW DeGods is my FAV collection although i cant afford one 🥲
  const updatedData = new Data({
    name: "DeGods",
    symbol: "DG",
    uri: "https://metadata.degods.com/g/4924.json",
    sellerFeeBasisPoints: 1000,
    creators: [
      new Creator({
        address: new solana.PublicKey(
          "AmgWvVsaJy7UfWJS5qXn5DozYcsBiP2EXBH8Xdpj5YXT"
        ),
        verified: false,
        share: 0,
      }),
      new Creator({
        address: wallet.publicKey,
        verified: false,
        share: 100,
      }),
    ],
  });

 */
  const [metadatakey] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  
  const accounts: UpdateMetadataAccountV2InstructionAccounts = {
    metadata: metadatakey,
    updateAuthority: wallet.publicKey,
  }

  const args: UpdateMetadataAccountV2InstructionArgs = {
    updateMetadataAccountArgsV2: {
      data: updated_data,
      updateAuthority: wallet.publicKey,
      primarySaleHappened: true,
      isMutable: true,
    }
  }

  const updateMetadataAccount = createUpdateMetadataAccountV2Instruction(
    accounts,
    args
  );

  const transaction = new anchor.web3.Transaction()
  transaction.add(updateMetadataAccount);
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;
  const signedTx = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signedTx.serialize());

  console.log("Transaction ID --", txid);


}
//mintings()
metaedit()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

//   import { initializeKeypair } from "./initializeKeypair"
// import {
//   Connection,
//   clusterApiUrl,
//   Transaction,
//   sendAndConfirmTransaction,
//   Keypair,
//   SystemProgram,
// } from "@solana/web3.js"
// import {
//   createInitializeMintInstruction,
//   getMinimumBalanceForRentExemptMint,
//   getAssociatedTokenAddress,
//   MINT_SIZE,
//   TOKEN_PROGRAM_ID,
//   createAssociatedTokenAccountInstruction,
//   Account,
//   TokenAccountNotFoundError,
//   TokenInvalidAccountOwnerError,
//   getAccount,
//   createMintToInstruction,
// } from "@solana/spl-token"
// import {
//   Metaplex,
//   keypairIdentity,
//   bundlrStorage,
//   toMetaplexFile,
//   findMetadataPda,
// } from "@metaplex-foundation/js"
// import {
//   DataV2,
//   createCreateMetadataAccountV2Instruction,
// } from "@metaplex-foundation/mpl-token-metadata"
// import * as fs from "fs"

// const tokenName = "Token Name"
// const description = "Description"
// const symbol = "SYMBOL"
// const decimals = 2
// const amount = 1

// async function main() {
//   const connection = new Connection(clusterApiUrl("devnet"))
//   const user = await initializeKeypair(connection)

//   console.log("PublicKey:", user.publicKey.toBase58())

//   // rent for token mint
//   const lamports = await getMinimumBalanceForRentExemptMint(connection)

//   // keypair for new token mint
//   const mintKeypair = Keypair.generate()

//   // get metadata PDA for token mint
//   const metadataPDA = await findMetadataPda(mintKeypair.publicKey)

//   // get associated token account address for use
//   const tokenATA = await getAssociatedTokenAddress(
//     mintKeypair.publicKey,
//     user.publicKey
//   )

//   // metaplex setup
//   const metaplex = Metaplex.make(connection)
//     .use(keypairIdentity(user))
//     .use(
//       bundlrStorage({
//         address: "https://devnet.bundlr.network",
//         providerUrl: "https://api.devnet.solana.com",
//         timeout: 60000,
//       })
//     )

//   // file to buffer
//   const buffer = fs.readFileSync("src/test.png")

//   // buffer to metaplex file
//   const file = toMetaplexFile(buffer, "test.png")

//   // upload image and get image uri
//   const imageUri = await metaplex.storage().upload(file)
//   console.log("image uri:", imageUri)

//   // upload metadata and get metadata uri (off chain metadata)
//   const { uri } = await metaplex
//     .nfts()
//     .uploadMetadata({
//       name: tokenName,
//       description: description,
//       image: imageUri,
//     })
//     .run()

//   console.log("metadata uri:", uri)

//   // onchain metadata format
//   const tokenMetadata = {
//     name: tokenName,
//     symbol: symbol,
//     uri: uri,
//     sellerFeeBasisPoints: 0,
//     creators: null,
//     collection: null,
//     uses: null,
//   } as DataV2

//   // transaction to create metadata account
//   const transaction = new Transaction().add(
//     // create new account
//     SystemProgram.createAccount({
//       fromPubkey: user.publicKey,
//       newAccountPubkey: mintKeypair.publicKey,
//       space: MINT_SIZE,
//       lamports: lamports,
//       programId: TOKEN_PROGRAM_ID,
//     }),
//     // create new token mint
//     createInitializeMintInstruction(
//       mintKeypair.publicKey,
//       decimals,
//       user.publicKey,
//       user.publicKey,
//       TOKEN_PROGRAM_ID
//     ),
//     // create metadata account
//     createCreateMetadataAccountV2Instruction(
//       {
//         metadata: metadataPDA,
//         mint: mintKeypair.publicKey,
//         mintAuthority: user.publicKey,
//         payer: user.publicKey,
//         updateAuthority: user.publicKey,
//       },
//       {
//         createMetadataAccountArgsV2: {
//           data: tokenMetadata,
//           isMutable: true,
//         },
//       }
//     )
//   )

//   // instruction to create ATA
//   const createTokenAccountInstruction = createAssociatedTokenAccountInstruction(
//     user.publicKey, // payer
//     tokenATA, // token address
//     user.publicKey, // token owner
//     mintKeypair.publicKey // token mint
//   )

//   let tokenAccount: Account
//   try {
//     // check if token account already exists
//     tokenAccount = await getAccount(
//       connection, // connection
//       tokenATA // token address
//     )
//   } catch (error: unknown) {
//     if (
//       error instanceof TokenAccountNotFoundError ||
//       error instanceof TokenInvalidAccountOwnerError
//     ) {
//       try {
//         // add instruction to create token account if one does not exist
//         transaction.add(createTokenAccountInstruction)
//       } catch (error: unknown) {}
//     } else {
//       throw error
//     }
//   }

//   transaction.add(
//     // mint tokens to token account
//     createMintToInstruction(
//       mintKeypair.publicKey,
//       tokenATA,
//       user.publicKey,
//       amount * Math.pow(10, decimals)
//     )
//   )

//   // send transaction
//   const transactionSignature = await sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [user, mintKeypair]
//   )

//   console.log(
//     `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
//   )
// }

// main()
//   .then(() => {
//     console.log("Finished successfully")
//     process.exit(0)
//   })
//   .catch((error) => {
//     console.log(error)
//     process.exit(1)
//   })



