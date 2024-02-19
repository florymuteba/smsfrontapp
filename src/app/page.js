'use client'
import React, {useEffect, useState} from 'react'
import { read,utils, writeFileXLSX } from "xlsx";
import {users} from './utils/credens'
import axios from 'axios'
import Link from 'next/link';

export default function Home() {
    const initialFormState={
        numero:"",
        message:""
    }
    const initialFormState1={
        nomuser:"",
        password:""
    }
    const [formData, setFormData] = useState(initialFormState)
    const [formData1, setFormData1]= useState(initialFormState1)
    const [excelData, setExcelData]= useState("")
    const [storeJson, setStoreJson]= useState()
    const [togleInput, setTogleInput]= useState(false)
    const [togleSubmitButton, setTogleSubmintButton]= useState(true)
    const [errormsg, setErrorMsg]= useState("")
    const [successmsg, setSuccessMsg]= useState("")
    const [isloading, setIsLoading]= useState(false)
    const [isLogedin, setIslogedin] = useState(false)



    const prepPhoneNumbersFromJson = (json) => {
        const array = []
        json.forEach(element => {
           array.push(element.telephone) 
        })
        return array
        
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        if(togleInput){

            if(excelData =="" && formData.message == ""){
                 
                setErrorMsg("Veuillez remplir tous les champs!")
            setTimeout(()=>{
                setErrorMsg("")
                setFormData(initialFormState)
            },3000)
                
            }
            else {
            const tab = valideXlsxFile(storeJson)
            if(tab.good.length>0){
                   const obj={
                    destinations:tab.good,
                    text : formData.message 
                }
                const result = await axios.post("https://smsapi.upl-univ.ac/sms", obj)
                    .then((resp)=>{
                        console.log(JSON.stringify(resp.data))
                        setFormData(initialFormState)
                        setSuccessMsg("Message envoyé avec succés")
                        setIslogedin(false)
                        setTimeout(() => {
                           setSuccessMsg("")  
                        }, 3000);
                        
                    })
                    .catch(err=>{
                       console.log(err) 
                       setFormData(initialFormState)
                        setErrorMsg("erreur, contacter l'administrateur du systeme")
                        setIslogedin(false)
                        setTimeout(() => {
                           setErrorMsg("")  
                        }, 3000);
                    })
                
                
    
            }else {
                setErrorMsg("Veuillez saisir un numero de telephone valide!")
            setTimeout(()=>{
                setErrorMsg("")
                setFormData(initialFormState)
            },3000)
            }
            
            }

        }else{
            if(formData.numero=="" && formData.message==""){
                setErrorMsg("Veuillez remplir tous les champs!")
            setTimeout(()=>{
                setErrorMsg("")
                setFormData(initialFormState)
            },3000)
            }
            else {
            const tab = validePhoneNumber(formData.numero)
            if(tab.good.length>0){
                
                const obj={

                    destinations:tab.good,
                    text : formData.message 
                }

                const result = await axios.post("https://smsapi.upl-univ.ac/sms", obj)
                    .then((resp)=>{
                        console.log(JSON.stringify(resp.data))
                        setFormData(initialFormState)
                        setSuccessMsg("Message envoyé avec succés")
                        setIslogedin(false)
                        setTimeout(() => {
                           setSuccessMsg("")  
                        }, 3000);
                        
                    })
                    .catch(err=>{
                        console.log(err) 
                        setFormData(initialFormState)
                        setErrorMsg("erreur, contacter l'administrateur du systeme")
                        setIslogedin(false)
                        setTimeout(() => {
                           setErrorMsg("")  
                        }, 3000);
                        //setIslogedin(false)
                    })/*.finally(()=>{
                        
                    })*/
                        
                    
                
    
            }else {
                 setErrorMsg("format non valide")
                 setFormData(initialFormState)
                        setIslogedin(false)
                        setTimeout(() => {
                           setErrorMsg("")  
                        }, 3000);
            }
            
            }
        }
        
        
    }

    const formatNumber = (stri)=>{
    
        let str = stri.trim()
        if(str.length=="10" && str[0]=="0"){
            const tmptext = str.substr(1)
            const formated_text= '243'+tmptext 
            const final_number = formated_text
            return final_number
        }
        if(str.length=="9" && (str[0]=="9" || str[0]=="8")){
            const formated_text= '243'+str 
            const final_number = formated_text
            return final_number
        }
        if(str.length=="12" && str[0]=="2" && str[1]=="4" && str[2]=="3" ){
            return str
        }
        if(str.length=="13" && str[0]=="+" && str[1]=="2" && str[2]=="4" && str[3]=="3"  ){
            const tmptext = str.substr(1)
            return tmptext
        }
        if(str.length=="14" && str[0]=="0" && str[1]=="0" && str[2]=="2" && str[3]=="4" && str[4]=="3"  ){
            const tmptext = str.substr(2)
            return tmptext
        }
        
        return "123"
    }

    const valideXlsxFile =(tab)=>{
        
        let isvalide=true
        const goodarray = []
        const badarray=[]
        const regex = /^[0-9]+$/ 
        tab.forEach(element => {
            let ele = element.trim()
            if(ele.match(regex)){
                const item = formatNumber(element)
                if(item!="123"){
                    goodarray.push(item)
                }else {
                    badarray.push(item)
                }
            }else{
                
                 if(ele.length=="13" && ele[0]=="+" && ele[1]=="2" && ele[2]=="4" && ele[3]=="3"  ){
                    const tmptext = ele.substr(1)
                    goodarray.push(tmptext) 
                    }
                 else{
                    badarray.push(ele) 
                 }
                
            }
            
        });
        return {
            good: goodarray,
            bad : badarray
            } 
    }

    const validePhoneNumber = (str)=>{
        let isvalide = true
        const regex = /^[0-9]+$/  
        const goodarray =[]
        const badarray = []
        const tab = str.split(",")
        tab.forEach(element => {
            let ele = element.trim()
            if(ele.match(regex)){
                const item = formatNumber(ele)
                if(item!="123"){
                    goodarray.push(item)
                }else {
                    badarray.push(item)
                }
            }else{
                 if(ele.length=="13" && ele[0]=="+" && ele[1]=="2" && ele[2]=="4" && ele[3]=="3"  ){
                    const tmptext = ele.substr(1)
                    goodarray.push(tmptext) 
                    }
                 else{
                    badarray.push(ele) 
                 }
                
            }
        });
        return {
            good: goodarray,
            bad : badarray
            } 
    }

    const updateFormData = (e) => {

        if(togleInput){
            setFormData({  
                ...formData,
                [e.target.name]: e.target.value
            })
    
            if(excelData != "" && formData.message!="") {
                setTogleSubmintButton(false)
            }
            

        }else{
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
    
            if(formData.numero!="" && formData.message!=""){
                setTogleSubmintButton(false)
            }
        }
     
        
    }
    const updateFormData1 = (e)=> {
        
        setFormData1({  
            ...formData1,
            [e.target.name]: e.target.value
        })

    }
    const handleSubmit1 = (e)=>{
        e.preventDefault()
        if(formData1.nomuser=="" || formData1.password==""){
            
            setErrorMsg("Veuillez remplir tout les champs !")
            setTimeout(()=>{
                setErrorMsg("")
                setFormData1(initialFormState1)
                
            },3000)
           /* setFormData1({
                ...formData1,
                nomuser:"",
                password:""
            })*/
        }else{
        let user=[]
        //alert(JSON.stringify(formData1) + "_" + JSON.stringify(users))
        user = users.filter(item=>{
                return item.nom == formData1.nomuser && item.pass == formData1.password
                    
                //return item
            })
        if (user.length>0){
            //alert("perfect match")
            setSuccessMsg("connexion reussie")
            setIslogedin(true)
            setTimeout(()=>{
                setSuccessMsg("")
                setFormData1(initialFormState1)
                
            },3000)
        }else {
            setErrorMsg("le compte utilisateur ou le mot de passe est incorrecte")
            setTimeout(()=>{
                setErrorMsg("")
                setFormData1(initialFormState1)
            },3000)
        }
             //alert("mot de passe érroné")
        
        //alert(JSON.stringify(users[0]))
        //if(formData1.)
        }
    }

    const showHideFileLoader = ()=> {
        setTogleInput(!togleInput)
    }
    const uploadXlsxFile =(e)=> {
        e.preventDefault();
        const value = e.target.value
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            //setExcelData(utils.sheet_to_json(worksheet));
            const json = utils.sheet_to_json(worksheet);
            setExcelData(value)
            const rrr = prepPhoneNumbersFromJson(json)
            alert(rrr)
            setStoreJson(rrr)
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }

    }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center center">
          <div className='min-w-[400px]'>
          <div className='py-3 text-center text-rose-500'> {errormsg}</div>
          <div className='py-3 text-center text-cyan-500'> {successmsg}</div>
                                {isLogedin ? <form method='POST'>
                                    <div className='px-4 py-4 border-4 border-orange-300 rounded-lg'>
                                    { togleInput ? 
                                    
                                    <div className='my-2 py-2'>
                                        <label htmlFor="uploadfile"> <span className='text-rose-700 pt-1'> * </span> Importer un fichier excel </label>
                                        <div>
                                            <div>
                                            <input type="file" id='uploadfile' accept=".xls,.xlsx" name='uploadfile' onChange={e=>uploadXlsxFile(e)} required placeholder='ex:243995464568 ou 0815547832'
                                            className='w-full py-2 px-2 border border-blue-400 rounded-lg bg-white shadow-md focus: outline-none focus:border-2' />
                                            </div>
                                           
                                        </div>
                                        {""&&<span className='px-2 text-[10px] sm:text-[12px] text-rose-700'> Veuillez saisir un numero de téléphone valide, ex : 243995464568 ou 0815547832 </span>}
                                        <div> 
                                            <div> <Link onClick={showHideFileLoader} href='#' className='text-xs px-3 pt-2 text-blue-600'> saisir vos numéros </Link></div>       
                                        </div>
                                    </div>:
                                    <div className='my-2 py-2'>
                                    <label htmlFor="numero"> <span className='text-rose-700 pt-1'> * </span> Numero de télephone </label>
                                    <div>
                                        <div>
                                        <input type="text" id='numero' name='numero' onChange={e=>updateFormData(e)} value={formData.numero}required placeholder='ex:243995464568 ou 0815547832'
                                        className='w-full py-2 px-2 border border-blue-400 rounded-lg shadow-md focus: outline-none focus:border-2' />
                                        </div>
                                       
                                    </div>
                                    {""&&<span className='px-2 text-[10px] sm:text-[12px] text-rose-700'> Veuillez saisir un numero de téléphone valide, ex : 243995464568 ou 0815547832 </span>}
                                    <div> 
                                        <div> <Link onClick={showHideFileLoader} href='#' className='text-xs px-3 pt-2 text-blue-600'> ou importer depuis Excel </Link></div>       
                                    </div>
                                </div>
                                    
                                    }
                                    
                                    <div className='my-2 py-2'>
                                        <label htmlFor="text-area"> <span className='text-rose-700 pt-1'> * </span> Entrez votre message </label>
                                        <div>
                                            <textarea maxLength="160" name='message'id='text-area' value={formData.message} onChange={e=>updateFormData(e)} required placeholder='Votre message ici ...'
                                            className='w-full py-2 px-2 border border-blue-400 rounded-lg shadow-md focus: outline-none focus:border-2' />
                                        </div>
                                    </div>
                                    
                                    <div className='my-5 border-4 border-blue-700 rounded-full'>
                                        {/*<button onClick={handleSubmit} disabled={togleSubmitButton} className={`font-bold text-white shadow-sm text-center w-full py-3 rounded-full ${togleSubmitButton?'bg-gray-500':'bg-blue-500'}`}>*/}
                                        <button onClick={e=>handleSubmit(e)} disabled={togleSubmitButton} className={`font-bold text-white shadow-sm text-center w-full py-3 rounded-full ${togleSubmitButton?'bg-gray-500':'bg-blue-500'}`}>
                                               Envoyez
                                        </button>
                                    </div>
                                    </div> 
                                </form>                                
                                    :
                                    <form method='POST'>
                                    <div className='px-2 py-2 bg-white rounded-lg'>
                                    <div className='my-2 py-2'>
                                        <label htmlFor="nomuser"> <span className='text-rose-700 pt-1'> * </span> nom d'utilisateur : </label>
                                        <div>
                                            <div>
                                                <div>
                                                <input type="text" id="nomuser" name="nomuser" value={formData1.nomuser} onChange={e=>updateFormData1(e)} required placeholder='ex: dupond'
                                                className='w-full py-2 px-2 border border-blue-400 rounded-lg shadow-md focus: outline-none focus:border-2' />
                                                </div>
                                       
                                            </div>
                                        </div>
                                    </div>
                                    <div className='my-2 py-2'>
                                        <label htmlFor="password"> <span className='text-rose-700 pt-1'> * </span> mot de passe </label>
                                        <div>
                                            <div>
                                                <div>
                                                <input type="password" id="password" name="password" value={formData1.password} onChange={e=>updateFormData1(e)} required placeholder='votre mot de passe'
                                                className='w-full py-2 px-2 border border-blue-400 rounded-lg shadow-md focus: outline-none focus:border-2' />
                                                </div>
                                       
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={e=>handleSubmit1(e)} className='font-bold text-white shadow-sm text-center w-full py-3 rounded-full bg-blue-500'>
                                               Envoyez
                                        </button>
                                    </div>
                                    </div>
                                    </form>
                                    


                                }
                                
                                

                            </div>
        </div>
    </>
  )
}
