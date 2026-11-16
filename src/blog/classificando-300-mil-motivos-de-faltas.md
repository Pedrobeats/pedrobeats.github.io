---
layout: "layouts/post.njk"
title: "Classificando 300 mil motivos de faltas: Uma jornada entre Regex, Modelos Locais e LLMs"
tags: [python, nlp, machine learning, sedu]
description: "Como sair da força bruta da IA para uma arquitetura híbrida otimizada para processar textos desestruturados na educação pública."
thumbnail:
date: 2026-11-16
---

Se você acompanhou a saga de geocodificação de 180 mil alunos, já sabe que na SEDU-ES nós lidamos com um volume massivo de dados que, muitas vezes, não vêm exatamente "limpos".

Desta vez, o desafio mudou de CEPs para textos livres. Nossa missão: classificar cerca de **300 mil justificativas de faltas escolares** registradas como *"Outros Motivos"*. O problema do campo de texto livre é que você encontra de tudo: desde um claro `"Atestado médico CID J01"` até coisas indecifráveis como `"nan"`, `"estava chovendo muito"` ou siglas internas como `"AJUS"` e `"Busca Ativa"`.

Como transformar esse caos textual em dados estruturados para tomada de decisão? A resposta curta: Inteligência Artificial. A resposta longa (e realista): **Uma arquitetura híbrida** misturando a velha guarda do Regex com o estado da arte dos LLMs.

Acompanhe a evolução dessa solução.

## Tentativa 1: A ilusão do "Joga tudo na IA"

Quando você tem um martelo novo, tudo parece prego. Minha primeira abordagem foi carregar a base e jogar todos os textos únicos para um modelo **Zero-Shot Classification** rodando localmente na GPU (usando o excelente `mDeBERTa-v3-base-mnli-xnli`).

```python
# O canto da sereia: passar tudo para o classificador
classificador = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli", device=0)
resultados = classificador(motivos_para_ia, categorias_ia, batch_size=32)
```

O resultado? Funcionou. Mas a que custo? Processar 30 mil textos únicos puramente por inferência semântica levou quase 15 minutos fritando a GPU do Colab. Além disso, notei um problema clássico: o modelo linguístico é ótimo para semântica geral, mas péssimo para jargões administrativos. Ele não faz ideia de que `"254-R"` significa *"Busca Ativa"* ou que um código de 3 letras e números (`J01`, `Z76`) é o CID de um atestado médico.

Para esses casos, a confiança do modelo caía drasticamente. Precisávamos ser mais espertos.

## Tentativa 2: A redenção do Regex (Arquitetura Híbrida)

Foi então que dei um passo atrás. Por que gastar poder computacional de GPU (e tempo) para descobrir que a palavra `"atestado"` significa *"Médico/Válido"*?

Criei uma camada inicial usando **Expressões Regulares (Regex) vetorizadas no Pandas**. A ideia era simples: filtrar o óbvio e deixar para a IA apenas o que fosse complexo ou ambíguo.

```python
import numpy as np

# Regras claras e rápidas
m_med = df['motivo_clean'].str.contains(r'\b(?:atestado|laudo|cid|ubs|upa|hospital)\b', case=False, regex=True, na=False)
m_busca = df['motivo_clean'].str.contains(r'\b(?:254-r|busca ativa)\b', case=False, regex=True, na=False)
m_ajus = df['motivo_clean'].str.contains(r'\b(?:ajus|022-r)\b', case=False, regex=True, na=False)

condicoes = [m_med, m_busca, m_ajus]
escolhas = ['Médico/Válido', 'Portaria (Busca Ativa)', 'Justificada por Portaria (AJUS)']
df['macrocategoria'] = np.select(condicoes, escolhas, default='Outros Motivos Diversos')
```

O impacto foi absurdo. De quase 300 mil linhas, o **Regex resolveu 288.175 em questão de segundos**. O volume de textos únicos que realmente precisavam de análise semântica caiu de 30 mil para apenas **2.646**.

Agora, o modelo Zero-Shot rodava de forma incrivelmente rápida e focada. Mas, ainda assim, alguns textos ambíguos retornavam com baixa confiança (abaixo de 70%).

## Tentativa 3: A Tríplice Coroa (Regex + Zero-Shot + LLM via API)

Para alcançar a excelência, desenhei um funil de três estágios:

1. **Filtro Grosso:** Regex (Rápido e cirúrgico para padrões conhecidos).
2. **Filtro Médio:** Modelo Local Zero-Shot (Entende o contexto de frases comuns sem custo de API).
3. **Filtro Fino:** Tudo que o Zero-Shot ficasse em dúvida (`confiança < 70%`), seria enviado para um LLM robusto via API comercial (TypeSafe / Jev).

Para garantir que a chamada de API não virasse um gargalo, implementei duas coisas fundamentais: **Multithreading** (para disparar várias requisições simultâneas) e um sistema de **Cache local**, para nunca pagar/esperar duas vezes pela classificação do mesmo texto.

```python
import json
import hashlib
from concurrent.futures import ThreadPoolExecutor
from typesafe_sdk import TypeSafeClient, Choice

# Isolando apenas o que a IA local não conseguiu resolver
residuais = tab.index[tab['macro'] == 'Outros Motivos Diversos (Requer Revisão)'].tolist()
cache = json.loads(ARQUIVO_CACHE.read_text()) if ARQUIVO_CACHE.exists() else {}

def classificar_api(client, texto_norm):
    chave = hashlib.md5(texto_norm.encode()).hexdigest()
    if chave in cache:
        return texto_norm, cache[chave]  # Retorna do cache instantaneamente

    # Se não está no cache, chama a API
    r = client.system_one(
        state={"texto_avaliar": texto_norm},
        questions={
            "classificacao": Choice(
                instructions="Classifique o motivo da falta...",
                criteria=CATEGORIAS_DESC
            )
        }
    )

    # Salva no cache para a próxima vez
    cache[chave] = r.choices["classificacao"].choice
    return texto_norm, cache[chave]

# Multithreading para acelerar chamadas de rede
with TypeSafeClient(model="jev-1.13.0") as client:
    with ThreadPoolExecutor(max_workers=8) as ex:
        resultados = list(ex.map(lambda txt: classificar_api(client, txt), residuais))
```

## O Resultado Final

A base de 300 mil justificativas foi categorizada perfeitamente:

- **~96%** resolvido via expressões regulares em 5 segundos.
- **~3%** resolvido pelo modelo Semântico Zero-Shot (gratuito e local) em poucos minutos.
- **~1%** (os casos bizarros e super complexos) passados por um LLM avançado com alta precisão e baixo custo, amparados por cache e processamento paralelo.

## O que aprendemos?

A grande lição aqui é que **arquitetura de dados importa mais que o modelo em si**. Substituir toda a sua lógica de negócio por chamadas puras a uma API de IA é caro, lento e propenso a erros em regras engessadas do setor público.

Saber orquestrar a velocidade do código legado (Regex) com a inteligência dos modelos locais e o raciocínio avançado dos LLMs modernos é o que realmente diferencia um script de um produto escalável.

E você, já teve que domar alguma base de textos gigantesca? Me conta lá no [GitHub](https://github.com/Pedrobeats)!
