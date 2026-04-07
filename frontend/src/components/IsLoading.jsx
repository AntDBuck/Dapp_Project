import { Spinner } from "react-bootstrap";

/**
 * IsLoading functional component.
 * Displays loading spinner and custom message.
 * @param {string} msg A String message next to a spinner.
 * @component
 * @returns {JSX.Element} The rendered IsLoading component.
 */
function IsLoading({ msg }) 
{
    return (
        <div 
            className='d-flex flex-column justify-content-center align-items-center gap-1'
            style={{height: '50vh'}}
        >
            <Spinner animation='border' />
            <h3>{msg}</h3>
        </div>
    )
};

export default IsLoading;