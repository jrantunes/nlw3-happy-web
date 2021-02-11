import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import { Container, Content } from './styles';

import LogoImg from '../../assets/logo.svg';

const Landing: React.FC = () => {
  const [location, setLocation] = useState({
    city: '',
    state: '',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`,
        { method: 'GET' },
      ).then(response =>
        response.json().then(data => {
          const { city, state } = data.address;

          setLocation({ city, state });
        }),
      );
    });
  }, []);

  if (location.city === '') {
    return <p>Carregando ...</p>;
  }

  return (
    <Container>
      <Content>
        <img src={LogoImg} alt="logo" />

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>

        <div>
          <strong>{location.city}</strong>
          <span>{location.state}</span>
        </div>

        <Link to="/app">
          {/* Cor preta com 60% de opacidade */}
          <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
        </Link>
      </Content>
    </Container>
  );
};

export default Landing;
