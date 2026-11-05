---
layout: "layouts/post.njk"
title: Geocodificando 180 Mil Alunos - O Poder do Cache e dos Planos B (Parte 2)
tags: [geocodificação, dados, cache, fallback]
description: "Estratégias de resiliência: adicionando um terceiro geocodificador, barra de progresso com tqdm e cache persistente em arquivo."
thumbnail:
date: 2025-11-18
---

No [primeiro post](./geocodificando-180-mil-alunos-parte-1), combinamos Nominatim e OpenCage para obter coordenadas. Mas isso ainda era **ineficiente** para 180 mil alunos.

## Versão 3: Um terceiro geocodificador e barra de progresso

Adicionamos o **GoogleV3** à equação. Verificamos que mesmo com dois serviços de Geolocalização/Geocodificação, existem endereços (especialmente no interior do Estado) que só o Google Maps encontra. Além disso quando o Google Maps não encontra o endereço exato ele retorna geodados aproximados, que no nosso caso já são o suficiente (até mesmo porque até então a alternativa era não ter dado nenhum) e uma **barra de progresso** com `tqdm`.

Mesmo que não mude muita coisa no processo, mas uma barra de status mais funcional ajuda a depurar onde está o erro ou qual o status do script. Via de regra, sempre vou de `tdqm`:

```python
from geopy.geocoders import GoogleV3
from tqdm.notebook import tqdm

geolocator_google = GoogleV3(api_key="CHAVE_DO_GOOGLE")

geolocators = [("Nominatim", geolocator_nominatim), 
               ("OpenCage", geolocator_opencage), 
               ("GoogleV3", geolocator_google)]

for index, row in tqdm(df.iterrows(), total=len(df)):
    for name, locator in geolocators:
        latlon = locator.geocode(row['endereco'])
        if latlon:
            break
```

## Versão 4 e 5: A revolução do cache em arquivo

Terminada a fase de validação da ideia, passei então a rodar o script com os dados completos, pois para fim de teste estava usando uma dataframe reduzida com uma amostra aleatória dos 180 mil estudantes da rede. 

Bom, começando com o mais óbvio: Devido a limitação das APIs gratuitas não seria possível geocodificar todos os alunos de uma vez. Então todos os dados geocodificados do script era "esquecido". A cada execução, ele repetia os mesmos pedidos para as APIs. 

A solução? **Salvar as coordenadas encontradas** num arquivo e **consultá-lo antes** de chamar as APIs:

```python
if os.path.exists("dados_alunos_geocodificados.xlsx"):
    df_cache = pd.read_excel("dados_alunos_geocodificados.xlsx")
    cache = {
        (row['id_aluno'], row['endereco']): (row['LATITUDE'], row['LONGITUDE'])
        for _, row in df_cache.iterrows()
    }
```

Com isso, o script ficou **muito mais eficiente**. Se parássemos no meio, podíamos retomar depois sem perder o que já havia sido feito. O que já era suficiente para terminar a tarefa.

Passaremos agora para melhorias de qualidade de vida e algumas otimizações que foram feitas após os primeiros testes com dados reais.

No próximo post, vamos mostrar como o script ganhou **controle em tempo real** e **cache em memória**.
