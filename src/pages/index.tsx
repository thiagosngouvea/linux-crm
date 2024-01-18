import { CardMenu } from '@/components/MenuItem'
import MenuImagem from '@/assets/corretor-de-imoveis.jpg'
import CadastroImagem from '@/assets/cadastro.png'


export default function Home() {
  return (
    <main>
      <div className='flex'>
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
      </div>
    </main>
  )
}
