import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getPositionClass = (align) => {
    switch (align) {
        case 'top-left': return 'align-top-left';
        case 'top-right': return 'align-top-right';
        case 'bottom-left': return 'align-bottom-left';
        case 'bottom-right': return 'align-bottom-right';
        case 'center':
        default: return 'align-center';
    }
};

const Home = () => {
    const [home, setHome] = useState({});

    useEffect(() => {
        const fetchHome = async () => {
            const res = await axios.get('http://localhost:5000/home/get-home');
            setHome(res.data);
        };
        fetchHome();
    }, []);

    return (
        <div className="home-container">
            <img src={`http://localhost:5000/uploads/${home.BannerImageURL}`} alt="College Banner"
                style={{ width: '100%', height: '800px', objectFit: 'cover' }} />
                <div className={`banner-overlay ${getPositionClass(home.TextAlign)}`}>
                <h1 className="banner-motto">{home.Motto}</h1>
                <p className="banner-description">{home.Description}</p>
            </div>
        </div>
    );
};

export default Home;



