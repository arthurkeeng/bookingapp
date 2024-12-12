import {Client, Databases , Account , Storage} from 'node-appwrite'

// admin client
const createAdminClient = async()=>{

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWITE_ENDPOINT) // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)             // Your project ID
    .setKey(process.env.NEXT_APPWRITE_KEY);    
    

    // Your secret API key

    return {
        get account(){
            return new Account(client)
        },
        get databases(){
            return new Databases(client)
        }, 
        get storage(){
            return new Storage(client)
        }
    }
}
const createSessionClient = async(session)=>{
    
const client = new Client()
.setEndpoint(process.env.NEXT_PUBLIC_APPWITE_ENDPOINT) // Your API Endpoint
.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)             // Your project ID
  

if(session){
    client.setSession(session)
}
// Your secret API key

return {
    get account(){
        return new Account(client)
    },
    get databases(){
        return new Databases(client)
    }, 
  
}
}

export {createAdminClient , createSessionClient}