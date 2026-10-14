import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from 'react-router-dom'
import Input from "../components/Input"
import Button from "../components/Button"
import { useItemStore } from "../store/useItemStore"
import { useUserStore } from "../store/useUserStore"
import { api } from "../api/api"

const ItemDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const items = useItemStore((state) => state.items)
    const getItems = useItemStore((state) => state.getItems)
    const item = items.find((i) => i.id === Number(id))

    const [error, setError] = useState('')
    const [bids, setBids] = useState([])
    const session = useUserStore((state) => state.session)

    const loadBids = async () => {
        try {
            const data = await api.getItemBids(id)
            setBids(data)
        } catch (error) {
            console.error('Ошибка при загрузке ставок:', error)
        }
    }

    useEffect(() => {
        getItems()
        loadBids()
    }, [id])

    if (!item) return <div className="container">Загрузка...</div>

    const handleBid = async (e) => {
        e.preventDefault()
        setError('')
        const form = e.target
        const amount = Number(form.bidInput.value) 

        try {
            await api.createBid({ id, amount }) 
            form.reset()
            await getItems()
            await loadBids() 
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка при создании ставки'
            setError(errorMessage)
        }
    }

    const handleDelete = async () => {
        try {
            await api.deleteItems(id)
            await getItems()
            navigate('/')
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка при удалении товара'
            setError(errorMessage)
        }
    }

    const isOwner = session?.user?.id === item.userId

    return (
        <div className="container">
            <Link to={"/"}>← Вернуться к списку товаров</Link>

            <div className="item-detail">
                <div className="item-header">
                    <div>
                        <img src={item.imageUrl} className="item-image-large" alt={item.title} />
                    </div>

                    <div className="item-info">
                        <span className="item-status">{item.status}</span>
                        <h1 className="item-title-large">{item.title}</h1>

                        <div className="item-seller-info">
                            <div className="seller-avatar">
                                {item.username ? item.username.slice(0, 2).toUpperCase() : '??'}
                            </div>
                            <div className="seller-details">
                                <div className="seller-name">{item.username}</div>
                                <div className="seller-date">
                                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                                </div>
                            </div>
                        </div>

                        <div className="item-description-full">
                            {item.description}
                        </div>

                        <div className="price-section">
                            <div className="starting-price">Начальная цена: {item.price}</div>
                            <div className="current-price">
                                {item.highestBid ? `Текущая ставка: ${item.highestBid} ₽` : 'Ставок нет'}
                            </div>

                            <form className="bid-form" onSubmit={handleBid}>
                                <Input
                                    type="number"
                                    name="bidInput"
                                    className="bid-input"
                                    placeholder="Введите вашу ставку"
                                    min={item.highestBid ?? item.price}
                                    step="100"
                                    required
                                />
                                <Button type="submit" className="btn-bid">Сделать ставку</Button>
                                {error && <div className="alert alert-error active">{error}</div>}
                            </form>

                            {isOwner && (
                                <Button 
                                    type="button" 
                                    className="btn-delete" 
                                    onClick={handleDelete}
                                >
                                    Удалить товар
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bids-section">
                    <div className="bids-header">
                        <h2 className="bids-title">История ставок</h2>
                        <span className="bids-count">{bids.length}</span>
                    </div>

                    <div className="bids-list">
                        {bids.map((bid, index) => (
                            <div 
                                key={bid.id} 
                                className={`bid-item ${index === 0 ? 'highest-bid-item' : ''}`}
                            >
                                <div className="bid-user">
                                    <div className="bid-avatar">
                                        {bid.username.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="bid-details">
                                        <span className="bid-username">{bid.username}</span>
                                        <span className="bid-time">
                                            {new Date(bid.createdAt).toLocaleString("ru-RU")}
                                        </span>
                                    </div>
                                    {index === 0 && <span className="highest-badge">🏆 Лидирует</span>}
                                </div>
                                <div className="bid-amount">{bid.amount} ₽</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemDetail