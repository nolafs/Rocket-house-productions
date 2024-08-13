type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'other';
type Hobby = 'sports' | 'reading' | 'drawing' | 'music' | 'dancing' | 'cooking' | 'video_games' | 'other';
type Superpower =
  | 'flying'
  | 'invisibility'
  | 'super_strength'
  | 'teleportation'
  | 'telekinesis'
  | 'time_travel'
  | 'mind_reading'
  | 'other';

type Animal =
  | 'dog'
  | 'cat'
  | 'fish'
  | 'bird'
  | 'rabbit'
  | 'hamster'
  | 'turtle'
  | 'lizard'
  | 'snake'
  | 'horse'
  | 'guinea pig'
  | 'frog'
  | 'mouse'
  | 'ferret'
  | 'hedgehog'
  | 'chinchilla'
  | 'hermit crab'
  | 'parrot'
  | 'gerbil'
  | 'goat'
  | 'alpaca'
  | 'iguana'
  | 'gecko'
  | 'tarantula'
  | 'scorpion'
  | 'pig'
  | 'cow'
  | 'duck'
  | 'chicken'
  | 'peacock'
  | 'pony'
  | 'lamb'
  | 'raccoon'
  | 'fox'
  | 'owl'
  | 'penguin'
  | 'koala'
  | 'kangaroo'
  | 'sea turtle'
  | 'dolphin'
  | 'whale'
  | 'octopus'
  | 'other';

type Color =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'black'
  | 'white'
  | 'gray'
  | 'brown'
  | 'other';

interface FunNameOptions {
  gender: Gender;
  favoriteAnimal: Animal;
  favoriteSuperpower: Superpower;
  favoriteHobby: Hobby;
  favoriteColor: Color;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const generateFunName = ({
  gender,
  favoriteAnimal,
  favoriteSuperpower,
  favoriteHobby,
  favoriteColor,
}: FunNameOptions) => {
  // Define some prefixes and suffixes for different choices
  const genderPrefix: Record<Gender, string> = {
    male: 'Mighty',
    female: 'Fierce',
    non_binary: 'Epic',
    prefer_not_to_say: 'Enigmatic',
    other: 'Legendary',
  };

  const hobbyPrefix: Record<Hobby, string> = {
    sports: 'Athletic',
    reading: 'Wise',
    drawing: 'Creative',
    music: 'Melodic',
    dancing: 'Groovy',
    cooking: 'MasterChef',
    video_games: 'Pixel',
    other: 'Amazing',
  };

  const superpowerSuffix: Record<Superpower, string> = {
    flying: 'Soaring',
    invisibility: 'Invisible',
    super_strength: 'Strong',
    teleportation: 'Warping',
    telekinesis: 'Mind-Bending',
    time_travel: 'Timeless',
    mind_reading: 'Mindful',
    other: 'Super',
  };

  // Influence the style or personality of the name based on the chosen animal
  const animalInfluence: Record<Animal, string> = {
    dog: 'Inu Samurai', // Dog Samurai
    cat: 'Neko Ninja', // Cat Ninja
    fish: 'Sakana Sensei', // Fish Master
    bird: 'Tori Tengu', // Bird Tengu (a mythical creature)
    rabbit: 'Usagi Ninja', // Rabbit Ninja
    hamster: 'Hamusutā Ronin', // Hamster Ronin (a wandering samurai)
    turtle: 'Kame Sensei', // Turtle Master
    lizard: 'Tokage Shinobi', // Lizard Ninja
    snake: 'Hebi Ronin', // Snake Ronin
    horse: 'Uma Shogun', // Horse General
    'guinea pig': 'Morumotto Samurai', // Guinea Pig Samurai
    frog: 'Kaeru Sensei', // Frog Master
    mouse: 'Nezumi Ninja', // Mouse Ninja
    ferret: 'Itachi Shinobi', // Ferret Ninja
    hedgehog: 'Harinezumi Ninja', // Hedgehog Ninja
    chinchilla: 'Chinchira Shinobi', // Chinchilla Ninja
    'hermit crab': 'Yadokari Ronin', // Hermit Crab Ronin
    parrot: 'Ōmu Sensei', // Parrot Master
    gerbil: 'Jerubiru Ronin', // Gerbil Ronin
    goat: 'Yagi Samurai', // Goat Samurai
    alpaca: 'Arupaka Sensei', // Alpaca Master
    iguana: 'Iguana Sensei', // Iguana Master
    gecko: 'Gekko Ninja', // Gecko Ninja
    tarantula: 'Tarantura Ronin', // Tarantula Ronin
    scorpion: 'Sasori Ronin', // Scorpion Ronin
    pig: 'Buta Sensei', // Pig Master
    cow: 'Ushi Shogun', // Cow General
    duck: 'Ahiru Ninja', // Duck Ninja
    chicken: 'Niwa Tori Sensei', // Chicken Master
    peacock: 'Kujaku Sensei', // Peacock Master
    pony: 'Koguma Shogun', // Pony General
    lamb: 'Kohitsuji Sensei', // Lamb Master
    raccoon: 'Tanuki Shinobi', // Raccoon Ninja
    fox: 'Kitsune Sensei', // Fox Master
    owl: 'Fukurō Sensei', // Owl Master
    penguin: 'Pengin Shogun', // Penguin General
    koala: 'Koara Sensei', // Koala Master
    kangaroo: 'Kangarū Samurai', // Kangaroo Samurai
    'sea turtle': 'Umi Kame Sensei', // Sea Turtle Master
    dolphin: 'Iruka Sensei', // Dolphin Master
    whale: 'Kujira Shogun', // Whale General
    octopus: 'Tako Sensei', // Octopus Master
    other: 'Yōkai', // Mysterious Creature (Yōkai are supernatural beings)
  };

  const colorInfluence: Record<Color, string> = {
    red: 'Bold',
    blue: 'Calm',
    green: 'Vibrant',
    yellow: 'Sunny',
    pink: 'Playful',
    purple: 'Mysterious',
    orange: 'Energetic',
    black: 'Stealthy',
    white: 'Pure',
    gray: 'Balanced',
    brown: 'Earthy',
    other: 'Unique',
  };

  const selectedPrefix = getRandomElement([colorInfluence[favoriteColor], genderPrefix[gender]]);
  const selectedSuffix = getRandomElement([hobbyPrefix[favoriteHobby], superpowerSuffix[favoriteSuperpower]]);

  return `${selectedPrefix} ${animalInfluence[favoriteAnimal]} the ${selectedSuffix}`;
};
