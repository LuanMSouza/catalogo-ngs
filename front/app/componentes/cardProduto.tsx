import './style/cardProduto.css'


interface ProdutoProps {

    produto: {
        id: number
        nome: string
        valor: string
        foto: string
        disponivel: boolean
    }
}

export default function Card({ produto }: ProdutoProps) {
    return (
        <>
            {produto && produto.disponivel ? (
                <div className="card">
                    <img className='foto' src={produto.foto} />
                    <p className='nome'>{produto.nome}</p>
                    <p className='valor'>{produto.valor}</p>
                </div>

            ) : (
                <div className="card indisponivel">
                    <img className='foto' src={produto.foto} style={{ filter: 'grayScale(1)', opacity: '.8' }} />
                    <p className='nome' style={{ filter: 'grayScale(1)', opacity: '.8' }}>{produto.nome}</p>
                    <p className='valor' style={{ filter: 'grayScale(1)', opacity: '.8' }}>{produto.valor}</p>
                    <p style={{
                        position: 'absolute',
                        backgroundColor: 'brown',
                        color: 'white',
                        padding: '10px',
                        width: '80%',
                        textAlign:'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        borderRadius: 10,
                        transform:'rotate(-15deg)'
                    }}>Esgotado</p>
                </div>
            )}

        </>
    )
}