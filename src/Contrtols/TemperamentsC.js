const {Dog, Temperament} = require('../db.js');
const axios = require('axios');
const {KEY_API} = process.env;

const getTemperament = async (req, res, next)=>{
    try{
      
    const resultado = await axios.get(`https://api.thedogapi.com/v1/breeds`);
        // Guardo en lista de temperamentos todos los resultados despues de aplicarle limpieza a cada uno
        const listaTemperamentos = resultado.data.map(dog => {
            // Si no viene un temperamento agrego undefined
            if(!dog.temperament) return dog.temperament = undefined;
            const aux = dog.temperament.split(", "); 
            return aux;
        });
            const limparValoresUndefined = listaTemperamentos.flat().filter(Boolean); 
            // limpio  lo que sea null, undefine sin importar el nivel en el que este en el array
            const valoresUnicos = new Set(limparValoresUndefined);
             // Quito  las repeticiones y solo dejo un valor unico
            const resultadoFinal = [...valoresUnicos]; 
            // hago destructurin del array valores unicos y los guardo en resultadoFinal


     resultadoFinal.forEach(dog => Temperament.findOrCreate({
        where: {
            name: dog
        }
    }))

    const resultado2 = await Temperament.findAll(); //
    res.send(resultado2); 
    }
    catch(e){
        res.status(404).send("Algo salio mal al guardar temperamentos")
        next(e)
        console.log("error al guradar temperamentos")
    }
    //    /otra forma--------------------------------------------------------
        // const resTemperaments = await axios.get(`https://api.thedogapi.com/v1/breeds`)
        // const temperamentResult = resTemperaments.data
        // temperamentResult.forEach(async t =>{
        //     await  Temperament.findOrCreate({
        //         where:{
        //             name: t.name,
        //         }
        //     })
        // })
        // const temperamentsReady = temperamentResult.map(t => {
        //     return{
        //         id: t.id,
        //         name: t.name
        //     }
        // })
        // return res.status(200).send(temperamentsReady)
}

module.exports={
    getTemperament
}