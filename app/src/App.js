import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow';


const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function approveByAddress(escrowAddress, signer) {
  console.log(escrowAddress);
  console.log(EscrowContract.abi);
  console.log(signer);
  const contract = new ethers.Contract(escrowAddress, EscrowContract.abi, signer);
  console.log(contract);
  const approveTxn = await contract.connect(signer).approve();
  console.log(approveTxn);
  const response = await approveTxn.wait();
  console.log(response);

}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [escrowAddresses, setEscrowAddresses] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccounts(accounts);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);


  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      sender: account,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });
        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
    setEscrowAddresses([...escrowAddresses, escrow.address])
  }

  return (
    <><div>Debug:</div>
      <div>Current account: {account}</div>
      <div>All accounts: {JSON.stringify(accounts)}</div>
      <div>All contracts: {JSON.stringify(escrows)}</div>
      <div>All contracts: {JSON.stringify(escrowAddresses)}</div>

      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Approve </h1>

        <div id="container">
          <label>
            Contract Address
            <input type="text" id="contractAddr" />
          </label>
          <div
              className="button"
              id='approve'
              onClick={()=>{approveByAddress(document.getElementById('contractAddr').value, signer)}}
          >
            Approve
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
