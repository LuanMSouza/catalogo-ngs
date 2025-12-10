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
    const filtroLower = filtro?.toLowerCase() ?? ''
    const categoriaLower = categoria?.toLowerCase() ?? ''

    return produtos.filter(produto => {
      const nomeProduto = produto.nome?.toLowerCase() ?? ''
      const categoriaProduto = produto.categoria_nome?.toLowerCase() ?? ''

      const matchNome = nomeProduto.includes(filtroLower)

      const matchCategoria = categoria
        ? categoriaProduto === categoriaLower
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

        <div className="container-produtos">

          {produtosFiltrados && produtosFiltrados.length === 0 && (
            <p style={{ textAlign: 'center', width: '100%' }}>
              Nenhum produto encontrado.
            </p>
          )}

          {produtosFiltrados && produtosFiltrados.length > 0 &&
            produtosFiltrados
              .slice()
              .sort((a, b) => {
                const aDisp = a.estoque > 0 ? 1 : 0
                const bDisp = b.estoque > 0 ? 1 : 0
                return bDisp - aDisp
              })
              .map(produto => {
                if (!produto.foto_url) return null

                return (
                  <Card
                    key={produto.id}
                    produto={{
                      id: produto.id,
                      nome: produto.nome,
                      valor: formatarValor(produto.venda),
                      foto: produto.foto_url,
                      disponivel: produto.estoque > 0
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
