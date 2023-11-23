// Import necessary modules and define the function to seed the database
import BirdFamily from '../models/birdFamilyModel.js';
import Bird from '../models/birdModel.js';

const seedDatabase = async () => {
    await BirdFamily.deleteMany();
    await Bird.deleteMany();

    //collection of birds in bird families 
    const parrots = new BirdFamily({
        name: 'Parrots',
        habitat: 'Various',
        diet: 'Seeds and Fruits',
        averageLifespan: 30,
    });
    await parrots.save();

    const eagles = new BirdFamily({
        name: 'Eagles',
        habitat: 'Mountainous',
        diet: 'Fish and Small Mammals',
        averageLifespan: 25,
    });
    await eagles.save();

    const owls = new BirdFamily({
        name: 'Owls',
        habitat: 'Forests',
        diet: 'Rodents and Insects',
        averageLifespan: 15,
    });
    await owls.save();

    const hummingbirds = new BirdFamily({
        name: 'Hummingbirds',
        habitat: 'Gardens',
        diet: 'Nectar and Insects',
        averageLifespan: 5,
    });
    await hummingbirds.save();

    //collection of birds
    //Perrots
    // African Grey Parrot
    await new Bird({
        name: 'African Grey Parrot',
        family: parrots,
        habitat: 'Rainforest',
        diet: 'Seeds',
        averageLifespan: 40,
        imageUrl: 'https://lafeber.com/pet-birds/wp-content/uploads/2013/06/African-Grey-300x300.jpg',
        description: 'The African Grey Parrot (Psittacus erithacus) is an intelligent and highly social bird native to the rainforests of West and Central Africa. Known for its exceptional mimicking abilities, the African Grey is a popular companion parrot. These birds are medium-sized with distinctive gray plumage, a red tail, and a remarkable ability to mimic human speech and other sounds. In the wild, they feed on a varied diet of seeds, fruits, and nuts.',
    }).save();

    // Amazon Parrot
    await new Bird({
        name: 'Amazon Parrot',
        family: parrots,
        habitat: 'Jungle',
        diet: 'Fruits',
        averageLifespan: 50,
        imageUrl: 'https://www.fauna-flora.org/wp-content/uploads/2023/05/Yellow-naped-parrot.-Credit-ondrejprosicky-Adobe-Stock-e1677687037536.jpg',
        description: 'The Amazon Parrot is a vibrant and social bird belonging to the genus Amazona. Native to the jungles of the Americas, these parrots are known for their colorful plumage and engaging personalities. They thrive in social environments and are excellent companions for those who can provide them with mental stimulation and interaction. The Amazon Parrot enjoys a diet rich in fruits and has a lifespan of around 50 years in captivity.',
    }).save();

    // Bald Eagle
    await new Bird({
        name: 'Bald Eagle',
        family: eagles,
        habitat: 'Mountainous regions',
        diet: 'Fish',
        averageLifespan: 20,
        imageUrl: 'https://www.reconnectwithnature.org/getmedia/22dacde8-ea11-4b3d-b9b6-17ad07a12409/bald-eagle-five-things-shutterstock.jpg?width=1500&height=1041&ext=.jpg',
        description: 'The Bald Eagle (Haliaeetus leucocephalus) is a majestic bird of prey and the national symbol of the United States. With its distinctive white head and tail, along with a powerful beak and talons, the Bald Eagle is known for its impressive hunting abilities. These eagles primarily feed on fish and are often found near large bodies of water. They build large nests in tall trees and have a lifespan of around 20 years in the wild.',
    }).save();

    // Golden Eagle
    await new Bird({
        name: 'Golden Eagle',
        family: eagles,
        habitat: 'Mountainous regions',
        diet: 'Small mammals',
        averageLifespan: 25,
        imageUrl: 'https://abcbirds.org/wp-content/uploads/2015/03/Golden-Eagle_Jesus-Giraldo-Gutierrez-Shutterstock.jpg',
        description: 'The Golden Eagle (Aquila chrysaetos) is one of the most widespread and powerful eagles in the Northern Hemisphere. These birds of prey are known for their striking golden-brown plumage and impressive hunting skills. Golden Eagles inhabit mountainous and open terrain, where they prey on small mammals. They are capable of reaching high speeds during their characteristic aerial displays. In the wild, Golden Eagles can live up to 25 years.',
    }).save();

    // Barn Owl
    await new Bird({
        name: 'Barn Owl',
        family: owls,
        habitat: 'Forests',
        diet: 'Rodents',
        averageLifespan: 10,
        imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/help-protect-barn-owls-1610538962.jpg?crop=0.8272222222222222xw:1xh;center,top&resize=1200:*',
        description: 'The Barn Owl (Tyto alba) is a nocturnal bird of prey known for its heart-shaped face and keen hunting abilities. These owls are found in a variety of habitats, including forests, grasslands, and farmlands. Barn Owls primarily feed on rodents, using their exceptional hearing and silent flight to locate and catch their prey. Their distinctive appearance and silent hunting make them fascinating creatures. In the wild, Barn Owls have an average lifespan of about 10 years.',
    }).save();

    // Great Horned Owl
    await new Bird({
        name: 'Great Horned Owl',
        family: owls,
        habitat: 'Forests',
        diet: 'Small Mammals',
        averageLifespan: 15,
        imageUrl: 'https://media.audubon.org/nas_birdapi/a1_6935_1_great-horned-owl_lawrence_miller_adult.jpg',
        description: 'The Great Horned Owl (Bubo virginianus) is a large and powerful owl with distinctive "horns" of feathers on its head. These owls are found throughout the Americas and inhabit a wide range of environments, from forests to urban areas. Great Horned Owls are skilled hunters, preying on a variety of small mammals and birds. Their adaptability and ability to thrive in different habitats make them one of the most widespread owl species. In the wild, they can live up to 15 years.',
    }).save();

    // Ruby-throated Hummingbird
    await new Bird({
        name: 'Ruby-throated Hummingbird',
        family: hummingbirds,
        habitat: 'Gardens',
        diet: 'Nectar',
        averageLifespan: 3,
        imageUrl: 'https://www.perkypet.com/media/Articles/Perky-Pet/Species-Spotlight-Ruby-throated-Hummingbird.jpg',
        description: 'The Ruby-throated Hummingbird (Archilochus colubris) is a small and vibrant hummingbird species native to eastern North America. Named for the brilliant red throat of the male, these hummingbirds are known for their agility and fast-paced wing beats. Ruby-throated Hummingbirds primarily feed on flower nectar, using their specialized bills and long tongues to extract the sweet liquid. Despite their tiny size, they are remarkable migrants, traveling long distances between their breeding and wintering grounds. In the wild, Ruby-throated Hummingbirds have an average lifespan of about 3 to 5 years.',
    }).save();

    // Anna's Hummingbird
    await new Bird({
        name: 'Anna\'s Hummingbird',
        family: hummingbirds,
        habitat: 'Gardens',
        diet: 'Insects',
        averageLifespan: 5,
        imageUrl: 'https://cdn.download.ams.birds.cornell.edu/api/v1/asset/303891401/1800',
        description: 'Anna\'s Hummingbird (Calypte anna) is a small and colorful hummingbird species found along the western coast of North America. Both males and females display vibrant iridescent plumage, and males have a flashy pink crown. Anna\'s Hummingbirds are known for their year-round presence in many areas, with males performing aerial displays to attract mates. They feed on flower nectar and supplement their diet with small insects. In the wild, Anna\'s Hummingbirds have an average lifespan of about 5 years.',
    }).save();

};

export default seedDatabase;
