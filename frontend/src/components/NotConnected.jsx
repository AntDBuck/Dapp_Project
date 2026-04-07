/**
 * NotConnected functional component
 * Displays instructions on how to connect to Dapp.
 * @component
 * @returns {JSX.Element} The rendered NotConnected component.
 */
export default function NotConnected() {
    return (
        <div 
            className="container bg-dark mt-5 py-3 text-light"
            style={{ borderRadius: 20, minHeight: '85vh' }}
        >
            <h1 className="text-primary my-4 text-center">Please Connect Using Ganache And MetaMask</h1>
            <h4 className="text-light text-center">
                Follow the below instructions to connect MetaMask with a local Ganache network:
            </h4>
            <hr />
            <div className='d-flex flex-column align-items-center'>
                <ol className='fs-4'>
                    <li className='mt-3'>
                        Install 
                        <a 
                            href="https://metamask.io/download.html" 
                            rel="noopener noreferrer" 
                            target="_blank" 
                            className="btn btn-outline-light ms-2"
                        >
                            Meta-Mask
                        </a>
                    </li>
                    <li className='mt-3'>Create a MetaMask account and sign in.</li>
                    <li className='mt-3'>
                        Install 
                        <a 
                            href="https://archive.trufflesuite.com/ganache/" 
                            rel="noopener noreferrer" 
                            target="_blank" 
                            className="btn btn-outline-light ms-2"
                        >
                            Ganache
                        </a>
                    </li>
                    <li className='mt-3'>Run Ganache and create a Ganache test network in MetaMask.</li>
                    <li className='mt-3'>Import a Ganache account into your MetaMask.</li>
                    <li className='mt-3'>Connect to the Dapp.</li>
                </ol>
            </div>
            <hr />
        </div>
    );
};