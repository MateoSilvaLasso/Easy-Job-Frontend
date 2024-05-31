"use client"

import { City } from '@/interfaces/city'
import { Professional } from '@/interfaces/professional'
import { Service } from '@/interfaces/service'
import { Speciality } from '@/interfaces/speciality'
import { authService } from '@/services'
import { Metadata } from 'next'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import '../../home/professionalCard.css'
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { BiDollar } from "react-icons/bi";
import { Review } from '@/interfaces/review'
import ReviewCard from './ReviewCard'
import { Question } from '@/interfaces/question'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IoSend } from "react-icons/io5";
import { FaStar } from 'react-icons/fa';
import { useGlobalContext } from '@/context/store'
import { CreateQuestionDto } from '@/interfaces/create-question.dto'
import { useRouter } from 'next/navigation'

interface Props {
  params: {id: string}
}

function ProfessionalPage( {params}: Props) {

  const router = useRouter();

  //Context data
  const { userIdContext, setUserIdContext, emailContext, setEmailContext , usernameContext, setUsernameContext} = useGlobalContext(); 


  //Fetched data
  const [professional, setProfessional] = useState<Professional>();
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  //Styles
  const [starRating, setStarRating] = useState(""); 

  //Actions
  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [isAddReview, setIsAddReview] = useState(false);


  //Forms

  //Form question
  const [formQuestion, setFormQuestion] = useState('');

  //Form Rating
  const [formsRating, setFormsRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  //Handle submit of forms

  async function handleSubmitQuestion () {
    console.log(formQuestion)
    const question: CreateQuestionDto = {
      title: " ", 
      question_description: formQuestion
    }

    await authService.createQuestion(userIdContext, professional?.id ?? "",  {
      title: " ", 
      question_description: formQuestion
    } );
    router.push(`/professional/${professional?.id}`);
  }
  
  useEffect(() => {

    const fetchData = async () => {
    
    const responseProfessional = await authService.getProfessional(params.id);
    setProfessional(responseProfessional);
    
    const responseServices = await authService.getServicesOfProfessional(params.id);
    setServices(responseServices);
      
    const responseCities = await authService.getCitiesOfProfessional(params.id);
    setCities(responseCities);

    const responseReviews = await authService.getReviewsOfProfessional(params.id);
    setReviews(responseReviews);

    const responseQuestions = await authService.getQuestionsOfProfessional(params.id);
    console.log(responseQuestions)
    setQuestions(responseQuestions);

    const responseSpeciality = await authService.getSpecialitiesOfProfessional(params.id);
    setSpecialities(responseSpeciality);

    const starPercentage = (responseProfessional.score /5) * 100;
    setStarRating(`${Math.round(starPercentage/10) *10}%`);

  }  

  fetchData();
  }, []);


  return (
    <div className='flex'>
      <div className="w-3/5 mr-2">
        <div className="main-professional-card bg-white mb-3 rounded-lg px-8 py-5 shadow-md w-full">
          <div className="flex">
            <div className="photo-container mr-5">
              <Image
              src={professional?.photo_url || ""}
              alt=""  
              width={200}
              height={200}
              className='object-cover w-40 h-40 rounded-md'
              />
            </div>
            <div className="professional-information">
              <h2 className='font-semibold text-2xl mt-3 mb-1'>{professional?.name} {professional?.last_name} </h2>
            
              {specialities.map((speciality) => 
                <p className='font-light text-sm'>{speciality.speciality_name}</p>
              )}

              <div className="flex items-center mb-2">
                <div className='stars-outer'>
                  <div className='stars-inner' style={{width: `${starRating}`}}>
                  ★ ★ ★ ★ ★
                  </div>
                </div>

                <div className="ml-2 text-sm font-light">{`(${professional?.score})`}</div>
              </div>
              <div className="font-light text-sm mb-6">
                {
                  cities.map((city, index) => (
                    index < cities.length-1? (`${city.city_name}, `): (`${city.city_name}`)
                  ))
                }
              </div>
              <div className="flex">
                <button className='bg-blue-500 px-3 py-2 rounded-md text-white text-sm flex items-center mr-3 border-blue-600 border'> <FaRegCalendarAlt className='text-white h-5 w-5 mr-2' /> Agendar cita</button>
                <button className=' border  border-gray-400 px-3 py-1 rounded-md flex items-center p-3 text-gray-500 text-sm'> <MdOutlineMessage className='  text-gray-500 h-5 w-5 mr-2'/> Dejar reseña</button>
              </div>
            </div>
          </div>
          <p className='text-md mt-5 mb-3 font-light'>{professional?.description}</p>
        </div>
        <div className="main-professional-card bg-white mb-3 rounded-lg px-8 py-5 shadow-md w-full">
          <h3 className='font-semibold text-xl' >Servicios y precios</h3>
          <p className='mt-2 text-sm font-light mb-3'>Servicios populares</p>
          <div className="services">
            {
              services.map((service: Service) => (
                <>
                  <li className='flex items-center text-gray-700 mt-2  mb-2'>
                    <div className="flex justify-between w-full">
                      <div className='flex items-center'>
                        <IoIosArrowForward className='text-xs mr-2 font-medium' /> {service.title}
                      </div>
                      <p className=' font-light flex'><BiDollar className='h-6' /> {Math.round(service.price).toLocaleString('es-ES')}</p> 
                    </div>
                  </li>
                  <p className='text-gray-700 text-sm font-light mb-3' style={{ textIndent: "1rem"}}>{service.description}</p>
                  <div className="bg-gray-200" style={{height: "0.5px"}}></div>
                </>
              ))
            }
          </div>
        </div>
        <div className='main-professional-card bg-white mb-3 rounded-lg px-8 pt-5 pb-7 shadow-md w-full'>
          <div className="flex justify-between">
            <h3 className='font-semibold text-xl mb-2' > Preguntas del profesional</h3>
            <button className='text-sm font-normal border px-3 rounded-md border-gray-300' onClick={() => {
              setIsAddQuestion(! isAddQuestion)
            }}>Añadir una pregunta</button>
          </div>

          {
            questions.map((question: Question) => (
              <div className='mb-8'>
                <p className='text-sm font-light mb-1'>{question.client.name} {question.client.last_name}</p>
                <div className='p-2 border-gray-200 border rounded-md'>
                  <p className='text-sm font-light'>{question.question_description}</p>
                  
                </div>
              </div>
            ))
          }
          {isAddQuestion? (
            <>
              <div className="bg-gray-300 mt-4" style={{height: "0.5px"}}></div>
              <div className='mb-3 mt-3'>
                <p className='text-sm font-light mb-1'>{usernameContext}</p>
                <TextField
                  className='mb-3'
                  sx={{width:"100%", '& .MuiInputBase-root': {
                    fontSize: "0.875rem" // Tamaño del texto dentro del input
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: "0.875rem" // Tamaño del texto del label
                  } }}
                  placeholder="Escribe tu pregunta"
                  multiline
                  value={formQuestion}
                  onChange={(e) => {setFormQuestion(e.target.value)}}
                />
                <button className=' w-full bg-blue-500 px-3 py-2 rounded-md text-white text-sm flex items-center justify-center mr-3 border-blue-600 border font-medium' onClick={handleSubmitQuestion} > <IoSend className='mr-2'/> Enviar pregunta</button>
              </div>
            </>
          ): null}
        </div>
        <div className="main-professional-card bg-white mb-3 rounded-lg px-8 py-5 shadow-md w-full">
          <div className="flex justify-between">
            <h3 className='font-semibold text-xl mb-2' >{reviews.length} Opiniones de este profesional</h3>
            <button className='text-sm font-normal border px-3 rounded-md border-gray-300' onClick={
              () => {
                setIsAddReview(!isAddReview)
              }
            }>Añadir una opinion</button>
          </div>

          <div className="items-center mb-5">
            <div className='stars-outer-opinions text-lg'  >
              <div className='stars-inner-opinions text-lg' style={{width: `${starRating}`}} >
                ★ ★ ★ ★ ★
              </div>
            </div>
            <p className='text-sm font-light'>Valoracion global</p>
          </div>

          <h3 className='font-semibold text-lg mb-2'>Opiniones de clientes</h3>
          {
            reviews.map((review: Review) => (
              <>
                <ReviewCard review={review}/>
              </>
            ))
          }

          {isAddReview? (
            <>
              <div className="bg-gray-300 mt-4" style={{height: "0.5px"}}></div>
              <div className='mb-3 mt-3'>
                <p className='text-sm font-light mb-1'>{usernameContext}</p>
                <div className="flex">
                  <div className='mb-3 flex mr-3'>
                    {[...Array(5)].map((star, index) => {

                      const currentRating = index +1;

                      return (
                        <label className='flex'>
                          <input 
                            className='hidden'
                            type="radio"
                            name='rating' 
                            value = {currentRating}
                            onClick={() => setFormsRating(currentRating)}
                          />
                          <FaStar 
                            size={20} 
                            className='cursor-pointer'
                            color={currentRating <= (hover || formsRating)? "#ffc107": "e4e5e9" }
                            onMouseEnter={()=> setHover(currentRating)}
                            onMouseLeave={()=> setHover(0)}
                            /> 
                        </label>
                      )
                    }  )}
                    
                  </div>
                  <p className='font-light text-sm'>( {formsRating}.0 )</p>
                </div>
                <TextField
                  className='mb-3'
                  sx={{width:"100%", '& .MuiInputBase-root': {
                    fontSize: "0.875rem" // Tamaño del texto dentro del input
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: "0.875rem" // Tamaño del texto del label
                  } }}
                  id="outlined-textarea"
                  label=""
                  placeholder="Escribe tu pregunta"
                  multiline
                />
                <button className=' w-full bg-blue-500 px-3 py-2 rounded-md text-white text-sm flex items-center justify-center mr-3 border-blue-600 border font-medium'> <IoSend className='mr-2'/> Enviar pregunta</button>
              </div>
            </>
          ): null}

        </div>
      </div>
      
      <div className="main-professional-card bg-white mb-3 rounded-lg shadow-md w-2/5 ml-2 flex-wrap">
        <div className="bg-blue-500 text-white  rounded-tr-md rounded-tl-md px-3 py-3 text-lg  font-semibold">
          <h3>Agendar Servicio</h3>
        </div>
        <div className="flex  px-8 py-5">

          {/* {JSON.stringify(professional)}
          <br />
          <br />
          {JSON.stringify(services)}
          <br />
          <br />
          {JSON.stringify(specialities)}
          <br />
          <br />
          {JSON.stringify(cities)} */}
          </div>
      </div>
    </div>
  )
}

export default ProfessionalPage