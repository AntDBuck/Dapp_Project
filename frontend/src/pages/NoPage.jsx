import dinoImg from '../assets/no-page-dino.png'

function NoPage()
{
    return (
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <img src={dinoImg} alt='Cartoon T-rex' className='w-25 mt-4' />
            <h2>Oh No!</h2>
            <h3>The page you searched for does not exist.</h3>
            <h3>On the brightside, you got to see this cool dinosaur.</h3>
        </div>
    );
};

export default NoPage;