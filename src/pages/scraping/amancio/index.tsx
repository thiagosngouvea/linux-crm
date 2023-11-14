import BackTitle from "@/components/BackTitle";
import React, { useState} from "react";
import { Button, Image, Modal, Table, Tooltip } from "antd";
import { scrapingService } from "@/services/scraping.service";
import { propertiesService } from "@/services/properties.service";
import axios from "axios";


const ScrapingAmancio = React.memo(function ScrapingAmancio() {

    const [amancio, setAmancio] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [exportData, setExportData] = useState<any[]>([]);
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const [images, setImages] = useState([])
    const [descricao, setDescricao] = useState([])
    const [visible, setVisible] = useState(false)
    const [verMais, setVerMais] = useState(false)


    const handleScrapingAmancio = async () => {
        setLoading(true)
        await scrapingService.getScrapingAmancio(1)
          .then(async (response) => {
            const paginas = Math.ceil(response.data.count / 12)
            const promises = []
            for(let i = 1; i <= paginas; i++) {
              promises.push(scrapingService.getScrapingAmancio(i))
            }
            const responses = await Promise.all(promises)
            const dataImoveis = responses.map(response => response.data.data)
            const amancioArray = dataImoveis.flat()
            const amancioArrayReestruturado = amancioArray.map((item) => {
              return {
                area: item?.area[0],
                banheiros: item?.bathrooms[0],
                dormitorios: item?.bedrooms[0],
                garagem: item?.garages[0],
                suites: item?.suites[0],
                preco: item?.sale_price[0],
                status: item?.show_price === "SALE" ? "Venda" : "Aluguel",
                estado: item?.state,
                fotos: item?.photos ? item?.photos.map((item: any) => item?.picture_full) : [],
                bairro: item?.neighborhood,
                cidade: item?.city,
                descricao: item?.listing_description,
                titulo: item?.website_title,
              }
            })
            let exportDados = []
            for (const item of amancioArrayReestruturado) {
              exportDados.push({
                "Título": item?.titulo,
                "Preço": item?.preco,
                "Status": item?.status,
                "Cômodos": `${item?.dormitorios} dormitórios, ${item?.suites} suítes, ${item?.banheiros} banheiros, ${item?.garagem} vagas`,
                "Bairro": item?.bairro,
                "Cidade": item?.cidade,
                "Estado": item?.estado,
                "Área": item?.area,
                "Descrição": item?.descricao,
                "Fotos": item?.fotos,
              })
            }
            setExportData(exportDados)
            setAmancio(amancioArrayReestruturado);
            setLoading(false);
          }).catch((error) => {
            console.log(error)
            setLoading(false)
          })
      }

      //criar uma função que enviar todos os dados para o banco
      const downloadImage = async (fotoLink:any) => {
        try {
          const response = await axios.get(fotoLink, {
            responseType: 'blob',
          });

          //precisa salvar as imagens localmente em pastas diferentes para depois enviar para o servidor
          const reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            console.log(base64data);
          };
          
          // return response.data;

          console.log('Imagem baixada com sucesso', response);

        } catch (error) {
          console.error('Erro ao fazer o download da imagem:', error);
          throw error;
        }
      };
      
      const uploadImage = async (propertyId: any, imageBlob:any) => {
        console.log('Enviando imagem para o servidor...', propertyId);
        try {
          const form = new FormData();
          form.append('image', imageBlob, 'imagem.jpg');
      
          await axios.post(`${process.env.NEXT_PUBLIC_API}properties/images/${propertyId}`, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log('Imagem enviada com sucesso');
        } catch (error) {
          console.error('Erro ao fazer o upload da imagem:', error);
          throw error;
        }
      };
      
      const createProperty = async (item:any) => {
        try {
          const response = await propertiesService.create({
            meta_title: item?.titulo,
            garage: item?.garagem,
            description: item?.descricao,
            price: item?.preco,
            address: `${item?.bairro} - ${item?.cidade}/${item?.estado}`,
            transaction: item?.status?.toUpperCase(),
            areas: item?.area,
            suite: item?.suites,
            bedroom: item?.dormitorios,
            bathroom: item?.banheiros,
          });
          
          return response.data.properties.id;
        } catch (error) {
          console.error('Erro ao criar a propriedade:', error);
          throw error;
        }
      };
      
      const handleSalvarBanco = async () => {
        setExportLoading(true);
        const promises = [];
      
        // Usando slice para pegar os primeiros 5 elementos do array amancio
        const first5Items = amancio.slice(0, 1);
      
        for (const item of first5Items) {
          try {
            const propertyId = await createProperty(item);
      
            const promisesImages = item.fotos.map(async (fotoLink:any) => {
              try {
                console.log('Processando imagem...', fotoLink);
                const imageBlob = await downloadImage(fotoLink);
                await uploadImage(propertyId, imageBlob);
              } catch (error) {
                console.error('Erro no processamento da imagem:', error);
              }
            });
      
            promises.push(Promise.all(promisesImages));
          } catch (error) {
            console.error('Erro no processamento da propriedade:', error);
          }
        }
      
        setExportLoading(false);
      };
      
      
    return (
        <>
            <BackTitle 
                title="Amancio"
            />
            <div
              className="flex justify-between items-center"
            >
              <button 
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
                  onClick={handleScrapingAmancio}
              >Buscar</button>
              <button 
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
                  onClick={handleSalvarBanco}
              >Salvar todos no banco</button>
            </div>
            <Table
        dataSource={amancio}
        columns={[
            {
                title: "Título",
                dataIndex: "titulo",
                key: "titulo",
            },
            {
                title: "Preço",
                dataIndex: "preco",
                key: "preco",
                render: (text) => {
                    return text.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                },
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
            },
            {
                title: "Descrição",
                dataIndex: "descricao",
                key: "descricao",
                render: (text) => {
                    setDescricao(text)
                    return <button onClick={() => setVerMais(true)}><Tooltip title="Clique para ver mais">{text.substring(0, 100) + `...`}</Tooltip></button>;
                },
            },
            {
                title: "Cômodos",
                dataIndex: "comodos",
                key: "comodos",
                render: (text, record) => {
                    return `${record.banheiros} banheiros, ${record.dormitorios} dormitórios, ${record.suites} suítes, ${record.garagem} garagem`;
                },
            },
            {
                title: "Area",
                dataIndex: "area",
                key: "area",
            },
            {
                title: "Bairro",
                dataIndex: "bairro",
                key: "bairro",
            },
            {
                title: "Cidade",
                dataIndex: "cidade",
                key: "cidade",
            },
            {
                title: "Estado",
                dataIndex: "estado",
                key: "estado",
            },
            {
              title: 'Imagens',
              dataIndex: 'fotos',
              key: 'fotos',
              render : (images, record) => {
                return (
                  <button 
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setVisible(true)
                    setImages(images)
                  }}>Ver Imagens</button>
                );
              }
            }
        ]}
        />
        <Modal
        title="Imagens retiradas via web scraping"
        visible={visible}
        width={'80%'}
        onCancel={() => setVisible(false)}
        centered
        footer={
            <button 
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setVisible(false)}>Fechar</button>
        }
      >
            <Image.PreviewGroup>
              {/* <Carousel autoplay infinite={false}> */}
                {images.map((image, index) => (  
                    <Image
                      key={index}
                      width={200}
                      height={120}
                      src={image}
                      alt="foto-imovel"
                    />
                  ))}
              {/* </Carousel> */}
            </Image.PreviewGroup>
      </Modal>
        <Modal
        title="Descrição Completa"
        visible={verMais}
        width={'80%'}
        onCancel={() => setVerMais(false)}
        centered
        footer={
          <Button type="primary" onClick={() => setVerMais(false)}>
            Fechar
          </Button>
        }
      >
        {descricao}
      </Modal>
        </>
    );
});

export default ScrapingAmancio;