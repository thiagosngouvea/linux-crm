import React, { useState } from "react";
import Image from "next/image";
import { Badge, Modal } from "antd";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/router";
import Link from "next/link";
interface PropertyCardProps {
  images?: string[];
  images_old_links?: string[];
  price?: string;
  transaction?: string;
  bedroom?: number | undefined | null;
  suites?: number | undefined | null;
  garage?: number | undefined | null;
  url?: string;
  reference?: string;
  meta_title?: string;
  id: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  images = [],
  images_old_links = [],
  price,
  transaction,
  bedroom,
  suites,
  garage,
  url,
  reference,  
  meta_title,
  id
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();

  const handlePrevImage = (e:any) => {
    e.preventDefault()
    setCurrentImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const handleNextImage = (e:any) => {
    e.preventDefault()
    setCurrentImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  //refatorar os links das imagens e remover o /{size}/{type}
  const imagesRefactored = images?.map((image) => {
    return image;
  });

  const verificarJson = (json: any) => {
    //verifica se o json é um objeto
    if (typeof json === "object") {
      //verifica se o json é um array
      if (Array.isArray(json)) {
        //verifica se o array é vazio
        if (json.length === 0) {
          return false;
        } else {
          return true;
        }
      } else {
        //verifica se o objeto é vazio
        if (Object.keys(json).length === 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  // const adressFormatted = verificarJson(address) ? JSON.parse(address || "{}") : address;




  const replaceAcessUrl = (url: string, reference: string) => {
    //se o link não tiver / na string adiciona
    if (!url.includes("/")) {
      return `/imovel/${url}/${reference}`;
    } else {
      return `/imovel/${url}`;
    }
  }

  return (
    <>
    <Badge.Ribbon text={<span className="font-medium">{transaction}</span>} color="orange">
      <Link 
        href={`imoveis/editar/${id}`}
        target="_blank"
      >
      <div 
        className="max-w-xs w-96 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer" 
        // onClick={() => router.push(replaceAcessUrl(url || "", reference || ""))}
      >
        <div className="relative h-48">
          <button
            className="z-10 absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-white focus:outline-none"
            onClick={(e) => handlePrevImage(e)}
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            className="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 text-white focus:outline-none"
            onClick={(e) => handleNextImage(e)}
          >
            <IoIosArrowForward size={20} />
          </button>

          <Image
            src={!!imagesRefactored ? imagesRefactored[currentImageIndex] : 'https://via.placeholder.com/300'}
            alt="Property image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 h-36">
          <h1 className="text-sm text-gray-600 font-semibold mb-2 truncate">{meta_title}</h1>
          {/* <h2 className="text-gray-500 text-sm truncate">{adressFormatted?.formatted}</h2> */}
          <span className="text-orange-500 text-xl font-bold truncate">{price}</span>
          <p className="text-gray-500 text-sm truncate">{bedroom ?? null} {bedroom !== null ? bedroom && bedroom > 1 ? 'Quartos' : 'Quarto' : ``} {!!suites ? `${suites > 1  ? `,sendo ${suites} suites` : `,sendo ${suites} suite`}` : ''}</p>
          <p className="text-gray-500 text-sm truncate">{garage ?? null} {garage !== null ? garage && garage > 1 ? 'Garagens' : 'Garagem' : ``}</p>
          {/* <p className="text-gray-500 text-sm truncate">{primary_area?.value} {primary_area?.measure} {`(${primary_area?.title})`}</p> */}
        </div>
      </div>
      </Link>
      {/* <button
            className="z-99 bg-orange-500 text-white w-full py-3 font-semibold focus:outline-none"
            onClick={() => {
              setIsModalVisible(true)
            }}
          >
            Compartilhar
      </button> */}

    </Badge.Ribbon>
    <Modal
      visible={isModalVisible}
      footer={null}
      onCancel={() => {
        setIsModalVisible(false)
      }}
      width={1000}
      centered
    >
      <input
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Insira o número do WhatsApp"
      />
    </Modal>
    </>
  );
};

export default PropertyCard;
