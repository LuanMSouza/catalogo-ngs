"use client";

import { useEffect, useState } from "react";
import Card from "./componentes/cardProduto";
import axios from "axios";

interface Produto {
  id: number;
  nome: string;
  venda: string;
  foto_url: string;
  disponivel?: boolean;
  estoque: number;
  categoria_nome: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export default function Home() {

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([])
  const [filtro, setFiltro] = useState<string>('')

  const [categoria, setCategoria] = useState<string>('')

  useEffect(() => {
    const filtrados = filtrarProdutos()
    setProdutosFiltrados(filtrados)
  }, [filtro, categoria, produtos])

  useEffect(() => {
    async function carregar() {
      const resposta = await axios.get('https://api.gestao.ngs.dvls.com.br/produtos')
      setProdutos(resposta.data)
    }

    carregar()
  }, [])

  useEffect(() => {
    async function carregarCategorias() {
      const resposta = await axios.get('https://api.gestao.ngs.dvls.com.br/categorias')
      setCategorias(resposta.data)
    }

    carregarCategorias()
  }, [])

  function formatarValor(valor: string | number) {
    const numero = Number(valor);

    if (isNaN(numero)) return "R$ 0,00";

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function filtrarProdutos() {
    return produtos.filter(produto => {
      const matchNome = produto.nome
        .toLowerCase()
        .includes(filtro.toLowerCase())

      const matchCategoria = categoria
        ? produto.categoria_nome.toLowerCase() === categoria.toLowerCase()
        : true

      return matchNome && matchCategoria
    })
  }


  return (
    <>
      <div className="container">
        <h1>Bem vindo ao catálogo da NGS Importados!</h1>

        <div className="filtros">

          <input
            type="text"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Buscar produto..."
          />

          <select
            name="categoria"
            id="categoria"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Todas as categorias</option>

            {categorias.map(cat => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}

          </select>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '32px'
          }}>

          {produtosFiltrados &&
            produtosFiltrados
              .slice() // evitar mutar o array original
              .sort((a, b) => {
                const aDisp = a.estoque > 0 ? 1 : 0
                const bDisp = b.estoque > 0 ? 1 : 0

                return bDisp - aDisp
              })
              .map(produto => {
                if (!produto.foto_url) return null

                const disp = produto.estoque > 0

                return (
                  <Card
                    key={produto.id}
                    produto={{
                      id: produto.id,
                      nome: produto.nome,
                      valor: formatarValor(produto.venda),
                      foto: produto.foto_url,
                      disponivel: disp
                    }}
                  />
                )
              })
          }

        </div>
      </div>

    </>
  );
}
