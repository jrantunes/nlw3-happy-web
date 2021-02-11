import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet'; // TileLayer - imagens do mapa / Marker - marcador de localização / Popup - elemento que abre ao clicar no icon
import L from 'leaflet';

import api from '../../services/api';

import { Container, SideBar } from './styles';

import mapMarkerImg from '../../assets/map-marker.svg';

// customizando o icone do mapa
const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68], // largura, altura
  iconAnchor: [29, 68], // posição do icon que indica o ponto / x: largura/2 (29) , y: (mais em baixo possível [ponta do icon em cima da coordenada])
  popupAnchor: [170, 2], // posicionando o popup / positivo: baixo|direira / negativo: cima|esquerda // 170px para direira e 2px para baixo
});

interface Orphanage {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const OrphanagesMap: React.FC = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    // USANDO fetch
    // fetch('http://localhost:3333/orphanages', {
    //   method: 'GET',
    // })
    //   .then(response =>
    //     response
    //       .json()
    //       .then(data => console.log(data))
    //       .catch(err => console.log(err)),
    //   )
    //   .catch(err => console.log(err));
    // USANDO axios
    api
      .get('http://localhost:3333/orphanages')
      .then(response => setOrphanages(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Container>
      <SideBar>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Belém</strong>
          <span>Pará</span>
        </footer>
      </SideBar>

      <Map
        center={[-1.3925657, -48.4287712]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> - para o openstreetmap */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {orphanages.map(orphanage => (
          <Marker
            position={[orphanage.latitude, orphanage.longitude]}
            icon={happyMapIcon}
            key={orphanage.id}
          >
            <Popup
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className="map-popup"
            >
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight size={20} color="#fff" />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create">
        <FiPlus size={32} color="#fff" />
      </Link>
    </Container>
  );
};

export default OrphanagesMap;
