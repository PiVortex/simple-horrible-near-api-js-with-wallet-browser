import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection } = nearAPI;

let myKeyStore;

// Ensure keyStore is initialized only in the browser
// needed for nextjs
if (typeof window !== 'undefined') {
  console.log("hello");
  myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
}

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

// Function to establish the NEAR connection and create the wallet connection
async function initNearConnection() {
  console.log(connectionConfig);
  const nearConnection = await connect(connectionConfig);
  const walletConnection = new WalletConnection(nearConnection, "guestbook-app");  // Provide a unique appKeyPrefix
  return walletConnection;
}

// Function to sign the user in
async function signIn() {
  const walletConnection = await initNearConnection();
  walletConnection.requestSignIn({
    // All of these are optional
    // contractId: "guestbook.near-examples.testnet", // Replace this with your contract ID
    // methodNames: [], // Optional, list of methods allowed by the access key
    // successUrl: window.location.origin + "/success", // Optional success URL
    // failureUrl: window.location.origin + "/failure", // Optional failure URL
  });
}

// Function to sign the user out
async function signOut() {
  const walletConnection = await initNearConnection();
  walletConnection.signOut();
  // Reload the page or redirect the user after sign-out if needed
  window.location.replace(window.location.origin);
}

// Function to send a transaction
async function sendTransaction() {
  // Initialize the wallet connection
  const walletConnection = await initNearConnection();
  
  // Get the wallet account object to perform the transaction
  const walletAccountObj = walletConnection.account();
  
  // Send money to the recipient
  await walletAccountObj.sendMoney(
    "pivortex.testnet", // receiver account
    "1000000000000000000000000" // amount in yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
  );
}

// Expose the functions by exporting them
export { signIn, signOut, sendTransaction };
