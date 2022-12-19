const {Dog, Temperament} = require('../db.js');
const axios = require('axios');
const {KEY_API} = process.env;

const getDogsApi= async ()=>{
    try{
        let array = []
        const apiDogs = await axios.get(`https://api.thedogapi.com/v1/breeds?key=${process.env.KEY_API}`);
        array.push(apiDogs.data);
        // array.flat().length
        const mapDogs = array.flat().map(d=>{
            return{
                id: d.id,
                name: d.name,
                height: d.height.metric,
                weight: d.weight.metric,
                life_span: d.life_span,
                image: d.image.url,
                temperament: d.temperament,
                description: d.description
            }
        })
        return mapDogs;

    }
    catch (e) {
        console.log(" el error esta en getDogsApi",e);
    }
}

const getDb = async()=> {
    try{
        const dbinfo = await Dog.findAll({
            include: [
                {
                model:Temperament,
                attributes:["name"],
                through: { attributes:[]}            
            }        
        ]
        })
        return dbinfo;
    }
    catch(e){
        console.log("Error en getDB",e)
    }
}

const GetAll = async()=> {
    try {
    const apiall = await getDogsApi()
    const dball = await getDb()
    const all= apiall.concat(dball)
    return all;
}
catch(e){
    console.log("Error en GetAll",e)

}
}

const GetDogs = async (req, res, next) =>{
    try{
        const {name} = req.query; 
        const dogs = await GetAll();
        console.log(dogs)
        if(name){
            const dogsName = dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()));
            if(dogsName.length)return res.status(200).send(dogsName)
            return res.status(404).send("algo salio mal en en la busqueda de nombres")
        }
        res.status(200).send(dogs)

    }
    catch(e){
        next(e);
        console.log("Algo salio mal en el getDb")
    }
}


const GetDogsId = async(req, res, next)=>{
    try {
        const { id } = req.params;
        const infoMain = await GetAll();
        if(id){
            let idByApi = infoMain.filter(el => el.id == id);
            idByApi.length ? 
        res.status(200).send(idByApi) :
        res.status(400).send({message: "It was not found"})
        }
    }catch(error) {
        next(error);   
    }

}

const postDogs= async(req,res,next)=>{
    try{
        const {name, img, temperament, height, weight, life_span } = req.body;
        const createDog = await Dog.create({
            name,
            img,
            height,
            weight,
            life_span
        })
        let TemperamentDb = await Temperament.findAll({
            where:{
                name:temperament
            }
        }) 
        createDog.addTemperament(TemperamentDb);
        return res.status(200).send("perro creado con exito")
        console.log(createDog);
    }
    catch(e){
        res.status(404).send("Algo salio mal al cargar perro")
    }
}

const deleteDogs = async function (req,res,next) {
    const {id} = req.params;
    try{
        const dbDog = await Dog.findAll({
            where:{
                id:id
            }
        })
        if(dbDog){
            Dog.destroy({
                where:{
                    id:id
                }
            })
            return res.status(200).send("Dog eliminado con exito");
        }else{
            return res.status(404).send("error al eliminar Dog");
        }
    }
    catch(err){
        next(err);
        console.log(err);
    }
}


module.exports = {
    GetDogs,
    GetDogsId,
    postDogs,
    deleteDogs

};
