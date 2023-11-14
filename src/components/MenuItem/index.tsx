import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useRouter } from 'next/router'

interface CardMenuProps {
    nome: string;
    descricao: string;
    imagem: any;
    rota: string;
}

export function CardMenu ({ nome, descricao, imagem, rota }: CardMenuProps) {
  
  const router = useRouter()

  return (
    <div className="mx-auto my-8 xl:mx-16 lg:mx-12 md:mx-12  overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800
    transition duration-400 ease-in
    bg-white transform
    hover:-translate-y-1 hover:scale-110 w-80 cursor-pointer"
    onClick={() => router.push(`${rota}`)}
    >
      <Image className="object-cover w-full" src={imagem} alt="avatar" quality={100} width={500}/>

      <div className="py-5 text-center">
        <span className="block text-2xl font-bold text-orange-500 dark:text-white">{nome}</span>
        <span className="text-sm   dark:text-gray-200">{descricao}</span>
      </div>
    </div>
  )
}
