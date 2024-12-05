import axios from 'axios';

const CAT_API_URL = 'https://api.thecatapi.com/v1';
const HERE_PLACES_API_URL = 'https://discover.search.hereapi.com/v1/discover';
const CAT_API_KEY = 'live_WohsMLTF9hoAAnpPPrJhgAS6DzMCEPoBWvCJubsyKKt9sitkXIvIVJJfvcawCYvl';
const HERE_API_KEY = 'n0h69XAV_cBvZMofM7MfFk4WSAEFFLX38I5E5jYpSDw';

// Interface para os dados de Gato (incluindo raça e detalhes)
export interface Breed {
  id: string;
  name: string;
  temperament: string;
  origin: string;
  life_span: string;
  wikipedia_url: string;
  weight: {
    imperial: string;
    metric: string;
  };
}

export interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: Breed[];  // Agora inclui detalhes sobre a raça
}

// Interface para os dados de Pet Shop
export interface PetShop {
  name: string;
  address: string;
  distance: number;
}

// Instância do axios configurada para a API do The Cat API
export const catApi = axios.create({
  baseURL: CAT_API_URL,
  headers: {
    'x-api-key': CAT_API_KEY,
  },
});

// Função para buscar os gatos
export const fetchCats = async (): Promise<Cat[]> => {
  const response = await axios.get<Cat[]>('https://api.thecatapi.com/v1/images/search', {
    params: { limit: 10, has_breeds: true },  // Ajustado para buscar raças
    headers: {
      'x-api-key': CAT_API_KEY,
    },
  });

  // Exibindo a resposta para debug
  console.log('Dados recebidos da API do Cat:', response.data);

  return response.data;
};

// Função para buscar pet shops próximos
export const fetchPetShops = async (
  latitude: number,
  longitude: number
): Promise<PetShop[]> => {
  const response = await axios.get(HERE_PLACES_API_URL, {
    params: {
      at: `${latitude},${longitude}`,
      q: 'pet shop',
      limit: 10,
      apiKey: HERE_API_KEY,
    },
  });

  console.log('Dados recebidos da API do HERE Places:', response.data.items);

  return response.data.items.map((place: any) => ({
    name: place.title,
    address: place.address.label,
    distance: place.distance,
  }));
};