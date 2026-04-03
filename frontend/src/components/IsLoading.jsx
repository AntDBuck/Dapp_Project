import { Spinner } from "react-bootstrap";

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