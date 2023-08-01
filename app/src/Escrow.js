import {ethers} from "ethers";

export default function Escrow({
                                   address,
                                   sender,
                                   arbiter,
                                   beneficiary,
                                   value,
                                   isApproved,
                                   handleApprove,
                                   handleRemove
                               }) {
    return (
        <div className="existing-contract">
            <ul className="fields" key={address}>
                <li>
                    <div> Contract</div>
                    <div> {address} </div>
                </li>
                <li>
                    <div> Sender</div>
                    <div> {sender} </div>
                </li>
                <li>
                    <div> Arbiter</div>
                    <div> {arbiter} </div>
                </li>
                <li>
                    <div> Beneficiary</div>
                    <div> {beneficiary} </div>
                </li>
                <li>
                    <div> Value</div>
                    <div> {ethers.utils.formatUnits(value, "ether")} Ether</div>
                </li>
                <div
                    className={isApproved ? "complete" : "button"}
                    id={address}
                    onClick={(e) => {
                        e.preventDefault();
                        handleApprove();
                    }}
                >
                    {isApproved ? '✓ It\'s been approved!' : 'Approve'}
                </div>
                <div
                    className={"button"}
                    id={address}
                    onClick={(e) => {
                        e.preventDefault();
                        handleRemove(address);
                    }}
                >
                    Remove from list
                </div>
            </ul>
        </div>
    );
}
