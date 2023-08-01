import {ethers} from 'ethers';
import {useEffect, useState} from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow';


const provider = new ethers.providers.Web3Provider(window.ethereum);

async function getEscrowDetails(escrowAddress, signer) {
    const contract = new ethers.Contract(escrowAddress, EscrowContract.abi, provider);
    return {
        address: contract.address,
        sender: await contract.depositor(),
        arbiter: await contract.arbiter(),
        beneficiary: await contract.beneficiary(),
        isApproved: await contract.isApproved(),
        value: await contract.amount(),
        handleApprove: async () => {
            contract.on('Approved', () => {
                document.getElementById(contract.address).className =
                    'complete';
                document.getElementById(contract.address).innerText =
                    "✓ It's been approved!";
            });
            await approveByAddress(contract.address, signer);
        },
    };
}

export async function approveByAddress(escrowAddress, signer) {
    const contract = new ethers.Contract(escrowAddress, EscrowContract.abi, signer);
    const approveTxn = await contract.connect(signer).approve();
    const response = await approveTxn.wait();
    console.log(response);
}

function App() {

    const [escrows, setEscrows] = useState([]);
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [accounts, setAccounts] = useState([]);
    const [escrowAddresses, setEscrowAddresses] = useState([]);

    useEffect(() => {
        async function getAccounts() {
            console.log('getAccounts');
            const accounts = await provider.send('eth_requestAccounts', []);
            setAccounts(accounts);
            setAccount(accounts[0]);
            setSigner(provider.getSigner());
        }

        getAccounts();
    }, [account]);

    useEffect(() => {
        console.log('getEscrowAddresses');

        const items = JSON.parse(localStorage.getItem('items'));
        if (items) {
            setEscrowAddresses(items);
        }
    }, []);

    useEffect(() => {
        async function getContracts() {
            console.log('getContracts');
            const tempList = [];
            for (const escrowAddr of escrowAddresses) {
                const escrow = await getEscrowDetails(escrowAddr, signer);
                tempList.push(escrow);
            }
            setEscrows(tempList);
        }

        getContracts();
    }, [escrowAddresses, signer]);

    async function newContract() {
        const beneficiary = document.getElementById('beneficiary').value;
        const arbiter = document.getElementById('arbiter').value;
        const value = ethers.BigNumber.from(document.getElementById('wei').value);
        const escrowContract = await deploy(signer, arbiter, beneficiary, value);
        const deployed = await escrowContract.deployed();
        console.log('deployed', deployed);
        localStorage.setItem('items', JSON.stringify([...escrowAddresses, escrowContract.address]));
        setEscrowAddresses(JSON.parse(localStorage.getItem('items')));
    }

    function handleRemove(address) {
        const withoutAddress = escrowAddresses.filter((addr) => addr !== address);
        setEscrowAddresses(withoutAddress);
        localStorage.removeItem('items');
        localStorage.setItem('items', JSON.stringify(withoutAddress));
    }

    return (
        <>
            <div>account: {account}</div>
            <div>accounts: {JSON.stringify(accounts)}</div>
            <div>escrows: {JSON.stringify(escrows)}</div>
            <div>escrowAddresses: {JSON.stringify(escrowAddresses)}</div>

            <div className="contract">
                <h1> New Contract </h1>
                <label>
                    Arbiter Address
                    <input type="text" id="arbiter"/>
                </label>

                <label>
                    Beneficiary Address
                    <input type="text" id="beneficiary"/>
                </label>

                <label>
                    Deposit Amount (in Wei)
                    <input type="text" id="wei"/>
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
                        return <Escrow key={escrow.address} {...escrow} handleRemove={handleRemove} />;
                        // return <li key={escrow.address}>{JSON.stringify(escrow)}</li>
                    })}
                </div>
            </div>

            {/*<div className="existing-contracts">*/}
            {/*  <div id="container">*/}
            {/*    <label>*/}
            {/*      Contract Address*/}
            {/*      <input type="text" id="contractAddr" />*/}
            {/*    </label>*/}
            {/*    <div*/}
            {/*        className="button"*/}
            {/*        id='approve'*/}
            {/*        onClick={()=>{getEscrowDetails(document.getElementById('contractAddr').value)}}*/}
            {/*    >*/}
            {/*      Get Contract*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
        </>
    );
}

export default App;
