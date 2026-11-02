const formulario = document.querySelector("#formulario");
const botaoAleatorio = document.querySelector("#Aleatorio");
let pokemon = null;
const STAT_MAX = 200; // Status máximo que um pokemon pode ter em um atributo


formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    const nome = document.querySelector("#Buscar").value.trim();
    if (nome) {
        await buscarPokemon(nome);
    } else if (nome === "") {
        let resultado = document.querySelector("#Resultado");
        resultado.innerHTML = `<p class="erro">Digite um nome ou número válido!</p>`;
    }
    limparPesquisa();
});

botaoAleatorio.addEventListener("click", function (event) {
    event.preventDefault();
    buscarPokemon(NumeroAleatorio());
});

function buscarPokemon(nome) {

    nome = String(nome).toLowerCase();

     return fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Pokémon não encontrado");
            }
            console.log(response)
            return response.json();
        })
        .then(data => {
            pokemon = data;
            let resultado = document.querySelector("#Resultado");

            let corTipo = CorTipoDePokemon(data.types[0].type.name);
            document.body.style.setProperty("--cor-tipo", corTipo);

            resultado.innerHTML = `
                    <h2 class="nome">${data.name}</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p class="altura">Altura: ${data.height / 10} m</p>
                    <p class="peso">Peso: ${data.weight / 10} kg</p>
                    <p class="tipo">Tipo: ${data.types.map(type => type.type.name).join(", ")}</p>
                    ${criarStat(data, "hp", "hp", "HP")}
                    ${criarStat(data, "attack", "ataque", "Ataque")}
                    ${criarStat(data, "defense", "defesa", "Defesa")}
                    ${criarStat(data, "speed", "velocidade", "Velocidade")}
                `;
        })
        .catch(error => {
            document.body.style.removeProperty("--cor-tipo");
            let resultado = document.querySelector("#Resultado");
            resultado.innerHTML = `<p class="erro">${error.message}</p>`;
        });
}

function criarStat(data, statApi, classe, rotulo) {
    const valor = data.stats.find(stat => stat.stat.name === statApi).base_stat;
    const porcentagem = Math.min((valor / STAT_MAX) * 100, 100);

    return `
        <div class="stat ${classe}">
            <span class="stat-nome">${rotulo}</span>
            <span class="stat-valor">${valor}</span>
            <div class="barra">
                <div class="barra-preenchida" style="--pct: ${porcentagem}%"></div>
            </div>
        </div>
    `;
}

function limparPesquisa() {
    const campoNome = document.querySelector("#Buscar");
    campoNome.value = "";
}

function CorTipoDePokemon(tipo) {
    const tipos = {
        water: "#6390F0",
        dark: "#705746",
        normal: "#A8A77A",
        fire: "#EE8130",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        steel: "#B7B7CE",
        fairy: "#D685AD",
        ice: "#96D9D6",
        electric: "#F7D000",
        grass: "#7AC74C",
        ghost: "#735797",
        dragon: "#6F35FC",
        fighting: "#C22E2E",
        poison: "#A33EA1",
        bug: "#A8B820",
        rock: "#B6A136"
    }; //array que vai mostrar as cores dos tipos do pokemon, alterando o CSS
    return tipos[tipo] || "#CCCCCC";
}

function NumeroAleatorio() { 
    return Math.floor(Math.random() * 1025) + 1;
} // Gera um número aleatório, porém mantém restrições da quantidade para não dar um resultado maior do que a quantidade de pokemons (sem considerar formas como as mega evoluções)