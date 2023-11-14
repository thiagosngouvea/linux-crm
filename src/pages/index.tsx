import { CardMenu } from '@/components/MenuItem'
import MenuImagem from '@/assets/corretor-de-imoveis.jpg'


export default function Home() {
  return (
    <main>
      <div>
        <CardMenu
          nome="Imóveis"
          descricao="Listagem de imóveis"
          imagem={MenuImagem}
          rota="/imoveis"
        />
      </div>
    </main>
  )
}
