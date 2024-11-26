import { CardMenu } from '@/components/MenuItem'
import MenuImagem from '@/assets/corretor-de-imoveis.jpg'
import CadastroImagem from '@/assets/cadastro.png'
import AnaliseExcel from '@/assets/analise-excel.png'


export default function Home() {
  
  return (
    <main>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <CardMenu
          nome="Imóveis"
          descricao="Listagem de Imóveis"
          imagem={MenuImagem}
          rota="/imoveis"
        />
        <CardMenu
          nome="Cadastro de Imóveis"
          descricao="Cadastrar um novo imóvel"
          imagem={CadastroImagem}
          rota="/imoveis/cadastro"
        />
        <CardMenu
          nome="Analisar Excel"
          descricao="Analisar planilha com links e preços de imóveis"
          imagem={AnaliseExcel}
          rota="/excel/analise"
        />
        <CardMenu
          nome="Vincular ao Tecimob"
          descricao="Ao vincular, o dispositivo atualmente logado será desconectado."
          imagem={AnaliseExcel}
          rota="/tecimob"
        />
      </div>
    </main>
  )
}
