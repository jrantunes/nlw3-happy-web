import L from 'leaflet';

import mapMarkerImg from '../assets/map-marker.svg';

// customizando o icone do mapa
const mapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68], // largura, altura
  iconAnchor: [29, 68], // posição do icon que indica o ponto / x: largura/2 (29) , y: (mais em baixo possível [ponta do icon em cima da coordenada])
  popupAnchor: [0, -60], // posicionando o popup / positivo: baixo|direira / negativo: cima|esquerda // 0px para direira e -60 para baixo
});

export default mapIcon;
