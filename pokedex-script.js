let quantityLoadedPokemon = 0; //1010 aktuelle anzahl der Pokemon im Pokedex
let quantityOfPokemon = quantityLoadedPokemon + 20;
let allPokemon = [];
let allPokemonFixedFirstLetter = [];
let pokemonData = [];
let pokeNameColorID = [];
let pokemonID = 1;
let buttonID = 0;

async function initMain() {
    await loadAllPokemon();
    fixPokemonFirstLetter();
    renderPokemonInfo();
}


async function loadAllPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${quantityOfPokemon}&offset=${quantityLoadedPokemon}`);
        const data = await response.json();
        allPokemon = pokemonNames = data.results.map((pokemon) => pokemon.name); //Filtert die ergebnisse aus der data Variablen nach den Namen und speichert diese in einem neuen Array (allPokemon)
        return;
    } catch (error) {
        console.error("Fehler beim Abrufen der Pokémon-Namen:", error);
        return [];
    }
}


function fixPokemonFirstLetter() {
    for (let k = 0; k < allPokemon.length; k++) {
        let pokemonName = allPokemon[k];

        pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        allPokemonFixedFirstLetter.push(pokemonName);
    }
}


async function renderPokemonInfo() {
    let pokeContainer = document.getElementById('pokemonContainer');

    await pushColorDataToArray();

    for (let j = quantityLoadedPokemon; j < allPokemon.length; j++) {
        let currentPokemon = allPokemon[j];
        let pokeInfo = await getPokemonInfo(currentPokemon);
        let pokeTypeLength = pokeInfo[0];
        let pokeType = pokeInfo[1];
        let pokeImage = pokeInfo[2];

        if (pokeTypeLength == 1) {
            pokeContainer.innerHTML += `
            <div id="pokeInfoCard${j}" class="poke-Info-Card" onclick="clicked(${j + 1})">
                <div class="pokemon-card-header">
                    <div>
                        ${allPokemonFixedFirstLetter[j]}
                    </div>
                    <div>
                        ${j + 1}
                    </div>
                </div>
                <div class="dp-flex-space-between">
                    <div class="pokemon-type-styling max-height">${pokeType}</div>
                    <div class="pokedex-image"><img src=${pokeImage}></div>
                </div>
            </div>
            `;
        } else {
            pokeContainer.innerHTML += `
            <div id="pokeInfoCard${j}" class="poke-Info-Card" onclick="clicked(${j + 1})">
                <div class="pokemon-card-header">
                    <div>
                        ${allPokemonFixedFirstLetter[j]}
                    </div>
                    <div>
                        ${j + 1}
                    </div>
                </div>
                <div class="dp-flex-space-between">
                    <div>
                        <div class="pokemon-type-styling">${pokeType[0]}</div>
                        <div class="pokemon-type-styling">${pokeType[1]}</div>
                    </div>
                    <div class="pokedex-image"><img src=${pokeImage}></div>
                </div>
            </div>
            `;
        }

        let backgroundColor = pokeNameColorID[j];

        switch (backgroundColor['color']) {
            case 'red':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-red');
                break;
            case 'white':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-white');
                break;
            case 'blue':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-blue');
                break;
            case 'yellow':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-yellow');
                break;
            case 'brown':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-brown');
                break;
            case 'green':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-green');
                break;
            case 'black':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-black');
                break;
            case 'gray':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-gray');
                break;
            case 'pink':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-pink');
                break;
            case 'purple':
                document.getElementById(`pokeInfoCard${j}`).classList.add('card-bg-purple');
                break;
            default:
                alert("BGC not found!");
        }
    }
    pokeContainer.innerHTML += `<button id="loadBTN${buttonID}" class="pokedexBTN poke-Info-Card" onclick="buttonClick(${buttonID})">Load more</button>`;
}


function buttonClick(idNr) {
    quantityLoadedPokemon += 20;
    quantityOfPokemon += 20;
    document.getElementById(`loadBTN${idNr}`).classList.add('dp-none');
    buttonID++;
    initMain();
}


async function getPokemonInfo(getCurrentPokemonInfo) {
    await loadPokemonData(getCurrentPokemonInfo);

    let pokeTypeLength = pokemonData['types'].length;
    let pokeImage = pokemonData['sprites']['front_default'];
    let pokeType = [];

    if (pokeTypeLength == 1) {
        pokeType = pokemonData['types'][0]['type']['name'];
        pokeType = pokeType.charAt(0).toUpperCase() + pokeType.slice(1);
        return [pokeTypeLength, pokeType, pokeImage];
    } else {
        let typeOne = pokemonData['types'][0]['type']['name'];
        let typeTwo = pokemonData['types'][1]['type']['name'];
        typeOne = typeOne.charAt(0).toUpperCase() + typeOne.slice(1);
        typeTwo = typeTwo.charAt(0).toUpperCase() + typeTwo.slice(1);
        pokeType.push(typeOne, typeTwo);
        return [pokeTypeLength, pokeType, pokeImage];
    }
}


async function loadPokemonData(currentPokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemonName}`;
    let response = await fetch(url);
    pokemonData = await response.json();
    return;
}


async function pushColorDataToArray() {
    for (let x = 0; x < allPokemon.length; x++) {
        let pokemonName = allPokemon[x];

        for (let s = 1; s < 11; s++) {
            let url = `https://pokeapi.co/api/v2/pokemon-color/${s}/`;
            let colorResponse = await (await fetch(url)).json();
            let colorLength = colorResponse['pokemon_species'].length;

            for (let d = 0; d < colorLength; d++) {
                if (colorResponse['pokemon_species'][d]['name'] == pokemonName) {
                    let dataFeed = {
                        'name': pokemonName,
                        'id': pokemonID,
                        'color': colorResponse['name']
                    };

                    pokeNameColorID.push(dataFeed);
                    pokemonID++;
                }
            }
        }
    }
}


async function clicked(id) {
    document.getElementById('pokemonContainer').classList.add('dp-none');
    document.getElementById('main-headline').classList.add('dp-none');
    document.getElementById('pokedexContainer').classList.remove('dp-none');
    document.getElementById('body').classList.add('bg-white');

    await loadPokemon(id);
}