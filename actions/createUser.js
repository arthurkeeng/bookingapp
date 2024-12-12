'use server'


import {createAdminClient} from '@/config/appwrite'

import {ID} from 'node-appwrite'

const createUser = async(previousState , formData) =>{
    const email = formData.get('email')
    const name = formData.get('name')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirm-password')
    if(!email || !password){
        return {
            error : "please fill in required fields"
        }
    }
    if(password.length < 8){
        return {
            error : "password must be atleast 8 characters long"
        }
    }
    if(password != confirmPassword){
        return {
            error : "passwords do not match"
        }
    }
    // get account instance
    const { account } = await createAdminClient()

    try {
        await account.create(
            ID.unique(), email , password , name
        )
        return {
            success : true
        }
    } catch (error) {
        console.log('error' , error)
        return {
            error : "Could not register user"
        }
    }

}
export default createUser