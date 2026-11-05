---
layout: "layouts/post.njk"
title: Geocodificando 180 Mil Alunos - A Saga do Endereço ao Ponto no Mapa (Parte 1)
tags: [geocodificação, python, planejamento escolar, dados educacionais]
description: "Como transformamos mais de 180 mil endereços textuais de estudantes em coordenadas geográficas usando apenas ferramentas abertas e gratuitas."
thumbnail:
date: 2025-11-06
---

Olá, pessoal! Bem-vindos ao meu (pelas minhas contas, 7º ou 8º) blog.

Hoje, quero contar o começo de um projeto real que vivemos aqui na Gerência de Planejamento da Secretaria de Educação do Espírito Santo. Nossa missão: transformar o endereço de **mais de 180 mil alunos** em coordenadas geográficas.

## O Desafio: Muito dado, zero orçamento

Para qualquer estudo tecnico realizado — avaliação de contrução ou ampliação de escolas, aquisicão de terrenos, entre outros estudos realizados na GEPLAN — saber onde os alunos moram é essencial. Mas tínhamos um problema: só possuíamos os **endereços textuais**, sem nenhuma coordenada.

E o mais desafiador: por ser um projeto pequeno e independente **não poderiamos gastar nenhum centavo**. Precisávamos usar **apenas ferramentas gratuitas** ou dentro das cotas free das APIs.

## Versão 1: O "Olá, Mundo" da geocodificação

Como nunca tinhamos feito isso antes, começamos com o básico. O [Nominatim](https://nominatim.org/) é um serviço/API, que baseado em OpenStreetMap, foi nosso primeiro passo na geocodificação. Usamos a biblioteca `geopy` com o seguinte esqueleto:

```python
from geopy.geocoders import Nominatim
import pandas as pd
import time

geolocator = Nominatim(user_agent="my_geocoding_script")

def geocode_address(address):
    time.sleep(1)  # Respeitando a política do Nominatim, que autoriza uso ilimitado desde que dentro de 1 requisição por segundo.
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    return None, None
```

Esse script buscava os dados da planilha, construía o endereço completo com `rua`, `número`, `bairro`, `município`, e enviava para o Nominatim. Funcionava... até que não.

O Nominatim é gratuito, mas lento e instável sob carga. Percebi que confiar em um único serviço era **frágil**.

## Versão 2: Fallback com OpenCage

A solução? Um **Plano B**. Se o Nominatim falhasse, tentávamos o [OpenCage](https://opencagedata.com/). O OpenCage é um serviço de API para geocodificação que se destaca por oferecer um plano gratuito generoso. Para usá-lo, é preciso obter uma chave de API em seu site, o opencagedata.com. Ele funciona como uma alternativa rápida e confiável, sendo o "Plano B" ideal em nosso projeto quando o Nominatim falhava:

```python
from geopy.geocoders import OpenCage

geolocator_opencage = OpenCage(api_key="A_CHAVE_QUE_PEGAMOS_NO_SITE")

def geocode_with_fallback(address):
    try:
        return geocode_address(address)
    except:
        return geolocator_opencage.geocode(address)
```

Com isso, o processo ficou mais robusto. Mas ainda não era suficiente para escalar para 180 mil alunos.

No próximo post, vamos ver como o uso de cache mudou tudo.
