import { propertiesService } from "@/services/linux-properties.service";

export async function gerarReferencia(tipoImovel: string, nomeCondominio: string, funcao: string, transacao: string): Promise<string> {
    const prefixosTipo: Record<string, string> = {
      "Apartamento": "AP",
      "Casa": "CA", 
      "Chácara": "CH",
      "Fazenda": "FA",
      "Galpão": "GA",
      "Ponto Comercial": "PT",
      "Prédio": "PR",
      "Sala": "SA",
      "Terreno": "TE",
    };
  
    const prefixosCondominio: Record<string, string> = {
      "Cond. Alphaville (Caruaru)": "ALP",
      "Cond. Arú Club Residencial": "ARU", 
      "Cond. Bothanic Reserve": "BOT",
      "Cond. Campos do Conde": "CCO",
      "Cond. Estância Dona Dina": "EDD",
      "Cond. Estância Pedra Branca": "EPB",
      "Cond. Monteverde": "MVE",
      "Cond. Oásis Home Park": "OAS",
      "Cond. Parkville Clube": "PAR",
      "Cond. Quintas 3": "QC3",
      "Cond. Quintas da Colina 1": "QC1",
      "Cond. Quintas da Colina 2": "QC2",
      "Cond. Reserva da Serra": "RSE",
      "Cond. Reserva Portugal": "RPO",
      "Cond. Solar da Serra": "SSE",
      "Cond. Tamandaré Country Club": "TAM",
      "Cond. Terras Alpha": "TAL",
    };

    type TransacaoTipo = "Venda" | "Venda Repasse" | "Aluguel" | "Venda/Aluguel";
    
    interface SufixoTransacao {
      [key: string]: {
        [K in TransacaoTipo]?: string;
      };
    }
  
    const sufixos: SufixoTransacao = {
      "Construtora": { "Venda": "-DV", "Venda Repasse": "-DV", "Aluguel": "-DA", "Venda/Aluguel": "-DV" },
      "Dono": { "Venda": "-DV", "Venda Repasse": "-DV", "Aluguel": "-DA", "Venda/Aluguel": "-DV" },
      "Imobiliária": { "Venda": "-PV", "Venda Repasse": "-PV", "Aluguel": "-PA", "Venda/Aluguel": "-PV" },
      "Corretor": { "Venda": "-PV", "Venda Repasse": "-PV", "Aluguel": "-PA", "Venda/Aluguel": "-PV" },
      "Corretor?": { "Venda": "-PV", "Venda Repasse": "-PV", "Aluguel": "-PA", "Venda/Aluguel": "-PV" },
    };


  
    let prefixo = "";
    let sufixo = "";
  
    if (tipoImovel === "Terreno" && nomeCondominio && prefixosCondominio[nomeCondominio]) {
      prefixo = prefixosCondominio[nomeCondominio];
    } else {
      prefixo = prefixosTipo[tipoImovel] || "XX"; // Se não achar, usa "XX"
    }
  
    if (sufixos[funcao] && sufixos[funcao][transacao as TransacaoTipo]) {
      sufixo = sufixos[funcao][transacao as TransacaoTipo] || "";
    }
  
    if (!sufixo) {
      sufixo = "-XX"; // Sufixo padrão se não encontrar
    }
  
    const nextReference = await propertiesService.getNextReference(prefixo);

    // Monta a referência final
    const referencia = `${prefixo}${nextReference.data?.nextReference}${sufixo}`;
  
    return referencia;
  }