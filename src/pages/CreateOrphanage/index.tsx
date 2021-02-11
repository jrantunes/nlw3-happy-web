import React, {
  useCallback,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus, FiX } from 'react-icons/fi';
import { LeafletMouseEvent } from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import mapIcon from '../../utils/mapIcon';

import {
  Container,
  Content,
  Form,
  InputBlock,
  ImagesContainer,
} from './styles';

interface Test {
  uniqueName: string;
  file: File;
}

interface PreviewImagesProps {
  url: string;
  name: string;
}

const CreateOrphanage: React.FC = () => {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<Test[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImagesProps[]>([]);

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(location => {
      const { latitude, longitude } = location.coords;

      setCurrentLocation({ latitude, longitude });
    });
  }, []);

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { latitude, longitude } = position;

      const data = new FormData();

      data.append('name', name);
      data.append('about', about);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('open_on_weekends', String(open_on_weekends));

      images.forEach(image => {
        data.append('images', image.file);
      });

      await api.post('/orphanages', data);

      alert('Cadastro realizado com sucesso');

      history.push('/app');
    },
    [
      position,
      name,
      about,
      instructions,
      opening_hours,
      images,
      open_on_weekends,
      history,
    ],
  );

  const handleSelectImages = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const imagesArray = Array.from(event.target.files);

      const selectedImages = imagesArray.map(image => {
        return {
          uniqueName: `${uuidv4()}-${image.name}`,
          file: image,
        };
      });

      setImages([...images, ...selectedImages]);

      console.log(images);

      const selectedImagesPreview = selectedImages.map(image => {
        return { url: URL.createObjectURL(image.file), name: image.uniqueName };
      });

      setPreviewImages([...previewImages, ...selectedImagesPreview]);
      console.log(previewImages);
    },
    [images, previewImages],
  );

  const handleRemoveImage = useCallback(
    (imageName: string) => {
      setPreviewImages(previewImages.filter(image => image.name !== imageName));
      setImages(images.filter(image => image.uniqueName !== imageName));
    },
    [previewImages, images],
  );

  if (currentLocation.latitude === 0) {
    return <p>Carregando ...</p>;
  }

  return (
    <Container>
      <Sidebar />

      <Content>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[currentLocation.latitude, currentLocation.longitude]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <InputBlock>
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="images">Fotos</label>

              <ImagesContainer>
                {previewImages.map(image => (
                  <div key={image.name}>
                    <img src={image.url} alt={name} />
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveImage(image.name);
                      }}
                    >
                      <FiX size={20} color="#ff669d" />
                    </button>
                  </div>
                ))}

                <label htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </ImagesContainer>
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />
            </InputBlock>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <InputBlock>
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </InputBlock>
          </fieldset>

          <button type="submit">Confirmar</button>
        </Form>
      </Content>
    </Container>
  );
};

export default CreateOrphanage;
