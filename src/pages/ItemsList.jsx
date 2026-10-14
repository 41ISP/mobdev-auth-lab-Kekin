import ItemCard from '../components/ItemCard'
import { useEffect, useState } from 'react'
import { useItemStore } from '../store/useItemStore'
import { api } from "../api/api"

const ItemsList = () => {
    const {items, getItems} = useItemStore()
    const [stats, setStats] = useState(null)

    useEffect(() => {
        getItems()
        const fetchStats = async () => {
            try {
                const data = await api.getStats()
                setStats(data)
            }catch (error) {
                console.error('Ошибка при загрузке статистики:', error)
            }
        }

        fetchStats()
    }, [getItems])

     return (
        <div className="container">
            <div className="page-header">
                <h1>Все товары</h1>
            </div>
            <div className="stats">
                <div className="stat-item">
                    <span>Товаров: {stats?.totalItems ?? 0}</span>
                </div>
                <div className="stat-item">
                    <span>Ставок: {stats?.totalBids ?? 0}</span>
                </div>
                <div className="stat-item">
                    <span>Активных: {stats?.activeItems ?? 0}</span> 
                </div>
                <div className="stat-item">
                    <span>Средняя цена: {stats?.averageItemPrice ?? 0}</span>
                </div>
            </div>

            <div className="items-grid">
                {items.map((item) => (
                    <ItemCard key={item.id} {...item} /> 
                ))}
            </div>
        </div>
    )
}


export default ItemsList
