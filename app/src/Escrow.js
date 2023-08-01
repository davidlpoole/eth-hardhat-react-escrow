export default function Escrow({
                                   address,
                                   sender,
                                   arbiter,
                                   beneficiary,
                                   value,
                                   handleApprove,
                               }) {
    return (
        <div className="existing-contract">
            <ul className="fields">
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
                    <div> {value} </div>
                </li>
                <div
                    className="button"
                    id={address}
                    onClick={(e) => {
                        e.preventDefault();
                        handleApprove();
                    }}
                >
                    Approve
                </div>
            </ul>
        </div>
    );
}
