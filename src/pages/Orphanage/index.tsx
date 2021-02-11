import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiClock, FiInfo } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';

import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import mapIcon from '../../utils/mapIcon';

import {
  Container,
  Content,
  OrphanageDetails,
  Images,
  DetailsContent,
  MapContainer,
  OpenDetails,
} from './styles';

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  images: Array<{
    id: string;
    url: string;
  }>;
  opening_hours: string;
  open_on_weekends: boolean;
}

interface OrphanageParams {
  id: string;
}

const Orphanage: React.FC = () => {
  const { id } = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api
      .get(`http://localhost:3333/orphanages/${id}`)
      .then(response => {
        setOrphanage(response.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!orphanage) {
    return <p>Carregando...</p>;
  }

  console.log(orphanage.open_on_weekends);

  return (
    <Container>
      <Sidebar />

      <Content>
        <OrphanageDetails>
          <img
            src={orphanage.images[activeImageIndex].url}
            alt={orphanage.name}
          />

          <Images>
            {orphanage.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={activeImageIndex === index ? 'active' : ''}
                onClick={() => {
                  setActiveImageIndex(index);
                }}
              >
                <img src={image.url} alt={orphanage.name} />
              </button>
            ))}
          </Images>

          <DetailsContent>
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <MapContainer>
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                />
              </Map>

              <footer>
                {/* Link com origem e destino = https://www.google.com/maps/dir/?api=1&origin=34.1030032,-118.41046840000001&destination=34.059808,-118.368152 */}
                {/* noopener e noreferrer - evita ataques */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Ver rotas no Google Maps
                </a>
              </footer>
            </MapContainer>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <OpenDetails openOnWeekends={orphanage.open_on_weekends}>
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              <div className="open-on-weekends">
                <FiInfo
                  size={32}
                  color={orphanage.open_on_weekends ? '#39CC83' : '#ff669d'}
                />
                {!orphanage.open_on_weekends && 'Não'} Atendemos <br />
                fim de semana
              </div>
            </OpenDetails>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </DetailsContent>
        </OrphanageDetails>
      </Content>
    </Container>
  );
};

export default Orphanage;
