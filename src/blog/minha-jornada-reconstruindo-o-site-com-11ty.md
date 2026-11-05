---
layout: "layouts/post.njk"
title: "Do Zero ao Blog no Ar: Minha Jornada Reconstruindo o Site com 11ty"
description: "Um relato sobre o processo de recriar meu site pessoal, os desafios enfrentados e o porquê de ter escolhido um gerador de site estático como o 11ty."
thumbnail: "/assets/images/blog/jornada-11ty-thumb.png"
date: 2025-06-20
tags: ["Desenvolvimento Web", "11ty", "Site Estático", "Metodologia"]
---

Se você está lendo isso, seja bem-vindo à nova versão do meu site! O que você vê hoje é o resultado de um processo que começou com uma ideia simples: a necessidade de ter um espaço online que fosse verdadeiramente meu (o que significa que ele não é um primor de front nem receberá prêmios de UX), fácil de manter e que refletisse melhor meu trabalho atual. Este post é a história dessa jornada.

### O Ponto de Partida: Por que um Site Estático?

Meu site antigo cumpria seu papel, mas eu sentia que era hora de uma mudança. Eu queria uma plataforma onde pudesse não só exibir meu portfólio, mas também escrever e compartilhar ideias em um blog.

A decisão de usar um **gerador de site estático** veio de dois lugares: primeiro, uma questão de **praticidade**. Eu não queria a complexidade de gerenciar um banco de dados, atualizações de plugins e as preocupações com segurança que vêm com sistemas mais robustos como o WordPress. Segundo, e sendo sincero, por uma percebida **inabilidade** minha em lidar com o front-end mais complexo que esses sistemas exigem. Eu precisava de algo que me permitisse focar no conteúdo.

Foi aí que, após alguma pesquisa, eu descobri o **11ty (Eleventy)**.

### O que é 11ty e Como Ele Funciona?

Imagine um robô muito eficiente. Você entrega a ele seus textos puros (escritos em Markdown, como este post), um conjunto de "moldes" (templates em HTML) e diz: "combine tudo e construa meu site". É isso que o 11ty faz.

Ele pega suas fontes de conteúdo, as processa através dos seus layouts e gera um conjunto de arquivos HTML, CSS e JavaScript puros. O resultado é um site incrivelmente rápido, seguro (porque não há banco de dados para invadir) e que pode ser hospedado em praticamente qualquer lugar, muitas vezes de graça.

### A Montanha-Russa do Desenvolvimento: Desafios e Aprendizados

Nenhum projeto vem sem seus quebra-cabeças, e este não foi exceção. Cada erro, no entanto, foi uma aula. Durante o processo, passei por alguns desafios que valem a pena compartilhar:

* **O Erro "Cannot GET /portfolio/":** Meu primeiro grande obstáculo. A página principal funcionava, mas a seção de portfólio não abria. Aprendi na prática como o 11ty mapeia os nomes de arquivo para URLs e que um arquivo chamado `index.njk` dentro de uma pasta é a chave para criar a página principal daquela seção.

* **A Saga da "Invalid DateTime":** Quando implementei a listagem do blog, as datas apareciam como "Invalid DateTime". Isso me levou a uma jornada para entender como o 11ty e as bibliotecas de data funcionam. Tentamos usar a biblioteca Luxon, enfrentamos erros com o formato da data no Markdown (`YYYY-MM-DD` é o caminho!) e, finalmente, chegamos a uma solução elegante usando funções nativas do JavaScript (`toLocaleDateString`), que além de resolver o problema, deixou o site mais leve.

* **Conflitos e Páginas em Branco:** Houve momentos em que uma página simplesmente aparecia em branco. Isso me ensinou sobre a importância da variável `{% raw %}{{ content | safe }}{% endraw %}` nos arquivos de layout – a instrução mágica que diz ao 11ty "coloque o conteúdo do meu post bem aqui".

### Os Pontos Positivos e a "Nova Era de Conteúdo"

Apesar dos desafios, o processo foi incrivelmente gratificante. A cada erro solucionado, eu não estava apenas consertando o site, mas entendendo mais profundamente como a ferramenta 11ty funciona. O resultado é um site que eu não apenas uso, mas que eu realmente compreendo.

E a melhor parte? **A praticidade que eu tanto buscava.**

Agora, para escrever um novo post no blog ou adicionar um novo projeto ao portfólio, meu fluxo de trabalho é absurdamente simples:
1.  Abro minha pasta de projetos.
2.  Crio um novo arquivo de texto simples (`.md`).
3.  Escrevo o conteúdo, sem me preocupar com editores complexos ou painéis de administração.
4.  O 11ty automaticamente reconstrói o site com o novo conteúdo.
5. Git commit.

É o poder de criar conteúdo de forma ágil e focada. Espero que essa nova plataforma me permita compartilhar muito mais insights, tutoriais e reflexões com vocês.

O futuro é promissor, e estou ansioso para construir sobre esta nova base, que me permite escrever posts de blog mais rapidamente.