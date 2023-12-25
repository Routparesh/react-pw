import { useEffect, useState } from "react";
import './PokemonList.css'

import axios from 'axios';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    let[pokemonList,setPokemonList]= useState([]);
    let[isLodding,setIsLodding]= useState(true);


    async function downloadlist(){
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon');  //this download 20 pokemon list

        const pokemonData = response.data.results;  //we get array of the pokemon from results

        //iterating  over the array of pokemon, and using their url, to create an array of promises
        //that will download these 20 pokemon

        const pokemonResultPromise = pokemonData.map((pokemon)=>(
            axios.get(pokemon.url)
        ))

        //passing that promise array to axios.all
        const pokemondata = await axios.all(pokemonResultPromise);
        console.log(pokemondata)

        //now iterate on the data of each pokemon, and extact id,name,image,type
        const res = pokemondata.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            };
        });
        
        setPokemonList(res)
        console.log(res)
        setIsLodding(false)
    }
    
    
    useEffect(()=>{
        downloadlist();
    },[])
    
        return(
            <div className="pokemon-list-wrapper">
                <div>pokemon list</div>
                {(isLodding)?'Lodding': pokemonList.map((p) => (<Pokemon name={p.name} image={p.image} key={p.id}/>)
                    
                )}
            </div>
        )
    
}


export default PokemonList;