import { useState, useEffect } from "react"
import {Link } from "react-router-dom"
import { api } from "../api/api"

const MyBids = () => {

    const [bids, setBids] = useState([])

    useEffect(() => {
        const fetchBids = async() => {
            try {
                const data = await api.getMyBids()
                setBids(data)
            }catch (error){
                console.error('Ошибка при загрузке  моих ставко:', error)
            }
        }
        fetchBids()
    }, [])

    const winningCount = bids.filter((bid) => bid.isWinning).length
    const totalAmout = bids.reduce((sum, bid) => sum + bid.amount, 0)

    return (
        <div className="container">
            <div class="page-header">
                <h1>Мои ставки</h1>
                <p class="page-subtitle">История ваших ставок на товары</p>
            </div>

            <div class="bids-summary">
                <div class="summary-card">
                    <span class="summary-value">8</span>
                    <span class="summary-label">Всего ставок</span>
                </div>
                <div class="summary-card winning">
                    <span class="summary-value">3</span>
                    <span class="summary-label">Лидирующих ставок</span>
                </div>
                <div class="summary-card">
                    <span class="summary-value">185 000 ₽</span>
                    <span class="summary-label">Общая сумма</span>
                </div>
            </div>

            <div className="bids-list">
                {bids.map((bid) => (
                    <div 
                    key= {bid.id}
                    className={`bid-item ${bid.isWinning ? 'bid-item-winning' : ''}`}>

                    <div class="bid-item-content">
                        <div class="bid-item-header">
                            <Link to={`/items/${bid.itemId}`} class="bid-item-title">
                             {bid-item-title}
                            </Link>
                            {bid.isWinning ? (
                                 <span class="winning-badge">🏆 Лидирую</span>
                            ) : (
                                 <span class="outbid-badge">Перебита</span>
                            )}
                        </div>
                        <div class="bid-item-meta">
                            <span>
                                {new Date(bid.createAt).toLocaleString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                            <span>💰 {bid.amount} ₽</span>
                        </div>
                    </div>

                    <div class="bid-item-amount">
                        <span class="bid-amount">{bid.amount} ₽</span>
                        <span class="bid-status">Моя ставка</span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default MyBids
