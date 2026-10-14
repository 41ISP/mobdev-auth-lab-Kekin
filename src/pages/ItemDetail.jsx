import { useState, useEffect } from "react"
import {useParams, useNavigate, Link} from 'react-router-dom'
import Input from "../components/Input"
import Button from "../components/Button"
import { useItemStore } from "../store/useItemStore"
import { useUserStore } from "../store/useUserStore"
import { api } from "../api/api"

const ItemDetail = () => {
    const {id } = useParams()
    const navigate = useNavigate()
    const items = useItemStore((state) => state.items)
    const getItems = useItemStore((state) => state.getItems)
    const item = items.find((i) => i.id === Number(id))
    const [error, setError] = useState('')
    const [bids, setBids] = useState([])
    const session = useUserStore((state) => state.session)

    const loadBids = async() => {
        try {
            const data = await api.getItemBids(id)
            setBids(data)
        }catch (error) {
            console.error('Ошибка при загрузке ставко:', error)
        }
    }

    useEffect(() => {
        getItems() 
        loadBids()
    }, [id, getItems])

    if (!item) return <div className="container">Загрузка...</div>

    const handleBid = async(e) => {
        e.preventDefault()
        setError('')
        const form = e.target
        const amount = Number(form.bindInput.value)
        try {
            await api.createdBid( {id, amount})
            form.reset()
            await loadBids()
        }catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка при создании ставки'
            setError(errorMessage)
        }
    }

    const handleDelete = async() => {
        try {
            await api.deleteItems(id)
            await getItems()
            navigate('/')
        }catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Ошибка при удалении товара'
            setError(errorMessage) 
        }
    }

    const isOwner = session?.user?.id === items.userId
    
    return (
        <div className="container">

            <Link to={"/"}>← Вернуться к списку товаров</Link>
            <div class="item-detail">
                <div class="item-header">
                    <div>
                         <img src={ItemShow.imageUrl} class="item-image-large" />
                    </div>

                    <div class="item-info">
                        <span class="item-status">{ItemShow.status}</span>
                            
                        <h1 class="item-title-large">{ItemShow.title}</h1>
                            
                        <div class="item-seller-info">
                            <div class="seller-avatar">TS</div>
                            <div class="seller-details">
                                <div class="seller-name">{ItemShow.username}</div>
                                <div class="seller-date">{ItemShow.createdAt}</div>
                            </div>
                        </div>

                        <div class="item-description-full">
                            {ItemShow.description}
                        </div>

                        <div class="price-section">
                            <div class="starting-price">Начальная цена:</div>
                            <div class="current-price">{ItemShow.price}</div>
                            <div class="highest-bid">Текущая ставка: {ItemShow.highestBid}</div>

                            <form class="bid-form" onSubmit={handleBid}>
                                <Input 
                                    type="number" 
                                    name= "bidInput"
                                    class="bid-input" 
                                    placeholder="Введите вашу ставку (мин. 70 001 ₽)"
                                    min={ItemShow.highestBid}
                                    step="100"
                                />
                                <Button type="submit" class="btn-bid">Сделать ставку</Button>
                            </form>
                        </div>

                    </div>
                </div>

                <div class="bids-section">
                    <div class="bids-header">
                        <h2 class="bids-title">История ставок</h2>
                        <span class="bids-count">5</span>
                </div>

                    <div class="bids-list">
                        <div class="bid-item highest-bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">BB</div>
                                <div class="bid-details">
                                    <span class="bid-username">buyer_best</span>
                                    <span class="bid-time">2 часа назад</span>
                                </div>
                                <span class="highest-badge">🏆 Лидирует</span>
                            </div>
                            <div class="bid-amount">70 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">JD</div>
                                <div class="bid-details">
                                    <span class="bid-username">john_doe</span>
                                    <span class="bid-time">5 часов назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">68 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">AL</div>
                                <div class="bid-details">
                                    <span class="bid-username">alice_tech</span>
                                    <span class="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">67 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">MK</div>
                                <div class="bid-details">
                                    <span class="bid-username">mike_k</span>
                                    <span class="bid-time">1 день назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">66 000 ₽</div>
                        </div>

                        <div class="bid-item">
                            <div class="bid-user">
                                <div class="bid-avatar">ST</div>
                                <div class="bid-details">
                                    <span class="bid-username">sarah_tech</span>
                                    <span class="bid-time">2 дня назад</span>
                                </div>
                            </div>
                            <div class="bid-amount">65 500 ₽</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemDetail
