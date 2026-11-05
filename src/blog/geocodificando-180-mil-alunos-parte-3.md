---
layout: "layouts/post.njk"
title: Geocodificando 180 Mil Alunos - O Script em Modo Profissional (Parte 3)
tags: [python, automação, geocodificação, caching, flags]
description: "Controle dinâmico com arquivos de flag em tempo de execução e cache em memória para finalizar o pipeline com sucesso."
thumbnail:
date: 2025-11-30
---

Chegamos ao final do processo.

Se você não leu as partes anteriores clique aqui:
No [primeiro post](./geocodificando-180-mil-alunos-parte-1), combinamos Nominatim e OpenCage para obter coordenadas. Mas isso ainda era **ineficiente** para 180 mil alunos.

No [segundo post](./geocodificando-180-mil-alunos-parte-2), adicionamos o GoogleV3 à equação para alguns endereços mais complicados e fizemos uma maneira para salvar esse dados.


Agora depois que já estava testando e salvando os dados para valer, percebemos alguns detalhes que deixamos passar nos testes menores:

Para começar, depois de combinar APIs e usar cache de arquivo, ainda havia um risco: **a cota de uma API acabar durante a execução**.

## Versão 6: Controle dinâmico com arquivos de flag

Criamos um **painel invisível** usando arquivos `.flag` para ativar ou desativar APIs **sem parar o script**:

```python
FLAG_OPEN_CAGE_DISABLE = 'disable_opencage.flag'

def update_geolocators_order_by_flags():
    if os.path.exists(FLAG_OPEN_CAGE_DISABLE):
        use_opencage = False
    else:
        use_opencage = True
```

Como não era necessário fazer nenhum tipo de frontend sofisticado, implementamos uma lógica simples: Se o arquivo estiver presente no diretório raiz, a API é desabilitada. Desta maneira ficou possivel desabilitar o Opencage quando ele atingisse sua cota e usar o Google Maps apenas nos casos mais complicados, pois ele é o serviço mais caro. Lembrando que meu desafio e meta inicial era fazer tudo 100% 0800.



### Cache de Sessão: Evitando repetição no mesmo script

Mesmo com cache de arquivo, alguns endereços apareciam mais de uma vez na mesma execução. Só percebi tarde demais que esses endereços estavam sendo perdidos (e desperdiçando requisições de API). A solução foi o **cache em memória** (sessão):

```python
session_geocoding_cache = {}

if address in session_geocoding_cache:
    return session_geocoding_cache[address]

location = geolocator.geocode(address)
session_geocoding_cache[address] = (location.latitude, location.longitude)
```

## ✅ Resultado final

- 180 mil alunos georreferenciados
- Zero custos.
- Controle dinâmico e reaproveitamento total de dados nas requisições de API.

Essa jornada me ensinou muito sobre desenvolvimento iterativo, automação e criatividade com recursos limitados. Acho que é isso.

devido o código ser muito voltado para a base de dados do Espirito Santo, não faz muito sentido liberar todo o código via Github, no entanto se quiser adaptar esse projeto para sua realidade, entre em contato!

Até a próxima.
