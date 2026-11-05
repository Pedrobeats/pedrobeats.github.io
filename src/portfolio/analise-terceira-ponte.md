---
layout: "layouts/post.njk"
title: "Análise de Dados sobre o Pedágio da Terceira Ponte"
description: "Webscrapper feito em Python e Dashboard feito no Tableau Public para analisar os dados do pedágio."
date: 2025-06-18
thumbnail: "/assets/images/thumbs/pic03.jpg"
tags: ["Web Scraping", "Python", "Tableau", "Análise de Dados"]
---

Este projeto é uma análise completa dos dados públicos sobre o pedágio da Terceira Ponte, um marco importante aqui em Vila Velha.

O trabalho foi dividido em duas grandes etapas:
1.  **Web Scraping:** Desenvolvimento de um script em Python para extrair automaticamente os dados de fontes online.
2.  **Visualização:** Criação de um dashboard interativo no Tableau Public para apresentar as descobertas de forma visual e intuitiva.

### Link

* **[Veja a Análise no Tableau Public](https://public.tableau.com/views/TerceiraPonte/OpedgiodaTerceiraPonteemNmeros?:language=pt-BR&publish=yes&:display_count=n&:origin=viz_share_link)**
* **[Ver o Código no GitHub](https://github.com/Pedrobeats/Projeto3ponte)**

### Metodologia

Este código é uma ferramenta de web scraping escrita em Python que coleta, processa e limpa dados de tráfego da Terceira Ponte no estado do Espírito Santo, Brasil.

O código usa a biblioteca pandas para gerenciar e manipular os dados coletados, e a biblioteca requests para realizar solicitações HTTP e obter o código-fonte HTML da página de dados abertos do governo do Espírito Santo. A biblioteca BeautifulSoup é usada para fazer o parsing do HTML e encontrar os links de download dos arquivos CSV.

O script passa por três funções principais: pegar_links_csv(), importando_csv_pandas() e data_datetime().

A função pegar_links_csv() usa BeautifulSoup para encontrar os links de download dos arquivos CSV e adicioná-los a uma lista. A função importando_csv_pandas() usa a lista de links para baixar cada arquivo CSV e adicioná-lo a um DataFrame do pandas. A função data_datetime() converte a coluna de data/hora para o tipo de dados datetime do pandas, renomeia algumas colunas e faz outras limpezas nos dados. A função exportar_csv() é responsável por exportar o DataFrame final como um arquivo CSV chamado "dados_3ponte.csv".

No final, o script é executado chamando a função scrapper_3ponte(), que chama as funções acima e salva o arquivo CSV com os dados coletados.

O projeto de DataViz (visualização de dados) feito no Tableau e disponível neste link é uma representação visual dos dados obtidos por meio do código em Python apresentado anteriormente.

A visualização tem como objetivo fornecer uma visão mais clara e acessível dos dados relacionados ao fluxo de veículos na Terceira Ponte, localizada no estado do Espírito Santo. Por meio de gráficos e tabelas interativas, é possível analisar diversos aspectos desse fluxo, como o número de veículos que circulam pela ponte em cada dia da semana, o horário de pico de circulação, a proporção de veículos de cada categoria que trafegam na ponte, entre outros.

Além disso, a visualização permite que o usuário faça suas próprias análises e extraia insights relevantes sobre o fluxo de veículos na Terceira Ponte. Por exemplo, é possível identificar se há um aumento ou diminuição significativa no fluxo de veículos em determinado período do ano, ou se a proporção de veículos de uma determinada categoria mudou ao longo do tempo.

Em resumo, o projeto de DataViz apresentado no Tableau é uma maneira poderosa e eficaz de explorar e visualizar os dados obtidos por meio do código em Python, permitindo uma análise mais profunda e informada do fluxo de veículos na Terceira Ponte.Descreva as bibliotecas Python que você usou para o web scraping (como BeautifulSoup ou Scrapy), como você limpou e tratou os dados e quais foram os principais insights que você descobriu ao visualizar os dados no Tableau.