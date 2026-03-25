import Hero from "../components/Hero";
import TextImgBlock from "../components/TextImgBlock";
import homePageImg from '../assets/news-img-hero.jpg';

function HomePage()
{
    const p1Text = 'apples are the best kind of oranges';
    const p2Text = 'the moon is larger than ever!';

    return (
        <div>
            <Hero />
            <TextImgBlock 
                bgColor='#fffde0'
                h3Text='Welcome to Jurassic park!' 
                pText={p1Text} 
                imgPath={homePageImg}
                altText=''
            />
            <TextImgBlock 
                bgColor='#d2fff1'
                h3Text='Welcome to block 2!' 
                pText={p2Text} 
                imgPath={homePageImg}
                altText=''
                reverse={true}
            />
        </div>
    );
};

export default HomePage;